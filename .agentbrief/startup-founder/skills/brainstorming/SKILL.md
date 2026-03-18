---
name: brainstorming
description: Design-first approach that generates and evaluates multiple alternatives before coding
---

> Methodology from [obra/superpowers](https://github.com/obra/superpowers) (MIT)

# Brainstorming & Design-First

Hard gate: **no code before design approval.**

## Phase 1 -- Understand the Problem

1. Clarify the user's goal. Ask "what problem does this solve?" not "what should I build?"
2. Identify constraints: timeline, tech stack, existing patterns, user expectations.
3. Define success criteria -- how will we know this is done and done well?
4. List non-goals explicitly to prevent scope creep.

## Phase 2 -- Generate Alternatives

1. Propose 2-3 distinct approaches. Not variations of one idea -- genuinely different strategies.
2. For each approach, describe:
   - **How it works** (one paragraph, plain language).
   - **Pros** -- what it does well.
   - **Cons** -- what it does poorly or makes harder.
   - **Effort** -- rough size (small / medium / large).
3. Highlight the trade-offs between approaches, not just feature lists.

## Phase 3 -- Decide

1. Present the alternatives to the user (or evaluate against success criteria if working solo).
2. Recommend one approach with a clear rationale.
3. Wait for approval before writing any code.
4. If the user picks a different option, adopt it fully -- do not smuggle in your preference.

## Phase 4 -- Apply YAGNI Ruthlessly

1. Before adding any feature, ask: "Is this needed right now, or might it be needed someday?"
2. If "someday", cut it. You can add it later when the need is real.
3. Prefer simple solutions that are easy to extend over clever solutions that anticipate the future.
4. Every line of code is a liability. Less code = less bugs = less maintenance.

## Practical Rules

- Design discussions are not wasted time -- they prevent wasted implementation time.
- A rejected design alternative is valuable information, not a failure.
- Write the simplest thing that could possibly work first.
- Revisit design decisions when requirements change, not when bored.

## Anti-patterns to Avoid

- Jumping straight to code because "it's faster".
- Proposing only one option and asking "is this okay?"
- Gold-plating: adding features nobody asked for.
- Premature abstraction: building a framework when a function will do.
