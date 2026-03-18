import { exec } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eject, list, use } from "../index.js";

const execAsync = promisify(exec);
const CLI_PATH = resolve(import.meta.dirname, "../../dist/cli.js");

// ── Test fixtures: realistic brief content ──────────────

const SECURITY_AUDITOR_YAML = `
name: security-auditor
version: "2.1.0"
description: OWASP-based security review agent
personality: personality.md
knowledge:
  - owasp-top-10.md
  - policies/
skills:
  - scan/
scale:
  timeout: 120
  concurrency: 5
  engine: claude-code
  model: claude-sonnet-4-6
`.trim();

// Multi-paragraph personality with mixed content: prose, headings, lists, code blocks
const SECURITY_AUDITOR_PERSONALITY = `
## Role

You are a senior security auditor specializing in web application security. Your primary responsibility is to review code changes for security vulnerabilities, with deep knowledge of the OWASP Top 10 and common attack vectors.

You approach code review methodically, checking each change against known vulnerability patterns before approving. When you find issues, you always provide concrete remediation guidance.

## Tone & Style

Be direct and specific when reporting findings. When you identify a vulnerability, cite the exact CWE number and explain the attack vector in plain language. Do not soften critical findings — clarity saves lives in security.

Use bullet points for findings. Each finding should include severity, location, and recommended fix.

## Review Checklist

- Check all user inputs for injection vulnerabilities (SQL, XSS, command injection)
- Verify authentication and authorization on every endpoint
- Look for hardcoded secrets (API keys, passwords, tokens)
- Review cryptographic usage for known weak algorithms
- Check for insecure deserialization patterns

## Code Patterns to Flag

\`\`\`javascript
// BAD: SQL injection via string concatenation
const query = "SELECT * FROM users WHERE id = " + userId;

// GOOD: Parameterized query
const query = "SELECT * FROM users WHERE id = $1";
\`\`\`

## Constraints

- Never approve code with known SQL injection vectors
- Always check for XSS in user-facing output
- Flag any hardcoded credentials as critical severity
- When unsure about severity, escalate rather than dismiss
- All findings must reference a CWE identifier
`.trim();

const OWASP_KNOWLEDGE = `
# OWASP Top 10 Quick Reference

## A01: Broken Access Control
- Enforce least privilege
- Deny by default
- Rate limit API access

## A02: Cryptographic Failures
- Use strong algorithms (AES-256, RSA-2048+)
- Never store plaintext passwords
- Use TLS 1.2+ for data in transit

## A03: Injection
- Use parameterized queries
- Validate and sanitize all input
- Escape output contextually
`.trim();

const REFUND_POLICY = `
# Security Policy: Credential Rotation

All API keys must be rotated every 90 days.
Compromised credentials must be revoked within 1 hour.
`.trim();

const SCAN_SKILL_PROMPT = `
# Security Scan Skill

Perform a comprehensive security scan of the specified file or directory.
Report findings in SARIF format.
`.trim();

const CODE_REVIEWER_YAML = `
name: code-reviewer
version: "1.0.0"
description: Thorough code reviewer
`.trim();

const CODE_REVIEWER_PERSONALITY = `
## Role

You are a meticulous code reviewer who focuses on code quality, maintainability, and correctness. You care deeply about naming conventions and test coverage.

## Standards

- All public functions must have doc comments
- Variable names must be descriptive (no single-letter names except loop counters)
- Prefer pure functions over side effects
`.trim();

// ── Helper to scaffold a brief on disk ──────────────────

async function createSecurityAuditorBrief(briefDir: string) {
	await mkdir(briefDir, { recursive: true });
	await writeFile(join(briefDir, "brief.yaml"), SECURITY_AUDITOR_YAML, "utf-8");
	await writeFile(join(briefDir, "personality.md"), SECURITY_AUDITOR_PERSONALITY, "utf-8");
	await writeFile(join(briefDir, "owasp-top-10.md"), OWASP_KNOWLEDGE, "utf-8");
	await mkdir(join(briefDir, "policies"), { recursive: true });
	await writeFile(join(briefDir, "policies", "credential-rotation.md"), REFUND_POLICY, "utf-8");
	await mkdir(join(briefDir, "scan"), { recursive: true });
	await writeFile(join(briefDir, "scan", "prompt.md"), SCAN_SKILL_PROMPT, "utf-8");
}

