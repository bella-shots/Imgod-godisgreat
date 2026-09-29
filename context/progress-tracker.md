# Progress Tracker

## Current project state
Repository reset to the playbook-controlled architecture.

## Completed
- Phase 1 documentation exists.
- Phase 2 documentation exists.
- Phase 3 documentation exists.
- Phase 4 documentation exists.
- Phase 5 documentation exists.
- Five-phase architecture is documented.
- AI-ready development playbook has been studied and converted into repository control rules.

## Corrective action
The previous Google AI-generated React/Vite implementation was removed because it did not follow the agreed architecture or the playbook's bounded feature workflow.

## Current state
PHASE 3 IN PROGRESS — HUMAN ACTION REQUIRED (Sheet & Form Creation in Admin Google Account)

## Next work
Feature 03: Sheets + Forms (Create 4 Google Sheets workbooks and 8 Google Forms per the Phase-3 schema, with human-facing Form identity inputs and Phase 4 ID resolution).

## Feature status
- 01 Google Drive structure: COMPLETE & VERIFIED (Closed 26-Sep-2026)
- 02 Master Google Site: COMPLETE & VERIFIED (Closed 27-Sep-2026)
- 03 Sheets + Forms: IN PROGRESS / HUMAN ACTION REQUIRED (Blueprint complete; R20 ownership correction and R23 payroll correction applied; documentation reconciled by R24; awaiting in-account creation)
- 04 Apps Script automation: BLOCKED until Feature 03 is verified
- 05 Testing + permissions + handover: BLOCKED until Feature 04 is verified

## Current Phase 3 Prompt
- Authoritative implementation prompt: `Phase-3/ChatGPT Prompt/Prompt-005.md`
- Prompt-001, Prompt-002 and Prompt-003 remain historical and are not overwritten.
- Prompt-005 records running changes R20 through R23. R20 moves cross-domain `Report_Index` and `Submission_Index` into the restricted `MASTER_COMPANY_ADMIN` workbook; R21 corrects the human-facing Form identity boundary; R22 makes FRM-05 Project Name a free Short answer; R23 removes the recurring salary Form and makes `Salary_Admin` the payroll ledger. R19 and R18 remain in force. The authoritative/support count is 13 and the applicable/native response count is 7, for 20 physical tabs after all applicable Forms are linked.

## Open decisions
- Any remaining implementation ambiguity must be resolved in the relevant feature specification before dependent behavior is built.

## Rule
Do not mark a phase complete because documentation exists. Completion requires observable implementation and verification.

## R21 session note
- Detected usability mismatch: stable internal IDs were being treated as possible human-facing Form inputs.
- Corrected specification boundary: Forms collect human-readable project/employee identity; Phase 4 resolves those values to canonical stable IDs.
- Do not manually alter authoritative ID columns or invent replacement IDs in Forms.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.
## R22 session note
- Observed FRM-05 had existing project names pre-populated as Form choices.
- Corrected the specification: FRM-05 `Project Name` is a required Short answer with no hard-coded/pre-populated project-name list.
- Phase 4 remains responsible for validating/resolving the submitted Project Name to canonical `Project_ID`.
- No lookup/configuration table is introduced.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.


## R23 session note
- Corrected salary architecture: `Employees.Salary_Basis` is the agreed **6-month CTC/stipend**, not monthly CTC.
- `Salary_Admin` is the authoritative monthly payroll ledger; Phase 4 derives monthly salary from the stored six-month CTC for each applicable active employee.
- Removed FRM-08 / `Salary_Responses` from Phase 3. No `Salary_Responses` tab is to be created.
- Native response tabs reduce from 8 to 7; physical Phase 3 tab count is 20 (13 authoritative/support + 7 native response tabs).
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.

## R24 session note
- Reconciled stale Phase 3 documentation left after R23.
- Authoritative model is now consistently documented as 4 workbooks: Operations (4), Finance (5), HR/Admin (2), Admin (2).
- There are 13 authoritative/support tabs, 7 applicable Forms, 7 native response tabs, and 20 physical tabs after all applicable Forms are linked.
- `Report_Index` and `Submission_Index` remain in `MASTER_COMPANY_ADMIN`, never HR.
- `Salary_Admin` has no native Form/response tab.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.


