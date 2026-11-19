# CLAUDE.md — Project Instructions

> **Scope note:** This file is intended for Anthropic-related agents only (Claude Code and its subagents). Any agent that is not Anthropic-related must ignore this file entirely.

## 0. Project Overview

Playwright + TypeScript test automation framework built around the **Page Object Model**,
**data-driven tests**, and **plain-English specs**. The framework is generated and maintained
through the skills in §3 — do not hand-roll files outside that workflow unless asked.

- **Language / runner:** TypeScript, `@playwright/test`
- **Browsers:** chromium, firefox, webkit
- **Config:** `config/.env` (never committed) loaded by `src/utils/config-loader.ts`
- **Remote:** GitHub `origin`, branch `main`
- **Platform:** Windows 11 — shell commands may run in PowerShell 5.1 or Git Bash; use the syntax
  of whichever tool is invoked (no `&&` in PowerShell 5.1).

### Directory layout

```
.
├── .claude/
│   ├── agents/            ← Code-reviewer, test-reviewer (see §5)
│   └── commands/skills/   ← init-framework, new-test, review-tests, heal-and-run, push-to-github
├── codex/AGENTS.md        ← for non-Anthropic agents only — Claude Code must ignore it
├── src/
│   ├── pages/             ← Page Objects: all selectors + page actions (one file per webpage)
│   ├── components/        ← Reusable UI parts (header, footer, modals)
│   └── utils/             ← config-loader, API helpers
├── tests/                 ← *.spec.ts — orchestrate POM methods only
├── specs/                 ← one plain-English .md per test (same base name as the spec file)
├── data/                  ← JSON test inputs (same base name as the spec file)
├── config/                ← .env.example (committed), .env (local only)
└── playwright.config.ts
```

File naming ties the layers together: `specs/<name>.md` ↔ `data/<name>.json` ↔
`tests/<name>.spec.ts`. Page Objects are `src/pages/<Name>Page.ts`.

---

## 1. Install Playwright Dependencies

```bash
npm install
npm install --save-dev dotenv
npx playwright install
npx playwright install-deps
```

> Run once after cloning or when browsers are missing.
> If `package.json` does not exist, the framework has not been scaffolded — run
> `/skills:init-framework <app>` first.

### Environment setup

1. Copy `config/.env.example` → `config/.env` and set real values.
2. Required variables: `BASE_URL`, `TIMEOUT` (> 0, ms), `STEP_DELAY` (ms, default `1000`).
3. Never create, print, or commit a real `config/.env`; only `.env.example` is tracked.

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
| `npx playwright show-report` | Open the last HTML report |
| `npx playwright show-trace <trace.zip>` | Inspect a failed test's trace |

