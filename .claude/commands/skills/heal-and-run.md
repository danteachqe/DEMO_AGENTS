---
description: Verify every POM selector against the live app FIRST, heal drift, and only then run the Playwright tests
---

> **Scope note:** This file is intended for Anthropic-related agents only (Claude Code and its subagents). Any agent that is not Anthropic-related must ignore this file entirely.

Verify selectors, heal them, and only then run Playwright tests for: $ARGUMENTS

Follow these steps strictly in order. Do not skip, reorder, or merge steps.

> ⛔ **HARD GATE:** Do NOT run `npx playwright test` (in any form) until Step 1 has finished
> and printed the **Selector Verification Report** with every selector marked `FOUND`.
> Running the tests to "see what fails" is NOT a substitute for Step 1.

---

**Step 0 — Pre-check**

Does `src/pages/` already contain POM file(s) for `$ARGUMENTS` (or any POM files at all, if the
target is the whole suite)? If nothing exists yet, **stop.** Do not probe the live app and do not
run tests. Tell the user to run `/skills:init-framework` and `/skills:new-test` first; this skill
only verifies and fixes tests that already exist.

---

**Step 1 — Verify every selector against the live app (before any test runs)**

1. Read the target test file(s) in `tests/` and list, in order, every POM class and method they use.
2. Read each of those POM files in `src/pages/` and collect **every** locator they define
   (property name, selector string, file, line).
3. Read `config/.env` (or `config/.env.example`) to get `BASE_URL`.
4. Write a temporary probe script `_heal_probe.ts` in the project root that:
   - Launches Chromium with `{ headless: true }`.
   - Walks the **same page flow as the test**, by importing the real POM classes from `src/pages/`
     and calling the same navigation/action methods with the same data from `data/*.json`
     (so later pages — e.g. pages reached only after submitting a form — are actually reached).
   - On **each page, before performing that page's actions**, iterates over every locator of
     that page's POM and records `await locator.count()` (no clicks, no assertions that could throw).
   - If a navigation/action step itself fails, records which locator broke and stops walking
     (pages after that point are reported as `NOT REACHED`).
   - Also saves `page.content()` per page to `_heal_snapshot_<PageName>.html` for diagnosis.
   - Prints a JSON result: `[{ page, property, selector, count }]`, then closes the browser.
5. Run it:
   ```bash
   npx ts-node _heal_probe.ts
   ```
6. Print the **Selector Verification Report**:
   ```
   | Page         | Property     | Selector              | Count | Status      |
   |--------------|--------------|-----------------------|-------|-------------|
   | HomePage     | findFlights  | input[type="submit"]  | 1     | FOUND       |
   | ReservePage  | chooseBtn    | #choose               | 0     | MISSING     |
   | PurchasePage | ...          | ...                   | -     | NOT REACHED |
   ```
   - `count === 1` → `FOUND`
   - `count === 0` → `MISSING`
   - `count > 1` → `AMBIGUOUS` (would cause a strict-mode violation; treat as broken)
7. For every `MISSING` / `AMBIGUOUS` selector, search the matching `_heal_snapshot_<PageName>.html`
   for the intended element and pick a replacement using priority: `data-testid` → `id` → `css`
   (no xpath unless unavoidable).
8. Show a diff for every proposed change:
   ```
   File: src/pages/LoginPage.ts  line N
   - this.submitBtn = page.locator('[data-testid="submit"]');
   + this.submitBtn = page.locator('[data-testid="login-submit"]');
   ```
   Wait for user approval, then apply. Do not modify any file in `src/pages/` without explicit confirmation.
9. After applying fixes, **re-run the probe** (go back to step 4) until every selector — including
   any previously `NOT REACHED` pages — is `FOUND`. Maximum 3 probe cycles.
10. Delete `_heal_probe.ts` and all `_heal_snapshot_*.html` files.
11. Gate decision:
    - All selectors `FOUND` → print `Selectors verified — all N selectors found.` and continue to Step 2.
    - Any selector still not `FOUND` (fix declined, no replacement found, or 3 cycles exhausted) →
      **stop. Do not run the tests.** Report the unresolved selectors and why.

---

**Step 2 — Run the tests**

Only after Step 1 passed its gate:

```bash
npx playwright test $ARGUMENTS --reporter=list 2>&1
```

If all tests pass, output: `All tests passed.`, then go to Step 4 (Review) and Step 5 (Publish).

---

**Step 3 — Triage failures**

Since selectors were already verified, remaining failures are usually logic, timing, or
state-dependent issues. Classify each:

| Type | Signals | Action |
|------|---------|--------|
| **Locator error** | `TimeoutError`, `strict mode violation`, `locator resolved to N elements`, `element not found` | Eligible for fix (likely a dynamic/state-dependent element) |
| **Logic / assertion error** | Wrong value, wrong URL, unexpected text, failed `expect()` | Report only — do not attempt fix |

For each locator error, inspect the live app as in Step 1 (probe reproducing the exact state),
propose a diff, wait for approval, apply, then re-run once:

```bash
npx playwright test $ARGUMENTS
```

Report final pass/fail count. If tests still fail after this one fix cycle, report remaining
errors and stop — do not loop further.

---

**Step 4 — Review**

If any `src/pages/` file was edited in Step 1 or Step 3, run the `Code-reviewer` agent
(`.claude/agents/code_reviewer.md`) on the changed POM file(s) before finishing.

---

**Step 5 — Publish**

Only if the final test run passed (no remaining failures): run the `/skills:push-to-github` skill
to commit and push. If tests still fail, do not publish — report the remaining errors instead.
