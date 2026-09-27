# PHASE 3 — AUTHORITATIVE GOOGLE SHEETS + GOOGLE FORMS IMPLEMENTATION PROMPT

## 0. EXECUTION AUTHORITY

You are now authorized to execute **PHASE 3 ONLY** of the Master Company project.

This document is an implementation-control prompt, not a general brainstorming request.

The repository is a specification-controlled project. Your job is to execute the already-approved Phase 3 design exactly, verify what you actually implement, document evidence, and stop at the Phase 3 boundary.

### Absolute rule

**DO NOT IMPROVISE. DO NOT SUBSTITUTE ARCHITECTURE. DO NOT SKIP VERIFICATION. DO NOT CLAIM SOMETHING IS COMPLETE BECAUSE A DOCUMENT, BLUEPRINT, OR PLAN EXISTS.**

If the authoritative workbook/specification does not define something, do not invent a business rule. Record the gap and stop at the smallest genuine decision boundary.

---

# 1. FIRST ACTION — READ, DO NOT BUILD

Before creating or modifying anything, read the repository control system in this order:

1. `Main Prompt/Main-Prompt.md`
2. `AGENTS.md`
3. `.agents/AGENTS.md`
4. `agents.md`
5. `README.md`
6. `context/project-overview.md`
7. `context/architecture-context.md`
8. `context/code-standards.md`
9. `context/ai-workflow-rules.md`
10. `context/ui-context.md`
11. `context/progress-tracker.md`
12. `context/feature-specs/03-sheets-and-forms.md`
13. The complete `Phase-3/` documentation set.
14. The authoritative Phase 3 workbook-derived specifications, especially:
   - `Phase 3/Phase-3-Build.md`
   - `Phase 3/Phase-3-Sheet-Schema.md`
   - `Phase 3/Phase-3-Forms-Map.md`
   - `Phase 3/Phase-3-Data-Rules.md`
   - `Phase 3/Phase-3-Access-Matrix.md`
   - `Phase 3/Phase-3-Acceptance.md`
   - `Phase 3/Revision-Log.md`
   - `Phase 3/ChatGPT Prompt/` relevant files
15. Any Phase 1/Phase 2 documents only where needed to understand existing Drive/Site dependencies.

Do not treat an older legacy document as permission to revive the discarded React/Vite/Firebase/custom-app architecture.

After reading, determine the actual repository state from `context/progress-tracker.md`.

If Phase 3 is not explicitly authorized/unblocked, STOP and report the blocker.

If Phase 3 is authorized, continue.

---

# 2. AUTHORITATIVE ARCHITECTURE — FROZEN

The approved architecture is:

**Google Sites + Google Sheets + Google Forms + Google Drive + Google Apps Script**

For Phase 3, the active implementation layer is:

- **Google Sheets** — authoritative operational data structures
- **Google Forms** — controlled employee/admin/project input workflows
- **Google Drive** — file/attachment storage and Phase 1 dependency
- **Google Sites** — Phase 2 presentation/navigation dependency

Apps Script exists in the overall architecture but is **NOT IMPLEMENTED IN PHASE 3**.

### Forbidden substitutions

Do NOT create or introduce:

- React
- Vite
- Next.js
- Node/Express application
- Firebase
- Firestore
- Supabase
- PostgreSQL
- MySQL
- custom database
- paid database
- paid form service
- paid SaaS
- paid email API
- custom web application
- SPA dashboard
- custom visual website builder
- replacement authentication system
- replacement backend
- employee-by-employee paid Workspace subscription as a prerequisite

If any such scaffold appears in the repository as a result of your work, remove your own unauthorized change before final reporting and return the repository to the approved architecture.

---

# 3. PHASE 3 BOUNDARY

## Phase 3 DOES

Phase 3 creates and verifies:

- Google Sheets
- required tabs/data structures
- field definitions
- stable ID columns
- date/currency formats
- controlled lists
- validation rules
- Google Forms
- form field definitions
- form-to-sheet destination/mapping configuration
- Drive attachment/link boundaries
- access boundaries
- identity/submission metadata configuration
- Phase 4 input/output definitions
- documentation/evidence
- Phase 3 acceptance verification

