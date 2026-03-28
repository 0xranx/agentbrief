# 使用指南

使用 AgentBrief 所需了解的一切——从安装到日常工作流。

## 安装

```bash
# 全局安装（推荐）
npm install -g agentbrief

# 或免安装直接使用
npx agentbrief <command>
```

需要 Node.js 18+。

## 快速上手

```bash
# 为你的项目应用一个职能包
agentbrief use fullstack-engineer

# 就这么简单。打开一个与 AI Agent 的新对话即可。
```

这会将角色定义、领域知识和可执行技能注入到你的 Agent 指令文件中（`CLAUDE.md`、`.cursorrules`、`AGENTS.md`）。你的 Agent 现在已经变成了一名专业人士。

## 浏览可用职能包

```bash
# 查看所有官方职能包
agentbrief search

# 按关键词过滤
agentbrief search security
agentbrief search startup
```

### 快速入门组合包（combo briefs）

这些组合包将多个职能包合而为一——最适合快速上手：

| 组合包 | 你的 Agent 将获得 | 技能数 |
|--------|-------------------|--------|
| `fullstack-engineer` | 严格 TypeScript + Next.js + 无障碍 UI + PR 评审 + 浏览器测试 | 9 |
| `startup-founder` | 产品规格 + SEO + 增长分析 + 安全 + 发布规划 | 12 |
| `release-engineer` | QA 测试 + 安全审查 + CI/CD + 发布文档 | 10 |

### 单独职能包

| 职能包 | 你的 Agent 将变成…… |
|--------|---------------------|
| `security-auditor` | 引用 CWE 编号的 OWASP 安全审查员 |
| `code-reviewer` | 能发现架构和逻辑问题的高级工程师 |
| `qa-engineer` | 发现 Bug、编写测试、用原子提交修复问题的 QA |
| `typescript-engineer` | 类型安全执行者——零 `any`、穷举检查 |
| `nextjs-developer` | Next.js 15 专家（App Router、RSC、Tailwind） |
| `design-engineer` | 拥有 80 项审查清单的设计工程师 |
| `devops-sre` | 搭建 CI/CD、监控、事故响应的 SRE |
| `tech-writer` | 擅长 API 文档和发布说明的文档专家 |
| `product-manager` | 编写 PRD、使用 RICE/ICE 优先级排序的产品经理 |
| `growth-engineer` | 掌握 SEO 审计 + 数据分析 + 内容策略的增长黑客 |
| `data-analyst` | 精通指标框架和 SQL 模式的 BI 分析师 |
| `startup-advisor` | 提供 CEO 评审和发布规划的创业顾问 |
| `social-media-manager` | 负责 Twitter/X 发帖和内容策略的社交媒体经理 |
| `feishu-writer` | 飞书/Lark 文档专家——云文档、知识库、团队通知 |

## 应用职能包

### 从官方注册表安装（推荐）

```bash
agentbrief use security-auditor
agentbrief use fullstack-engineer
```

### 从 GitHub 仓库安装

```bash
agentbrief use github:owner/repo
agentbrief use github:owner/repo@v1.0
agentbrief use github:owner/repo/subdir
```

### 从本地目录安装

```bash
agentbrief use ./path/to/my-brief
```

## 应用时发生了什么

1. **知识文件** 被复制到 `.agentbrief/<brief-name>/knowledge/`
2. **技能目录** 被复制到 `.agentbrief/<brief-name>/skills/`
3. **编译后的内容** 被注入到引擎指令文件中：
   - `CLAUDE.md` — 完整输出（人格 + 知识引用 + 技能触发器）
   - `.cursorrules` — 精简输出（仅人格部分，节省 Token）
   - `AGENTS.md` — 简洁输出（每段取首句）
4. **锁文件** 在 `.agentbrief/lock.yaml` 中更新
5. **技能通过符号链接部署到引擎原生目录**，实现自动发现：
   - `.claude/skills/` — Claude Code
   - `.agents/skills/` — Codex
   - `.cursor/skills/` — Cursor（OpenCode 也支持）

这意味着你的 Agent 在启动时就能自动发现技能——不需要先读取 CLAUDE.md 中的引用。

你的 `CLAUDE.md` 中已有的内容会被保留——职能包内容以 HTML 注释标记的方式追加。

## 管理已应用的职能包

### 查看已应用内容

```bash
agentbrief list
```

输出：
```
Applied briefs:

  NAME                VERSION  SOURCE
  fullstack-engineer  v1.0.0   fullstack-engineer
  security-auditor  v1.0.0   security-auditor
```

### 查看注入的内容

```bash
# 显示注入到 CLAUDE.md 中的内容
agentbrief show fullstack-engineer
```

### 预览而不应用

