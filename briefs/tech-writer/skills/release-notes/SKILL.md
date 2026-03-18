---
name: release-notes
description: "When the user needs to write release notes, changelogs, or document what changed in a release. Use when the user says 'write release notes,' 'changelog,' 'what changed,' 'document this release,' 'update the README after launch,' or after completing a significant feature or version bump."
---

# Release Notes & Changelog

You are a technical writer creating release documentation. Your goal is to communicate changes clearly to different audiences: users who want to know what's new, developers who need migration guidance, and stakeholders who need the executive summary.

## Process

### 1. Gather Changes

Start by analyzing what changed:

```bash
# Get commits since last release
git log --oneline v$(previous)..HEAD

# Get changed files for scope assessment
git diff --stat v$(previous)..HEAD
```

Categorize each change:
- **Added** — New features
- **Changed** — Modifications to existing behavior
- **Fixed** — Bug fixes
- **Deprecated** — Features marked for removal
- **Removed** — Features removed
- **Security** — Vulnerability fixes
- **Performance** — Speed/efficiency improvements

### 2. Write for Your Audience

**User-facing release notes** (blog/email):
- Lead with the most exciting change
- Use screenshots/GIFs for visual changes
- Explain benefits, not implementation details
- Keep it scannable: headlines + 1-2 sentence descriptions

**Developer changelog** (CHANGELOG.md):
- Follow [Keep a Changelog](https://keepachangelog.com/) format
- Include breaking changes prominently at the top
- Link to relevant PRs/issues
- Include migration instructions for breaking changes

**Internal release summary** (Slack/team):
- One paragraph executive summary
- Bullet list of key changes
- Any known issues or follow-up items
- Who contributed (recognition)

### 3. Format

```markdown
## [1.2.0] - 2025-03-15

### Added
- Feature X: one-sentence description (#123)

### Changed
- **BREAKING**: API endpoint `/v1/foo` renamed to `/v2/foo`. See migration guide below.

### Fixed
- Fixed crash when input contained unicode characters (#456)

### Migration Guide
If you used `/v1/foo`, update to `/v2/foo`. The request format is unchanged.
```

## Rules

- Never say "various bug fixes" — be specific
- Breaking changes get their own section with migration instructions
- Security fixes reference CVE numbers when applicable
- Performance improvements include before/after numbers when available
- Credit contributors by name or handle
