---
name: review-tests
description: Use when asked to review existing Playwright test files or directories against framework standards (structure, selectors, waits, naming) and report violations. Not for automatically fixing them.
---

<!-- Codex-only: this skill is for Codex CLI. Not read or applied by Claude Code. -->

Review the Playwright test files at the path named in the request.

Check every file against the rules below. Report violations only — no explanations, no summaries.

---

**Structure**

| Check | Rule |
|-------|------|
| Tests | `tests/` files must only call POM methods — no selectors, no `page.locator`, no UI logic |
| Page Objects | `src/pages/` classes must extend `BasePage` |
| Page boundaries | Each distinct webpage must have exactly one Page Object `.ts` file; flag files combining multiple webpages |
| Data | Test data must be loaded from `data/` — not hardcoded inline |
| Specs | Every `tests/<name>.spec.ts` must have a matching `specs/<name>.md` |

**Selectors** (POM files only)

- Priority: `data-testid` → `id` → `css`
- Flag any `xpath` usage unless it's the only option

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
