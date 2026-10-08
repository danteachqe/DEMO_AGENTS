> **Scope note:** This file is intended for Anthropic-related agents only (Claude Code and its subagents). Any agent that is not Anthropic-related must ignore this file entirely.

Scaffold a Playwright test automation framework for: $ARGUMENTS

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
- A protected `exactText(text: string): RegExp` helper that regex-escapes `text` and anchors it (`^…$`). Every POM locator built from dynamic text must use it — never interpolate raw strings into `new RegExp(...)`
- A `pace()` method that calls `this.page.waitForTimeout(config.stepDelay)` — call this at the end of every POM action method to add a visible **1000ms** pause between steps

### `src/utils/config-loader.ts`
Utility that loads environment variables from `.env` via `dotenv`. Export a typed `config` object with at least `BASE_URL`, `TIMEOUT`, and `STEP_DELAY`.
- Numeric parsing must treat a missing, blank (`TIMEOUT=`) or non-numeric value as "use the default" — `Number('')` is `0`, so check for blank strings before converting
- `TIMEOUT` must be `> 0` (Playwright treats `0` as "no timeout"); invalid values fall back to the default (`60000`). `STEP_DELAY` may be `0`

### `config/.env.example`
Template with working default values for every variable the config loader reads (e.g., `BASE_URL=https://example.com`, `TIMEOUT=60000`, `STEP_DELAY=1000`) — never leave a value blank. `STEP_DELAY` must default to `1000` (milliseconds) — this is the pause `pace()` applies between every step. Do **not** create a real `.env` — only the example.

### `playwright.config.ts` (project root)
Standard Playwright config using values from the config loader:
- Projects: chromium, firefox, webkit
- `testDir`: `./tests`
- `use.baseURL` from `BASE_URL`
- `timeout` from `TIMEOUT`
- Reporter: `html`
- `use.trace: 'retain-on-failure'` — never `'on-first-retry'` unless `retries` is also set above `0` (with no retries it never records a trace)

### `package.json` (if it does not already exist)
Include scripts: `test`, `test:headed`, `test:ui`, `test:report`. Include dev dependencies: `@playwright/test`, `dotenv`, `typescript`.

---

## Architectural rules (enforce in every generated file)

| Principle | Rule |
|-----------|------|
| Decoupling | Tests, POM, and Data stay in separate directories |
| Page Object Model | No selectors or UI logic inside `tests/` |
| Data-Driven | No hardcoded test data — always load from `data/` |
| Stability | `waitFor*` methods only — no `sleep` or numeric timeouts |
| Pacing | 1000ms wait between every step, via `pace()` / `STEP_DELAY=1000` — not a raw `sleep`/`setTimeout` call |
| Selectors | `data-testid` → `id` → `css` (no xpath unless unavoidable) |
| Base class | Every page class must extend `BasePage` |
| Config | Blank/invalid env values fall back to defaults; `TIMEOUT` is never `0` |
| Debuggability | Failed tests always keep a trace (`retain-on-failure`) |
| Dynamic locators | Text from data goes through `exactText()` — no raw interpolation into `new RegExp(...)` |

---

## Review

After all files above are generated, run the `Code-reviewer` agent
(`.claude/agents/code_reviewer.md`) over the scaffolded scripts (`src/pages/BasePage.ts`,
`src/utils/config-loader.ts`, `playwright.config.ts`) before reporting completion.

---

## Publish

Once the Code-reviewer pass is complete and the scaffold is in a working state, run the
`/skills:push-to-github` skill to commit and push the newly initialized framework. Skip this
step only if `/skills:push-to-github` reports there is no git repository or no remote
configured.
