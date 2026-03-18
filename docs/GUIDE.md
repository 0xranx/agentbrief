# User Guide

Everything you need to use AgentBrief — from install to daily workflow.

## Install

```bash
# Global install (recommended)
npm install -g agentbrief

# Or use without installing
npx agentbrief <command>
```

Requires Node.js 18+.

## Quick Start

```bash
# Apply a brief to your project
agentbrief use fullstack-engineer

# That's it. Open a new conversation with your AI agent.
```

This injects role definitions, domain knowledge, and executable skills into your agent's instruction files (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`). Your agent now behaves as a specialist.

## Browse Available Briefs

```bash
# See all official briefs
agentbrief search

# Filter by keyword
agentbrief search security
agentbrief search startup
```

### Quick Start Packs (combo briefs)

These combine multiple briefs into one — best for getting started:

| Pack | What your agent gains | Skills |
|------|----------------------|--------|
| `fullstack-engineer` | Strict TypeScript + Next.js + accessible UI + PR reviews + browser testing | 9 |
| `startup-cto` | Product specs + SEO + growth analytics + security + launch planning | 12 |
| `release-engineer` | QA testing + security review + CI/CD + release documentation | 10 |

### Individual Briefs

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
| `product-manager` | PM who writes PRDs with RICE/ICE prioritization |
| `growth-engineer` | Growth hacker with SEO audit + analytics + content strategy |
| `data-analyst` | BI analyst with metrics frameworks + SQL patterns |
| `startup-advisor` | Startup advisor with CEO review + launch planning |

## Apply a Brief

### From the official registry (recommended)

```bash
agentbrief use security-auditor
agentbrief use fullstack-engineer
```

### From a GitHub repository

```bash
agentbrief use github:owner/repo
agentbrief use github:owner/repo@v1.0
agentbrief use github:owner/repo/subdir
```

### From a local directory

```bash
agentbrief use ./path/to/my-brief
```

## What Happens When You Apply

1. **Knowledge files** are copied to `.agentbrief/<brief-name>/knowledge/`
2. **Skill directories** are copied to `.agentbrief/<brief-name>/skills/`
3. **Compiled content** is injected into engine instruction files:
   - `CLAUDE.md` — full output (personality + knowledge refs + skill triggers)
   - `.cursorrules` — minimal output (personality only, token-efficient)
   - `AGENTS.md` — concise output (first sentence per paragraph)
4. **Lock file** is updated at `.agentbrief/lock.yaml`

Your existing `CLAUDE.md` content is preserved — the brief is appended between HTML comment markers.

## Manage Applied Briefs

### See what's applied

```bash
agentbrief list
```

Output:
```
Applied briefs:

  NAME                VERSION  SOURCE
  fullstack-engineer  v1.0.0   fullstack-engineer
  security-auditor  v1.0.0   security-auditor
```

### View injected content

```bash
# Show what was injected into CLAUDE.md
agentbrief show fullstack-engineer
```

### Preview without applying

```bash
# See compiled output for Claude Code
agentbrief preview security-auditor

# See compiled output for Cursor
agentbrief preview security-auditor --engine cursor
```

### Update to latest version

```bash
# Update all applied briefs
agentbrief update

# Update a specific brief
agentbrief update security-auditor
```

### Remove a brief

```bash
agentbrief eject security-auditor
```

This cleanly removes all injected content from engine files, deletes copied knowledge/skills, and updates the lock file. Your own content in `CLAUDE.md` is untouched.

## Stacking Multiple Briefs

You can apply multiple briefs to the same project:

```bash
agentbrief use security-auditor
agentbrief use qa-engineer
```

Each brief gets its own marker block in the engine files. They coexist independently — eject one without affecting others.

### When to use combo packs instead

If you're applying 3+ briefs, consider a combo pack instead:

```bash
# Instead of:
agentbrief use typescript-engineer
agentbrief use nextjs-developer
agentbrief use design-engineer
agentbrief use code-reviewer

# Use the combo:
agentbrief use fullstack-engineer
```

Combo packs (`extends`) produce a single marker block with:
- **One unified personality** (no conflicting Role definitions)
- **Deduplicated skills** (e.g., `verification` appears once even if 3 base briefs include it)
- **Merged knowledge** (all reference materials combined)

## Files and Directories

After applying a brief, your project looks like:

```
my-project/
├── .agentbrief/                    # ← Add to .gitignore
│   ├── lock.yaml                   # Which briefs are applied
│   └── security-auditor/
│       ├── knowledge/              # Copied reference materials
│       │   ├── owasp-cheatsheet.md
│       │   └── code-patterns.md
│       └── skills/                 # Copied skill workflows
│           ├── security-review/
│           │   └── SKILL.md
│           ├── systematic-debugging/
│           │   └── SKILL.md
│           └── verification/
│               └── SKILL.md
├── CLAUDE.md                       # ← Commit this (team shares behavior)
├── .cursorrules                    # ← Commit this
└── AGENTS.md                       # ← Commit this
```

### What to commit

- **Commit** engine instruction files (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`) — so your team shares the same agent behavior
- **Gitignore** `.agentbrief/` — it's generated data, recreatable with `agentbrief use`

Add to your `.gitignore`:
```
.agentbrief/
```

## Engine-Specific Behavior

AgentBrief compiles the same brief differently for each engine:

| Engine | File | What's included |
|--------|------|----------------|
| **Claude Code** | `CLAUDE.md` | Everything: personality, knowledge refs, skill triggers with USE WHEN conditions, scale constraints |
| **Cursor** | `.cursorrules` | Minimal: personality headings + first paragraph + lists only. No knowledge or skills (token-efficient) |
| **OpenCode** | `AGENTS.md` | Concise: first sentence per paragraph, compact knowledge/skill refs |
| **Codex** | `AGENTS.md` | Same as OpenCode |

This means Claude Code users get the richest experience (skills with trigger conditions), while Cursor users get a lean personality that doesn't eat into their token budget.

## How Skills Work

Each brief includes executable skills — step-by-step workflows your agent follows when specific situations arise.

In the compiled `CLAUDE.md`, skills appear as:

```markdown
## Skills

When the described situation arises, read the corresponding skill file
and follow its instructions step by step.

- **security-review** — USE WHEN: Reviewing code for security vulnerabilities
  → `.agentbrief/security-auditor/skills/security-review/`
```

The agent reads the full `SKILL.md` file when the trigger condition matches, then follows the process defined inside.

Every brief also inherits `agent-browser` from the foundation layer (`base-agent`), giving your agent browser automation capabilities for visual verification.

## Troubleshooting

### "Unknown brief" error

```
Error: Unknown brief: "my-brief". Use a registry name, local path, or GitHub reference.
```

The brief name isn't in the official registry. Use the full path:
```bash
agentbrief use github:owner/repo
agentbrief use ./local/path
```

### Agent doesn't seem different

1. **Start a new conversation** — the agent reads instruction files at conversation start, not mid-conversation
2. **Check CLAUDE.md** — open it and verify the brief content is there
3. **Run `agentbrief show <name>`** — confirms the content was injected

### CLAUDE.md is too long

```
⚠ CLAUDE.md is 420 lines (recommended: < 300).
```

Use a combo pack (`extends`) instead of stacking individual briefs. Combo packs produce one compact block instead of multiple.

### Eject didn't clean everything

Run `agentbrief eject <name>` again. If content remains, manually delete the markers:
```
<!-- agentbrief:name:start -->
...
<!-- agentbrief:name:end -->
```

### Brief is outdated

```bash
agentbrief update        # Updates all applied briefs
agentbrief update <name> # Updates a specific brief
```
