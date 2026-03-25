# AgentBrief

[![CI](https://github.com/0xranx/agentbrief/actions/workflows/ci.yml/badge.svg)](https://github.com/0xranx/agentbrief/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/agentbrief)](https://www.npmjs.com/package/agentbrief)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> 一条命令，让你的 AI 编程 Agent 变成领域专家。
>
> [官网](https://0xranx.github.io/agentbrief/index.zh.html) · [目录](./CATALOG.md) · [npm](https://www.npmjs.com/package/agentbrief) · [English](./README.md)

你的 Claude Code、Cursor、OpenCode 或 Codex 回答总是泛泛而谈？因为它不了解你的业务领域。AgentBrief 解决这个问题——安装一个**职能包（brief）**，你的 Agent 就拥有了真正的专业能力：安全审查、代码审查、产品规划、增长运营，等等。

```bash
npx agentbrief use fullstack-engineer
# 你的 Agent 现在会执行严格 TypeScript、遵循 Next.js 规范、
# 构建无障碍 UI、像 Staff 工程师一样审查 PR —— 一条命令获得 9 项技能
```

## 效果对比

```
没有职能包：
  你："帮我审查一下这段代码"
  Agent："代码整体看起来不错。建议加一些错误处理。"

使用 security-auditor 职能包：
  你："帮我审查一下这段代码"
  Agent："CWE-89 严重 第23行：通过字符串拼接导致 SQL 注入。
         攻击向量：攻击者通过 userId 参数注入任意 SQL。
         修复：const query = 'SELECT * FROM users WHERE id = $1';
              await db.query(query, [userId]);"
```

## 安装

```bash
npm install -g agentbrief
# 或
pnpm add -g agentbrief
```

## 快速上手套装

不知道从哪开始？选一个组合包——每个都将多个专业职能包打包成一条命令：

```
  fullstack-engineer  →  release-engineer  →  startup-founder
       构建（Build）          交付（Ship）          增长（Grow）
```

| 套装 | 你的 Agent 获得… |
|------|------------------|
| `fullstack-engineer` | 严格类型 + Next.js 规范 + 无障碍 UI + PR 审查（9 项技能） |
| `release-engineer` | 自动测试 + 安全审查 + CI/CD + 发布文档（10 项技能） |
| `startup-founder` | 产品规划 + SEO 审计 + 增长分析 + 安全 + 发布策略（12 项技能） |

```bash
agentbrief use fullstack-engineer   # 构建：写生产级代码
agentbrief use release-engineer     # 交付：测试、安全、部署、文档
agentbrief use startup-founder      # 增长：产品、运营、发布策略
```

## 全部职能包

**代码质量与工程：**

| 职能包 | 你的 Agent 变成… |
|--------|------------------|
| `security-auditor` | OWASP 安全审查员，引用 CWE 编号 |
| `code-reviewer` | Staff 级工程师，捕获架构 + 逻辑问题 |
| `qa-engineer` | QA 工程师，发现 Bug、编写测试、原子提交修复 |
| `typescript-engineer` | 类型安全守卫——零 `any`、穷举检查 |
| `nextjs-developer` | Next.js 15 专家（App Router、RSC、Tailwind） |
| `design-engineer` | 设计工程师，附带 80 项审查清单 |
| `devops-sre` | SRE 工程师，搭建 CI/CD、监控、故障响应 |
| `tech-writer` | 文档专家，API 文档 + 发布说明 |

**产品、增长与商业：**

| 职能包 | 你的 Agent 变成… |
|--------|------------------|
| `product-manager` | 产品经理，PRD + RICE/ICE 优先级排序 |
| `growth-engineer` | 增长工程师，SEO 审计 + 数据分析 + 内容策略 |
| `data-analyst` | 数据分析师，指标体系 + SQL + 数据叙事 |
| `startup-advisor` | 创业顾问，CEO 审查 + 发布规划 |
| `social-media-manager` | 社媒运营，Twitter/X + 小红书 + 抖音调研 |
| `feishu-writer` | 飞书文档专家——云文档、知识库、团队通知 |

查看 **[完整目录](./CATALOG.md)** 或 **[官网](https://0xranx.github.io/agentbrief/index.zh.html)** 了解每个职能包的详情。

## 使用方法

```bash
# 从官方 registry 安装
agentbrief use security-auditor

# 从 GitHub 安装
agentbrief use github:owner/repo
agentbrief use github:owner/repo@v1.0

# 从本地目录安装
agentbrief use ./path/to/brief

# 浏览、查看、管理
agentbrief search                 # 列出所有职能包
agentbrief list                   # 查看已安装的
agentbrief show <name>            # 查看注入内容
agentbrief preview <name>         # 预览（不安装）
agentbrief update                 # 更新到最新版
agentbrief eject <name>           # 干净卸载
```

## 工作原理

AgentBrief 将**职能包**（角色 + 知识 + 技能）编译成 AI Agent 读取的指令文件，并根据引擎智能优化输出：

| 引擎 | 文件 | 编译方式 |
|------|------|---------|
| Claude Code | `CLAUDE.md` | 完整——人格、知识引用、技能触发条件 |
| Cursor | `.cursorrules` | 精简——标题 + 首段 + 列表 |
| OpenCode | `AGENTS.md` | 简洁——每段首句 |
| Codex | `AGENTS.md` | 简洁——同 OpenCode |

你的现有文件不会被覆盖——职能包通过 `<!-- agentbrief:name:start/end -->` 标记注入。卸载只移除职能包内容。

<details>
<summary><b>查看注入内容示例</b>——<code>fullstack-engineer</code> 的输出</summary>

```markdown
<!-- agentbrief:fullstack-engineer:start -->
# AgentBrief: fullstack-engineer

## Role
You are a senior full-stack TypeScript developer. You build production
applications with Next.js 15, React 19, and Tailwind CSS. You enforce
strict type safety and review your own code with principal-engineer rigor.

## Constraints
- Never use `any` — always annotate return types on exports
- Server Components by default — only add 'use client' when needed
- WCAG 2.1 AA minimum — semantic HTML, keyboard navigation

## Skills
- **next-best-practices** — USE WHEN: Writing Next.js code
- **typescript-advanced-types** — USE WHEN: Complex type logic
- **architecture-review** — USE WHEN: Reviewing PRs
- **design-review-checklist** — USE WHEN: Checking UI quality
- **agent-browser** — USE WHEN: Visual verification needed
  ...and 4 more
<!-- agentbrief:fullstack-engineer:end -->
```

</details>

## 什么是 Brief（职能包）？

```
my-brief/
├── brief.yaml          # 配置：名称、版本、继承、技能
├── personality.md      # 身份：角色、语气、约束
├── knowledge/          # 知识：领域参考材料（按需读取）
│   └── cheatsheet.md
└── skills/             # 技能：可执行的工作流目录
    └── my-skill/
        ├── SKILL.md    # 触发条件 + 分步流程
        └── ...         # 其他支持文件
```

查看 [`briefs/security-auditor/`](./briefs/security-auditor/) 获取完整示例。

## 可信来源

每个官方职能包都源自经过实战检验、社区认可的技能：

- [obra/superpowers](https://github.com/obra/superpowers) **(90.6k ★)** — TDD、系统化调试、验证
- [anthropics/skills](https://github.com/anthropics/skills) **(95.8k ★)** — Anthropic 官方技能包
- [garrytan/gstack](https://github.com/garrytan/gstack) **(YC CEO)** — CEO 审查、设计审查、QA
- [vercel-labs](https://github.com/vercel-labs/agent-browser) **(Vercel 官方)** — Next.js 最佳实践、浏览器自动化
- [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) — SEO 审计、发布策略、数据分析

## 创建你自己的

```bash
agentbrief init my-agent              # 脚手架
# 编辑 personality.md，添加 knowledge/ 和 skills/
agentbrief use ./my-agent             # 本地测试
agentbrief preview ./my-agent         # 查看编译输出
# 推送到 GitHub → agentbrief use github:you/my-agent
```

想收录到官方 registry？[提交 PR](./CONTRIBUTING.md)。阅读 **[创作指南](https://0xranx.github.io/agentbrief/docs.html#AUTHORING)**。

## 社区

- [GitHub Discussions](https://github.com/0xranx/agentbrief/discussions) — 提问、展示作品、功能建议
- [贡献指南](./CONTRIBUTING.md) — 如何提交职能包到 registry

将 `.agentbrief/` 添加到 `.gitignore`。提交引擎文件（`CLAUDE.md`、`.cursorrules`、`AGENTS.md`），让团队共享相同的 Agent 行为。

## 许可证

[MIT](./LICENSE)
