# Engine Instruction File Formats

> How AgentBrief adapts content for each AI coding agent engine.

## Comparison

| Aspect | Claude Code | Cursor | OpenCode | Codex |
|--------|------------|--------|----------|-------|
| **File** | `CLAUDE.md` | `.cursorrules` | `AGENTS.md` | `AGENTS.md` |
| **Format** | Markdown | Plain text / Markdown | Markdown | Markdown |
| **Recommended length** | 200-500 lines | <1000 tokens | <200 lines | <200 lines |
| **Token cost** | Every message (always-on) | Every message (always-on) | Per matched file | Per matched file |
| **Unique features** | Skills, MCP, Hooks, Subagents | Glob-scoped `.mdc` rules | Directory hierarchy | Override mechanism |

## Compilation Modes

AgentBrief compiles the same brief differently for each engine:

| Section | Full (Claude Code) | Concise (OpenCode/Codex) | Minimal (Cursor) |
|---------|-------------------|------------------------|-------------------|
| Header | `# AgentBrief: {name}` + description + "do not edit" | `# AgentBrief: {name}` + description | `# {name}` only |
| Personality | Full text | First sentence per paragraph | Headings + first paragraph + lists |
| Knowledge | Full section with prose + file list | Compact list | Omitted |
| Skills | Full with USE WHEN triggers + paths | Compact list | Omitted |
| Scale | Full section with bullet list | Single inline line | Omitted |

### Why different modes?

- **Claude Code** can handle verbose context (200k+ window). Full output maximizes agent capability.
- **Cursor** is extremely token-sensitive — every word is charged per message. Minimal output preserves budget.
- **OpenCode/Codex** recommend <200 lines. Concise mode balances information with brevity.

## Claude Code (CLAUDE.md)

- Pure Markdown, no schema requirements
- Loaded into context every session (always-on)
- Supports `.claude/rules/*.mdc` for path-scoped rules
- Unique: Skills (on-demand knowledge), MCP servers, Hooks, Subagents
- Large reference materials should use Skills rather than CLAUDE.md (saves tokens)

## Cursor (.cursorrules)

- Legacy format: single `.cursorrules` file at project root
- Modern format: `.cursor/rules/*.mdc` with YAML frontmatter + glob scoping
- AgentBrief currently writes to `.cursorrules` (legacy, universally supported)
- Token-sensitive: 20 global rules can add 2000+ tokens/message
- Best for: code style, framework conventions, architectural rules
- Future: AgentBrief may support `.cursor/rules/` directory format

## OpenCode (AGENTS.md)

- Pure Markdown, flexible structure
- Hierarchical: subdirectory `AGENTS.md` overrides parent
- Root file should be <200 lines
- Supports `opencode.json` alternative with glob patterns
- Good for monorepo structures (per-package instructions)

## Codex (AGENTS.md)

- Shares `AGENTS.md` format with OpenCode
- Supports `AGENTS.override.md` for layered configuration
- Hierarchical: home (`~/.codex/`) + project root + intermediate directories
