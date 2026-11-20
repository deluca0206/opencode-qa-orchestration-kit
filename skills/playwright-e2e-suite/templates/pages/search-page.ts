import type { Page, Locator } from '@playwright/test';

export class SearchPage {
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  constructor(page: Page) {
    // Substitua apenas após observar role/nome únicos no browser.
    this.searchBox = page.getByRole('textbox', { name: 'Busca', exact: true });
    this.searchButton = page.getByRole('button', { name: 'Pesquisar', exact: true });
  }
  async search(term: string) {
    await this.searchBox.fill(term);
    await this.searchButton.click();
  }
}
