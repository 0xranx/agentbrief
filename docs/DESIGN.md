# AgentBrief — 设计决策记录

本文档记录 AgentBrief 的关键设计决策及其背后的理由。当你犹豫"为什么这样做而不是那样做"时，来这里找答案。

## 决策 1：目录即 Brief，不用单文件

### 决定

一个 brief 是一个目录，不是一个 YAML 文件。

```
my-brief/
├── brief.yaml        # 声明文件
├── personality.md     # 人格定义（完整的 markdown 文档）
├── knowledge/         # 领域知识（可以有多个文件和子目录）
└── skills/            # 技能
```

### 理由

- personality 和 knowledge 的内容量可以很大（几千字的行为手册、几十页的领域文档），塞进一个 YAML 不现实。
- 目录结构对 git diff 友好，每个文件独立变更、独立 review。
- 与 GolemBot 的 workspace 概念一致（一个目录即一个 assistant）。

### 备选方案（已否决）

- 单文件 YAML（所有内容内联）：内容量大时不可维护。
- tar/zip 打包格式：引入了打包/解包步骤，增加了复杂度。

## 决策 2：声明式 YAML 作为 spec 格式

### 决定

`brief.yaml` 用声明式 YAML 描述"是什么"，不描述"怎么做"。

### 理由

- 与 GolemBot 的 `golem.yaml` 风格一致，生态体验统一。
- 非开发者（Tech Lead、领域专家）也能编辑 YAML。
- 声明式意味着工具可以自由决定"怎么编译"——如果未来某个引擎有更好的指令格式，编译器可以独立升级，brief 不需要改。

## 决策 3：标记包裹注入，非侵入式

### 决定

注入到 CLAUDE.md / .cursorrules / AGENTS.md 的内容用 HTML 注释标记包裹：

```markdown
<!-- agentbrief:brief-name:start -->
...compiled content...
<!-- agentbrief:brief-name:end -->
```

### 理由

- HTML 注释在 markdown 中不渲染，对 Agent 指令文件的可读性无影响。
- 标记使得 `eject` 可以精确删除注入内容，不伤及用户自己写的内容。
- 支持多个 brief 共存——每个 brief 有自己的标记对，互不干扰。
- 支持 re-apply（重新注入时替换已有标记之间的内容，而非追加）。

### 不变量

**标记格式是 API 契约。** 改变标记格式 = breaking change，会导致已部署的 brief 无法被 eject。任何对标记格式的修改都必须有迁移方案。

## 决策 4：引擎无关，编译时适配

### 决定

Brief 本身不绑定任何 Agent 引擎。`agentbrief use` 时自动编译为所有引擎的指令文件。

当前支持的引擎和对应文件：

| Engine | Instruction File |
|--------|-----------------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` |
| OpenCode | `AGENTS.md` |
| Codex | `AGENTS.md` |

### 理由

- 用户可能在不同项目用不同的 Agent，甚至在同一项目切换 Agent。
- Brief 的价值在于"领域知识 + 人格定义"，这些是引擎无关的。
- 所有引擎的指令文件本质都是 markdown，编译输出格式几乎相同，维护成本低。

### 扩展

`ENGINE_FILES` 在 `types.ts` 中统一定义。新增引擎支持只需加一行映射，不影响 brief 格式。

## 决策 5：GitHub 仓库即分发渠道，不建 registry

### 决定

Brief 通过 GitHub 仓库分发：

```bash
agentbrief use github:owner/repo
agentbrief use github:owner/repo@v1.0
agentbrief use github:owner/repo/subdir
```

不建自有的包 registry，不做托管。

### 理由

| 做 registry | 用 GitHub |
|---|---|
| 需要搭建和维护基础设施 | 零成本 |
| 用户需要注册账号 | 已有 GitHub 账号 |
| 包的发现需要做搜索 | GitHub Search + topic 标签 |
| 版本管理要自己实现 | git tag 天然支持 |
| 信任链要自己建 | 看 star、看作者、看代码 |

Brief 的内容（personality + knowledge）是纯文本，用户需要能审查内容后再信任。GitHub 仓库天然提供了代码审查能力。

### 缓存机制

GitHub 来源的 brief 被 clone 到 `~/.agentbrief/cache/` 目录，避免每次 use 都重新下载。`lock.yaml` 记录 commit SHA 保证可复现。

## 决策 6：三级信任模型 + 索引仓库

### 决定

通过 `0xranx/agentbrief-registry` 索引仓库提供官方认证，分三个信任等级：

| 等级 | 含义 | 来源 |
|------|------|------|
| **official** | 官方团队维护 | 0xranx org 下的仓库 |
| **verified** | 社区出品，通过官方审核 | 社区作者 GitHub 仓库，经 PR 审核纳入索引 |
| **community** | 社区自发，未审核 | 任何人的 GitHub 仓库 |

### 索引仓库结构

```yaml
# registry.yaml (in 0xranx/agentbrief-registry)
workshops:
  - name: security-auditor
    source: github:0xranx/brief-security-auditor
    tier: official
    tags: [security, audit]
    description: OWASP-based security review

  - name: solidity-expert
    source: github:someone/brief-solidity
    tier: verified
    tags: [blockchain, solidity]
    verified_at: 2026-03-10
    reviewer: 0xranx
