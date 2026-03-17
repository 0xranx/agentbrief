# DevOps/SRE Runbook

## Core Principles

- **Everything as Code** -- infrastructure, configuration, monitoring, alerts. No manual changes to production.
- **Observability first** -- if you cannot measure it, you cannot improve it. Every service needs metrics, logs, and traces.
- **Blast radius minimization** -- canary deploys, feature flags, circuit breakers. Never deploy to 100% at once.
- **Automate toil** -- if you do it twice, automate it the third time.

## Infrastructure

- Use Terraform or Pulumi for infrastructure provisioning
- Docker for containerization -- multi-stage builds, minimal base images (distroless or Alpine)
- Kubernetes for orchestration when complexity warrants it; managed platforms (Vercel, Railway, Fly.io) when it does not
- Use managed services when they reduce operational burden (RDS over self-hosted Postgres, etc.)
- Tag all resources with owner, environment, and cost center

## CI/CD Pipeline

### Standard Pipeline Stages
1. **Lint** -- code style, security scanning (SAST)
2. **Build** -- compile, bundle, create container image
3. **Test** -- unit, integration, contract tests
4. **Deploy to staging** -- automatic on merge to main
5. **Deploy to production** -- requires all tests green + approval + canary period

### Pipeline Rules
- Rollback must be one command or automatic on health check failure
- Keep build times under 5 minutes -- parallelize, cache aggressively
- Pin all dependency versions, including CI tool versions
- Store build artifacts with immutable tags (git SHA, not "latest")

## Monitoring: Four Golden Signals

1. **Latency** -- time to serve a request (distinguish success vs error latency)
2. **Traffic** -- requests per second, concurrent connections
3. **Errors** -- HTTP 5xx rate, failed health checks, exception rate
4. **Saturation** -- CPU, memory, disk, connection pool utilization

### Alerting Rules
- Alert on symptoms (user impact), not causes (CPU usage)
- Every alert must have a runbook link
- Use structured logging (JSON) -- never `console.log` in production
- Three severity levels: page (wake someone up), ticket (fix this week), log (investigate when convenient)

## Incident Response Process

### 1. Detect
- Automated alerts fire based on SLO breach or anomaly detection
- User reports via support channel

### 2. Triage
- Assess severity: how many users affected? Is data at risk?
- Assign incident commander

### 3. Mitigate
- Mitigate first, investigate later -- rollback is always an option
- Feature flags to disable problematic functionality
- Scale up if the issue is capacity-related

### 4. Resolve
- Root cause identified and fixed
- Deploy fix through normal pipeline (with expedited review)

### 5. Postmortem
- Blameless -- focus on systems, not people
- Timeline of events, root cause, contributing factors
- Action items with owners and deadlines
- Communicate status early and often throughout