## Phase 3 DOES NOT

Do NOT implement:

- Apps Script automation
- triggers
- automatic calculations
- notification engines
- MOM automatic email sending
- salary carry-forward logic
- automated report generation
- automated project-folder creation
- automated Drive routing
- automated approval workflows
- automated reconciliation
- scheduled jobs
- Phase 4 business processing

Phase 3 may define the fields and deterministic inputs/outputs required by Phase 4, but must not implement the automation.

Do not start Phase 4 merely because a Phase 4 dependency has been identified.

---

# 4. ZERO-COST HARD GATE

The project has a hard requirement of **₹0 additional software/service spend**.

Use the approved Google-native architecture and existing Google account resources.

Do not introduce:

- paid database
- paid form service
- paid automation service
- paid email service
- paid SaaS
- paid plugins
- paid Workspace subscription as a prerequisite
- Firebase billing
- Cloud Run
- paid API
- third-party SaaS

Do not describe Google AI Pro as a new project cost.

Also understand:

**₹0 additional spend does not mean unlimited quota.**

Do not claim unlimited Forms, Sheets, Drive, Gmail, Apps Script, storage, or automation capacity.

---

# 5. PHASE 1 AND PHASE 2 DEPENDENCIES

Phase 1 established the Drive foundation.

Expected root structure:

```
MASTER COMPANY
├── Projects
├── Finance
├── HR
├── Templates
├── MOM
└── Reports
```

Each project uses:

```
01_Admin
02_Checklist
03_Expenses
04_MOM
05_Notes
06_Files
07_Reports
```

Phase 2 established the Master Google Site:

- HOME
- PROJECTS
- FINANCE
- HR
- REPORTS

Phase 3 supplies the structured data and Forms that Phase 2 can later link/embed.

Do not recreate Phase 1 or Phase 2.

Do not change the Google Site architecture.

---

# 6. AUTHORITATIVE PHASE 3 DATA MODEL

Create the following operational data areas exactly as specified.

## 6.1 MASTER DATA — Projects

Purpose:
Authoritative project records.

Fields:

- Project_ID
- Project_Name
- Description
- Owner
- Start_Date
- Event_Date
- Status
- Drive_Folder_URL
- Notes

Sensitivity:
Moderate.

Primary users:
Admin/project managers.

Phase 4 use:
Project links, countdown source, notifications, reports.

---

## 6.2 MASTER DATA — Employees

Purpose:
Employee directory and required HR/reimbursement attributes.

Fields:

- Employee_ID
- Name
- Email
- Role
- Salary_Basis
- Active
- Reimbursement_Eligible
- Project_Access

Sensitivity:
YES / restricted.

Primary users:
Admin/HR.

Phase 4 use:
Identity mapping, reimbursement, salary workflows.

Employees must not receive broad edit access to this source tab.

---

## 6.3 PROJECTS — Project_Members

Fields:

- Project_ID
- Employee_ID
- Project_Role
- Access_Level
- Active

Purpose:
Map employees to projects and access/role.

Sensitivity:
YES.

Primary users:
Admin/project managers.

---

## 6.4 PROJECTS — Project_Notes

Fields:

- Note_ID
- Project_ID
- Date
- Author_Email
- Note
- Status

Sensitivity:
Moderate.

Primary users:
Project members/admin.

---

## 6.5 PROJECTS — Project_MOM_Index

Fields:

- MOM_ID
- Project_ID
- Meeting_Date
- Title
- Version
- Status
- Drive_URL
- Published_At
- Published_By

The MOM workflow also requires the Form to capture the project, meeting date, title, participants, registered email IDs, content, and version/update information as specified in the Forms Map.

Do not invent additional MOM business rules.

Phase 4 will later implement publishing/email/version automation.

---

# 7. FINANCE DATA MODEL

## 7.1 Budget_Given

Fields:

- Budget_ID
- Date
- Recipient
- Amount
- Purpose
- Project_ID
- Status
- Proof_URL
- Created_By

Purpose:
Money given to a person for a project/business purpose.

