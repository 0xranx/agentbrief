import type { BriefSpec, EngineTarget, ScaleConfig, SkillMeta } from "./types.js";

export interface CompileOpts {
	spec: BriefSpec;
	personality: string;
	/** Target engine. When omitted, defaults to 'claude-code' (full output). */
	engine?: EngineTarget;
	/** Parsed skill metadata from SKILL.md frontmatter */
	skillMetas?: SkillMeta[];
}

type CompileMode = "full" | "concise" | "minimal";

function resolveMode(engine?: EngineTarget): CompileMode {
	if (!engine || engine === "claude-code") return "full";
	if (engine === "cursor") return "minimal";
	return "concise"; // opencode, codex
}

// ── Text reduction helpers ─────────────────────────────

/**
 * Aggressive reduction for Cursor: keep headings, lists, and code blocks only.
 * Drops prose paragraphs entirely.
 */
export function condense(text: string): string {
	const lines = text.split("\n");
	const result: string[] = [];
	let inCodeBlock = false;

	for (const line of lines) {
		if (line.trimStart().startsWith("```")) {
			inCodeBlock = !inCodeBlock;
			result.push(line);
			continue;
		}
		if (inCodeBlock) {
			result.push(line);
			continue;
		}
		// Keep headings
		if (/^#{1,6}\s/.test(line)) {
			result.push(line);
			continue;
		}
		// Keep list items (-, *, numbered)
		if (/^\s*[-*]\s/.test(line) || /^\s*\d+\.\s/.test(line)) {
			result.push(line);
			continue;
		}
		// Keep empty lines (preserve structure)
		if (line.trim() === "") {
			result.push(line);
		}
		// Drop prose paragraphs
	}

	// Collapse 3+ consecutive empty lines into 2
	return result
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

/**
 * Moderate reduction for OpenCode/Codex: keep first sentence of prose paragraphs,
 * preserve structured content (headings, lists, code blocks) intact.
 */
export function moderate(text: string): string {
	const blocks = text.split(/\n\n+/);
	const result: string[] = [];

	for (const block of blocks) {
		const trimmed = block.trim();
		if (!trimmed) continue;

		// Keep headings, lists, code blocks intact
		if (
			/^#{1,6}\s/.test(trimmed) ||
			/^\s*[-*]\s/.test(trimmed) ||
			/^\s*\d+\.\s/.test(trimmed) ||
			trimmed.startsWith("```")
		) {
			result.push(trimmed);
			continue;
		}

		// Prose paragraph: keep first sentence only
		const firstSentence = extractFirstSentence(trimmed);
		if (firstSentence) {
			result.push(firstSentence);
		}
	}

	return result.join("\n\n").trim();
}

function extractFirstSentence(text: string): string {
	// Match up to and including the first sentence-ending punctuation followed by space or end
	const match = text.match(/^(.+?[.!?])(?:\s|$)/);
	return match ? match[1] : text;
}

// ── Section builders ───────────────────────────────────

function buildHeader(spec: BriefSpec, mode: CompileMode): string {
	const parts: string[] = [];

	if (mode === "minimal") {
		parts.push(`# ${spec.name}`);
	} else {
		parts.push(`# AgentBrief: ${spec.name}`);
		if (spec.description) {
			parts.push(`> ${spec.description}`);
		}
	}

	if (mode === "full") {
		parts.push("> Applied via AgentBrief. Do not edit this section manually.");
	}

	return parts.join("\n");
}

function buildPersonality(personality: string, mode: CompileMode): string {
	const trimmed = personality.trim();
	if (!trimmed) return "";

	if (mode === "full") return trimmed;
	if (mode === "minimal") return condense(trimmed);
	return moderate(trimmed); // concise
}

function buildKnowledge(spec: BriefSpec, mode: CompileMode): string {
	if (!spec.knowledge || spec.knowledge.length === 0) return "";
	if (mode === "minimal") return ""; // Cursor: omit entirely

	const lines: string[] = [];

	if (mode === "full") {
		lines.push("## Reference Knowledge");
		lines.push("");
		lines.push(
			"The following domain knowledge files are available. Read them when you need domain-specific information:",
		);
		lines.push("");
	} else {
		lines.push("## Knowledge");
		lines.push("");
	}

	for (const k of spec.knowledge) {
		lines.push(`- \`.agentbrief/${spec.name}/knowledge/${k}\``);
	}

	return lines.join("\n");
}

function buildSkills(spec: BriefSpec, mode: CompileMode, skillMetas?: SkillMeta[]): string {
	if (!spec.skills || spec.skills.length === 0) return "";
	if (mode === "minimal") return ""; // Cursor: omit entirely

	const lines: string[] = [];
	const skillsPath = `.agentbrief/${spec.name}/skills/`;

	if (mode === "full") {
		lines.push("## Skills");
		lines.push("");
		lines.push(
			"When the described situation arises, read the corresponding skill file and follow its instructions step by step.",
		);
		lines.push("");
	} else {
		lines.push("## Skills");
		lines.push("");
	}

	if (skillMetas && skillMetas.length > 0) {
		for (const meta of skillMetas) {
			if (mode === "full" && meta.description) {
				lines.push(`- **${meta.name}** — USE WHEN: ${meta.description}`);
				lines.push(`  → \`${skillsPath}${meta.path}\``);
			} else {
				const desc = meta.description ? ` — ${meta.description}` : "";
				lines.push(`- **${meta.name}**${desc}`);
			}
		}
	} else {
		for (const s of spec.skills) {
			lines.push(`- \`${skillsPath}${s}\``);
		}
	}

	return lines.join("\n");
}

function buildScale(scale: ScaleConfig | undefined, mode: CompileMode): string {
	if (!scale) return "";
	if (mode === "minimal") return ""; // Cursor: omit entirely

	const parts: string[] = [];
	if (scale.timeout) parts.push(`timeout=${scale.timeout}s`);
	if (scale.concurrency) parts.push(`concurrency=${scale.concurrency}`);
	if (scale.engine) parts.push(`engine=${scale.engine}`);
	if (scale.model) parts.push(`model=${scale.model}`);
	if (parts.length === 0) return "";

	if (mode === "full") {
		const lines: string[] = ["## Operational Constraints", ""];
		if (scale.timeout) lines.push(`- Response timeout: ${scale.timeout}s`);
		if (scale.concurrency) lines.push(`- Max concurrency: ${scale.concurrency}`);
		if (scale.engine) lines.push(`- Preferred engine: ${scale.engine}`);
		if (scale.model) lines.push(`- Preferred model: ${scale.model}`);
		return lines.join("\n");
	}

	// concise: single inline line
	return `**Constraints:** ${parts.join(", ")}`;
}

// ── Main compile function ──────────────────────────────

/**
 * Compile a brief spec + personality into a markdown document.
 * Output is adapted to the target engine's conventions and length preferences.
 */
export function compile(opts: CompileOpts): string {
	const { spec, personality, engine } = opts;
	const mode = resolveMode(engine);
	const sections: string[] = [];

	sections.push(buildHeader(spec, mode));

	const personalitySection = buildPersonality(personality, mode);
	if (personalitySection) {
		sections.push(personalitySection);
	}

	const knowledgeSection = buildKnowledge(spec, mode);
	if (knowledgeSection) {
		sections.push(knowledgeSection);
	}

	const skillsSection = buildSkills(spec, mode, opts.skillMetas);
	if (skillsSection) {
		sections.push(skillsSection);
	}

	const scaleSection = buildScale(spec.scale, mode);
	if (scaleSection) {
		sections.push(scaleSection);
	}

	return sections.join("\n\n");
}
