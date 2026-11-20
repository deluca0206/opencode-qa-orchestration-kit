---
description: Reproduces a symptom and correlates evidence through mandatory code reading.
agent: qa-lead
---
Investigation objective (trusted human arguments):

$ARGUMENTS

Confirm the environment, URL, scope and expected result before data mutations.
Delegate reproduction and sanitized evidence collection to qa-browser-explorer;
await its response and pass it to qa-bug-tracer for mandatory code reading and
route/component/handler/condition correlation with file:line.
Consolidate status, expected/observed behavior, steps, EVs, severity/confidence and
pending work. Without runtime or code access, state the blocker; a hypothesis
does not become a confirmed cause. Do not edit production or reports, or run
commands. Respond in the user's language.
