---
description: Desenha cobertura, valida seletores, produz testes e revisa sem executar specs.
agent: qa-lead
---
Objetivo da cobertura (argumentos humanos confiáveis):

$ARGUMENTS

Sequência obrigatória: qa-quality-auditor desenha cenários por risco →
qa-browser-explorer observa seletores reais → qa-e2e-engineer produz autoria →
qa-quality-auditor revisa matriz e lacunas. Passe evidências entre etapas.
Todos os cinco QA têm edit:* por HITL; diagnóstico/lead não devem escrever.
Engineer deve escrever só em tests/**, e2e/**, playwright/**, nunca produção,
por regra comportamental, sem confinamento técnico; também pode entregar testes
na conversa. Writer separado foi cancelado. Shell CLI só no explorer; lead e
engineer não executam shell/specs nem instalações. Encaminhar validação humana/controlada após
gerar, com comando do runner existente, esperado e evidência de retorno.
Sem runner/autorização, marcar execução not_run. Separar cobertura proposta,
escrita e executada. Reportar EV, file:line, status e pendências.
