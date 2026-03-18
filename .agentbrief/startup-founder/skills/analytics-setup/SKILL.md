---
name: analytics-setup
description: "When the user needs to set up product analytics, event tracking, or says 'set up analytics,' 'add tracking,' 'GA4,' 'Mixpanel,' 'PostHog,' 'Amplitude,' 'what events should we track,' 'conversion tracking,' 'funnel tracking,' or is launching a product and needs to instrument it for data collection."
---

# Analytics Setup

You are setting up product analytics that answer real business questions. Your goal is to create a tracking plan that captures meaningful user behavior without drowning in noise.

## Process

### 1. Define Key Questions

Before adding any tracking code, list the top 5 questions you need to answer:

1. Are users activating? (Reaching the "aha moment")
2. Are users coming back? (Retention)
3. Where do users drop off? (Funnel leaks)
4. Which features drive engagement? (Feature adoption)
5. What brings users to the product? (Attribution)

### 2. Design the Event Taxonomy

Use a consistent naming convention:

```
[object]_[action]

Examples:
- page_viewed
- signup_started
- signup_completed
- feature_used
- subscription_started
- subscription_cancelled
- error_occurred
```

Rules:
- Past tense for completed actions (`signup_completed` not `signup`)
- Snake_case, lowercase
- Object first, then action
- Include properties for context, not in the event name

### 3. Core Events (Every Product Needs These)

```javascript
// Identification
analytics.identify(userId, {
  email: user.email,
  created_at: user.createdAt,
  plan: user.plan,
});

// Page / Screen Views
analytics.page('Dashboard');

// Activation Funnel
analytics.track('signup_started', { source: 'landing_page' });
analytics.track('signup_completed', { method: 'google_oauth' });
analytics.track('onboarding_step_completed', { step: 1, step_name: 'create_workspace' });
analytics.track('activation_completed'); // User hit the "aha moment"

// Feature Usage
analytics.track('feature_used', {
  feature_name: 'export_csv',
  context: 'dashboard',
});

// Revenue
analytics.track('subscription_started', {
  plan: 'pro',
  billing_cycle: 'annual',
  mrr: 29,
});
```

### 4. Platform Selection Guide

| Tool | Best For | Price |
|------|----------|-------|
| **PostHog** | Self-hosted, open source, full suite | Free (self-hosted) |
| **Mixpanel** | Event analytics, funnels, retention | Free up to 20M events |
| **Amplitude** | Product analytics at scale | Free up to 10M events |
| **GA4** | Marketing analytics, attribution | Free |
| **Plausible** | Privacy-friendly, simple web analytics | $9/mo |

Recommendation for startups: **PostHog** (self-hosted) or **Mixpanel** (free tier) for product analytics + **GA4** for marketing attribution. Don't use GA4 alone — it's not built for product analytics.

### 5. Implementation Checklist

- [ ] Event taxonomy documented (shared spreadsheet or wiki page)
- [ ] Analytics library installed and configured
- [ ] User identification set up (anonymous → identified on signup)
- [ ] Core funnel events tracked (signup → activation → retention)
- [ ] Feature usage events tracked (top 5 features)
- [ ] Revenue events tracked (subscription lifecycle)
- [ ] Error events tracked (with error type and context)
- [ ] UTM parameters captured for attribution
- [ ] Events validated in dev before deploying to production
- [ ] Dashboard created for the 5 key questions from Step 1

## Anti-Patterns

- **Tracking everything** — 200 events where 20 would do. More events = more noise.
- **No naming convention** — `click_button`, `buttonClick`, `btn_clicked` for the same thing
- **Tracking PII in events** — Never include email, IP, or personal data in event properties
- **No documentation** — Events tracked but nobody knows what they mean
- **Analytics as afterthought** — Added after launch, missing the most valuable early data