```bash
# 查看 Claude Code 的编译输出
agentbrief preview security-auditor

# 查看 Cursor 的编译输出
agentbrief preview security-auditor --engine cursor
```

### 更新到最新版本

```bash
# 更新所有已应用的职能包
agentbrief update

# 更新指定职能包
agentbrief update security-auditor
```

### 移除职能包

```bash
agentbrief eject security-auditor
```

这会从引擎文件中干净地移除所有注入内容，删除已复制的知识/技能文件，并更新锁文件。你在 `CLAUDE.md` 中自己编写的内容不受影响。

## 叠加多个职能包

你可以在同一个项目中应用多个职能包：

```bash
agentbrief use security-auditor
agentbrief use qa-engineer
```

每个职能包在引擎文件中拥有独立的标记块。它们相互独立共存——移除一个不影响其他。

### 何时应使用组合包

如果你要应用 3 个及以上的职能包，建议考虑使用组合包：

```bash
# 与其这样：
agentbrief use typescript-engineer
agentbrief use nextjs-developer
agentbrief use design-engineer
agentbrief use code-reviewer

# 不如使用组合包：
agentbrief use fullstack-engineer
```

组合包（`extends`）会产生单个标记块，包含：
- **统一的人格定义**（不会出现冲突的角色定义）
- **去重后的技能**（例如 `verification` 即使被 3 个基础职能包包含也只出现一次）
- **合并的知识**（所有参考材料汇总在一起）

## 文件与目录

应用职能包后，你的项目结构如下：

```
my-project/
├── .agentbrief/                    # ← 添加到 .gitignore
│   ├── lock.yaml                   # 记录哪些职能包已应用
│   └── security-auditor/
│       ├── knowledge/              # 复制的参考材料
│       │   ├── owasp-cheatsheet.md
│       │   └── code-patterns.md
│       └── skills/                 # 复制的技能工作流
│           ├── security-review/
│           │   └── SKILL.md
│           ├── systematic-debugging/
│           │   └── SKILL.md
│           └── verification/
│               └── SKILL.md
├── CLAUDE.md                       # ← 提交此文件（团队共享 Agent 行为）
├── .cursorrules                    # ← 提交此文件
└── AGENTS.md                       # ← 提交此文件
```

此外，技能会通过符号链接部署到引擎原生目录：

```
.claude/skills/           # Claude Code 自动发现
├── security-review → ../.agentbrief/security-auditor/skills/security-review
├── verification → ...
└── ...
.agents/skills/           # Codex 自动发现
.cursor/skills/           # Cursor 自动发现
```

将这些目录和 `.agentbrief/` 一起添加到 `.gitignore`：
```
.agentbrief/
.claude/skills/
.agents/skills/
.cursor/skills/
```

### 哪些应该提交

- **提交** 引擎指令文件（`CLAUDE.md`、`.cursorrules`、`AGENTS.md`）——这样团队成员共享相同的 Agent 行为
- **Gitignore** `.agentbrief/` 目录——这是生成的数据，可通过 `agentbrief use` 重新创建

在你的 `.gitignore` 中添加：
```
.agentbrief/
.claude/skills/
.agents/skills/
.cursor/skills/
```

## 引擎特定行为

AgentBrief 会根据不同引擎将同一职能包编译为不同形式：

| 引擎 | 文件 | 包含内容 |
|------|------|----------|
| **Claude Code** | `CLAUDE.md` | 全部内容：人格、知识引用、带 USE WHEN 条件的技能触发器、规模约束 |
| **Cursor** | `.cursorrules` | 精简内容：仅人格标题 + 首段 + 列表。不含知识或技能（节省 Token） |
| **OpenCode** | `AGENTS.md` | 简洁内容：每段取首句，紧凑的知识/技能引用 |
| **Codex** | `AGENTS.md` | 与 OpenCode 相同 |

这意味着 Claude Code 用户获得最丰富的体验（带触发条件的技能），而 Cursor 用户获得精简的人格描述，不会占用过多 Token 预算。

## 技能的工作原理

每个职能包包含可执行技能——当特定情况出现时，你的 Agent 会遵循的分步工作流。

在编译后的 `CLAUDE.md` 中，技能以如下形式呈现：

```markdown
## Skills

When the described situation arises, read the corresponding skill file
and follow its instructions step by step.

- **security-review** — USE WHEN: Reviewing code for security vulnerabilities
  → `.agentbrief/security-auditor/skills/security-review/`
```

当触发条件匹配时，Agent 会读取完整的 `SKILL.md` 文件，然后遵循其中定义的流程执行。

每个职能包还会从基础层（`base-agent`）继承 `agent-browser` 技能，赋予你的 Agent 浏览器自动化能力，用于视觉验证。

