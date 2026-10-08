import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ConfirmationPage extends BasePage {
  readonly heading: Locator;
  readonly purchaseId: Locator;
  readonly status: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1');
    this.purchaseId = this.valueCellFor('Id');
    this.status = this.valueCellFor('Status');
  }

  private valueCellFor(label: string): Locator {
    return this.page
      .locator('table tr')
      .filter({ has: this.page.locator('td:first-child', { hasText: this.exactText(label) }) })
      .locator('td')
      .nth(1);
  }

  async waitForConfirmation(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
    await this.pace();
  }
}