Sensitivity:
YES / restricted.

---

## 7.2 Employee_Spending

Fields:

- Spending_ID
- Employee_ID
- Date
- Amount
- Recipient/Vendor
- Purpose
- Project_ID
- Attachment_URL
- Status

Input:
Employee Spending / Expense Form.

Employees submit through the Form; they must not receive broad source-sheet edit access.

---

## 7.3 OOP_Claims

Fields:

- Claim_ID
- Employee_ID
- Month
- Date
- Purpose
- Amount
- Project_ID
- Proof_URL
- Status
- Approved_Amount
- Paid_Date

Input:
OOP Claim Form.

Important:

### ₹5,000 rule

The workbook explicitly requires that the ₹5,000 OOP rule remain frozen and must not be silently interpreted or expanded.

Therefore:

- do NOT invent whether ₹5,000 is monthly, per claim, per employee, per project, or another unit unless the authoritative specification explicitly says so;
- do NOT invent treatment of excess amounts;
- do NOT invent approval semantics;
- do NOT invent salary-treatment semantics;
- do NOT implement the calculation in Phase 3.

Instead, ensure the schema contains the fields required for Phase 4 to implement the approved interpretation deterministically.

If the exact semantics are absent from the authoritative Phase 3/earlier frozen requirement, record the ambiguity explicitly for Phase 4 rather than guessing.

---

# 8. ADMIN-ONLY FINANCE DATA

## Salary_Admin

Fields:

- Salary_Record_ID
- Employee_ID
- Month
- Due_Amount
- Paid_Amount
- Pending_Carry_Forward
- Status
- Notes

Access:
Admin only.

Phase 4:
Salary carry-forward and reporting.

Do not calculate carry-forward in Phase 3.

---

## Investments

Fields:

- Investment_ID
- Source/Person
- Amount
- Taken_Date
- Expected_Return_Date
- Actual_Return_Date
- Status
- Notes

Access:
Admin only.

Do not expose investment details to ordinary employees.

Do not implement investment reminders in Phase 3.

---

# 9. HR DATA

## HR_Admin

Fields:

- Employee_ID
- Joining_Date
- Employment_Status
- HR_Notes
- Reimbursement_Settings

Access:
Admin/HR.

Do not expose HR source data broadly.

---

# 10. REPORTING AND CONFIGURATION DATA

## Report_Index

Fields:

- Report_ID
- Report_Type
- Period
- Project_ID
- Drive_URL
- Status
- Generated_Date

Sensitivity:
YES / controlled.

Purpose:
Catalog generated/approved reports.

Phase 3 defines the index only.

No report generator is implemented here.

---

## Lists_Config

Purpose:
Controlled dropdown values and configuration.

Must support the configuration required for:

- status lists
- roles
- project list
- reimbursement settings
- categories

Access:
Admin/controlled users.

Do not expose configuration editing to ordinary employees.

Use Lists_Config as the controlled source for validation wherever feasible.

---

## Submission_Index

This is an optional audit/index structure identified by the workbook.

Fields:

- Submission_ID
- Source_Form
- Record_ID
- Submitted_By
- Submitted_At
- Processing_Status

Sensitivity:
YES.

Purpose:
Phase 4 automation traceability.

If implemented, it must remain an audit/index layer and must not become a second authoritative copy of the business record.

---

# 11. STABLE-ID RULE

Every core business record requires a stable unique ID.

Create explicit ID columns and define formats for at least:

- PROJECT_ID / Project_ID
- EMPLOYEE_ID / Employee_ID
- PROJECT_MEMBER mapping
- NOTE_ID / Note_ID
- MOM_ID
- BUDGET_ID / Budget_ID
- SPENDING_ID / Spending_ID
- CLAIM_ID / Claim_ID
- SALARY_RECORD_ID / Salary_Record_ID
- INVESTMENT_ID / Investment_ID
- REPORT_ID / Report_ID
- SUBMISSION_ID / Submission_ID where used

Do NOT use row numbers as permanent business IDs.

Do NOT rely on employee names as identity.

Do NOT rely on project names as identity.

