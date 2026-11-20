import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface PassengerDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CardDetails {
  cardType: string;
  cardNumber: string;
  month: string;
  year: string;
  nameOnCard: string;
}

export class PurchasePage extends BasePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly cardTypeSelect: Locator;
  readonly cardNumberInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly nameOnCardInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly purchaseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('.container h2');
    this.nameInput = page.locator('#inputName');
    this.addressInput = page.locator('#address');
    this.cityInput = page.locator('#city');
    this.stateInput = page.locator('#state');
    this.zipCodeInput = page.locator('#zipCode');
    this.cardTypeSelect = page.locator('#cardType');
    this.cardNumberInput = page.locator('#creditCardNumber');
    this.monthInput = page.locator('#creditCardMonth');
    this.yearInput = page.locator('#creditCardYear');
    this.nameOnCardInput = page.locator('#nameOnCard');
    this.rememberMeCheckbox = page.locator('#rememberMe');
    this.purchaseButton = page.locator('input[type="submit"][value="Purchase Flight"]');
  }

  async fillPassengerDetails(passenger: PassengerDetails): Promise<void> {
    await this.nameInput.fill(passenger.name);
    await this.addressInput.fill(passenger.address);
    await this.cityInput.fill(passenger.city);
    await this.stateInput.fill(passenger.state);
    await this.zipCodeInput.fill(passenger.zipCode);
    await this.pace();
  }

  async selectCardType(cardType: string): Promise<void> {
    await this.cardTypeSelect.selectOption(cardType);
    await this.pace();
  }

  async fillCardDetails(card: Omit<CardDetails, 'cardType'>): Promise<void> {
    await this.cardNumberInput.fill(card.cardNumber);
    await this.monthInput.fill(card.month);
    await this.yearInput.fill(card.year);
    await this.nameOnCardInput.fill(card.nameOnCard);
    await this.pace();
  }

  async setRememberMe(checked: boolean): Promise<void> {
    await this.rememberMeCheckbox.setChecked(checked);
    await this.pace();
  }

  async purchaseFlight(): Promise<void> {
    await this.purchaseButton.click();
    await this.page.waitForURL('**/confirmation.php');
    await this.waitForPageLoad();
    await this.pace();
  }
}
