import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { ReservePage } from '../src/pages/ReservePage';
import { PurchasePage } from '../src/pages/PurchasePage';
import { ConfirmationPage } from '../src/pages/ConfirmationPage';
import data from '../data/blazedemo-booking.json';

type Booking = typeof data.visaBooking;

const bookings: { id: string; title: string; booking: Booking }[] = [
  { id: 'TC-blazedemo-booking-01', title: 'book a flight with Visa', booking: data.visaBooking },
  { id: 'TC-blazedemo-booking-02', title: 'book a flight with American Express', booking: data.amexBooking },
];

test.describe('BlazeDemo flight booking - end-to-end', () => {
  for (const { id, title, booking } of bookings) {
    test(`${id}: ${title} (${booking.route.departure} -> ${booking.route.destination})`, async ({ page }) => {
      const homePage = new HomePage(page);
      const reservePage = new ReservePage(page);
      const purchasePage = new PurchasePage(page);
      const confirmationPage = new ConfirmationPage(page);

      await test.step('Open home page', async () => {
        await homePage.open();
        await expect(homePage.heading).toHaveText(data.expected.homeHeading);
      });

      await test.step('Select departure city', async () => {
        await homePage.selectDeparture(booking.route.departure);
        await expect(homePage.departureSelect).toHaveValue(booking.route.departure);
      });

      await test.step('Select destination city', async () => {
        await homePage.selectDestination(booking.route.destination);
        await expect(homePage.destinationSelect).toHaveValue(booking.route.destination);
      });

      await test.step('Find flights', async () => {
        await homePage.findFlights();
        await expect(reservePage.heading).toContainText(
          `Flights from ${booking.route.departure} to ${booking.route.destination}`,
        );
        await expect(reservePage.flightRows.first()).toBeVisible();
      });

      await test.step('Choose a flight', async () => {
        await reservePage.chooseFlight(booking.flightIndex);
        await expect(purchasePage.heading).toContainText(data.expected.reservedHeadingPattern);
      });

      await test.step('Fill passenger details', async () => {
        await purchasePage.fillPassengerDetails(booking.passenger);
        await expect(purchasePage.nameInput).toHaveValue(booking.passenger.name);
        await expect(purchasePage.addressInput).toHaveValue(booking.passenger.address);
        await expect(purchasePage.cityInput).toHaveValue(booking.passenger.city);
        await expect(purchasePage.stateInput).toHaveValue(booking.passenger.state);
        await expect(purchasePage.zipCodeInput).toHaveValue(booking.passenger.zipCode);
      });

      await test.step('Fill payment details', async () => {
        await purchasePage.fillPaymentDetails(booking.payment);
        await expect(purchasePage.cardTypeSelect).toHaveValue(booking.payment.cardType);
        await expect(purchasePage.cardNumberInput).toHaveValue(booking.payment.cardNumber);
        await expect(purchasePage.cardMonthInput).toHaveValue(booking.payment.cardMonth);
        await expect(purchasePage.cardYearInput).toHaveValue(booking.payment.cardYear);
        await expect(purchasePage.nameOnCardInput).toHaveValue(booking.payment.nameOnCard);
      });

      if (booking.rememberMe) {
        await test.step('Tick "Remember me"', async () => {
          await purchasePage.checkRememberMe();
          await expect(purchasePage.rememberMeCheckbox).toBeChecked();
        });
      }

      await test.step('Purchase flight', async () => {
        await purchasePage.purchaseFlight();
        await confirmationPage.waitForConfirmation();
        await expect(confirmationPage.heading).toHaveText(data.expected.confirmationHeading);
      });

      await test.step('Verify confirmation details', async () => {
        await expect(confirmationPage.status).toHaveText(data.expected.status);
        await expect(confirmationPage.purchaseId).toHaveText(/\S+/);
      });
    });
  }
});