Do NOT invent an ID generation mechanism that requires Phase 4 automation.

If a stable-ID mechanism cannot be created natively without automation, define the required ID field and document the exact Phase 4 generation dependency rather than silently substituting row numbers.

---

# 12. DATA-TYPE AND VALIDATION RULES

Apply the following:

### Dates
Use actual Google Sheets date values.

Standardize display formatting.

Do not store dates as arbitrary free text where an actual date value is required.

### Amounts
Use numeric currency values.

Use consistent INR/currency formatting.

Do not store monetary values as arbitrary text.

### Employees
Use Employee_ID plus email as identity.

Do not depend solely on free-text names.

### Projects
Use Project_ID.

Use controlled project selection wherever feasible.

### Attachments
Store Drive references/URLs.

Do not store binary files inside Sheets.

### Status
Use controlled values sourced from Lists_Config wherever feasible.

### Forms
Collect only required business information.

Do not request unnecessary personal/sensitive information.

### Audit
Capture Form timestamp and submitter identity where the chosen Google Form access model supports it.

---

# 13. REQUIRED FORMS

Create/configure these Forms as applicable.

## Form 1 — Create / Request Project

Purpose:
Create a project or submit a project request.

Fields:

- Project name
- Description
- Owner
- Start date
- Event date
- Members
- Notes

Destination:
Projects + Project_Members, directly or through the controlled processing boundary defined by the architecture.

Submitters:
Admin/project-authorized users.

Access:
Restricted to authorized users.

Phase 4 dependency:
Project folder/link creation and notifications.

---

## Form 2 — Employee Spending / Expense

Fields:

- Employee
- Date
- Amount
- Recipient/vendor
- Purpose
- Project
- Proof upload

Destination:
Employee_Spending.

Submitters:
Employees/authorized users.

Access:
Authenticated/controlled response access.

Phase 4:
Validation, totals, approval/status.

---

## Form 3 — OOP Claim

Fields:

- Employee
- Month
- Date
- Purpose
- Amount
- Project
- Proof upload

Destination:
OOP_Claims.

Submitters:
Employees.

Access:
Authenticated/controlled response access.

Phase 4:
₹5,000 rule, approval, reimbursement, salary treatment.

Do not implement those Phase 4 calculations now.

---

## Form 4 — Employee Update / HR Request

Fields:

- Employee
- Request type
- Relevant details
- Attachment if needed

Destination:
HR_Admin / controlled HR workflow.

Submitters:
Employees/admin.

Access:
Restricted.

Phase 4:
Notifications and HR processing.

---

## Form 5 — MOM Input

Fields:

- Project
- Meeting date
- Title
- Participants
- Registered email IDs
- Content
- Version/update information

Destination:
Project_MOM_Index + Drive/Docs as applicable.

Submitters:
Project/admin users.

Access:
Project-authorized users.

Phase 4:
Publish/update email/version history.

---

## Form 6 — Report Request (OPTIONAL)

Fields:

- Report type
- Period
- Project
- Recipient

Destination:
Report_Index/request area.

Submitters:
Admin/authorized users.

Access:
Restricted.

Phase 4:
Generate report and notify.

Do not build the report generator now.

---

## Form 7 — Investment Entry (Admin)

Fields:

- Source/person
- Amount
- Taken date
- Expected return date
- Actual return date
- Status
- Notes

Destination:
Investments.

Submitters:
Admin only.

---

## Form 8 — Salary Entry (Admin)

Fields:

- Employee
- Month
- Due amount
- Paid amount
- Notes

Destination:
Salary_Admin.

Submitters:
Admin only.

Phase 4:
Carry-forward calculation/reporting.

---

# 14. IMPORTANT GOOGLE FORMS / SHEETS MAPPING RULE

The specification requires Forms to map to authoritative operational structures.

However, do not pretend that Google Forms can perform arbitrary relational transformation or normalized multi-tab writes if the native platform does not support that directly.

For every mapping:

