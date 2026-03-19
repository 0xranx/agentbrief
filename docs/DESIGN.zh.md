# AgentBrief——设计决策

本文档记录关键设计决策及其背后的原因。当你疑惑"为什么这样做而不那样做？"——来这里找答案。

## 决策 1：目录 = 职能包，而非单文件

### 决策

一个职能包是一个目录，而不是一个 YAML 文件。

```
my-brief/
├── brief.yaml        # 配置
├── personality.md     # 身份（角色 + 语气 + 约束）
├── knowledge/         # 参考资料（领域文档、速查表）
└── skills/            # 可执行工作流（每个技能 = 包含 SKILL.md 的目录）
```

### 原因

- 人格和知识可能很长（多页行为手册、领域文档）。全部内联到一个 YAML 文件中不现实。
- 目录结构对 git diff 友好——每个文件独立变更和评审。
- 来自生态系统的技能（skills.sh、superpowers、gstack）本身就是包含辅助文件的目录。

### 被否决的替代方案

- **单个 YAML 文件**（所有内容内联）：规模化后无法维护。
- **tar/zip 包**：增加了打包/解包的复杂度。

## 决策 2：声明式 YAML 规范

### 决策

`brief.yaml` 描述职能包*是什么*，而不是*如何编译*。

### 原因

- 非开发者（技术负责人、领域专家）也能编辑 YAML。
- 声明式意味着编译器可以自由决定*如何*编译——如果新引擎需要不同格式，编译器独立升级，无需修改职能包。

## 决策 3：HTML 注释标记实现非侵入式注入

### 决策

注入到 `CLAUDE.md` / `.cursorrules` / `AGENTS.md` 中的内容用 HTML 注释标记包裹：

```markdown
<!-- agentbrief:brief-name:start -->
...编译后的内容...
<!-- agentbrief:brief-name:end -->
```

### 原因

- HTML 注释不会在 Markdown 中渲染——对指令文件无视觉影响。
- 标记使精确 `eject` 成为可能——只移除注入的内容，保留用户自己的内容。
- 支持多个职能包共存——每个职能包有自己的标记对。
- 支持重新应用——再次使用时替换现有标记之间的内容。

### 不变量

**标记格式是 API 契约。** 更改标记格式 = 破坏性变更。任何修改都需要迁移方案。

## 决策 4：引擎无关，编译时适配

### 决策

职能包不绑定任何 Agent 引擎。`agentbrief use` 同时编译到所有引擎的指令文件。

| 引擎 | 文件 | 编译模式 |
|------|------|---------|
| Claude Code | `CLAUDE.md` | 完整版——所有章节，详细引用 |
| Cursor | `.cursorrules` | 精简版——仅标题 + 第一段 + 列表 |
| OpenCode | `AGENTS.md` | 简洁版——每段取第一句话 |
| Codex | `AGENTS.md` | 简洁版——与 OpenCode 相同 |

### 原因

- 用户可能在不同项目使用不同 Agent，或在同一项目中切换 Agent。
- 职能包的价值（领域知识 + 行为规则）与引擎无关。
- 所有引擎都使用 Markdown 指令文件——编译输出在结构上相似。

### 扩展点

`types.ts` 中的 `ENGINE_FILES` 是唯一真实来源。添加新引擎只需一行代码。

## 决策 5：GitHub 作为分发渠道

### 决策

职能包通过 GitHub 仓库分发：

```bash
agentbrief use github:owner/repo
agentbrief use github:owner/repo@v1.0
agentbrief use github:owner/repo/subdir
```

不需要自建包注册中心，不需要托管基础设施。

### 原因

| 自建注册中心 | GitHub |
|---|---|
| 需要构建和维护基础设施 | 零成本 |
| 用户需要注册新账号 | 已有 GitHub 账号 |
| 发现功能需要自建搜索 | GitHub Search + topic 标签 |
| 版本管理需要自己实现 | git tag 原生支持 |
| 信任链需要从零建立 | Star 数、作者声誉、可读源码 |

职能包内容（人格 + 知识）是纯文本。用户需要在信任之前审计内容。GitHub 仓库原生提供代码审查能力。

### 缓存

从 GitHub 获取的职能包浅克隆到 `~/.agentbrief/cache/`。`lock.yaml` 记录 commit SHA 以确保可复现性。

## 决策 6：三级信任模型 + 内置注册表

### 决策

官方职能包内置在 npm 包中（`briefs/` 目录），并在 `registry.yaml` 中注册。三个信任级别：

| 级别 | 含义 | 来源 |
|------|------|------|
| **official** | 由 AgentBrief 团队维护 | 内置 `briefs/` 目录 |
| **verified** | 社区创建，经 PR 审核 | 社区 GitHub 仓库 |
| **community** | 自行发布，未经审核 | 任意 GitHub 仓库 |

### 注册表格式

```yaml
# registry.yaml（位于 agentbrief 包中）
security-auditor:
  source: github:0xranx/agentbrief/briefs/security-auditor
  description: OWASP/CWE security review specialist
  trust: official
```

### 提交流程

1. 社区作者提交 PR，向 `registry.yaml` 添加条目
2. 维护者审核职能包质量（参见 CONTRIBUTING.md）
3. 合并 = 标记为 `verified`

### 用户体验

```bash
agentbrief use security-auditor    # 官方——从内置 briefs/ 解析
agentbrief use github:someone/repo # 社区——从 GitHub 克隆
agentbrief search security         # 搜索注册表
```

## 决策 7：lock.yaml 实现可复现性

### 决策

`.agentbrief/lock.yaml` 记录当前应用了哪些职能包：

```yaml
version: 1
briefs:
  - name: security-auditor
    source: security-auditor
    version: 1.0.0
    applied_at: '2026-03-17T10:00:00Z'
```

### 原因

- 团队成员可以看到哪些职能包处于活跃状态（类似 `package-lock.json`）。
- SHA 锁定确保跨机器的可复现性。
- `list` 命令直接读取 lock.yaml——无需解析引擎文件。

## 决策 8：可叠加设计与 extends

### 决策

一个项目可以同时应用多个职能包。每个职能包在引擎文件中有独立的标记区域。

对于复杂组合，`extends` 可以将多个职能包合并为一个：

```yaml
# fullstack-engineer/brief.yaml
extends:
  - typescript-engineer
  - nextjs-developer
  - design-engineer
  - code-reviewer
```

这会生成一个标记块，包含一个人格、去重后的技能和合并后的知识。

### 原因

- 真实的 Agent 需要多维知识（团队规范 + 领域专业 + 项目约束）。
- 叠加比合并简单——不需要冲突解决逻辑。
- `extends` 解决了人格冲突问题（一个统一的人格，而不是 5 个独立的角色章节）。
- 技能按目录名自动去重（例如 `verification` 即使被 3 个扩展职能包包含也只出现一次）。

## 决策 9：SKILL.md 生态兼容性

### 决策

技能遵循 [SKILL.md 格式](https://skills.sh)，使用 YAML frontmatter：

```markdown
---
name: security-review
description: Use when reviewing code for security vulnerabilities
---
# Security Review
## Process
1. ...
```

每个技能是一个**目录**，包含 `SKILL.md` 以及任意辅助文件。AgentBrief 复制整个目录。

### 原因

- 兼容 skills.sh 上的 89,000 多个技能
- `description` 字段在编译输出中作为触发条件
- 目录模型允许技能包含脚本、参考资料、模板
- 不限定内部结构——只要求 `SKILL.md`，其他文件原样复制
