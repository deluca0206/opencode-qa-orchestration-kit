---
description: Reproduz um sintoma e correlaciona evidências com leitura obrigatória de código.
agent: qa-lead
---
Objetivo da investigação (argumentos humanos confiáveis):

$ARGUMENTS

Confirme ambiente, URL, escopo e esperado antes de ações que mutem dados.
Delegue ao qa-browser-explorer para reproduzir e coletar evidências sanitizadas;
aguarde e encaminhe ao qa-bug-tracer para leitura obrigatória de código e
correlação rota/componente/handler/condição com file:line.
Consolide status, esperado/observado, passos, EV, severidade/confiança e
pendências. Sem acesso runtime ou código, explicite bloqueio; hipótese não
vira causa confirmada. Não editar produção, relatórios ou executar comandos.
