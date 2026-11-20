# OpenCode QA Orchestration Kit

An original MIT-licensed kit of agents, skills and commands adapted from concrete
[Fugazi and OAK patterns](docs/provenance.md), not a new testing framework.
**Five agents, five skills, three native commands. Browsing uses an existing CLI;
no custom MCP, proxy, writer, sandbox or runner is included.**
Repository content is English; agents respond in the user's language.

## Roles and workflows
- qa-lead: scopes work, delegates to the four QA specialists and consolidates evidence.
- qa-browser-explorer: interactive playwright-cli navigation, snapshots/refs.
- qa-bug-tracer: mandatory code reading and causal file:line correlation, without fixes.
- qa-e2e-engineer: E2E/API test authoring within three roots by prompt rule.
- qa-quality-auditor: risk, EP/BVA, decisions/states, regression and a11y.

Investigation: explorer → tracer → lead. E2E: auditor → explorer → engineer →
auditor → human/controlled execution and verification. Authoring is not validation:
without an existing runner/authorization, execution is **not_run**, with a handoff
and pending validation. The kit does not install @playwright/test or give the
engineer shell access.

## CLI, Playwright Test and MCP are different
- **playwright-cli**: live browser, open/goto/snapshot/fill/click,
  console/requests/screenshot/close. This is the adopted Fugazi-style workflow.
- **Playwright Test** (`@playwright/test`): spec runner, fixtures/request,
  assertions and reports; it must already exist in the application to execute tests.
- **MCP**: optional integration in other upstream agents, neither required nor
  configured here. `playwright run-test-mcp-server`, used by upstream
  playwright-test agents, is not synonymous with `@playwright/mcp`.
  The kit workflow includes no npm/npx/autodownload.

## Active structure
```text
agents/                         five V2 prompts
skills/<id>/SKILL.md             MUST DO / WON'T DO
skills/<id>/references/          methods and criteria
skills/<id>/templates/           templates, POM, fixtures and external data
commands/                       qa-investigate / qa-e2e / qa-audit
scripts/                        checker, generation, installer and minimal smokes
tests/                          contracts and installer tests, Node built-ins
docs/                           provenance, contracts and historical synopsis
AGENTS.md / opencode.json / install.sh / LICENSE
```

