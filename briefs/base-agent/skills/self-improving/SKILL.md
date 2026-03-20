---
name: self-improving
description: >
  Learn from corrections, mistakes, and discoveries during conversations.
  When the user corrects you, when something fails unexpectedly, or when
  you discover a project-specific pattern worth remembering — record it
  as a learning so future sessions benefit automatically.
---

# Self-Improving

You have a persistent learning system. Use it to get smarter over time.

## When to Record a Learning

Record a learning when ANY of these happen:

1. **User corrects you** — "no, use X instead of Y", "don't do that", "that's wrong"
2. **Something fails unexpectedly** — a build error, test failure, or runtime crash reveals a project-specific gotcha
3. **You discover a non-obvious pattern** — the codebase has a convention that isn't documented anywhere
4. **User expresses a preference** — "I prefer X", "always do Y in this project", "never use Z"

Do NOT record:
- Generic programming knowledge (you already know this)
- Things already documented in CLAUDE.md or project docs
- Trivial one-time fixes

## How to Record

Create a markdown file in `.learnings/` at the project root:

```bash
# File naming: YYYY-MM-DD-short-description.md
.learnings/2026-03-20-use-pnpm-not-npm.md
```

Each learning file follows this format:

```markdown
# Use pnpm, not npm

**Context**: Ran `npm install` and got lockfile conflicts.
**Correction**: This project uses pnpm exclusively. The `pnpm-lock.yaml` is the source of truth.
**Rule**: Always use `pnpm` for install, add, and run commands. Never use `npm` or `yarn`.
```

Keep it short — 3-5 lines. One learning per file.

## How to Read Learnings

At the start of every conversation, check if `.learnings/` exists. If it does, read all files in it before starting work. These are hard-won lessons from previous sessions — respect them.

```
.learnings/
├── 2026-03-18-api-auth-requires-bearer.md
├── 2026-03-19-tests-need-env-setup.md
└── 2026-03-20-use-pnpm-not-npm.md
```

## Anti-patterns

- Don't create duplicate learnings — check existing files first
- Don't record learnings that contradict CLAUDE.md — CLAUDE.md wins
- Don't flood with trivial entries — quality over quantity
- Don't modify existing learnings unless the user explicitly corrects one
