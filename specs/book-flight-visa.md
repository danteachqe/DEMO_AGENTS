# Book a Flight End-to-End with a Visa Card

**Test ID:** TC-book-flight-visa
**Priority:** High
**Type:** Positive

## What We Are Testing
A guest can search for a flight from Boston to London, choose a specific flight by its flight
number, pay with a Visa card, and land on the purchase confirmation page.

## Preconditions
- BlazeDemo (`BASE_URL`) is reachable
- The user is on a fresh browser session (no saved form data)

## Page Journey
Home (`/`) → Reserve (`/reserve.php`) → Purchase (`/purchase.php`) → Confirmation (`/confirmation.php`)

## Test Data
| Field | Value |
|-------|-------|
| Departure city | Boston |
| Destination city | London |
| Flight number | 43 |
| Passenger details, card details | data/book-flight-visa.json |
| Card type | Visa (`visa`) |
| Remember me | false |

## Steps
| # | Action | Expected Result |
|---|--------|------------------|
| 1 | Open the home page | Heading "Welcome to the Simple Travel Agency!" is visible |
| 2 | Select departure city "Boston" | Departure dropdown shows "Boston" |
| 3 | Select destination city "London" | Destination dropdown shows "London" |
| 4 | Click "Find Flights" | Reserve page opens with heading "Flights from Boston to London:" |
| 5 | Locate flight number 43 in the results table | Exactly one row with flight number 43 exists |
| 6 | Click "Choose This Flight" on flight 43 | Purchase page opens showing the (static demo) heading "Your flight from TLV to SFO has been reserved." and the "Purchase Flight" button |
| 7 | Enter name, address, city, state and zip code | Each field shows the entered value |
| 8 | Select card type "Visa" | Card type dropdown shows "Visa" |
| 9 | Enter card number, month, year and name on card | Each field shows the entered value |
| 10 | Leave "Remember me" unchecked | "Remember me" checkbox is not checked |
| 11 | Click "Purchase Flight" | Confirmation page opens with heading "Thank you for your purchase today!" |
| 12 | Review the confirmation details | Status is "PendingCapture", Id is not empty, card number is masked |

## Overall Expected Result
The user sees the "Thank you for your purchase today!" page with a booking Id and status
"PendingCapture".

## Postconditions
- A demo purchase is recorded on the BlazeDemo test site; no cleanup required
