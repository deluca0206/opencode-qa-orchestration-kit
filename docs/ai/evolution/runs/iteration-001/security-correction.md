# Checkpoint corretivo — kit não finalizado

> HISTÓRICO SUPERADO: a direção posterior restaurou comandos OAK com $ARGUMENTS
> e adotou CLI Fugazi, removendo o backend próprio e sua quarentena. O restante
> deste documento preserva evidência anterior, não define capacidade ativa.
> Estado vigente: cli-pivot.md e docs/provenance.md.

Estado atual: pausado por decisão humana para pesquisa de substituição do MCP
próprio pelo Microsoft Playwright MCP oficial. A versão exata ainda não foi
aprovada: nenhum pacote/browser foi instalado e nenhum npx autodownload foi
habilitado. Runtime/hook atuais e evidência foram preservados, sem remoções.

## Mudança de requisito de escrita — QA-01

HITL literal: “deixe write/edit liberados e coloque instruções e regras do
agentes apenas.” Após esclarecimento da ausência de garantia técnica de produção,
o usuário confirmou “Todos os cinco agentes”.

Atualizados os cinco frontmatters, opencode.json, checker, testes, prompts e docs:
edit:* habilitado (V2 cobre write/edit/patch), sem allowroots. Lead/diagnóstico
devem não escrever; engineer deve escrever só em tests/**, e2e/**, playwright/**,
nunca produção. São instruções comportamentais, não enforcement. Denies de
segredos conhecidos, external_directory, shell/execute, ferramentas desconhecidas
e delegação restrita permanecem. Writer separado foi cancelado.

Não foi feita escrita real em produção. Allow do motor em source/aliases agora
é esperado e o risco foi aceito conscientemente, sem transformar o resultado
histórico em pass retroativo. Invocação real de ferramentas e comportamento
do modelo continuam não verificados.

## Slash commands — QA-05

Hipótese testada no runtime 2.3.2: remover todos os placeholders e pedir escopo
na próxima mensagem. **Falhou nos três candidatos**: o runtime autoanexa raw
args e depois interpola shell. Cada probe benigno escreveu a sentinela sintética
antes do modelo, mesmo sem placeholder.

Correção default: config.commands vazio, instalador não copia os três templates
e recusa colisões com os IDs antigos. Templates permanecem em commands/ como
candidatos em quarentena. Nas três rotas bloqueadas, a API retornou comando não
encontrado e **nenhuma sentinela foi escrita**. Não houve escaping em prompt ou
hook global. Isso bloqueia a rota insegura, mas **não entrega a capacidade slash
segura**: depende de decisão/handoff, não está concluída.

## Browser — QA-06, evidência preservada e trabalho pausado

O smoke original teve um hit cross-origin por redirect; click/popup zero não
provavam isolamento universal. Antes da nova pausa, foi implementado hook fixo
RO via recurso existente initPage da CLI, context.route e
route.fetch({maxRedirects:0, maxRetries:0}), validando origem antes do fetch e
abortando todo HTTP 3xx antes de repassá-lo ao browser. Sem SDK/deps/eval/run-code.

Smoke real corrigido: click=0, popup=0, redirect=0 no servidor não aprovado.
Incluiu redirect de subrecurso e formulário/DOM, console, requests, imagem,
timeout, namespace daemon/Chromium e cleanup. Não é firewall universal;
redirects same-origin também são recusados. Essa evidência descreve o backend
custom existente, **não valida um MCP oficial ainda não instalado**.
Nenhuma melhoria adicional será feita nesse runtime/hook enquanto se aguarda
o handoff de substituição.

## Verificação executada

- TDD: dois negativos iniciais falharam (escrita ainda permitida no contrato
  anterior e placeholders existentes). O fechamento temporário passou, depois
  foi substituído pelo HITL de edit:*; não é requisito atual.
- Novo requisito: teste de edit:* nos cinco QA falhou antes de regenerar config
  (1 failed / 1 passed), depois ficou verde.
- Guard: red por módulo ausente; green com dois testes de origem/redirect.
- `node scripts/check.mjs`: exit 0.
- `node --test tests/*.test.mjs`: **19/19**, zero failed/skipped.
- `sh -n install.sh` e `node --check` para .mjs/.cjs: exit 0.
- `scripts/smoke-opencode.mjs` com executável local verificado: exit 0;
  **70 efeitos nativos esperados**, edit em source allow nos cinco QA;
  5 agentes, 5 skills, MCP qa conectado, **0 comandos registrados / 3 templates
  em quarentena**.
- `scripts/smoke-browser.mjs` com instalações existentes verificadas: exit 0,
  contador externo zero e cleanup de processos/workspaces próprios.

Evidência bruta sanitizada, fora do repo: `qa-current-tests.txt`,
`qa-current-opencode.json`, `qa-current-browser.txt` em /tmp/opencode.
Red do requisito novo: `qa-human-writing-red.txt`. Evidência original permanece
em validation.md e seus arquivos brutos anteriores. Baseline SHA-256 e nomes
dos quatro rascunhos não foram reescritos.

## Runtime verdict por capacidade

- Motor de permissões, requisito novo: `works_as_specified` nas 70 consultas;
  não prova execução de write/edit/patch ou respeito comportamental dos prompts.
- Launchers sem placeholders: `does_not`, três probes com sentinela escrita.
- Bloqueio da rota slash: `works_as_specified`, três CommandNotFound sem escrita;
  capacidade slash segura permanece `blocked`.
- Backend custom HTTP/FS/lifecycle: `works_as_specified` no ambiente sintético
  medido, com limites descritos; agora pausado para substituição.
- Microsoft Playwright MCP oficial: `not_run`, PIN/instalação/handoff pendentes.
- Comportamento do modelo/invocação E2E de ferramentas: `could_not_be_verified`,
  sem modelo autorizado ou endpoint público arbitrário de tools.

Sem instalação global, dependências, commit ou push. Branch unborn
feat/qa-orchestration-kit. QA-02 mantém evidência de contrato/motor nas dimensões
não liberadas pelo HITL; QA-03 mantém delegação restrita, separada de QA-05;
QA-04 mantém evidência apenas no ambiente sintético. Review final pelo lead,
sem declarar o kit concluído.
