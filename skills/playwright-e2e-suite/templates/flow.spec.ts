// Example: adapt only to the existing runner/observed DOM; installs no dependency.
import { test, expect } from './fixtures';
import searchData from './data/search.json';

test('unmatched search reports an empty result', async ({ searchPage, page }) => {
  await test.step('search for an unmatched synthetic term', async () => {
    await searchPage.search(searchData.term);
  });
  await test.step('verify observable state, not merely the click', async () => {
    await expect(page.getByRole('status')).toHaveText(searchData.expected);
  });
});
