import type { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  constructor(page: Page) {
    // Replace only after observing unique roles/names in the browser.
    this.searchBox = page.getByRole('textbox', { name: 'Search', exact: true });
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
  }
  async search(term: string) {
    await this.searchBox.fill(term);
    await this.searchButton.click();
  }
}
