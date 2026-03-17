import { mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { addEntry, cleanBriefData, readLock, removeEntry, writeLock } from "../lock.js";
import type { LockFile } from "../types.js";

describe("lock", () => {
	let projectDir: string;

	beforeEach(async () => {
		projectDir = join(tmpdir(), `agentbrief-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		await mkdir(projectDir, { recursive: true });
	});

	afterEach(async () => {
		await rm(projectDir, { recursive: true, force: true });
	});

	it("should return empty lock when no file exists", async () => {
		const lock = await readLock(projectDir);
		expect(lock.version).toBe(1);
		expect(lock.briefs).toHaveLength(0);
	});

	it("should round-trip write and read", async () => {
		const lock: LockFile = {
			version: 1,
			briefs: [{ name: "test", source: "./test", version: "1.0.0", applied_at: "2026-01-01T00:00:00Z" }],
		};
		await writeLock(projectDir, lock);
		const loaded = await readLock(projectDir);
		expect(loaded.briefs).toHaveLength(1);
		expect(loaded.briefs[0].name).toBe("test");
	});

	it("should add a new entry", async () => {
		await addEntry(projectDir, { name: "a", source: "./a", version: "1.0.0", applied_at: "2026-01-01T00:00:00Z" });
		await addEntry(projectDir, { name: "b", source: "./b", version: "2.0.0", applied_at: "2026-01-02T00:00:00Z" });
		const lock = await readLock(projectDir);
		expect(lock.briefs).toHaveLength(2);
	});

	it("should update existing entry by name", async () => {
		await addEntry(projectDir, { name: "a", source: "./a", version: "1.0.0", applied_at: "2026-01-01T00:00:00Z" });
		await addEntry(projectDir, { name: "a", source: "./a", version: "2.0.0", applied_at: "2026-01-02T00:00:00Z" });
		const lock = await readLock(projectDir);
		expect(lock.briefs).toHaveLength(1);
		expect(lock.briefs[0].version).toBe("2.0.0");
	});

	it("should remove entry by name", async () => {
		await addEntry(projectDir, { name: "a", source: "./a", version: "1.0.0", applied_at: "2026-01-01T00:00:00Z" });
		const removed = await removeEntry(projectDir, "a");
		expect(removed).toBe(true);
		const lock = await readLock(projectDir);
		expect(lock.briefs).toHaveLength(0);
	});

	it("should return false when removing nonexistent entry", async () => {
		const removed = await removeEntry(projectDir, "nonexistent");
		expect(removed).toBe(false);
	});

	it("should clean brief data directory", async () => {
		const dataDir = join(projectDir, ".agentbrief", "test");
		await mkdir(dataDir, { recursive: true });
		await cleanBriefData(projectDir, "test");
		const { existsSync } = await import("node:fs");
		expect(existsSync(dataDir)).toBe(false);
	});
});
