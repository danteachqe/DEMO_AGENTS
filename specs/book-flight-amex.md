# Book a Flight with American Express (Paris → Rome)

**Test ID:** TC-book-flight-amex
**Priority:** High
**Type:** Positive

## What We Are Testing
The full flight-booking journey on BlazeDemo using a different route, flight, and card type (American Express) with "Remember me" enabled, ending on the purchase confirmation page.

## Preconditions
- BlazeDemo (https://blazedemo.com) is reachable
- Browser starts on a fresh session (no remembered details)

## Journey Pages
1. Home (`/`) — choose departure and destination
2. Reserve (`/reserve.php`) — flight list for the route
3. Purchase (`/purchase.php`) — passenger and payment form
4. Confirmation (`/confirmation.php`) — purchase receipt (terminal page)

## Test Data
| Field | Value |
|-------|-------|
| All inputs | data/book-flight-amex.json |
| Departure city | Paris |
| Destination city | Rome |
| Flight number | 9696 |
| Card type | American Express (`amex`) |
| Remember me | true |

## Steps
| # | Action | Expected Result |
|---|--------|------------------|
| 1 | Open the BlazeDemo home page | Heading "Welcome to the Simple Travel Agency!" is visible |
| 2 | Select "Paris" as the departure city | Departure dropdown shows "Paris" |
| 3 | Select "Rome" as the destination city | Destination dropdown shows "Rome" |
| 4 | Click "Find Flights" | Reserve page opens with heading "Flights from Paris to Rome:" |
| 5 | Locate flight number 9696 in the results | Exactly one row with flight number 9696 is listed |
| 6 | Click "Choose This Flight" on flight 9696 | Purchase page opens with the passenger/payment form |
| 7 | Enter passenger name, address, city, state and zip code | Each field contains the entered value |
| 8 | Select "American Express" as the card type | Card type dropdown shows "amex" |
| 9 | Enter card number, expiry month, expiry year and name on card | Each field contains the entered value |
| 10 | Check "Remember me" | "Remember me" checkbox is checked |
| 11 | Click "Purchase Flight" | Confirmation page opens with heading "Thank you for your purchase today!" |
| 12 | Read the "Status" row in the receipt | Status is "PendingCapture" |

## Overall Expected Result
The user completes a booking for flight 9696 from Paris to Rome paid by American Express, with "Remember me" checked, and sees the "Thank you for your purchase today!" receipt with status "PendingCapture".

## Postconditions
- A demo purchase receipt is displayed; BlazeDemo stores no data, so no cleanup is required
