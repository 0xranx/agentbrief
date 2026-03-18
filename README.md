# AgentBrief

> Pluggable role definitions for AI coding agents.
>
> [Website](https://0xranx.github.io/agentbrief) · [Catalog](./CATALOG.md) · [npm](https://www.npmjs.com/package/agentbrief)

One command turns your Claude Code / Cursor / OpenCode / Codex from a generic assistant into a specialized professional.

```bash
npx agentbrief use security-auditor
# Your AI coding agent is now an OWASP security auditor
```

## What It Does

AgentBrief compiles a **brief** (role definition + domain knowledge + behavioral rules) into the instruction files your AI agent reads — `CLAUDE.md`, `.cursorrules`, `AGENTS.md` — with content automatically adapted for each engine.

```
Before: Generic AI assistant that knows nothing about your domain
After:   Security auditor that cites CWE numbers, checks OWASP Top 10,
         and refuses to approve code with injection vulnerabilities
```

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

See `examples/security-auditor/` for a complete example. Read the **[Authoring Guide](./docs/AUTHORING.md)** to create your own.

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

## License

[MIT](./LICENSE)
