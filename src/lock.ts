import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import type { LockEntry, LockFile } from "./types.js";

const BRIEF_DIR = ".agentbrief";
const LOCK_FILE = "lock.yaml";

function lockPath(projectDir: string): string {
	return join(projectDir, BRIEF_DIR, LOCK_FILE);
}

export async function readLock(projectDir: string): Promise<LockFile> {
	const p = lockPath(projectDir);
	if (!existsSync(p)) {
		return { version: 1, briefs: [] };
	}
	const content = await readFile(p, "utf-8");
	return (yaml.load(content) as LockFile) || { version: 1, briefs: [] };
}

export async function writeLock(projectDir: string, lock: LockFile): Promise<void> {
	const dir = join(projectDir, BRIEF_DIR);
	await mkdir(dir, { recursive: true });
	await writeFile(lockPath(projectDir), yaml.dump(lock, { lineWidth: 120 }), "utf-8");
}

export async function addEntry(projectDir: string, entry: LockEntry): Promise<void> {
	const lock = await readLock(projectDir);
	const idx = lock.briefs.findIndex((b) => b.name === entry.name);
	if (idx !== -1) {
		lock.briefs[idx] = entry;
	} else {
		lock.briefs.push(entry);
	}
	await writeLock(projectDir, lock);
}

export async function removeEntry(projectDir: string, name: string): Promise<boolean> {
	const lock = await readLock(projectDir);
	const idx = lock.briefs.findIndex((b) => b.name === name);
	if (idx === -1) return false;
	lock.briefs.splice(idx, 1);
	await writeLock(projectDir, lock);
	return true;
}

/** Remove copied knowledge/skills for a brief */
export async function cleanBriefData(projectDir: string, name: string): Promise<void> {
	const dataDir = join(projectDir, BRIEF_DIR, name);
	if (existsSync(dataDir)) {
		await rm(dataDir, { recursive: true });
	}
}
