import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ConfirmationPage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('.container h1');
  }

  detailValue(label: string): Locator {
    return this.page
      .locator('table.table tbody tr')
      .filter({ has: this.page.locator('td:nth-of-type(1)', { hasText: this.exactText(label) }) })
      .locator('td:nth-of-type(2)');
  }
}
