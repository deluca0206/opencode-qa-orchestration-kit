import { test as base, expect } from '@playwright/test';
import { SearchPage } from './pages/search-page';

export const test = base.extend<{ searchPage: SearchPage }>({
  searchPage: async ({ page }, use) => {
    await page.goto('/catalogo'); // baseURL e DOM devem vir do projeto/observação.
    await use(new SearchPage(page));
    // Fixture page/context encerra por teste; este exemplo não persiste dados.
    // Se criar recursos, guardar IDs próprios e implementar teardown autorizado.
  },
});
export { expect };
