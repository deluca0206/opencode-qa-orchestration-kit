# Pivot vigente — CLI Fugazi e comandos OAK

Status: implementação bounded validada, **aguardando review final do lead/reviewer**.
Não é encerramento/aprovação geral do kit. A direção humana substituiu o backend
custom e a quarentena por padrões concretos dos repositórios indicados.
Atualização de review R1: ver seção final; a suíte passou a 12 testes.

## O que mudou
- Removidos somente os cinco arquivos de runtime custom e acoplamentos:
  browser-server.mjs, browser-worker.mjs, browser-contract.mjs, sandbox.mjs,
  navigation-guard.cjs; scripts/mcp-client.mjs e os três testes exclusivos
  browser-protocol/browser/navigation-guard. Diretório runtime vazio removido.
- opencode.json não tem mcp, plugins, executável custom ou servidor desabilitado.
  Instalador inclui só 15 assets normais (5 agentes/5 skills/3 comandos/AGENTS/config).
- Restaurados os três comandos com frontmatter agent: qa-lead e $ARGUMENTS,
  sem shell inline. Não há quarentena/wrapper. Aviso de argumentos confiáveis
  permanece devido ao risco pré-modelo do framework já comprovado.
- Explorer usa playwright-cli existente com snapshots/refs e sessão exclusiva;
  recebe só formas shell CLI necessárias. Outros quatro seguem sem shell.
  Nenhum npm/npx/autodownload, eval/run-code, novo MCP ou runner.
- Edit:* nos cinco QA permanece por HITL, sem allowroots. Regra de não escrever
  produção é comportamental; source/aliases allow é esperado, não bug pendente.
- Skills/templates alinhados a POM/fixtures/dados externos/test.step/locators
  observados, EP/BVA e API request fixture. A geração é seguida de handoff de
  execução/verificação, não de uma alegação automática de sucesso.

## Proveniência e auditoria de toda estrutura ativa

[docs/provenance.md](../../../../provenance.md) mapeia todos os diretórios/
arquivos ativos por componente → path concreto → URL/SHA F/O → adaptação.
Fugazi: ccae7871afd60e977eaccebce65d3bf4c633fabf.
OAK: ac4bc52d03a1eef1724b63ca2f97125c2f622e01.

Inspeção de aderência: agentes, skills/references/templates, comandos,
config, instalador, checker/build, testes/smokes, constituição/docs/licença e
rascunhos foram contabilizados. Não restou backend/guard/proxy/writer ou
quarentena ativos. Resultado: aderente à direção e exceções declaradas, sem
atribuir escolhas locais falsamente ao upstream; não é review independente.

Exceções locais explícitas: cinco papéis/skills e três nomes de comandos,
file:line obrigatório, copy/symlink e edit amplo nos cinco. Native V2 e formas
CLI mínimas/denies são adaptação de integração, não shell genérico do Fugazi.
Helpers Node builtin só atendem validação/preflight solicitados, sem portar
lifecycle/plugins/framework OAK. Regra de manutenção futura registrada em AGENTS.

## TDD e comandos executados

- Red: `node --test tests/cli-permissions.test.mjs tests/security-defaults.test.mjs`
  produziu 2 failures / 1 pass antes de CLI/commands/config adaptados
  (export ausente e comandos ainda sem argumentos).
- Green final: `node --test tests/*.test.mjs`: **11 passed, 0 failed, 0 skipped**.
  Testes antigos de backend foram removidos por acoplamento ao escopo descartado,
  não contabilizados como cobertura CLI. Permissões/gen/contratos e instalador
  útil foram mantidos/adaptados.
- `node scripts/check.mjs`: exit 0.
- `sh -n install.sh` e `node --check scripts/*.mjs/tests/*.mjs`: exit 0.
- JSON parse de config, baseline, manifest e evaluation: OK.
- `QA_SMOKE_OPENCODE=<executável existente> node scripts/smoke-opencode.mjs`:
  exit 0. Copy **e** symlink: OpenCode 2.3.2 descobriu **5 agentes, 5 skills,
  3 comandos, 0 MCP**. **169 decisões nativas esperadas por modo**, 338 totais.
  Edit em source allow nos cinco; CLI canônico allow só explorer; echo/node/
  python/npx/eval/run-code/compound e MCP/execute negados; delegação e segredos
  preservados. Nenhum comando arbitrário foi executado para provar deny.
- `QA_SMOKE_CLI=<CLI existente> QA_SMOKE_BROWSER_DIR=<browser existente>
  node scripts/smoke-browser.mjs`: exit 0. CLI **0.1.22**; open/goto/snapshot/
  fill/click/snapshot/console/requests/screenshot/close reais.
  PNG real verificado; status de DOM esperado; logs/requisição /ping;
  sessão exclusiva qa-kit-8hex e processos próprios encerrados; sentinela
  sintética inalterada. Fixture e workspace privados do teste removidos.
- `sha256sum "Rascunhos dos Arquivos Principais/"*`: os quatro hashes idênticos
  a docs/ai/baseline-drafts.json. Não reescritos.
- `git status --short --branch`, origin literal e inventário untracked conferidos.

## Evidência original sanitizada
Em /tmp/opencode (fora do repo):
- qa-cli-pivot-red.txt — red inicial;
- qa-cli-check-final.txt e qa-cli-tests-final.txt — checker e 11 testes;
- qa-cli-discovery.json — duas instalações/338 consultas nativas;
- qa-cli-live.txt — smoke CLI direto;
- qa-cli-inventory.txt — diff base por inventário.

