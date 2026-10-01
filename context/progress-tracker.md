# Progress Tracker

## Current project state
Repository is under the playbook-controlled five-phase architecture.

## Current state
**PHASE 3 COMPLETE & VERIFIED — PHASE 4 IN PROGRESS**

The user has confirmed that all required Phase 3 workbooks and Forms have been live-verified. Phase 4 implementation and verification are in progress.

## Feature status
- 01 Google Drive structure: COMPLETE & VERIFIED (revised 30-Sep-2026: Admin and Site containers added)
- 02 Master Google Site: COMPLETE & VERIFIED
- 03 Sheets + Forms: COMPLETE & VERIFIED
- 04 Apps Script automation: IN PROGRESS
- 05 Testing + permissions + handover: BLOCKED until Feature 04 is verified

## Verified Phase 3 workbooks
- MASTER_COMPANY_OPERATIONS
- MASTER_COMPANY_FINANCE
- MASTER_COMPANY_HR_ADMIN
- MASTER_COMPANY_ADMIN

## Verified Phase 3 Forms
- FRM-01 Projects
- FRM-02 Employee Spending
- FRM-03 OOP Claims
- FRM-04 HR Request
- FRM-05 MOM Input
- FRM-06 Report Request
- FRM-07 Investment Input

## Frozen Phase 3 architecture
- 13 authoritative/support tabs + 7 applicable native response tabs = 20 physical tabs.
- Salary_Admin is authoritative and has no salary Form/native response tab.
- Employees is the sole authoritative employee/HR master.
- Report_Index and Submission_Index are owned by MASTER_COMPANY_ADMIN.
- Forms collect human-readable identity; Phase 4 resolves to canonical IDs.
- Universal stable IDs use independent PREFIX-000001 sequences.
- Phase 4 implements the explicit Generate-ID workflows frozen in R52 and the universal Sheet-originated transaction standard frozen in R57.
- Form attachment routing follows R54.
- Master Google Site, workbook, and Form Drive locations follow the revised R55 hierarchy.
- No new folders, tabs, Forms, fields, or alternate schemas may be invented without an approved revision.

## Phase 4 entry condition
Phase 4 is now authorized and actively being implemented.

Implementation source of truth:
1. Phase-4/Phase-4-Build.md
2. Phase-4/Phase-4-Automation-Modules.md
3. Phase-4/Phase-4-Business-Rules.md
4. Phase-4/Phase-4-Error-Handling.md
5. Phase-4/Phase-4-Acceptance.md
6. Frozen Phase 3 schemas, Forms map, revision log, and Drive contracts
7. Phase-4/Universal-Stable-ID-Generation-Spec.md

## Current authoritative Drive hierarchy

```text
MASTER COMPANY
├── Projects
│   └── MASTER_COMPANY_OPERATIONS + FRM-01
├── Finance
│   ├── MASTER_COMPANY_FINANCE
│   ├── FRM-02
│   ├── FRM-03
│   └── FRM-07
├── HR
│   ├── MASTER_COMPANY_HR_ADMIN
│   └── FRM-04
├── Admin
│   └── MASTER_COMPANY_ADMIN
├── MOM
│   └── FRM-05
├── Reports
│   └── FRM-06
└── Site
    ├── imgod_godisgreat
    └── Templates
```

## Phase 4 R55 master asset placement status

### Verified under revised hierarchy
- **P4-33 — Google Site placement: PASS**
  - `imgod_godisgreat` → `MASTER COMPANY/Site`
  - Status: `ALREADY_CORRECT`
- **P4-34 — Four master workbooks: PASS**
  - MASTER_COMPANY_OPERATIONS → Projects
  - MASTER_COMPANY_FINANCE → Finance
  - MASTER_COMPANY_HR_ADMIN → HR
  - MASTER_COMPANY_ADMIN → Admin
  - All returned `ALREADY_CORRECT`.
- **P4-35 — Seven Forms: PASS**
  - FRM-01 → Projects
  - FRM-02 → Finance
  - FRM-03 → Finance
  - FRM-04 → HR
  - FRM-05 → MOM
  - FRM-06 → Reports
  - FRM-07 → Finance
  - All returned `ALREADY_CORRECT`.
