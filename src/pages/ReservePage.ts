import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReservePage extends BasePage {
  readonly heading: Locator;
  private readonly flightRows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('.container h3');
    this.flightRows = page.locator('table.table tbody tr');
  }

  flightRow(flightNumber: string): Locator {
    return this.flightRows.filter({
      has: this.page.locator('td:nth-of-type(2)', { hasText: this.exactText(flightNumber) }),
    });
  }

  async chooseFlight(flightNumber: string): Promise<void> {
    await this.flightRow(flightNumber).locator('input[type="submit"]').click();
    await this.page.waitForURL('**/purchase.php');
    await this.waitForPageLoad();
    await this.pace();
  }
}
