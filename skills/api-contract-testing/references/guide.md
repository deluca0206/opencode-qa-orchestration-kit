# Dimensões de contrato
Para POST /items num ambiente sintético:
- Válido: status documentado, id não vazio, nome preservado e sem campos secretos.
- Inválido: nome ausente, vazio e tipo incorreto; erro com código/campo estável,
  sem stacktrace nem detalhes de infraestrutura.
- Limites: mínimo-1/mínimo e máximo/máximo+1, conforme regra confirmada.
- Auth: ausência de identidade e papel insuficiente, diferenciando 401/403
  conforme o contrato. Não assumir que toda API usa os mesmos códigos.
- Idempotência/conflito: chave repetida e concorrência quando fizerem parte do
  contrato, sem depender da ordem de testes.
- Cleanup: guardar IDs criados; apagar só esses IDs em finally, relatar falha de
  cleanup sem suprimir falha original. Sem delete amplo ou acesso a produção.

Reutilize validador existente ou assertions explícitas. Não invente contrato:
marque campo incerto e peça confirmação antes de fixar expectativa em teste.