async function createCodeReviewerBrief(briefDir: string) {
	await mkdir(briefDir, { recursive: true });
	await writeFile(join(briefDir, "brief.yaml"), CODE_REVIEWER_YAML, "utf-8");
	await writeFile(join(briefDir, "personality.md"), CODE_REVIEWER_PERSONALITY, "utf-8");
}

// ── Integration tests ───────────────────────────────────

describe("integration: realistic brief", () => {
	let baseDir: string;
	let briefDir: string;
	let projectDir: string;

	beforeEach(async () => {
		baseDir = join(tmpdir(), `agentbrief-integ-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		briefDir = join(baseDir, "security-auditor");
		projectDir = join(baseDir, "project");
		await createSecurityAuditorBrief(briefDir);
		await mkdir(projectDir, { recursive: true });
	});

	afterEach(async () => {
		await rm(baseDir, { recursive: true, force: true });
	});

	// ── Scenario 1: CLAUDE.md full output ──────────────

	it("CLAUDE.md should contain full unabridged content", async () => {
		await use({ source: briefDir, projectDir });
		const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");

		// Header
		expect(claude).toContain("# AgentBrief: security-auditor");
		expect(claude).toContain("> OWASP-based security review agent");
		expect(claude).toContain("Do not edit this section manually");

		// Full personality prose preserved
		expect(claude).toContain("Your primary responsibility is to review code changes for security vulnerabilities");
		expect(claude).toContain(
			"You approach code review methodically, checking each change against known vulnerability patterns",
		);
		expect(claude).toContain("Be direct and specific when reporting findings");
		expect(claude).toContain("Do not soften critical findings — clarity saves lives in security");

		// Lists preserved
		expect(claude).toContain("- Check all user inputs for injection vulnerabilities");
		expect(claude).toContain("- All findings must reference a CWE identifier");

		// Code block preserved
		expect(claude).toContain("```javascript");
		expect(claude).toContain('SELECT * FROM users WHERE id = " + userId');
		expect(claude).toContain("```");

		// Full knowledge section with prose explanation
		expect(claude).toContain("## Reference Knowledge");
		expect(claude).toContain("The following domain knowledge files are available");
		expect(claude).toContain(".agentbrief/security-auditor/knowledge/owasp-top-10.md");
		// Directory entries flatten to the knowledge root
		expect(claude).toContain(".agentbrief/security-auditor/knowledge/");

		// Full skills section
		expect(claude).toContain("## Skills");
		expect(claude).toContain("follow its instructions step by step");

		// Full scale section
		expect(claude).toContain("## Operational Constraints");
		expect(claude).toContain("- Response timeout: 120s");
		expect(claude).toContain("- Max concurrency: 5");
		expect(claude).toContain("- Preferred engine: claude-code");
		expect(claude).toContain("- Preferred model: claude-sonnet-4-6");
	});

	// ── Scenario 2: .cursorrules minimal output ────────

	it(".cursorrules should contain condensed content (headings + lists only)", async () => {
		await use({ source: briefDir, projectDir });
		const cursor = await readFile(join(projectDir, ".cursorrules"), "utf-8");

		// Short header — just the name
		expect(cursor).toContain("# security-auditor");
		expect(cursor).not.toContain("# AgentBrief:");
		expect(cursor).not.toContain("Do not edit");
		expect(cursor).not.toContain("OWASP-based security review agent");

		// Headings preserved
		expect(cursor).toContain("## Role");
		expect(cursor).toContain("## Tone & Style");
		expect(cursor).toContain("## Review Checklist");
		expect(cursor).toContain("## Code Patterns to Flag");
		expect(cursor).toContain("## Constraints");

		// Lists preserved
		expect(cursor).toContain("- Check all user inputs for injection vulnerabilities");
		expect(cursor).toContain("- Never approve code with known SQL injection vectors");
		expect(cursor).toContain("- All findings must reference a CWE identifier");

		// Code blocks preserved
		expect(cursor).toContain("```javascript");
		expect(cursor).toContain('SELECT * FROM users WHERE id = " + userId');

		// First paragraph after heading IS kept (identity/context statement)
		expect(cursor).toContain("Your primary responsibility");
		// Subsequent prose paragraphs DROPPED
		expect(cursor).not.toContain("You approach code review methodically");

		// No knowledge, skills, or scale
		expect(cursor).not.toContain("Knowledge");
		expect(cursor).not.toContain("Skills");
		expect(cursor).not.toContain("timeout");
		expect(cursor).not.toContain("concurrency");

		// Should be significantly shorter than CLAUDE.md
		const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
		expect(cursor.length).toBeLessThan(claude.length * 0.7);
	});

	// ── Scenario 3: AGENTS.md concise output ───────────

	it("AGENTS.md should contain moderately condensed content", async () => {
		await use({ source: briefDir, projectDir });
		const agents = await readFile(join(projectDir, "AGENTS.md"), "utf-8");

		// Header with description but no "do not edit"
		expect(agents).toContain("# AgentBrief: security-auditor");
		expect(agents).toContain("> OWASP-based security review agent");
		expect(agents).not.toContain("Do not edit");

		// Personality moderated: first sentence of each prose paragraph kept
		expect(agents).toContain("You are a senior security auditor specializing in web application security.");
		// Second sentence of first paragraph dropped
		expect(agents).not.toContain("Your primary responsibility");

		expect(agents).toContain("You approach code review methodically");
		// But the rest of that paragraph is dropped
		expect(agents).not.toContain("When you find issues");

		expect(agents).toContain("Be direct and specific when reporting findings.");
		// Second sentence dropped
		expect(agents).not.toContain("cite the exact CWE number");

		// Lists and headings fully preserved
		expect(agents).toContain("## Review Checklist");
		expect(agents).toContain("- Check all user inputs for injection vulnerabilities");
		expect(agents).toContain("## Constraints");
		expect(agents).toContain("- Never approve code with known SQL injection vectors");

		// Code blocks preserved
		expect(agents).toContain("```javascript");

		// Compact knowledge (no prose)
		expect(agents).toContain("## Knowledge");
		expect(agents).not.toContain("The following domain knowledge files are available");
		expect(agents).toContain(".agentbrief/security-auditor/knowledge/owasp-top-10.md");

		// Compact skills
		expect(agents).toContain("## Skills");
		// Compact skills listing (no verbose prose)
		expect(agents).not.toContain("detailed instructions");

		// Inline scale
		expect(agents).toContain("**Constraints:**");
		expect(agents).toContain("timeout=120s");
		expect(agents).not.toContain("## Operational Constraints");
	});

	// ── Scenario 4: stacking two briefs ────────────────

	it("should stack two briefs in all engine files", async () => {
		const reviewerDir = join(baseDir, "code-reviewer");
		await createCodeReviewerBrief(reviewerDir);

		await use({ source: briefDir, projectDir });
		await use({ source: reviewerDir, projectDir });

		for (const file of ["CLAUDE.md", ".cursorrules", "AGENTS.md"]) {
			const content = await readFile(join(projectDir, file), "utf-8");
			// Both briefs have markers
			expect(content).toContain("agentbrief:security-auditor:start");
			expect(content).toContain("agentbrief:security-auditor:end");
			expect(content).toContain("agentbrief:code-reviewer:start");
			expect(content).toContain("agentbrief:code-reviewer:end");
		}

		// Lock has both
		const entries = await list(projectDir);
		expect(entries).toHaveLength(2);
		expect(entries.map((e) => e.name).sort()).toEqual(["code-reviewer", "security-auditor"]);
	});

	// ── Scenario 5: re-apply updates content ───────────

	it("should replace content on re-apply", async () => {
		await use({ source: briefDir, projectDir });

		// Modify personality
		await writeFile(
			join(briefDir, "personality.md"),
			"## Role\n\nYou are an updated security specialist with new capabilities.\n",
			"utf-8",
		);
		await use({ source: briefDir, projectDir });

		const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
		expect(claude).toContain("updated security specialist");
		expect(claude).not.toContain("senior security auditor");

		// Only one set of markers
		const starts = claude.match(/agentbrief:security-auditor:start/g);
		expect(starts).toHaveLength(1);
	});

	// ── Scenario 6: eject one of two briefs ────────────

	it("should eject one brief while preserving the other", async () => {
		const reviewerDir = join(baseDir, "code-reviewer");
		await createCodeReviewerBrief(reviewerDir);

		await use({ source: briefDir, projectDir });
		await use({ source: reviewerDir, projectDir });
		await eject("security-auditor", projectDir);

		// All engine files: security-auditor gone, code-reviewer stays
		for (const file of ["CLAUDE.md", ".cursorrules", "AGENTS.md"]) {
			const content = await readFile(join(projectDir, file), "utf-8");
			expect(content).not.toContain("security-auditor");
			expect(content).toContain("agentbrief:code-reviewer:start");
		}

		// Knowledge/skills cleaned
		expect(existsSync(join(projectDir, ".agentbrief", "security-auditor"))).toBe(false);

		// Lock only has code-reviewer
		const entries = await list(projectDir);
		expect(entries).toHaveLength(1);
		expect(entries[0].name).toBe("code-reviewer");
	});

	// ── Scenario 7: preserve existing user content ─────

	it("should preserve existing user content in engine files", async () => {
		// User has pre-existing CLAUDE.md
		const userContent =
			"# My Project\n\nThis is my hand-written project description.\n\n## Build\n\n```bash\npnpm run build\n```\n";
		await writeFile(join(projectDir, "CLAUDE.md"), userContent, "utf-8");

		await use({ source: briefDir, projectDir });

		const claude = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
		// User content preserved
		expect(claude).toContain("# My Project");
		expect(claude).toContain("This is my hand-written project description");
		expect(claude).toContain("pnpm run build");
		// Brief content also present
		expect(claude).toContain("agentbrief:security-auditor:start");

		// After eject, user content is restored
		await eject("security-auditor", projectDir);
		const afterEject = await readFile(join(projectDir, "CLAUDE.md"), "utf-8");
		expect(afterEject).toContain("# My Project");
		expect(afterEject).toContain("This is my hand-written project description");
		expect(afterEject).not.toContain("security-auditor");
	});
});

// ── CLI subprocess tests ────────────────────────────────

describe("integration: CLI commands", () => {
	let baseDir: string;
	let briefDir: string;
	let projectDir: string;

	beforeEach(async () => {
		baseDir = join(tmpdir(), `agentbrief-cli-${Date.now()}-${Math.random().toString(36).slice(2)}`);
		briefDir = join(baseDir, "security-auditor");
		projectDir = join(baseDir, "project");
		await createSecurityAuditorBrief(briefDir);
		await mkdir(projectDir, { recursive: true });
	});

	afterEach(async () => {
		await rm(baseDir, { recursive: true, force: true });
	});

	it("CLI use command should apply brief and report success", async () => {
		const { stdout } = await execAsync(`node ${CLI_PATH} use ${briefDir} -d ${projectDir}`);
		expect(stdout).toContain('Applied "security-auditor"');
		expect(stdout).toContain("v2.1.0");
		expect(stdout).toContain("CLAUDE.md");

		// Verify files were actually created
		expect(existsSync(join(projectDir, "CLAUDE.md"))).toBe(true);
		expect(existsSync(join(projectDir, ".cursorrules"))).toBe(true);
		expect(existsSync(join(projectDir, "AGENTS.md"))).toBe(true);
	});

	it("CLI list command should show applied briefs", async () => {
		await execAsync(`node ${CLI_PATH} use ${briefDir} -d ${projectDir}`);
		const { stdout } = await execAsync(`node ${CLI_PATH} list -d ${projectDir}`);
		expect(stdout).toContain("security-auditor");
		expect(stdout).toContain("v2.1.0");
	});
});
