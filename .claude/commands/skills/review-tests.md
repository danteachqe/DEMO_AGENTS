> **Scope note:** This file is intended for Anthropic-related agents only (Claude Code and its subagents). Any agent that is not Anthropic-related must ignore this file entirely.

Review the Playwright test files at: $ARGUMENTS

Check every file against the rules below. Report violations only — no explanations, no summaries.

---

**Structure**

| Check | Rule |
|-------|------|
| Tests | `tests/` files must only call POM methods — no selectors, no `page.locator`, no UI logic |
| Page Objects | `src/pages/` classes must extend `BasePage` |
| Data | Test data must be loaded from `data/` — not hardcoded inline |
| Specs | Every `tests/<name>.spec.ts` must have a matching `specs/<name>.md` |

**Selectors** (POM files only)

- Priority: `data-testid` → `id` → `css`
- Flag any `xpath` usage unless it's the only option
- Flag `new RegExp(` built from interpolated text — must use `BasePage.exactText()`
- Flag `.nth(<data value>)` used to choose a data-driven item — must select by business key

**Test logic**

- Flag `if`/ternary wrapping a `test.step` or `expect` based on test data — steps must run for every data case
- Flag check-only actions (`check()` with no way to uncheck) for boolean controls driven by data; expect `setChecked()` + `toBeChecked({ checked })`
- Flag spec steps (including "left unchecked/off" states) with no matching assertion

**Config** (`playwright.config.ts`, `src/utils/`)

- Flag `trace: 'on-first-retry'` when `retries` is unset or `0`
- Flag numeric env parsing that turns a blank value into `0` (e.g. bare `Number(value)`), or allows `TIMEOUT=0`

**Waits**

- Only `waitFor*` methods allowed
- Flag any `sleep`, `setTimeout`, or hardcoded numeric delays

**Naming**

- Classes: PascalCase
- Methods and variables: camelCase
- Files: kebab-case

---

Output format — one line per violation:

```
[file]:[line] — [rule violated]
```

If no violations are found, output: `All checks passed.`
