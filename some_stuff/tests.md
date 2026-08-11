# Agent Protocol: Test Case Generation Workflow

## Phase 1: Story Enhancement
- **Action:** Analyze the input User Story and apply industry-standard best practices. Any anbiguities need to be clarifeid based on bast practices
make sure to satisfly all the conditions in the file called DOR.MD
- **Output:** Rewrite the story to include "As a," "I want," and "So that" with clear technical boundaries. Save to `enhanced_story.txt`.

## Phase 2: Acceptance Criteria (AC)
- **Action:** Generate 5 distinct, measurable ACs based on the Enhanced Story.
- **Criteria:** Must cover functional success, error handling, and performance limits. Save to `acceptance_criteria.txt`.

## Phase 3: Test Case Construction
- **Action:** Create 5 detailed test cases derived from the ACs.
- **Format:** ID, Title, Pre-conditions, Steps, Expected Result. Save to `test_cases.txt`.

## Phase 4: Push to github

> **Scope note:** This file is intended for Anthropic-related agents only (Claude Code and its subagents). Any agent that is not Anthropic-related must ignore this file entirely.

Commit and push the current state of the framework to the GitHub repository.

This skill is not normally invoked directly by the user — it runs automatically as the final
step of `/skills:init-framework` (after successful scaffolding) and `/skills:heal-and-run`
(after a successful test run, including a successful heal-and-re-run cycle). It can also be
run manually as `/skills:push-to-github`.

Follow these steps in order. Do not skip any step.

---

**Step 1 — Check for a git repository**

Run `git status`. If this fails with "not a git repository", stop and tell the user to run
`git init` and add a remote first — do not initialize a repository automatically.

---

**Step 2 — Check for a remote**

Run `git remote -v`. If no `origin` remote exists, stop and tell the user no GitHub remote is
configured (`git remote add origin <url>`) — do not add one automatically.

---

**Step 3 — Stage changes**

```bash
git add -A
git status --short
```

If nothing is staged, output `Nothing to publish — working tree already matches last commit.`
and stop.

---

**Step 4 — Code review gate**

List the staged files (`git diff --cached --name-only`) and filter to script/code files — POM
files, base classes, config, framework scaffolding (`.ts`/`.js` under `src/`, `tests/`,
`playwright.config.ts`, etc.), per the file types covered in CLAUDE.md §5.

If that list is non-empty, run the `Code-reviewer` agent (`.claude/agents/code_reviewer.md`) over
those files now — even if a calling skill (e.g. `/skills:init-framework`, `/skills:heal-and-run`)
already ran it earlier in the same flow, since files may have changed since. Code-reviewer applies
its fixes directly.

After it runs, re-check: if Code-reviewer's report leaves any comment unresolved (something it
flagged but did not or could not fix), **stop — do not commit or push.** Show the user the
outstanding comment(s) instead.

If Code-reviewer applied edits, do not trust the last test run to still be valid — the code has
changed since. Re-stage the edits (`git add -A`), then check whether a test suite already exists
(any `*.spec.ts` files under `tests/`). If it does, re-run it before going any further:

```bash
npx playwright test --reporter=list 2>&1
```

If this re-run fails, **stop — do not commit or push.** This is a regression introduced by the
Code-reviewer fix, not the original code — report it as such and tell the user to run
`/skills:heal-and-run` to resolve it, then retry publishing. Do not attempt to fix it here.

Continue to Step 5 only if: Code-reviewer had no comments to begin with, or its edits passed the
re-run above (or there was no test suite yet to re-run).

---

**Step 5 — Screen for secrets**

List staged files (`git diff --cached --name-only`). If anything looks like a secret or
credential (`.env`, `*.key`, `*.pem`, credentials/service-account files, etc.) and is **not**
already excluded by `.gitignore`, stop, unstage it (`git restore --staged <file>`), and warn the
user instead of committing it.

---

**Step 6 — Commit**

```bash
git commit -m "<concise message describing what changed>"
```

Use a message that reflects the trigger, e.g. `Scaffold Playwright framework` after
`/skills:init-framework`, or `Fix healed selectors after test run` after `/skills:heal-and-run`.

---

**Step 7 — Push**

```bash
git push
```

If the current branch has no upstream yet:

```bash
git push -u origin <current-branch>
```

Report the result: commit hash and push confirmation, or the reason the push was skipped.
