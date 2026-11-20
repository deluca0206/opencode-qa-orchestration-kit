# Validação — iteration-001

> Relatório inicial histórico, preservado sem reescrever os resultados. A
> decisão humana posterior habilitou edit:* nos cinco QA e cancelou writer.
> Estado e reavaliação: [security-correction.md](security-correction.md).
> Os números/limitações abaixo descrevem a primeira entrega, não o contrato atual.
> Direção vigente posterior: [cli-pivot.md](cli-pivot.md), CLI Fugazi/comandos OAK,
> sem MCP custom ou quarentena ativos.

## Resultado e escopo

Quatro slices implementadas e medidas. **Não há aprovação geral de segurança.**
Status de entrega: `needs_changes` para os requisitos ainda bloqueados;
review final pertence ao lead/reviewer, não foi declarado aprovado aqui.
Nenhuma dependência instalada, configuração global alterada, instalação real,
commit ou push. Os quatro rascunhos conservaram nomes e SHA-256.

## Checkpoints e red/green

1. **Contratos/conteúdo:** TDD do checker iniciou com
   `ERR_MODULE_NOT_FOUND scripts/check.mjs` (red). Após implementação,
   quatro testes passaram (green): árvore, parser restrito, mutações e allowlists.
   Aprovação persistida antes da implementação; ampliação para quatro slices
   registrada no mesmo handoff antes de avançar.
2. **Browser:** testes negativos primeiro, red por ausência de
   runtime/browser-contract.mjs. Depois schemas/protocolo e config fail-closed
   ficaram verdes. Smoke real percorreu formulário/DOM, console, requests e
   imagem, com daemon e Chromium no namespace isolado.
3. **Instalador:** red com scripts/install.mjs ausente (3 falhas; um negativo
   isolado não provava implementação). Green após copy/link, preflight e rollback.
   Testes finais preservam sentinelas de terceiros inclusive no sucesso.
4. **Integração/docs:** descoberta real OpenCode 2.3.2, 64 decisões esperadas do
   motor nativo e probes concretos das lacunas, sem modelo/credenciais do usuário.

## Comandos finais e resultados