- **P4-36 — Relocate misplaced existing master asset: VERIFIED/DEMONSTRATED**
- **P4-37 — Retry asset placement: VERIFIED/DEMONSTRATED**
- **P4-38 — Missing/ambiguous/inaccessible handling: VERIFIED/DEMONSTRATED**
- **P4-39 — Response-destination integrity: PASS**
  - Read-only Apps Script verification on 30-Sep-2026 confirmed all seven Forms use their approved authoritative workbook IDs and each required response tab exists.

R55 placement execution on 30-Sep-2026 completed successfully with all 12 assets reporting `ALREADY_CORRECT` under the revised hierarchy.

### R55 overall status
**CLOSED — P4-39 response-destination integrity verified.**

All R55 placement and response-destination acceptance checks are now verified under the revised Drive hierarchy.

## Phase 4 implementation status
- **Apps Script foundation/configuration: IMPLEMENTED and LIVE-VERIFIED.**
  - `verifyA4Foundation()` returned `PASS` on 30-Sep-2026.
- **A4-00 Central ID Generator: IMPLEMENTED in GitHub; contract corrected.**
  - Frozen prefixes now match the authoritative R49 contract: PRJ, EMP, MBR, NOT, MOM, BDG, SPN, CLM, SAL, INV, HRR, RPT, SUB.
  - Counter reconciliation never moves counters backward.
  - Non-destructive verification helpers are available.
  - Full A4-00 acceptance remains open until real record-creation workflows exercise the generator.
- **A4-01 Project Processing: IMPLEMENTED in GitHub; live verification pending.**
  - FRM-01 → Projects + Project_Members normalization.
  - Submission_Index traceability.
  - Human-facing member resolution to canonical Employee_ID.
  - Concurrent idempotency reservation.
  - PRJ/MBR generation through A4-00 only.
- **A4-02 Project Drive Folder Automation: IMPLEMENTED in GitHub; live verification pending.**
  - Creates/locates `PROJECT_<ProjectName>` and the seven approved Phase 1 subfolders.
  - Reuses existing unique folders; rejects ambiguous duplicates.
- **Employee Creation Workflow (R48/R52/R56/R57): ONE-CLICK DIRECT SHEET IMPLEMENTATION — FROZEN & LIVE-VERIFIED.**
  - Uses the existing `Employees` tab directly; no employee-creation Form, sidebar, floating panel, Process column, or extra schema column.
  - The `Employees` schema remains exactly 15 columns in the frozen order.
  - User completes a pending employee row, selects the employee row/Employee_ID cell, and explicitly uses `Employee Actions → Generate Employee ID`.
  - That single action validates the complete row, checks duplicate email, invokes A4-00, writes and locks the Employee_ID, stamps Created_At, and finalizes the employee immediately.
  - There is no separate `Save Employee` or `Process` action.
  - Employee_ID is generated only through A4-00; generic onEdit/autosave events never generate an ID.
  - User live-verified the one-click workflow on 01-Oct-2026; workflow is now frozen as the authoritative implementation baseline.
- **Project_Members R57 workflow: IMPLEMENTED IN GITHUB — LIVE-VERIFIED.**
  - Existing 7-column `Project_Members` schema is enforced.
  - User uses `Project Member Actions → Generate Project Member ID`.
  - The action validates required Project_ID/Employee_ID/Active values, approved Project_Role/Access_Level values, referenced Project and Employee, duplicate Project_ID + Employee_ID mappings, invokes A4-00, writes/locks MBR ID, and finalizes.
  - No generic onEdit/autosave ID generation.
  - A4-01 Form processing remains automatic and separate; R57 does not alter FRM-01 behavior.
- **Project_Notes R57 workflow: IMPLEMENTED IN GITHUB — LIVE-VERIFIED.**
  - Existing 7-column `Project_Notes` schema is enforced.
  - User uses `Project Note Actions → Generate Project Note ID`.
  - Live verification on 01-Oct-2026 returned `allPassed: true`; generated `NOT-000001`; invalid project and missing note were rejected; already-ID'd regeneration was rejected; ID persistence/locking passed; no onEdit trigger issued IDs; temporary test data was fully removed.
