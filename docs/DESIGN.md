# AgentBrief — Design Decisions

This document records key design decisions and their rationale. When you wonder "why this way and not that way?" — look here.

## Decision 1: Directory = Brief, not a single file

### Decision

A brief is a directory, not a single YAML file.

```
my-brief/
├── brief.yaml        # Config
├── personality.md     # Identity (Role + Tone + Constraints)
├── knowledge/         # Reference materials (domain docs, cheat sheets)
└── skills/            # Executable workflows (each skill = dir with SKILL.md)
```

### Rationale

- Personality and knowledge can be large (multi-page behavior manuals, domain docs). Inlining into a single YAML is impractical.
- Directory structure is git-diff friendly — each file changes and reviews independently.
- Skills from the ecosystem (skills.sh, superpowers, gstack) are directories with supporting files.

### Rejected alternatives

- **Single YAML file** (everything inline): Unmaintainable at scale.
- **tar/zip packages**: Adds packaging/unpacking complexity.

## Decision 2: Declarative YAML spec

### Decision

`brief.yaml` describes *what* the brief is, not *how* to compile it.

### Rationale

- Non-developers (tech leads, domain experts) can edit YAML.
- Declarative means the compiler can freely decide *how* to compile — if a new engine needs a different format, the compiler upgrades independently without changing briefs.

## Decision 3: HTML comment markers for non-invasive injection

### Decision

Content injected into `CLAUDE.md` / `.cursorrules` / `AGENTS.md` is wrapped in HTML comment markers:

```markdown
<!-- agentbrief:brief-name:start -->
...compiled content...
<!-- agentbrief:brief-name:end -->
```

### Rationale

- HTML comments don't render in markdown — no visual impact on instruction files.
- Markers enable precise `eject` — only removes injected content, preserves user's own content.
- Supports multiple briefs coexisting — each brief has its own marker pair.
- Supports re-apply — replaces content between existing markers on re-use.

### Invariant

**Marker format is an API contract.** Changing marker format = breaking change. Any modification requires a migration plan.

## Decision 4: Engine-agnostic, compile-time adaptation

### Decision

Briefs are not tied to any agent engine. `agentbrief use` compiles to all engine instruction files simultaneously.

| Engine | File | Compilation Mode |
|--------|------|-----------------|
| Claude Code | `CLAUDE.md` | Full — all sections, verbose refs |
| Cursor | `.cursorrules` | Minimal — headings + first paragraph + lists only |
| OpenCode | `AGENTS.md` | Concise — first sentence per paragraph |
| Codex | `AGENTS.md` | Concise — same as OpenCode |

### Rationale

- Users may use different agents on different projects, or switch agents within a project.
- Brief value (domain knowledge + behavioral rules) is engine-independent.
- All engines use markdown instruction files — compilation output is structurally similar.

### Extension point

`ENGINE_FILES` in `types.ts` is the single source of truth. Adding a new engine requires one line.

## Decision 5: GitHub as distribution channel

### Decision

Briefs are distributed via GitHub repositories:

```bash
agentbrief use github:owner/repo
agentbrief use github:owner/repo@v1.0
agentbrief use github:owner/repo/subdir
```

No custom package registry, no hosting infrastructure.

### Rationale

| Custom registry | GitHub |
|---|---|
| Infrastructure to build and maintain | Zero cost |
| Users need new accounts | Already have GitHub accounts |
| Discovery requires building search | GitHub Search + topic tags |
| Version management to implement | git tags are native |
| Trust chain to establish | Stars, author reputation, readable source |

Brief content (personality + knowledge) is plain text. Users need to audit content before trusting it. GitHub repositories natively provide code review capability.

### Caching

GitHub-sourced briefs are shallow-cloned to `~/.agentbrief/cache/`. `lock.yaml` records commit SHA for reproducibility.

## Decision 6: Three-tier trust model + built-in registry

### Decision

Official briefs are bundled in the npm package (`briefs/` directory) and registered in `registry.yaml`. Three trust levels:

| Level | Meaning | Source |
|-------|---------|--------|
| **official** | Maintained by AgentBrief team | Built-in `briefs/` directory |
| **verified** | Community-created, reviewed via PR | Community GitHub repos |
| **community** | Self-published, not reviewed | Any GitHub repo |

### Registry format

```yaml
# registry.yaml (in the agentbrief package)
security-auditor:
  source: github:0xranx/agentbrief/briefs/security-auditor
  description: OWASP/CWE security review specialist
  trust: official
```

### Submission flow

1. Community author opens PR to add entry to `registry.yaml`
2. Maintainer reviews brief quality (see CONTRIBUTING.md)
3. Merge = listed as `verified`

### User experience

```bash
agentbrief use security-auditor    # Official — resolves from built-in briefs/
agentbrief use github:someone/repo # Community — clones from GitHub
agentbrief search security         # Searches the registry
```

## Decision 7: lock.yaml for reproducibility

### Decision

`.agentbrief/lock.yaml` records which briefs are applied:

```yaml
version: 1
briefs:
  - name: security-auditor
    source: security-auditor
    version: 1.0.0
    applied_at: '2026-03-17T10:00:00Z'
```

### Rationale

- Team members can see which briefs are active (like `package-lock.json`).
- SHA locking ensures reproducibility across machines.
- `list` command reads lock.yaml directly — no need to parse engine files.

## Decision 8: Stackable design with extends

### Decision

A project can apply multiple briefs simultaneously. Each brief has independent marker regions in engine files.

For complex combinations, `extends` composes multiple briefs into one:

```yaml
# fullstack-engineer/brief.yaml
extends:
  - typescript-engineer
  - nextjs-developer
  - design-engineer
  - code-reviewer
```

This produces a single marker block with one personality, deduplicated skills, and merged knowledge.

### Rationale

- Real agents need multi-dimensional knowledge (team standards + domain expertise + project constraints).
- Stacking is simpler than merge — no conflict resolution logic needed.
- `extends` solves the personality conflict problem (one unified personality instead of 5 separate Role sections).
- Skills are automatically deduplicated by directory name (e.g., `verification` appears once even if 3 extended briefs include it).

## Decision 9: SKILL.md ecosystem compatibility

### Decision

Skills follow the [SKILL.md format](https://skills.sh) with YAML frontmatter:

```markdown
---
name: security-review
description: Use when reviewing code for security vulnerabilities
---
# Security Review
## Process
1. ...
```

Each skill is a **directory** containing `SKILL.md` plus any supporting files. AgentBrief copies the entire directory.

### Rationale

- Compatible with 89,000+ skills on skills.sh
- `description` field serves as the trigger condition in compiled output
- Directory model allows skills to include scripts, references, templates
- No opinion on internal structure — only `SKILL.md` is required, everything else is copied as-is