```

### 纳入 verified 的流程

1. 社区作者向 `0xranx/agentbrief-registry` 提交 PR（附 brief 仓库链接）
2. CI 自动检查：brief.yaml 格式合法、personality.md 存在、knowledge 非空、试装能通过
3. 人工审核：知识内容质量、安全性、personality 合理性
4. Merge = 获得 verified 标识

**PR 即申请，merge 即认证。** 不需要额外的申请流程。

### 用户侧体验

```bash
agentbrief search security
#  NAME               TIER       DESCRIPTION
#  security-auditor   official   OWASP-based security review
#  solidity-expert    verified   Solidity best practices

agentbrief use security-auditor
# ✓ official brief by 0xranx — Applied.

agentbrief use github:random-person/some-brief
# ⚠ community brief (unverified) — review contents before use
# Continue? [y/N]
```

Community 来源弹确认提示，official/verified 直接装。

### 理由

- 索引仓库就是一个 YAML 文件 + PR 流程，零基础设施成本。
- Git 天然有审计记录：谁批准的、什么时候、改了什么。
- PR 是开发者最熟悉的协作方式，零学习成本。
- Brief 内容始终在作者自己的仓库，作者保持完全控制权。

## 决策 7：lock.yaml 记录应用状态

### 决定

在项目的 `.agentbrief/lock.yaml` 中记录当前应用了哪些 brief：

```yaml
version: 1
briefs:
  - name: security-auditor
    source: github:0xranx/brief-security-auditor
    version: 1.2.0
    ref: v1.2.0
    sha: a3f8c2d
    applied_at: 2026-03-17T10:00:00Z
```

### 理由

- 团队成员可以看到项目里应用了哪些 brief（类似 package-lock.json）。
- SHA 锁定保证可复现——同一个 lock.yaml 在不同机器上 use 得到相同结果。
- `list` 命令直接读取 lock.yaml，不需要解析 engine 指令文件。

## 决策 8：可叠加设计

### 决定

一个项目可以同时应用多个 brief：

```bash
agentbrief use base-standards
agentbrief use react-specialist
```

每个 brief 有独立的标记区域，在 engine 指令文件中依次排列。

### 理由

- 现实中一个"数字员工"往往需要多个维度的知识（团队规范 + 领域专业 + 项目特定约束）。
- 叠加比合并简单——不需要处理冲突合并逻辑，Agent 自己会综合多段指令。
- 如果某个 brief 不合适，单独 eject 即可，不影响其他。

## 后续可能的演进方向（尚未实施）

以下方向在讨论中提到过但 **当前不做**，记录在此以供未来参考：

1. **workshop.dev 索引站**：从 registry.yaml 自动生成的静态站，方便浏览和搜索。等生态有一定规模后再做。
2. **安装量统计**：CLI 匿名上报（opt-in），给 brief 作者激励信号。
3. **brief 继承**：一个 brief 可以 `extends: github:xxx/base-brief`，复用基础人格再叠加自定义。
4. **`agentbrief diff`**：显示当前项目中所有 brief 注入的内容，方便审计。
5. **`agentbrief update`**：检查已安装 brief 的新版本并更新。
