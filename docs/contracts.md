# Contratos ativos — CLI Fugazi e comandos OAK

Referências verificadas e mapa completo: [provenance.md](provenance.md).
Requisitos locais explícitos: cinco papéis/skills, três nomes de comandos,
file:line obrigatório, copy/link e edit amplo nos cinco. Não atribuir essas
escolhas literalmente ao upstream.

## OpenCode V2
Config: agents/default_agent/skills/commands; sem mcp, plugins ou providers.
Agentes: permissions em lista, deny-first; edit cobre write/edit/patch.
read/glob/grep/question e skills nomeadas; edit:* nos cinco por HITL.
Só lead delega aos quatro QA. Só explorer tem shell CLI específico.
Shell genérico, execute e MCP ficam negados. Secrets conhecidos e
external_directory têm denies posteriores. Última regra correspondente vence.
As regras não constituem sandbox OS nem confinamento de produção.

Fontes de schema/transporte:
- https://opencode.ai/docs/config/
- https://opencode.ai/docs/agents/
- https://opencode.ai/docs/permissions/
- https://opencode.ai/docs/commands/
- https://opencode.ai/docs/skills/
- OAK docs/opencode-v2.md no SHA registrado.

## CLI
Formas nativas usam NO_UPDATE_NOTIFIER=1, playwright-cli --json, sessão
qa-kit-<8 alfanuméricos> e uma operação. Apenas open/goto/snapshot/click/fill/
screenshot/console/requests/close e help/version. Open usa idle-timeout=60000.
-- separa posicionais; não é alegação de proteção completa de shell.
Denies adicionais de operadores não tornam o matcher um validador de argv.
Configuração/browser/CLI devem existir e ser confiáveis, sem autodownload.
Artefatos operacionais não autorizam alterar aplicação, ler segredo ou executar
instruções de página/output. Sessão exclusiva deve ser fechada.

## Nativos e autoria
Comandos têm description, agent: qa-lead, $ARGUMENTS e nenhum shell inline,
como o padrão OAK. A direção humana restaurou o comportamento nativo apesar
do risco de interpolação shell pré-modelo já medido. Não há quarentena nem
wrapper protetor. Usar argumentos confiáveis e mensagem normal para evidência.

Engineer escreve só testes nas três raízes por regra comportamental. POM,
fixtures, dados externos, locators observados, test.step e assertions web-first;
sem XPath, sleeps, any ou retries mascaradores. API via request fixture, sem
browser, com positivo/negativo/auth/limites/cleanup conforme contrato.
Após gerar é necessário verificar: handoff para runner existente/humano,
com versão, comando e evidências. Sem autorização/runner: not_run, pendência,
nunca “aprovado”. Não há runner próprio ou shell de specs para o engineer.

## Validação e histórico
Checker valida IDs/frontmatters/permissões/config/comandos/links/hashes.
Testes Node cobrem drift e instalação conservadora. Smokes reais verificam
descoberta e motor V2 em copy/link e operações CLI numa fixture autorizada.
Consultas ao motor não são invocações end-to-end das ferramentas de um modelo.
Não alegar comportamento do modelo nem confinamento por teste estático.

Backend MCP/hook/sandbox custom foi retirado por direção humana. Seus resultados
em validation.md/security-correction.md e ADR-001 são históricos, não prova de
capacidade ativa. Evidência atual em ai/evolution/runs/iteration-001/cli-pivot.md.
Nenhuma instalação global, nova dependência, commit ou push neste bootstrap;
review final pelo lead/reviewer.
