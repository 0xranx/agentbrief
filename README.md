# AgentBrief

[![CI](https://github.com/0xranx/agentbrief/actions/workflows/ci.yml/badge.svg)](https://github.com/0xranx/agentbrief/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/agentbrief)](https://www.npmjs.com/package/agentbrief)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> Pluggable role definitions for AI coding agents.
>
> [Website](https://0xranx.github.io/agentbrief) · [Catalog](./CATALOG.md) · [npm](https://www.npmjs.com/package/agentbrief)

One command turns your Claude Code / Cursor / OpenCode / Codex from a generic assistant into a specialized professional.

```bash
npx agentbrief use security-auditor
# Your AI coding agent is now an OWASP security auditor
```

## What It Does

AgentBrief compiles a **brief** (role definition + domain knowledge + executable skills) into the instruction files your AI agent reads — `CLAUDE.md`, `.cursorrules`, `AGENTS.md` — with content automatically adapted for each engine.

<details>
<summary><b>See it in action</b> — before vs after applying <code>security-auditor</code></summary>

**Before** — your CLAUDE.md:
```markdown
# My Project
```

**After** — `agentbrief use security-auditor`:
```markdown
# My Project

<!-- agentbrief:security-auditor:start -->
# AgentBrief: security-auditor
> OWASP/CWE security review specialist

## Role
You are a senior application security auditor. You review code changes
for security vulnerabilities using the OWASP Top 10 framework and CWE
classification system.

## Constraints
- Never approve code containing known injection vectors
- Flag all hardcoded credentials as Critical severity
- Every finding must reference a CWE identifier

## Skills
When the described situation arises, read the skill file and follow its instructions.

- **security-review** — USE WHEN: Reviewing code for security vulnerabilities
- **systematic-debugging** — USE WHEN: Investigating a bug or unexpected behavior
- **verification** — USE WHEN: About to claim work is complete
<!-- agentbrief:security-auditor:end -->
```

Your existing content is preserved. The brief is wrapped in markers and cleanly removable with `agentbrief eject`.
</details>

- **One command to apply, one to remove** — `use` and `eject`
- **Non-invasive** — injected content is wrapped in markers, your existing files are untouched
- **Stackable** — apply multiple briefs; later ones layer on top
- **Engine-agnostic** — compiles to all engines simultaneously, optimized for each

## Install

```bash
npm install -g agentbrief
# or
pnpm add -g agentbrief
```

## Usage

```bash
# Apply from the official registry (short name)
agentbrief use security-auditor
agentbrief use nextjs-fullstack
agentbrief use typescript-strict

# Apply from GitHub
agentbrief use github:owner/repo
agentbrief use github:owner/repo@v1.0

# Apply from local path
agentbrief use ./path/to/brief

# Browse available briefs
agentbrief search
agentbrief search security

# Manage applied briefs
agentbrief list
agentbrief show <name>
agentbrief update
agentbrief eject <name>

# Create a new brief
agentbrief init my-agent
agentbrief init my-agent --template security
```

## Official Registry

```bash
agentbrief search
```

```
Available briefs:

  NAME               TRUST      DESCRIPTION
  security-auditor   official   OWASP/CWE security review specialist
  code-reviewer      official   Rigorous PR review — naming, tests, architecture
  typescript-strict  official   TypeScript type safety guardian — zero any
  nextjs-fullstack   official   Next.js 15 + App Router + React 19 + Tailwind
  frontend-design    official   React + Tailwind + shadcn/ui design engineering
  devops-sre         official   Infrastructure monitoring, incident response, IaC
  tech-writer        official   Technical documentation with style guide adherence
  growth-engineer    official   CRO, SEO, analytics, growth engineering
  product-manager    official   PRD generation, user stories, prioritization
  startup-builder    official   Idea validation → MVP → launch workflow
  qa-engineer        official   Automated QA — find bugs, write tests, fix with atomic commits
  data-analyst       official   Business intelligence — metrics, SQL, dashboards, data storytelling
  fullstack-dev      official   Full-stack TypeScript developer — extends 4 briefs, 8 skills
  startup-kit        official   Startup builder kit — extends 4 briefs, 9 skills
```

Just type `agentbrief use <name>` — no need for full GitHub URLs.

Browse the **[full Catalog](./CATALOG.md)** for more roles across development, product, marketing, operations, finance, legal, and startup — with links to community resources.

## What's a Brief?

A directory containing:

```
my-brief/
├── brief.yaml          # Config: name, version, skills (local + remote)
├── personality.md      # Identity: role, tone, constraints
├── knowledge/          # Reference: domain materials (read on demand)
│   └── cheatsheet.md
└── skills/             # Workflows: executable skill directories
    └── my-skill/       #   each skill = directory with SKILL.md
        ├── SKILL.md    #   trigger condition + step-by-step process
        └── ...         #   any supporting files
```

See `examples/security-auditor/` for a complete example.

## Create & Publish Your Own

Share your expertise as a reusable brief:

1. **Scaffold** — `agentbrief init my-agent` (or `--template security`)
2. **Customize** — Edit `personality.md`, add `knowledge/` and `skills/`
3. **Test** — `agentbrief use ./my-agent` in a temp directory
4. **Preview** — `agentbrief preview ./my-agent` to see compiled output
5. **Publish** — Push to GitHub → `agentbrief use github:you/my-agent`

Want it in the official registry? [Submit a PR](./CONTRIBUTING.md). Read the full **[Authoring Guide](https://0xranx.github.io/agentbrief/docs.html#AUTHORING)**.

## Supported Engines

AgentBrief compiles each brief with optimizations for the target engine:

| Engine | File | Compilation |
|--------|------|------------|
| Claude Code | `CLAUDE.md` | Full — all sections, verbose knowledge refs |
| Cursor | `.cursorrules` | Minimal — headings + first paragraph + lists, no knowledge/scale |
| OpenCode | `AGENTS.md` | Concise — first sentence per paragraph, compact refs |
| Codex | `AGENTS.md` | Concise — same as OpenCode |

## .gitignore

```
# Add to your .gitignore
.agentbrief/
```

Commit the engine instruction files (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`) so your team shares the same agent behavior.

## Community

- [GitHub Discussions](https://github.com/0xranx/agentbrief/discussions) — Questions, showcase your briefs, feature ideas
- [Contributing Guide](./CONTRIBUTING.md) — How to submit briefs to the registry

## License

[MIT](./LICENSE)
