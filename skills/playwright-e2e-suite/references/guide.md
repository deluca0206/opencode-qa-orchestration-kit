# Revisão de suíte
O teste deve falhar quando a regra de negócio falhar. Verifique estado visível,
não apenas sucesso de click. Use assertions web-first do runner existente.
Seletores obtidos do explorer precisam ser únicos e ter escopo; em listas,
restrinja ao item identificado por dado sintético.

Uma fixture cria dados para o próprio teste e encerra em finally/teardown.
O namespace por worker evita colisão, mas não substitui cleanup. Nunca remover
todos os dados de um ambiente para limpar um teste. APIs auxiliares de setup
exigem contrato de ambiente de teste e autorização independente.

POM representa ações de domínio e locators estáveis. Não encapsule espera fixa
ou retry invisível. Timeout deve ser explícito no runner humano; falha deve
produzir diagnóstico. Execução em paralelo só depois de provar independência.
O template ilustra sintaxe, não autoriza instalação nem prova execução.

Após gerar: fornecer handoff de execução ao humano/executor controlado com
versão do runner existente, specs afetadas, comando exato compatível, dados,
cleanup, esperado e evidências a devolver. Rever resultado e corrigir autoria
apenas dentro do escopo aprovado. Sem runner/autorização, registrar not_run e
manter validação pendente; isso não equivale a pular a verificação do Fugazi.
Não ampliar shell do engineer nem instalar @playwright/test para preencher a lacuna.
