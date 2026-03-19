# AgentBrief——愿景与理念

## 一句话定位

**AI 编码 Agent 角色定义的包管理器。**

AgentBrief 不创建新的 Agent，也不提供运行时。用户已经有了 Claude Code、Cursor、OpenCode 和 Codex——它们是通用的"白纸"助手。AgentBrief 把白纸变成领域专家。

## 为什么做这个项目

AI 编码 Agent（Claude Code、Cursor、OpenCode、Codex）已经很强大了。但每次在新项目中启动 Agent，它都是一张白纸——不了解你团队的规范、你的业务领域，也不知道你希望它怎么表现。

用户目前只能手写 `CLAUDE.md`、`.cursorrules` 或 `AGENTS.md`。这带来三个问题：

1. **重复劳动**——每个项目都要重写类似的指令。
2. **知识不可移植**——一个人精心调教的 Agent 行为无法分享给团队或社区。
3. **缺乏标准化**——每个人的 Agent 行为各不相同，没有共同的"岗位说明书"。

AgentBrief 一次性解决这三个问题。

## 核心类比：eslint-config-airbnb

Airbnb 把他们的代码规范打包成 `eslint-config-airbnb`。任何人都可以 `npm install`。你不需要理解背后的 400 条规则——安装即生效。

AgentBrief 是同样的模式：有人把"安全审计师"的知识、人格和行为规则打包成一个职能包。你 `agentbrief use` 它就生效了。不需要自己写 50 行 CLAUDE.md。

## 用户心智模型

用户心中只需要一个概念：

> **我的项目需要什么样的专家？**

不是"我要配置什么参数"或"我要写什么提示词"——而是：我需要一个安全专家、一个前端评审员、一个技术写作者。选一个，安装，开工。

## 两种用户角色

### 使用者（大多数人）

```bash
# 我的项目需要一个懂安全的人
agentbrief use security-auditor

# 加一个了解团队规范的评审员
agentbrief use code-reviewer

# 看看当前生效了哪些
agentbrief list

# 不需要了
agentbrief eject security-auditor
```

他们不关心 CLAUDE.md 怎么运作，也不关心 `.cursorrules` 是什么格式。他们只关心 Agent 变聪明了。

### 创作者（少数人）

技术负责人、领域专家或社区贡献者，把自己的经验提炼成一个职能包：

```bash
agentbrief init code-reviewer
# 编辑 personality.md——定义评审风格
# 添加到 knowledge/——团队规范文档
# 添加到 skills/——评审工作流
# 推送到 GitHub
```

他们的动机很简单：**"我不想每来一个新人就重新讲一遍我们的规范。让 Agent 去执行吧。"**

## 职能包的组成

一个职能包包含三个层次：

### 1. 人格

Agent 的角色、语气、沟通风格和行为约束。这不是一个系统提示词——而是一份完整的"岗位行为手册"。

- 始终注入到 Agent 的指令文件中
- 应当简洁（约 30 行）
- 结构：角色 → 语气 → 约束

### 2. 知识

Agent 完成工作所需的参考资料。Markdown 文件或目录，会被复制到项目中并在 Agent 指令文件中引用。

- 由 Agent 按需读取
- 领域速查表、代码模式目录、风格指南

### 3. 技能

Agent 逐步执行的工作流。每个技能是一个目录，包含一个 `SKILL.md` 文件，其中定义了触发条件和执行流程。

- 触发条件匹配时激活
- 兼容 [skills.sh](https://skills.sh) 的 SKILL.md 格式
- 可以从生态系统获取（obra/superpowers、gstack、vercel-labs 等）

## 核心体验原则

### 1. 一条命令生效，一条命令撤销

无需安装步骤、无需配置文件、无需重启。`use` 之后，下一次 Agent 对话立即不同。`eject` 之后，恢复原样。

### 2. 无感运作

用户不需要改变与 Agent 的交互方式。没有特殊前缀、没有 @提及、没有模式切换。Agent 自然地拥有了新能力。

### 3. 可叠加、可组合

```bash
agentbrief use base-standards      # 基础层：团队通用规范
agentbrief use react-specialist    # 叠加层：React 专项知识
```

或者使用 `extends` 将多个职能包组合成一个，自动去重技能：

```bash
agentbrief use fullstack-engineer   # 组合 4 个职能包 → 9 个技能，1 个人格
```

### 4. 非侵入

注入的内容用清晰的标记包裹（`<!-- agentbrief:name:start/end -->`）。用户原有的指令文件不受影响。`eject` 干净地移除所有内容。

### 5. 引擎无关

职能包不绑定任何引擎。`agentbrief use` 自动编译到所有引擎的指令文件，并针对不同引擎优化内容（Claude Code 完整版、Cursor 精简版、OpenCode/Codex 简洁版）。

### 6. 透明可审计

用户随时可以看到职能包注入了什么。打开 `CLAUDE.md` 就能阅读。使用 `agentbrief show <name>` 或 `agentbrief preview ./brief` 可以在不应用的情况下检查内容。

## 使用场景

| 场景 | 用户操作 | 效果 |
|------|---------|------|
| **团队标准化** | `agentbrief use @company/standards` | 新成员的 Agent 自动遵循编码规范、PR 规范、架构约束 |
| **安全审计** | `agentbrief use security-auditor` | Agent 在发布前以 OWASP 安全专家的身份审查代码 |
| **领域开发** | `agentbrief use nextjs-developer` | Agent 熟悉 Next.js 15 App Router 规范、Tailwind 模式 |
| **文档写作** | `agentbrief use tech-writer` | Agent 按照风格指南撰写结构规范的文档 |
| **创业** | `agentbrief use startup-founder` | Agent 集产品、增长、安全和创业顾问技能于一身 |
| **开源项目** | `agentbrief use my-project-conventions` | 贡献者的 Agent 理解你的架构和贡献指南 |
