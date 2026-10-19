# Book a Flight with Visa (Boston → London)

**Test ID:** TC-book-flight-visa
**Priority:** High
**Type:** Positive

## What We Are Testing
The full flight-booking journey on BlazeDemo: search a route, pick a specific flight, enter passenger and Visa payment details, and reach the purchase confirmation page.

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
| All inputs | data/book-flight-visa.json |
| Departure city | Boston |
| Destination city | London |
| Flight number | 43 |
| Card type | Visa (`visa`) |
| Remember me | false |

## Steps
| # | Action | Expected Result |
|---|--------|------------------|
| 1 | Open the BlazeDemo home page | Heading "Welcome to the Simple Travel Agency!" is visible |
| 2 | Select "Boston" as the departure city | Departure dropdown shows "Boston" |
| 3 | Select "London" as the destination city | Destination dropdown shows "London" |
| 4 | Click "Find Flights" | Reserve page opens with heading "Flights from Boston to London:" |
| 5 | Locate flight number 43 in the results | Exactly one row with flight number 43 is listed |
| 6 | Click "Choose This Flight" on flight 43 | Purchase page opens with the passenger/payment form |
| 7 | Enter passenger name, address, city, state and zip code | Each field contains the entered value |
| 8 | Select "Visa" as the card type | Card type dropdown shows "visa" |
| 9 | Enter card number, expiry month, expiry year and name on card | Each field contains the entered value |
| 10 | Leave "Remember me" unchecked | "Remember me" checkbox is not checked |
| 11 | Click "Purchase Flight" | Confirmation page opens with heading "Thank you for your purchase today!" |
| 12 | Read the "Status" row in the receipt | Status is "PendingCapture" |

## Overall Expected Result
The user completes a booking for flight 43 from Boston to London paid by Visa and sees the "Thank you for your purchase today!" receipt with status "PendingCapture".

## Postconditions
- A demo purchase receipt is displayed; BlazeDemo stores no data, so no cleanup is required
