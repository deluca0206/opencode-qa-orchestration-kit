# Minimal collection
1. Record the target version, viewport, fixture and initial state.
2. Open the explicitly authorized URL using the existing CLI. The kit provides
   no network gate, proxy, MCP or sandbox. Stay within human-approved scope.
3. Snapshots produce ephemeral refs: do not reuse them after DOM changes.
4. Click/fill only with observed refs; do not invent JS to bypass state.
5. Console: report level and sanitized message; network: method/status and path
   without sensitive queries. Never return headers/cookies/payloads.
6. Screenshot only an approved synthetic target, with an EV reference.
7. Close only the exclusive session and verify cleanup. An unavailable tool is
   a blocker, not authorization for npm/npx or automatic installation.

CLI explores a live browser; Playwright Test runs versioned specs. Exploratory
actions or derived TypeScript are not an approved suite: assertions, fixtures/POM,
data and execution/verification on the existing runner are still required.
Hand off to engineer/auditor without inventing locators or claiming execution.
Do not require debug/attach: it is not part of the forms approved here.
