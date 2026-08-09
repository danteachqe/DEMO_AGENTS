# CLAUDE.md — Project Instructions

> **Scope note:** This file is intended for Anthropic-related agents only (Claude Code and its subagents). Any agent that is not Anthropic-related must ignore this file entirely.


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

## 3. Skills (Custom Commands)

Use these skills for all test work. Each skill file is the source of truth for its own rules
(selectors, waits, pacing, naming, data handling, directory/file structure, and confirmation
requirements) — do not duplicate those rules here; edit the skill file instead.

| Command | What it does |
|---------|-------------|
| `/skills:init-framework <name>` | Scaffold the full project structure and base files |
| `/skills:new-test <name>` | Full workflow: spec → POM → data → test |
| `/skills:review-tests <path>` | Check files against framework standards |
| `/skills:heal-and-run <test>` | Verify selectors against the live app, then run tests, detect discrepancies, fix POM, re-run |
| `/skills:push-to-github` | Commit and push the current framework state to the GitHub repo |

Skills are defined in `.claude/commands/skills/`.

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
- **Do NOT read or apply `agents_story.md`** — it is for external agent pipelines only, not Claude Code.

## 5. Agents

Subagents are defined in `.claude/agents/`. Use agents only when needed, but the two below
must run automatically at the point noted — do not wait to be asked. Both agents apply their
fixes directly to the file (they have `Edit` access) and report a diff-style summary afterward
— they do not just describe issues and wait for approval.

| Agent | File | Runs automatically after |
|-------|------|---------------------------|
| `Code-reviewer` | `.claude/agents/code_reviewer.md` | Any script/code file is created or edited (POM files, base classes, config, framework scaffolding) |
| `test-reviewer` | `.claude/agents/testreviewer.md` | Any automated test file is created (e.g. via `/skills:new-test`) |