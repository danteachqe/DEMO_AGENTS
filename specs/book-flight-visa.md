# Book Flight Boston to London with Visa

**Test ID:** TC-book-flight-visa
**Priority:** High
**Type:** Positive

## What We Are Testing
A guest can search for a flight, choose a specific flight, pay with a Visa card and reach the purchase confirmation page.

## Preconditions
- BlazeDemo (https://blazedemo.com) is reachable
- No login required

## Pages in the Journey
1. Home (`/`) → 2. Reserve (`/reserve.php`) → 3. Purchase (`/purchase.php`) → 4. Confirmation (`/confirmation.php`)

## Test Data
| Field | Value |
|-------|-------|
| All inputs | data/book-flight-visa.json |
| Departure / Destination | Boston / London |
| Flight number | 43 |
| Card type | visa |
| Remember me | false |

## Steps
| # | Action | Expected Result |
|---|--------|------------------|
| 1 | Open the home page | Heading "Welcome to the Simple Travel Agency!" is visible |
| 2 | Select departure city "Boston" | Departure dropdown shows "Boston" |
| 3 | Select destination city "London" | Destination dropdown shows "London" |
| 4 | Click "Find Flights" | Reserve page opens with heading "Flights from Boston to London:" |
| 5 | Locate flight number 43 in the results | Exactly one row with flight number 43 exists |
| 6 | Click "Choose This Flight" on flight 43 | Purchase page opens with the purchase form visible |
| 7 | Fill passenger name, address, city, state, zip code | Each field contains the entered value |
| 8 | Select card type "Visa" | Card Type dropdown shows "visa" |
| 9 | Fill card number, month, year, name on card | Each field contains the entered value |
| 10 | Leave "Remember me" unchecked | Checkbox is not checked |
| 11 | Click "Purchase Flight" | Confirmation page opens with heading "Thank you for your purchase today!" |
| 12 | Review the receipt | Status is "PendingCapture" and an Id is shown |

## Overall Expected Result
The user lands on the confirmation page with a thank-you message and a receipt showing a purchase Id and status "PendingCapture".

## Postconditions
- No cleanup required (BlazeDemo is a stateless demo site)
