# Phase 1 — AI Build / Revision Workflow

## Purpose

This folder is the controlled handoff loop for building and revising the website for **Phase 1**.

The Phase 1 workbook has already been converted into the Markdown documentation in this folder. The files under **ChatGPT Prompt** are the actual instructions to be given to Google AI for implementation.

The workflow is:

**Phase workbook/documentation → ChatGPT Prompt → Google AI Build/Revision → Google AI Report → ChatGPT Feedback → next ChatGPT Prompt (only if revision is required)**

---

## Folder Structure

```
Phase-1/
├── Instructions.md
├── ChatGPT Prompt/
│   ├── README.md
│   └── Prompt-001.md
├── Google AI Reply-Report/
│   └── README.md
└── ChatGPT Feedback/
    └── README.md
```

After each execution cycle, create a **new separate Markdown file**. Never overwrite an earlier prompt, report, or feedback file.

Example:

```
ChatGPT Prompt/
├── README.md
├── Prompt-001.md
├── Prompt-002.md
└── Prompt-003.md

Google AI Reply-Report/
├── README.md
├── Report-001.md
└── Report-002.md

ChatGPT Feedback/
├── README.md
├── Feedback-001.md
└── Feedback-002.md
```

The cycle number must correspond to the same execution cycle:

- Prompt-001 → Report-001 → Feedback-001
- Prompt-002 → Report-002 → Feedback-002
- etc.

---

# 1. ChatGPT Prompt Folder

## Purpose

This folder contains the implementation instructions generated from the Phase 1 workbook/documentation.

Each prompt must tell Google AI exactly what needs to be built, revised, tested, or verified.

The prompt must be grounded in the Phase 1 documentation already present in this repository.

Do not silently invent requirements.

If a requirement is ambiguous, identify it explicitly rather than making an unsupported assumption.

## When to create a new prompt

Create a new `Prompt-NNN.md` when:

1. Phase 1 work has not yet been implemented.
2. The previous Google AI report shows that required work remains.
3. ChatGPT feedback identifies a defect or missing requirement.
4. A previous implementation needs revision.
5. A test failed and a corrective implementation is required.

Do not create another prompt merely because the previous report says everything passed.

---

# 2. Google AI Reply-Report Folder

## Purpose

Google AI uses the current prompt to perform the requested build/revision work.

When Google AI finishes, its response/report must be placed here as a new:

`Report-NNN.md`

The report must accurately describe what Google AI actually did.

At minimum, the report should contain:

- Work completed
- Files/configuration changed
- Google services created or modified
- Tests performed
- Test results
- Any limitations
- Any errors
- Any actions requiring human assistance
- Any items not completed
- Recommended next action, if applicable

Do not claim something was implemented if Google AI did not actually implement it.

---

# 3. ChatGPT Feedback Folder

## Purpose

ChatGPT reviews the corresponding Google AI report against the Phase 1 requirements and previous implementation state.

After reviewing `Report-NNN.md`, create:

`Feedback-NNN.md`

The feedback should determine whether the implementation is:

- **PASS** — Phase 1 requirements covered and no revision is required.
- **REVISION REQUIRED** — specific implementation changes are required.
- **HUMAN ACTION REQUIRED** — Google AI cannot continue without a human action.
- **BLOCKED** — required information, access, service capability, or prerequisite is unavailable.

The feedback must be factual and tied to the documented Phase 1 requirements.

---

# 4. Human Assistance / Stop Rule

Google AI must **STOP and ask the user for assistance** whenever progress requires an action that only the user can reasonably perform.

Examples include:

- API keys
- OAuth approval
- authentication
- account authorization
- Google account permission changes
- ownership transfer
- access to a private resource
- creating or enabling a service that requires the user's confirmation
- entering a secret or credential
- configuring something that cannot be completed through the available authorized actions
- any other required human-only action

Google AI must clearly state:

1. What action is required.
2. Why it is required.
3. Exactly what the user needs to do.
4. What should be provided back to Google AI after the action is completed.

**Never invent, expose, or request unnecessary secrets.**

If human assistance is required, Google AI must not pretend the implementation is complete.

---

# 5. Continue Automatically When Human Assistance Is NOT Required

If Google AI has everything necessary to continue, it should complete the requested implementation/revision without stopping merely to ask for confirmation.

It should:

1. Read the relevant Phase 1 documentation.
2. Read the current implementation/state.
3. Implement the requested work.
4. Test the result.
5. Correct issues it can correct itself.
6. Re-test.
7. Produce a complete report.
8. Stop only when the work is complete or genuine human assistance is required.

Do not ask the user unnecessary questions when the required information is already available.

---

# 6. ChatGPT Review Loop

After Google AI produces a report:

### Step A — ChatGPT reads the report

Read the corresponding `Report-NNN.md`.

### Step B — Compare against Phase 1

Check the implementation against:

- Phase 1 workbook-derived Markdown
- Phase 1 build requirements
- Phase 1 acceptance criteria
- relevant previous prompts
- relevant previous reports
- relevant previous feedback

### Step C — Produce feedback

Create `ChatGPT Feedback/Feedback-NNN.md`.

### Step D — Decide the next action

If everything required is complete:

**PASS — no new prompt required.**

If changes are required:

Create a new `ChatGPT Prompt/Prompt-(NNN+1).md`.

The new prompt must contain only the work necessary to move the implementation toward completion, while retaining all still-valid requirements.

If human assistance is required:

**HUMAN ACTION REQUIRED.**

Do not generate a misleading implementation prompt that assumes the missing human action has already happened.

---

# 7. Never Overwrite History

Every execution cycle is historical evidence.

Never overwrite:

- an old prompt
- an old Google AI report
- old ChatGPT feedback

Always create a new numbered Markdown file.

This creates a complete audit trail of:

```
Requirement
   ↓
Prompt
   ↓
Implementation
   ↓
Report
   ↓
Review
   ↓
Revision Prompt
   ↓
Implementation
   ↓
Report
   ↓
Review
```

---

# 8. Prompt Quality Rules

Every implementation prompt should:

- identify the Phase
- identify the exact objective
- reference the relevant repository/documentation
- state the expected result
- state what must be tested
- preserve existing working functionality
- avoid unnecessary rewrites
- avoid introducing paid services
- avoid introducing unsupported architecture
- avoid changing unrelated phases
- explicitly state when human assistance is required
- require a final implementation report

For this project, the agreed zero-additional-cost architecture must be respected unless the user explicitly changes that requirement.

---

# 9. Report Quality Rules

Every Google AI report should distinguish:

### Completed
What was actually implemented.

### Tested
What was actually tested and the result.

### Not completed
What remains.

### Human action required
Anything Google AI could not complete without the user.

### Risks / limitations
Anything that could affect acceptance.

### Next action
Only if another implementation step is genuinely required.

---

# 10. Feedback Quality Rules

ChatGPT feedback must not simply say "looks good."

It must verify the actual requirements.

For every important requirement, identify one of:

- PASS
- FAIL
- PARTIAL
- NOT TESTED
- BLOCKED
- HUMAN ACTION REQUIRED

If revision is required, state:

- exact issue
- affected requirement
- evidence from the report
- required correction
- required verification

---

# 11. Relationship Between the Three Folders

The folders are intentionally separated:

### ChatGPT Prompt
**What Google AI is instructed to do.**

### Google AI Reply-Report
**What Google AI says it actually did.**

### ChatGPT Feedback
**What ChatGPT determines should happen next.**

This separation must be maintained throughout the project.

---

# 12. Completion Rule

Phase 1 is complete only when:

1. All applicable Phase 1 requirements are implemented.
2. Required tests pass.
3. Required permissions are verified.
4. No unresolved business-blocking defect remains.
5. No unresolved critical access/security defect remains.
6. The implementation remains within the agreed architecture and cost constraints.
7. ChatGPT Feedback records a final **PASS**.
8. No further revision prompt is required.

When these conditions are met, stop the Phase 1 loop.

Do not generate unnecessary additional prompts.

---

# 13. General Rule for Future Phases

The same three-folder workflow can be applied independently to Phase 2, Phase 3, Phase 4, and Phase 5.

Each phase must keep its own prompt/report/feedback history.

Do not mix implementation instructions or reports between phases unless a prompt explicitly requires cross-phase verification.

---

## Final Operating Principle

**ChatGPT defines and reviews. Google AI implements and reports. The user intervenes only when a genuine human-only action is required.**

If Google AI can complete the task without human intervention, it should continue until completion.

If Google AI cannot continue without human intervention, it must stop and clearly ask for that intervention.

Every cycle must leave a permanent Markdown record.
