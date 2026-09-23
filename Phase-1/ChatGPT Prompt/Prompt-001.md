# Phase 1 — Prompt-001
## Google Drive Structure — Controlled First Implementation

### Execution identity

You are the implementation agent for **Phase 1 of the Master Company Website / Internal Operations Portal**.

Your task in this execution cycle is **ONLY Phase 1: Google Drive Structure**.

Do not begin Phase 2, Phase 3, Phase 4 or Phase 5 implementation.

The objective is to create and verify the authoritative Google Drive foundation that all later phases will use.

---

# 1. AUTHORITATIVE CONTEXT — READ THIS FIRST

Before making any change, read these repository files completely:

1. `agents.md`
2. `context/project-overview.md`
3. `context/architecture-context.md`
4. `context/code-standards.md`
5. `context/ai-workflow-rules.md`
6. `context/ui-context.md`
7. `context/progress-tracker.md`
8. `context/feature-specs/01-google-drive-structure.md`
9. `docs/AI-Ready-App-Building-Playbook.md`
10. `Phase-1/Instructions.md`
11. All relevant Phase 1 documentation, especially:
   - `Phase-1/Revised-Architecture.md`
   - `Phase-1/Architecture-Migration.md`
   - `Phase-1/Zero-Cost-Gate.md`
   - `Phase-1/Phase-1-Build.md`
   - `Phase-1/Phase-1-Folder-Manifest.md`
   - `Phase-1/Phase-1-Acceptance.md`
   - `Phase-1/Requirements-Mapping.md`
   - `Phase-1/Required-Tools.md`
   - `Phase-1/Permissions-Matrix.md`
   - `Phase-1/Open-Questions.md`
   - `Phase-1/Feature-Specs.md`
   - `Phase-1/5-Phase-Master-Plan.md`
   - `Phase-1/Revision-Log.md`

Use the repository context as the controlling project context rather than relying on chat history.

---

# 2. RESOLUTION OF LEGACY DOCUMENT CONTENT

Some older workbook-derived rows in Phase 1 still contain the original React/Firebase/full visual website-builder plan.

Those rows are historical source material and are superseded by the later revised architecture.

For this execution, the following are AUTHORITATIVE:

- `agents.md`
- `context/project-overview.md`
- `context/architecture-context.md`
- `context/ai-workflow-rules.md`
- `context/progress-tracker.md`
- `context/feature-specs/01-google-drive-structure.md`
- `Phase-1/Instructions.md`
- `Phase-1/Revised-Architecture.md`
- `Phase-1/Architecture-Migration.md`
- `Phase-1/Revision-Log.md`
- `Phase-1/Phase-1-Build.md`
- `Phase-1/Phase-1-Folder-Manifest.md`
- `Phase-1/Phase-1-Acceptance.md`

The current architecture is:

**Google Sites + Google Sheets + Google Forms + Google Drive + Google Apps Script**

with ordinary Gmail/Google Accounts as the intended employee access model.

The current five phases are exactly:

1. Google Drive structure
2. Master Google Site
3. Google Sheets + Forms
4. Apps Script automation
5. Testing + permissions + handover

Therefore:

**DO NOT recreate the obsolete React/Vite/Firebase application.**

**DO NOT build a custom visual website builder.**

**DO NOT create Firebase, Firestore, Firebase Storage, Cloud Run, paid database infrastructure, paid email APIs, paid SaaS or any other new paid dependency.**

---

# 3. PLAYBOOK EXECUTION MODEL

Follow the repository's AI-Ready App-Building Playbook.

The required execution loop is:

READ CONTEXT
→ UNDERSTAND SPEC
→ MARK UNIT IN PROGRESS
→ PLAN
→ IMPLEMENT ONLY THE SPECIFIED UNIT
→ VERIFY OBJECTIVELY
→ CORRECT FOCUSED ISSUES
→ RE-VERIFY
→ REPORT ACTUAL RESULT

Do not skip verification.

Do not claim completion merely because a command succeeded.

Do not invent missing requirements.

Do not expand this unit into later phases.

