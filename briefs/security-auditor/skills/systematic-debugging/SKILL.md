---
name: systematic-debugging
description: Structured methodology for finding root causes before writing fixes
---

> Methodology from [obra/superpowers](https://github.com/obra/superpowers) (MIT)

# Systematic Debugging

Core rule: **find the root cause before writing any fix.**

## Phase 1 -- Root Cause Investigation

1. Reproduce the bug with the simplest possible input.
2. Read the actual error message / stack trace. Do NOT guess.
3. Trace the data flow backwards from the failure site to the origin.
4. Identify the earliest point where observed behavior diverges from expected.

## Phase 2 -- Pattern Analysis

1. Search the codebase for similar patterns (same API, same data path).
2. Check recent changes (git log, git blame) near the failure site.
3. Look for related open issues or past fixes for the same component.
4. Note if the bug is deterministic or intermittent -- intermittent implies concurrency, timing, or external state.

## Phase 3 -- Hypothesis Testing

1. Form exactly one hypothesis at a time.
2. Design a minimal experiment that can confirm or refute it.
3. Run the experiment. Read the output fully.
4. If refuted, discard the hypothesis and return to Phase 1 or 2. Do NOT patch and hope.

## Phase 4 -- Implementation

1. Write a failing test that demonstrates the root cause.
2. Apply the smallest change that makes the test pass.
3. Run the full test suite to check for regressions.
4. Verify the original reproduction case is resolved.
5. Document *why* the bug happened, not just *what* you changed.

## Anti-patterns to Avoid

- Shotgun debugging: making multiple changes at once.
- Fixing symptoms instead of root causes.
- Claiming "fixed" without re-running the reproduction case.
- Skipping the hypothesis step and jumping straight to code changes.
