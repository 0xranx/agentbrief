# 创建职能包——创作指南

本指南面向**职能包创作者**——将领域专长、行为规则和工作流打包成可复用职能包的人，其他人可以通过 `agentbrief use` 一键应用。

## 快速开始

```bash
agentbrief init my-agent
cd my-agent
# Edit personality.md — define who the agent is
# Add files to knowledge/ — domain references
# Add files to skills/ — workflows and methodologies
# Publish to GitHub and share
```

## 职能包结构

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

## 三个层次

### 1. personality.md — 身份名片

**始终注入**到 Agent 的指令文件中。Agent 在每次对话中都会看到这个内容。

保持精简（约 30 行）。结构如下：

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

**应该包含的内容**：角色定义、语气/风格、行为约束。

**不应该包含的内容**：代码示例、检查清单、参考表格、分步流程。这些内容属于 knowledge/ 或 skills/。

### 2. knowledge/ — 参考资料

**按需读取** —— Agent 会被告知这些文件的存在，在需要特定领域信息时去读取它们。

适合放入的内容：
- 速查表（OWASP Top 10、API 参考）
- 代码模式目录（BAD/GOOD 示例）
- 风格指南与标准文档
- 领域术语词汇表

格式：**纯 Markdown 文件**，无需特殊结构。

### 3. skills/ — 可执行工作流

**主动遵循** —— Agent 会执行的分步流程、方法论和工作流。

适合放入的内容：
- 带有明确步骤的审查检查清单
- 调试方法论（调查 → 假设 → 测试 → 修复）
- 验证关卡（运行测试 → 检查输出 → 然后才能宣布完成）
- TDD 工作流（红 → 绿 → 重构）

格式：**Markdown 文件，可选 SKILL.md 前置元数据**（见下文）。

## 技能文件规范

技能**不是**被动的参考资料——它是一个**可执行工作流**，当触发条件满足时，Agent 应主动遵循执行。这是技能与知识文件的关键区别。

### 技能 vs 知识

| | 知识 | 技能 |
|---|---|---|
| **性质** | 参考资料（需要时查阅） | 可执行工作流（按步骤遵循） |
| **Agent 行为** | 按需读取 | 触发条件匹配时激活 |
| **示例** | OWASP 速查表、代码模式 | 安全审查流程、TDD 工作流 |
| **编译输出** | "需要信息时阅读这些文件" | "使用场景：[触发条件] → 按指示执行" |

### SKILL.md 格式

