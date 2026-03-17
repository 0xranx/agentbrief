import { existsSync, readdirSync, statSync } from "node:fs";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { loadBrief, loadPersonality, loadSkillMetas } from "./brief.js";
import { compile } from "./compiler.js";
import { eject as ejectFromFiles, inject } from "./injector.js";
import { addEntry, cleanBriefData, readLock, removeEntry } from "./lock.js";
import { listRegistry, resolveGitHub, resolveSource } from "./resolver.js";
import type { BriefSpec, EngineTarget, LockEntry, TrustLevel } from "./types.js";
import { FILE_ENGINES } from "./types.js";

export { loadBrief, loadPersonality, loadSkillMetas } from "./brief.js";
export { compile } from "./compiler.js";
export { eject as ejectFromFiles, inject } from "./injector.js";
export { readLock } from "./lock.js";
export { listRegistry, resolveSource } from "./resolver.js";
export type { BriefSource, BriefSpec, LockEntry, LockFile, Registry, RegistryEntry, ScaleConfig } from "./types.js";
export { ENGINE_FILES } from "./types.js";

// ── use ─────────────────────────────────────────────────

export interface UseOpts {
	source: string;
	projectDir?: string;
}

export interface UseResult {
	name: string;
	version: string;
	description?: string;
	knowledgeCount: number;
	skillsCount: number;
	files: string[];
	/** Line count of CLAUDE.md after injection */
	claudeLines: number;
}

export async function use(opts: UseOpts): Promise<UseResult> {
	const projectDir = resolve(opts.projectDir || ".");

	// 1. Resolve source → local path
	const resolved = await resolveSource(opts.source);

	// 2. Load brief spec + personality
	const spec = await loadBrief(resolved.path);
	const personality = await loadPersonality(resolved.path, spec);

	const briefDataDir = join(projectDir, ".agentbrief", spec.name);

	// 3. Resolve extends — collect knowledge and skills from extended briefs
	if (spec.extends && spec.extends.length > 0) {
		for (const ext of spec.extends) {
			const extResolved = await resolveSource(ext);
			const extSpec = await loadBrief(extResolved.path);

			// Copy extended brief's knowledge (dedup by name)
			if (extSpec.knowledge) {
				const knowledgeDir = join(briefDataDir, "knowledge");
				await mkdir(knowledgeDir, { recursive: true });
				for (const k of extSpec.knowledge) {
					const src = join(extResolved.path, k);
					if (!existsSync(src)) continue;
					if (statSync(src).isDirectory()) {
						for (const child of readdirSync(src)) {
							const target = join(knowledgeDir, child);
							if (!existsSync(target)) await cp(join(src, child), target, { recursive: true });
						}
					} else {
						const target = join(knowledgeDir, k);
						if (!existsSync(target)) await cp(src, target, { recursive: true });
					}
				}
			}

			// Copy extended brief's skills (dedup by skill dir name)
			if (extSpec.skills) {
				const skillsDir = join(briefDataDir, "skills");
				await mkdir(skillsDir, { recursive: true });
				for (const s of extSpec.skills) {
					const src = join(extResolved.path, s);
					if (!existsSync(src) || !statSync(src).isDirectory()) continue;
					for (const child of readdirSync(src)) {
						const target = join(skillsDir, child);
						if (!existsSync(target)) await cp(join(src, child), target, { recursive: true });
					}
				}
			}
		}
	}

	// 4. Copy own knowledge files
	if (spec.knowledge && spec.knowledge.length > 0) {
		const knowledgeDir = join(briefDataDir, "knowledge");
		await mkdir(knowledgeDir, { recursive: true });
		for (const k of spec.knowledge) {
			const src = join(resolved.path, k);
			if (existsSync(src)) {
				await cp(src, join(knowledgeDir, k), { recursive: true });
			}
		}
	}

	// 5. Copy own skills (local + remote), overriding extended if same name
	if (spec.skills && spec.skills.length > 0) {
		const skillsDir = join(briefDataDir, "skills");
		await mkdir(skillsDir, { recursive: true });
		for (const s of spec.skills) {
			if (s.startsWith("github:")) {
				const resolvedSkill = await resolveGitHub(s);
				const skillName = resolvedSkill.path.split("/").filter(Boolean).pop() || "skill";
				await cp(resolvedSkill.path, join(skillsDir, skillName), { recursive: true });
			} else {
				const src = join(resolved.path, s);
				if (!existsSync(src) || !statSync(src).isDirectory()) continue;
				for (const child of readdirSync(src)) {
					await cp(join(src, child), join(skillsDir, child), { recursive: true });
				}
			}
		}
	}

	// 5. Load skill metadata from deployed skills directory
	const deployedSkillsDir = join(briefDataDir, "skills");
	const skillMetas = existsSync(deployedSkillsDir)
		? await loadSkillMetas(briefDataDir, { ...spec, skills: ["skills/"] })
		: [];

	// 6. Compile per engine target (with skill metadata)
	// If extends brought in skills, ensure compiler knows about them
	const compileSpec = skillMetas.length > 0 && !spec.skills?.length ? { ...spec, skills: ["skills/"] } : spec;
	const contentMap: Record<string, string> = {};
	for (const [file, engines] of Object.entries(FILE_ENGINES)) {
		contentMap[file] = compile({ spec: compileSpec, personality, engine: engines[0] as EngineTarget, skillMetas });
	}

	// 6. Inject per-engine content into instruction files
	const injectedFiles = await inject({ projectDir, briefName: spec.name, content: contentMap });

	// 7. Update lock file
	await addEntry(projectDir, {
		name: spec.name,
		source: resolved.original,
		version: spec.version,
		ref: resolved.ref,
		sha: resolved.sha,
		applied_at: new Date().toISOString(),
	});

	// Count CLAUDE.md lines for context bloat warning
	const claudeMdPath = join(projectDir, "CLAUDE.md");
	const claudeLines = existsSync(claudeMdPath) ? (await readFile(claudeMdPath, "utf-8")).split("\n").length : 0;

	return {
		name: spec.name,
		version: spec.version,
		description: spec.description,
		knowledgeCount: spec.knowledge?.length ?? 0,
		skillsCount: spec.skills?.length ?? 0,
		files: injectedFiles,
		claudeLines,
	};
}