1. Configure the native Form → Sheet destination that Google supports.
2. Verify where the response actually lands.
3. Do not silently create Apps Script to transform responses because Apps Script belongs to Phase 4.
4. Do not fabricate a successful normalized mapping.
5. If a required mapping cannot be achieved natively within the Phase 3 boundary, mark it:
   **PHASE 3 PLATFORM LIMITATION / PHASE 4 PROCESSING REQUIRED**
   and document:
   - source Form
   - native response destination
   - intended authoritative target
   - required transformation
   - exact Phase 4 dependency.

This is a critical anti-fabrication rule.

---

# 15. ACCESS CONTROL

Implement the Phase 3 access matrix exactly.

## Employee

- Projects: permitted view / Form submission as authorized
- Employees: permitted fields only
- Employee_Spending: submit via Form; no broad source edit
- OOP_Claims: submit via Form
- Salary_Admin: NO
- Investments: NO
- HR_Admin: NO direct source edit
- CONFIG: NO
- Submission_Index: NO

## Project Member

- permitted project information
- no direct editing of Project_Members
- permitted expense/OOP/MOM workflows
- no salary/investment access

## Finance/Admin

- authorized Finance access
- Employee_Spending full finance access
- OOP_Claims full finance access
- Budget_Given access
- Salary_Admin as authorized/admin
- Investments admin-only
- Report_Index finance reports as authorized

## HR/Admin

- Employees management as authorized
- HR_Admin management
- Salary access only if explicitly required by the matrix
- no investment access unless explicitly authorized

## Site Owner/Admin

- full administrative access.

### Critical security rule

Do not rely on a hidden column, hidden tab, or UI obscurity as security.

Restricted source data must have appropriate Google sharing/access controls.

Employees must not receive broad Editor access merely to allow Form submission.

---

# 16. NORMAL GOOGLE ACCOUNT MODEL

The architecture targets normal Gmail/Google Accounts.

Do not introduce employee-by-employee paid Workspace subscriptions as a prerequisite.

When testing:

- use a representative permitted Google Account;
- verify permitted Form access;
- verify restricted Sheet/tab access;
- verify that sensitive source data is not broadly exposed.

If an exact access behavior depends on an account configuration that requires human action, stop at that human boundary and document exactly what must be configured.

Never claim the test passed without evidence.

---

# 17. DRIVE ATTACHMENT RULE

Proofs and attachments must be stored in Google Drive and referenced from Sheets.

Do not place binary files inside Sheets.

For every Form with file upload:

- verify the upload field exists;
- verify the resulting Drive storage behavior;
- verify the Sheet contains a usable Drive reference/URL;
- verify access does not unintentionally expose restricted files.

Do not claim a specific Phase 1 folder routing behavior unless it is actually configured and verified.

If automatic routing requires Apps Script, document it as Phase 4.

---

# 18. ONE AUTHORITATIVE RECORD PRINCIPLE

Do not create duplicate manual sources of truth.

Examples:

- Projects is authoritative for project records.
- Employees is authoritative for employee records.
- Project_Members is authoritative for project membership.
- Employee_Spending is authoritative for spending records.
- OOP_Claims is authoritative for reimbursement claims.
- Salary_Admin is authoritative for salary records.
- Investments is authoritative for investments.
- Report_Index is authoritative for report catalog.
- Lists_Config is authoritative for controlled configuration.

Use IDs and references between structures.

Do not copy the same business record into unrelated tabs simply because it is convenient.

---

# 19. PHASE 4 READINESS

For every Phase 4 dependency, make sure the required source fields exist.

Phase 4 must later be able to implement:

- project processing
- Drive project folder automation
- expense processing
- OOP claim processing
- salary carry-forward
- MOM processing
- MOM email sender
- report generation
- notifications
- audit logging
- error handling

Phase 3 does NOT implement these.

Phase 3 must make their required inputs/outputs explicit.

If an automation rule is not frozen, do not invent it.

---

# 20. LEGACY ARCHITECTURE FIREWALL

The repository contains historical documents from an earlier custom-app concept.

Those documents may mention:

- React
- Firebase
- databases
- visual builders
- drag/drop editors
- custom JavaScript runtimes
- custom APIs
- paid services

Those historical requirements do NOT override the revised Google-native architecture.

The current approved architecture wins.

