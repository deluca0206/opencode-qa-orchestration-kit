---
name: playwright-e2e-suite
description: Autoria E2E com fixtures, locators observados, POM e isolamento sem mascarar falhas.
---
# Suíte Playwright sustentável

## MUST DO
- Ler versão/convenções existentes; sem runner compatível, devolver plano.
- edit:* está habilitado por HITL. Por regra comportamental, autoria só nas
  três raízes de testes, nunca produção; também pode entregar código na resposta.
  Não há confinamento técnico nem writer separado: proposta cancelada.
- Mapear cada cenário à evidência e assertion observável.
- Fixtures por teste/worker, dados únicos e cleanup dos próprios recursos.
- Role/nome acessível ou testid estável observado; POM para comportamento
  reutilizado, não para esconder assertions ou compartilhar estado mutável.
- Usar dados externos e test.step com assertions web-first; sem XPath ou any.
- Declarar autoria versus execução; runner é humano/controlado.
- Após gerar, encaminhar execução/verificação no runner já existente. Sem
  runner/autorização, status not_run e validação pendente, nunca “pass”.

## WON'T DO
- Não instalar pacotes, executar specs/shell ou editar produção.
- Não usar waitForTimeout/sleeps, retries para esconder falhas, catch silencioso,
  seleção por índice sem contrato ou testes dependentes da ordem.
- Não alegar que tests/** impede alias para produção.

Use [padrões](references/guide.md) e
[exemplo de autoria](templates/flow.spec.ts), com
[fixtures](templates/fixtures.ts), [POM](templates/pages/search-page.ts) e
[dados externos](templates/data/search.json).