If a requirement cannot be completed because a genuine human-only action is required, STOP and report the exact human action required.

---

# 4. PHASE 1 OBJECTIVE

Create the authoritative Google Drive structure for the Master Company Website.

The root must be:

`MASTER COMPANY`

The required top-level structure is:

```
MASTER COMPANY
├── Projects
├── Finance
├── HR
├── Templates
├── MOM
└── Reports
```

The Drive structure must become the authoritative file foundation for the later phases.

---

# 5. REQUIRED PROJECT STRUCTURE

Create a representative/sample project folder under:

`MASTER COMPANY/Projects/`

Use the documented naming convention:

`PROJECT_<ProjectName>`

If the documentation or current project state provides a specific sample project name, use that name.

If no project name is specified anywhere in the authoritative context, use a clearly identified neutral test/sample project name such as:

`PROJECT_Phase1_Test`

Do NOT invent a real business project.

Inside the sample project create:

```
PROJECT_<ProjectName>
├── 01_Admin
├── 02_Checklist
├── 03_Expenses
├── 04_MOM
├── 05_Notes
├── 06_Files
└── 07_Reports
```

These folders establish the deterministic structure that later phases can use.

Do not create unrelated folders.

---

# 6. ROOT FOLDER OWNERSHIP

The authoritative owner/admin Google account must own/control the `MASTER COMPANY` structure.

Do not transfer ownership of core folders/files to ordinary employees.

Do not make ordinary employees owners of:

- MASTER COMPANY
- Finance
- HR
- Templates master material
- sensitive reports
- sensitive project administration material

If the currently authenticated Google environment does not have the authority required to create or control the root structure, STOP and request the minimum human action needed.

Do not work around the ownership/security boundary.

---

# 7. TOP-LEVEL FOLDER PURPOSES

Create exactly these six required top-level folders.

## 7.1 Projects

Purpose:

- project-specific file foundation
- project folders
- project checklists
- project expense artifacts
- MOM material
- notes
- general project files
- project reports

Default principle:

Admin + authorized project users as needed.

Do not make the entire Projects tree broadly editable by default.

---

## 7.2 Finance

Purpose:

- finance-controlled documents
- financial source material
- expense-related artifacts
- finance reports
- future salary/investment/finance supporting files

This is sensitive.

Default access:

Admin/restricted users only.

Do not broadly share Finance with ordinary employees.

---

## 7.3 HR

Purpose:

- employee/HR documents
- controlled HR records
- future HR-related artifacts

This is sensitive.

Default access:

Admin/authorized HR only.

Do not broadly share HR with ordinary employees.

---

## 7.4 Templates

Purpose:

- reusable master templates
- project setup templates
- checklist templates
- expense templates
- MOM templates
- report templates
- other standard reusable documents

Master templates must be protected from accidental modification by ordinary users.

Default:

Admin edit.

Users may receive view/copy access where later requirements justify it.

Do not create speculative templates that are not supported by the documented requirements.

If Phase 1 only requires the folder foundation, create the folder structure without inventing document contents.

---

## 7.5 MOM

Purpose:

- MOM documents
- published MOM artifacts
- MOM archives
- related supporting material

Default:

Admin + authorized users as required.

Do not make MOM material public.

---

## 7.6 Reports

Purpose:

- management reports
- generated reports
- approved report outputs
- future reporting artifacts

Default:

Admin/restricted.

Do not broadly expose sensitive reports.

---

# 8. PROJECT SUBFOLDER PURPOSES

For the sample project, create exactly these seven recommended folders.

### 01_Admin

Administrative project material.

### 02_Checklist

Checklist Excel files and checklist-related documents.

### 03_Expenses

Project expense files, proofs and related expense artifacts.

Financially sensitive material must still follow the applicable access rules.

### 04_MOM

Project MOM documents and related artifacts.

### 05_Notes

Project notes and supporting notes.

### 06_Files

General project files.

### 07_Reports

Project-specific reports.

Do not create additional project subfolders unless an authoritative Phase 1 requirement explicitly requires them.

---

# 9. NAMING CONVENTION

Use stable, human-readable names.

Required root:

