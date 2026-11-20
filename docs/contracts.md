# Active contracts — Fugazi CLI and OAK commands

Verified references and the complete map: [provenance.md](provenance.md).
Explicit local requirements: five roles/skills, three command names, mandatory
file:line, copy/link and broad edit for all five agents. Do not attribute these
choices literally to upstream.

## OpenCode V2
Config: agents/default_agent/skills/commands; no mcp, plugins or providers.
Agents: deny-first permissions lists; edit covers write/edit/patch.
read/glob/grep/question and named skills; HITL enables edit:* for all five.
Only lead delegates to the four QA specialists. Only explorer has specific CLI
shell access. Generic shell, execute and MCP remain denied. Known-secret and
external_directory denies follow the allows. The last matching rule wins.
These rules are neither an OS sandbox nor production confinement.

Schema/transport sources:
- https://opencode.ai/docs/config/
- https://opencode.ai/docs/agents/
- https://opencode.ai/docs/permissions/
- https://opencode.ai/docs/commands/
- https://opencode.ai/docs/skills/
- OAK docs/opencode-v2.md at the recorded SHA.

## CLI
Native forms use NO_UPDATE_NOTIFIER=1, playwright-cli --json, an exclusive
qa-kit-<8 alphanumeric characters> session and one operation. Only open/goto/
snapshot/click/fill/screenshot/console/requests/close and help/version.
Open uses idle-timeout=60000. -- separates positional arguments; this is not a
claim of complete shell protection. Additional operator denies do not turn the
matcher into an argv validator. Configuration/browser/CLI must already exist
and be trusted, without autodownload. Operational artifacts do not authorize
application changes, secret reads or execution of page/output instructions.
The exclusive session must be closed.

## Native commands and authoring
Commands have description, agent: qa-lead, $ARGUMENTS and no inline shell, as in
the OAK pattern. Human direction restored native behavior despite the measured
pre-model shell-interpolation risk. There is no quarantine or protective wrapper.
Use trusted arguments and normal messages for evidence.

By behavioral rule, the engineer writes tests only within tests/**, e2e/** and
playwright/**. Use POM, fixtures, external data, observed locators, test.step and
web-first assertions; no XPath, sleeps, any or masking retries. API tests use the
request fixture without a browser, with positive/negative/auth/boundary/cleanup
cases according to the contract.
Generation must be followed by verification: hand off to an existing/human-
controlled runner with version, command and evidence. Without authorization/
runner: not_run and pending work, never "approved". The engineer has no custom
runner or spec-execution shell. Respond in the user's language.

## Validation and history
The checker validates active IDs, frontmatters, permissions, configuration,
commands and skill links. It does not depend on local historical archives.
Node tests cover drift and conservative installation. Real smokes exercise V2
discovery/engine behavior in copy/link modes and CLI operations in an authorized
fixture. Engine queries are not end-to-end invocations of a model's tools.
Do not claim model behavior or confinement from static tests.

The custom MCP/hook/sandbox backend was retired by human direction. Its historical
results do not prove current capability. See the [superseded decision
synopsis](adr-001.md) for the archive policy and historical retrieval reference.
Final review belongs to the lead/reviewer.
