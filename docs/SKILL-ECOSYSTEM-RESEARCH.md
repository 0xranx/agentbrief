# Skill Ecosystem Research

> Last updated: 2026-03-17
> Purpose: Comprehensive inventory of all well-endorsed AI coding agent skills, mapped to AgentBrief brief/skill gaps.

---

## 1. Key Sources Surveyed

| Source | Stars | Skills | Strengths |
|--------|-------|--------|-----------|
| [garrytan/gstack](https://github.com/garrytan/gstack) | — | 13 | YC-founder-caliber workflow: CEO review, design scoring, QA with screenshots, atomic ship |
| [anthropics/skills](https://github.com/anthropics/skills) | 95.8k | 17 | Official Anthropic: MS Office suite (docx/pdf/pptx/xlsx), design, MCP builder, webapp testing |
| [obra/superpowers](https://github.com/obra/superpowers) | 90.6k | 14 | Software methodology: TDD, debugging, brainstorming, git worktrees, parallel agents |
| [trailofbits/skills](https://github.com/trailofbits/skills) | — | 22 | Professional security: Semgrep rules, supply-chain audit, variant analysis, smart contracts |
| [akin-ozer/cc-devops-skills](https://github.com/akin-ozer/cc-devops-skills) | — | 31 | DevOps IaC: Terraform/Ansible/Docker/K8s/Helm generators + validators, CI/CD for 4 platforms |
| [jeffallan/claude-skills](https://github.com/jeffallan/claude-skills) | — | 66 | Full-stack: 12 categories covering languages, frameworks, infra, APIs, testing, security, data/ML |
| [rsmdt/the-startup](https://github.com/rsmdt/the-startup) | — | 15 | Startup team: specify→implement→validate→test→review→document→refactor→debug, 8 agent roles |
| [K-Dense-AI/claude-scientific-skills](https://github.com/K-Dense-AI/claude-scientific-skills) | — | 170 | Scientific: 250+ databases, bioinformatics, cheminformatics, clinical tools |
| [rameerez/claude-code-startup-skills](https://github.com/rameerez/claude-code-startup-skills) | — | 5 | Startup social: compress images, customer empathy, video download/transcribe, X posting |
| [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) | — | 5 | Methodology: brainstorm→plan→work→review→compound (learn from mistakes) |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | — | Index | Master index: 17+ skill repos, 36+ workflow repos, orchestrators, tooling |
| [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) | 38.5k | 200+ | Cursor rules across 13 categories — largest community collection |

---

## 2. gstack Deep Dive (Garry Tan / YC)

The most opinionated and highest-signal skill set. Each skill embodies a specific cognitive role:

| Skill | Role | What It Does | AgentBrief Relevance |
|-------|------|-------------|---------------------|
| `/plan-ceo-review` | Founder/CEO | Rethinks problems for "10-star product"; applies founder taste | **HIGH** — startup-advisor lacks metacognitive founder layer |
| `/plan-eng-review` | Eng Manager | Architecture, data flow, edge cases, diagrams, tests | **HIGH** — code-reviewer lacks architecture-first review |
| `/plan-design-review` | Sr Designer | 80-item checklist, "AI Slop Score" (10 anti-patterns), design system inference | **HIGH** — design-engineer is too generic |
| `/design-consultation` | Design Partner | Builds complete design systems from scratch with research | **MED** — could enhance design-engineer |
| `/review` | Staff Engineer | Finds production-breaking bugs that pass CI (race conditions, trust boundaries) | **HIGH** — code-reviewer could absorb this |
| `/ship` | Release Engineer | Sync main → run tests → push branch → open PR | **HIGH** — we have zero shipping workflow |
| `/browse` | QA Engineer | Headless browser visual feedback; logs in and navigates | **MED** — requires Bun runtime |
| `/qa` | QA + Fix | Tests, finds bugs, fixes with atomic commits; 3 intensity tiers | **HIGH** — we have zero QA skills |
| `/qa-only` | QA Reporter | Report-only testing without code changes | **HIGH** — pairs with /qa |
| `/qa-design-review` | Designer + FE | Design audit → CSS-only fixes → before/after screenshots | **MED** — nice but niche |
| `/retro` | Eng Manager | Team retrospectives with per-person feedback | **LOW** — team feature, not solo |
| `/document-release` | Tech Writer | Updates README/ARCHITECTURE/CONTRIBUTING post-launch | **HIGH** — tech-writer lacks post-launch workflow |
| `/setup-browser-cookies` | Session Manager | Import cookies for authenticated testing | **LOW** — infrastructure helper |

### Key gstack Design Principles We Should Adopt:
1. **Cognitive separation** — "Planning is not review; review is not shipping; founder taste is not engineering rigor"
2. **AI Slop Detection** — 10 anti-patterns: gradient heroes, 3-column icon grids, uniform border-radius, etc.
3. **Scoring systems** — Design Score (A-F) gives tangible feedback
4. **Atomic commits** — `style(design): FINDING-NNN`, `fix: ...` for bisectability

---

## 3. Anthropic Official Skills (17)

| Skill | Category | AgentBrief Relevance |
|-------|----------|---------------------|
| algorithmic-art | Creative | LOW |
| brand-guidelines | Creative | MED — could enhance growth-engineer |
| canvas-design | Creative | LOW |
| claude-api | Development | LOW — niche |
| doc-coauthoring | Productivity | MED |
| docx | MS Office | **HIGH** — investors want Word docs |
| design-engineer | Development | Already adapted |
| internal-comms | Communication | MED |
| mcp-builder | Development | LOW — niche |
| pdf | MS Office | **HIGH** — contracts, reports |
| pptx | MS Office | **HIGH** — pitch decks |
| skill-creator | Meta | LOW |
| slack-gif-creator | Fun | LOW |
| theme-factory | Creative | LOW |
| web-artifacts-builder | Development | MED |
| webapp-testing | Testing | **HIGH** — we need QA skills |
| xlsx | MS Office | **HIGH** — financial models |

---

## 4. Trail of Bits Security Skills (22)

Most valuable for enhancing security-auditor:

| Skill | Priority for AgentBrief |
|-------|------------------------|
| supply-chain-risk-auditor | **HIGH** — npm/pip dependency audit |
| insecure-defaults | **HIGH** — hardcoded creds, fail-open patterns |
| static-analysis (CodeQL/Semgrep/SARIF) | **HIGH** — automated scanning |
| differential-review | **HIGH** — security-focused diff review |
| semgrep-rule-creator | MED |
| sharp-edges | MED — API footgun detection |
| variant-analysis | MED |
| fp-check | MED |
| building-secure-contracts | LOW — blockchain niche |
| Others | LOW — specialized |

---

## 5. DevOps Skills (cc-devops-skills, 31)

Most valuable for enhancing devops-sre:

| Category | Skills | Priority |
|----------|--------|----------|
| GitHub Actions gen + validate | 2 | **HIGH** — every project uses CI |
| Dockerfile gen + validate | 2 | **HIGH** — containerization is universal |
| K8s YAML gen + validate + debug | 3 | **HIGH** — production deploys |
| Terraform gen + validate | 2 | MED — IaC users only |
| Helm gen + validate | 2 | MED |
| PromQL gen + validate | 2 | MED — monitoring |
| Bash script gen + validate | 2 | MED |
| Makefile gen + validate | 2 | LOW |
| GitLab CI, Azure Pipelines, Jenkins | 6 | LOW — platform-specific |
| Ansible, Terragrunt, FluentBit, Loki | 8 | LOW — specialized |

---

## 6. Gap Analysis: Current vs Needed

### What We Have (10 standalone + 2 combos):

| Brief | Skills Count | Quality |
|-------|-------------|---------|
| security-auditor | 3 (security-review, systematic-debugging, verification) | Good |
| code-reviewer | 2 (review-process, verification) | Needs enhancement |
| typescript-engineer | 1 (typescript-advanced-types) | Good |
| nextjs-developer | 2 (next-best-practices with 20 refs, tdd) | Excellent |
| design-engineer | 1 (web-design-guidelines) | Needs enhancement |
| devops-sre | 3 (monitoring-observability, systematic-debugging, verification) | Needs CI/CD |
| tech-writer | 2 (api-documentation, plan-and-execute) | Good |
| growth-engineer | 2 (brainstorming, seo-audit) | Good |
| product-manager | 1 (brainstorming) | Needs more skills |
| startup-advisor | 3 (launch-strategy, tdd, verification) | Needs founder layer |

### Critical Gaps (from real entrepreneur's daily workflow):

1. **QA/Testing** — No QA brief. Every startup ships buggy code. gstack's /qa is the gold standard.
2. **Ship/Deploy Workflow** — No git workflow skills. Push, PR, CI — this is daily bread.
3. **Design Review with Scoring** — gstack's 80-item checklist and AI Slop Score is a differentiator.
4. **CEO/Founder Review** — Strategic product thinking before engineering. gstack's 10-star product approach.
5. **Data Analyst** — Listed in catalog but no brief. Every startup needs metrics.
6. **Document Generation** — Pitch decks (pptx), financial models (xlsx), contracts (docx/pdf).
7. **Competitive Analysis** — Not covered anywhere. Founders need market research.
8. **Customer Interview/Empathy** — rameerez has a basic version; needs expansion.

### Missing Briefs (catalog lists them but no code):
- Python/Django, Vue.js, Go, Rust, Swift/SwiftUI
- UX Designer, Data Analyst
- Copywriter, Content Strategist, Sales Agent
- Scrum Master, Customer Success, HR/Recruiter
- FP&A Analyst, Legal Reviewer

---

## 7. Recommended Skill Additions Per Brief

### security-auditor — Add:
- `supply-chain-audit` (from Trail of Bits concept)
- `insecure-defaults` (from Trail of Bits concept)
- `static-analysis-guide` (CodeQL/Semgrep orientation)

### code-reviewer — Add:
- `architecture-review` (from gstack eng-review concept)
- `differential-review` (security-focused diff, Trail of Bits concept)

### design-engineer — Add:
- `design-review-checklist` (from gstack's 80-item checklist + AI slop detection)
- `design-system-builder` (from gstack's design consultation)

### devops-sre — Add:
- `ci-cd-github-actions` (from cc-devops-skills)
- `dockerfile-best-practices` (from cc-devops-skills)
- `k8s-troubleshooting` (from cc-devops-skills)

### startup-advisor — Add:
- `ceo-review` (from gstack's founder taste approach)
- `customer-empathy` (from rameerez, expanded)
- `competitive-analysis` (new)

### product-manager — Add:
- `user-story-mapping` (new)
- `prioritization-frameworks` (RICE, ICE, Moscow)
- `specification` (from the-startup's /specify)

### growth-engineer — Add:
- `content-strategy` (editorial calendar, topic clusters)
- `conversion-optimization` (A/B test design, funnel analysis)
- `analytics-setup` (GA4, Mixpanel, PostHog orientation)

### tech-writer — Add:
- `release-notes` (from gstack's document-release concept)
- `changelog-generator` (automated from git history)

---

## 8. New Brief Proposals

### qa-engineer (NEW)
Role: Automated QA — run tests, find bugs, fix with atomic commits.
Skills: qa-test-and-fix, qa-report-only, regression-testing
Inspiration: gstack /qa, /qa-only

### data-analyst (NEW)
Role: Business intelligence, metrics, dashboards.
Skills: sql-query-builder, metrics-framework, dashboard-design
Inspiration: catalog listing, startup needs

### ship-engineer (NEW) — OR add as skill to existing briefs
Role: Git workflow automation — sync, test, branch, PR.
Skills: git-ship, pr-template, release-management
Inspiration: gstack /ship

### copywriter (NEW)
Role: Conversion copywriting, ad creative, landing pages.
Skills: landing-page-copy, email-sequences, ad-creative
Inspiration: catalog listing, startup needs
