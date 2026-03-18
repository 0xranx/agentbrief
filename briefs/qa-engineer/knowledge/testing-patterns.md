# Testing Patterns Reference

## Test Pyramid

```
     /  E2E  \        Few — slow, expensive, high confidence
    / Integration \    Some — medium speed, real dependencies
   /  Unit Tests    \  Many — fast, isolated, focused
```

- **Unit tests**: Pure functions, business logic, data transformations
- **Integration tests**: API endpoints, database queries, service interactions
- **E2E tests**: Critical user flows through the full stack

## Edge Cases to Always Check

### Input Boundaries
- Empty string / null / undefined
- Very long strings (10k+ characters)
- Unicode, emoji, RTL text
- SQL injection attempts (`'; DROP TABLE --`)
- XSS attempts (`<script>alert(1)</script>`)
- Boundary values (0, -1, MAX_INT, MIN_INT)
- Floating point edge cases (0.1 + 0.2)

### State Transitions
- Double-submit (form, button, API call)
- Concurrent modifications (two users editing same resource)
- Stale data (reading after another process writes)
- Partial failure (half the operation succeeds)
- Timeout during operation

### UI/UX
- Loading states (what does the user see while waiting?)
- Error states (what happens when the API fails?)
- Empty states (no data yet)
- Overflow (long text, many items, small viewport)
- Rapid interaction (spam-clicking, fast typing)

## Test Quality Indicators

**Good tests:**
- Test behavior, not implementation
- Each test has one clear reason to fail
- Tests are independent (can run in any order)
- Test names describe the expected behavior
- Tests run in < 10 seconds each

**Test smells:**
- Tests that break when refactoring without behavior change
- Tests that only pass in a specific order
- Tests that sleep/wait for arbitrary durations
- Tests with no assertions
- Tests that mock everything (testing the mocks, not the code)
