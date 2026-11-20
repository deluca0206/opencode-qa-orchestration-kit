// Exemplo não executado: adaptar ao contrato e runner já presentes no aplicativo.
// request fixture, sem browser/SDK/schema library novos.
import { test, expect } from '@playwright/test';
import itemData from './data/items.json';

test('lista itens conforme contrato público', async ({ request }) => {
  const response = await request.get('/items');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.items)).toBe(true);
});

test('entrada inválida retorna erro de contrato sem stack interno', async ({ request }) => {
  const response = await request.post('/items', { data: itemData.invalidItem });
  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body.error.code).toBe(itemData.invalidError);
  expect(body.error.stack).toBeUndefined();
});

test('rota privada rejeita request sem identidade', async ({ request }) => {
  // Fixture request deste cenário deve ser anônima, sem estado/token herdado.
  const response = await request.get('/private/items');
  expect(response.status()).toBe(401);
});
// Exemplos readonly/negativo não criam recursos. Para mutações válidas:
// dados por teste/worker, IDs próprios e teardown; papéis sintéticos por fixture.
// EP/BVA e códigos devem ser confirmados no contrato, não inferidos do template.
