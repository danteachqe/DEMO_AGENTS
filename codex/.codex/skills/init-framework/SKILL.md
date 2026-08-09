---
name: init-framework
description: Use when asked to scaffold a brand-new Playwright test automation framework or project structure from scratch. Not for adding individual tests to an already-scaffolded framework.
---

<!-- Codex-only: this skill is for Codex CLI. Not read or applied by Claude Code. -->

Scaffold a Playwright test automation framework for the project named in the request.

Create the full directory structure and base files below. Provide complete file content — no `...` truncation.

---

## Directory structure to create

```
project/
├── src/
│   ├── pages/       ← UI selectors and page actions
│   ├── components/  ← Reusable UI elements (headers, footers)
│   └── utils/       ← Config loaders, API helpers
├── tests/           ← Test orchestration (POM methods only)
├── specs/           ← Plain English specs (one .md per test)
├── data/            ← JSON / YAML / CSV test inputs
└── config/          ← Environment variables and framework settings
```

---

## Files to generate

### `src/pages/BasePage.ts`
Abstract base class all Page Objects must extend. Include:
- Constructor accepting a Playwright `Page` instance
- A `navigate(path: string)` method
- A `waitForPageLoad()` method using `waitForLoadState`
- A `pace()` method that calls `this.page.waitForTimeout(config.stepDelay)` — call this at the end of every POM action method to add a visible **1000ms** pause between steps

### Page Object files

- Create exactly one Page Object `.ts` file for each distinct application webpage identified in the request.
- Use kebab-case webpage names, such as `home-page.ts`, `reserve-page.ts`, and `purchase-page.ts`.
- Each Page Object must contain only the selectors and actions belonging to that webpage.
- Never create a single Page Object that combines multiple webpages.
- `BasePage.ts` is the only shared, non-webpage class allowed in `src/pages/`.
- Tests that cross multiple webpages must instantiate and orchestrate each corresponding Page Object.

### `src/utils/config-loader.ts`
Utility that loads environment variables from `.env` via `dotenv`. Export a typed `config` object with at least `BASE_URL`, `TIMEOUT`, and `STEP_DELAY`.

### `config/.env.example`
Template with placeholder values for every variable the config loader reads (e.g., `BASE_URL=`, `TIMEOUT=`, `STEP_DELAY=1000`). `STEP_DELAY` must default to `1000` (milliseconds) — this is the pause `pace()` applies between every step. Do **not** create a real `.env` — only the example.

### `playwright.config.ts` (project root)
Standard Playwright config using values from the config loader:
- Projects: chromium, firefox, webkit
- `testDir`: `./tests`
- `use.baseURL` from `BASE_URL`
- `timeout` from `TIMEOUT`
- Reporter: `html`

### `package.json` (if it does not already exist)
Include scripts: `test`, `test:headed`, `test:ui`, `test:report`. Include dev dependencies: `@playwright/test`, `dotenv`, `typescript`.

---

## Architectural rules (enforce in every generated file)

| Principle | Rule |
|-----------|------|
| Decoupling | Tests, POM, and Data stay in separate directories |
| Page Object Model | No selectors or UI logic inside `tests/` |
| One file per webpage | Each distinct webpage has its own Page Object `.ts` file |
| Data-Driven | No hardcoded test data — always load from `data/` |
| Stability | `waitFor*` methods only — no `sleep` or numeric timeouts |
| Pacing | 1000ms wait between every step, via `pace()` / `STEP_DELAY=1000` — not a raw `sleep`/`setTimeout` call |
| Selectors | `data-testid` → `id` → `css` (no xpath unless unavoidable) |
| Base class | Every page class must extend `BasePage` |