`MASTER COMPANY`

Required top-level folders:

- `Projects`
- `Finance`
- `HR`
- `Templates`
- `MOM`
- `Reports`

Project naming:

`PROJECT_<ProjectName>`

Project subfolders:

- `01_Admin`
- `02_Checklist`
- `03_Expenses`
- `04_MOM`
- `05_Notes`
- `06_Files`
- `07_Reports`

Do not introduce inconsistent abbreviations or alternate names.

These names must remain deterministic because later Apps Script automation will depend on predictable Drive locations.

---

# 10. ACCESS AND SECURITY RULES

Treat security as an actual access-control requirement, not a documentation exercise.

The core principles are:

1. Do not give all employees Editor access to MASTER COMPANY.
2. Finance is restricted.
3. HR is restricted.
4. Salary/investment source material must remain restricted when those assets are created later.
5. Project members may receive access only to permitted project material.
6. Project access must not automatically expose Finance or HR.
7. Confidential files must not use unrestricted/public sharing.
8. Avoid "Anyone with the link" for confidential material.
9. Use individual Gmail/Google Accounts for restricted sharing where needed.
10. Do not treat a Google Site's visual visibility as equivalent to underlying Drive/Sheet security.
11. Underlying sensitive Drive assets must remain restricted independently.
12. Ordinary users must not become owners of sensitive source material.

For this phase, establish the Drive-level security foundation only.

Do not implement database-level permissions, Forms permissions, Site permissions, or Apps Script authorization because those belong to later phases.

---

# 11. IMPORTANT SECURITY DISTINCTION

Do not assume that hiding a folder from a user in a future Google Site makes the underlying Drive file secure.

The authoritative security boundary for Phase 1 is the actual Google Drive sharing/ownership configuration.

Verify access against the actual Google Account/file permissions where the available environment permits.

---

# 12. ZERO-COST CONSTRAINT

The project has a hard target of:

**₹0 additional software/service spend**

Google AI Pro is an existing user resource and is not a new purchase for this project.

For Phase 1:

Allowed:

- existing Google Drive
- normal Google Account/Gmail access
- existing Google storage within available limits
- existing Google services required to create the Drive foundation

Not allowed:

- paid third-party storage
- paid file management SaaS
- paid hosting
- paid database
- paid automation service
- paid employee Workspace subscriptions as a prerequisite
- any new subscription introduced solely for Phase 1

Do not interpret ₹0 as unlimited storage or unlimited usage.

If available storage or account limitations prevent completion, report the actual limitation rather than claiming success.

---

# 13. PHASE BOUNDARY — STRICT

This is the most important boundary in this prompt.

DO NOT perform any of the following as implementation work:

### Do not build Google Sites

Do not create HOME, PROJECTS, FINANCE, HR or REPORTS Site pages.

That is Phase 2.

### Do not create operational Google Sheets

Do not create:

- Projects Sheet
- Employees Sheet
- Project_Members
- Project_Notes
- Project_MOM_Index
- Budget_Given
- Employee_Spending
- OOP_Claims
- Salary_Admin
- Investments
- HR_Admin
- Report_Index
- Lists_Config

Those belong to Phase 3.

### Do not create Google Forms

Do not create project, expense, OOP, HR, MOM or investment forms.

That is Phase 3.

### Do not build Apps Script automation

Do not create:

- MOM email automation
- expense calculations
- reimbursement processing
- salary carry-forward
- report generation
- notification engine
- audit logger
- automated Drive project onboarding

Those belong to Phase 4.

### Do not perform Phase 5 UAT

You may perform the Phase 1 acceptance tests necessary to prove the Drive structure.

Do not perform the entire application E2E/UAT/security handover process.

### Do not create the obsolete custom application

Do not create React/Vite/Firebase code.

Do not install a visual page-builder engine.

Do not build a custom backend.

Do not create a custom database.

---

# 14. DO NOT CHANGE REPOSITORY ARCHITECTURE

The repository has already been reset to a controlled documentation/specification foundation.

Do not reintroduce:

