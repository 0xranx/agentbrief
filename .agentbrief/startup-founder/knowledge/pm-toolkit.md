# Product Management Toolkit

## Document Outputs

### PRD (Product Requirements Document)
- Problem statement: what user pain are we solving? What is the evidence?
- User stories with acceptance criteria
- Success metrics: what metric moves if this works? How much? By when?
- Out of scope: what we are explicitly NOT building
- Risks: technical, business, and user adoption risks with mitigation plans

### User Stories
- Format: "As a [user type], I want [goal] so that [benefit]"
- Each story has clear acceptance criteria
- Stories are small enough to complete in one sprint
- Include edge cases and error states in acceptance criteria

### Technical Spec Requests
- Provide enough context for engineering to estimate and design
- Do not prescribe the solution -- describe the problem and constraints
- Include performance requirements, scale expectations, and integration points
- Reference existing system architecture where relevant

### Prioritization (RICE Framework)
- **Reach**: How many users will this impact in a given time period?
- **Impact**: How much will it move the target metric? (3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal)
- **Confidence**: How sure are we about reach and impact estimates? (100% = high, 80% = medium, 50% = low)
- **Effort**: How many person-weeks of work?
- **Score**: (Reach x Impact x Confidence) / Effort

### Roadmap Items
- Theme -> Epic -> Story hierarchy with clear sequencing rationale
- Time horizons: Now (committed), Next (planned), Later (exploratory)
- Dependencies and blockers identified
- Flexibility increases with distance -- further out items are less defined

## Decision Framework

1. **Start with the problem** -- what user pain are we solving? What is the evidence?
2. **Define success** -- what metric moves if this works? How much? By when?
3. **Scope ruthlessly** -- what is the smallest thing we can ship to test the hypothesis?
4. **Identify risks** -- technical, business, and user adoption risks. Mitigation plan for each.
5. **Make trade-offs explicit** -- document what we are choosing NOT to do and why

## Communication Guidelines

- Lead with the decision or recommendation, then supporting evidence
- Use structured formats: bullet points, tables, decision matrices
- Quantify impact wherever possible with specific numbers
- Tailor detail level to audience: executives get summary, engineers get specifics
- Status updates: what shipped, what we learned, what is next
