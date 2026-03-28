# AgentBrief

[![CI](https://github.com/0xranx/agentbrief/actions/workflows/ci.yml/badge.svg)](https://github.com/0xranx/agentbrief/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/agentbrief)](https://www.npmjs.com/package/agentbrief)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> One command turns your AI coding agent into a domain specialist.
>
> [Website](https://0xranx.github.io/agentbrief) · [Catalog](./CATALOG.md) · [npm](https://www.npmjs.com/package/agentbrief) · [中文](./README.zh-CN.md)

Your Claude Code, Cursor, OpenCode, or Codex gives generic answers because it doesn't know your domain. AgentBrief fixes that — install a **brief** and your agent gains real expertise: security auditing, code review, product specs, growth hacking, and more.

```bash
npx agentbrief use fullstack-engineer
# Your agent now enforces strict TypeScript, follows Next.js conventions,
# builds accessible UIs, and reviews PRs like a staff engineer — 9 skills in 1 command
```

## Before vs After

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

## Install

```bash
npm install -g agentbrief
# or
pnpm add -g agentbrief
```

## Quick Start Packs

Not sure where to begin? Pick a combo — each one bundles multiple specialist briefs into a single command:

```
  fullstack-engineer  →  release-engineer  →  startup-founder
       Build                 Ship                 Grow
```

| Pack | What your agent gains |
|------|----------------------|
| `fullstack-engineer` | Strict TypeScript + Next.js + accessible UI + PR reviews (9 skills) |
| `release-engineer` | QA testing + security review + CI/CD + documentation (10 skills) |
| `startup-founder` | Product specs + SEO + growth analytics + security + launch (12 skills) |

```bash
agentbrief use fullstack-engineer   # Build: write production code
agentbrief use release-engineer     # Ship: test, secure, deploy, document
agentbrief use startup-founder      # Grow: product, growth, launch strategy
```

## All Briefs

**Code Quality & Engineering:**

| Brief | Your agent becomes... |
|-------|----------------------|
| `security-auditor` | OWASP security reviewer who cites CWE numbers |
| `code-reviewer` | Staff engineer who catches architecture + logic issues |
| `qa-engineer` | QA who finds bugs, writes tests, fixes with atomic commits |
| `typescript-engineer` | Type safety enforcer — zero `any`, exhaustive checks |
| `nextjs-developer` | Next.js 15 specialist (App Router, RSC, Tailwind) |
| `design-engineer` | Design engineer with 80-item review checklist |
| `devops-sre` | SRE who sets up CI/CD, monitoring, incident response |
| `tech-writer` | Documentation specialist with API docs + release notes |

**Product, Growth & Business:**

| Brief | Your agent becomes... |
|-------|----------------------|
| `product-manager` | PM who writes PRDs with RICE/ICE prioritization |
| `growth-engineer` | Growth hacker with SEO audit + analytics + content strategy |
| `data-analyst` | BI analyst with metrics frameworks + SQL patterns |
| `startup-advisor` | Startup advisor with CEO review + launch planning |
| `social-media-manager` | Social media manager — Twitter/X + Xiaohongshu + Douyin research |
| `feishu-writer` | Feishu/Lark specialist — docs, wikis, messaging, tasks (official lark-cli) |

Browse the **[full Catalog](./CATALOG.md)** or the **[Website](https://0xranx.github.io/agentbrief)** for details on each brief.

## Usage

```bash
# Apply from the official registry
agentbrief use security-auditor

# Apply from GitHub
agentbrief use github:owner/repo
agentbrief use github:owner/repo@v1.0

# Apply from local path
agentbrief use ./path/to/brief

# Browse, inspect, manage
agentbrief search                 # List all briefs
agentbrief list                   # See what's applied
agentbrief show <name>            # View injected content
agentbrief preview <name>         # Preview without applying
agentbrief update                 # Fetch latest versions
agentbrief eject <name>           # Clean removal
```

## How It Works

AgentBrief compiles a **brief** (role + knowledge + skills) into the instruction files your AI agent reads, with content optimized per engine:

| Engine | File | Compilation |
|--------|------|------------|
| Claude Code | `CLAUDE.md` | Full — personality, knowledge refs, skill triggers |
| Cursor | `.cursorrules` | Minimal — headings + first paragraph + lists |
| OpenCode | `AGENTS.md` | Concise — first sentence per paragraph |
| Codex | `AGENTS.md` | Concise — same as OpenCode |

Your existing files are preserved — briefs are injected between `<!-- agentbrief:name:start/end -->` markers. Eject removes only the brief content.

<details>
<summary><b>See what gets injected</b> — example output for <code>fullstack-engineer</code></summary>

```markdown
<!-- agentbrief:fullstack-engineer:start -->
# AgentBrief: fullstack-engineer

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
<!-- agentbrief:fullstack-engineer:end -->
```

</details>

## What's a Brief?

```
my-brief/
├── brief.yaml          # Config: name, version, extends, skills
├── personality.md      # Identity: role, tone, constraints
├── knowledge/          # Reference: domain materials (read on demand)
│   └── cheatsheet.md
└── skills/             # Workflows: executable skill directories
    └── my-skill/
        ├── SKILL.md    # Trigger condition + step-by-step process
        └── ...         # Any supporting files
```

See [`briefs/security-auditor/`](./briefs/security-auditor/) for a complete example.

## Built on Trusted Sources

Every official brief is curated from battle-tested, community-endorsed skills:

- [obra/superpowers](https://github.com/obra/superpowers) **(90.6k ★)** — TDD, systematic debugging, verification
- [anthropics/skills](https://github.com/anthropics/skills) **(95.8k ★)** — Anthropic's official skill packages
- [garrytan/gstack](https://github.com/garrytan/gstack) **(YC CEO)** — CEO review, design review, QA
- [vercel-labs](https://github.com/vercel-labs/agent-browser) **(Vercel official)** — Next.js best practices, browser automation
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — SEO audit, launch strategy, analytics

## Create Your Own

```bash
agentbrief init my-agent              # Scaffold
# Edit personality.md, add knowledge/ and skills/
agentbrief use ./my-agent             # Test locally
agentbrief preview ./my-agent         # See compiled output
# Push to GitHub → agentbrief use github:you/my-agent
```

Want it in the official registry? [Submit a PR](./CONTRIBUTING.md). Read the **[Authoring Guide](https://0xranx.github.io/agentbrief/docs.html#AUTHORING)**.

## Community

- [GitHub Discussions](https://github.com/0xranx/agentbrief/discussions) — Questions, showcase, feature ideas
- [Contributing Guide](./CONTRIBUTING.md) — Submit briefs to the registry

Add `.agentbrief/` to your `.gitignore`. Commit the engine files (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`) so your team shares the same agent behavior.

## License

[MIT](./LICENSE)
