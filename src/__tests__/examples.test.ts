import { existsSync } from "node:fs";
import { mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eject, list, use } from "../index.js";

const EXAMPLES_DIR = resolve(import.meta.dirname, "../../examples");

describe("examples/security-auditor", () => {
	const briefDir = join(EXAMPLES_DIR, "security-auditor");
	let projectDir: string;

	beforeEach(async () => {
		projectDir = join(tmpdir(), `agentbrief-example-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		await mkdir(projectDir, { recursive: true });
	});

	afterEach(async () => {
		await rm(projectDir, { recursive: true, force: true });
	});

	it("should have valid brief structure", () => {
		expect(existsSync(join(briefDir, "brief.yaml"))).toBe(true);
		expect(existsSync(join(briefDir, "personality.md"))).toBe(true);
		expect(existsSync(join(briefDir, "knowledge", "owasp-cheatsheet.md"))).toBe(true);
	});

	it("should apply successfully and inject into all engine files", async () => {
		const result = await use({ source: briefDir, projectDir });

		expect(result.name).toBe("security-auditor");
		expect(result.version).toBe("1.0.0");
		expect(result.files).toContain("CLAUDE.md");
		expect(result.files).toContain(".cursorrules");
		expect(result.files).toContain("AGENTS.md");
	});

	it("CLAUDE.md should have full content with OWASP references", async () => {
		await use({ source: briefDir, projectDir });
		const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");

		// Full header
		expect(claude).toContain("# AgentBrief: security-auditor");
		expect(claude).toContain("Do not edit this section manually");

		// Personality (concise identity card)
		expect(claude).toContain("You are a senior application security auditor");
		expect(claude).toContain("Do not soften critical findings");
		expect(claude).toContain("- Every finding must reference a CWE identifier");

		// Knowledge and Skills sections
		expect(claude).toContain("## Reference Knowledge");
		expect(claude).toContain("knowledge/");
		expect(claude).toContain("## Skills");
		expect(claude).toContain("follow its instructions step by step");
	});

	it(".cursorrules should have condensed content", async () => {
		await use({ source: briefDir, projectDir });
		const cursor = await readFile(join(projectDir, ".cursorrules"), "utf-8");

		// Short header
		expect(cursor).toContain("# security-auditor");
		expect(cursor).not.toContain("# AgentBrief:");

		// Headings + lists preserved
		expect(cursor).toContain("## Role");
		expect(cursor).toContain("## Constraints");
		expect(cursor).toContain("- Never approve code containing known injection vectors");

		// Prose dropped
		expect(cursor).not.toContain("You are a senior application security auditor");
		expect(cursor).not.toContain("Do not soften critical findings");

		// No knowledge or scale
		expect(cursor).not.toContain("Knowledge");
		expect(cursor).not.toContain("timeout");
	});

	it("AGENTS.md should have concise content", async () => {
		await use({ source: briefDir, projectDir });
		const agents = await readFile(join(projectDir, "AGENTS.md"), "utf-8");

		// Header with description, no "do not edit"
		expect(agents).toContain("# AgentBrief: security-auditor");
		expect(agents).not.toContain("Do not edit");

		// Personality moderated — first sentence kept
		expect(agents).toContain("You are a senior application security auditor.");

		// Compact knowledge
		expect(agents).toContain("## Knowledge");
		expect(agents).not.toContain("The following domain knowledge files are available");
	});

	it("should copy knowledge files", async () => {
		await use({ source: briefDir, projectDir });
		const knowledgePath = join(
			projectDir,
			".agentbrief",
			"security-auditor",
			"knowledge",
			"knowledge",
			"owasp-cheatsheet.md",
		);
		expect(existsSync(knowledgePath)).toBe(true);
		const content = await readFile(knowledgePath, "utf-8");
		expect(content).toContain("OWASP Top 10");
		expect(content).toContain("A01: Broken Access Control");
	});

	it("should eject cleanly from all engine files", async () => {
		await use({ source: briefDir, projectDir });
		await eject("security-auditor", projectDir);

		for (const file of ["CLAUDE.md", ".cursorrules", "AGENTS.md"]) {
			const content = await readFile(join(projectDir, file), "utf-8");
			expect(content).not.toContain("security-auditor");
		}

		expect(existsSync(join(projectDir, ".agentbrief", "security-auditor"))).toBe(false);
		const entries = await list(projectDir);
		expect(entries).toHaveLength(0);
	});
});
