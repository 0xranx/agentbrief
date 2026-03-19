# 引擎指令文件格式

> AgentBrief 如何针对不同 AI 编码 Agent 引擎适配内容。

## 对比

| 方面 | Claude Code | Cursor | OpenCode | Codex |
|------|------------|--------|----------|-------|
| **文件** | `CLAUDE.md` | `.cursorrules` | `AGENTS.md` | `AGENTS.md` |
| **格式** | Markdown | 纯文本 / Markdown | Markdown | Markdown |
| **建议长度** | 200-500 行 | <1000 token | <200 行 | <200 行 |
| **Token 开销** | 每条消息（始终加载） | 每条消息（始终加载） | 按匹配文件 | 按匹配文件 |
| **独有特性** | 技能、MCP、Hooks、子 Agent | 基于 Glob 的 `.mdc` 规则 | 目录层级 | 覆盖机制 |

## 编译模式

AgentBrief 将同一个职能包针对不同引擎进行差异化编译：

| 章节 | 完整版（Claude Code） | 简洁版（OpenCode/Codex） | 精简版（Cursor） |
|------|---------------------|------------------------|-----------------|
| 头部 | `# AgentBrief: {name}` + 描述 + "请勿编辑" | `# AgentBrief: {name}` + 描述 | 仅 `# {name}` |
| 人格 | 完整文本 | 每段取第一句话 | 标题 + 第一段 + 列表 |
| 知识 | 完整章节，含说明文字 + 文件列表 | 紧凑列表 | 省略 |
| 技能 | 完整展示，含 USE WHEN 触发条件 + 路径 | 紧凑列表 | 省略 |
| 扩展配置 | 完整章节，含项目符号列表 | 单行内联 | 省略 |

### 为什么要区分模式？

- **Claude Code** 能处理详尽的上下文（200k+ 窗口）。完整输出最大化 Agent 能力。
- **Cursor** 对 token 极度敏感——每个词都计入每条消息的开销。精简输出节省预算。
- **OpenCode/Codex** 建议不超过 200 行。简洁模式在信息量和简短之间取得平衡。

## Claude Code (CLAUDE.md)

- 纯 Markdown，无模式要求
- 每次会话加载到上下文中（始终加载）
- 支持 `.claude/rules/*.mdc` 实现按路径生效的规则
- 独有特性：技能（按需知识）、MCP 服务器、Hooks、子 Agent
- 大型参考资料应使用技能而非 CLAUDE.md（节省 token）

## Cursor (.cursorrules)

- 旧格式：项目根目录下的单个 `.cursorrules` 文件
- 新格式：`.cursor/rules/*.mdc`，支持 YAML frontmatter + glob 作用域
- AgentBrief 目前写入 `.cursorrules`（旧格式，通用支持）
- 对 token 敏感：20 条全局规则可能增加 2000+ token/消息
- 最适合：代码风格、框架规范、架构规则
- 未来计划：AgentBrief 可能支持 `.cursor/rules/` 目录格式

## OpenCode (AGENTS.md)

- 纯 Markdown，结构灵活
- 层级化：子目录的 `AGENTS.md` 覆盖父级
- 根文件应控制在 200 行以内
- 支持 `opencode.json` 替代方案，可使用 glob 模式
- 适合 monorepo 结构（按包设置指令）

## Codex (AGENTS.md)

- 与 OpenCode 共享 `AGENTS.md` 格式
- 支持 `AGENTS.override.md` 实现分层配置
- 层级化：主目录（`~/.codex/`）+ 项目根目录 + 中间目录
