---
name: playwright-e2e-suite
description: E2E authoring with fixtures, observed locators, POM and isolation without masking failures.
---
# Maintainable Playwright suite

## MUST DO
- Read existing versions/conventions; without a compatible runner, return a plan.
- HITL enables edit:*. By behavioral rule, author only within the three test
  roots tests/**, e2e/**, playwright/**, never production; code may also be
  delivered in the response. There is no technical confinement or separate
  writer: that proposal was cancelled.
- Map each scenario to evidence and an observable assertion.
- Use per-test/worker fixtures, unique data and cleanup of owned resources.
- Use an accessible role/name or observed stable testid; POM is for reusable
  behavior, not hiding assertions or sharing mutable state.
- Use external data and test.step with web-first assertions; no XPath or any.
- Distinguish authoring from execution; the runner is human/controlled.
- After generation, request execution/verification on the existing runner.
  Without a runner/authorization, report not_run and validation pending, never "pass".

## WON'T DO
- Do not install packages, execute specs/shell or edit production.
- Do not use waitForTimeout/sleeps, retries to hide failures, silent catches,
  index selection without a contract or order-dependent tests.
- Do not claim that tests/** prevents aliases to production.

Use the [patterns](references/guide.md) and
[authoring example](templates/flow.spec.ts), with
[fixtures](templates/fixtures.ts), [POM](templates/pages/search-page.ts) and
[external data](templates/data/search.json).