- `src/`
- `package.json`
- Vite application scaffolding
- React application scaffolding
- Firebase configuration
- localStorage application state
- obsolete frontend implementation
- custom visual builder implementation

The repository is controlling the Google-native implementation plan.

If you discover obsolete implementation files, do not silently revive or build on them.

Report them if relevant.

---

# 15. IMPLEMENTATION ORDER

Follow this exact order.

## Step 1 — Read and reconcile context

Read the required files listed in Section 1.

Identify the current Phase 1 state.

Do not make changes before understanding the feature spec.

---

## Step 2 — Mark Phase 1 Feature 01 as IN PROGRESS

Update the appropriate progress state only if the repository workflow permits and the change is within this feature's documentation boundary.

Do not mark the feature complete yet.

Do not claim progress based only on intent.

---

## Step 3 — Verify Google access

Determine whether the current environment has the necessary authorized Google Drive access.

Required capability:

- create folders
- inspect folders
- inspect sharing/access
- create the sample project hierarchy
- verify access where possible

If authentication/OAuth/account authorization is required and cannot be completed by you:

STOP.

Return a human-action request with:

1. exact action required
2. why it is required
3. exact steps the user must perform
4. what confirmation/evidence should be returned

Never ask for passwords, private keys or unnecessary secrets.

---

## Step 4 — Create MASTER COMPANY

Create:

`MASTER COMPANY`

under the intended authoritative admin account.

Verify:

- folder exists
- correct owner/account
- correct name
- no public/unrestricted sharing
- root is usable for child folder creation

---

## Step 5 — Create the six top-level folders

Create:

```
MASTER COMPANY/
├── Projects/
├── Finance/
├── HR/
├── Templates/
├── MOM/
└── Reports/
```

Verify every folder exists.

Do not create duplicates.

If folders already exist and clearly match the authoritative structure, reuse them rather than creating duplicates.

If an existing folder conflicts with the required structure, do not delete business data automatically. Report the conflict and ask for human action if necessary.

---

# 16. CREATE THE SAMPLE PROJECT FOUNDATION

Under:

`MASTER COMPANY/Projects/`

create or reuse one clearly identified test/sample project:

`PROJECT_<ProjectName>`

Then create:

```
01_Admin
02_Checklist
03_Expenses
04_MOM
05_Notes
06_Files
07_Reports
```

Verify every folder.

Do not upload fabricated business documents.

Do not create fake employee information.

Do not create fake financial records.

Empty folders/placeholders are sufficient where the documentation only requires the structural foundation.

---

# 17. TEMPLATE FOLDER HANDLING

Create the Templates folder.

Protect its master area from accidental ordinary-user modification.

If the environment supports a clear permission model, apply:

- Admin: Editor/Manager as appropriate
- Ordinary users: no edit access by default
- View/copy access only when specifically required

Do not fabricate template documents merely to make the folder look populated.

If placeholder files are explicitly required by the actual authoritative context, create only those documented placeholders.

---

# 18. SENSITIVE FOLDER HANDLING

At minimum, verify:

### Finance

Ordinary test user should not have access to restricted Finance source material.

### HR

Ordinary test user should not have access to restricted HR source material.

If a real test employee account is available and authorized, use it.

If testing requires the user to add a test account or grant access, ask for that human action.

Do not create or use unauthorized accounts.

---

# 19. PROJECT ACCESS TEST

If an authorized project test user/account is available:

Grant only the intended project-level access needed for the Phase 1 test.

Verify:

- test project user can access the permitted project material
- test project user cannot automatically access Finance
- test project user cannot automatically access HR
- project access does not broaden to the entire MASTER COMPANY root

Do not grant broad access merely to make the test pass.

---

# 20. PUBLIC EXPOSURE TEST

Inspect sharing settings for the created hierarchy.

Verify confidential folders/files are not:

- publicly published
- unrestricted
- shared as "Anyone with the link" where inappropriate

If a public/unrestricted permission is found:

Correct it if you have authority and the correction is unambiguous.

If correction could remove an intentional business permission, stop and report it rather than guessing.

---

# 21. NAMING TEST

Verify exact names.

Expected:

