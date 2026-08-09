> **Scope note:** This file is intended for Anthropic-related agents only (Claude Code and its subagents). Any agent that is not Anthropic-related must ignore this file entirely.

Generate a complete Playwright test for: $ARGUMENTS

Follow these steps in order. Do not skip any step.

---

**Step 0 — Spec** → `specs/<name>.md`

Create the spec file first using this exact best-practice test case format:

```
# [Test Name]

**Test ID:** TC-<name>
**Priority:** [High | Medium | Low]
**Type:** [Positive | Negative | Edge Case]

## What We Are Testing
[One or two sentences describing the feature under test.]

## Preconditions
- [System/user state required before the test starts, e.g. "User is registered and logged out"]

## Test Data
| Field | Value |
|-------|-------|
| [field] | [value or data/<name>.json] |

## Steps
| # | Action | Expected Result |
|---|--------|------------------|
| 1 | [Plain English action] | [What should be true immediately after this step] |
| 2 | [Continue for each step] | [...] |

## Overall Expected Result
[What the user sees end-to-end when the test passes.]

## Postconditions
- [State left behind after the test, e.g. "New record exists", "No cleanup required"]
```

- `Priority`: default to `Medium` unless the request implies otherwise (e.g. login/checkout → `High`)
- `Type`: `Positive` for happy-path, `Negative` for invalid input/error handling, `Edge Case` for boundary conditions
- Every row in the `Steps` table must have its own `Expected Result` — do not leave it blank
- If the request calls this an **end-to-end** test: the `Steps` must carry the flow from the
  entry page all the way to the final terminal page of the real user journey (e.g. a
  confirmation/success/receipt page) — never stop at an intermediate page partway through the
  flow. List every page the journey actually passes through before writing the steps table, so
  the scope is fixed up front instead of guessed step-by-step.

---

**Step 1 — POM** → `src/pages/<Name>Page.ts`

- Extend `BasePage`
- Create or reuse exactly one Page Object `.ts` file for each distinct webpage exercised by the test — never combine multiple webpages' selectors/actions into one Page Object
- If the flow crosses multiple webpages (e.g. every multi-page end-to-end flow), create or reuse a separate Page Object for every webpage in that flow — not just the first one or two
- All selectors live here — priority: `data-testid` → `id` → `css` (no xpath unless unavoidable)
- Expose one method per user action
- Call `await this.pace()` at the end of every action method — this must wait **1000ms** (`STEP_DELAY=1000`) between steps
- Ask before modifying existing selectors in `src/pages/`
- After each Page Object file is written, run the `Code-reviewer` agent (`.claude/agents/code_reviewer.md`) on it before continuing to Step 2

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

**Step 4 — Review**

After the test file is written, run the `test-reviewer` agent (`.claude/agents/testreviewer.md`)
on the new spec/test pair before reporting completion.

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
