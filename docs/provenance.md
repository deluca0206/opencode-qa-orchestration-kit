# Provenance and alignment audit

## Pinned bases
- **F**: Fugazi, MIT, commit
  `ccae7871afd60e977eaccebce65d3bf4c633fabf`:
  https://github.com/fugazi/test-automation-skills-agents/tree/ccae7871afd60e977eaccebce65d3bf4c633fabf
- **O**: OAK, Apache-2.0, commit
  `ac4bc52d03a1eef1724b63ca2f97125c2f622e01`:
  https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit/tree/ac4bc52d03a1eef1724b63ca2f97125c2f622e01

The upstream trees/files were inspected during initial research, with additional
targeted reading of F/skills/playwright-cli/SKILL.md,
F/skills/playwright-e2e-testing/SKILL.md and O/opencode/commands/test.md to confirm
concrete anchors. No substantial Apache code/text was copied. The prompts are
original adaptations, now in English; references provide patterns, not authority.

## Complete active-structure map

| Local component | Concrete file at the pinned base | Adaptation / source of difference |
| --- | --- | --- |
| agents/qa-lead.md | F/agents/qa-orchestrator.agent.md | Delegation/context; five local roles, not the seven upstream roles |
| agents/qa-browser-explorer.md; skills/playwright-cli-nav/** | F/skills/playwright-cli/SKILL.md; references/playwright-tests.md; references/test-generation.md | Existing CLI 0.1.22, snapshot/ref and lifecycle; authorized operation subset, no mandatory MCP/debug/attach |
| agents/qa-bug-tracer.md; skills/bug-code-correlation/** | F/skills/qa-investigation/SKILL.md; references/flow.md; references/templates.md | Reproduction/evidence/hypothesis/cause/prevention. No application diaries/fixes; file:line is a local requirement, not a literal upstream claim |
| agents/qa-e2e-engineer.md; skills/playwright-e2e-suite/** | F/skills/playwright-e2e-testing/SKILL.md; F/instructions/playwright-typescript.instructions.md | POM/fixtures/external data/test.step/observed locators/assertions; three roots are a local prompt rule, broad edit:* by HITL |
| API guidance; skills/api-contract-testing/** | F/skills/api-testing/SKILL.md; templates/playwright-api-spec.ts | request fixture without a browser, contracts/errors/auth/isolation; no Zod/Supertest/Java installation or new runner |
| agents/qa-quality-auditor.md; skills/qa-test-design/** | F/skills/qa-manual-istqb/SKILL.md | EP/BVA, decisions/states/risk/traceability; partial a11y, no assumed full conformance |
| commands/qa-investigate.md, qa-audit.md, qa-e2e.md | O/opencode/commands/research.md, feature.md, test.md | Frontmatter/routing/$ARGUMENTS/short-step pattern; names and qa-lead routing are local requirements |
| opencode.json; frontmatters | O/docs/opencode-v2.md + official OpenCode documentation | Native V2 agents/permissions/shell/subagent. No nonexistent MCP tools; no ported OAK plugins |
| AGENTS.md | F/instructions/playwright-typescript.instructions.md; F/agents/qa-orchestrator.agent.md; local requirements | Original QA constitution, data trust and maintenance. edit:* for all five and prompt-only production prohibition are explicit human decisions |
| install.sh; scripts/install.mjs | O/install.sh; O/scripts/manage-installation.mjs as wrapper/JS pattern | **Copy/symlink is a local request**, not behavior attributed to OAK. Minimal local preflight/rollback; no full upstream manifest/lifecycle port |
| scripts/check.mjs; build-config.mjs; tests/*.test.mjs | Explicit local requirement for a dependency-free checker, contracts and preflight | Minimal Node built-in helpers, not executable structure attributed to the Fugazi catalog or an additional framework |
| scripts/smoke-browser.mjs | F/skills/playwright-cli/SKILL.md | Local validation using the installed CLI and owned fixture. Not an agent backend/runner or sandbox |
| scripts/smoke-opencode.mjs | O/docs/opencode-v2.md + local OpenCode 2.3.2 API | Required local verification: temporary HOME/config, copy/link, discovery/engine. No arbitrary tool or model invocation |
| LICENSE, README, docs, .gitignore | Local MIT licensing, preservation and evidence requirements | Original material; retired architecture is historical, not an active upstream component |
| Original drafts, baseline, bootstrap handoff, original ADR and AHE records | Original human inputs and local historical evidence | Externally archived with verified bytes and SHA256 before public-tree removal; see [ADR-001](adr-001.md). Not active contracts or required local dependencies |

To resolve each F/O reference above, concatenate the base
`https://github.com/fugazi/test-automation-skills-agents/blob/ccae7871afd60e977eaccebce65d3bf4c633fabf/`
or
`https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit/blob/ac4bc52d03a1eef1724b63ca2f97125c2f622e01/`
with the path after F/ or O/. The map preserves exact files, base URLs and SHAs.

## Alignment findings
Every active tree has a concrete upstream pattern or a declared local requirement/
adaptation above. No active custom MCP runtime, hook, proxy, writer or quarantine
remains. Archived AHE records are historical evidence, not product capability.

Upstream contradictions were not copied blindly: despite inline upstream snippets,
local E2E examples use POM/fixtures/external data; API examples use request and
external data without installing generically cited dependencies. CLI and runner
are separate. Generation must be followed by execution/verification through a
human/controlled handoff; without a runner/authorization, report not_run.

**Justified exceptions:** five roles/skills and three command names, file:line
correlation, copy/link, HITL edit:* permissions and explorer-only CLI shell are
local requirements. Validation/installation helpers address local acceptance,
not purported Fugazi/OAK components. The native-command pre-model risk remains
documented, without a wrapper or guarantees stronger than requested.

This alignment inspection does not replace independent final review or prove
that a model will obey behavioral rules.
