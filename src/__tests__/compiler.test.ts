import { describe, expect, it } from "vitest";
import { compile, condense, moderate } from "../compiler.js";
import type { BriefSpec } from "../types.js";

describe("compile", () => {
	const baseSpec: BriefSpec = {
		name: "test-brief",
		version: "1.0.0",
	};

	it("should include brief name in header", () => {
		const result = compile({ spec: baseSpec, personality: "" });
		expect(result).toContain("# AgentBrief: test-brief");
	});

	it("should include description when provided", () => {
		const spec: BriefSpec = { ...baseSpec, description: "A test brief" };
		const result = compile({ spec, personality: "" });
		expect(result).toContain("> A test brief");
	});

	it("should include personality content", () => {
		const personality = "## Role\n\nYou are a security auditor.";
		const result = compile({ spec: baseSpec, personality });
		expect(result).toContain("You are a security auditor.");
	});

	it("should include knowledge references", () => {
		const spec: BriefSpec = { ...baseSpec, knowledge: ["owasp.md", "policies/"] };
		const result = compile({ spec, personality: "" });
		expect(result).toContain("## Reference Knowledge");
		expect(result).toContain(".agentbrief/test-brief/knowledge/owasp.md");
		// Directory entries flatten to the knowledge root
		expect(result).toContain(".agentbrief/test-brief/knowledge/");
	});

	it("should include scale constraints", () => {
		const spec: BriefSpec = {
			...baseSpec,
			scale: { timeout: 120, concurrency: 5, engine: "claude-code", model: "claude-sonnet-4-6" },
		};
		const result = compile({ spec, personality: "" });
		expect(result).toContain("## Operational Constraints");
		expect(result).toContain("Response timeout: 120s");
		expect(result).toContain("Max concurrency: 5");
		expect(result).toContain("Preferred engine: claude-code");
		expect(result).toContain("Preferred model: claude-sonnet-4-6");
	});

	it("should omit sections when not provided", () => {
		const result = compile({ spec: baseSpec, personality: "" });
		expect(result).not.toContain("## Reference Knowledge");
		expect(result).not.toContain("## Operational Constraints");
		expect(result).not.toContain("## Skills");
	});

	it("should include skills section", () => {
		const spec: BriefSpec = { ...baseSpec, skills: ["custom-skill/"] };
		const result = compile({ spec, personality: "" });
		expect(result).toContain("## Skills");
		expect(result).toContain(".agentbrief/test-brief/skills/custom-skill/");
	});
});

describe("per-engine compilation", () => {
	const fullSpec: BriefSpec = {
		name: "security-auditor",
		version: "1.0.0",
		description: "OWASP-based security review agent",
		knowledge: ["owasp.md", "policies/"],
		skills: ["scan/"],
		scale: { timeout: 120, concurrency: 5, engine: "claude-code", model: "claude-sonnet-4-6" },
	};

	const personality = [
		"## Role",
		"",
		"You are a senior security auditor specializing in web application security. Your primary responsibility is to review code changes for security vulnerabilities.",
		"",
		"You approach code review methodically, checking each change against known vulnerability patterns.",
		"",
		"## Constraints",
		"",
		"- Never approve code with SQL injection vectors",
		"- Always check for XSS in user-facing output",
		"- Flag any hardcoded credentials as critical",
	].join("\n");

	it("should produce full output for claude-code", () => {
		const result = compile({ spec: fullSpec, personality, engine: "claude-code" });

		// Full header with description and "do not edit"
		expect(result).toContain("# AgentBrief: security-auditor");
		expect(result).toContain("> OWASP-based security review agent");
		expect(result).toContain("Do not edit this section manually");

		// Full personality (prose preserved)
		expect(result).toContain("Your primary responsibility is to review code changes");
		expect(result).toContain("You approach code review methodically");

		// Full knowledge section with prose
		expect(result).toContain("## Reference Knowledge");
		expect(result).toContain("The following domain knowledge files are available");

		// Skills section
		expect(result).toContain("## Skills");
		expect(result).toContain(".agentbrief/security-auditor/skills/scan/");

		// Scale section with heading
		expect(result).toContain("## Operational Constraints");
		expect(result).toContain("Response timeout: 120s");
	});

	it("should produce minimal output for cursor", () => {
		const result = compile({ spec: fullSpec, personality, engine: "cursor" });

		// Shorter header: just name, no description blockquote, no "do not edit"
		expect(result).toContain("# security-auditor");
		expect(result).not.toContain("# AgentBrief:");
		expect(result).not.toContain("Do not edit");

		// Personality condensed: headings and lists kept, first paragraph after heading preserved
		expect(result).toContain("## Role");
		expect(result).toContain("## Constraints");
		expect(result).toContain("- Never approve code with SQL injection vectors");
		// First paragraph after heading IS kept (identity statement)
		expect(result).toContain("Your primary responsibility");
		// Subsequent prose paragraphs should be dropped
		expect(result).not.toContain("You approach code review methodically");

		// No knowledge, skills, or scale sections
		expect(result).not.toContain("Knowledge");
		expect(result).not.toContain("Skills");
		expect(result).not.toContain("Constraints:");
		expect(result).not.toContain("timeout");
	});

	it("should produce concise output for opencode", () => {
		const result = compile({ spec: fullSpec, personality, engine: "opencode" });

		// Header with description but no "do not edit"
		expect(result).toContain("# AgentBrief: security-auditor");
		expect(result).toContain("> OWASP-based security review agent");
		expect(result).not.toContain("Do not edit");

		// Personality moderated: first sentence of prose paragraphs
		expect(result).toContain("You are a senior security auditor specializing in web application security.");
		// Second sentence of first paragraph should be dropped
		expect(result).not.toContain("Your primary responsibility");
		// Second paragraph: only first sentence
		expect(result).toContain("You approach code review methodically");
		// Lists preserved
		expect(result).toContain("- Never approve code with SQL injection vectors");

		// Compact knowledge (no prose instruction)
		expect(result).toContain("## Knowledge");
		expect(result).not.toContain("The following domain knowledge files are available");
		expect(result).toContain(".agentbrief/security-auditor/knowledge/owasp.md");

		// Compact skills
		expect(result).toContain("## Skills");
		expect(result).not.toContain("The following skill directories");
		expect(result).toContain(".agentbrief/security-auditor/skills/scan/");

		// Inline scale
		expect(result).toContain("**Constraints:**");
		expect(result).toContain("timeout=120s");
		expect(result).not.toContain("## Operational Constraints");
	});

	it("should produce concise output for codex (same mode as opencode)", () => {
		const opencode = compile({ spec: fullSpec, personality, engine: "opencode" });
		const codex = compile({ spec: fullSpec, personality, engine: "codex" });
		expect(codex).toBe(opencode);
	});

	it("should default to full output when engine is omitted", () => {
		const defaultResult = compile({ spec: fullSpec, personality });
		const explicitFull = compile({ spec: fullSpec, personality, engine: "claude-code" });
		expect(defaultResult).toBe(explicitFull);
	});

	it("should handle empty personality gracefully across modes", () => {
		for (const engine of ["claude-code", "cursor", "opencode", "codex"] as const) {
			const result = compile({ spec: fullSpec, personality: "", engine });
			expect(result).toBeTruthy();
			// Should not have double blank lines from empty personality
			expect(result).not.toMatch(/\n{3,}/);
		}
	});

	it("should omit empty sections cleanly for cursor", () => {
		const minSpec: BriefSpec = { name: "minimal", version: "1.0.0" };
		const result = compile({ spec: minSpec, personality: "", engine: "cursor" });
		expect(result).toBe("# minimal");
	});
});

