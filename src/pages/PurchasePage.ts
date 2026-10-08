import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface PassengerDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentDetails {
  cardType: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
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
  readonly cardMonthInput: Locator;
  readonly cardYearInput: Locator;
  readonly nameOnCardInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly purchaseButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator('h2');
    this.nameInput = page.locator('#inputName');
    this.addressInput = page.locator('#address');
    this.cityInput = page.locator('#city');
    this.stateInput = page.locator('#state');
    this.zipCodeInput = page.locator('#zipCode');
    this.cardTypeSelect = page.locator('#cardType');
    this.cardNumberInput = page.locator('#creditCardNumber');
    this.cardMonthInput = page.locator('#creditCardMonth');
    this.cardYearInput = page.locator('#creditCardYear');
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

  async fillPaymentDetails(payment: PaymentDetails): Promise<void> {
    await this.cardTypeSelect.selectOption(payment.cardType);
    await this.cardNumberInput.fill(payment.cardNumber);
    await this.cardMonthInput.fill(payment.cardMonth);
    await this.cardYearInput.fill(payment.cardYear);
    await this.nameOnCardInput.fill(payment.nameOnCard);
    await this.pace();
  }

  async setRememberMe(checked: boolean): Promise<void> {
    await this.rememberMeCheckbox.setChecked(checked);
    await this.pace();
  }

  async purchaseFlight(): Promise<void> {
    await this.purchaseButton.click();
    await this.page.waitForURL('**/confirmation.php');
    await this.pace();
  }
}