### 自我进化

每个职能包都从 `base-agent` 继承了 `self-improving` 技能。当 Agent 被纠正、遇到意外错误、或发现项目特有的模式时，它会将经验记录到 `.learnings/*.md` 文件中。后续对话会自动读取这些记录——你的 Agent 会越用越聪明。

## 故障排除

### "Unknown brief" 错误

```
Error: Unknown brief: "my-brief". Use a registry name, local path, or GitHub reference.
```

该职能包名称不在官方注册表中。请使用完整路径：
```bash
agentbrief use github:owner/repo
agentbrief use ./local/path
```

### Agent 没有变化

1. **开启一个新对话** —— Agent 在对话开始时读取指令文件，而非对话进行中
2. **检查 CLAUDE.md** —— 打开文件确认职能包内容已存在
3. **运行 `agentbrief show <name>`** —— 确认内容已被注入

### CLAUDE.md 太长

```
⚠ CLAUDE.md is 420 lines (recommended: < 300).
```

使用组合包（`extends`）代替叠加多个单独职能包。组合包产生一个紧凑的块，而非多个。

### 移除没有清理干净

再次运行 `agentbrief eject <name>`。如果内容仍然残留，手动删除标记：
```
<!-- agentbrief:name:start -->
...
<!-- agentbrief:name:end -->
```

### 职能包版本过旧

```bash
agentbrief update        # 更新所有已应用的职能包
agentbrief update <name> # 更新指定职能包
```

## CLI 命令参考

所有命令和选项的完整参考。

### `use <source>`

将职能包应用到当前项目。

```bash
agentbrief use security-auditor              # 从官方注册表
agentbrief use github:owner/repo             # 从 GitHub
agentbrief use github:owner/repo@v1.0        # 从 GitHub 指定标签
agentbrief use github:owner/repo/subdir      # GitHub 仓库子目录
agentbrief use ./path/to/my-brief            # 从本地目录
agentbrief use fullstack-engineer --dir /path/to/project  # 应用到其他目录
```

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-d, --dir <path>` | 目标项目目录 | `.`（当前目录） |

### `eject <name>`

从当前项目移除职能包。从引擎文件中清除注入内容，删除复制的知识/技能文件，并更新锁文件。

```bash
agentbrief eject security-auditor
agentbrief eject security-auditor --dir /path/to/project
```

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-d, --dir <path>` | 目标项目目录 | `.` |

### `list`

显示当前项目中已应用的所有职能包。

```bash
agentbrief list
agentbrief list --dir /path/to/project
```

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-d, --dir <path>` | 目标项目目录 | `.` |

### `show <name>`

打印指定职能包注入到 `CLAUDE.md` 中的编译内容。

```bash
agentbrief show security-auditor
```

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-d, --dir <path>` | 目标项目目录 | `.` |

### `update [name]`

从原始来源重新应用职能包，获取最新版本。

```bash
agentbrief update                  # 更新所有已应用的职能包
agentbrief update security-auditor # 更新指定职能包
```

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-d, --dir <path>` | 目标项目目录 | `.` |

### `preview <source>`

预览职能包的编译输出而不实际应用。对职能包创建者查看注入效果很有用。

```bash
agentbrief preview security-auditor                  # CLAUDE.md 输出（完整）
agentbrief preview security-auditor --engine cursor   # .cursorrules 输出（精简）
agentbrief preview ./my-brief --engine opencode       # AGENTS.md 输出（简洁）
```

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-e, --engine <engine>` | 目标引擎：`claude-code`、`cursor`、`opencode`、`codex` | `claude-code` |

### `search [query]`

浏览官方注册表中的可用职能包。可选按关键词过滤。

```bash
agentbrief search              # 列出所有职能包
agentbrief search security     # 按关键词过滤
agentbrief search startup      # 按关键词过滤
```

### `init <name>`

搭建一个具有标准目录结构的新职能包。创建 `brief.yaml`、`personality.md` 和 `knowledge/` 目录。

```bash
agentbrief init my-agent                          # 创建在 ./my-agent/
agentbrief init my-agent --dir /path/to/dir       # 创建在指定目录
agentbrief init my-agent --description "My agent" # 设置描述
agentbrief init my-agent --template security      # 从模板开始
```

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `-d, --dir <path>` | 目标目录 | `./<name>` |
| `--description <text>` | 职能包描述 | `<name> agent brief` |
| `-t, --template <name>` | 使用模板（例如 `security`） | 无 |

生成的结构：

```
my-agent/
├── brief.yaml          # name、version、description、知识引用
├── personality.md       # 角色 / 语气 / 约束（带引导注释）
└── knowledge/           # 在此添加你的领域参考材料
```
