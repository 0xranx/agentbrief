import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eject, init, list, show, update, use } from "../index.js";

describe("init", () => {
	let targetDir: string;

	beforeEach(() => {
		targetDir = join(tmpdir(), `agentbrief-init-${Date.now()}-${Math.random().toString(36).slice(2)}`);
	});

	afterEach(async () => {
		await rm(targetDir, { recursive: true, force: true });
	});

	it("should create brief.yaml, personality.md, and knowledge/", async () => {
		await init({ name: "my-brief", dir: targetDir });

		expect(existsSync(join(targetDir, "brief.yaml"))).toBe(true);
		expect(existsSync(join(targetDir, "personality.md"))).toBe(true);
		expect(existsSync(join(targetDir, "knowledge"))).toBe(true);

		const spec = await readFile(join(targetDir, "brief.yaml"), "utf-8");
		expect(spec).toContain("name: my-brief");
		expect(spec).toContain("version: 0.1.0");
	});

	it("should scaffold from template when --template is given", async () => {
		await init({ name: "my-sec", dir: targetDir, template: "security" });

		expect(existsSync(join(targetDir, "brief.yaml"))).toBe(true);
		expect(existsSync(join(targetDir, "personality.md"))).toBe(true);

		const spec = await readFile(join(targetDir, "brief.yaml"), "utf-8");
		expect(spec).toContain("name: my-sec");

		const personality = await readFile(join(targetDir, "personality.md"), "utf-8");
		expect(personality).toContain("security auditor");
	});

	it("should throw for non-existent template", async () => {
		await expect(init({ name: "x", dir: targetDir, template: "nonexistent" })).rejects.toThrow(
			'Template "nonexistent" not found',
		);
	});
});

describe("use + eject round-trip", () => {
	let briefDir: string;
	let projectDir: string;

	beforeEach(async () => {
		const base = join(tmpdir(), `agentbrief-use-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		briefDir = join(base, "brief");
		projectDir = join(base, "project");
		await mkdir(briefDir, { recursive: true });
		await mkdir(projectDir, { recursive: true });

		// Create a minimal brief
		await writeFile(
			join(briefDir, "brief.yaml"),
			'name: test-role\nversion: "1.0.0"\ndescription: Test role\nknowledge:\n  - docs.md\n',
			"utf-8",
		);
		await writeFile(join(briefDir, "personality.md"), "## Role\n\nYou are a test agent.\n", "utf-8");
		await writeFile(join(briefDir, "docs.md"), "# Domain Knowledge\n\nSome facts.\n", "utf-8");
	});

	afterEach(async () => {
		const base = join(briefDir, "..");
		await rm(base, { recursive: true, force: true });
	});

	it("should apply a brief and create engine files", async () => {
		const result = await use({ source: briefDir, projectDir });

		expect(result.name).toBe("test-role");
		expect(result.version).toBe("1.0.0");
		expect(result.files).toContain("CLAUDE.md");

		// Check CLAUDE.md content
		const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
		expect(claude).toContain("AgentBrief: test-role");
		expect(claude).toContain("You are a test agent.");
		expect(claude).toContain("agentbrief:test-role:start");
	});

	it("should copy knowledge files", async () => {
		await use({ source: briefDir, projectDir });

		const knowledgePath = join(projectDir, ".agentbrief", "test-role", "knowledge", "docs.md");
		expect(existsSync(knowledgePath)).toBe(true);
		const content = await readFile(knowledgePath, "utf-8");
		expect(content).toContain("Domain Knowledge");
	});

	it("should write lock.yaml", async () => {
		await use({ source: briefDir, projectDir });
		const entries = await list(projectDir);
		expect(entries).toHaveLength(1);
		expect(entries[0].name).toBe("test-role");
		expect(entries[0].version).toBe("1.0.0");
	});

	it("should inject different content per engine file", async () => {
		await use({ source: briefDir, projectDir });

		const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
		const cursor = await readFile(join(projectDir, ".cursorrules"), "utf-8");
		const agents = await readFile(join(projectDir, "AGENTS.md"), "utf-8");

		// Claude Code (full): has "do not edit" notice and full "Reference Knowledge" section
		expect(claude).toContain("Do not edit this section manually");
		expect(claude).toContain("## Reference Knowledge");
		expect(claude).toContain("The following domain knowledge files are available");

		// Cursor (minimal): short header, no knowledge section
		expect(cursor).toContain("# test-role");
		expect(cursor).not.toContain("# AgentBrief:");
		expect(cursor).not.toContain("Knowledge");
		expect(cursor).not.toContain("Do not edit");

		// AGENTS.md (concise): has AgentBrief header but compact knowledge
		expect(agents).toContain("# AgentBrief: test-role");
		expect(agents).toContain("## Knowledge");
		expect(agents).not.toContain("The following domain knowledge files are available");
		expect(agents).not.toContain("Do not edit");
	});

	it("should eject cleanly", async () => {
		await use({ source: briefDir, projectDir });
		const result = await eject("test-role", projectDir);

		expect(result.files).toContain("CLAUDE.md");

		// Engine file should be clean
		const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
		expect(claude).not.toContain("test-role");

		// Knowledge should be removed
		expect(existsSync(join(projectDir, ".agentbrief", "test-role"))).toBe(false);

		// Lock should be empty
		const entries = await list(projectDir);
		expect(entries).toHaveLength(0);
	});

	it("show() should return injected content", async () => {
		await use({ source: briefDir, projectDir });
		const content = await show("test-role", projectDir);
		expect(content).toBeTruthy();
		expect(content).toContain("AgentBrief: test-role");
		expect(content).toContain("You are a test agent.");
	});

	it("show() should return null for non-existent brief", async () => {
		const content = await show("nonexistent", projectDir);
		expect(content).toBeNull();
	});

	it("update() should re-apply existing briefs", async () => {
		await use({ source: briefDir, projectDir });

		// Modify personality
		await writeFile(join(briefDir, "personality.md"), "## Role\n\nUpdated agent.\n", "utf-8");

		const results = await update({ projectDir });
		expect(results).toHaveLength(1);
		expect(results[0].name).toBe("test-role");

		const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
		expect(claude).toContain("Updated agent.");
	});

	it("use() should return description and counts", async () => {
		const result = await use({ source: briefDir, projectDir });
		expect(result.description).toBe("Test role");
		expect(result.knowledgeCount).toBe(1);
		expect(result.skillsCount).toBe(0);
	});
});