兼容 [skills.sh](https://skills.sh)（89,000+ 技能）。每个技能文件包含两部分：**前置元数据**（metadata）和**正文**（instructions）。

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

### 前置元数据字段

| 字段 | 是否必填 | 说明 |
|-------|----------|-------------|
| `name` | 是 | 技能名称，小写+连字符（应与文件名匹配） |
| `description` | **是** | **触发条件**：描述 Agent 何时应激活此技能。Agent 据此判断是否使用它。 |
| `license` | 可选 | 开源许可证（例如 `MIT`、`Apache-2.0`） |
| `compatibility` | 可选 | 适配的 Agent 类型 |

**`description` 字段至关重要。** 它不只是元数据——它会成为编译输出中的触发条件：

```markdown
## Skills

When the described situation arises, read the corresponding skill file
and follow its instructions step by step.

- **security-review** — USE WHEN: Reviewing code changes, pull requests,
  or diffs for security vulnerabilities
  → `.agentbrief/security-auditor/skills/security-review/`
```

### 推荐的正文结构

| 章节 | 用途 | 是否必填 |
|---------|---------|----------|
| **Trigger** | 何时激活此技能（对前置元数据 description 的展开） | 推荐 |
| **Process** | 编号的分步指令 | **是** |
| **Output Format** | 输出结果应该是什么样的 | 推荐 |
| **Anti-patterns** | 应避免的常见错误 | 推荐 |

### 纯 Markdown（同样有效）

如果不添加前置元数据，技能仍然可以工作——只是 Agent 不会获得基于触发条件的自动激活。技能名称会从第一个标题或文件名推导。

```markdown
# Security Review Process

## Step 1: Read the Diff
...
```

## 复用生态系统中的技能

[skills.sh](https://skills.sh) 目录收录了来自 Anthropic、Vercel、GitHub 和社区的 89,000+ 技能。你可以将其中任何一个放入你的职能包的 `skills/` 目录中。

### 方法一：在 brief.yaml 中声明远程引用（推荐）

在 `brief.yaml` 中直接声明远程技能——执行 `use` 时会自动获取：

```yaml
skills:
  - skills/                                                    # your local skills
  - github:vercel-labs/next-skills/skills/next-best-practices  # remote skill
  - github:obra/superpowers/skills/tdd                         # remote skill
```

整个技能目录（SKILL.md + 其他文件）会被克隆，缓存至 `~/.agentbrief/cache/`，并复制到你的项目中。无需手动下载。

### 方法二：手动下载

将技能目录克隆到你的职能包的 `skills/` 文件夹中：

```bash
# Clone the whole repo, then copy the skill directory
git clone --depth 1 https://github.com/vercel-labs/next-skills.git /tmp/next-skills
cp -r /tmp/next-skills/skills/next-best-practices skills/
```

技能目录必须包含一个 `SKILL.md` 文件。目录中的其他所有内容会原样复制。

### 按角色推荐的技能

| 如果你的职能包关于…… | 建议添加 |
|--------------------------|----------------|
| 安全 | `security-best-practices` (supercent-io)、`better-auth-best-practices` (better-auth) |
| 代码审查 | `code-review-excellence` (wshobson)、`requesting-code-review` (obra/superpowers) |
| TypeScript | `typescript-advanced-types` (wshobson) |
| Next.js | `next-best-practices` (vercel-labs)、`vercel-react-best-practices` (vercel-labs) |
| 前端设计 | `web-design-guidelines` (vercel-labs)、`frontend-design` (anthropics/skills) |
| DevOps | `monitoring-observability` (supercent-io)、`log-analysis` (supercent-io) |
| 文档 | `technical-writing` (supercent-io)、`api-documentation` (supercent-io) |
| 增长 | `seo-audit` (coreyhaines31)、`analytics-tracking` (coreyhaines31) |
| 测试 | `webapp-testing` (anthropics/skills)、`playwright-best-practices` (supercent-io) |

在 [skills.sh](https://skills.sh) 或 [CATALOG.md](../CATALOG.md) 浏览完整目录。

## 使用 `extends` 组合职能包

你可以创建一个**组合职能包**，将多个现有职能包打包成一个。`fullstack-engineer` 就是这样将 4 个职能包合并成一个包含 9 个技能的套装的：

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

当用户运行 `agentbrief use fullstack-engineer` 时，编译器会：

1. **递归加载所有被继承的职能包**（包括它们各自的 `extends`）
2. **仅使用组合包的人格** —— 被继承职能包的人格会被忽略
3. **按目录名去重技能** —— 如果 3 个被继承的职能包都包含 `verification`，它只会出现一次
4. **合并所有被继承职能包的知识**

### 何时使用 extends

- 你想为常见工作流提供**一条命令的入门套装**
- 单个职能包单独可用，但组合起来更强大
- 你需要一个**统一的人格**，而非 4 个独立的 Role 章节堆叠

### 组合职能包结构

组合职能包仍然有自己的 `personality.md`（统一的声音），但通常没有本地的 `knowledge/` 或 `skills/` —— 一切来自被继承的职能包：

```
fullstack-engineer/
├── brief.yaml          # extends: [typescript-engineer, nextjs-developer, ...]
└── personality.md       # Unified personality for the combo
```

### 继承链

每个独立职能包都继承自 `base-agent`，它提供跨领域技能如 `agent-browser`（浏览器自动化）。继承链如下：

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

整个继承链中的所有技能会被收集、去重，然后部署到用户的项目中。

## brief.yaml 参考

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

## 发布

### 1. 推送到 GitHub

```bash
git init
git add .
git commit -m "Initial brief"
git remote add origin https://github.com/you/my-agent-brief.git
git push -u origin main
```

### 2. 其他人可以立即使用

```bash
agentbrief use github:you/my-agent-brief
```

### 3. 一个仓库中放多个职能包

你可以将多个职能包放在子目录中：

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

用户通过子目录语法引用：

```bash
agentbrief use github:you/my-briefs/security-auditor
```

### 4. 收录到官方注册表

向 [0xranx/agentbrief](https://github.com/0xranx/agentbrief) 提交 PR，将你的职能包添加到 `registry.yaml` 中。详见**[贡献指南](https://github.com/0xranx/agentbrief/blob/main/CONTRIBUTING.md)**了解要求、信任等级和审核流程。

合并后，用户只需用名称即可安装：

```bash
agentbrief use my-agent
```

### 5. 发布前预览

使用 `agentbrief preview` 查看将要注入的确切内容——不会创建任何文件：

```bash
agentbrief preview ./my-agent                # CLAUDE.md output (full)
agentbrief preview ./my-agent --engine cursor # .cursorrules output (minimal)
```

## 最佳实践

1. **personality.md 保持精简** —— 最多 30 行。只放身份信息，不放百科全书。
2. **知识用于查阅，技能用于执行** —— 如果 Agent 需要查阅 → 放知识。如果 Agent 需要逐步执行 → 放技能。
3. **使用 SKILL.md 前置元数据** —— `name` + `description` 让编译输出更有用。
4. **一个职能包 = 一个完整职能** —— 不要让用户叠加 5 个职能包才能获得一个角色。将角色需要的一切打包在一起。
5. **复用优先于编写** —— 编写技能前先查看 [skills.sh](https://skills.sh)。已有 89,000+ 技能可用。
6. **测试你的职能包** —— 在临时目录中运行 `agentbrief use ./my-brief`，检查 CLAUDE.md 输出是否正确。

## 编译方式

当用户运行 `agentbrief use` 时，你的职能包会针对不同 AI 引擎进行不同方式的编译：

| 引擎 | 文件 | 处理方式 |
|--------|------|-------------|
| Claude Code | `CLAUDE.md` | 完整输出——包含所有人格、知识引用、技能描述 |
| Cursor | `.cursorrules` | 精简——仅保留人格中的标题和列表。不含知识/技能。 |
| OpenCode/Codex | `AGENTS.md` | 简洁——每段取首句，紧凑的技能/知识引用 |

你不需要为此做任何特殊处理——编译器会自动处理。只要写好内容，它就能自动适配。
