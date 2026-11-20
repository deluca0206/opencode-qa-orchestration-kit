# OpenCode QA Orchestration Kit

Kit original pt-BR/MIT de agentes, skills e comandos, baseado nos padrões
concretos de [Fugazi e OAK](docs/provenance.md), não um novo framework de testes.
**Cinco agentes, cinco skills, três comandos nativos. Browser por CLI existente;
nenhum MCP, proxy, writer, sandbox ou runner próprio incluído.**

## Papéis e fluxos
- qa-lead: delimita escopo, delega aos quatro QA e consolida evidências.
- qa-browser-explorer: navegação interativa por playwright-cli, snapshots/refs.
- qa-bug-tracer: leitura obrigatória e correlação causal file:line, sem correção.
- qa-e2e-engineer: autoria de testes E2E/API nas três raízes por regra do prompt.
- qa-quality-auditor: risco, EP/BVA, decisão/estados, regressão e a11y.

Investigar: explorer → tracer → lead. E2E: auditor → explorer → engineer →
auditor → execução/verificação humana ou controlada. A autoria não é validação:
sem runner existente/autorização, execução **not_run**, com handoff e pendência.
O kit não instala @playwright/test nem dá shell ao engineer.

## CLI, Playwright Test e MCP não são a mesma coisa
- **playwright-cli**: browser vivo, open/goto/snapshot/fill/click,
  console/requests/screenshot/close. É o caminho Fugazi adotado neste kit.
- **Playwright Test** (`@playwright/test`): runner de specs, fixtures/request,
  assertions e relatórios; deve já existir no aplicativo para executar testes.
- **MCP**: integração opcional em outros agentes upstream, não necessária nem
  configurada aqui. `playwright run-test-mcp-server`, usado por agentes
  playwright-test upstream, não é sinônimo de `@playwright/mcp`.
  Não há npm/npx/autodownload no fluxo do kit.

## Estrutura ativa
```text
agents/                         cinco prompts V2
skills/<id>/SKILL.md             MUST DO / WON'T DO
skills/<id>/references/          métodos e critérios
skills/<id>/templates/           modelos, POM, fixtures e dados externos
commands/                       qa-investigate / qa-e2e / qa-audit
scripts/                        checker, geração, instalador e smokes mínimos
tests/                          contratos e instalador, Node builtin
docs/                           proveniência, contratos e histórico AHE
AGENTS.md / opencode.json / install.sh / LICENSE
Rascunhos dos Arquivos Principais/  quatro originais preservados
```

