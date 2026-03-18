# Creating a Brief — Authoring Guide

This guide is for **brief creators** — people who package domain expertise, behavioral rules, and workflows into reusable briefs that others can apply with `agentbrief use`.

## Quick Start

```bash
agentbrief init my-agent
cd my-agent
# Edit personality.md — define who the agent is
# Add files to knowledge/ — domain references
# Add files to skills/ — workflows and methodologies
# Publish to GitHub and share
```

## Brief Structure

```
my-brief/
├── brief.yaml          # Config (required)
├── personality.md       # Identity layer: who you are (required)
├── knowledge/           # Knowledge layer: what you know (optional)
│   ├── domain-ref.md
│   └── cheatsheet.md
└── skills/              # Skill layer: how you work (optional)
    ├── review-process/  #   each skill = directory with SKILL.md
    │   └── SKILL.md
    └── verification/
        └── SKILL.md
```

## The Three Layers

### 1. personality.md — Identity Card

**Always injected** into the agent's instruction file. The agent sees this in every conversation.

Keep it concise (~30 lines). Structure:

```markdown
## Role

One paragraph defining who this agent is and what it does.

## Tone

- Communication style bullet points
- How to present findings or outputs

## Constraints

- Things the agent must never do
- Hard rules that override other instructions
```

**What goes here**: Role definition, tone/voice, behavioral constraints.

**What does NOT go here**: Code examples, checklists, reference tables, step-by-step processes. Those belong in knowledge/ or skills/.

### 2. knowledge/ — Reference Materials

**Read on demand** — the agent is told these files exist and reads them when it needs domain-specific information.

Good for:
- Cheat sheets (OWASP Top 10, API reference)
- Code pattern catalogs (BAD/GOOD examples)
- Style guides and standards documents
- Domain terminology glossaries

Format: **Plain Markdown files**. No special structure required.

### 3. skills/ — Executable Workflows

**Actively followed** — step-by-step processes, methodologies, and workflows the agent executes.

Good for:
- Review checklists with defined steps
- Debugging methodologies (investigate → hypothesize → test → fix)
- Verification gates (run tests → check output → THEN claim done)
- TDD workflows (red → green → refactor)

Format: **Markdown files with optional SKILL.md frontmatter** (see below).

## Skill File Specification

A skill is **not** passive reference material — it's an **executable workflow** that the agent should actively follow when a trigger condition is met. This is the key difference from knowledge files.

### Skill vs Knowledge

| | Knowledge | Skill |
|---|---|---|
| **Nature** | Reference material (look up when needed) | Executable workflow (follow step by step) |
| **Agent behavior** | Reads on demand | Activates when trigger condition matches |
| **Example** | OWASP cheat sheet, code patterns | Security review process, TDD workflow |
| **Compiled output** | "Read these when you need info" | "USE WHEN: [trigger] → follow instructions" |

### SKILL.md Format

