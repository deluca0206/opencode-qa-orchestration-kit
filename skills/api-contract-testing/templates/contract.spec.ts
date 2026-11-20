// Unexecuted example: adapt to the application's existing contract and runner.
// request fixture, without a new browser/SDK/schema library.
import { test, expect } from '@playwright/test';
import itemData from './data/items.json';

test('lists items according to the public contract', async ({ request }) => {
  const response = await request.get('/items');
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(Array.isArray(body.items)).toBe(true);
});

test('invalid input returns a contract error without an internal stack', async ({ request }) => {
  const response = await request.post('/items', { data: itemData.invalidItem });
  expect(response.status()).toBe(422);
  const body = await response.json();
  expect(body.error.code).toBe(itemData.invalidError);
  expect(body.error.stack).toBeUndefined();
});

test('private route rejects requests without identity', async ({ request }) => {
  // This scenario's request fixture must be anonymous, without inherited state/token.
  const response = await request.get('/private/items');
  expect(response.status()).toBe(401);
});
// Readonly/negative examples create no resources. For valid mutations:
// per-test/worker data, owned IDs and teardown; synthetic roles per fixture.
// Confirm EP/BVA and codes in the contract; do not infer them from this template.
