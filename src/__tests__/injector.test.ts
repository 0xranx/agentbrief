import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eject, inject } from "../injector.js";

describe("injector", () => {
	let projectDir: string;

	beforeEach(async () => {
		projectDir = join(tmpdir(), `agentbrief-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		await mkdir(projectDir, { recursive: true });
	});

	afterEach(async () => {
		await rm(projectDir, { recursive: true, force: true });
	});

	describe("inject", () => {
		it("should create engine files with wrapped content", async () => {
			const files = await inject({ projectDir, briefName: "test", content: "Hello Agent" });

			expect(files).toContain("CLAUDE.md");
			expect(files).toContain(".cursorrules");
			expect(files).toContain("AGENTS.md");

			const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			expect(claude).toContain("<!-- agentbrief:test:start -->");
			expect(claude).toContain("Hello Agent");
			expect(claude).toContain("<!-- agentbrief:test:end -->");
		});

		it("should append to existing file content", async () => {
			await writeFile(join(projectDir, "CLAUDE.md"), "# My Project\n\nExisting content.\n", "utf-8");

			await inject({ projectDir, briefName: "test", content: "Injected content" });

			const result = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			expect(result).toContain("# My Project");
			expect(result).toContain("Existing content.");
			expect(result).toContain("Injected content");
		});

		it("should replace existing injection on re-apply", async () => {
			await inject({ projectDir, briefName: "test", content: "Version 1" });
			await inject({ projectDir, briefName: "test", content: "Version 2" });

			const result = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			expect(result).not.toContain("Version 1");
			expect(result).toContain("Version 2");
			// Should only have one start marker
			const starts = result.match(/agentbrief:test:start/g);
			expect(starts).toHaveLength(1);
		});

		it("should support multiple briefs in one file", async () => {
			await inject({ projectDir, briefName: "brief-a", content: "Content A" });
			await inject({ projectDir, briefName: "brief-b", content: "Content B" });

			const result = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			expect(result).toContain("Content A");
			expect(result).toContain("Content B");
			expect(result).toContain("agentbrief:brief-a:start");
			expect(result).toContain("agentbrief:brief-b:start");
		});

		it("should inject different content per engine file when given a Record", async () => {
			const content: Record<string, string> = {
				"CLAUDE.md": "Full Claude content",
				".cursorrules": "Minimal Cursor content",
				"AGENTS.md": "Concise AGENTS content",
			};
			await inject({ projectDir, briefName: "test", content });

			const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			const cursor = await readFile(join(projectDir, ".cursorrules"), "utf-8");
			const agents = await readFile(join(projectDir, "AGENTS.md"), "utf-8");

			expect(claude).toContain("Full Claude content");
			expect(claude).not.toContain("Minimal Cursor content");

			expect(cursor).toContain("Minimal Cursor content");
			expect(cursor).not.toContain("Full Claude content");

			expect(agents).toContain("Concise AGENTS content");
			expect(agents).not.toContain("Full Claude content");
		});

		it("should replace per-engine content on re-apply with Record", async () => {
			const content1: Record<string, string> = {
				"CLAUDE.md": "Claude v1",
				".cursorrules": "Cursor v1",
				"AGENTS.md": "Agents v1",
			};
			const content2: Record<string, string> = {
				"CLAUDE.md": "Claude v2",
				".cursorrules": "Cursor v2",
				"AGENTS.md": "Agents v2",
			};

			await inject({ projectDir, briefName: "test", content: content1 });
			await inject({ projectDir, briefName: "test", content: content2 });

			const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			expect(claude).toContain("Claude v2");
			expect(claude).not.toContain("Claude v1");

			const cursor = await readFile(join(projectDir, ".cursorrules"), "utf-8");
			expect(cursor).toContain("Cursor v2");
			expect(cursor).not.toContain("Cursor v1");
		});
	});

	describe("eject", () => {
		it("should remove injected content", async () => {
			await inject({ projectDir, briefName: "test", content: "To be removed" });
			const ejected = await eject(projectDir, "test");

			expect(ejected).toContain("CLAUDE.md");

			const result = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			expect(result).not.toContain("To be removed");
			expect(result).not.toContain("agentbrief:test");
		});

		it("should preserve other content when ejecting", async () => {
			await writeFile(join(projectDir, "CLAUDE.md"), "# My Project\n", "utf-8");
			await inject({ projectDir, briefName: "test", content: "Injected" });
			await eject(projectDir, "test");

			const result = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			expect(result).toContain("# My Project");
			expect(result).not.toContain("Injected");
		});

		it("should only eject the named brief", async () => {
			await inject({ projectDir, briefName: "keep", content: "Keep me" });
			await inject({ projectDir, briefName: "remove", content: "Remove me" });
			await eject(projectDir, "remove");

			const result = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			expect(result).toContain("Keep me");
			expect(result).not.toContain("Remove me");
		});

		it("should return empty array when brief not found", async () => {
			const ejected = await eject(projectDir, "nonexistent");
			expect(ejected).toHaveLength(0);
		});
	});
});
