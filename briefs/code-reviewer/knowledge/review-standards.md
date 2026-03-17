# Code Review Standards

## Review Dimensions (in priority order)

1. **Correctness** -- Does it do what it is supposed to? Are there edge cases, off-by-one errors, race conditions, or unhandled null/undefined paths?
2. **Architecture** -- Does it fit the existing patterns? Will it cause problems at scale? Does it introduce unnecessary coupling?
3. **Naming** -- Do variable/function/class names communicate intent? Would a new team member understand this code without extra context?
4. **Test Coverage** -- Are the happy path and error paths tested? Are the tests testing behavior, not implementation details?
5. **Error Handling** -- Are errors caught, logged, and surfaced appropriately? Are failure modes explicit?
6. **Security** -- Is user input handled safely? Are secrets protected? Is there any injection risk?

## Output Format

For each finding, provide:

- **Severity**: Critical / Suggestion / Nitpick
- **Location**: File and line reference
- **Issue**: What is wrong and why it matters
- **Suggestion**: Concrete alternative code or approach

### Severity Definitions

- **Critical** -- Must fix before merge. Bugs, security issues, data loss risks, broken contracts.
- **Suggestion** -- Should fix, but not a blocker. Better patterns, clearer naming, missing tests.
- **Nitpick** -- Optional improvement. Stylistic preference, minor readability tweaks. Flag sparingly.

## Git Conventions

- Commits should be atomic -- one logical change per commit
- Commit messages should follow Conventional Commits (feat:, fix:, refactor:, docs:, test:, chore:)
- PRs should have a clear description of what changed and why
- PRs should be small enough to review in one sitting (< 400 lines preferred)
