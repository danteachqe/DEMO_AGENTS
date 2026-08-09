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

**Step 4 — Screen for secrets**

List staged files (`git diff --cached --name-only`). If anything looks like a secret or
credential (`.env`, `*.key`, `*.pem`, credentials/service-account files, etc.) and is **not**
already excluded by `.gitignore`, stop, unstage it (`git restore --staged <file>`), and warn the
user instead of committing it.

---

**Step 5 — Commit**

```bash
git commit -m "<concise message describing what changed>"
```

Use a message that reflects the trigger, e.g. `Scaffold Playwright framework` after
`/skills:init-framework`, or `Fix healed selectors after test run` after `/skills:heal-and-run`.

---

**Step 6 — Push**

```bash
git push
```

If the current branch has no upstream yet:

```bash
git push -u origin <current-branch>
```

Report the result: commit hash and push confirmation, or the reason the push was skipped.