- **Budget_Given R57/R58 workflow: IMPLEMENTED IN GITHUB — LIVE-VERIFIED.**
  - New `Phase-4/Automation/Core/a4_14_budget_given_sheet_workflow.gs`.
  - Frozen 13-column `Budget_Given` schema remains exactly preserved; no extra columns were added.
  - User uses `Budget Actions → Generate Budget ID`.
  - Validates canonical `Recipient Employee_ID` against `MASTER_COMPANY_HR_ADMIN → Employees`; explicitly rejects `Member_Record_ID`, name and email substitution.
  - Validates referenced `Project_ID` against `MASTER_COMPANY_OPERATIONS → Projects`.
  - Uses A4-00 prefix `BDG`, LockService, ID protection, and controlled finalization.
  - Frozen financial calculations/status were verified: To Be Returned, Pending Return, Pending Return / Fully Returned / No Return Required branches.
  - Live verification on 01-Oct-2026 returned `allPassed: true`; generated `BDG-000001`; invalid Employee_ID, invalid Project_ID, invalid Amount, Used > Given, Returned > To Be Returned, missing Purpose, and already-ID'd rows were rejected; persistence/locking and no generic edit issuance passed.
  - R58 evidence: `EMP-000001` accepted; `MBR-000001` explicitly rejected before ID generation.
  - Cleanup passed: final last row returned to header-only and pre-existing records were preserved.
- **A4-03 Employee Spending / Expense Processing: IMPLEMENTED IN GITHUB — FORM-ORIGINATED; R57 DIRECT-SHEET WORKFLOW DOES NOT APPLY — LIVE-VERIFIED.**
  - Frozen Phase 3 architecture confirms ordinary employees submit spending strictly through FRM-02; `Employee_Spending_Responses` is intake-only and `Employee_Spending` is authoritative.
  - `Phase-4/Automation/Core/a4_03_expense_processing.gs` implements controlled FRM-02 processing and automatic SPN generation through A4-00.
  - Resolves the respondent's explicit Employee Email ID to canonical `Employee_ID`; `Member_Record_ID` is never accepted as employee identity.
  - Resolves human-facing Project Name to canonical `Project_ID`.
  - Does not add a Generate Spending ID menu, onEdit ID issuance, Save/Process UX, Form, tab, or schema column.
  - Live verification on 01-Oct-2026 returned `allPassed: true`.
  - Verified exact 10-column `Employee_Spending` schema, required workbook/sheet resolution, canonical Employee_ID and Project_ID resolution, A4-00 SPN availability, no SPN sequence consumption by the test, no onEdit ID issuance, R58 rejection of Member_Record_ID, and preservation of production data.
- **A4-01 trigger hardening: IMPLEMENTED in GitHub.**
  - Spreadsheet-level onFormSubmit trigger ignores non-Projects_Responses sheets instead of throwing A4_01_WRONG_SHEET.

## Phase 4 immediate focus
1. **OOP_Claims — next.** Confirm its authoritative creation path and implement/verify according to that path; do not incorrectly apply R57 if it remains Form-originated.
2. Continue A4-01/A4-02 live verification and the controlled FRM-01 end-to-end test.
3. Continue R54 attachment routing and remaining Phase 4 workflows.
4. Use Budget_Given + Employee_Spending evidence to strengthen the R58 financial employee-identity acceptance gate; do not mark overall R58 PASS until all applicable money workflows are verified.

## Rule
Do not mark Phase 4 complete because documentation exists. Completion requires observable implementation and verification.

### R58 — Financial employee identity invariant
**FROZEN IN GITHUB.** Employee-related money records use the canonical `Employee_ID` as the employee identity reference: Budget_Given (`Recipient Employee_ID`), Employee_Spending (`Employee_ID`), OOP_Claims (`Employee_ID`) and Salary_Admin (`Employee_ID`). `Member_Record_ID` is strictly a project-membership identifier and must not be substituted for Employee_ID. Investments remains the explicit exception under the frozen Phase 3 schema (`Source_Person`).
