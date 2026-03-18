# AgentBrief

[![CI](https://github.com/0xranx/agentbrief/actions/workflows/ci.yml/badge.svg)](https://github.com/0xranx/agentbrief/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/agentbrief)](https://www.npmjs.com/package/agentbrief)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> Pluggable role definitions for AI coding agents.
>
> [Website](https://0xranx.github.io/agentbrief) · [Catalog](./CATALOG.md) · [npm](https://www.npmjs.com/package/agentbrief)

One command turns your Claude Code / Cursor / OpenCode / Codex from a generic assistant into a specialized professional.

```bash
npx agentbrief use fullstack-dev
# Your agent now enforces strict TypeScript, follows Next.js conventions,
# builds accessible UIs, and reviews PRs like a staff engineer — 8 skills in 1 command
```

## What It Does

AgentBrief compiles a **brief** (role definition + domain knowledge + executable skills) into the instruction files your AI agent reads — `CLAUDE.md`, `.cursorrules`, `AGENTS.md` — with content automatically adapted for each engine.

<details>
<summary><b>See it in action</b> — what happens when you run <code>agentbrief use fullstack-dev</code></summary>

Your `CLAUDE.md` gets this injected (existing content preserved):

```markdown
<!-- agentbrief:fullstack-dev:start -->
# AgentBrief: fullstack-dev

## Role
You are a senior full-stack TypeScript developer. You build production
applications with Next.js 15, React 19, and Tailwind CSS. You enforce
strict type safety and review your own code with principal-engineer rigor.

## Constraints
- Never use `any` — always annotate return types on exports
- Server Components by default — only add 'use client' when needed
- WCAG 2.1 AA minimum — semantic HTML, keyboard navigation

## Skills
- **next-best-practices** — USE WHEN: Writing Next.js code
- **typescript-advanced-types** — USE WHEN: Complex type logic
- **architecture-review** — USE WHEN: Reviewing PRs
- **design-review-checklist** — USE WHEN: Checking UI quality
- **agent-browser** — USE WHEN: Visual verification needed
  ...and 4 more
<!-- agentbrief:fullstack-dev:end -->
```

Cleanly removable with `agentbrief eject fullstack-dev`.
</details>

### Before vs After — real conversation difference

```
WITHOUT a brief:
  You: "Review this code for issues"
  Agent: "The code looks good overall. Consider adding error handling."

WITH security-auditor brief:
  You: "Review this code for issues"
  Agent: "CWE-89 CRITICAL at line 23: SQL injection via string concatenation.
         Attack vector: attacker injects arbitrary SQL through userId param.
         Fix: const query = 'SELECT * FROM users WHERE id = $1';
              await db.query(query, [userId]);"
```

### Built from the most trusted sources in the ecosystem

Every official brief is curated from battle-tested, community-endorsed skills — not written from scratch:

- [obra/superpowers](https://github.com/obra/superpowers) **(90.6k ★)** — TDD, systematic debugging, verification
- [anthropics/skills](https://github.com/anthropics/skills) **(95.8k ★)** — Anthropic's official skill packages
- [garrytan/gstack](https://github.com/garrytan/gstack) **(YC CEO)** — CEO review, design review, QA
- [vercel-labs](https://github.com/vercel-labs/agent-browser) **(Vercel official)** — Next.js best practices, browser automation
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — SEO audit, launch strategy, analytics

### Key features

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

**⚡ Quick Start Packs** — best if you're not sure where to begin:

| Pack | What your agent gains |
|------|----------------------|
| `fullstack-dev` | Strict TypeScript + Next.js conventions + accessible UI + PR reviews (9 skills) |
| `startup-kit` | Product specs + SEO audit + growth analytics + security review + launch strategy (12 skills) |

**Code Quality & Engineering:**

| Brief | Your agent becomes... |
|-------|----------------------|
| `security-auditor` | OWASP security reviewer who cites CWE numbers |
| `code-reviewer` | Staff engineer who catches architecture + logic issues |
| `qa-engineer` | QA who finds bugs, writes tests, fixes with atomic commits |
| `typescript-strict` | Type safety enforcer — zero `any`, exhaustive checks |
| `nextjs-fullstack` | Next.js 15 specialist (App Router, RSC, Tailwind) |
| `frontend-design` | Design engineer with 80-item review checklist |
| `devops-sre` | SRE who sets up CI/CD, monitoring, incident response |
| `tech-writer` | Documentation specialist with API docs + release notes |

**Product, Growth & Business:**

| Brief | Your agent becomes... |
|-------|----------------------|
| `product-manager` | PM who writes PRDs with RICE/ICE prioritization |
| `growth-engineer` | Growth hacker with SEO audit + analytics + content strategy |
| `data-analyst` | BI analyst with metrics frameworks + SQL patterns |
| `startup-builder` | Startup advisor with CEO review + launch planning |

Browse the **[full Catalog](./CATALOG.md)** or the **[Website](https://0xranx.github.io/agentbrief)** to see details for each brief.

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
