import { mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadBrief, loadPersonality } from "../brief.js";

describe("loadBrief", () => {
	let briefDir: string;

	beforeEach(async () => {
		briefDir = join(tmpdir(), `agentbrief-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		await mkdir(briefDir, { recursive: true });
	});

	afterEach(async () => {
		await rm(briefDir, { recursive: true, force: true });
	});

	it("should load a valid brief.yaml", async () => {
		await writeFile(join(briefDir, "brief.yaml"), 'name: test-brief\nversion: "1.0.0"\ndescription: A test\n', "utf-8");

		const spec = await loadBrief(briefDir);
		expect(spec.name).toBe("test-brief");
		expect(spec.version).toBe("1.0.0");
		expect(spec.description).toBe("A test");
	});

	it("should throw when brief.yaml is missing", async () => {
		await expect(loadBrief(briefDir)).rejects.toThrow("No brief.yaml found");
	});

	it("should throw when name is missing", async () => {
		await writeFile(join(briefDir, "brief.yaml"), 'version: "1.0.0"\n', "utf-8");
		await expect(loadBrief(briefDir)).rejects.toThrow('"name"');
	});

	it("should throw when version is missing", async () => {
		await writeFile(join(briefDir, "brief.yaml"), "name: test\n", "utf-8");
		await expect(loadBrief(briefDir)).rejects.toThrow('"version"');
	});
});

describe("loadPersonality", () => {
	let briefDir: string;

	beforeEach(async () => {
		briefDir = join(tmpdir(), `agentbrief-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		await mkdir(briefDir, { recursive: true });
	});

	afterEach(async () => {
		await rm(briefDir, { recursive: true, force: true });
	});

	it("should load personality.md by default", async () => {
		await writeFile(join(briefDir, "personality.md"), "# My Role\n\nBe helpful.\n", "utf-8");

		const result = await loadPersonality(briefDir, { name: "test", version: "1.0.0" });
		expect(result).toContain("Be helpful.");
	});

	it("should load custom personality path", async () => {
		await writeFile(join(briefDir, "custom.md"), "Custom personality", "utf-8");

		const result = await loadPersonality(briefDir, { name: "test", version: "1.0.0", personality: "custom.md" });
		expect(result).toBe("Custom personality");
	});

	it("should return empty string when file not found", async () => {
		const result = await loadPersonality(briefDir, { name: "test", version: "1.0.0" });
		expect(result).toBe("");
	});
});
