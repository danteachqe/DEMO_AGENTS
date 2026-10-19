import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ConfirmationPage extends BasePage {
  readonly heading: Locator;
  private readonly receiptRows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('.hero-unit h1');
    this.receiptRows = page.locator('.hero-unit table.table tbody tr');
  }

  receiptValue(label: string): Locator {
    return this.receiptRows
      .filter({ has: this.page.locator('td:nth-child(1)', { hasText: this.exactText(label) }) })
      .locator('td:nth-child(2)');
  }
}