## R25 session note
- Corrected FRM-02 respondent-facing employee identity from **Employee ID** to **Employee Email ID**.
- Phase 4 resolves the submitted Employee Email ID against authoritative Employees.Email to canonical Employee_ID.
- If the respondent is logged into Google Forms with a different email, the signed-in email is audit metadata only and does not override the explicit Employee Email ID.
- Mismatches require validation failure/manual review or the defined correction workflow; no silent employee substitution is permitted.
- No second login-email question is required.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.

## R26 session note
- Resolved the previously unspecified FRM-04 Request_Type controlled-value gap.
- Locked exactly nine values: Personal Information Update; Bank / Payment Details Update; Leave / Attendance Request; Employment / HR Document Request; Salary / Payroll Query; Reimbursement / Benefits Query; Project / Role Update; Resignation / Exit Request; Other.
- FRM-04 respondent-facing fields are Employee Email ID (required), Request Type (required), Relevant Details (required), and optional Attachment / Supporting Document.
- No Employee_ID, HR_Request_ID, Status, Submitted_At, Processed_At, or Processed_By is requested from the respondent.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.


## R27 session note
- Reconciled FRM-06 against the authoritative Phase 3 Forms Map and Schema Blueprint.
- Locked the respondent-facing FRM-06 fields: Report Type (required multiple choice), Period (required short answer), conditional Project Name (short answer for project-specific reports), and Recipient Email (required short answer).
- Locked Report Type to exactly Company Summary; Project Report; Finance Report; HR Report.
- Explicitly prohibited internal/report-processing fields such as Report_ID, Project_ID, Drive_URL, Status, Generated_Date and Submission_ID from the Form.
- Phase 4 remains responsible for Project Name resolution and report compilation/cataloguing.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.

## R28 session note
- Simplified FRM-06 Report Type names for ordinary users.
- Locked respondent-facing labels as: Company Summary; Project Report; Finance Report; HR Report.
- Updated the Phase 3 documentation set so the same simple labels are used consistently.
- No report category meaning, workbook structure, Phase boundary, or Phase 4 behavior changed.


## R29 session note
- Defined the actual meaning of Finance Report for FRM-06.
- Locked the principle that a report request cannot grant new permissions or bypass restricted Finance/HR data access.
- Finance Report may include Budget Given, Employee Spending, OOP Claims, authorized Salary/Payroll, authorized Investments, authorized financial totals/aggregations, and authorized project-wise financial information for the requested period.
- Locked role/designation-based recipient scope: Team Member/Contractor self-only; Project Lead authorized project scope; Manager authorized management/data scope; Finance Admin company-wide Finance scope; HR Admin authorized salary/payroll scope but not investment access merely by role; Administrator/Site Admin company-wide authorized scope.
- Recipient must not be an unrestricted free-text lookup or a mechanism for bypassing permissions.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.


## R30 session note
- Added Manager to the controlled Employees.Role values because Finance Report recipient authorization now explicitly uses Manager as a designation/access category.
- Manager remains subject to authorized management/data scope; Manager status alone does not grant restricted salary/payroll or investment access.
## R31 session note
- Corrected the HR Report definition after identifying that earlier wording used vague, non-schema labels.
- Locked the exact HR_Admin report fields: HR_Request_ID, Employee_ID, Request_Type, Relevant_Details, Attachment_URL, Status, Submitted_At, Processed_At, Processed_By.
- Locked Employees as the only source for employee/HR master information; HR_Admin remains workflow-only.
- Defined period handling, authorization scope and restricted treatment of Salary_Basis and HR_Notes.
- Prohibited invented HR fields such as Department, Manager, Leave Balance, Attendance, Performance Score, Employee Phone or Address unless separately added by documented schema revision.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.
