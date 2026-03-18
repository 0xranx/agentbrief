# AgentBrief — Vision & Philosophy

## One-Line Positioning

**A package manager for AI coding agent role definitions.**

AgentBrief doesn't create new agents or provide a runtime. Users already have Claude Code, Cursor, OpenCode, and Codex — they're general-purpose "blank slate" assistants. AgentBrief turns a blank slate into a domain specialist.

## Why This Project Exists

AI coding agents (Claude Code, Cursor, OpenCode, Codex) are already powerful. But every time you start an agent in a new project, it's a blank page — it doesn't know your team's conventions, your business domain, or how you want it to behave.

Users currently hand-write `CLAUDE.md`, `.cursorrules`, or `AGENTS.md` from scratch. This creates three problems:

1. **Repetitive work** — You rewrite similar instructions for every project.
2. **Knowledge isn't portable** — One person's carefully tuned agent behavior can't be shared with the team or community.
3. **No standardization** — Everyone's agent behaves differently. There's no shared "job description."

AgentBrief solves all three.

## Core Analogy: eslint-config-airbnb

Airbnb packaged their code standards into `eslint-config-airbnb`. Anyone can `npm install` it. You don't need to understand the 400 rules behind it — install and it works.

AgentBrief is the same pattern: someone packages a "security auditor's" knowledge, personality, and behavioral rules into a brief. You `agentbrief use` it and it works. No need to write 50 lines of CLAUDE.md yourself.

## User Mental Model

Users should have only one concept in mind:

> **What kind of specialist does my project need?**

Not "what parameters do I configure" or "what prompt do I write" — but: I need a security expert, a frontend reviewer, a technical writer. Pick one, install it, get to work.

## Two User Roles

### Users (the majority)

```bash
# My project needs someone who knows security
agentbrief use security-auditor

# Add a reviewer who knows our team standards
agentbrief use code-reviewer

# See what's applied
agentbrief list

# Don't need it anymore
agentbrief eject security-auditor
```

They don't care how CLAUDE.md works or what `.cursorrules` format looks like. They only care that the agent got smarter.

### Creators (the minority)

Tech leads, domain experts, or community contributors who distill their experience into a brief:

```bash
agentbrief init code-reviewer
# Edit personality.md — define the review style
# Add to knowledge/ — team standards documents
# Add to skills/ — review workflows
# Push to GitHub
```

Their motivation is straightforward: **"I don't want to explain our standards to every new hire. Let the agent enforce them."**

## Brief Composition

A brief contains three layers:

### 1. Personality

The agent's role, tone, communication style, and behavioral constraints. This isn't a system prompt — it's a complete "job behavior handbook."

- Always injected into the agent's instruction file
- Should be concise (~30 lines)
- Structure: Role → Tone → Constraints

### 2. Knowledge

Reference materials the agent needs to do its job. Markdown files or directories that are copied to the project and referenced in the agent's instruction file.

- Read on demand by the agent
- Domain cheat sheets, code pattern catalogs, style guides

### 3. Skills

Executable workflows the agent follows step by step. Each skill is a directory containing a `SKILL.md` file with trigger conditions and a defined process.

- Activated when the trigger condition matches
- Compatible with [skills.sh](https://skills.sh) SKILL.md format
- Can be sourced from the ecosystem (obra/superpowers, gstack, vercel-labs, etc.)

## Core Experience Principles

### 1. One command to apply, one to remove

No install steps, no config files, no restarts. After `use`, the next agent conversation is immediately different. After `eject`, it's back to normal.

### 2. Invisible operation

Users don't need to change how they interact with the agent. No special prefixes, no @mentions, no mode switching. The agent naturally has new capabilities.

### 3. Stackable and composable

```bash
agentbrief use base-standards      # Foundation: team-wide conventions
agentbrief use react-specialist    # Layer: React-specific knowledge
```

Or use `extends` to compose multiple briefs into one with automatic skill deduplication:

```bash
agentbrief use fullstack-engineer   # Combines 4 briefs → 9 skills, 1 personality
```

### 4. Non-invasive

Injected content is wrapped in clear markers (`<!-- agentbrief:name:start/end -->`). User's existing instruction files are untouched. `eject` cleanly removes everything.

### 5. Engine-agnostic

Briefs aren't tied to any engine. `agentbrief use` automatically compiles to all engine instruction files, with content optimized per engine (full for Claude Code, minimal for Cursor, concise for OpenCode/Codex).

### 6. Transparent and auditable

Users can always see what a brief injected. Open `CLAUDE.md` and read it. Use `agentbrief show <name>` or `agentbrief preview ./brief` to inspect without applying.

## Use Cases

| Scenario | User Action | Effect |
|----------|-------------|--------|
| **Team standardization** | `agentbrief use @company/standards` | New hires' agents automatically follow coding standards, PR norms, architecture constraints |
| **Security audit** | `agentbrief use security-auditor` | Agent reviews code as an OWASP security expert before release |
| **Domain development** | `agentbrief use nextjs-developer` | Agent knows Next.js 15 App Router conventions, Tailwind patterns |
| **Documentation** | `agentbrief use tech-writer` | Agent writes docs following the style guide with proper structure |
| **Startup** | `agentbrief use startup-cto` | Agent combines product, growth, security, and startup advisor skills |
| **Open source** | `agentbrief use my-project-conventions` | Contributors' agents understand your architecture and contribution guidelines |
