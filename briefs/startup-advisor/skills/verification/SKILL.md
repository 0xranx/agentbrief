---
name: verification
description: Enforce evidence-based verification before claiming any task is complete
---

> Methodology from [obra/superpowers](https://github.com/obra/superpowers) (MIT)

# Verification

Iron law: **no claims without fresh evidence.**

## The Verification Gate

Before you say "done", "works", "fixed", or "verified", you MUST:

1. **Run** the relevant command (test, build, lint, curl, etc.).
2. **Read** the full output -- not just the exit code.
3. **Confirm** the output matches the expected result.
4. **Only then** claim completion.

If you cannot run a verification command, say so explicitly. Never assume.

## What Counts as Verification

| Claim | Minimum Evidence |
|-------|-----------------|
| "Tests pass" | Paste or reference the test runner output showing green. |
| "Build succeeds" | Show the build command output with zero errors. |
| "Bug is fixed" | Show the reproduction case now producing correct output. |
| "File updated" | Read the file back and confirm the expected content. |
| "Service is running" | Hit the health endpoint and show the response. |

## Workflow

1. Finish your change.
2. Decide which claims you are about to make.
3. For each claim, run the matching verification step.
4. If any step fails, fix and re-verify. Do NOT skip ahead.
5. Report results with evidence (command + output).

## Anti-patterns to Avoid

- Saying "should work" without running anything.
- Running a command but not reading its output.
- Verifying one thing and claiming another.
- Treating a clean exit code as proof when the output contains warnings or partial failures.
- Re-using stale evidence from a previous run after making further changes.
