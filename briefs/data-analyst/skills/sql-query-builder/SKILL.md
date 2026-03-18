---
name: sql-query-builder
description: "When the user needs help writing SQL queries, analyzing data, building reports, or says 'write a query,' 'SQL help,' 'pull this data,' 'how many users,' 'funnel analysis,' 'cohort analysis,' 'retention query,' or needs to extract insights from a database."
---

# SQL Query Builder

You write SQL that is correct, readable, and performant. You optimize for the human reading the query, not just the database executing it.

## Style Rules

1. **Use CTEs over subqueries** — Readable, debuggable, testable
2. **Explicit column names** — Never `SELECT *` in production queries
3. **Consistent formatting** — Keywords uppercase, one clause per line
4. **Comment the "why"** — Not what the code does, but why this approach

```sql
-- Good: CTEs with clear names
WITH active_users AS (
    SELECT user_id, COUNT(*) AS session_count
    FROM sessions
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_id
    HAVING COUNT(*) >= 3
),
user_revenue AS (
    SELECT user_id, SUM(amount) AS total_revenue
    FROM payments
    WHERE status = 'completed'
    GROUP BY user_id
)
SELECT
    au.user_id,
    au.session_count,
    COALESCE(ur.total_revenue, 0) AS total_revenue
FROM active_users au
LEFT JOIN user_revenue ur ON au.user_id = ur.user_id
ORDER BY ur.total_revenue DESC NULLS LAST;
```

## Common Analysis Patterns

### Funnel Analysis
```sql
WITH funnel AS (
    SELECT
        COUNT(DISTINCT CASE WHEN step = 'visit' THEN user_id END) AS visitors,
        COUNT(DISTINCT CASE WHEN step = 'signup' THEN user_id END) AS signups,
        COUNT(DISTINCT CASE WHEN step = 'activate' THEN user_id END) AS activated,
        COUNT(DISTINCT CASE WHEN step = 'purchase' THEN user_id END) AS purchasers
    FROM events
    WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT
    visitors,
    signups,
    ROUND(100.0 * signups / NULLIF(visitors, 0), 1) AS visit_to_signup_pct,
    activated,
    ROUND(100.0 * activated / NULLIF(signups, 0), 1) AS signup_to_activation_pct,
    purchasers,
    ROUND(100.0 * purchasers / NULLIF(activated, 0), 1) AS activation_to_purchase_pct
FROM funnel;
```

### Cohort Retention
```sql
WITH user_cohorts AS (
    SELECT
        user_id,
        DATE_TRUNC('week', created_at) AS cohort_week
    FROM users
),
activity AS (
    SELECT
        user_id,
        DATE_TRUNC('week', event_at) AS activity_week
    FROM events
)
SELECT
    uc.cohort_week,
    COUNT(DISTINCT uc.user_id) AS cohort_size,
    COUNT(DISTINCT CASE
        WHEN a.activity_week = uc.cohort_week + INTERVAL '1 week'
        THEN a.user_id
    END) AS week_1_retained,
    ROUND(100.0 * COUNT(DISTINCT CASE
        WHEN a.activity_week = uc.cohort_week + INTERVAL '1 week'
        THEN a.user_id
    END) / NULLIF(COUNT(DISTINCT uc.user_id), 0), 1) AS week_1_retention_pct
FROM user_cohorts uc
LEFT JOIN activity a ON uc.user_id = a.user_id
GROUP BY uc.cohort_week
ORDER BY uc.cohort_week;
```

### Time Series with Moving Average
```sql
SELECT
    date,
    daily_value,
    AVG(daily_value) OVER (
        ORDER BY date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS moving_avg_7d
FROM daily_metrics
ORDER BY date;
```

## Performance Tips

- Add `EXPLAIN ANALYZE` before committing to verify query plan
- Index columns used in WHERE, JOIN, and ORDER BY
- Use `LIMIT` during exploration, remove for production reports
- Avoid `DISTINCT` when `GROUP BY` gives the same result more efficiently
- Partition large tables by date for time-series queries
