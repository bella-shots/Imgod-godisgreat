# Phase-4 — AI Build / Revision Workflow

## Purpose

This folder is the controlled AI build/revision workflow for **Phase-4**.

The Markdown files in this phase are derived from the corresponding phase workbook and define what needs to be implemented, tested, verified, or revised.

The workflow is:

**Phase documentation → ChatGPT Prompt → Google AI Build/Revision → Google AI Report → ChatGPT Feedback → next Prompt if revision is required**

---

## Folder Structure

```
Phase-4/
├── Instructions.md
├── ChatGPT Prompt/
│   └── README.md
├── Google AI Reply-Report/
│   └── README.md
└── ChatGPT Feedback/
    └── README.md
```

Each execution cycle gets a separate Markdown file.

Example:

```
ChatGPT Prompt/
├── Prompt-001.md
├── Prompt-002.md

Google AI Reply-Report/
├── Report-001.md
├── Report-002.md

ChatGPT Feedback/
├── Feedback-001.md
├── Feedback-002.md
```

The cycle numbers correspond:

- Prompt-001 → Report-001 → Feedback-001
- Prompt-002 → Report-002 → Feedback-002

Never overwrite previous history.

---

# 1. ChatGPT Prompt

The **ChatGPT Prompt** folder contains the actual implementation/revision instructions for Google AI.

Prompts must be generated from the requirements and documentation of **this phase**.

A new prompt is created when:

- the phase has not yet been implemented;
- required work remains;
- a defect or failed test requires correction;
- ChatGPT identifies a missing requirement;
- an existing implementation requires revision.

Do not create a new prompt when the phase has passed and no revision is required.

Do not invent requirements that are not supported by the phase documentation.

---

# 2. Google AI Reply-Report

Google AI executes the current prompt and records what it actually did in a new:

`Report-NNN.md`

The report should include:

- Work completed
- Files/configuration changed
- Google services created or modified
- Tests performed
- Test results
- Limitations
- Errors
- Items not completed
- Human assistance required
- Next action, if genuinely required

The report must describe the actual implementation. It must not claim completion for work that was not completed or tested.

---

# 3. ChatGPT Feedback

ChatGPT reviews the corresponding Google AI report against:

- this phase's workbook-derived documentation;
- this phase's requirements;
- this phase's acceptance criteria;
- previous prompts;
- previous reports;
- previous feedback.

Create a new:

`Feedback-NNN.md`

The feedback should classify requirements as applicable:

- PASS
- FAIL
- PARTIAL
- NOT TESTED
- BLOCKED
- HUMAN ACTION REQUIRED

If revision is required, create the next numbered prompt in **ChatGPT Prompt**.

If everything passes, record **PASS — no new prompt required**.

---

# 4. Human Assistance / Stop Rule

Google AI must **STOP and ask the user for assistance** whenever progress genuinely requires a human-only action.

Examples include:

- API keys
- OAuth approval
- account authorization
- Google account permission changes
- ownership transfer
- access to a private resource
- entering a secret or credential
- required service activation that needs the user's confirmation
- an integration that cannot be completed through the available authorized actions
- any other required human-only action

Google AI must clearly state:

1. What action is required.
2. Why it is required.
3. Exactly what the user needs to do.
4. What should be provided back after the action.

Google AI must not pretend the implementation is complete when a required human action remains.

Do not expose or invent secrets.

---

# 5. Continue Automatically When Possible

If Google AI has everything required to continue, it should continue and complete the work without unnecessarily asking for confirmation.

It should:

1. Read the relevant phase documentation.
2. Inspect the current implementation/state.
3. Implement the requested work.
4. Test it.
5. Fix issues it can fix itself.
6. Re-test.
7. Produce the report.
8. Stop only when complete or when genuine human assistance is required.

---

# 6. ChatGPT Review Loop

After Google AI produces a report:

### Step A — Read the report

Read the corresponding `Report-NNN.md`.

### Step B — Compare against the phase

Check the implementation against the applicable documentation and acceptance criteria for **Phase-4**.

### Step C — Write feedback

Create `ChatGPT Feedback/Feedback-NNN.md`.

### Step D — Determine next action

If complete:

**PASS — no new prompt required.**

If revision is required:

Create the next numbered `ChatGPT Prompt/Prompt-NNN.md`.

The revision prompt must describe the specific remaining work and preserve requirements that are still valid.

If human assistance is required:

**HUMAN ACTION REQUIRED.**

Do not assume the missing action has happened.

---

# 7. Preserve History

Never overwrite:

- previous prompts;
- previous Google AI reports;
- previous ChatGPT feedback.

Every cycle is permanent project history.

The audit trail is:

```
Requirement
   ↓
Prompt
   ↓
Google AI implementation
   ↓
Report
   ↓
ChatGPT review
   ↓
Feedback
   ↓
Revision Prompt (if required)
   ↓
Next implementation cycle
```

---

# 8. Prompt Rules

Every implementation prompt should:

- identify the phase;
- identify the exact objective;
- reference the relevant phase documentation;
- state the expected result;
- state required testing;
- preserve existing working functionality;
- avoid unnecessary rewrites;
- respect the agreed architecture and cost constraints;
- avoid changing unrelated phases;
- identify genuine human-assistance requirements;
- require Google AI to produce a final report.

---

# 9. Report Rules

Every Google AI report should clearly distinguish:

### Completed
What was actually implemented.

### Tested
What was actually tested and the result.

### Not completed
What remains.

### Human action required
What requires the user's intervention.

### Risks / limitations
Anything affecting acceptance.

### Next action
Only if another implementation step is genuinely required.

---

# 10. Feedback Rules

ChatGPT feedback must verify the actual requirements rather than simply saying that the work looks good.

For important requirements, record:

- PASS
- FAIL
- PARTIAL
- NOT TESTED
- BLOCKED
- HUMAN ACTION REQUIRED

For every revision requirement, identify:

- exact issue;
- affected requirement;
- evidence from the Google AI report;
- required correction;
- required verification.

---

# 11. Phase Separation

This workflow belongs specifically to **Phase-4**.

Do not mix prompts, reports, or feedback between phases unless the current phase explicitly requires cross-phase verification.

The five project phases remain:

1. Phase 1 — Google Drive structure
2. Phase 2 — Master Google Site
3. Phase 3 — Google Sheets + Forms
4. Phase 4 — Apps Script automation
5. Phase 5 — Testing + permissions + handover

---

# 12. Completion Rule

This phase is complete only when:

1. Applicable requirements are implemented.
2. Required tests pass.
3. Required permissions are verified where applicable.
4. No unresolved business-blocking defect remains.
5. No unresolved critical access/security defect remains.
6. The implementation remains within the agreed architecture and cost constraints.
7. ChatGPT Feedback records a final **PASS**.
8. No further revision prompt is required.

When these conditions are met, stop the phase loop.

---

## Final Operating Principle

**ChatGPT defines and reviews. Google AI implements and reports. The user intervenes only when a genuine human-only action is required.**

If Google AI can complete the work without human intervention, it should continue until completion.

If Google AI cannot continue without human intervention, it must stop and clearly ask for that intervention.

Every cycle must leave a permanent Markdown record.
