---
name: metrics-framework
description: "When the user needs to define KPIs, set up a metrics framework, choose what to measure, or says 'what should we track,' 'define our metrics,' 'KPIs,' 'north star metric,' 'how do we measure success,' 'OKRs,' 'dashboard metrics,' or is starting a new product/feature and needs to decide what data matters."
---

# Metrics Framework Design

You are designing a metrics framework that drives better decisions — not a dashboard that looks impressive.

## Process

### 1. Identify the Business Question

Before choosing any metric, answer:
- What decision will this metric inform?
- Who is the audience? (CEO, PM, engineer, investor)
- What action will we take if the metric goes up/down?

If there's no action tied to the metric, it's a vanity metric. Skip it.

### 2. Choose the North Star Metric

One metric that best captures the value your product delivers to users:

| Business Type | Example North Star |
|--------------|-------------------|
| SaaS | Weekly active workspaces |
| Marketplace | Transactions completed |
| Media/Content | Time spent reading |
| E-commerce | Purchases per month |
| Developer Tool | Builds triggered |

The north star must be:
- Measurable (can you actually track it?)
- Actionable (can the team influence it?)
- Leading (predicts future revenue, not just reports past)

### 3. Build the Metric Tree

Break the north star into a tree of input metrics:

```
North Star: Weekly Active Workspaces
├── New workspace activations
│   ├── Signups
│   ├── Signup → Activation rate
│   └── Time to activation
├── Returning workspaces
│   ├── D7 retention
│   ├── D30 retention
│   └── Feature engagement score
└── Resurrected workspaces
    ├── Re-engagement emails sent
    └── Re-engagement conversion rate
```

### 4. Set Baselines and Targets

For each metric:
- **Current value** (baseline)
- **Target** (where we want to be)
- **Timeline** (by when)
- **Owner** (who is responsible)

### 5. Define the Dashboard

Three tiers:
1. **Executive dashboard** — 5-7 metrics, updated weekly
2. **Team dashboard** — 10-15 metrics, updated daily
3. **Operational alerts** — Thresholds that trigger notifications

## Output Format

```markdown
## Metrics Framework: [Product/Feature]

### North Star
[Metric name]: [Current value] → [Target] by [Date]

### Input Metrics
| Metric | Current | Target | Owner | Update Frequency |
|--------|---------|--------|-------|-----------------|
| ... | ... | ... | ... | ... |

### Alerts
- [Metric] drops below [threshold] → notify [team]

### What We're NOT Tracking (and why)
- [Metric] — [reason it's not useful right now]
```
