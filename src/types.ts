// ── Brief spec (brief.yaml) ─────────────────────────────

export interface BriefSpec {
	name: string;
	version: string;
	description?: string;
	/** Relative path to personality markdown file. Default: "personality.md" */
	personality?: string;
	/** Scale / operational constraints */
	scale?: ScaleConfig;
	/** Relative paths to knowledge files or directories */
	knowledge?: string[];
	/** Relative paths to skill directories */
	skills?: string[];
	/** Extend other briefs — inherit their knowledge and skills */
	extends?: string[];
}

export interface ScaleConfig {
	concurrency?: number;
	timeout?: number;
	engine?: string;
	model?: string;
}

// ── Lock file (.agentbrief/lock.yaml) ───────────────────

export interface LockFile {
	version: 1;
	briefs: LockEntry[];
}

export interface LockEntry {
	name: string;
	source: string;
	version: string;
	ref?: string;
	sha?: string;
	applied_at: string;
}

// ── Resolver ────────────────────────────────────────────

export interface BriefSource {
	type: "local" | "github" | "registry";
	/** Absolute local path to the brief directory */
	path: string;
	/** Original source string as provided by user */
	original: string;
	ref?: string;
	sha?: string;
}

// ── Skill metadata (SKILL.md frontmatter) ───────────────

export interface SkillMeta {
	name: string;
	description?: string;
	/** Relative path to the skill file within the brief */
	path: string;
}

// ── Registry ────────────────────────────────────────────

export type TrustLevel = "official" | "verified" | "community";

export interface RegistryEntry {
	source: string;
	description?: string;
	trust: TrustLevel;
}

export type Registry = Record<string, RegistryEntry>;

// ── Engine targets ──────────────────────────────────────

export type EngineTarget = "claude-code" | "cursor" | "opencode" | "codex";

/** Maps engine name → instruction file path (relative to project root) */
export const ENGINE_FILES: Record<EngineTarget, string> = {
	"claude-code": "CLAUDE.md",
	cursor: ".cursorrules",
	opencode: "AGENTS.md",
	codex: "AGENTS.md",
};

/** Reverse mapping: instruction file → engine targets that use it */
export const FILE_ENGINES: Record<string, EngineTarget[]> = {
	"CLAUDE.md": ["claude-code"],
	".cursorrules": ["cursor"],
	"AGENTS.md": ["opencode", "codex"],
};
