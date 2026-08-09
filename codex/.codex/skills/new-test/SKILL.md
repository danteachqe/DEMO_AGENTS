---
name: new-test
description: Use when asked to create a complete new Playwright test (spec + POM + data + test file) for a feature. Not for fixing existing tests or scaffolding a whole framework.
---

<!-- Codex-only: this skill is for Codex CLI. Not read or applied by Claude Code. -->

Generate a complete Playwright test for the feature named in the request.

Follow these steps in order. Do not skip any step.

---

**Step 0 — Spec** → `specs/<name>.md`

Create the spec file first using this exact format:

```
# [Test Name]

## What We Are Testing
[One or two sentences describing the feature under test.]

## Test Data
| Field | Value |
|-------|-------|
| [field] | [value or data/<name>.json] |

## Steps
1. [Plain English action]
2. [Continue for each step]

## Expected Result
[What the user sees when the test passes.]
```

If the request calls this an **end-to-end** test: the `Steps` must carry the flow from the entry
page all the way to the final terminal page of the real user journey (e.g. a
confirmation/success/receipt page) — never stop at an intermediate page partway through the flow.
List every page the journey actually passes through before writing the steps, so the scope is
fixed up front instead of guessed step-by-step.

---

**Step 1 — POM** → `src/pages/<Name>Page.ts`

- Extend `BasePage`
- Create or reuse exactly one Page Object `.ts` file for each distinct webpage exercised by the test
- Use kebab-case webpage names, such as `home-page.ts`, `reserve-page.ts`, and `purchase-page.ts`
- Keep only that webpage's selectors and actions in its Page Object; never combine multiple webpages in one file
- If the flow crosses multiple webpages (e.g. every multi-page end-to-end flow), create or reuse a separate Page Object for every webpage in that flow — not just the first one or two
- All selectors live here — priority: `data-testid` → `id` → `css` (no xpath unless unavoidable)
- Expose one method per user action
- Call `await this.pace()` at the end of every action method — this must wait **1000ms** (`STEP_DELAY=1000`) between steps
- Ask before modifying existing selectors in `src/pages/`

---

**Step 2 — Data** → `data/<name>.json`

- JSON object with all test inputs
- No hardcoded values allowed in test files

---

**Step 3 — Test** → `tests/<name>.spec.ts`

- Import every Page Object exercised by the flow from `src/pages/`
- Load data from `data/<name>.json`
- Orchestrate POM methods only — no selectors or UI logic in this file
- Use `waitFor*` methods only — no `sleep` or hardcoded timeouts

---

**Coding standards**

| Item | Convention |
|------|-----------|
| Classes | PascalCase |
| Methods / variables | camelCase |
| Files | kebab-case |
| Page Objects | exactly one `.ts` file per distinct webpage |
| Waits | `waitFor*` only |
| Pacing | 1000ms wait between steps via `pace()` |
| Data | always from `data/` |

Provide full file content for every new file — no `...` truncation.
