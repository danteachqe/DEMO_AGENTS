import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly fromPortSelect: Locator;
  readonly toPortSelect: Locator;
  readonly findFlightsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('.jumbotron h1');
    this.fromPortSelect = page.locator('select[name="fromPort"]');
    this.toPortSelect = page.locator('select[name="toPort"]');
    this.findFlightsButton = page.locator('input[type="submit"][value="Find Flights"]');
  }

  async open(): Promise<void> {
    await this.navigate('/');
    await this.pace();
  }

  async selectDeparture(city: string): Promise<void> {
    await this.fromPortSelect.selectOption(city);
    await this.pace();
  }

  async selectDestination(city: string): Promise<void> {
    await this.toPortSelect.selectOption(city);
    await this.pace();
  }

  async findFlights(): Promise<void> {
    await this.findFlightsButton.click();
    await this.page.waitForURL('**/reserve.php');
    await this.waitForPageLoad();
    await this.pace();
  }
}
