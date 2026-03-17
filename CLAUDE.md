# AgentBrief — Project Conventions for Claude Code

> 完整的项目理念见 `docs/VISION.md`，设计决策见 `docs/DESIGN.md`。
> 如果你是新会话，**请先读这两个文件**再动手改代码。

## Project Context（项目上下文概要）

AgentBrief 是一个 CLI 工具——给 AI Coding Agent 装"职业技能包"的包管理器。

- **定位**：用户在自己的工程目录下运行 `agentbrief use <source>`，该目录下的 Agent（Claude Code / Cursor / OpenCode / Codex）就自动变成一个具备特定人格、领域知识和技能的"数字员工"。
- **类比**：eslint-config-airbnb 之于代码规范 = AgentBrief 之于 Agent 行为规范。
- **与 GolemBot 的关系**：独立项目，互补关系。GolemBot 是 runtime（让 Agent 跑起来、接入 IM 渠道），AgentBrief 是 definition（定义 Agent 是谁）。两者不强绑定，AgentBrief 单独可用。
- **分发模型**：去中心化，GitHub 仓库即 brief 包，git tag 即版本。通过 `0xranx/agentbrief-registry` 索引仓库提供官方认证（official / verified / community 三级信任）。
- **核心体验**：一条命令生效、一条命令撤销、可叠加、非侵入、引擎无关。

## Architecture

### Core Flow

```
resolve(source)  →  load(brief.yaml)  →  compile(spec + personality)  →  inject(engine files)
                                                                       →  copy(knowledge, skills)
                                                                       →  update(lock.yaml)
```

### File Responsibility Boundaries

| File | Responsibility | Should Not Contain |
|------|---------------|--------------------|
| `types.ts` | All type definitions, engine file mappings | Logic |
| `brief.ts` | Load and validate brief.yaml, load personality.md | Compilation, injection |
| `compiler.ts` | Compile brief spec + personality → markdown string | File I/O, injection |
| `injector.ts` | Inject/eject markdown into engine instruction files | Brief loading, compilation |
| `resolver.ts` | Resolve source strings (local path, github:) to local dirs | Brief loading, injection |
| `lock.ts` | Read/write .agentbrief/lock.yaml, clean brief data dirs | Injection, compilation |
| `index.ts` | Public API (use, eject, list, init), orchestration | Engine-specific logic |
| `cli.ts` | Argument parsing, call public API, format output | Business logic |

### Things You Must Never Do

1. **Don't put business logic in cli.ts** — it only parses arguments and formats output.
2. **Don't mix concerns across modules** — compiler doesn't do I/O, injector doesn't load briefs.
3. **Don't hardcode engine file paths outside types.ts** — `ENGINE_FILES` in `types.ts` is the single source of truth.
4. **Don't break injection markers** — the `<!-- agentbrief:name:start/end -->` format is the contract for non-destructive inject/eject. Changing the marker format is a breaking change.
5. **Don't引入新的核心抽象** — 项目只有两个核心概念：Brief（说明书）和 Engine Target（注入目标）。不要引入 Plugin、Registry、Pipeline 等新抽象。

## Development Workflow

### Quality Gate: Every Change Must Have E2E Tests

**This is a hard rule.** Any feature addition or bug fix must include an end-to-end test that:

1. Creates a realistic scenario (temp directories with real brief files, real project structures)
2. Exercises the full pipeline (resolve → load → compile → inject → verify output)
3. Verifies the user-visible outcome (file contents, lock state, CLI output)
4. Tests the reverse operation where applicable (eject, re-apply, update)

Unit tests for individual modules are good, but **not sufficient on their own**. The E2E test in `index.test.ts` is the quality baseline — it tests `use()` and `eject()` with real files on disk.

### Test Conventions

- Location: `src/__tests__/<module>.test.ts`
- Use real filesystem with `tmpdir()` — no mocking for file I/O
- Clean up temp dirs in `afterEach`
- Test names should describe the user-visible behavior, not implementation details

### Running

```bash
pnpm run build        # TypeScript compile
pnpm run test         # Unit + E2E tests (vitest)
```

### Before Merging Any Change

1. `pnpm run build` passes — no TypeScript errors
2. `pnpm run test` passes — all tests green
3. New feature → new tests covering the happy path + at least one error path
4. Bug fix → new test that would have caught the bug

## Brief Spec Format

The `brief.yaml` schema (see `types.ts` → `BriefSpec`):

```yaml
name: string          # required — unique identifier
version: string       # required — semver
description: string   # optional
personality: string   # optional — relative path to .md file (default: personality.md)
scale:                # optional
  concurrency: number
  timeout: number
  engine: string
  model: string
knowledge:            # optional — relative paths to files/dirs
  - knowledge/
skills:               # optional — relative paths to skill dirs
  - skills/custom-skill/
```

## Injection Format

Compiled briefs are injected between markers:

```markdown
<!-- agentbrief:brief-name:start -->
# AgentBrief: brief-name
...compiled content...
<!-- agentbrief:brief-name:end -->
```

Multiple briefs can coexist in the same file. The injector replaces content between matching markers on re-apply.

## Source Resolution

| Format | Example | Resolves To |
|--------|---------|-------------|
| Local path | `./my-brief` | Absolute path on disk |
| GitHub | `github:owner/repo` | Cloned to `~/.agentbrief/cache/` |
| GitHub + tag | `github:owner/repo@v1.0` | Cloned at specific tag |
| GitHub + subdir | `github:owner/repo/path` | Subdirectory of repo |