Do not revive discarded implementation.

Do not create a custom application to satisfy an old requirement.

---

# 21. EXECUTION METHOD

Follow this exact loop:

**READ → DETERMINE STATE → PLAN → IMPLEMENT → VERIFY → CORRECT → RE-VERIFY → DOCUMENT → STOP**

For each implementation unit:

### Step A — Read
Read the relevant schema, data rules, Forms Map, Access Matrix and acceptance tests.

### Step B — Plan
State exactly what will be created/changed.

### Step C — Implement
Create only the approved Sheets/Forms/configuration.

### Step D — Verify
Verify the actual result.

### Step E — Correct
If something fails, fix the smallest root cause.

### Step F — Re-verify
Run the failed test again.

### Step G — Document
Record evidence and status.

### Step H — Stop
Do not continue into Phase 4.

---

# 22. NO FAKE VERIFICATION

These distinctions are mandatory:

- SPECIFIED ≠ IMPLEMENTED
- IMPLEMENTED ≠ VERIFIED
- PLATFORM CAPABILITY ≠ VERIFIED
- DOCUMENTED ≠ COMPLETE
- HUMAN ACTION REQUIRED ≠ PASS

Do not mark an acceptance test PASS unless the actual required behavior has been observed and evidence exists.

Use precise statuses such as:

- NOT STARTED
- SPECIFIED
- IN PROGRESS
- IMPLEMENTED
- HUMAN ACTION REQUIRED
- PLATFORM LIMITATION
- VERIFIED
- PASS
- BLOCKED

A specification-only item must never be reported as a live PASS.

---

# 23. PHASE 3 ACCEPTANCE TESTS

You must execute and document all of these:

### P3-01
Create the required operational Sheets/tabs.

Expected:
All required data areas from the schema exist.

### P3-02
Verify Projects structure.

Expected:
Defined fields and stable Project_ID exist.

### P3-03
Verify Employees structure.

Expected:
Identity, role, active and reimbursement-related fields exist.

### P3-04
Verify Finance structures.

Expected:
Budget, spending, OOP, salary and investment records exist with correct fields.

### P3-05
Verify HR/report/config/audit structures.

Expected:
Required support tabs exist.

### P3-06
Create required Forms.

Expected:
Project, expense, OOP, HR, MOM and applicable admin workflows exist.

### P3-07
Verify Form-to-Sheet mappings.

Expected:
Each Form has a verified native destination/mapping, or an explicitly documented Phase 4 processing boundary if native normalized mapping is impossible.

### P3-08
Verify validation.

Expected:
Dates, amounts, statuses, employees and projects use appropriate validation/controlled values.

### P3-09
Verify Drive attachment handling.

Expected:
Uploaded proofs/files are stored in intended Drive behavior and referenced rather than embedded as binary data in Sheets.

### P3-10
Verify sensitive access.

Expected:
Employees cannot directly edit/read restricted salary, investment and sensitive master tabs.

### P3-11
Verify normal Gmail model.

Expected:
Representative permitted Google Account can use permitted Forms without paid Workspace dependency.

### P3-12
Verify stable IDs and audit fields.

Expected:
Core records have stable IDs and required submission metadata.

### P3-13
Verify Phase 4 readiness.

Expected:
Automation inputs/outputs are defined and no business rule is silently invented.

### P3-14
Verify zero-cost boundary.

Expected:
No paid database/form/SaaS service introduced.

### P3-15
Phase 3 closure.

Expected:
All Phase 3 acceptance tests PASS and evidence is recorded.

---

# 24. HUMAN-ACTION BOUNDARY

You may not be able to create or configure certain Google resources without the user's authenticated Google account.

If an action genuinely requires the user:

STOP ONLY AT THAT EXACT BOUNDARY.

Report:

**HUMAN ACTION REQUIRED**

Then provide:

1. exact Google page to open;
2. exact object to create/select;
3. exact setting to change;
4. exact value to enter;
5. exact sharing/access setting;
6. exact evidence to return;
7. which acceptance test is blocked.

Do not ask the user to perform work that you can actually complete within the available environment.

