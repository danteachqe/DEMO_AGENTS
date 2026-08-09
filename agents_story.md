# Agent Protocol: Test Case Generation Workflow
Igonore the file called prompt.txt

> **Not for Claude Code.** This file is intended for external agent pipelines only (e.g., LangChain, AutoGen, custom orchestrators). Claude Code must not read or apply these instructions — refer to `automation.md` and `tests.md` instead.

This protocol defines the step-by-step process an agent must follow when generating test cases from a User Story.

---

## Phase 1: Story Enhancement

- **Action:** Analyze the input User Story and apply industry-standard best practices (INVEST principle).
- **Output:** Rewrite the story to include:
  - "As a [role],"
  - "I want [goal],"
  - "So that [benefit]"
  - Clear technical boundaries.
- **Save to:** `enhanced_story.txt`

---

## Phase 2: Acceptance Criteria (AC)

- **Action:** Generate **5 distinct, measurable** Acceptance Criteria based on the Enhanced Story.
- **Coverage must include:**
  - Functional success scenarios
  - Error handling scenarios
  - Performance limits
- **Save to:** `acceptance_criteria.txt`

---

## Phase 3: Test Case Construction

- **Action:** Create **5 detailed test cases** derived from the Acceptance Criteria.
- **Required format for each test case:**

| Field | Description |
|-------|-------------|
| **ID** | Unique identifier (e.g., `TC-001`) |
| **Title** | Short descriptive name |
| **Pre-conditions** | State of the system before the test |
| **Steps** | Numbered action steps |
| **Expected Result** | Observable outcome that confirms pass/fail |

- **Save to:** `test_cases.txt`

---

## Phase 4: Plain English Spec Files

- **Action:** For each test case, generate a plain English spec file to be saved in `specs/`.
- **Naming convention:** Match the intended test script filename (e.g., `specs/login.md` for `tests/login.spec.ts`).
- **Required format for each spec file:**

```markdown
# [Test Script Name]

## What We Are Testing
[One or two sentences describing the feature or behaviour under test.]

## Test Data
| Field | Value |
|-------|-------|
| [field] | [value or source file path, e.g., data/login.json] |

## Steps
1. [First action in plain English]
2. [Second action]
3. [Continue for each step]

## Expected Result
[What the user should see or what the system should do when the test passes.]
```

- **Save to:** `specs/<test-name>.md`
