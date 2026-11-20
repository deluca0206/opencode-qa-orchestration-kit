# Coleta mínima
1. Registrar versão do alvo, viewport, fixture e estado inicial.
2. Abrir URL explicitamente autorizada pela CLI existente. Não há gate de rede,
   proxy, MCP ou sandbox do kit. Não navegar fora do escopo humano.
3. Snapshot produz referências efêmeras: não reutilizar após mudança de DOM.
4. Click/fill só com ref observado; não inventar JS para contornar estado.
5. Console: reportar nível e mensagem sanitizada; network: método/status e
   caminho sem query sensível. Nunca retornar headers/cookies/payloads.
6. Screenshot somente de alvo sintético aprovado, com referência EV.
7. Fechar apenas a sessão exclusiva e verificar cleanup. Ferramenta indisponível
   implica bloqueio, não npm/npx ou instalação automática.

CLI explora um browser vivo; Playwright Test executa specs versionadas. Ações
exploratórias ou TypeScript obtido delas não constituem suíte aprovada: faltam
assertions, fixtures/POM, dados e execução/verificação no runner existente.
Encaminhar ao engineer/auditor, sem inventar locators ou alegar execução.
Não tornar debug/attach obrigatório: não faz parte das formas aprovadas aqui.
