import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import type { BriefSource, Registry } from "./types.js";

const CACHE_DIR = join(homedir(), ".agentbrief", "cache");

/**
 * Resolve a brief source string to a local directory path.
 *
 * Supported formats:
 *  - Registry name: `security-auditor` (looked up in registry.yaml)
 *  - Local path:    `./my-brief`, `../briefs/x`, `/absolute/path`
 *  - GitHub:        `github:owner/repo`, `github:owner/repo@v1.0`, `github:owner/repo/subdir`
 */
export async function resolveSource(source: string): Promise<BriefSource> {
	if (source.startsWith("./") || source.startsWith("../") || source.startsWith("/")) {
		return resolveLocal(source);
	}
	if (source.startsWith("github:")) {
		return resolveGitHub(source);
	}
	// Try registry lookup for bare names (e.g., "security-auditor")
	const registryResult = await resolveFromRegistry(source);
	if (registryResult) {
		return registryResult;
	}
	throw new Error(
		`Unknown brief: "${source}". Use a registry name (e.g., security-auditor), local path (./my-brief), or GitHub reference (github:owner/repo).`,
	);
}

// ── Local ───────────────────────────────────────────────

function resolveLocal(source: string): BriefSource {
	const absPath = resolve(source);
	if (!existsSync(absPath)) {
		throw new Error(`Brief directory not found: ${absPath}`);
	}
	if (!existsSync(join(absPath, "brief.yaml"))) {
		throw new Error(`No brief.yaml found in: ${absPath}`);
	}
	return { type: "local", path: absPath, original: source };
}

// ── GitHub ──────────────────────────────────────────────

export interface ParsedGitHubRef {
	owner: string;
	repo: string;
	ref?: string;
	subdir?: string;
}

export function parseGitHubSource(source: string): ParsedGitHubRef {
	const raw = source.slice("github:".length); // strip prefix

	let main: string;
	let ref: string | undefined;

	const atIdx = raw.indexOf("@");
	if (atIdx !== -1) {
		main = raw.slice(0, atIdx);
		ref = raw.slice(atIdx + 1);
	} else {
		main = raw;
	}

	const parts = main.split("/");
	if (parts.length < 2) {
		throw new Error(`Invalid GitHub source: "${source}". Expected github:owner/repo`);
	}

	return {
		owner: parts[0],
		repo: parts[1],
		ref,
		subdir: parts.length > 2 ? parts.slice(2).join("/") : undefined,
	};
}

/**
 * Clone a GitHub repo (or use cache) and return the local path.
 * Shared by both brief resolution and skill resolution.
 */
async function cloneGitHub(source: string): Promise<{ path: string; ref?: string; sha?: string }> {
	const { owner, repo, ref, subdir } = parseGitHubSource(source);
	const repoUrl = `https://github.com/${owner}/${repo}.git`;
	const cacheKey = `${owner}/${repo}/${ref || "HEAD"}`;
	const cacheDir = join(CACHE_DIR, cacheKey);

	await mkdir(cacheDir, { recursive: true });

	if (!existsSync(join(cacheDir, ".git"))) {
		const args = ["git", "clone", "--depth", "1"];
		if (ref) args.push("--branch", ref);
		args.push(repoUrl, cacheDir);
		execSync(args.join(" "), { stdio: "pipe" });
	} else {
		execSync("git fetch --depth 1 && git reset --hard FETCH_HEAD", {
			cwd: cacheDir,
			stdio: "pipe",
		});
	}

	let sha: string | undefined;
	try {
		sha = execSync("git rev-parse HEAD", { cwd: cacheDir, encoding: "utf-8" }).trim();
	} catch {
		// non-critical
	}

	const targetPath = subdir ? join(cacheDir, subdir) : cacheDir;
	return { path: targetPath, ref, sha };
}

export async function resolveGitHub(source: string): Promise<BriefSource> {
	const { path, ref, sha } = await cloneGitHub(source);
	if (!existsSync(join(path, "brief.yaml"))) {
		throw new Error(`No brief.yaml found in ${source} (resolved to ${path})`);
	}
	return { type: "github", path, original: source, ref, sha };
}

/**
 * Resolve a remote GitHub skill reference — clones the repo and returns
 * the local path. Unlike resolveGitHub, does NOT require brief.yaml.
 */
export async function resolveGitHubSkill(source: string): Promise<string> {
	const { path } = await cloneGitHub(source);
	if (!existsSync(path)) {
		throw new Error(`Skill directory not found in ${source} (resolved to ${path})`);
	}
	return path;
}

// ── Registry ───────────────────────────────────────────

let registryCache: Registry | null = null;

export async function loadRegistry(): Promise<Registry> {
	if (registryCache) return registryCache;

	const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
	const registryPath = join(pkgRoot, "registry.yaml");

	if (!existsSync(registryPath)) return {};

	const raw = await readFile(registryPath, "utf-8");
	registryCache = (yaml.load(raw) as Registry) || {};
	return registryCache;
}

async function resolveFromRegistry(name: string): Promise<BriefSource | null> {
	const registry = await loadRegistry();
	const entry = registry[name];
	if (!entry) return null;

	// Official briefs: use built-in copy from briefs/ directory (no network needed)
	if (entry.trust === "official") {
		const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
		const builtinPath = join(pkgRoot, "briefs", name);
		if (existsSync(builtinPath) && existsSync(join(builtinPath, "brief.yaml"))) {
			return { type: "registry", path: builtinPath, original: name };
		}
	}

	// Verified/community briefs: resolve via GitHub
	const resolved = await resolveGitHub(entry.source);
	return { ...resolved, type: "registry", original: name };
}

/**
 * List all entries in the registry.
 */
export async function listRegistry(): Promise<Registry> {
	return loadRegistry();
}
