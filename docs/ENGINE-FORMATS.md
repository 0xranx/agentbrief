# 引擎指令文件格式研究

> AgentBrief 支持的四大 AI Coding Agent 引擎的指令文件格式差异。
> 此文档指导 compiler.ts 中的 per-engine 编译策略。

## 对比总览

| 维度 | Claude Code | Cursor | OpenCode | Codex |
|------|------------|--------|----------|-------|
| **文件名** | `CLAUDE.md` | `.cursorrules` 或 `.cursor/rules/*.mdc` | `AGENTS.md` | `AGENTS.md` |
| **格式** | Markdown | 纯文本/Markdown（`.mdc` 带 YAML frontmatter） | Markdown | Markdown |
| **Schema** | 无 | `.mdc` 有 frontmatter（description, globs, alwaysApply） | 无 | 无 |
| **作用域** | 基于路径的 rules（`.claude/rules/`） | Glob 匹配的模块化规则 | 目录树层级（就近优先） | 目录树层级 + override |
| **独有能力** | Skills, MCP, Hooks, Subagents | Glob pattern matching, 模块化 `.mdc` | Monorepo 层级 | Override 机制, fallback names |
| **建议长度** | 200-500 行 | ~1000 tokens（规则），~2000 max | ~200 行（root） | ~200 行（root） |
| **Token 开销** | 每条消息都加载（always-on） | 每条消息都加载 | 按匹配文件加载 | 按匹配文件加载 |

## Claude Code (CLAUDE.md)

- 纯 Markdown，无 schema 要求
- 每次会话都全文加载到 context，always-on 上下文
- 建议 200-500 行内，过长导致 "context squeeze"
- 支持 `.claude/rules/*.mdc` 做路径作用域规则
- 独有功能：Skills（按需加载的知识/提示模板）、MCP server、Hooks、Subagents
- 大块参考资料应放 Skills 而非 CLAUDE.md（节省 token）

## Cursor (.cursorrules / .cursor/rules/*.mdc)

- 旧格式 `.cursorrules`：项目根目录纯文本/Markdown（仍被支持）
- 新格式 `.cursor/rules/*.mdc`：YAML frontmatter + Markdown
  ```yaml
  ---
  description: Rule description
  globs:
    - src/**/*.ts
  alwaysApply: false
  ---
  ```
- 极度 token 敏感——每个 word × 使用频率 = 巨大 token 消耗
- 20 条全局规则可能增加 2000+ tokens/message
- "Needle-in-haystack" 问题：长规则导致 AI 忽略中间部分
- 最佳实践：dense, not wordy；模块化 `.mdc` 优于单体 `.cursorrules`
- 应只包含代码风格、框架规范、架构标准

## OpenCode (AGENTS.md)

- 纯 Markdown，灵活格式
- 层级目录结构：子目录的 AGENTS.md 覆盖父目录
- Root 文件建议 < 200 行
- 每个 section 建议 10-20 行
- 支持 `opencode.json` 的 `instructions` 字段作为替代
- 全局配置：`~/.config/opencode/AGENTS.md`
- 适合 monorepo 结构（每个包独立指令）

## Codex (AGENTS.md)

- 与 OpenCode 共享 AGENTS.md 格式
- 支持 `AGENTS.override.md` 覆盖
- 层级：Home(`~/.codex/`) + 项目根 + 中间目录
- 支持 `project_doc_fallback_filenames` 配置

## AgentBrief 编译策略

基于以上研究，compiler.ts 实现了三级编译模式：

| Section | full (Claude Code) | concise (OpenCode/Codex) | minimal (Cursor) |
|---------|-------------------|------------------------|-------------------|
| Header | `# AgentBrief: {name}` + 描述 + "do not edit" | `# AgentBrief: {name}` + 描述 | `# {name}` |
| Personality | 全文 | 每段 prose 只保留首句（`moderate()`） | 仅标题+列表+代码块（`condense()`） |
| Knowledge | 完整 section + 说明 + 文件列表 | 紧凑列表 | 省略 |
| Skills | 完整 section + 目录列表 | 紧凑列表 | 省略 |
| Scale | 完整 section + 列表 | 单行内联 | 省略 |

### 未来方向

- Cursor `.cursor/rules/*.mdc` 格式支持（当前用 `.cursorrules`，未来可拆分为多个 glob 作用域规则）
- 按引擎做 personality 内容重写（不只是裁剪，而是重新组织表述方式）
