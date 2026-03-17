# AgentBrief Catalog

> Curated directory of high-quality Agent Briefs and adaptable resources.
> Covers the full business lifecycle — from development to operations to growth.

## How to Use This Catalog

```bash
# Apply a brief from this repo's examples
agentbrief use ./examples/security-auditor

# Apply a brief from any GitHub repo
agentbrief use github:owner/repo
agentbrief use github:owner/repo@v1.0
```

Items marked with source links are **references and inspiration** — community projects whose rules and prompts can be adapted into AgentBrief format.

---

## Development

### Frameworks

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| Next.js Full-Stack | App Router + React 19 + TypeScript + Tailwind + shadcn/ui | [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) (38.5k★) |
| TypeScript Strict | Type safety guardian — zero `any`, discriminated unions, exhaustive checks | [stevekinney.com](https://stevekinney.com/writing/cursor-rules-typescript), community consensus |
| Vue.js | Vue 3 Composition API + Pinia + TypeScript conventions | [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) |
| Python / Django | Django ORM best practices, class-based views, pytest patterns | [cursor.directory/django](https://cursor.directory/rules/django) |
| Go | Idiomatic Go, error handling, concurrency patterns | [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) |
| Rust | Ownership, lifetimes, error handling with thiserror/anyhow | [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) |
| Swift / SwiftUI | Modern Swift documentation, SwiftUI patterns | [steipete/agent-rules](https://github.com/steipete/agent-rules) (5k★) |

### Quality Assurance

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| Security Auditor | OWASP/CWE security review specialist | **Included:** `examples/security-auditor/` |
| Code Reviewer | Rigorous PR review — naming, tests, architecture, maintainability | [steipete/agent-rules](https://github.com/steipete/agent-rules), [cursor.directory](https://cursor.directory/) |
| Testing & QA | Jest/Vitest/Playwright test strategy and patterns | [cursor.directory/testing](https://cursor.directory/rules/testing) |

### Toolchain

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| DevOps / SRE | Monitoring, diagnostics, incident response, IaC | [Azure SRE Agent](https://azure.microsoft.com/en-us/products/sre-agent), [fuzzylabs/sre-agent](https://github.com/fuzzylabs/sre-agent) |
| Frontend Design | React + Tailwind + shadcn/ui design engineering | [anthropics/skills](https://github.com/anthropics/skills) (Official) |
| MCP Builder | Model Context Protocol server development guide | [anthropics/skills](https://github.com/anthropics/skills) (Official) |
| Tech Writer | Technical documentation with style guide adherence | [Fern](https://buildwithfern.com/), [Document360](https://document360.com/) |
| Monorepo | Turborepo + pnpm workspaces conventions | [cursor.directory/monorepo](https://cursor.directory/rules/monorepo) |

### Methodology (bundled into role briefs)

Methodology skills from [obra/superpowers](https://github.com/obra/superpowers) (90.6k★) are **bundled into each role brief's `skills/` directory** — not installed separately. For example, `security-auditor` includes systematic debugging and verification; `nextjs-fullstack` includes TDD.

| Methodology | Bundled Into |
|-------------|-------------|
| Systematic Debugging | security-auditor, devops-sre |
| Verification | security-auditor, code-reviewer, devops-sre, startup-builder |
| TDD | nextjs-fullstack, startup-builder |
| Plan & Execute | tech-writer |
| Brainstorming | product-manager, growth-engineer |

---

## Product

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| Product Manager | PRD generation, user stories, technical specs, prioritization | [deanpeters/product-manager-prompts](https://github.com/deanpeters/product-manager-prompts), [ChatPRD](https://www.chatprd.ai/) (100k+ PMs) |
| UX Designer | User experience design, prototyping, usability heuristics | [Figma Make](https://www.figma.com/make/), [Figr](https://figr.design/) |
| Data Analyst | Business intelligence, metrics analysis, dashboard design | [BestPromptsDB](https://www.bestpromptsdb.com/business-analysis/), [Solutions Review](https://solutionsreview.com/business-intelligence/the-best-ai-agents-for-data-analysis/) |

---

## Marketing & Growth

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| Growth Engineer | CRO, SEO, analytics, growth engineering (32+ skills) | [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills), [marketing-skills.com](https://marketing-skills.com/) |
| Copywriter | Conversion-driven copywriting, ad creative | [Copy Hackers](https://copyhackers.com/ai-prompts/), [Pixis](https://pixis.ai/) |
| Content Strategist | Content strategy, editorial calendar, SEO optimization | Community best practices |
| Sales Agent | Sales automation, follow-up sequences, pipeline management | [Consensus](https://goconsensus.com/), [EverWorker](https://everworker.ai/) |

---

## Operations

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| Scrum Master | Sprint planning, standups, retrospectives, DORA metrics | [Microsoft Official Template](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/agent-template-scrum-assistant), [Scrum.org](https://www.scrum.org/) |
| Customer Success | Customer retention, NPS, churn prevention, onboarding | [Vitally](https://www.vitally.io/post/ai-prompts-for-cs) (23 prompts), [Ada](https://www.ada.cx/) |
| HR / Recruiter | Job descriptions, candidate evaluation, interview rubrics | [Juicebox/PeopleGPT](https://juicebox.ai/), [Korn Ferry](https://www.kornferry.com/) |

---

## Finance & Legal

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| FP&A Analyst | Budgeting, forecasting, variance analysis, CFO reporting | [Cube Software](https://www.cubesoftware.com/), [ChatFin](https://chatfin.ai/) |
| Legal Reviewer | Contract review, clause extraction, compliance monitoring | [Harvey](https://www.harvey.ai/), [Spellbook](https://www.spellbook.legal/) |

---

## Startup

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| Startup Builder | Idea validation → MVP → launch — full startup workflow | [rameerez/claude-code-startup-skills](https://github.com/rameerez/claude-code-startup-skills), [rsmdt/the-startup](https://github.com/rsmdt/the-startup) |

---

## Skill Collections

Large curated collections you can browse for additional roles:

| Collection | Scale | Source |
|-----------|-------|--------|
| Anthropic Official Skills | Official skill packages | [anthropics/skills](https://github.com/anthropics/skills) |
| Awesome Claude Skills | Curated selection | [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) |
| VoltAgent Skills | 500+ skills (Anthropic, Google, Vercel, Stripe, Cloudflare...) | [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) |
| Antigravity Skills | 1000+ battle-tested skills | [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) |
| Awesome Cursorrules | 38.5k★ collection across 13 categories | [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) |
| Cursor Directory | Community hub with voting and AI rule generator | [cursor.directory](https://cursor.directory/) |

---

## Contributing

Have a great brief or know a high-quality resource that should be listed here? Open a PR to add it to the catalog.