- `node scripts/check.mjs`: exit 0.
- `node --test tests/*.test.mjs`: exit 0, **15/15**, zero skipped.
- `sh -n install.sh`: exit 0.
- `node --check` para runtime/*.mjs, scripts/*.mjs e tests/*.mjs: exit 0.
- `./install.sh --copy --target "<tmp próprio>/alvo com espaços" --dry-run`:
  exit 0; destino continuou inexistente; 16 entradas no inventário.
- `QA_SMOKE_OPENCODE=<OpenCode local existente> node scripts/smoke-opencode.mjs`:
  exit 0; descoberta **5 agentes / 3 comandos / 5 skills / MCP qa conectado**;
  **64 efeitos nativos** iguais ao esperado, com controles allow e deny.
- `QA_SMOKE_NODE=... QA_SMOKE_CLI_ROOT=... QA_SMOKE_BROWSER_DIR=...
  QA_SMOKE_BWRAP=... node scripts/smoke-browser.mjs`: exit 0; operações reais,
  refs após navegação, textos `--config`, `--session`, `--output`,
  aspas/newline/`; $()` como dados, snapshot/console/requests/screenshot;
  timeout real, close repetido e EOF com browser aberto.
- `sha256sum "Rascunhos dos Arquivos Principais/"*`: quatro hashes idênticos a
  docs/ai/baseline-drafts.json.
- `git status --short --branch`: branch unborn, somente untracked.
- `git config --local --get remote.origin.url`: URL HTTPS exata abaixo.

Versões observadas: Node 22.23.1, Git 2.56.0, OpenCode 2.3.2,
Playwright CLI 0.1.22, bubblewrap 0.13.1, Chromium revisão 1247 /
Chrome for Testing 155.0.8059.12.

## Evidência original sanitizada

Arquivos brutos da execução, fora do repositório:
`qa-check-final.txt`, `qa-tests-final.txt`, `qa-native-permissions.json`,
`qa-browser-smoke.txt` em /tmp/opencode. Não contêm credenciais reais.
Senha de API foi gerada por fixture, mantida só no ambiente e nunca impressa.
HOME/config/data/cache foram temporários; provider/modelo fictícios impedem
geração por modelo. Nenhum experimental.fs.write foi usado.

Trechos literais:

```text
Contratos estáticos OK; runtime enforcement NÃO verificado.
# tests 15
# pass 15
# fail 0
# skipped 0
```

```json
{
  "version": "opencode v2.3.2",
  "discovery": { "agents": 5, "commands": 3, "skills": 5, "mcp": "qa connected" },
  "nativeEngine": {
    "passed": 64,
    "gaps": [
      { "resource": "tests/../src/production.txt", "effect": "allow" },
      { "resource": "tests/alias.txt", "effect": "allow" },
      { "resource": "tests/hardlink.txt", "effect": "allow" }
    ]
  },
  "commandInterpolation": {
    "markerWrittenBeforeModel": true,
    "commandError": false,
    "verdict": "does_not"
  }
}
```

```text
indirect_click: hits=0
indirect_popup: hits=0
indirect_redirect: hits=1; URL gate/CLI routing não é firewall universal.
timeout_probe: CLI_FAILED
live_smoke browser: PASS; operações reais, injection/estado/origins, namespace daemon/Chromium, FS probe e cleanup.
```

`PASS` acima se refere ao smoke de medição: não transforma o redirect em seguro.
Click/popup sem hits não provam bloqueio de toda navegação indireta.

## Runtime verification por superfície

- **command — checker:** `works_as_specified`. Negativos mutam permissões,
  config, comandos e referências; sem emulador do matcher.
- **command — instalador:** `works_as_specified` no ambiente sintético Linux.
  Copy/link, paths com espaços, conflitos JSON/JSONC/AGENTS/nomes/tipos,
  links de destino/ancestrais/quebrados, dry-run sem escrita, reexecução/mudança
  de modo e falha parcial com sentinelas. Wrapper shell também exercitado.
- **endpoint — MCP browser / filesystem:** `works_as_specified` para fixture
  sintética e mounts confiáveis. Probe independente de escrita em /usr falhou;
  daemon e Chromium reais compartilharam namespace de mount diferente do host;
  sentinela externa e sockets de usuário não estavam visíveis no root do daemon.
  Sentinela de produção intacta. Fechamento, timeout/erro e EOF eliminaram
  descendentes próprios e workspace. Não foi inferido somente de hashes.
- **endpoint — isolamento de rede universal:** `does_not`. Redirect chegou à
  segunda origem. Não implementado firewall; requer rede externa controlada.
- **endpoint — motor de permissões OpenCode:** `works_as_specified` para as
  64 consultas; **não prova invocação das ferramentas**. Deny em produção,
  src/x.spec, shell, execute, external_directory, MCP genérico, segredos em
  paths absolutos e delegações fora da lista. Allow controles de leitura,
  raízes, quatro delegações do lead e operação exata do explorer.
- **endpoint — argumentos não confiáveis em comandos nativos:** `does_not`.
  Probe benigno construído pelo teste escreveu arquivo sintético por shell
  introduzido via $ARGUMENTS, antes do modelo. Limitação atribuída ao
  pré-processador OpenCode 2.3.2, não introduzida pelos templates.
- **store — imutabilidade de produção por autoria engineer:**
  `could_not_be_verified`. Não há barreira externa implementada para o
  engineer; matcher permitiu aliases/traversal. Escrita continua bloqueada
  operacionalmente; entrega apenas na conversa.

## Falhas diagnosticadas durante verificação

- Identificador do daemon no smoke estava errado (`cli-daemon` versus
  cliDaemon.js); probe corrigido a partir do processo real, sem remover a
  exigência de daemon/Chromium isolados.
- Snapshot --json é estruturado; o smoke inicialmente procurava refs em texto.
  Foi ajustado ao output real. Refs após navegação têm prefixo f1eN; schema
  passou a aceitar esse formato observado, sem aceitar seletores/código.
- Reaping do namespace não é instantâneo após exit do pai: o teste exige
  desaparecimento dos PIDs próprios com prazo de 3 s, não espera fixa de UI.
- Serve sem senha e serve --service não compartilhavam auth do cliente no
  teste: corrigido para servidor normal com senha aleatória efêmera de fixture.
- Catálogos iniciais da API podem estar parciais antes de plugins carregarem:
  smoke espera prontidão bounded e exige exatamente os cinco QA/três comandos.
  Não conta catálogos parciais como sucesso.
- A primeira leitura do body de reload presumiu JSON apesar de 204; helper
  passou a aceitar resposta vazia, sem alterar status ou tratar erro como deny.

## Não executado / gates restantes

- Invocação end-to-end real de write/edit/patch/subagent e normalização de paths:
  sem endpoint público arbitrário identificado/modelo autorizado. A API de
  permissão compartilha o motor, mas não substitui a ferramenta.
- Resistência comportamental do modelo a prompt injection: não há modelo/
  credenciais usados para isso. Prompts foram inspecionados estaticamente.
- Barreira externa para engineer, correção do pré-processador de comandos e
  firewall de rede: não implementados; exigem decisão/camada adicional, sem
  fallback permissivo.
- Lint/typecheck de framework e suítes da aplicação: não há runner/dependências
  desse tipo neste kit. Usados syntax check e Node builtin.
- Instalação global, outras plataformas/versões, publicação e review final:
  não executados por restrição/gate de escopo.
- Nenhum manual_oracle de aceitação de risco foi registrado.

## Git, baseline e fechamento

Remoto reconfirmado vazio antes de git init in-place.
Branch: `feat/qa-orchestration-kit`, **unborn, sem commits**.
Origin literal local: https://github.com/deluca0206/opencode-qa-orchestration-kit.
`git remote -v` refletiu reescrita de URL já existente no ambiente; nenhuma
configuração global ou credencial foi lida/alterada para isso.
Diff base: repositório vazio, inventário untracked das novas árvores e baseline
dos quatro rascunhos. Não há promessa de rollback Git.

Todos os servidores, processos MCP/browser e fixtures iniciados pelos smokes
foram encerrados; só processos próprios foram sinalizados. Artefatos operacionais
temporários foram removidos; evidência textual bruta permaneceu em /tmp/opencode.
Vault MCP consultado sem notas do projeto. Não gravar bugs/logs/work history no
vault; eventual nota durável de arquitetura fica para a consolidação pelo lead
após review.
