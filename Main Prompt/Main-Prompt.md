# Main Prompt — Master Repository Controller

## Purpose

This file is the **entry point for any AI agent imported into this GitHub repository**.

When this repository is imported into Google AI Studio or another AI development environment, this file must be read **before any implementation, modification, deletion, refactoring, generation, or execution of project work**.

This file does not replace the phase-specific prompts.

It tells the AI how to determine the correct phase, locate the authoritative prompt, follow the repository's control system, avoid improvisation, and execute only authorized work.

---

# 1. FIRST ACTION — STOP AND READ

Immediately after repository import:

**DO NOT CODE.**

**DO NOT CREATE AN APPLICATION.**

**DO NOT MODIFY FILES.**

**DO NOT DELETE FILES.**

**DO NOT "IMPROVE" THE ARCHITECTURE.**

First read, in this order:

1. `Main Prompt/Main-Prompt.md`
2. `agents.md`
3. `context/project-overview.md`
4. `context/architecture-context.md`
5. `context/code-standards.md`
6. `context/ai-workflow-rules.md`
7. `context/ui-context.md`
8. `context/progress-tracker.md`
9. The currently active feature specification identified by the progress tracker.
10. The authoritative `ChatGPT Prompt/Prompt-NNN.md` for the currently active phase/feature.
11. The supporting documentation referenced by that prompt.

The repository is the controlling project context.

Do not rely on previous chat history when the required information is available in the repository.

---

# 2. DETERMINE THE CURRENT PHASE — DO NOT ASSUME IT

Never assume that Phase 1 is still active merely because this Main Prompt exists.

Read:

`context/progress-tracker.md`

Determine:

- current project state
- completed features
- active feature
- blocked features
- next authorized work

Then inspect the corresponding phase folder.

For example:

`Phase-1/ChatGPT Prompt/`

or

`Phase-2/ChatGPT Prompt/`

or

`Phase-3/ChatGPT Prompt/`

etc.

### Prompt-selection rule

Select the prompt according to the repository's **current progress state**, not according to:

- the newest file you happen to notice
- the largest file
- the first file returned by a search
- your own interpretation
- chat history
- a prompt from a future phase
- a prompt whose prerequisites are not complete

The correct execution chain is:

`progress-tracker.md`
→ current authorized feature
→ corresponding Phase folder
→ applicable `ChatGPT Prompt/Prompt-NNN.md`
→ supporting specifications
→ implementation

---

# 3. PROMPT VERSION SELECTION

Within the active phase:

1. Inspect the `ChatGPT Prompt/` folder.
2. Identify all available prompt cycles.
3. Read the relevant prompt history if necessary.
4. Determine which prompt is the current authoritative implementation instruction.

The workflow is:

`Prompt-001 → Report-001 → Feedback-001 → Prompt-002 → Report-002 → Feedback-002...`

Never overwrite or silently replace historical prompts.

If a newer prompt exists because ChatGPT issued a revision, follow the newer applicable prompt.

If the latest cycle is a report or feedback rather than an implementation prompt, do not invent a new implementation prompt.

If no authorized implementation prompt exists for the current feature, STOP and report:

**HUMAN/CHATGPT INPUT REQUIRED — NO AUTHORITATIVE IMPLEMENTATION PROMPT**

Do not improvise the missing prompt.

---

# 4. AUTHORITATIVE INSTRUCTION HIERARCHY

When instructions conflict, follow this order:

1. `agents.md`
2. `context/project-overview.md`
3. `context/architecture-context.md`
4. `context/code-standards.md`
5. `context/ai-workflow-rules.md`
6. `context/ui-context.md`
7. `context/progress-tracker.md`
8. Current feature specification
9. Current phase ChatGPT prompt
10. Supporting Phase documentation
11. Existing implementation/code
12. AI's own assumptions

**AI assumptions are the lowest authority.**

If an instruction cannot be resolved from the repository, do not guess.

---

# 5. NO IMPROVISATION RULE

This is a critical project rule.

The AI must **NOT improvise**:

- requirements
- architecture
- business rules
- workflows
- permissions
- database/storage choices
- Google service choices
- user roles
- folder structures
- naming conventions
- acceptance criteria
- phase boundaries
- completion status
- missing prompts
- missing credentials
- missing IDs
- missing verification evidence

If something is not specified, first determine whether it can be resolved from the authoritative repository documents.

If it cannot:

**STOP and identify the ambiguity.**

Do not silently choose an implementation.

### Allowed interpretation

Normal engineering interpretation is allowed only when:

1. the repository clearly specifies the intended behavior,
2. the interpretation does not change architecture or business rules,
3. it does not cross a phase boundary,
4. it does not create a new security/cost dependency,
5. and it can be objectively verified.

Otherwise ask for clarification.

---

# 6. AUTHORITATIVE ARCHITECTURE

The approved architecture is:

**Google Sites + Google Sheets + Google Forms + Google Drive + Google Apps Script**

Responsibilities:

- Google Sites → portal, navigation and presentation
- Google Sheets → authoritative structured operational data
- Google Forms → controlled input/submission
- Google Drive → authoritative files/documents
- Google Apps Script → approved automation, calculations, notifications and reporting

Do NOT replace this architecture with:

- React
- Vite
- Firebase
- Firestore
- localStorage
- PostgreSQL
- Supabase
- custom backend infrastructure
- paid databases
- paid hosting
- paid email APIs
- paid automation platforms
- unnecessary third-party SaaS

unless an explicit architecture decision is added to the repository by the human/ChatGPT workflow.

---

# 7. NEVER REINTRODUCE THE DISCARDED ARCHITECTURE

A previous AI implementation incorrectly created a React/Vite application and used localStorage while jumping across multiple phases.

That implementation was deliberately removed.

Therefore:

**Do not recreate it.**

Do not interpret the existence of old historical documentation mentioning React/Firebase/full visual-builder functionality as authorization to implement those technologies.

Where legacy workbook-derived material conflicts with the revised architecture, follow the revised architecture and the authoritative context documents.

Historical material remains historical unless explicitly promoted to current requirements.

---

# 8. PHASE BOUNDARIES ARE HARD

The project has exactly five phases:

1. Google Drive structure
2. Master Google Site
3. Google Sheets + Forms
4. Apps Script automation
5. Testing + permissions + handover

Do not implement a later phase because:

- it is easy to code,
- its documentation already exists,
- the AI thinks it would be convenient,
- the user originally mentioned the feature,
- or the AI believes it should be done now.

A later phase becomes authorized only when its prerequisite phase has been objectively completed according to the repository's acceptance workflow.

---

# 9. HUMAN-ACTION BOUNDARY

If the next required action needs:

- Google account authorization
- OAuth approval
- access to a private Drive
- ownership change
- permission approval
- credentials
- browser-only configuration
- manual Google UI action
- human confirmation required by the specification
- any other capability unavailable to the AI

STOP.

Report:

### HUMAN ACTION REQUIRED

**Action:**  
Exact action the human must perform.

**Why:**  
Exact reason it cannot be completed by the AI.

**How:**  
Exact steps.

**Return:**  
Exact confirmation, URL, ID, screenshot, result, or other evidence needed.

Do not pretend the action was completed.

Do not mark the feature complete.

Do not manufacture evidence.

---

# 10. DO NOT STOP UNNECESSARILY

The opposite rule is equally important.

If the AI has:

- the required prompt,
- sufficient information,
- required authorized access,
- and the ability to perform the task,

it should continue automatically.

Do not repeatedly ask for confirmation for actions already authorized by the current prompt.

Ask only when:

- a genuine human-only action is required, or
- an unresolved ambiguity materially affects implementation.

---

# 11. REQUIRED DEVELOPMENT LOOP

For every authorized feature:

### READ
Read all required context and the current feature prompt.

### UNDERSTAND
Identify:

- objective
- scope
- dependencies
- constraints
- acceptance criteria
- security requirements
- human-action boundaries

### MARK IN PROGRESS
Update the progress state when the repository workflow requires it.

### PLAN
Create a concise implementation plan.

### IMPLEMENT
Implement only the authorized feature.

### VERIFY
Test the actual behavior against objective acceptance criteria.

### CORRECT
If a focused defect is found, make the smallest root correction.

### RE-VERIFY
Run the affected verification again.

### DOCUMENT
Record:

- actual changes
- actual tests
- actual results
- limitations
- decisions
- human actions
- next authorized work

### STOP
Stop when the feature is complete, blocked, or requires human action.

---

# 12. VERIFICATION MUST BE REAL

Never confuse:

- documentation saying something should exist,
- code that could create something,
- a successful script save,
- a simulated result,
- and actual live verification.

For example:

A script that creates a Drive folder is **not evidence that the folder exists**.

A documented permission rule is **not evidence that the permission was actually tested**.

A generated URL is **not evidence that the resource exists**.

A successful build is **not evidence that the business workflow works**.

Use objective evidence wherever the environment permits it.

