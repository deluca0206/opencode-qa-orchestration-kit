import { test as base, expect } from '@playwright/test';
import { SearchPage } from './pages/search-page';

export const test = base.extend<{ searchPage: SearchPage }>({
  searchPage: async ({ page }, use) => {
    await page.goto('/catalog'); // baseURL and DOM must come from the project/observation.
    await use(new SearchPage(page));
    // The page/context fixture closes per test; this example persists no data.
    // If creating resources, retain owned IDs and implement authorized teardown.
  },
});
export { expect };
