# Code Review Findings

Review scope: Playwright configuration, page objects, test data, end-to-end tests, and repository hygiene.

Validation performed:

- `npx.cmd tsc --noEmit` — passed.
- `npx.cmd playwright test --list` — passed; 6 tests discovered (2 scenarios across 3 browsers).
- Live end-to-end execution was not performed because it depends on the external BlazeDemo service.

## Findings

### 1. High — Fixed sleeps make the suite unnecessarily slow and can hide synchronization problems

`BasePage.pace()` always calls `page.waitForTimeout(config.stepDelay)`, and nearly every page action invokes it (`src/pages/BasePage.ts:20-23` and the page-object action methods). With the default 1,000 ms delay, each scenario spends several seconds sleeping even though Playwright actions and assertions already auto-wait. Across browsers and scenarios this adds substantial runtime without improving correctness. It can also make an unstable transition appear reliable instead of waiting for a meaningful UI state.

Recommendation: default `STEP_DELAY` to `0` and remove pacing from normal test actions. If demonstrations need visible pacing, use Playwright's `launchOptions.slowMo` in a dedicated headed/demo project or enable the delay only through an explicit demo-mode setting. Wait for observable states (URL, heading, table, enabled control) where synchronization is required.

### 2. Medium — Flight selection is coupled to an unstable row position

`ReservePage.chooseFlight` selects `chooseFlightButtons.nth(index)` (`src/pages/ReservePage.ts:16-20`), while test data stores indices (`data/blazedemo-booking.json:13,35`). A reordered result set can make the test purchase a different flight while still passing, because the suite never verifies the selected airline, flight number, or price on the purchase/confirmation pages.

Recommendation: represent the desired flight using a stable business identifier (for example flight number and airline), locate the row containing that identifier, click its button, and assert that the purchase page displays the same selection. If row position is genuinely the requirement, assert the chosen row's values before clicking and verify them after navigation.

### 3. Medium — The negative `rememberMe` branch is not verified

The Visa scenario checks the checkbox when `rememberMe` is true, but the American Express scenario skips the whole step when it is false (`tests/blazedemo-booking.spec.ts:69-74`). A page defect that checks the box by default would therefore go unnoticed.

Recommendation: always assert the requested state. Either call `setChecked(booking.rememberMe)` and assert `toBeChecked({ checked: booking.rememberMe })`, or add an explicit `not.toBeChecked()` assertion for the false branch.

### 4. Medium — Configuration validation silently accepts unsafe or malformed values

`toNumber` accepts zero and converts an empty string to zero (`src/utils/config-loader.ts:12-15`). Consequently, `TIMEOUT=` becomes a zero test timeout, and negative or malformed values silently fall back rather than identifying a bad configuration. `BASE_URL` is also accepted without URL validation (`src/utils/config-loader.ts:17-20`). These behaviors make configuration mistakes harder to diagnose.

Recommendation: parse only non-empty strings, define whether each value must be positive or merely non-negative, and fail fast with a message naming the invalid variable. Validate `BASE_URL` with `new URL(...)` and restrict protocols if appropriate. Unit-test the parser independently from `process.env`.

### 5. Medium — CI diagnostics and execution policy are underconfigured

The Playwright config specifies only the HTML reporter and trace-on-first-retry (`playwright.config.ts:4-16`), but no retries are configured. Therefore traces are never collected unless retries are supplied externally. There is also no CI guard against accidentally committed `test.only`, and HTML-only output is less useful in CI logs.

Recommendation: make policy environment-aware, for example `forbidOnly: !!process.env.CI`, CI retries, controlled CI workers, and a reporter list containing a console reporter plus HTML. Keep `trace: 'on-first-retry'` once retries are actually enabled, or use `retain-on-failure` when no retries are desired.

### 6. Low — Locators lean on implementation details instead of user-facing semantics

Selectors such as `input[type="submit"][value="Find Flights"]`, raw heading tags, and table structure (`src/pages/HomePage.ts`, `ReservePage.ts`, and `ConfirmationPage.ts`) are more sensitive to harmless markup changes than role-, label-, and accessible-name locators.

Recommendation: prefer `getByRole`, `getByLabel`, and scoped row locators where the application exposes suitable accessible names. This improves both resilience and the suite's implicit accessibility coverage. Keep CSS selectors only where BlazeDemo provides no semantic hook.

### 7. Low — Test-data typing is inferred from one fixture rather than modeled explicitly

`Booking` is defined as `typeof data.visaBooking` (`tests/blazedemo-booking.spec.ts:8`). This happens to accept the second fixture because it currently has the same shape, but it makes one data record the schema authority and gives JSON values broad types such as `string`.

Recommendation: define an explicit `Booking` interface/type, reuse the existing passenger/payment types where appropriate, constrain card types to supported values, and validate imported JSON at runtime if data may be edited independently. This produces clearer errors for missing or invalid fixture fields.

### 8. Low — The human-readable specification appears to contain mojibake

`specs/blazedemo-booking.md` displays sequences such as `â€”` and `â†’` in place of an em dash and arrow. This makes the documentation harder to read and suggests an encoding mismatch in the file or the tooling used to create it.

Recommendation: normalize the file to UTF-8 and replace the corrupted sequences with the intended characters (or plain ASCII equivalents), then enforce UTF-8 via `.editorconfig`.

### 9. Low — Developer quality checks are not exposed as package scripts

`package.json` provides test and report commands but no type-check or combined verification command (`package.json:5-10`). The project currently compiles, but contributors and CI have no obvious standard command to enforce that.

Recommendation: add scripts such as `typecheck`, `test:list`, and `check` (type-check plus the desired test tier). Consider linting/formatting only if the team intends to enforce a shared style.

## Suggested priority

1. Remove fixed pacing from normal runs.
2. Select and verify flights by business identity.
3. Assert both checkbox states.
4. Harden environment parsing and CI configuration.
5. Improve locator semantics, fixture typing, documentation encoding, and developer scripts.

## Positive observations

- Page responsibilities are separated cleanly and the scenario reads as a coherent user journey.
- Assertions remain in the test layer rather than being hidden inside page objects.
- TypeScript strict mode is enabled and the current code passes type checking.
- Test data is externalized and both the first-row and non-first-row paths are represented.
- Generated Playwright artifacts and environment files are appropriately ignored.