```
MASTER COMPANY
  Projects
  Finance
  HR
  Templates
  MOM
  Reports

Projects
  PROJECT_<ProjectName>
    01_Admin
    02_Checklist
    03_Expenses
    04_MOM
    05_Notes
    06_Files
    07_Reports
```

Record any deviation.

---

# 22. DUPLICATE / CONFLICT HANDLING

Before creating a folder, inspect whether the expected folder already exists in the intended location.

If it exists and is correct:

- reuse it
- do not create a duplicate

If a folder exists with the same/similar name but appears to belong to another purpose:

- do not delete it
- do not merge it automatically
- document the conflict
- ask for human direction if the correct action cannot be established from the authoritative documentation

Protect existing business data.

---

# 23. VERIFICATION CHECKLIST

You must explicitly test the following Phase 1 acceptance IDs.

### P1-01

Create/verify MASTER COMPANY root.

Expected:

Root exists under intended admin account.

### P1-02

Create/verify six top-level folders.

Expected:

Projects, Finance, HR, Templates, MOM and Reports all exist.

### P1-03

Create/verify sample project.

Expected:

PROJECT_<ProjectName> exists under Projects.

### P1-04

Create/verify seven project subfolders.

Expected:

01_Admin through 07_Reports all exist.

### P1-05

Restricted Finance access.

Expected:

Unauthorized/test employee cannot access restricted Finance source material.

### P1-06

Restricted HR access.

Expected:

Unauthorized/test employee cannot access restricted HR source material.

### P1-07

Project access.

Expected:

Authorized project user can access intended project material only.

### P1-08

No public exposure.

Expected:

Confidential folders/files are not publicly exposed or unrestricted.

### P1-09

Naming convention.

Expected:

Required folder names match documented naming standard.

### P1-10

Template protection.

Expected:

Ordinary users cannot accidentally overwrite master templates.

### P1-11

Zero additional software dependency.

Expected:

No paid third-party storage/file service is required.

### P1-12

Phase 1 closure.

Expected:

All applicable Phase 1 acceptance tests PASS and evidence is recorded.

Do not mark P1-12 PASS if any required test is unresolved, blocked or unverified.

---

# 24. EVIDENCE REQUIREMENT

For every acceptance test, record objective evidence.

Examples:

- folder ID/link where appropriate
- folder path
- owner/account
- sharing configuration
- test account result
- access denied/access granted result
- timestamp if useful
- exact error message if failed

Do not expose sensitive personal information unnecessarily in the report.

Do not publish credentials or secrets.

The report should contain enough evidence for another reviewer to independently understand what happened.

---

# 25. FAILURE HANDLING

If something fails:

1. Capture the exact observed error.
2. Identify the smallest affected boundary.
3. Determine whether it is a permissions issue, Drive limitation, account issue, naming issue or implementation issue.
4. Apply only the smallest correction within Phase 1 scope.
5. Re-run the affected verification.
6. Record the result.

Do not restart or redesign the entire project because one Drive operation failed.

Do not silently work around a security restriction.

---

# 26. HUMAN-ACTION STOP RULE

STOP and ask the user for help if progress genuinely requires:

- Google OAuth approval
- account authorization
- permission approval
- access to a private Google Drive
- ownership change
- a user-created test account
- user confirmation for an ambiguous existing folder conflict
- enabling a capability that requires the user's explicit approval
- any other action that cannot be performed through your currently authorized environment

When stopping, state:

### Human action required

**Action:**
[exact action]

**Why:**
[exact reason]

**How:**
[step-by-step user action]

**Return to me:**
[what confirmation/result you need]

Do not claim Phase 1 is complete.

Do not create a fake successful report.

---

# 27. DO NOT STOP UNNECESSARILY

If you have all required permissions and information, continue automatically.

Do not ask:

- "Should I create the folders?"
- "Do you want me to continue?"
- "Is this okay?"

The prompt already authorizes the Phase 1 implementation.

Only stop for genuine human-only action or an unresolved ambiguity that cannot be safely resolved from authoritative documentation.

---

# 28. PHASE 1 SUCCESS CRITERIA

