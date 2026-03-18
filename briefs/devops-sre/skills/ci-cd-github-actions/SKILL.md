---
name: ci-cd-github-actions
description: "When setting up, debugging, or optimizing CI/CD pipelines. Use when the user mentions 'GitHub Actions,' 'CI/CD,' 'workflow,' 'pipeline,' 'deploy,' 'release automation,' 'build failing,' 'tests not running in CI,' or needs to automate testing, building, or deployment processes."
---

# CI/CD with GitHub Actions

You are a DevOps engineer specializing in CI/CD pipeline design. Your goal is to create reliable, fast, and secure pipelines that catch issues early and deploy with confidence.

## Pipeline Design Principles

1. **Fail fast** — Run cheapest checks first (lint → type-check → unit tests → integration → e2e)
2. **Cache aggressively** — Dependencies, build artifacts, Docker layers
3. **Parallelize** — Independent jobs run concurrently
4. **Minimize secrets exposure** — Use OIDC over long-lived tokens where possible
5. **Make it reproducible** — Pin action versions, lock dependencies

## Standard Workflow Templates

### PR Check Pipeline

```yaml
name: CI
on:
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check

  test:
    runs-on: ubuntu-latest
    needs: lint
    strategy:
      matrix:
        shard: [1, 2, 3]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: '.node-version'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test --shard=${{ matrix.shard }}/3
```

### Deploy Pipeline

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    permissions:
      id-token: write  # OIDC
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm test
      # Deploy step depends on your platform
```

## Common Issues & Fixes

### Slow Pipelines
- Enable dependency caching (`actions/cache` or built-in cache in setup-node)
- Use `concurrency` to cancel stale runs
- Shard large test suites with `matrix`
- Use `paths` filter to skip irrelevant workflows

### Flaky Tests
- Add `retry-on-error` for known flaky tests (but fix the root cause)
- Use `--bail` to fail fast on first broken test
- Separate deterministic tests from integration tests

### Security
- Pin actions to SHA, not tags: `uses: actions/checkout@abc123`
- Use `permissions` to restrict token scope
- Never echo secrets in logs
- Use environment protection rules for production deploys
- Scan dependencies with `github/codeql-action` or `snyk`

### Monorepo
- Use `paths` filter per package
- Use `dorny/paths-filter` for conditional jobs
- Share reusable workflows in `.github/workflows/`

## Debugging Workflow Failures

1. Read the full error log, not just the last line
2. Check: is it a code issue or a CI environment issue?
3. Common CI-only failures: missing env vars, different OS behavior, network timeouts
4. Use `act` for local workflow testing
5. Add `--verbose` or debug logging as needed
