import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReservePage extends BasePage {
  readonly heading: Locator;
  readonly flightRows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h3');
    this.flightRows = page.locator('table.table tbody tr');
  }

  /** Row whose "Flight #" cell matches exactly — selects by identity, not position. */
  flightRow(flightNumber: string): Locator {
    return this.flightRows.filter({
      has: this.page.locator('td', { hasText: this.exactText(flightNumber) }),
    });
  }

  async chooseFlight(flightNumber: string): Promise<void> {
    const button = this.flightRow(flightNumber).locator('input[type="submit"][value="Choose This Flight"]');
    await button.waitFor({ state: 'visible' });
    await button.click();
    await this.page.waitForURL('**/purchase.php');
    await this.pace();
  }
}
