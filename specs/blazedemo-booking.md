# BlazeDemo Flight Booking — End-to-End

Journey pages (entry → terminal):
1. Home — `/` (choose departure/destination)
2. Reserve — `/reserve.php` (choose a flight)
3. Purchase — `/purchase.php` (passenger and payment details)
4. Confirmation — `/confirmation.php` (purchase receipt)

---

# Book a Flight with Visa (Paris → London)

**Test ID:** TC-blazedemo-booking-01
**Priority:** High
**Type:** Positive

## What We Are Testing
A user can search for flights, choose the first flight, pay with a Visa card and reach the purchase confirmation page.

## Preconditions
- https://blazedemo.com is reachable
- No user session required (anonymous user)

## Test Data
| Field | Value |
|-------|-------|
| Departure / Destination | `data/blazedemo-booking.json` → `visaBooking.route` |
| Passenger details | `data/blazedemo-booking.json` → `visaBooking.passenger` |
| Payment details | `data/blazedemo-booking.json` → `visaBooking.payment` |
| Expected texts | `data/blazedemo-booking.json` → `expected` |

## Steps
| # | Action | Expected Result |
|---|--------|------------------|
| 1 | Open the BlazeDemo home page | Heading "Welcome to the Simple Travel Agency!" is visible |
| 2 | Select departure city "Paris" | Departure dropdown shows "Paris" |
| 3 | Select destination city "London" | Destination dropdown shows "London" |
| 4 | Click "Find Flights" | Reserve page shows "Flights from Paris to London:" and a list of flights |
| 5 | Click "Choose This Flight" on the first flight | Purchase page shows "Your flight from ... has been reserved." |
| 6 | Fill name, address, city, state and zip code | All passenger fields contain the entered values |
| 7 | Select card type "Visa", fill card number, month, year and name on card | All payment fields contain the entered values |
| 8 | Tick "Remember me" | Checkbox is checked |
| 9 | Click "Purchase Flight" | Confirmation page shows "Thank you for your purchase today!" |
| 10 | Read the confirmation details | Status is "PendingCapture" and a non-empty purchase Id is shown |

## Overall Expected Result
The user lands on the confirmation page with a thank-you message, a purchase Id and status "PendingCapture".

## Postconditions
- A demo purchase record is shown on the confirmation page (no persistent data; no cleanup required)

---

# Book a Flight with American Express (Boston → Berlin)

**Test ID:** TC-blazedemo-booking-02
**Priority:** High
**Type:** Positive

## What We Are Testing
A user can book a flight on a different route, choosing a non-first flight and paying with American Express, through to the confirmation page.

## Preconditions
- https://blazedemo.com is reachable
- No user session required (anonymous user)

## Test Data
| Field | Value |
|-------|-------|
| Departure / Destination | `data/blazedemo-booking.json` → `amexBooking.route` |
| Flight to choose (row index) | `data/blazedemo-booking.json` → `amexBooking.flightIndex` |
| Passenger details | `data/blazedemo-booking.json` → `amexBooking.passenger` |
| Payment details | `data/blazedemo-booking.json` → `amexBooking.payment` |
| Expected texts | `data/blazedemo-booking.json` → `expected` |

## Steps
| # | Action | Expected Result |
|---|--------|------------------|
| 1 | Open the BlazeDemo home page | Heading "Welcome to the Simple Travel Agency!" is visible |
| 2 | Select departure city "Boston" | Departure dropdown shows "Boston" |
| 3 | Select destination city "Berlin" | Destination dropdown shows "Berlin" |
| 4 | Click "Find Flights" | Reserve page shows "Flights from Boston to Berlin:" and a list of flights |
| 5 | Click "Choose This Flight" on the third flight | Purchase page shows "Your flight from ... has been reserved." |
| 6 | Fill name, address, city, state and zip code | All passenger fields contain the entered values |
| 7 | Select card type "American Express", fill card number, month, year and name on card | All payment fields contain the entered values |
| 8 | Click "Purchase Flight" (Remember me left unchecked) | Confirmation page shows "Thank you for your purchase today!" |
| 9 | Read the confirmation details | Status is "PendingCapture" and a non-empty purchase Id is shown |

## Overall Expected Result
The user lands on the confirmation page with a thank-you message, a purchase Id and status "PendingCapture".

## Postconditions
- A demo purchase record is shown on the confirmation page (no persistent data; no cleanup required)