Trechos originais:
```text
Contratos estáticos OK; runtime enforcement NÃO verificado.
# tests 11
# pass 11
# fail 0
# skipped 0
```
```json
{
  "classification": "live_smoke",
  "verdict": "works_as_specified",
  "cliVersion": "0.1.22",
  "session": "<exclusive-qa-kit-8hex>",
  "operations": ["open", "goto", "snapshot", "fill", "click", "snapshot", "console", "requests", "screenshot", "close"],
  "screenshot": "PNG real verificado",
  "syntheticSentinelUnchanged": true,
  "cleanup": "sessão própria fechada; fixture/workspace removidos",
  "limits": "CLI direto sem isolamento OS; não prova confinamento, segurança de rede ou execução de specs."
}
```

## Runtime verification e gaps reais
- **command — CLI browser:** works_as_specified nas operações reais medidas.
  Prova nova por CLI direto, sem herdar passes de bwrap/MCP/hook.
  Não prova isolamento OS, proteção de rede ou navegação arbitrária segura.
- **command — instalação:** works_as_specified em copy/link temporários,
  com espaços, preflight/conflitos/rollback e preservação de terceiros nos testes.
  Instalação global real não executada.
- **endpoint — catálogo/motor OpenCode:** works_as_specified para descoberta
  e 169 consultas por modo. Isso não substitui invocação real de tool por modelo.
- **Specs do aplicativo/modelo:** could_not_be_verified / not_run. Não há
  aplicativo/runner @playwright/test autorizado neste kit. Não foi instalado nem
  criado runner. Handoff obrigatório após gerar: versão e comando do runner já
  existente, arquivos, dados/cleanup, esperado e evidências a devolver. Engineer
  continua sem shell. Se futuramente necessária, allowlist do runner exige
  versão/formas exatas verificadas no aplicativo e decisão explícita antes de ampliar.
- **Comandos nativos:** restaurados conforme direção. Risco histórico de
  interpolação de argumentos antes do modelo não foi corrigido nem reclassificado
  como seguro. Uso só com argumentos humanos confiáveis; dados de páginas/logs
  por mensagem normal. Não se executou novamente payload arbitrário no pivot.

## Preservação e entrega
Histórico anterior mantido, identificado como histórico; nenhuma evidência
original convertida retroativamente em pass. QA-05 é risco externo documentado
no uso nativo autorizado; QA-06 custom foi retirado por user-directed pivot.
Sem nova dependência, download/browser, config global, instalação real,
commit ou push. Todos os servidores/CLI iniciados pelos smokes encerrados.

Git: feat/qa-orchestration-kit **unborn**, sem commits; origin literal
https://github.com/deluca0206/opencode-qa-orchestration-kit. Diff base:
repositório vazio, inventário untracked + quatro rascunhos originais.
Ownership permanece no developer para correções após reavaliação/review.

## Review final R1 — pai temporário ausente

Correção exclusiva do blocker R1: tests/install.test.mjs,
scripts/smoke-browser.mjs e scripts/smoke-opencode.mjs agora usam
resolve(os.tmpdir(), 'opencode'), mkdirSync(recursive:true) e mkdtemp dentro
desse pai. Não dependem de /tmp/opencode previamente criado pelo harness.
Não houve mudança de arquitetura, permissões, dependências ou fluxo QA.

Regressão nova: tests/temporary-workspace.test.mjs cobre os três consumidores
com TMPDIR exclusivo e inicialmente ausente. Para reproduzir o código legado
sem tocar o diretório compartilhado, somente cópias de fixture redirecionam
o literal antigo ao pai ausente. Red reproduziu ENOENT real em mkdtemp.
Após a correção, o código usa TMPDIR sem substituição. O teste do instalador
executa seus quatro casos; os smokes determinísticos chegam à validação de
versão de um executável de fixture, sem depender de browser/OpenCode instalados
na regressão. A falha esperada de versão não é skip nem é contada como smoke real.

Verificação green:
- node scripts/check.mjs: exit 0.
- node --test tests/*.test.mjs: **12 passed, 0 failed, 0 skipped**.
- sh -n install.sh e node --check para scripts/*.mjs/tests/*.mjs: exit 0.
- Smoke CLI real 0.1.22 com TMPDIR=<fixture exclusiva>/browser-parent
  inicialmente inexistente: exit 0; open/goto/snapshot/fill/click/console/
  requests/screenshot/close, PNG/DOM e cleanup verificados.
- Smoke OpenCode 2.3.2 com TMPDIR=<fixture exclusiva>/opencode-parent
  inicialmente inexistente: exit 0; copy e symlink, descoberta 5/5/3/zero MCP
  e **169 consultas nativas por modo**. Não são invocações modeladas de tools.
- Ambos os pais foram criados automaticamente; só a fixture exclusiva foi
  removida ao final. /tmp/opencode real não foi apagado, renomeado ou alterado
  para simular ausência.
- Quatro SHA-256 originais permaneceram idênticos ao baseline.

Runtime verification R1: installer copy/link, discovery/motor OpenCode e CLI
browser **works_as_specified** nos pais novos medidos. Model-flow dos comandos
e execução de templates/specs continuam **could_not_be_verified/not_run**,
inalterados pelo delta. Servidores/CLI/processos próprios encerrados.
Sem instalação global, downloads/deps, commit ou push; review delta pendente.

Evidência bruta fora do repo, em /tmp/opencode:
qa-r1-red.txt, qa-r1-check.txt, qa-r1-green.txt, qa-r1-cli-live.txt,
qa-r1-discovery.json. Resultados anteriores acima permanecem históricos.
