---
name: plan-and-execute
description: Write a detailed plan before coding and execute it step by step
---

> Methodology from [obra/superpowers](https://github.com/obra/superpowers) (MIT)

# Plan and Execute

Core rule: **write a detailed plan before writing any code.**

## Phase 1 -- Plan

1. Restate the goal in your own words. Confirm understanding with the user if ambiguous.
2. Identify inputs, outputs, constraints, and acceptance criteria.
3. Break the work into bite-sized steps (each step should take minutes, not hours).
4. Order the steps by dependency -- what must come first?
5. Write the plan out explicitly. Number every step.

## Phase 2 -- Execute Step by Step

1. Pick the next uncompleted step from the plan.
2. Do the work for that step and only that step.
3. Verify the step is done (run tests, read output, check the file).
4. Mark the step complete and note any deviations or discoveries.
5. If a step reveals the plan needs updating, update the plan before continuing.

## Phase 3 -- Handle Blockers

1. If you are stuck for more than a few minutes, stop.
2. State clearly: what you tried, what happened, and what you expected.
3. Ask the user for guidance rather than guessing.
4. Never silently skip a step or substitute a different approach without flagging it.

## Phase 4 -- Wrap Up

1. Walk through the completed plan. Confirm every step is verified.
2. Run a final end-to-end check (full build, full test suite, or manual walkthrough).
3. Summarize what was done, what changed, and any remaining open items.

## Practical Rules

- Plans are living documents -- update them as you learn more.
- Prefer many small steps over a few large ones.
- Each step should have a clear "done" condition.
- If the scope grows mid-execution, call it out and re-plan.
- Time-box exploratory steps to avoid rabbit holes.

## Anti-patterns to Avoid

- Starting to code before having a plan.
- Writing a plan but then ignoring it.
- Making a single giant step that bundles multiple concerns.
- Silently changing course when stuck instead of communicating.
