# Contributing to AgentBrief

## Submit Your Brief to the Registry

Anyone can create and share a brief via GitHub. To get it listed in the official registry (so users can `agentbrief use your-brief-name`), submit a PR.

### Requirements

1. `brief.yaml` has `name`, `version`, and `description`
2. `personality.md` is concise (~30 lines): Role + Tone + Constraints
3. At least 1 knowledge file or 1 skill directory
4. Skills follow SKILL.md format (frontmatter with `name` + `description`)
5. Tested locally: `agentbrief use ./your-brief` works without errors
6. Open source license (MIT or Apache-2.0)

### Trust Levels

| Level | Meaning | How to get it |
|-------|---------|---------------|
| **official** | Maintained by the AgentBrief team | Core team only |
| **verified** | Community-created, reviewed and approved | Submit a PR (see below) |
| **community** | Listed but not reviewed | Coming soon |

### How to Submit

1. Fork this repository
2. Add your brief entry to the end of `registry.yaml`:
   ```yaml
   your-brief-name:
     source: github:your-username/your-repo
     description: One-line description of what it does
     trust: verified
   ```
3. Open a PR with:
   - What the brief does and who it's for
   - Link to the brief's GitHub repo
   - Confirmation that you've tested it locally
4. Maintainer review (typically within 48 hours)
5. Merge = your brief is live in the registry

### Quality Checklist

Before submitting, verify:

- [ ] `personality.md` is lean (~30 lines) — identity, not encyclopedia
- [ ] Knowledge files are reference material, not duplicated personality content
- [ ] Each skill has a clear trigger condition in its `description` field
- [ ] `agentbrief use ./your-brief` works in a clean temp directory
- [ ] `agentbrief eject your-brief-name` cleans up completely
- [ ] No hardcoded paths or machine-specific content

## Report Bugs

Open an [issue](https://github.com/0xranx/agentbrief/issues) with:
- Steps to reproduce
- Expected vs actual behavior
- Your Node.js and npm/pnpm version

## Suggest Features

Start a [Discussion](https://github.com/0xranx/agentbrief/discussions) in the Ideas category.
