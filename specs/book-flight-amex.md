# Book Flight Philadelphia to Berlin with American Express

**Test ID:** TC-book-flight-amex
**Priority:** High
**Type:** Positive

## What We Are Testing
A guest can search for a flight on a different route, choose a specific flight, pay with an American Express card while opting into "Remember me", and reach the purchase confirmation page.

## Preconditions
- BlazeDemo (https://blazedemo.com) is reachable
- No login required

## Pages in the Journey
1. Home (`/`) → 2. Reserve (`/reserve.php`) → 3. Purchase (`/purchase.php`) → 4. Confirmation (`/confirmation.php`)

## Test Data
| Field | Value |
|-------|-------|
| All inputs | data/book-flight-amex.json |
| Departure / Destination | Philadelphia / Berlin |
| Flight number | 234 |
| Card type | amex |
| Remember me | true |

## Steps
| # | Action | Expected Result |
|---|--------|------------------|
| 1 | Open the home page | Heading "Welcome to the Simple Travel Agency!" is visible |
| 2 | Select departure city "Philadelphia" | Departure dropdown shows "Philadelphia" |
| 3 | Select destination city "Berlin" | Destination dropdown shows "Berlin" |
| 4 | Click "Find Flights" | Reserve page opens with heading "Flights from Philadelphia to Berlin:" |
| 5 | Locate flight number 234 in the results | Exactly one row with flight number 234 exists |
| 6 | Click "Choose This Flight" on flight 234 | Purchase page opens with the purchase form visible |
| 7 | Fill passenger name, address, city, state, zip code | Each field contains the entered value |
| 8 | Select card type "American Express" | Card Type dropdown shows "amex" |
| 9 | Fill card number, month, year, name on card | Each field contains the entered value |
| 10 | Check "Remember me" | Checkbox is checked |
| 11 | Click "Purchase Flight" | Confirmation page opens with heading "Thank you for your purchase today!" |
| 12 | Review the receipt | Status is "PendingCapture" and an Id is shown |

## Overall Expected Result
The user lands on the confirmation page with a thank-you message and a receipt showing a purchase Id and status "PendingCapture".

## Postconditions
- No cleanup required (BlazeDemo is a stateless demo site)
