---
name: regression-testing
description: "When the user wants to prevent regressions, improve test coverage, or says 'add tests,' 'improve coverage,' 'we keep breaking this,' 'write regression tests,' 'characterization tests,' or after fixing a production bug to ensure it never recurs."
---

# Regression Testing

You are writing tests specifically to prevent regressions — bugs that were fixed but could come back.

## Process

### 1. Identify Regression Risks

High-risk areas for regressions:
- Code that was recently fixed (the fix might be incomplete)
- Code that's frequently modified (high churn = high risk)
- Code with complex conditional logic (many branches = many ways to break)
- Code at integration boundaries (where two systems meet)
- Code without any existing tests

### 2. Write Characterization Tests

Before changing any code, capture current behavior:

```typescript
// Characterization test: documents current behavior
// If this test breaks during refactoring, you changed behavior (intentionally or not)
it('should return empty array when no items match filter', () => {
  const result = filterItems([], { status: 'active' });
  expect(result).toEqual([]);
});
```

### 3. Write Regression Tests for Fixed Bugs

Every bug fix needs a regression test:

```typescript
// Regression: https://github.com/org/repo/issues/123
// Bug: Processing failed when input contained unicode emoji
it('should handle unicode emoji in input', () => {
  const result = processInput('Hello 👋 World');
  expect(result.text).toBe('Hello 👋 World');
});
```

Rules for regression tests:
- Reference the original issue/bug in a comment
- Test the exact scenario that triggered the bug
- Test close variants (if emoji broke it, test other unicode too)
- Place near related tests, not in a separate "regression" file

### 4. Coverage-Guided Test Writing

Find untested code paths:

```bash
# Generate coverage report
pnpm test --coverage

# Look for:
# - Uncovered branches (if/else paths never hit)
# - Uncovered functions (dead code or missing tests?)
# - Low-coverage files (< 60% line coverage)
```

Prioritize coverage for:
1. Public API functions (users depend on these)
2. Error handling paths (failures should be predictable)
3. Edge cases in business logic
4. Data validation and transformation

### 5. Mutation Testing (Advanced)

If coverage is high but bugs still slip through, tests might be weak:
- Change a `>` to `>=` — does any test fail?
- Remove a null check — does any test fail?
- Change a constant — does any test fail?

If no test fails, the tests are checking the wrong things.

## Test Organization

```
src/
  module.ts
  __tests__/
    module.test.ts         # Unit tests
    module.integration.ts  # Integration tests
```

- Group tests by behavior, not by method
- Use `describe` blocks for related scenarios
- Test names should be sentences: "should reject invalid email format"
- One assertion per concept (but multiple `expect` calls for one logical assertion are fine)