Do not fabricate Google Sheet IDs, Form URLs, Drive URLs, permissions, owners, responses, or test results.

---

# 25. REPOSITORY DOCUMENTATION

After implementation and verification, update only the Phase 3 documentation necessary to record the real state.

At minimum keep these synchronized:

- `Phase-3/Phase-3-Build.md`
- `Phase-3/Phase-3-Sheet-Schema.md`
- `Phase-3/Phase-3-Forms-Map.md`
- `Phase-3/Phase-3-Data-Rules.md`
- `Phase-3/Phase-3-Access-Matrix.md`
- `Phase-3/Phase-3-Acceptance.md`
- `Phase-3/Revision-Log.md`
- `context/progress-tracker.md`
- `Phase-3/Google AI Reply-Report/Report-001.md` or the next sequential report if already present.

Do not rewrite authoritative specifications merely to make the implementation appear compliant.

If an implementation limitation exists, document it.

---

# 26. GIT DISCIPLINE

Every meaningful implementation cycle must be traceable.

Before changing files:

- inspect current branch/state;
- ensure you are working from the latest main state.

After implementation:

- inspect the actual diff;
- ensure no React/Vite/Firebase/custom-app artifacts were introduced;
- ensure no unrelated Phase 4/5 work was added;
- ensure documentation reflects reality.

Commit changes with a clear message such as:

`feat(phase-3): implement sheets and forms foundation`

Do not create commits claiming completion before acceptance verification.

---

# 27. FINAL REPORT FORMAT

At the end of this execution, produce a concise but evidence-based report containing:

## Repository State
- current commit
- current Phase
- current Feature
- architecture
- zero-cost status

## Sheets Created
List every actual Sheet/workbook and every actual tab.

## Forms Created
List every actual Form and its destination.

## Validation
List actual validations configured.

## Access
List actual sharing/access boundaries verified.

## Drive
List actual attachment/reference behavior verified.

## Acceptance Matrix
For P3-01 through P3-15:

| ID | Status | Evidence |
|---|---|---|

Use PASS only for actual verified results.

## Human Actions
List only genuine remaining human actions.

## Phase Boundary
State explicitly:

**PHASE 3 COMPLETE AND VERIFIED — PHASE 4 READY**

only if P3-15 is genuinely satisfied.

Otherwise state the exact blocking acceptance test(s).

## Next Phase
Do not implement Phase 4.

State that Phase 4 is the next authorized phase only after Phase 3 closure.

---

# 28. FINAL STOP RULE

When Phase 3 is complete:

**STOP.**

Do not:

- create Apps Script;
- create triggers;
- send automated emails;
- implement salary carry-forward;
- implement automated reports;
- implement MOM email automation;
- implement notification engine;
- implement Drive automation;
- modify the Google Site architecture;
- begin Phase 4.

The correct sequence is:

**PHASE 3 VERIFIED → DOCUMENT → STOP → PHASE 4 EXPLICITLY AUTHORIZED LATER**

---

# 29. NON-NEGOTIABLE PRINCIPLES

1. Google-native architecture is authoritative.
2. Phase boundaries are hard.
3. The workbook/schema is authoritative for Phase 3 requirements.
4. Do not invent missing business rules.
5. Stable IDs are mandatory for core records.
6. Sensitive source tabs remain restricted.
7. Employees use Forms rather than broad source-sheet editing.
8. Drive stores files; Sheets store references.
9. Lists_Config controls controlled values where feasible.
10. Normal Google Accounts are the target identity model.
11. ₹0 additional spend is a hard constraint.
12. Quotas are real; never claim unlimited capacity.
13. Specification is not implementation.
14. Implementation is not verification.
15. Platform capability is not verification.
16. Human action must be identified precisely.
17. Never fabricate URLs, IDs, permissions, responses or test evidence.
18. Never revive the discarded React/Vite/Firebase/custom-app architecture.
19. Never implement Phase 4 while executing Phase 3.
20. When uncertain, preserve the boundary and document the uncertainty instead of guessing.

# END OF AUTHORITATIVE PHASE 3 IMPLEMENTATION PROMPT
