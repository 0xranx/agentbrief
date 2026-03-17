# AgentBrief — 项目理念与定位

## 一句话定位

**给 AI Coding Agent 装"职业技能包"的包管理器。**

不造新 Agent，不做 runtime。用户电脑上已经有 Claude Code / Cursor / OpenCode / Codex——它们是通用的"白板员工"。AgentBrief 做的事情是：把一个白板员工变成一个特定岗位的专才。

## 这个项目为什么存在

Coding Agent（Claude Code、Cursor、OpenCode、Codex）已经很强了。但每次你在一个新项目里启动 Agent，它是一张白纸——不知道你的团队规范、不了解你的业务领域、没有特定的行为风格。

用户目前的做法是手写 CLAUDE.md / .cursorrules / AGENTS.md，从零开始调教 Agent。这带来三个问题：

1. **重复劳动**：每个项目都要写一遍类似的指令。
2. **知识不可移植**：一个人调教好的 Agent 行为，没法分享给团队或社区。
3. **无标准化**：团队里每个人的 Agent 行为不一致，没有统一的"岗位说明书"。

AgentBrief 解决的就是这三个问题。

## 核心类比：eslint-config-airbnb

Airbnb 把自己的代码规范打包成 `eslint-config-airbnb`，任何人 `npm install` 就能用。你不需要了解 400 条规则背后的决策，装上就生效。

AgentBrief 是同一个模式：有人把"安全审计员"的知识、人格、行为规范打包成一个 brief，你 `agentbrief use` 就生效。你不需要自己写 50 行 CLAUDE.md 去调教 Agent。

## 用户心智模型

用户脑中应该只有一个概念：

> **我的项目需要一个什么样的人来干活？**

不是"我要配置什么参数"，不是"我要写什么 prompt"，而是——我需要一个安全专家、一个前端 reviewer、一个技术文档写手。选一个，装上，干活。

## 两种用户角色

### 使用者（多数人）

```bash
# 我的项目需要一个懂安全的人盯着
agentbrief use security-auditor

# 再加一个熟悉我们团队规范的 reviewer
agentbrief use @our-company/code-standards

# 看看现在装了什么
agentbrief list

# 不需要了
agentbrief eject security-auditor
```

他不关心 CLAUDE.md 怎么写、.cursorrules 什么格式。他只关心：装上之后 Agent 变聪明了。

### 创建者（少数人）

团队里的 Tech Lead、领域专家、或者社区贡献者。他们把自己的经验沉淀成 brief：

```bash
agentbrief init code-reviewer
# 编辑 personality.md —— 定义审查风格
# 填充 knowledge/ —— 放入团队规范文档
# 发布到自己的 GitHub 仓库
```

动机很直接：**我不想每次给新人解释我们的规范，让 Agent 替我盯着。**

## Brief 的组成

一个 brief 包含四个维度的定义：

### 1. Personality（人格）

Agent 的角色、语气、沟通风格、行为约束。这不是一段 system prompt，而是一份完整的"岗位行为手册"。

示例：
- 你是一个一线客服专员
- 语气：耐心、专业、不卑不亢
- 约束：不承诺不确定的信息，敏感问题必须转人工
- 问候语："你好，我是小助手，有什么可以帮你？"

### 2. Knowledge（领域知识）

Agent 执行职责所需的参考资料。以 markdown 文件或目录形式存在，被编译后引用在 Agent 指令文件中。

示例：
- `knowledge/product-guide.md` — 产品使用手册
- `knowledge/faq.md` — 常见问题
- `knowledge/policies/refund-policy.md` — 退款政策

### 3. Scale（运行约束）

Agent 的运行参数和偏好设定。

示例：
- 推荐引擎：claude-code
- 推荐模型：claude-sonnet-4-6
- 超时时间：120 秒
- 并发数：5

### 4. Skills（技能）

Agent 的可执行技能，沿用 GolemBot 的 skill 格式。一个 skill 是一个目录，里面包含 prompt 模板和可选的工具定义。

## 核心体验原则

### 1. 一条命令生效，一条命令撤销

不要安装步骤、不要配置文件、不要重启。`use` 之后下一次 Agent 对话立刻不同。`eject` 之后恢复原状。

### 2. 无感知运行

用户不需要改变自己和 Agent 的交互方式。不需要特殊前缀、不需要 @mention、不需要切换模式。Agent 自然地就具备了新能力。

### 3. 可叠加、可覆盖

```bash
agentbrief use base-standards      # 底层：团队通用规范
agentbrief use react-specialist    # 叠加：React 专项知识
```

冲突时后者优先，和 CSS 的层叠逻辑一样直觉。

### 4. 非侵入

注入的内容用明确的标记包裹（`<!-- agentbrief:name:start/end -->`），不破坏用户已有的指令文件。`eject` 可以干净地回退。

### 5. 引擎无关

Brief 本身不绑定引擎。`agentbrief use` 时自动编译为所有引擎的指令文件格式（CLAUDE.md、.cursorrules、AGENTS.md），无论用户用哪个 Agent 都能生效。

### 6. 透明可审计

用户随时可以看到 brief 往项目里注入了什么。不是黑盒。打开 CLAUDE.md 就能看到注入的内容和标记。

## 使用场景

| 场景 | 用户动作 | 效果 |
|------|---------|------|
| **团队规范统一** | `agentbrief use @company/standards` | 新人入职，Agent 自动遵守团队编码标准、PR 规范、架构约束 |
| **专项审计** | `agentbrief use security-auditor` | 上线前让 Agent 以安全专家视角审查代码 |
| **领域开发** | `agentbrief use solidity-expert` | Agent 掌握 Solidity 最佳实践、常见漏洞、Gas 优化知识 |
| **文档写作** | `agentbrief use tech-writer` | Agent 按照文档风格指南、术语表来写技术文档 |
| **客户项目交付** | `agentbrief use @client/their-standards` | 按客户特定的技术栈约束和合规要求开发 |
| **开源维护** | `agentbrief use my-project-conventions` | 贡献者的 Agent 自动了解项目的架构约定和贡献指南 |

## 与 GolemBot 的关系

```
AgentBrief (定义员工)  +  GolemBot (让员工上班)  =  完整的数字员工方案
```

- **单独用 AgentBrief**：开发者在自己项目里用，Agent 通过 IDE / CLI 跑。这是大多数用户的场景。
- **AgentBrief + GolemBot**：用 AgentBrief 定义好的数字员工，通过 GolemBot 部署到 Slack / Telegram / 飞书等 IM 渠道，变成团队的 7×24 机器人。

两者不强绑定。AgentBrief 是独立项目，有独立的价值。