When running tests yourself, prefer `--reporter=list` so failures are readable in the terminal.
Do not run the suite before selectors are verified when using `/skills:heal-and-run` (see that skill's gate).

---

## 3. Skills (Custom Commands)

Use these skills for all test work. Each skill file is the source of truth for its own rules
(selectors, waits, pacing, naming, data handling, directory/file structure, and confirmation
requirements) — do not duplicate those rules here; edit the skill file instead.

| Command | What it does |
|---------|-------------|
| `/skills:init-framework <name>` | Scaffold the full project structure and base files |
| `/skills:new-test <name>` | Full workflow: spec → POM → data → test |
| `/skills:review-tests <path>` | Check files against framework standards (report only) |
| `/skills:heal-and-run <test>` | Verify **all** selectors against the live app first; only when every selector is found, run the tests, triage, fix, re-run |
| `/skills:push-to-github` | Commit and push the current framework state to the GitHub repo |

Skills are defined in `.claude/commands/skills/`.

### Standard workflow

1. New project → `/skills:init-framework <app>`
2. New scenario → `/skills:new-test <name>` (spec first, then POM, data, test)
3. Before/after app changes → `/skills:heal-and-run <test>` (verify selectors → run → fix → re-run)
4. Audit only → `/skills:review-tests <path>`
5. Publish → `/skills:push-to-github` (runs automatically at the end of steps 1 and 3)

If a request maps to one of these skills, invoke the skill rather than doing the work ad hoc.

### Publishing

`/skills:push-to-github` runs automatically as the final step of `/skills:init-framework` (after
successful scaffolding) and `/skills:heal-and-run` (after a successful test run) — see those
skill files for the exact conditions. It is pre-authorized to `git add`, `commit`, and `push` in
this repo without asking for confirmation each time; it does not create a repo/remote and will
stop and warn instead of committing anything that looks like a secret.

---

## 4. Claude Interaction Rules (Token Efficiency)

- **No explanations unless asked.** Generate code directly.
- **No summaries after edits.** The diff is enough.
- **No repetition of existing code.** Only output new or changed sections.
- **One file at a time.** Do not batch unrelated files in one response.
- **Full file content for new files** — never truncate with `...`.
- **Do NOT read or apply `agents_story.md`** — it is for external agent pipelines only, not Claude Code.
- **Do NOT read or apply `codex/AGENTS.md`** — it is for non-Anthropic agents.
- **Ask only when blocked.** Use sensible defaults from the skills; ask only for missing facts
  you cannot infer (target URL, credentials, which flow to test).

---

## 5. Agents

Subagents are defined in `.claude/agents/`. Use agents only when needed, but the two below
must run automatically at the point noted — do not wait to be asked. Both agents apply their
fixes directly to the file (they have `Edit` access) and report a diff-style summary afterward
— they do not just describe issues and wait for approval.

| Agent | File | Runs automatically after |
|-------|------|---------------------------|
| `Code-reviewer` | `.claude/agents/code_reviewer.md` | Any script/code file is created or edited (POM files, base classes, config, framework scaffolding) |
| `test-reviewer` | `.claude/agents/testreviewer.md` | Any automated test file is created (e.g. via `/skills:new-test`) |

Not triggered by edits to Markdown files (`CLAUDE.md`, skills, agents, `specs/`).

---

## 6. Git Rules

- Work on `main` unless told otherwise; remote is `origin`.
- Commit messages: short imperative subject describing *what changed* (e.g.
  `Add login spec and LoginPage POM`, `Heal ReservePage selectors`).
- Before staging, run `git status --short`. If the working tree contains changes unrelated to
  the current task — especially **deleted framework files** — stage only the task's files and ask
  the user before committing the rest. Never push mass deletions without explicit confirmation.
- If git has no author identity configured, reuse the author of recent commits via
  `git -c user.name=... -c user.email=... commit` — do not change global git config.
- Never force-push, rewrite history, or skip hooks (`--no-verify`) unless explicitly asked.
- Never commit: `config/.env`, `node_modules/`, `test-results/`, `playwright-report/`,
  `blob-report/`, traces, screenshots, or temporary probe files (`_heal_probe.ts`, `_heal_snapshot*.html`).

---

## 7. Safety Rules

- **Selectors in `src/pages/` are never changed without showing a diff and getting approval**
  (except fixes applied by the `Code-reviewer` agent per §5).
- Do not delete or overwrite existing specs, data, POMs, or tests unless asked.
- Probe the live app only in headless mode, read-only — no form submissions that create real
  orders/accounts beyond what the test flow itself does on a demo/test environment.
- Never put credentials or secrets in `data/`, specs, tests, or commit messages; reference them
  through `config/.env`.
- Delete every temporary file you create (probe scripts, HTML snapshots) before finishing.

---

## 8. Troubleshooting

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| `Executable doesn't exist` / browser missing | Browsers not installed | `npx playwright install` |
| `Cannot find module 'dotenv'` | Dev dependency missing | `npm install --save-dev dotenv` |
| `BASE_URL` undefined / navigation to `about:blank` | No `config/.env` | Copy from `config/.env.example` |
| Tests hang with no timeout | `TIMEOUT=0` or blank | Set `TIMEOUT` > 0 in `config/.env` |
| `TimeoutError` / `strict mode violation` | Selector drift | `/skills:heal-and-run <test>` |
| `ts-node` not found (heal probe) | Not installed | `npx ts-node` will prompt; or `npm i -D ts-node` |
| Push rejected | Remote ahead | `git pull --rebase` then push — never force-push |

---

## 9. Definition of Done

A task is complete only when:

1. Files follow the structure in §0 and the rules in the relevant skill.
2. Required reviewer agents (§5) have run and their fixes are applied.
3. Tests touched by the task pass locally (`npx playwright test <file> --reporter=list`), or the
   remaining failures are reported with their error output.
4. Temporary files are removed and nothing from §6's "never commit" list is staged.
5. Changes are pushed when the workflow calls for it (§3 Publishing).
