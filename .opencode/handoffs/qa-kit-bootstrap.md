---
approval_status: approved
---
# Bootstrap QA kit

## Direção vigente — simplificação Fugazi/OAK
Correção bounded aprovada: CLI Playwright existente 0.1.22 como caminho do
Fugazi, sem MCP próprio/oficial novo, writer/proxy/sandbox. Restaurar três
comandos nativos OAK com $ARGUMENTS; a direção explícita substitui a quarentena,
com aviso de argumentos confiáveis e evidências não confiáveis via mensagem
normal. Explorer recebe somente formas shell específicas de playwright-cli;
os outros quatro continuam sem shell. Edit:* nos cinco permanece aprovado.

Remoção autorizada somente dos cinco arquivos runtime custom e dos testes/
scripts exclusivamente acoplados, além do registro MCP qa e referências ativas.
Preservar quatro rascunhos/hashes, histórico AHE, assets e instalador útil
copy/link. Sem instalação global, download/deps/commit/push. Aceite: 5 agentes,
5 skills, 3 comandos em HOME/config temporários, copy/link, motor real e
smoke CLI real com sessão exclusiva/cleanup. Toolkit não encerrado sem review.
Esta direção substitui a pausa de backend abaixo, mantida como histórico.

## Pausa histórica — superada pela direção CLI acima
Nova decisão humana literal: “Não achei interessante esse mcp proprio, acharia
melhor baixar o MCP Playright se for pra ter mcp”.
Parar melhorias/expansão do MCP próprio e hook/runtime custom. Researcher
verificará Microsoft Playwright MCP oficial, versão exata e integração V2.
Sem instalação de pacote/browser ou npx autodownload até aprovação humana do
PIN. Não remover arquivos atuais antes do handoff de substituição; preservar
evidência e os quatro rascunhos. Não adicionar proxy/writer/plugin próprio.
Instalação real em ~/.config/opencode continua posterior. Edit:* nos cinco QA
permanece conforme HITL abaixo. Ownership developer mantido; kit não finalizado.

## Decisão humana vigente — capacidade de escrita
HITL literal: “deixe write/edit liberados e coloque instruções e regras do
agentes apenas.” Após esclarecimento explícito do lead de que produção ficaria
protegida só por instruções, sem garantia técnica, confirmação literal:
“Todos os cinco agentes”.

Esta decisão aprovada substitui o strict-writing gate/default fechado anterior.
Todos os cinco qa-* recebem edit:* nativo (V2 cobre write/edit/patch), sem
allowroots. Escopo e proibição de alterar produção são regras comportamentais
dos prompts, não confinamento técnico. Risco QA-01 aceito conscientemente; allow
do motor em source/aliases é esperado no objetivo novo, não falha pendente.
O writer MCP separado/descriptor/worker foi cancelado; não implementar.
Continuam restritos shell/execute, ferramentas desconhecidas, delegação, leitura
de segredos e external_directory. Não há autorização para escrever aplicações
reais durante o desenvolvimento deste kit. Slash preprocessing e browser não
foram liberados por essa decisão. Sem instalação global/deps/commit/push.

Aprovação humana explícita: “Dividir em quatro fases (recomendado)”.
Decisão: contratos/conteúdo → browser isolado → instalador → validação/docs.
Escopo total preservado. Autorização ampliada recebida: as quatro fases
aprovadas pelo humano estão delegadas sequencialmente nesta execução, com
checkpoints e evidências por fase; não é necessário novo gate entre slices.

## Task Contract
- objective: entregar o kit QA original pt-BR nas quatro fases, sem prometer sandbox universal.
- success_criteria: cinco agentes/skills e três comandos OAK nativos; CLI Fugazi existente em fixture autorizada, sem backend próprio; copy/link preservador; validação/proveniência e quatro rascunhos intactos. Execução de specs e comportamento de modelo não verificados ficam explícitos.
- non_goals: instalação global real, commits/push, dependências novas, alterações no harness global; writer separado cancelado.
- assumptions: OpenCode local 2.3.2 e pesquisa delegada sobre permissões V2 são a base; regras QA se aplicam à aplicação sob teste, não ao desenvolvimento do kit.
- open_questions: execução/verificação futura de specs no runner do aplicativo e review final; invocação E2E por modelo não verificada. Comandos nativos restaurados com risco pré-modelo documentado, não garantia de argumentos seguros.
- accepted_tradeoffs: edit:* nos cinco QA e proteção de produção só por instruções (HITL literal acima); risco aliases/source aceito, sem promessa de confinamento. Contratos estáticos não comprovam comportamento de modelo; branch sem commits não oferece rollback Git.
- validation: checker, testes Node, smoke-browser, smoke-opencode, SHA-256, git status e relatórios runtime por superfície.
- ask_abort_triggers: refs remotas existentes, necessidade de dependência/instalação, escrita fora de escopo ou mudança de contratos críticos.

## Handoff packet
- objetivo atual: simplificação CLI Fugazi/OAK implementada, validar e devolver para review; nenhum pacote/browser instalado.
- decisões: edit:* nos cinco por HITL; três raízes só comportamentais; comandos OAK nativos restaurados; shell CLI específico só do explorer; sem MCP/hook/writer/proxy/sandbox próprio.
- estado inicial: somente quatro rascunhos; remoto sem refs (git ls-remote exit 0).
- validação: contratos/testes Node, smoke browser real e motor OpenCode 2.3.2; relatório em docs/ai/evolution/runs/iteration-001/validation.md.
- limites: argumentos nativos só confiáveis pelo risco pré-modelo conhecido; CLI sem isolamento OS/rede; specs ainda requerem runner humano/controlado, not_run se indisponível. Source/aliases allow esperado por HITL.
- próxima ação: validação final e auditoria de aderência, depois review pelo lead/reviewer. Não instalar MCP/runner, ampliar shell do engineer ou introduzir infraestrutura.

## Histórico de checkpoint
- Histórico, substituído só quanto à escrita pelo HITL vigente acima: correção
  de segurança aprovada pelo lead/humano após needs_changes: avaliar
  launchers sem argumentos no OpenCode 2.3.2; se o runtime anexar raw args,
  bloquear a rota insegura e devolver evidência para decisão. Engineer passa
  a autoria somente na conversa, com escrita nativa negada incondicionalmente.
  Avaliar correção browser apenas com recursos existentes comprovados; sem
  camada estrutural/deps/config global extras. Esta é correção default-fechado,
  não aprovação de escopo adicional. Kit não finalizado.
- Contrato inicial autorizava apenas fase 1 nesta execução; substituído pela
  delegação ampliada acima antes de iniciar fase 2. Browser/instalador eram
  non-goals da slice 1, não do objetivo atual.
- Fase 1: quatro testes verdes após red por checker ausente; hashes preservados.
- Fase 2: operações reais, schema e isolamento; timeout/EOF/close exercitados;
  click/popup externos tiveram zero hits, redirect teve um hit.
- Fase 3: copy/link e adversariais verdes; nenhuma instalação real.
- Fase 4: 64 decisões esperadas do motor, descoberta 5/3/5/MCP; testes de
  ferramenta/modelo não executados. Probe de interpolação benigno escreveu
  sentinela temporária apesar de provider/modelo fictícios.