describe("condense", () => {
	it("should keep headings, first paragraph after heading, and lists; drop subsequent prose", () => {
		const input = [
			"## Role",
			"",
			"You are a specialist in security. You handle all reviews.",
			"",
			"- Check for SQL injection",
			"- Check for XSS",
			"",
			"This paragraph explains methodology in detail.",
		].join("\n");

		const result = condense(input);
		expect(result).toContain("## Role");
		expect(result).toContain("- Check for SQL injection");
		expect(result).toContain("- Check for XSS");
		// First paragraph after heading IS kept
		expect(result).toContain("You are a specialist");
		// Subsequent standalone prose IS dropped
		expect(result).not.toContain("This paragraph explains");
	});

	it("should preserve code blocks", () => {
		const input = ["## Example", "", "Here is some context.", "", "```typescript", "const x = 1;", "```"].join("\n");

		const result = condense(input);
		expect(result).toContain("```typescript");
		expect(result).toContain("const x = 1;");
		expect(result).toContain("```");
		// First paragraph after heading IS kept
		expect(result).toContain("Here is some context");
	});

	it("should keep numbered lists", () => {
		const input = "1. First\n2. Second\n3. Third";
		const result = condense(input);
		expect(result).toContain("1. First");
		expect(result).toContain("2. Second");
	});

	it("should collapse excessive blank lines", () => {
		const input = "## A\n\n\n\n## B";
		const result = condense(input);
		expect(result).not.toMatch(/\n{3,}/);
	});
});

describe("moderate", () => {
	it("should keep first sentence of prose paragraphs", () => {
		const input = "You are a security auditor. Your role is comprehensive. You handle many things.";
		const result = moderate(input);
		expect(result).toBe("You are a security auditor.");
	});

	it("should preserve headings intact", () => {
		const input = "## Role\n\nParagraph one. Second sentence.\n\n## Constraints";
		const result = moderate(input);
		expect(result).toContain("## Role");
		expect(result).toContain("## Constraints");
		expect(result).toContain("Paragraph one.");
		expect(result).not.toContain("Second sentence");
	});

	it("should preserve lists intact", () => {
		const input = "- Item one\n- Item two\n- Item three";
		const result = moderate(input);
		expect(result).toContain("- Item one");
		expect(result).toContain("- Item two");
		expect(result).toContain("- Item three");
	});

	it("should preserve code blocks intact", () => {
		const input = "```js\nconst x = 1;\nconst y = 2;\n```";
		const result = moderate(input);
		expect(result).toContain("const x = 1;");
		expect(result).toContain("const y = 2;");
	});

	it("should handle single-sentence paragraphs", () => {
		const input = "Only one sentence here.";
		const result = moderate(input);
		expect(result).toBe("Only one sentence here.");
	});
});
