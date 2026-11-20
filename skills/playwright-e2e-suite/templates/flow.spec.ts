// Exemplo: só adaptar ao runner/DOM reais já existentes; não instala dependência.
import { test, expect } from './fixtures';
import searchData from './data/search.json';

test('busca sem correspondência informa resultado vazio', async ({ searchPage, page }) => {
  await test.step('buscar termo sintético sem correspondência', async () => {
    await searchPage.search(searchData.term);
  });
  await test.step('verificar estado observável, não somente o clique', async () => {
    await expect(page.getByRole('status')).toHaveText(searchData.expected);
  });
});
