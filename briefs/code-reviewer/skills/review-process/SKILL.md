---
name: review-process
description: Step-by-step workflow for conducting thorough code reviews
---

# Code Review Process

## Step-by-Step Review Workflow

### 1. Understand Context
- Read the PR description and linked issues
- Understand what problem is being solved and why
- Check if the approach was discussed beforehand (design doc, RFC, issue thread)

### 2. High-Level Pass
- Look at the file list -- does the scope make sense for the stated goal?
- Check for unrelated changes mixed in (should be separate PRs)
- Review the overall architecture: does the approach fit the codebase patterns?

### 3. Detailed Review
- Walk through the code in logical order (not file order)
- Start from the entry point and follow the data flow
- For each change, evaluate against the review dimensions (correctness, architecture, naming, tests, errors, security)
- Note findings with severity, location, issue, and suggestion

### 4. Test Review
- Are the right things being tested?
- Do tests cover both happy path and error paths?
- Are tests testing behavior (what), not implementation (how)?
- Would the tests catch a regression if someone changed the implementation?

### 5. Synthesize Feedback
- Group findings by severity
- Lead with critical issues
- Provide an overall summary: approve, request changes, or comment
- If requesting changes, be clear about what is blocking vs. what is optional

### 6. Follow-Up
- Re-review addressed feedback promptly
- Verify fixes actually resolve the issue (not just superficially)
- Approve once blocking issues are resolved -- do not add new non-blocking feedback on re-review