If live verification is unavailable, state:

**NOT VERIFIED — HUMAN ACTION REQUIRED**

or the appropriate blocked state.

---

# 13. NO FAKE DATA OR FAKE COMPLETION

Never manufacture:

- Google Drive IDs
- Google Site URLs
- Google Sheet IDs
- Form IDs
- project IDs
- employee records
- permission results
- email delivery results
- automation results
- test accounts
- screenshots
- API responses
- successful execution evidence

Never mark:

- PASS
- COMPLETE
- VERIFIED
- PRODUCTION READY

unless the applicable evidence supports it.

---

# 14. COST CONTROL

The approved target is:

**₹0 additional software/service spend.**

Do not introduce paid:

- Workspace subscriptions
- hosting
- databases
- storage
- email APIs
- automation platforms
- third-party SaaS

Existing Google capabilities may be used within their actual quotas and limitations.

₹0 does not mean unlimited.

Document quota constraints when relevant.

---

# 15. SECURITY

Security must be enforced through actual access controls, not merely through UI visibility.

Protect:

- salary information
- investment information
- restricted Finance data
- restricted HR data
- restricted project information

Do not broadly embed sensitive source Sheets into Google Sites.

Do not make confidential Drive folders public.

Do not grant broad permissions merely to make implementation easier.

---

# 16. GITHUB CHANGE DISCIPLINE

Before changing GitHub:

1. Inspect the current state.
2. Identify the exact files affected.
3. Preserve historical records.
4. Make only authorized changes.
5. Review the resulting diff.
6. Verify no unrelated files changed.
7. Record the actual result.

Never delete:

- prompts
- reports
- feedback
- context
- architecture documentation

just because they are old.

Historical records are part of the project's audit trail.

---

# 17. EXECUTION CYCLE RECORDS

Maintain the separation:

### ChatGPT Prompt
What Google AI is instructed to do.

### Google AI Reply-Report
What Google AI actually did.

### ChatGPT Feedback
What ChatGPT/reviewer determines about that result.

The normal cycle is:

**Prompt-NNN → Report-NNN → Feedback-NNN**

If revision is required:

**Feedback-NNN → Prompt-(NNN+1)**

Never overwrite an earlier cycle.

Do not create ChatGPT feedback yourself unless the current workflow explicitly authorizes it.

Do not create a new implementation prompt yourself to compensate for missing ChatGPT instructions.

---

# 18. COMPLETION RULE

A feature is complete only when:

- required behavior exists,
- acceptance checks pass,
- required live verification is complete,
- security invariants remain intact,
- no unrelated scope was added,
- cost constraints remain satisfied,
- documentation reflects reality,
- progress state is updated,
- and the applicable review workflow accepts the result.

Documentation alone does not make a feature complete.

---

# 19. FIRST RESPONSE AFTER GITHUB IMPORT

After importing this repository, your first response must **NOT** say:

- "I built the app."
- "I created the project."
- "I initialized React."
- "I generated the application."
- "I completed the website."

Instead report:

### Repository Understanding Report

1. Repository state found.
2. Authoritative architecture.
3. Current project phase.
4. Current active feature.
5. Authoritative prompt selected.
6. Prompt cycle/version.
7. Requirements extracted.
8. Dependencies.
9. Explicit out-of-scope items.
10. Human actions required, if any.
11. Planned execution steps.
12. Verification strategy.

Then proceed only if the current prompt and repository workflow authorize implementation without a blocking human action.

---

# 20. FINAL OPERATING PRINCIPLE

The human/ChatGPT workflow defines the system.

Google AI is the implementation agent.

Therefore:

**READ → DETERMINE CURRENT STATE → SELECT AUTHORITATIVE PROMPT → UNDERSTAND → PLAN → IMPLEMENT EXACTLY → VERIFY → CORRECT → RE-VERIFY → DOCUMENT → STOP AT BOUNDARY**

Never:

**IMPORT → GUESS → BUILD AN APP**

The repository already contains the project's architecture, context, specifications, prompts, acceptance criteria and workflow.

Your responsibility is to continue the project faithfully.

**Do not redesign it.**

**Do not improvise it.**

**Do not skip its controls.**

**Do not jump phases.**

**Do not claim what you cannot verify.**

## Google AI Studio Build Mode Entry

When this repository is used in Google AI Studio Build Mode, use `Main Prompt/AI-Studio-Build-Mode-Startup.md` as the first explicit Build Mode prompt. It is a startup/control prompt only; it must produce a Repository Understanding Report and stop before implementation.

