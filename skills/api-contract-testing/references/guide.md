# Contract dimensions
For POST /items in a synthetic environment:
- Valid: documented status, nonempty id, preserved name and no secret fields.
- Invalid: missing, empty and wrong-type name; an error with a stable code/field,
  without stacktraces or infrastructure details.
- Boundaries: minimum-1/minimum and maximum/maximum+1, per the confirmed rule.
- Auth: missing identity and insufficient role, distinguishing 401/403 according
  to the contract. Do not assume every API uses the same codes.
- Idempotency/conflict: duplicate key and concurrency when part of the contract,
  without test-order dependencies.
- Cleanup: retain created IDs; delete only those IDs in finally, reporting cleanup
  failure without suppressing the original failure. No broad deletes or production access.

Reuse an existing validator or explicit assertions. Do not invent the contract:
mark uncertain fields and request confirmation before fixing test expectations.