// ── eject ───────────────────────────────────────────────

export interface EjectResult {
	name: string;
	files: string[];
}

export async function eject(name: string, projectDir?: string): Promise<EjectResult> {
	const dir = resolve(projectDir || ".");
	const ejectedFiles = await ejectFromFiles(dir, name);
	await cleanBriefData(dir, name);
	await removeEntry(dir, name);
	return { name, files: ejectedFiles };
}

// ── list ────────────────────────────────────────────────

export async function list(projectDir?: string): Promise<LockEntry[]> {
	const dir = resolve(projectDir || ".");
	const lock = await readLock(dir);
	return lock.briefs;
}

// ── init ────────────────────────────────────────────────

export interface InitOpts {
	name: string;
	dir: string;
	description?: string;
	template?: string;
}

export async function init(opts: InitOpts): Promise<string> {
	const targetDir = resolve(opts.dir);
	await mkdir(targetDir, { recursive: true });

	if (opts.template) {
		// Copy from template directory
		const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
		const templateDir = join(pkgRoot, "templates", opts.template);
		if (!existsSync(templateDir)) {
			throw new Error(`Template "${opts.template}" not found. Available templates are in the templates/ directory.`);
		}
		await cp(templateDir, targetDir, { recursive: true });

		// Rewrite brief.yaml with user's name and description
		const briefPath = join(targetDir, "brief.yaml");
		if (existsSync(briefPath)) {
			const raw = await readFile(briefPath, "utf-8");
			const spec = yaml.load(raw) as BriefSpec;
			spec.name = opts.name;
			if (opts.description) spec.description = opts.description;
			await writeFile(briefPath, yaml.dump(spec, { lineWidth: 120 }), "utf-8");
		}
		return targetDir;
	}

	// Default scaffolding (no template)
	const spec: BriefSpec = {
		name: opts.name,
		version: "0.1.0",
		description: opts.description || `${opts.name} agent brief`,
		personality: "personality.md",
		knowledge: ["knowledge/"],
		skills: [],
	};

	await writeFile(join(targetDir, "brief.yaml"), yaml.dump(spec, { lineWidth: 120 }), "utf-8");

	await writeFile(
		join(targetDir, "personality.md"),
		[
			`# ${opts.name}`,
			"",
			"## Role",
			"",
			"Describe the role and responsibilities of this agent.",
			"",
			"## Tone & Style",
			"",
			"Describe the communication style, tone, and language preferences.",
			"",
			"## Constraints",
			"",
			"- List behavioral constraints here",
			"- Things the agent must not do",
			"",
		].join("\n"),
		"utf-8",
	);

	await mkdir(join(targetDir, "knowledge"), { recursive: true });
	await writeFile(join(targetDir, "knowledge", ".gitkeep"), "", "utf-8");

	return targetDir;
}

// ── show ────────────────────────────────────────────────

/**
 * Extract the injected content for a brief from CLAUDE.md.
 * Returns the content between markers, or null if not found.
 */
export async function show(name: string, projectDir?: string): Promise<string | null> {
	const dir = resolve(projectDir || ".");
	const filePath = join(dir, "CLAUDE.md");
	if (!existsSync(filePath)) return null;

	const content = await readFile(filePath, "utf-8");
	const startMarker = `<!-- agentbrief:${name}:start -->`;
	const endMarker = `<!-- agentbrief:${name}:end -->`;
	const startIdx = content.indexOf(startMarker);
	const endIdx = content.indexOf(endMarker);
	if (startIdx === -1 || endIdx === -1) return null;

	return content.slice(startIdx + startMarker.length, endIdx).trim();
}

// ── update ──────────────────────────────────────────────

export interface UpdateOpts {
	name?: string;
	projectDir?: string;
}

export async function update(opts: UpdateOpts): Promise<UseResult[]> {
	const dir = resolve(opts.projectDir || ".");
	const lock = await readLock(dir);
	const toUpdate = opts.name ? lock.briefs.filter((b) => b.name === opts.name) : lock.briefs;

	const results: UseResult[] = [];
	for (const entry of toUpdate) {
		const result = await use({ source: entry.source, projectDir: dir });
		results.push(result);
	}
	return results;
}

// ── search ──────────────────────────────────────────────

export interface SearchResult {
	name: string;
	source: string;
	description: string;
	trust: TrustLevel;
}

export async function search(query?: string): Promise<SearchResult[]> {
	const registry = await listRegistry();
	const entries = Object.entries(registry).map(([name, entry]) => ({
		name,
		source: entry.source,
		description: entry.description || "",
		trust: entry.trust,
	}));

	if (!query) return entries;

	const q = query.toLowerCase();
	return entries.filter((e) => e.name.includes(q) || e.description.toLowerCase().includes(q));
}
