# Metrics Reference

## SaaS / Subscription Metrics

| Metric | Formula | Good Benchmark |
|--------|---------|----------------|
| MRR | Sum of all monthly subscription revenue | Growing >10% MoM early stage |
| ARR | MRR × 12 | — |
| Churn Rate | Lost customers / Start of period customers | <5% monthly, <2% for enterprise |
| Net Revenue Retention | (Start MRR + Expansion - Contraction - Churn) / Start MRR | >100% is healthy, >120% is great |
| LTV | ARPU / Churn Rate | LTV:CAC > 3:1 |
| CAC | Total Sales+Marketing Spend / New Customers | Payback < 12 months |
| CAC Payback | CAC / Monthly Gross Profit per Customer | <12 months |
| Gross Margin | (Revenue - COGS) / Revenue | >70% for software |
| Burn Multiple | Net Burn / Net New ARR | <2x is efficient |

## Product / Engagement Metrics

| Metric | What It Tells You |
|--------|-------------------|
| DAU/MAU Ratio | Stickiness (>25% is good for B2B SaaS) |
| Activation Rate | % of signups who hit "aha moment" |
| Time to Value | How long from signup to first meaningful action |
| Feature Adoption | % of users using feature X within 30 days |
| Session Duration | Engagement depth (context-dependent) |
| D1/D7/D30 Retention | What % come back after 1/7/30 days |

## Growth Metrics

| Metric | Formula |
|--------|---------|
| Viral Coefficient | Invites sent × Conversion rate |
| Organic vs Paid Split | % of new users from organic channels |
| Activation Funnel | Signup → Onboarding → First Action → Habitual Use |
| Expansion Revenue | Upsell + Cross-sell as % of new revenue |

## Statistical Concepts for A/B Testing

- **Sample size**: Use power analysis before running tests. Most tests need 1000+ conversions per variant.
- **Statistical significance**: p < 0.05 minimum, p < 0.01 for important decisions
- **Minimum Detectable Effect**: Define upfront — "we need at least 5% lift to justify the change"
- **Duration**: Run for at least 2 full business cycles (usually 2 weeks)
- **Peeking**: Don't check results daily — pre-commit to a runtime
