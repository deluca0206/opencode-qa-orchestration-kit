---
name: api-contract-testing
description: Designs positive, negative, auth, error and safe-cleanup API contract tests.
---
# API contracts in a test environment

## MUST DO
- Read the contract/versioning; confirm the test host and permitted effects.
- Verify status, schema/types, required fields, semantics and errors.
- Cover valid, invalid, boundary, unauthenticated and unauthorized-role cases.
- Isolate resources per test and clean up only their own IDs in teardown.
- Use synthetic identities provided by the executor; never embed credentials.
- Separate proposals, authoring and human/controlled execution.

## WON'T DO
- Do not destructively test production, read secrets or run requests/shell through
  this skill. The engineer only authors tests; it does not run the suite.
- Do not accept arbitrary 2xx/4xx responses or copy sensitive payloads into evidence.
- Do not install a schema library without an already approved dependency.

Use the [contract matrix](references/guide.md) and
[scenario template](templates/contract.md), with the
[request fixture example](templates/contract.spec.ts).
