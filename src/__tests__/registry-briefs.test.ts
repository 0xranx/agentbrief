import { mkdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eject, search, use } from "../index.js";

const OFFICIAL_BRIEFS = [
	"security-auditor",
	"code-reviewer",
	"typescript-strict",
	"nextjs-fullstack",
	"frontend-design",
	"devops-sre",
	"tech-writer",
	"growth-engineer",
	"product-manager",
	"startup-builder",
];

describe("official registry briefs", () => {
	let projectDir: string;

	beforeEach(async () => {
		projectDir = join(tmpdir(), `agentbrief-reg-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		await mkdir(projectDir, { recursive: true });
	});

	afterEach(async () => {
		await rm(projectDir, { recursive: true, force: true });
	});

	for (const name of OFFICIAL_BRIEFS) {
		it(`"${name}" should apply successfully via short name`, async () => {
			const result = await use({ source: name, projectDir });
			expect(result.name).toBe(name);
			expect(result.version).toBe("1.0.0");
			expect(result.files).toContain("CLAUDE.md");
			expect(result.files).toContain(".cursorrules");
			expect(result.files).toContain("AGENTS.md");

			// CLAUDE.md has full content
			const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
			expect(claude).toContain(`# AgentBrief: ${name}`);
			expect(claude).toContain("Do not edit this section manually");

			// .cursorrules has minimal content (no "AgentBrief:" prefix)
			const cursor = await readFile(join(projectDir, ".cursorrules"), "utf-8");
			expect(cursor).toContain(`# ${name}`);
			expect(cursor).not.toContain("# AgentBrief:");

			// Clean up for next iteration
			await eject(name, projectDir);
		});
	}

	it("search() should return all 10 official briefs", async () => {
		const results = await search();
		for (const name of OFFICIAL_BRIEFS) {
			expect(results.some((r) => r.name === name)).toBe(true);
		}
	});
});