## Permissões e limites reais
Por HITL, **edit:* está habilitado nos cinco QA**, cobrindo write/edit/patch,
sem allowroots. Lead/diagnóstico não devem escrever; engineer só deve escrever
em tests/**, e2e/**, playwright/**, nunca produção. São instruções
comportamentais, **não confinamento técnico**. Denies conhecidos de segredos e
external_directory permanecem; não detectam todo arquivo sensível possível.
O risco foi aceito e writer separado cancelado.

Só explorer recebe formas shell específicas de playwright-cli. Todos negam
shell genérico, execute e ferramentas desconhecidas; lead delega só aos quatro
QA, especialistas não delegam. A allowlist CLI não é parser de argv nem
sandbox OS/rede. URLs, dados e mutações precisam de autorização humana.
Não alegar imutabilidade de produção a partir de prompts ou do motor de regras.

Os comandos nativos usam $ARGUMENTS, sem shell inline nos templates, conforme
OAK. **OpenCode 2.3.2 interpola shell vindo de argumentos antes do modelo**:
isso foi observado e não é impedido pelas permissões QA. Use argumentos
humanos confiáveis; encaminhe evidência não confiável por mensagem normal.
Não há promessa de escaping protetor, wrapper ou quarentena custom.

## Requisitos já existentes
Verificados neste ambiente: Node **22.23.1**, OpenCode **2.3.2**,
playwright-cli **0.1.22**, Chromium revisão **1247** /
Chrome for Testing **155.0.8059.12**; Git **2.56.0** no bootstrap.
CLI no PATH, browser e configuração confiável disponíveis. Outros ambientes/
versões precisam de verificação; nada é instalado automaticamente.
Bubblewrap não é requisito atual. Histórico do backend retirado não comprova CLI.

## Instalação copy ou symlink
Primeiro use destino de teste vazio:
```sh
./install.sh --copy --target "/tmp/opencode/QA teste" --dry-run
./install.sh --copy --target "/tmp/opencode/QA teste"
./install.sh --symlink --target "/tmp/opencode/QA dev"
```
São 15 entradas explícitas: cinco agentes, cinco skills, três comandos,
AGENTS.md e opencode.json. Não se substituem diretórios globais completos.
Preflight de todos os itens antes de escrever; AGENTS/config JSON/JSONC
preexistentes, nomes homônimos, tipos conflitantes e symlinks de destino/
ancestrais (mesmo quebrados) causam erro, sem merge ou sobrescrita silenciosa.
Reexecução/mudança de modo com colisão falha; atualização é manual e revisada.
Falha parcial reverte só itens próprios, verificando identidade; preserva
resíduos alterados/diretórios não vazios. Não é transação contra concorrência hostil.

`./install.sh --copy` sem --target usa `$HOME/.config/opencode`, não XDG.
**Essa instalação real não foi feita nesta tarefa.** Config é materializada nos
dois modos sem modificar a fonte; symlinks dos assets exigem manter a fonte.
O failpoint QA_INSTALL_TEST_FAIL_AFTER só provoca falha nos testes, não é hook.

Desinstalação: revisar e remover só os 15 itens ainda identificados como do kit,
preservando alterações de terceiros. Em symlink, remover o vínculo, não seguir
para apagar a fonte. Não apagar diretórios globais agents/skills/commands nem
a config inteira. Sem desinstalador automático ou promessa de rollback Git.

## Uso
```text
/qa-investigate Na fixture autorizada, Confirmar não atualiza o status.
/qa-e2e Cobrir busca vazia e sem resultados.
/qa-audit Revisar teclado, autorização e regressão da busca.
```
Confirmar alvo, esperado, ambiente e ações permitidas. Relatórios na conversa:
status, esperado/observado, passos, EV, file:line, severidade/confiança e pendências.

Formas CLI canônicas do explorer, com ID exclusivo de oito alfanuméricos:
```sh
NO_UPDATE_NOTIFIER=1 playwright-cli --version
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 open --idle-timeout=60000 -- http://127.0.0.1:8123
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 snapshot --
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 fill -- e3 "QA sintético"
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 click -- e4
NO_UPDATE_NOTIFIER=1 playwright-cli --json -s=qa-kit-a1b2c3d4 close --
```
Goto, screenshot, console e requests usam o mesmo prefixo e `--`.
Não reutilizar sessão do usuário ou usar close-all/kill-all, attach, eval/run-code,
storage, upload, scripts ou npm/npx. Artefatos/perfil/cache ficam em diretório
operacional autorizado, preferencialmente fora da aplicação; CLI tem efeitos
de filesystem e não isolamento próprio. Se faltar configuração/binário/browser
ou a forma necessária estiver bloqueada, pedir decisão sem ampliar shell.
Operadores/caracteres especiais negados podem bloquear texto/URL; não contornar.

Após gerar specs: entregar ao humano/executor controlado versão do runner já
existente, comando exato compatível, arquivos, dados/cleanup, esperado e evidências
a devolver. Incorporar o resultado na revisão; se não executado, declarar not_run.
Não copiar instalação ou debug/attach upstream sem necessidade/autorização.

## Verificação do kit
```sh
node scripts/check.mjs
node --test tests/*.test.mjs
QA_SMOKE_OPENCODE=/caminho/opencode node scripts/smoke-opencode.mjs
QA_SMOKE_CLI=/caminho/playwright-cli \
QA_SMOKE_BROWSER_DIR=/caminho/chrome-linux64 node scripts/smoke-browser.mjs
```
Sem dependências npm do kit. build-config.mjs regenera config dos frontmatters;
revisar e rodar checker depois. O checker é estático, não emula permissões.
Smoke OpenCode usa HOME/config temporários, copy/link e motor real sem modelo.
Smoke CLI usa fixture e sessão próprias, PNG/DOM/logs reais e cleanup; não
prova isolamento OS nem execução de specs. Não acessa sessões/configs do usuário.
Resultado/evidência atual: [cli-pivot.md](docs/ai/evolution/runs/iteration-001/cli-pivot.md).

## Proveniência e licença
[MIT](LICENSE), copyright contributors 2026. Prompts/textos originais adaptam
padrões, sem copiar conteúdo Apache extenso. Referências, SHAs, auditoria de
aderência e exceções locais: [docs/provenance.md](docs/provenance.md).
Fugazi: https://github.com/fugazi/test-automation-skills-agents (MIT).
OAK: https://github.com/jcarlosrodicio/opencode-agent-orchestration-kit (Apache-2.0).
