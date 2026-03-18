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
| Security Auditor | OWASP/CWE security review specialist | **Included:** `agentbrief use security-auditor` |
| Code Reviewer | Rigorous PR review — architecture review, naming, tests | **Included:** `agentbrief use code-reviewer` — [garrytan/gstack](https://github.com/garrytan/gstack) |
| QA Engineer | Automated QA — find bugs, write tests, fix with atomic commits | **Included:** `agentbrief use qa-engineer` — [garrytan/gstack](https://github.com/garrytan/gstack) |

### Toolchain

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| DevOps / SRE | Monitoring, diagnostics, incident response, IaC | [Azure SRE Agent](https://azure.microsoft.com/en-us/products/sre-agent), [fuzzylabs/sre-agent](https://github.com/fuzzylabs/sre-agent) |
| Frontend Design | React + Tailwind + shadcn/ui design engineering | [anthropics/skills](https://github.com/anthropics/skills) (Official) |
| MCP Builder | Model Context Protocol server development guide | [anthropics/skills](https://github.com/anthropics/skills) (Official) |
| Tech Writer | Technical documentation with style guide adherence | [Fern](https://buildwithfern.com/), [Document360](https://document360.com/) |
| Monorepo | Turborepo + pnpm workspaces conventions | [cursor.directory/monorepo](https://cursor.directory/rules/monorepo) |

### Skills (bundled into role briefs)

Skills are **bundled into each role brief's `skills/` directory** — not installed separately. Sources include [obra/superpowers](https://github.com/obra/superpowers) (90.6k★), [garrytan/gstack](https://github.com/garrytan/gstack) (YC), [trailofbits/skills](https://github.com/trailofbits/skills), and [cc-devops-skills](https://github.com/akin-ozer/cc-devops-skills).

| Skill | Bundled Into | Inspired By |
|-------|-------------|-------------|
| Architecture Review | code-reviewer | gstack /plan-eng-review |
| Design Review Checklist (80 items + AI Slop Score) | frontend-design | gstack /plan-design-review |
| CEO / Founder Review (10-star framework) | startup-builder | gstack /plan-ceo-review |
| CI/CD GitHub Actions | devops-sre | cc-devops-skills |
| Specification (PRD, RICE/ICE) | product-manager | the-startup /specify |
| Release Notes | tech-writer | gstack /document-release |
| Content Strategy | growth-engineer | — |
| Analytics Setup | growth-engineer | — |
| Systematic Debugging | security-auditor, devops-sre | obra/superpowers |
| Verification | security-auditor, code-reviewer, devops-sre, startup-builder | obra/superpowers |
| TDD | nextjs-fullstack, startup-builder | obra/superpowers |
| Brainstorming | product-manager, growth-engineer | obra/superpowers |
| QA Test & Fix (3 tiers) | qa-engineer | gstack /qa |
| Regression Testing | qa-engineer | — |
| SQL Query Builder | data-analyst | — |
| Metrics Framework | data-analyst | — |

---

## Product

| Role | Description | Source / Inspiration |
|------|-------------|---------------------|
| Product Manager | PRD generation, user stories, specs, prioritization (RICE/ICE) | **Included:** `agentbrief use product-manager` — [ChatPRD](https://www.chatprd.ai/) |
| Data Analyst | Metrics framework, SQL queries, dashboards, data storytelling | **Included:** `agentbrief use data-analyst` |
| UX Designer | User experience design, prototyping, usability heuristics | [Figma Make](https://www.figma.com/make/), [Figr](https://figr.design/) |

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
| Startup Builder | Idea validation → MVP → launch + CEO review (10-star framework) | **Included:** `agentbrief use startup-builder` — [garrytan/gstack](https://github.com/garrytan/gstack), [rameerez](https://github.com/rameerez/claude-code-startup-skills) |

### Combo Packs

| Role | Extends | Skills Count |
|------|---------|-------------|
| Full-Stack Dev | typescript-strict + nextjs + frontend-design + code-reviewer | 8 skills |
| Startup Kit | startup-builder + product-manager + growth-engineer + security-auditor | 9 skills |

---

## Skill Collections

Large curated collections you can browse for additional roles:

| Collection | Scale | Source |
|-----------|-------|--------|
| Anthropic Official Skills | 17 official skills (MS Office suite, design, MCP) | [anthropics/skills](https://github.com/anthropics/skills) (95.8k★) |
| gstack (Garry Tan / YC) | 13 opinionated workflow skills (CEO review, QA, ship, design) | [garrytan/gstack](https://github.com/garrytan/gstack) |
| obra/superpowers | 14 software methodology skills (TDD, debugging, git worktrees) | [obra/superpowers](https://github.com/obra/superpowers) (90.6k★) |
| Trail of Bits Security | 22 professional security skills (Semgrep, supply chain, variants) | [trailofbits/skills](https://github.com/trailofbits/skills) |
| DevOps Skills | 31 IaC skills (Terraform, Docker, K8s, CI/CD for 4 platforms) | [akin-ozer/cc-devops-skills](https://github.com/akin-ozer/cc-devops-skills) |
| Scientific Skills | 170 skills for research, bioinformatics, chemistry | [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) |
| Awesome Claude Code | Master index of 500+ tools, skills, and workflows | [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) |
| Awesome Cursorrules | 38.5k★ collection across 13 categories | [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) |
| Cursor Directory | Community hub with voting and AI rule generator | [cursor.directory](https://cursor.directory/) |

---

## Contributing

Have a great brief or know a high-quality resource that should be listed here? Open a PR to add it to the catalog.
