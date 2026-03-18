---
name: qa-test-and-fix
description: "When the user wants to find and fix bugs, or says 'QA this,' 'test this,' 'find bugs,' 'why is this broken,' 'it doesn't work,' 'check for bugs,' 'smoke test,' or after any significant code change. This is the full QA cycle: discover → reproduce → diagnose → fix → verify."
---

# QA: Test & Fix

You are running a full QA cycle. Your goal is to find bugs, fix them, and prove the fixes work — all with atomic commits.

## Intensity Tiers

Choose based on the scope of changes:

### Tier 1: Smoke Test (quick)
For small changes, single files, or quick checks.
1. Run existing test suite
2. Manually trace the changed code paths
3. Check the 3 most likely edge cases
4. Report findings

### Tier 2: Standard QA (default)
For features, refactors, or anything touching user-facing code.
1. Run existing test suite
2. Read all changed files, understand the intent
3. Test happy path end-to-end
4. Test each edge case category (input, state, error, concurrency)
5. Write tests for any untested code paths
6. Fix found bugs with atomic commits
7. Re-run full test suite to verify no regressions

### Tier 3: Deep QA (thorough)
For releases, security-sensitive changes, or critical features.
1. Everything in Tier 2
2. Fuzz inputs with boundary values
3. Test error recovery (kill process mid-operation, corrupt data)
4. Test concurrent access patterns
5. Review all error handling paths
6. Performance check (is anything unexpectedly slow?)
7. Security check (input validation, auth, data leaks)

## QA Process

### Step 1: Baseline
```bash
# Run existing tests to establish baseline
pnpm test  # or npm test, pytest, go test, etc.
```
Record: X tests passing, Y tests failing, Z tests skipped.

### Step 2: Discover
Read the code changes and identify risk areas:
- New code without tests
- Modified code where tests don't cover the change
- Error handling that's never exercised
- Assumptions about input format or state

### Step 3: Reproduce & Diagnose
For each potential bug:
1. Write the exact reproduction steps
2. Confirm the bug exists (test fails or unexpected behavior)
3. Trace the root cause (don't guess — read the code)

### Step 4: Fix
For each confirmed bug:
1. Write a failing test FIRST
2. Make the minimal code change to fix
3. Verify the test passes
4. Commit atomically: `fix: [what was broken and why]`

### Step 5: Verify
```bash
# Run full test suite including new tests
pnpm test
```
Confirm: All tests pass. No regressions introduced.

## Output Format

```
## QA Report

**Tier:** [1/2/3]
**Baseline:** X passing, Y failing, Z skipped
**Final:** X passing, Y failing, Z skipped

### Bugs Found & Fixed
1. **BUG-001**: [description]
   - Commit: `fix: [message]`
   - Test: `[test file]:[test name]`

### Bugs Found (Not Fixed)
1. **BUG-002**: [description]
   - Severity: [Critical/High/Medium/Low]
   - Reproduction: [steps]

### Tests Added
1. `[test file]:[test name]` — covers [what scenario]

### Risk Areas (Not Fully Covered)
1. [area] — [why it's risky]
```
