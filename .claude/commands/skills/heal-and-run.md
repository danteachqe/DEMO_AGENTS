> **Scope note:** This file is intended for Anthropic-related agents only (Claude Code and its subagents). Any agent that is not Anthropic-related must ignore this file entirely.

Run Playwright tests and auto-fix locator discrepancies for: $ARGUMENTS

Follow these steps in order. Do not skip any step.

---

**Step 1 — Verify selectors against the live app (self-heal before running anything)**

First check: does `src/pages/` already contain POM file(s) for `$ARGUMENTS` (or any POM files at all,
if the target is the whole suite)? If nothing exists yet — this is a brand-new project with no
tests to heal — **skip this entire step and stop.** Do not fetch or probe the live app. Tell the
user to run `/skills:init-framework` and `/skills:new-test` first; this skill only verifies and
fixes tests that already exist.

Otherwise, before any test is executed, confirm every selector used by the POM files under test still matches the current UI.

1. Identify which POM files in `src/pages/` are exercised by `$ARGUMENTS` (or all POM files if the target is the whole suite).
2. Read `config/.env` (or `config/.env.example`) to get `BASE_URL`.
3. For each relevant page:
   - Write a temporary Playwright script at `_heal_probe.ts` that launches a browser with `{ headless: true }`, navigates to the page, calls `page.content()`, writes the HTML to `_heal_snapshot.html`, then closes the browser.
   - Run it: `npx ts-node _heal_probe.ts`
   - Read `_heal_snapshot.html` and check every selector defined in that page's POM against the live markup:
     - `data-testid` selectors → confirm the same `data-testid` exists on an element of the same type
     - `id` selectors → confirm the same `id` exists
     - CSS selectors → confirm the same class/structure still exists
   - Delete `_heal_probe.ts` and `_heal_snapshot.html` after use
4. For any selector that no longer matches, identify the correct replacement using priority: `data-testid` → `id` → `css` (no xpath unless unavoidable).
5. Show a diff for every proposed change before applying:
   ```
   File: src/pages/LoginPage.ts  line N
   - this.submitBtn = page.locator('[data-testid="submit"]');
   + this.submitBtn = page.locator('[data-testid="login-submit"]');
   ```
   Wait for user approval, then apply each edit. Do not modify any file in `src/pages/` without explicit confirmation.
6. If all selectors already match, report `Selectors verified — no drift detected.` and continue.

---

**Step 2 — Run the tests**

Only after Step 1 is complete:

```bash
npx playwright test $ARGUMENTS --reporter=list 2>&1
```

If all tests pass, output: `All tests passed. No fixes needed.`, run the
`/skills:push-to-github` skill to publish the current state, then stop.

---

**Step 3 — Triage failures**

For each failure, classify it:

| Type | Signals | Action |
|------|---------|--------|
| **Locator error** | `TimeoutError`, `strict mode violation`, `locator resolved to N elements`, `element not found` | Eligible for auto-fix |
| **Logic / assertion error** | Wrong value, wrong URL, unexpected text, failed `expect()` | Report only — do not attempt fix |

For each locator error, extract:
- The exact selector string that failed (from the error log)
- The POM file and method where it is defined — search `src/pages/` for the selector string

---

**Step 4 — Inspect the live app**

For each failed locator not already resolved in Step 1 (e.g. dynamic/state-dependent elements):

1. Read `config/.env` (or `config/.env.example`) to get `BASE_URL`
2. Write a temporary Playwright script at `_heal_probe.ts` that:
   - Launches a browser with `{ headless: true }`
   - Navigates to the relevant page (use the test's `beforeEach` URL as reference)
   - Reproduces any state needed to reveal the element (e.g. prior interactions)
   - Calls `page.content()` and writes the HTML to `_heal_snapshot.html`
   - Closes the browser
3. Run the script:
   ```bash
   npx ts-node _heal_probe.ts
   ```
4. Read `_heal_snapshot.html` and search for elements similar to the failed selector:
   - If the selector used `data-testid`, search for `data-testid` attributes on the same element type
   - If the selector used `id`, search for `id` attributes on the same element type
   - If the selector used a CSS class, search for the same element with its current class names
5. Identify the correct replacement using priority: `data-testid` → `id` → `css` (no xpath unless unavoidable)
6. Delete `_heal_probe.ts` and `_heal_snapshot.html` after use

---

**Step 5 — Confirm and fix**

Show a diff for every proposed change before applying:

```
File: src/pages/LoginPage.ts  line N
- this.submitBtn = page.locator('[data-testid="submit"]');
+ this.submitBtn = page.locator('[data-testid="login-submit"]');
```

Wait for user approval, then apply each edit to the POM file.
Do not modify any file in `src/pages/` without explicit confirmation.

---

**Step 6 — Re-run**

After all approved fixes are applied:

```bash
npx playwright test $ARGUMENTS
```

Report final pass/fail count.
If tests still fail after one fix cycle, report remaining errors and stop — do not loop further.

---

**Step 7 — Review**

If any `src/pages/` file was edited in Step 1 or Step 5, run the `Code-reviewer` agent
(`.claude/agents/code_reviewer.md`) on the changed POM file(s) before finishing.

---

**Step 8 — Publish**

Only if Step 6's re-run passed (no remaining failures): run the `/skills:push-to-github` skill
to commit and push the healed fixes. If tests still failed after the fix cycle, do not publish —
report the remaining errors instead, per Step 6.
