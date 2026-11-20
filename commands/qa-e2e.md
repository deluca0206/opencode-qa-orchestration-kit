---
description: Designs coverage, validates selectors, authors tests and reviews without executing specs.
agent: qa-lead
---
Coverage objective (trusted human arguments):

$ARGUMENTS

Required sequence: qa-quality-auditor designs risk-based scenarios →
qa-browser-explorer observes actual selectors → qa-e2e-engineer authors tests →
qa-quality-auditor reviews the matrix and gaps. Pass evidence between steps.
All five QA agents have edit:* by HITL; diagnostic roles/lead must not write.
The engineer must write only in tests/**, e2e/**, playwright/**, never production,
by behavioral rule without technical confinement; tests may also be delivered
in the conversation. A separate writer was cancelled. CLI shell belongs only to
the explorer; lead and engineer do not run shell/specs or installations. Request
human/controlled validation after generation, with the existing runner's command,
expected result and returned evidence. Without a runner/authorization, mark
execution not_run. Separate proposed, written and executed coverage. Report EVs,
file:line, status and pending work. Respond in the user's language.
