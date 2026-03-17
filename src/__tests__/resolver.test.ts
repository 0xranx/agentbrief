import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { search } from "../index.js";
import { loadRegistry, parseGitHubSource, resolveSource } from "../resolver.js";

describe("parseGitHubSource", () => {
	it("should parse github:owner/repo", () => {
		const result = parseGitHubSource("github:myorg/myrepo");
		expect(result.owner).toBe("myorg");
		expect(result.repo).toBe("myrepo");
		expect(result.ref).toBeUndefined();
		expect(result.subdir).toBeUndefined();
	});

	it("should parse github:owner/repo@tag", () => {
		const result = parseGitHubSource("github:myorg/myrepo@v1.0");
		expect(result.owner).toBe("myorg");
		expect(result.repo).toBe("myrepo");
		expect(result.ref).toBe("v1.0");
		expect(result.subdir).toBeUndefined();
	});

	it("should parse github:owner/repo/subdir", () => {
		const result = parseGitHubSource("github:myorg/myrepo/packages/brief");
		expect(result.owner).toBe("myorg");
		expect(result.repo).toBe("myrepo");
		expect(result.subdir).toBe("packages/brief");
	});

	it("should parse github:owner/repo@tag/subdir", () => {
		const result = parseGitHubSource("github:myorg/myrepo@v2.0");
		expect(result.owner).toBe("myorg");
		expect(result.repo).toBe("myrepo");
		expect(result.ref).toBe("v2.0");
	});

	it("should throw for invalid format (missing repo)", () => {
		expect(() => parseGitHubSource("github:myorg")).toThrow("Invalid GitHub source");
	});
});

describe("resolveSource — local paths", () => {
	let briefDir: string;

	beforeEach(async () => {
		briefDir = join(tmpdir(), `agentbrief-resolver-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		await mkdir(briefDir, { recursive: true });
		await writeFile(join(briefDir, "brief.yaml"), 'name: test\nversion: "1.0.0"\n', "utf-8");
	});

	afterEach(async () => {
		await rm(briefDir, { recursive: true, force: true });
	});

	it("should resolve absolute local path", async () => {
		const result = await resolveSource(briefDir);
		expect(result.type).toBe("local");
		expect(result.path).toBe(briefDir);
		expect(result.original).toBe(briefDir);
	});

	it("should throw for non-existent directory", async () => {
		await expect(resolveSource("/tmp/nonexistent-agentbrief-dir-12345")).rejects.toThrow("Brief directory not found");
	});

	it("should throw for directory without brief.yaml", async () => {
		const emptyDir = join(tmpdir(), `agentbrief-empty-${Date.now()}`);
		await mkdir(emptyDir, { recursive: true });
		try {
			await expect(resolveSource(emptyDir)).rejects.toThrow("No brief.yaml found");
		} finally {
			await rm(emptyDir, { recursive: true, force: true });
		}
	});

	it("should throw for unrecognized source format", async () => {
		await expect(resolveSource("npm:some-package")).rejects.toThrow();
	});
});

describe("registry", () => {
	it("should load registry.yaml", async () => {
		const registry = await loadRegistry();
		expect(registry).toBeDefined();
		expect(registry["security-auditor"]).toBeDefined();
		expect(registry["security-auditor"].source).toContain("github:");
		expect(registry["security-auditor"].trust).toBe("official");
	});

	it("should have all expected official entries", async () => {
		const registry = await loadRegistry();
		const names = Object.keys(registry);
		expect(names).toContain("security-auditor");
		expect(names).toContain("code-reviewer");
		expect(names).toContain("typescript-strict");
		expect(names).toContain("nextjs-fullstack");
		expect(names).toContain("frontend-design");
	});

	it("search() should return all entries with no query", async () => {
		const results = await search();
		expect(results.length).toBeGreaterThanOrEqual(10);
		expect(results[0]).toHaveProperty("name");
		expect(results[0]).toHaveProperty("source");
		expect(results[0]).toHaveProperty("trust");
	});

	it("search() should filter by query", async () => {
		const results = await search("security");
		expect(results.length).toBeGreaterThanOrEqual(1);
		expect(results.some((r) => r.name === "security-auditor")).toBe(true);
	});

	it("search() should return empty for non-matching query", async () => {
		const results = await search("zzz-nonexistent-zzz");
		expect(results).toHaveLength(0);
	});
});
