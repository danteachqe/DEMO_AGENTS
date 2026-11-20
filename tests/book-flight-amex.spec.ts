import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ReservePage } from '../src/pages/ReservePage';
import { PurchasePage } from '../src/pages/PurchasePage';
import { ConfirmationPage } from '../src/pages/ConfirmationPage';
import data from '../data/book-flight-amex.json';

test.describe('TC-book-flight-amex', () => {
  test('books a flight end-to-end with an American Express card', async ({ page }) => {
    const homePage = new HomePage(page);
    const reservePage = new ReservePage(page);
    const purchasePage = new PurchasePage(page);
    const confirmationPage = new ConfirmationPage(page);

    await test.step('1. Open the home page', async () => {
      await homePage.open();
      await expect(homePage.heading).toHaveText(data.homeHeading);
    });

    await test.step(`2. Select departure city "${data.departureCity}"`, async () => {
      await homePage.selectDeparture(data.departureCity);
      await expect(homePage.fromPortSelect).toHaveValue(data.departureCity);
    });

    await test.step(`3. Select destination city "${data.destinationCity}"`, async () => {
      await homePage.selectDestination(data.destinationCity);
      await expect(homePage.toPortSelect).toHaveValue(data.destinationCity);
    });

    await test.step('4. Click "Find Flights"', async () => {
      await homePage.findFlights();
      await expect(reservePage.heading).toHaveText(data.reserveHeading);
    });

    await test.step(`5. Locate flight ${data.flightNumber}`, async () => {
      await expect(reservePage.flightRow(data.flightNumber)).toHaveCount(1);
    });

    await test.step(`6. Choose flight ${data.flightNumber}`, async () => {
      await reservePage.chooseFlight(data.flightNumber);
      await expect(purchasePage.heading).toHaveText(data.purchaseHeading);
      await expect(purchasePage.purchaseButton).toBeVisible();
    });

    await test.step('7. Enter passenger details', async () => {
      await purchasePage.fillPassengerDetails(data.passenger);
      await expect(purchasePage.nameInput).toHaveValue(data.passenger.name);
      await expect(purchasePage.addressInput).toHaveValue(data.passenger.address);
      await expect(purchasePage.cityInput).toHaveValue(data.passenger.city);
      await expect(purchasePage.stateInput).toHaveValue(data.passenger.state);
      await expect(purchasePage.zipCodeInput).toHaveValue(data.passenger.zipCode);
    });

    await test.step(`8. Select card type "${data.card.cardTypeLabel}"`, async () => {
      await purchasePage.selectCardType(data.card.cardType);
      await expect(purchasePage.cardTypeSelect).toHaveValue(data.card.cardType);
    });

    await test.step('9. Enter card details', async () => {
      await purchasePage.fillCardDetails(data.card);
      await expect(purchasePage.cardNumberInput).toHaveValue(data.card.cardNumber);
      await expect(purchasePage.monthInput).toHaveValue(data.card.month);
      await expect(purchasePage.yearInput).toHaveValue(data.card.year);
      await expect(purchasePage.nameOnCardInput).toHaveValue(data.card.nameOnCard);
    });

    await test.step(`10. Set "Remember me" to ${data.rememberMe}`, async () => {
      await purchasePage.setRememberMe(data.rememberMe);
      await expect(purchasePage.rememberMeCheckbox).toBeChecked({ checked: data.rememberMe });
    });

    await test.step('11. Click "Purchase Flight"', async () => {
      await purchasePage.purchaseFlight();
      await expect(confirmationPage.heading).toHaveText(data.confirmation.heading);
    });

    await test.step('12. Review the confirmation details', async () => {
      await expect(confirmationPage.detailValue(data.confirmation.statusLabel)).toHaveText(
        data.confirmation.status,
      );
      await expect(confirmationPage.detailValue(data.confirmation.idLabel)).not.toBeEmpty();
      await expect(confirmationPage.detailValue(data.confirmation.cardNumberLabel)).toHaveText(
        new RegExp(data.confirmation.maskedCardPattern),
      );
    });
  });
});
