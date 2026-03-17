# Changelog

## 0.1.0 (2026-03-17)

### Features

- Core pipeline: resolve → load → compile → inject
- Per-engine compilation: full (Claude Code), concise (OpenCode/Codex), minimal (Cursor)
- Local and GitHub source resolution with shallow clone caching
- Brief stacking — multiple briefs coexist in the same engine files
- Non-invasive injection with HTML comment markers (`<!-- agentbrief:name:start/end -->`)
- Knowledge and skills file copying to `.agentbrief/` data directory
- Lock file (`.agentbrief/lock.yaml`) for reproducibility
- CLI commands: `use`, `eject`, `list`, `init`, `show`, `update`
- Template support for `init --template`
- Curated catalog (CATALOG.md) covering development, product, marketing, operations, finance, legal, and startup roles