Phase 1 can be considered complete only when:

1. MASTER COMPANY exists.
2. All six required top-level folders exist.
3. Sample project folder exists.
4. All seven project subfolders exist.
5. Ownership/admin control is correct.
6. Sensitive Finance access is restricted.
7. Sensitive HR access is restricted.
8. Project access is appropriately scoped.
9. No inappropriate public exposure exists.
10. Naming convention is correct.
11. Templates are protected from accidental ordinary-user editing.
12. No paid third-party storage/file dependency was introduced.
13. No Phase 2–5 implementation was performed.
14. All applicable P1 acceptance tests have objective evidence.
15. No unresolved critical access/security defect remains.
16. The final report accurately reflects the actual state.

Only after these conditions are proven should Feature 01 be marked COMPLETE.

---

# 29. WHAT NOT TO CLAIM

Do NOT claim:

- "the Master Website is complete"
- "Phase 2 is complete"
- "Sheets are configured"
- "Forms are configured"
- "Apps Script automation is complete"
- "MOM automation is complete"
- "salary calculations are complete"
- "the application is production complete"

unless those things are actually implemented in their respective phases.

This prompt authorizes only Phase 1.

---

# 30. REQUIRED FINAL REPORT

At the end of the execution, produce a complete implementation report suitable for saving as:

`Phase-1/Google AI Reply-Report/Report-001.md`

The report must contain:

## A. Execution Summary

- Phase
- Feature unit
- objective
- execution status

## B. Context Read

List the authoritative context/spec files actually read.

## C. Work Completed

List every Drive change actually made.

## D. Final Drive Structure

Show the resulting hierarchy as a tree.

## E. Ownership and Permissions

Document:

- root owner
- top-level folder permissions
- Finance restrictions
- HR restrictions
- Templates protection
- project access

Do not expose secrets.

## F. Acceptance Test Results

Use:

| ID | Result | Evidence | Notes |
|---|---|---|---|
| P1-01 | PASS/FAIL/PARTIAL/BLOCKED | ... | ... |
| P1-02 | ... | ... | ... |
| ... | ... | ... | ... |
| P1-12 | ... | ... | ... |

## G. Tests Performed

List actual tests and actual results.

## H. Not Completed

Explicitly list anything not completed.

## I. Human Action Required

If none:

`None`

If required, state the exact action.

## J. Errors / Limitations

List actual errors or limitations.

## K. Cost / Dependency Check

Confirm whether any new paid dependency was introduced.

## L. Phase Boundary Check

Explicitly confirm that Phase 2, Phase 3, Phase 4 and Phase 5 implementation was not performed.

## M. Final Status

Use exactly one:

- `PASS`
- `REVISION REQUIRED`
- `HUMAN ACTION REQUIRED`
- `BLOCKED`

Do not use "PASS" if required acceptance evidence is missing.

---

# 31. GIT / REPOSITORY RECORD

If repository changes are needed to record Phase 1 progress or documentation:

- keep changes within the established repository structure;
- do not create an application implementation;
- do not introduce unrelated files;
- preserve historical prompt/report/feedback records;
- never overwrite previous cycle artifacts.

The implementation report belongs in:

`Phase-1/Google AI Reply-Report/Report-001.md`

Do not create Feedback-001 yourself unless the workflow explicitly requires ChatGPT review as a separate subsequent step.

The next step after your report is for ChatGPT to review the report and create:

`Phase-1/ChatGPT Feedback/Feedback-001.md`

If revision is required, ChatGPT will create Prompt-002.

---

# 32. FINAL OPERATING RULE

**ChatGPT defines and reviews. You implement and report.**

For this cycle:

**Implement ONLY the Google Drive foundation described above.**

Do not redesign the architecture.

Do not resurrect the obsolete React/Firebase/full-builder plan.

Do not proceed into later phases.

Do not invent missing business rules.

Do not hide failures.

Do not claim completion without evidence.

If you can continue, continue until Phase 1 Feature 01 is genuinely complete.

If a genuine human-only action is required, stop and clearly request that action.

At the end, produce the complete Report-001 content described above.
