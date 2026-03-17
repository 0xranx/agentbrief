import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ENGINE_FILES } from "./types.js";

const MARKER_START = (name: string) => `<!-- agentbrief:${name}:start -->`;
const MARKER_END = (name: string) => `<!-- agentbrief:${name}:end -->`;

// ── Inject ──────────────────────────────────────────────

export interface InjectOpts {
	projectDir: string;
	briefName: string;
	/** Single string (same for all engines) or per-engine-file map */
	content: string | Record<string, string>;
}

/**
 * Inject compiled brief content into all engine instruction files.
 * Returns the list of files that were written.
 */
export async function inject(opts: InjectOpts): Promise<string[]> {
	const { projectDir, briefName, content } = opts;

	// Deduplicate file paths (opencode and codex both use AGENTS.md)
	const uniqueFiles = [...new Set(Object.values(ENGINE_FILES))];
	const injected: string[] = [];

	for (const file of uniqueFiles) {
		const fileContent = typeof content === "string" ? content : (content[file] ?? Object.values(content)[0]);
		const wrapped = `${MARKER_START(briefName)}\n${fileContent}\n${MARKER_END(briefName)}`;
		const filePath = join(projectDir, file);
		await injectIntoFile(filePath, briefName, wrapped);
		injected.push(file);
	}

	return injected;
}

async function injectIntoFile(filePath: string, briefName: string, wrapped: string): Promise<void> {
	let existing = "";
	if (existsSync(filePath)) {
		existing = await readFile(filePath, "utf-8");
	}

	const startMarker = MARKER_START(briefName);
	const endMarker = MARKER_END(briefName);
	const startIdx = existing.indexOf(startMarker);
	const endIdx = existing.indexOf(endMarker);

	let result: string;
	if (startIdx !== -1 && endIdx !== -1) {
		// Replace existing injection
		result = existing.slice(0, startIdx) + wrapped + existing.slice(endIdx + endMarker.length);
	} else if (existing.trim()) {
		// Append to existing file
		result = `${existing.trimEnd()}\n\n${wrapped}\n`;
	} else {
		// New file
		result = `${wrapped}\n`;
	}

	await writeFile(filePath, result, "utf-8");
}

// ── Eject ───────────────────────────────────────────────

/**
 * Remove injected brief content from all engine instruction files.
 * Returns the list of files that were modified.
 */
export async function eject(projectDir: string, briefName: string): Promise<string[]> {
	const uniqueFiles = [...new Set(Object.values(ENGINE_FILES))];
	const ejected: string[] = [];

	for (const file of uniqueFiles) {
		const filePath = join(projectDir, file);
		if (!existsSync(filePath)) continue;

		const content = await readFile(filePath, "utf-8");
		const startMarker = MARKER_START(briefName);
		const endMarker = MARKER_END(briefName);
		const startIdx = content.indexOf(startMarker);
		const endIdx = content.indexOf(endMarker);

		if (startIdx === -1 || endIdx === -1) continue;

		const before = content.slice(0, startIdx);
		const after = content.slice(endIdx + endMarker.length);
		const cleaned = (before + after).replace(/\n{3,}/g, "\n\n").trim();

		await writeFile(filePath, cleaned ? `${cleaned}\n` : "", "utf-8");
		ejected.push(file);
	}

	return ejected;
}
