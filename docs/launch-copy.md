# AgentBrief Launch Copy

## Twitter Thread (EN)

**Tweet 1:**
I built a "skill pack manager" for AI coding agents.

One command turns your Claude Code / Cursor / OpenCode into a startup founder, security auditor, or fullstack engineer — with domain knowledge, constraints, and 12+ specialized skills.

Open source. Works today.

github.com/0xranx/agentbrief

**Tweet 2:**
The problem: AI coding agents are generalists. They write code, but they don't think like a senior engineer, a product manager, or a security expert.

AgentBrief fixes this. It injects role definitions — personality, domain knowledge, and skill triggers — into your agent's instruction files.

**Tweet 3:**
How it works:

```
npx agentbrief use startup-founder
```

That's it. Your agent now:
- Thinks in build-measure-learn cycles
- Flags hardcoded credentials as Critical
- Has skills for SEO audit, launch strategy, analytics setup
- Never proposes a feature without articulating the user problem

**Tweet 4:**
It's like eslint-config-airbnb, but for agent behavior.

- 17 official briefs (dev, product, growth, ops)
- Works with Claude Code, Cursor, OpenCode, Codex
- Briefs are composable — stack multiple roles
- One command to apply, one command to remove

**Tweet 5:**
Built this because I was tired of copy-pasting the same CLAUDE.md instructions across projects.

Now I just run `agentbrief use fullstack-engineer` and my agent knows TypeScript conventions, testing patterns, and security best practices.

Try it: github.com/0xranx/agentbrief

---

## Twitter Thread (中文)

**推文 1:**
我做了个给 AI 编程 Agent 装"职业技能包"的工具。

一条命令，让你的 Claude Code / Cursor 从通才变成专业人士 —— 自带领域知识、行为约束和 12+ 专业技能。

开源，现在就能用。

github.com/0xranx/agentbrief

**推文 2:**
问题：AI Agent 是全才，但不是专才。它能写代码，但不会像资深工程师那样思考，不会像产品经理那样做决策。

AgentBrief 解决这个问题。它往 Agent 的指令文件里注入角色定义 —— 人格、领域知识、技能触发器。

**推文 3:**
用法：

```
npx agentbrief use startup-founder
```

装完后你的 Agent 会：
- 用 build-measure-learn 循环思考
- 把硬编码密钥标记为 Critical
- 遇到 SEO 问题自动触发审计技能
- 每个功能必须说清楚解决什么用户问题

**推文 4:**
类比：eslint-config-airbnb 之于代码规范 = AgentBrief 之于 Agent 行为规范。

- 17 个官方职能包（开发、产品、增长、运维）
- 支持 Claude Code、Cursor、OpenCode、Codex
- 可叠加，非侵入，一条命令生效/撤销

**推文 5:**
做这个是因为受够了每个项目都手动复制粘贴 CLAUDE.md。

现在 `agentbrief use fullstack-engineer`，Agent 就自动具备 TypeScript 规范、测试模式和安全意识。

试试看：github.com/0xranx/agentbrief

---

## Hacker News — Show HN

**Title:**
Show HN: AgentBrief – Pluggable role definitions for AI coding agents

**Body:**
Hi HN,

I built AgentBrief, an open-source CLI that turns AI coding agents (Claude Code, Cursor, OpenCode, Codex) into specialized professionals.

The problem: these agents are generalists. They can write code, but they don't think like a senior engineer, a security auditor, or a product manager. You end up copy-pasting the same instructions into CLAUDE.md or .cursorrules across every project.

AgentBrief packages those instructions into reusable "briefs" — each one defines a role with personality, domain knowledge, behavioral constraints, and skill triggers.

```
npx agentbrief use startup-founder
```

This injects a startup founder role into your agent's instruction files. It now thinks in build-measure-learn cycles, flags hardcoded credentials as Critical, and has 12 specialized skills (SEO audit, launch strategy, security review, etc.) that activate contextually.

Key design decisions:
- Decentralized: briefs are GitHub repos, versions are git tags. No central registry required.
- Non-invasive: injects between markers in existing instruction files. One command to apply, one to remove.
- Engine-agnostic: compiles differently for each engine (full markdown for Claude Code, minimal headings for Cursor).
- Composable: stack multiple briefs in the same project.

Think of it as eslint-config-airbnb, but for agent behavior instead of code style.

17 official briefs so far: fullstack-engineer, security-auditor, product-manager, startup-founder, data-analyst, tech-writer, and more.

GitHub: https://github.com/0xranx/agentbrief
Site: https://0xranx.github.io/agentbrief

Would love your feedback on the concept and the brief format.

---

## V2EX

**标题：** 做了个给 AI Agent 装职业技能包的 CLI 工具（开源）

**正文：**
各位好，

最近做了一个开源工具 AgentBrief，解决一个很具体的问题：AI 编程 Agent（Claude Code、Cursor 等）是通才，但不是专才。

每次开新项目都要手动往 CLAUDE.md 里复制粘贴一大堆指令，告诉 Agent 应该怎么思考、哪些事情不能做。项目多了就受不了了。

AgentBrief 把这些指令打包成可复用的"职能包"（brief），一条命令安装：

```
npx agentbrief use startup-founder
```

装完后 Agent 自动具备：
- 创业者思维模式（build-measure-learn）
- 安全意识（硬编码密钥 = Critical）
- 12 个按需触发的技能（SEO 审计、发布策略、安全评审等）

核心设计：
- 去中心化分发：GitHub 仓库就是 brief 包，git tag 就是版本
- 非侵入：在指令文件里用标记注入，一条命令装/卸
- 引擎无关：同一个 brief 自动适配 Claude Code / Cursor / OpenCode
- 可叠加：一个项目里可以装多个 brief

目前有 17 个官方职能包，覆盖工程、产品、增长、运维。

GitHub: https://github.com/0xranx/agentbrief

欢迎试用和反馈！
