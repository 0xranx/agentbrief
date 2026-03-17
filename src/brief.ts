import { existsSync, readdirSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import yaml from "js-yaml";
import type { BriefSpec, SkillMeta } from "./types.js";

export async function loadBrief(dir: string): Promise<BriefSpec> {
	const specPath = join(dir, "brief.yaml");
	if (!existsSync(specPath)) {
		throw new Error(`No brief.yaml found in: ${dir}`);
	}
	const content = await readFile(specPath, "utf-8");
	const spec = yaml.load(content) as BriefSpec;
	validate(spec, specPath);
	return spec;
}

function validate(spec: unknown, path: string): asserts spec is BriefSpec {
	const s = spec as Record<string, unknown>;
	if (!s || typeof s !== "object") {
		throw new Error(`Invalid brief.yaml at ${path}: must be a YAML object`);
	}
	if (!s.name || typeof s.name !== "string") {
		throw new Error(`brief.yaml must have a "name" string field`);
	}
	if (!s.version || typeof s.version !== "string") {
		throw new Error(`brief.yaml must have a "version" string field`);
	}
}

export async function loadPersonality(dir: string, spec: BriefSpec): Promise<string> {
	const relPath = spec.personality || "personality.md";
	const fullPath = join(dir, relPath);
	if (!existsSync(fullPath)) return "";
	return readFile(fullPath, "utf-8");
}

/**
 * Scan skill directories and extract SKILL.md frontmatter.
 *
 * Each skill is a directory containing a SKILL.md file (+ optional scripts/, references/, assets/).
 * Compatible with the skills.sh / Agent Skills ecosystem.
 *
 * Layout: skills/{skill-name}/SKILL.md
 */
export async function loadSkillMetas(dir: string, spec: BriefSpec): Promise<SkillMeta[]> {
	if (!spec.skills || spec.skills.length === 0) return [];

	const metas: SkillMeta[] = [];

	for (const s of spec.skills) {
		const fullPath = join(dir, s);
		if (!existsSync(fullPath) || !statSync(fullPath).isDirectory()) continue;

		for (const entry of readdirSync(fullPath)) {
			const entryPath = join(fullPath, entry);
			if (!statSync(entryPath).isDirectory()) continue;

			const skillMd = join(entryPath, "SKILL.md");
			if (existsSync(skillMd)) {
				const meta = await parseSkillFrontmatter(skillMd, `${entry}/`);
				metas.push(meta);
			}
		}
	}

	return metas;
}

async function parseSkillFrontmatter(filePath: string, relPath: string): Promise<SkillMeta> {
	const content = await readFile(filePath, "utf-8");
	const fallbackName = basename(filePath, ".md");

	// Check for YAML frontmatter (--- ... ---)
	if (content.startsWith("---")) {
		const endIdx = content.indexOf("---", 3);
		if (endIdx !== -1) {
			try {
				const frontmatter = yaml.load(content.slice(3, endIdx)) as Record<string, unknown>;
				return {
					name: (frontmatter.name as string) || fallbackName,
					description: frontmatter.description as string | undefined,
					path: relPath,
				};
			} catch {
				// Invalid YAML frontmatter, fall through
			}
		}
	}

	// No frontmatter — try to extract name from first heading
	const headingMatch = content.match(/^#\s+(.+)/m);
	return {
		name: headingMatch ? headingMatch[1].trim() : fallbackName,
		path: relPath,
	};
}
