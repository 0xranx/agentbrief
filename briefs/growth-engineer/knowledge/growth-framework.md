# Growth Engineering Framework

## AARRR Framework (Pirate Metrics)

### 1. Acquisition -- How do users find the product?
- SEO (technical and content)
- Referral loops and viral mechanics
- Paid channels (CAC optimization)
- Content marketing and programmatic SEO
- Partnership and integration channels

### 2. Activation -- How fast do users reach the "aha moment"?
- Optimize onboarding flow, reduce friction
- Time-to-value as the key metric
- Progressive profiling (do not ask for everything upfront)
- Guided tours and contextual tooltips
- Track activation milestones as a funnel

### 3. Retention -- Why do users come back?
- Engagement loops (notifications, digests, streaks)
- Habit formation through variable rewards
- Cohort retention curves (D1, D7, D30)
- Re-engagement campaigns for churning users
- Feature adoption tracking

### 4. Revenue -- How does usage convert to revenue?
- Pricing experiments and packaging
- Upsell triggers at natural expansion points
- Free-to-paid conversion funnel
- Expansion revenue (seats, usage, tier upgrades)
- Churn prevention and win-back flows

### 5. Referral -- How do users bring other users?
- Invite mechanics with clear incentives
- Share-worthy moments (achievements, results)
- Viral coefficient tracking (K-factor)
- Social proof and testimonials
- Network effects where applicable

## Technical Skills

### A/B Testing
- Implement feature flags for experiment infrastructure
- Ensure proper randomization and sample allocation
- Calculate minimum sample size before starting
- Run tests long enough for statistical significance
- Watch for novelty effects and Simpson's paradox

### Analytics
- Instrument events with proper taxonomy (object_action format: `button_clicked`, `form_submitted`)
- Build conversion funnels with drop-off analysis
- Track cohort retention (grouped by signup week/month)
- Set up real-time dashboards for key metrics
- Use UTM parameters consistently for attribution

### SEO
- Technical SEO: meta tags, structured data (JSON-LD), sitemap, robots.txt
- Core Web Vitals optimization (LCP, FID, CLS)
- Programmatic SEO for scalable content pages
- Internal linking strategy
- Schema markup for rich search results

### CRO (Conversion Rate Optimization)
- Landing page optimization (hero, social proof, CTA placement)
- Form funnel analysis (field-level drop-off)
- Checkout flow improvements (reduce steps, add trust signals)
- Copy testing (headlines, CTAs, value propositions)
- Page speed as a conversion factor

### Email / Notification
- Trigger-based sequences (welcome, activation, re-engagement)
- Personalization based on user behavior and segment
- Deliverability best practices (SPF, DKIM, DMARC)
- Frequency capping to avoid notification fatigue
- Measure open rate, click rate, and downstream conversion

## Data-Driven Approach

- Define the metric before building the feature
- Instrument everything -- you cannot optimize what you do not measure
- Use cohort analysis, not averages -- averages hide important patterns
- Run experiments long enough for statistical significance
- Document every experiment: hypothesis, variant, result, learnings
