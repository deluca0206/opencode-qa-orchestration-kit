# Proveniência e auditoria de aderência

## Bases fixadas, sem nova pesquisa ampla
- **F**: Fugazi, MIT, commit
  `ccae7871afd60e977eaccebce65d3bf4c633fabf`:
  https://github.com/fugazi/test-automation-skills-agents/tree/ccae7871afd60e977eaccebce65d3bf4c633fabf
- **O**: OAK, Apache-2.0, commit
  `ac4bc52d03a1eef1724b63ca2f97125c2f622e01`:
  https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit/tree/ac4bc52d03a1eef1724b63ca2f97125c2f622e01

Árvores/arquivos foram verificados no handoff do researcher; nesta simplificação
houve leitura pontual adicional de F/skills/playwright-cli/SKILL.md,
F/skills/playwright-e2e-testing/SKILL.md e O/opencode/commands/test.md para
confirmar os anchors concretos. Não se copiou código/texto Apache extenso. Prompts
pt-BR são originais e referências servem como padrões, não autorização.

## Mapa de toda a estrutura ativa

| Componente local | Arquivo concreto na base fixada | Adaptação / origem da diferença |
| --- | --- | --- |
| agents/qa-lead.md | F/agents/qa-orchestrator.agent.md | Delegação/contexto; cinco papéis locais, sem importar sete papéis upstream |
| agents/qa-browser-explorer.md; skills/playwright-cli-nav/** | F/skills/playwright-cli/SKILL.md; references/playwright-tests.md; references/test-generation.md | CLI existente 0.1.22, snapshot/ref e lifecycle; subconjunto de operações autorizado, sem MCP/debug/attach obrigatório |
| agents/qa-bug-tracer.md; skills/bug-code-correlation/** | F/skills/qa-investigation/SKILL.md; references/flow.md; references/templates.md | Reprodução/evidência/hipótese/causa/prevenção. Sem diários/correção em aplicação; file:line é requisito local, não alegação literal upstream |
| agents/qa-e2e-engineer.md; skills/playwright-e2e-suite/** | F/skills/playwright-e2e-testing/SKILL.md; F/instructions/playwright-typescript.instructions.md | POM/fixtures/dados externos/test.step/locators observados/assertions; três raízes são regra local de prompt, edit:* amplo por HITL |
| Orientação API; skills/api-contract-testing/** | F/skills/api-testing/SKILL.md; templates/playwright-api-spec.ts | request fixture sem browser, contratos/erros/auth/isolamento; não instalar Zod/Supertest/Java ou runner novo |
| agents/qa-quality-auditor.md; skills/qa-test-design/** | F/skills/qa-manual-istqb/SKILL.md | EP/BVA, decisões/estados/risco/rastreabilidade; a11y parcial, sem conformidade completa presumida |
| commands/qa-investigate.md, qa-audit.md, qa-e2e.md | O/opencode/commands/research.md, feature.md, test.md | Padrão frontmatter/encaminhamento/$ARGUMENTS/passos curtos; nomes e roteamento qa-lead são requisitos locais |
| opencode.json; frontmatters | O/docs/opencode-v2.md + documentação oficial OpenCode | Native V2 agents/permissions/shell/subagent. Sem ferramentas MCP inexistentes; não portar plugins OAK |
| AGENTS.md | F/instructions/playwright-typescript.instructions.md; F/agents/qa-orchestrator.agent.md; requisitos locais | Constituição QA própria, confiança dos dados e manutenção. Edit:* nos cinco e proibição de produção só por prompts são decisão humana explícita |
| install.sh; scripts/install.mjs | O/install.sh; O/scripts/manage-installation.mjs como padrão wrapper/JS | **Copy/symlink é pedido local**, não comportamento atribuído ao OAK. Preflight e rollback próprios mínimos; não portar manifesto/lifecycle completo upstream |
| scripts/check.mjs; build-config.mjs; tests/*.test.mjs | Requisito local explícito de checker dependency-free, contratos e preflight | Helpers mínimos Node builtin, não estrutura executável atribuída ao catálogo Fugazi ou framework adicional |
| scripts/smoke-browser.mjs | F/skills/playwright-cli/SKILL.md | Validação local por CLI já instalada e fixture própria. Não é backend/runner de agentes nem sandbox |
| scripts/smoke-opencode.mjs | O/docs/opencode-v2.md + API local OpenCode 2.3.2 | Verificação local requerida: HOME/config temporários, copy/link, descoberta/motor. Não invoca ferramentas arbitrárias nem modelo |
| LICENSE, README, docs, .gitignore, handoff/baseline/AHE | Requisitos locais de licença MIT, preservação e evidência | Originais; histórico do caminho descartado separado da arquitetura ativa; não copiados de upstream |
| Rascunhos dos Arquivos Principais/* | Quatro insumos humanos originais | Bytes/nomes preservados, sem converter rascunho em contrato vigente |

Para resolver cada referência F/O acima: concatenar a base
`https://github.com/fugazi/test-automation-skills-agents/blob/ccae7871afd60e977eaccebce65d3bf4c633fabf/`
ou
`https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit/blob/ac4bc52d03a1eef1724b63ca2f97125c2f622e01/`
com o path após F/ ou O/. O mapa preserva arquivo, URL base e SHA exatos.

## Resultado da inspeção de aderência
Toda árvore ativa tem padrão upstream concreto ou requisito/adaptação local
declarado acima. Não restou runtime MCP custom, hook, proxy, writer ou quarentena
ativa. O diretório de histórico AHE não é capacidade do produto.

Contradições upstream não foram copiadas cegamente: apesar de snippets inline,
os exemplos E2E locais usam POM/fixtures/dados externos; exemplos API usam
request e dados externos, sem instalar dependências citadas genericamente.
CLI e runner são separados. A geração deve ser seguida por execução/verificação
via handoff humano/controlado; sem runner/autorização, reportar not_run.

**Exceções justificadas:** cinco papéis/skills e três nomes de comandos,
correlação file:line, copy/link, permissões edit:* por HITL e restrição shell
CLI só do explorer são requisitos locais. Helpers de validação/instalação
respondem ao aceite local, não fingem ser componentes do Fugazi/OAK.
O risco pré-modelo dos comandos nativos permanece documentado, sem wrapper
ou garantia mais forte do que o usuário pediu.

Esta inspeção de aderência não substitui review final independente nem prova
que um modelo respeitará as regras comportamentais.
