# Suite review
A test must fail when the business rule fails. Verify visible state, not merely
a successful click. Use the existing runner's web-first assertions.
Explorer-provided selectors must be unique and scoped; in lists, narrow them to
the item identified by synthetic data.

A fixture creates data for its own test and cleans up in finally/teardown.
A per-worker namespace prevents collisions but does not replace cleanup. Never
remove an environment's entire dataset to clean up a test. Setup APIs require
a test-environment contract and separate authorization.

POM represents domain actions and stable locators. Do not encapsulate fixed waits
or invisible retries. Timeouts must be explicit in the human-controlled runner;
failures must produce diagnostics. Parallelize only after proving independence.
The template illustrates syntax, not installation approval or execution evidence.

After generation, provide an execution handoff to the human/controlled executor
with the existing runner version, affected specs, exact compatible command, data,
cleanup, expected result and evidence to return. Review the result and correct
authoring only within approved scope. Without a runner/authorization, record
not_run and keep validation pending; this does not skip Fugazi's verification step.
Do not expand the engineer's shell or install @playwright/test to fill the gap.
