#!/usr/bin/env node
import { Command } from "commander";
import { eject, init, list, preview, search, show, update, use } from "./index.js";

const program = new Command();

program
	.name("agentbrief")
	.description("One command turns your AI coding agent into a domain specialist")
	.version("0.3.3");

program.addHelpText(
	"after",
	`
Quick start:
  agentbrief use ./path/to/brief    Apply a brief to your project
  agentbrief init my-agent          Create a new brief from scratch
  agentbrief list                   Show applied briefs

Documentation: https://github.com/0xranx/agentbrief`,
);

// ── use ─────────────────────────────────────────────────

program
	.command("use <source>")
	.description("Apply a brief to the current project")
	.option("-d, --dir <path>", "Project directory", ".")
	.action(async (source: string, opts: { dir: string }) => {
		try {
			const result = await use({ source, projectDir: opts.dir });
			console.log(`✓ Applied "${result.name}" v${result.version}`);
			console.log("");
			if (result.description) {
				console.log(`  Description:  ${result.description}`);
			}
			if (result.knowledgeCount > 0) {
				console.log(`  Knowledge:    ${result.knowledgeCount} ${result.knowledgeCount === 1 ? "entry" : "entries"}`);
			}
			if (result.skillsCount > 0) {
				console.log(`  Skills:       ${result.skillsCount} ${result.skillsCount === 1 ? "entry" : "entries"}`);
			}
			console.log("");
			console.log(`  Injected into: ${result.files.join(", ")} (${result.claudeLines} lines in CLAUDE.md)`);
			console.log("");
			console.log("  Open a new conversation with your AI coding agent to see the difference.");
			if (result.claudeLines > 500) {
				console.log("");
				console.log(
					`  ⚠ CLAUDE.md is ${result.claudeLines} lines (recommended: < 300). Consider using extends to consolidate briefs.`,
				);
			} else if (result.claudeLines > 300) {
				console.log("");
				console.log(`  Note: CLAUDE.md is ${result.claudeLines} lines. Keep it under 300 for best results.`);
			}
		} catch (err) {
			console.error(`Error: ${(err as Error).message}`);
			process.exit(1);
		}
	});

// ── eject ───────────────────────────────────────────────

program
	.command("eject <name>")
	.description("Remove a brief from the current project")
	.option("-d, --dir <path>", "Project directory", ".")
	.action(async (name: string, opts: { dir: string }) => {
		try {
			const result = await eject(name, opts.dir);
			if (result.files.length === 0) {
				console.log(`No injection found for "${name}".`);
			} else {
				console.log(`✓ Ejected "${name}" from: ${result.files.join(", ")}`);
			}
		} catch (err) {
			console.error(`Error: ${(err as Error).message}`);
			process.exit(1);
		}
	});

// ── list ────────────────────────────────────────────────

program
	.command("list")
	.description("List briefs applied to the current project")
	.option("-d, --dir <path>", "Project directory", ".")
	.action(async (opts: { dir: string }) => {
		try {
			const entries = await list(opts.dir);
			if (entries.length === 0) {
				console.log("No briefs applied.");
				return;
			}
			console.log("Applied briefs:\n");
			const nameWidth = Math.max(4, ...entries.map((e) => e.name.length));
			const header = `  ${"NAME".padEnd(nameWidth)}  VERSION  SOURCE`;
			console.log(header);
			for (const e of entries) {
				console.log(`  ${e.name.padEnd(nameWidth)}  v${e.version.padEnd(7)}  ${e.source}`);
			}
		} catch (err) {
			console.error(`Error: ${(err as Error).message}`);
			process.exit(1);
		}
	});

// ── show ────────────────────────────────────────────────

program
	.command("show <name>")
	.description("Show the injected content for a brief")
	.option("-d, --dir <path>", "Project directory", ".")
	.action(async (name: string, opts: { dir: string }) => {
		try {
			const content = await show(name, opts.dir);
			if (!content) {
				console.log(`No injection found for "${name}".`);
				process.exit(1);
			}
			console.log(content);
		} catch (err) {
			console.error(`Error: ${(err as Error).message}`);
			process.exit(1);
		}
	});

// ── update ──────────────────────────────────────────────

program
	.command("update [name]")
	.description("Re-apply briefs from their sources (fetches latest)")
	.option("-d, --dir <path>", "Project directory", ".")
	.action(async (name: string | undefined, opts: { dir: string }) => {
		try {
			const results = await update({ name, projectDir: opts.dir });
			if (results.length === 0) {
				console.log(name ? `Brief "${name}" not found.` : "No briefs applied.");
				return;
			}
			for (const r of results) {
				console.log(`✓ Updated "${r.name}" v${r.version}`);
			}
		} catch (err) {
			console.error(`Error: ${(err as Error).message}`);
			process.exit(1);
		}
	});

// ── preview ─────────────────────────────────────────────

program
	.command("preview <source>")
	.description("Preview compiled output without applying (for brief creators)")
	.option("-e, --engine <engine>", "Target engine (claude-code, cursor, opencode, codex)", "claude-code")
	.action(async (source: string, opts: { engine: string }) => {
		try {
			const content = await preview(source, opts.engine as "claude-code" | "cursor" | "opencode" | "codex");
			console.log(content);
		} catch (err) {
			console.error(`Error: ${(err as Error).message}`);
			process.exit(1);
		}
	});

// ── search ──────────────────────────────────────────────

program
	.command("search [query]")
	.description("Browse available briefs from the registry")
	.action(async (query?: string) => {
		try {
			const entries = await search(query);
			if (entries.length === 0) {
				console.log(query ? `No briefs matching "${query}".` : "Registry is empty.");
				return;
			}
			console.log("Available briefs:\n");
			const nameWidth = Math.max(4, ...entries.map((e) => e.name.length));
			console.log(`  ${"NAME".padEnd(nameWidth)}  TRUST      DESCRIPTION`);
			for (const e of entries) {
				const trust = e.trust.padEnd(9);
				console.log(`  ${e.name.padEnd(nameWidth)}  ${trust}  ${e.description || ""}`);
			}
			console.log(`\nUsage: agentbrief use <name>`);
		} catch (err) {
			console.error(`Error: ${(err as Error).message}`);
			process.exit(1);
		}
	});

// ── init ────────────────────────────────────────────────

program
	.command("init <name>")
	.description("Create a new brief")
	.option("-d, --dir <path>", "Target directory")
	.option("--description <text>", "Brief description")
	.option("-t, --template <name>", "Use a template (e.g., security)")
	.action(async (name: string, opts: { dir?: string; description?: string; template?: string }) => {
		try {
			const dir = opts.dir || `./${name}`;
			const result = await init({ name, dir, description: opts.description, template: opts.template });
			console.log(`✓ Created brief "${name}" at ${result}`);
			console.log("");
			console.log("  Next steps:");
			console.log("  1. Edit personality.md — define Role, Tone, and Constraints");
			console.log("  2. Add domain knowledge to knowledge/");
			console.log("  3. Add skills to skills/ (each skill = directory with SKILL.md)");
			console.log(`  4. Test locally: agentbrief use ./${name}`);
			console.log(`  5. Publish: git push → others use github:you/${name}`);
			console.log("");
			console.log("  Docs: https://0xranx.github.io/agentbrief/docs.html#AUTHORING");
		} catch (err) {
			console.error(`Error: ${(err as Error).message}`);
			process.exit(1);
		}
	});

program.parse();
