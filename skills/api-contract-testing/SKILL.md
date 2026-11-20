---
name: api-contract-testing
description: Desenha testes de contrato API positivos, negativos, auth, erros e cleanup seguro.
---
# Contratos API em ambiente de teste

## MUST DO
- Ler contrato/versionamento; confirmar host de teste e efeitos permitidos.
- Verificar status, schema/tipos, campos obrigatórios, semântica e erros.
- Cobrir positivo, inválido, limite, sem autenticação e papel sem autorização.
- Isolar recursos criados por teste e limpar somente seus IDs em teardown.
- Usar identidades sintéticas providas pelo executor; nunca embutir credenciais.
- Separar proposta, autoria e execução humana/controlada.

## WON'T DO
- Não testar produção destrutivamente, ler segredo ou executar requests/shell
  por esta skill. O engineer só produz testes, não roda suíte.
- Não aceitar qualquer 2xx/4xx nem copiar payloads sensíveis para evidência.
- Não instalar biblioteca de schema se não houver dependência já aprovada.

Use [matriz de contrato](references/guide.md) e
[modelo de cenários](templates/contract.md), com
[exemplo usando request fixture](templates/contract.spec.ts).
