---
name: tdd
description: Red-green-refactor cycle for test-driven development
---

> Methodology from [obra/superpowers](https://github.com/obra/superpowers) (MIT)

# Test-Driven Development (TDD)

Iron law: **no production code without a preceding failing test.**

## The RED-GREEN-REFACTOR Cycle

### RED -- Write a Failing Test

1. Identify the next smallest behavior to implement.
2. Write a test that asserts that behavior.
3. Run the test suite. Confirm the new test **fails** for the right reason.
4. If it passes already, your test is not testing new behavior -- rewrite it.

### GREEN -- Make It Pass

1. Write the **minimum** production code to make the failing test pass.
2. Do not add extra logic, handle future cases, or optimize.
3. Run the test suite. All tests must be green.
4. If other tests broke, fix them before moving on.

### REFACTOR -- Clean Up

1. Look at the code you just wrote. Remove duplication, improve naming, simplify.
2. Run the test suite after every refactor step. Stay green.
3. Do not add new behavior during refactor -- that requires a new RED step.

## Practical Rules

- One assertion per test when possible. Focused tests give clearer failure messages.
- Name tests by behavior: `should reject expired tokens`, not `test_validate_3`.
- Keep the cycle short: aim for minutes per iteration, not hours.
- If you are stuck making a test pass, the step is too big. Write a simpler test first.
- Commit after each GREEN or REFACTOR step. Small commits are cheap insurance.

## When to Apply TDD

- New features: always.
- Bug fixes: write a test that reproduces the bug first, then fix.
- Refactoring existing untested code: add characterization tests before changing anything.

## Anti-patterns to Avoid

- Writing production code first and tests after (test-last is not TDD).
- Writing multiple tests before making any of them pass.
- Skipping the REFACTOR step -- tech debt accrues silently.
- Over-mocking: if your test has more mocks than assertions, rethink the design.