Compatible with [skills.sh](https://skills.sh) (89,000+ skills). Each skill file has two parts: **frontmatter** (metadata) and **body** (instructions).

```markdown
---
name: security-review
description: >
  Reviewing code changes, pull requests, or diffs
  for security vulnerabilities
---

# Security Review

## Trigger

When asked to review code, a PR, or a diff for security concerns.

## Process

1. Read the entire diff before commenting
2. Check each changed file against the OWASP checklist
3. For each finding: identify CWE → assess severity → describe attack vector → suggest fix
4. Run `npm audit` or equivalent to check dependencies
5. Summarize findings grouped by severity (Critical → Low)

## Output Format

For each finding:
- **CWE**: CWE-XXX
- **Severity**: Critical / High / Medium / Low
- **Location**: file:line
- **Attack vector**: how an attacker would exploit this
- **Fix**: concrete code change

## Anti-patterns

- Don't approve without checking every item on the checklist
- Don't soften critical findings
- Don't skip dependency checks
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Skill name, lowercase + hyphens (should match filename) |
| `description` | **Yes** | **Trigger condition**: describes WHEN the agent should activate this skill. This is how the agent decides whether to use it. |
| `license` | Optional | Open source license (e.g., `MIT`, `Apache-2.0`) |
| `compatibility` | Optional | Which agents it's designed for |

**The `description` field is critical.** It's not just metadata — it becomes the trigger condition in the compiled output:

```markdown
## Skills

When the described situation arises, read the corresponding skill file
and follow its instructions step by step.

- **security-review** — USE WHEN: Reviewing code changes, pull requests,
  or diffs for security vulnerabilities
  → `.agentbrief/security-auditor/skills/security-review/`
```

### Recommended Body Structure

| Section | Purpose | Required |
|---------|---------|----------|
| **Trigger** | When to activate this skill (expands on frontmatter description) | Recommended |
| **Process** | Numbered step-by-step instructions | **Yes** |
| **Output Format** | What the result should look like | Recommended |
| **Anti-patterns** | Common mistakes to avoid | Recommended |

### Plain Markdown (also works)

If you don't add frontmatter, the skill still works — the agent just won't get trigger-based activation. The skill name is derived from the first heading or filename.

```markdown
# Security Review Process

## Step 1: Read the Diff
...
```

## Reusing Skills from the Ecosystem

The [skills.sh](https://skills.sh) directory has 89,000+ skills from Anthropic, Vercel, GitHub, and the community. You can drop any of them into your brief's `skills/` directory.

### Method 1: Remote Reference in brief.yaml (recommended)

Declare remote skills directly in `brief.yaml` — they're fetched automatically on `use`:

```yaml
skills:
  - skills/                                                    # your local skills
  - github:vercel-labs/next-skills/skills/next-best-practices  # remote skill
  - github:obra/superpowers/skills/tdd                         # remote skill
```

The entire skill directory (SKILL.md + any other files) is cloned, cached at `~/.agentbrief/cache/`, and copied to your project. No manual downloading.

### Method 2: Manual Download

Clone the skill directory into your brief's `skills/` folder:

```bash
# Clone the whole repo, then copy the skill directory
git clone --depth 1 https://github.com/vercel-labs/next-skills.git /tmp/next-skills
cp -r /tmp/next-skills/skills/next-best-practices skills/
```

The skill directory must contain a `SKILL.md` file. Everything else in the directory is copied as-is.

### Recommended Skills by Role

| If your brief is about... | Consider adding |
|--------------------------|----------------|
| Security | `security-best-practices` (supercent-io), `better-auth-best-practices` (better-auth) |
| Code review | `code-review-excellence` (wshobson), `requesting-code-review` (obra/superpowers) |
| TypeScript | `typescript-advanced-types` (wshobson) |
| Next.js | `next-best-practices` (vercel-labs), `vercel-react-best-practices` (vercel-labs) |
| Frontend design | `web-design-guidelines` (vercel-labs), `frontend-design` (anthropics/skills) |
| DevOps | `monitoring-observability` (supercent-io), `log-analysis` (supercent-io) |
| Documentation | `technical-writing` (supercent-io), `api-documentation` (supercent-io) |
| Growth | `seo-audit` (coreyhaines31), `analytics-tracking` (coreyhaines31) |
| Testing | `webapp-testing` (anthropics/skills), `playwright-best-practices` (supercent-io) |

Browse the full catalog at [skills.sh](https://skills.sh) or [CATALOG.md](../CATALOG.md).

## Composing Briefs with `extends`

You can create a **combo brief** that bundles multiple existing briefs into one. This is how `fullstack-engineer` combines 4 briefs into a single 9-skill package:

```yaml
# fullstack-engineer/brief.yaml
name: fullstack-engineer
version: "1.0.0"
description: Full-stack TypeScript developer with PR reviews and design QA
extends:
  - typescript-engineer
  - nextjs-developer
  - design-engineer
  - code-reviewer
```

When a user runs `agentbrief use fullstack-engineer`, the compiler:

1. **Loads all extended briefs** recursively (including their `extends`)
2. **Uses only the combo's personality** — extended briefs' personalities are ignored
3. **Deduplicates skills** by directory name — if 3 extended briefs include `verification`, it appears once
4. **Merges knowledge** from all extended briefs

### When to use extends

- You want to offer a **one-command starter pack** for a common workflow
- Individual briefs are useful alone, but even better together
- You need a **unified personality** instead of 4 separate Role sections stacking

### Combo brief structure

A combo brief still has its own `personality.md` (the unified voice), but typically has no local `knowledge/` or `skills/` — everything comes from the extended briefs:

```
fullstack-engineer/
├── brief.yaml          # extends: [typescript-engineer, nextjs-developer, ...]
└── personality.md       # Unified personality for the combo
```

### Inheritance chain

Every standalone brief extends `base-agent`, which provides cross-cutting skills like `agent-browser` (browser automation). The chain looks like:

```
base-agent (foundation)
├── typescript-engineer
├── nextjs-developer
├── design-engineer
├── code-reviewer
├── fullstack-engineer (extends all 4 above)
│
├── qa-engineer
├── security-auditor
├── devops-sre
├── tech-writer
└── release-engineer (extends all 4 above)
```

All skills from the entire chain are collected, deduplicated, and deployed to the user's project.

## brief.yaml Reference

```yaml
# Required fields
name: my-agent                    # Unique identifier (lowercase, hyphens)
version: "1.0.0"                  # Semver

# Optional fields
description: One-line description
personality: personality.md       # Path to personality file (default: personality.md)
extends:                          # Compose multiple briefs into one
  - typescript-engineer
  - nextjs-developer
knowledge:                        # Paths to knowledge files/directories
  - knowledge/
skills:                           # Paths to skill files/directories
  - skills/
scale:                            # Operational parameters
  engine: claude-code             # Preferred engine
  model: claude-sonnet-4-6        # Preferred model
  timeout: 120                    # Response timeout in seconds
  concurrency: 5                  # Max concurrent operations
```

## Publishing

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial brief"
git remote add origin https://github.com/you/my-agent-brief.git
git push -u origin main
```

### 2. Others can use it immediately

```bash
agentbrief use github:you/my-agent-brief
```

### 3. Multiple briefs in one repo

You can put multiple briefs in subdirectories:

```
my-briefs/
├── security-auditor/
│   ├── brief.yaml
│   ├── personality.md
│   └── ...
└── code-reviewer/
    ├── brief.yaml
    ├── personality.md
    └── ...
```

Users reference with subdir syntax:

```bash
agentbrief use github:you/my-briefs/security-auditor
```

### 4. Get listed in the official registry

Submit a PR to [0xranx/agentbrief](https://github.com/0xranx/agentbrief) adding your brief to `registry.yaml`. See the **[Contributing Guide](https://github.com/0xranx/agentbrief/blob/main/CONTRIBUTING.md)** for requirements, trust levels, and the review process.

Once merged, users can install with just the name:

```bash
agentbrief use my-agent
```

### 5. Preview before publishing

Use `agentbrief preview` to see exactly what gets injected — without creating any files:

```bash
agentbrief preview ./my-agent                # CLAUDE.md output (full)
agentbrief preview ./my-agent --engine cursor # .cursorrules output (minimal)
```

## Best Practices

1. **personality.md stays lean** — 30 lines max. Identity, not encyclopedia.
2. **Knowledge is for reference, skills are for process** — If the agent looks it up → knowledge. If the agent follows it step by step → skill.
3. **Use SKILL.md frontmatter** — `name` + `description` make the compiled output more useful.
4. **One brief = one complete function** — Don't make users stack 5 briefs to get one role working. Bundle everything the role needs.
5. **Reuse before writing** — Check [skills.sh](https://skills.sh) before writing a skill from scratch. 89,000+ skills already exist.
6. **Test your brief** — `agentbrief use ./my-brief` in a temp directory, check CLAUDE.md output looks right.

## How It Compiles

When a user runs `agentbrief use`, your brief is compiled differently for each AI engine:

| Engine | File | What happens |
|--------|------|-------------|
| Claude Code | `CLAUDE.md` | Full output — all personality, knowledge refs, skill descriptions |
| Cursor | `.cursorrules` | Minimal — headings + lists only from personality. No knowledge/skills. |
| OpenCode/Codex | `AGENTS.md` | Concise — first sentence per paragraph, compact skill/knowledge refs |

You don't need to do anything for this — the compiler handles it automatically. Just write good content and it adapts.