## Permissions and actual limits
Human approval enables **edit:* for all five QA agents**, covering write/edit/patch
without allowroots. Lead/diagnostic roles must not write; the engineer must write
only in tests/**, e2e/**, playwright/**, never production. These are behavioral
instructions, **not technical confinement**. Known-secret and external_directory
denies remain; they cannot detect every sensitive file. The risk was accepted and
a separate writer cancelled.

Only explorer receives specific playwright-cli shell forms. All deny generic
shell, execute and unknown tools; lead delegates only to the four QA specialists,
who do not delegate. The CLI allowlist is not an argv parser or OS/network sandbox.
URLs, data and mutations need human authorization. Do not infer production
immutability from prompts or the rule engine.

Native commands use $ARGUMENTS without inline shell in templates, following OAK.
**OpenCode 2.3.2 interpolates shell from arguments before the model**: this was
observed and is not prevented by QA permissions. Use trusted human arguments;
send untrusted evidence through normal messages. There is no promise of protective
escaping, wrappers or custom quarantine.

## Prerequisites and tested versions
The kit uses Node built-ins and needs no npm dependencies. Existing trusted
OpenCode, playwright-cli, browser and CLI configuration are required for browsing
and runtime validation; nothing is downloaded automatically. Git is used for
checkout and contribution workflows. Playwright Test is an application-side
requirement only when executing authored specs, not for the kit's Node tests.

The initial validation environment used Node **22.23.1**, OpenCode **2.3.2**,
playwright-cli **0.1.22**, Chromium revision **1247** /
Chrome for Testing **155.0.8059.12**, and Git **2.56.0**. These are tested versions,
not a claim that other versions are compatible. The smokes check the recorded
CLI/OpenCode versions and use Linux `/proc` for process ownership/cleanup checks;
they are not portable runtime validation on systems without `/proc`.
Bubblewrap is not a current requirement. Retired-backend history does not prove
current CLI behavior.

## Get started and contribute
```sh
git clone https://github.com/deluca0206/opencode-qa-orchestration-kit.git
cd opencode-qa-orchestration-kit
node scripts/check.mjs
node --test tests/*.test.mjs
```
Read [AGENTS.md](AGENTS.md), [active contracts](docs/contracts.md) and
[provenance](docs/provenance.md) before changing behavior. Keep changes scoped,
preserve security boundaries and upstream attribution, and include validation
results in review. Do not add dependencies or change global installations
without explicit approval.

`opencode.json` is generated from agent/command frontmatter. After editing
descriptions or other approved frontmatter fields, run:
```sh
node scripts/build-config.mjs
node scripts/check.mjs
node --test tests/*.test.mjs
```
Review the generated diff; do not silently change permission order, routing or
configuration fields. Generation is deterministic and does not read user config.

## Safe copy or symlink installation
Start with a fresh temporary target, not a real global installation:
```sh
./install.sh --copy --target "/tmp/opencode/QA test" --dry-run
./install.sh --copy --target "/tmp/opencode/QA test"
./install.sh --symlink --target "/tmp/opencode/QA development"
```
Choose unused paths. The installer manages 15 explicit entries: five agents,
five skills, three commands, AGENTS.md and opencode.json. It does not replace
whole global directories. All entries are preflighted before writing. Existing
AGENTS/config JSON/JSONC, same-name entries, conflicting types and target/ancestor
symlinks (including broken links) cause an error, without merging or overwriting.
Reruns or mode changes with collisions fail; updates are manual and reviewed.
Partial failure rolls back only owned entries after identity checks, preserving
modified residual entries/nonempty directories. This is not a transaction against
hostile concurrency.

`./install.sh --copy` without --target uses `$HOME/.config/opencode`, not XDG;
use an explicit temporary target for evaluation. Config is materialized in both
modes without changing the source. Copy assets are snapshots: updates need a
reviewed replacement of only kit-owned entries. Symlink assets track their source:
keep that checkout available and use a separate worktree to evaluate edits
without propagating them to an installed kit. Config must still be reviewed and
updated separately. QA_INSTALL_TEST_FAIL_AFTER is only a test failpoint, not a hook.

To uninstall, review and remove only the 15 entries still identified as kit-owned,
preserving third-party changes. For symlinks, remove the link, not its source.
Do not delete entire global agents/skills/commands directories or configuration.
There is no automatic uninstaller or Git rollback guarantee.

## Usage
```text
/qa-investigate In the authorized fixture, Confirm does not update the status.
/qa-e2e Cover empty search and no results.
/qa-audit Review keyboard use, authorization and search regression.
```
Confirm the target, expected result, environment and permitted actions.
Reports stay in the conversation: status, expected/observed behavior, steps, EVs,
file:line, severity/confidence and pending work, in the user's language.

Canonical explorer CLI forms, with an exclusive eight-character alphanumeric ID:
```sh
NO_UPDATE_NOTIFIER=1 playwright-cli --version
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 open --idle-timeout=60000 -- http://127.0.0.1:8123
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 snapshot --
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 fill -- e3 "Synthetic QA"
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 click -- e4
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 close --
```
Goto, screenshot, console and requests use the same prefix and `--`.
Do not reuse the user's session or use close-all/kill-all, attach, eval/run-code,
storage, upload, scripts or npm/npx. Artifacts/profile/cache belong in an
authorized operational directory, preferably outside the application; CLI has
filesystem effects, not built-in isolation. If configuration/binary/browser is
missing or a required form is blocked, request a decision rather than expanding
shell. Denied operators/special characters may block text/URLs; do not bypass them.

After generating specs, hand the human/controlled executor the existing runner
version, exact compatible command, files, data/cleanup, expected result and evidence
to return. Incorporate the result in review; if unexecuted, declare not_run.
Do not copy upstream installation or debug/attach steps without need and approval.

## Kit verification
```sh
node scripts/check.mjs
node --test tests/*.test.mjs
QA_SMOKE_OPENCODE=/path/to/opencode node scripts/smoke-opencode.mjs
QA_SMOKE_CLI=/path/to/playwright-cli \
QA_SMOKE_BROWSER_DIR=/path/to/chrome-linux64 node scripts/smoke-browser.mjs
```
The checker is static; it does not emulate permissions. The OpenCode smoke uses
temporary HOME/config, copy/link and the real engine without a model. The CLI
smoke uses its own fixture and session, verifies actual PNG/DOM/logs and cleanup,
but does not prove OS isolation or spec execution. Neither smoke accesses user
sessions/configuration. Historical records are not current validation evidence.
See the [superseded decision synopsis](docs/adr-001.md) for archival and retrieval.

## Provenance and license
[MIT](LICENSE), copyright contributors 2026. Original prompts/text adapt patterns
without copying substantial Apache content. References, SHAs, alignment audit and
local exceptions: [docs/provenance.md](docs/provenance.md).
Fugazi: https://github.com/fugazi/test-automation-skills-agents (MIT).
OAK: https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit (Apache-2.0).
