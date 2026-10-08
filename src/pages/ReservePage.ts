import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReservePage extends BasePage {
  readonly heading: Locator;
  readonly flightRows: Locator;
  readonly chooseFlightButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h3');
    this.flightRows = page.locator('table.table tbody tr');
    this.chooseFlightButtons = page.locator('input[type="submit"][value="Choose This Flight"]');
  }

  async chooseFlight(index: number): Promise<void> {
    const button = this.chooseFlightButtons.nth(index);
    await button.waitFor({ state: 'visible' });
    await button.click();
    await this.page.waitForURL('**/purchase.php');
    await this.pace();
  }
}
