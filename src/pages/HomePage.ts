import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heading: Locator;
  readonly departureSelect: Locator;
  readonly destinationSelect: Locator;
  readonly findFlightsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h1');
    this.departureSelect = page.locator('select[name="fromPort"]');
    this.destinationSelect = page.locator('select[name="toPort"]');
    this.findFlightsButton = page.locator('input[type="submit"][value="Find Flights"]');
  }

  async open(): Promise<void> {
    await this.navigate('/');
    await this.heading.waitFor({ state: 'visible' });
    await this.pace();
  }

  async selectDeparture(city: string): Promise<void> {
    await this.departureSelect.selectOption(city);
    await this.pace();
  }

  async selectDestination(city: string): Promise<void> {
    await this.destinationSelect.selectOption(city);
    await this.pace();
  }

  async findFlights(): Promise<void> {
    await this.findFlightsButton.click();
    await this.page.waitForURL('**/reserve.php');
    await this.pace();
  }
}
