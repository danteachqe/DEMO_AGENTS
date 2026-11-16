import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ReservePage } from '../src/pages/ReservePage';
import { PurchasePage } from '../src/pages/PurchasePage';
import { ConfirmationPage } from '../src/pages/ConfirmationPage';
import data from '../data/book-flight-amex.json';

test.describe('TC-book-flight-amex', () => {
  test('Book flight Philadelphia to Berlin with American Express', async ({ page }) => {
    const homePage = new HomePage(page);
    const reservePage = new ReservePage(page);
    const purchasePage = new PurchasePage(page);
    const confirmationPage = new ConfirmationPage(page);

    await test.step('1. Open the home page', async () => {
      await homePage.open();
      await expect(homePage.heading).toHaveText(data.homeHeading);
    });

    await test.step('2. Select departure city', async () => {
      await homePage.selectDeparture(data.departure);
      await expect(homePage.fromPortSelect).toHaveValue(data.departure);
    });

    await test.step('3. Select destination city', async () => {
      await homePage.selectDestination(data.destination);
      await expect(homePage.toPortSelect).toHaveValue(data.destination);
    });

    await test.step('4. Find flights', async () => {
      await homePage.findFlights();
      await expect(reservePage.heading).toHaveText(data.reserveHeading);
    });

    await test.step('5. Locate the flight by number', async () => {
      await expect(reservePage.flightRow(data.flightNumber)).toHaveCount(1);
    });

    await test.step('6. Choose the flight', async () => {
      await reservePage.chooseFlight(data.flightNumber);
      await expect(purchasePage.purchaseButton).toBeVisible();
    });

    await test.step('7. Fill passenger details', async () => {
      await purchasePage.fillPassengerDetails(data.passenger);
      await expect(purchasePage.nameInput).toHaveValue(data.passenger.name);
      await expect(purchasePage.addressInput).toHaveValue(data.passenger.address);
      await expect(purchasePage.cityInput).toHaveValue(data.passenger.city);
      await expect(purchasePage.stateInput).toHaveValue(data.passenger.state);
      await expect(purchasePage.zipCodeInput).toHaveValue(data.passenger.zipCode);
    });

    await test.step('8. Select card type', async () => {
      await purchasePage.selectCardType(data.cardType);
      await expect(purchasePage.cardTypeSelect).toHaveValue(data.cardType);
    });

    await test.step('9. Fill payment details', async () => {
      await purchasePage.fillPaymentDetails(data.payment);
      await expect(purchasePage.cardNumberInput).toHaveValue(data.payment.cardNumber);
      await expect(purchasePage.cardMonthInput).toHaveValue(data.payment.month);
      await expect(purchasePage.cardYearInput).toHaveValue(data.payment.year);
      await expect(purchasePage.nameOnCardInput).toHaveValue(data.payment.nameOnCard);
    });

    await test.step('10. Set "Remember me"', async () => {
      await purchasePage.setRememberMe(data.rememberMe);
      await expect(purchasePage.rememberMeCheckbox).toBeChecked({ checked: data.rememberMe });
    });

    await test.step('11. Purchase the flight', async () => {
      await purchasePage.purchaseFlight();
      await expect(confirmationPage.heading).toHaveText(data.confirmationHeading);
    });

    await test.step('12. Review the receipt', async () => {
      await expect(confirmationPage.receiptValue(data.receiptStatusLabel)).toHaveText(data.expectedStatus);
      await expect(confirmationPage.receiptValue(data.receiptIdLabel)).not.toBeEmpty();
    });
  });
});
