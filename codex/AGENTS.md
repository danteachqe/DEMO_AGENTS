# AGENTS.md — Project Instructions

<!-- Codex-only: this file is for Codex CLI. Not read or applied by Claude Code. -->

## 1. Install Playwright Dependencies

```bash
npm install
npm install --save-dev dotenv
npx playwright install
npx playwright install-deps
```

> Run once after cloning or when browsers are missing.

---

## 2. Run Tests

| Command | Description |
|---------|-------------|
| `npx playwright test` | Run all tests |
| `npx playwright test tests/login.spec.ts` | Run a single file |
| `npx playwright test --grep "keyword"` | Run by test name |
| `npx playwright test --project=chromium` | Run on a specific browser |
| `npx playwright test --headed` | Run with visible browser |
| `npx playwright test --ui` | Open interactive UI mode |
| `npx playwright test --reporter=html` | Generate HTML report |

---

## 3. Skills

Use these skills for all test work. Each `SKILL.md` file is the source of truth for its own rules
(selectors, waits, pacing, naming, data handling, directory/file structure, and confirmation
requirements) — do not duplicate those rules here; edit the skill file instead.

| Skill | What it does |
|-------|--------------|
| `init-framework` | Scaffold the full project structure and base files |
| `new-test` | Full workflow: spec → POM → data → test |
| `review-tests` | Check files against framework standards |
| `heal-and-run` | Verify selectors against the live app, then run tests, detect discrepancies, fix POM, re-run |

Skills live in `.codex/skills/<name>/SKILL.md`. Invoke one explicitly with `$<name>` (e.g. `$new-test`),
or let it trigger implicitly when a request matches its description.

---

## 4. Page Object Architecture

- Create exactly one Page Object `.ts` file for each distinct application webpage.
- Name each file after its webpage using kebab-case (for example, `home-page.ts`, `reserve-page.ts`, and `purchase-page.ts`).
- A Page Object may contain only the selectors and actions belonging to its own webpage.
- Never combine selectors or actions from multiple webpages into a single Page Object.
- Keep shared navigation, load-state, and pacing behavior in `base-page.ts`; it is the only non-webpage class allowed under `src/pages/`.
- When a test crosses multiple webpages, instantiate and orchestrate each corresponding Page Object in the test.

---

## 5. Agent Interaction Rules (Token Efficiency)

- **No explanations unless asked.** Generate code directly.
- **No summaries after edits.** The diff is enough.
- **No repetition of existing code.** Only output new or changed sections.
- **One file at a time.** Do not batch unrelated files in one response.
- **Do NOT read or apply `agents_story.md`** — it is for external agent pipelines only, not this agent.
