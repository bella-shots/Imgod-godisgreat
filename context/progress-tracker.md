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
- **Project_Members R57 workflow: IMPLEMENTED IN GITHUB — LIVE VERIFICATION PENDING.**
  - New `Phase-4/Automation/Core/a4_14_project_member_sheet_workflow.gs`.
  - Existing 7-column `Project_Members` schema is enforced.
  - User selects the pending row and uses `Project Member Actions → Generate Project Member ID`.
  - The single action validates required Project_ID/Employee_ID/Active values, validates approved Project_Role/Access_Level values when populated, verifies the referenced Project and Employee exist, rejects duplicate Project_ID + Employee_ID mappings, invokes A4-00, writes and locks `MBR-000001`-style ID, and finalizes the row.
  - No generic onEdit/autosave ID generation.
  - A4-01 Form processing remains automatic and separate; R57 does not alter FRM-01 behavior.
- **A4-01 trigger hardening: IMPLEMENTED in GitHub.**
  - Spreadsheet-level onFormSubmit trigger now ignores non-Projects_Responses sheets instead of throwing A4_01_WRONG_SHEET.

## Phase 4 immediate focus
1. Live-verify the new Project_Members R57 workflow in the existing Phase 4 Apps Script project.
2. Confirm A4-00 MBR generation, ID locking, validation rejection and duplicate-mapping protection.
3. Do not mark P4-21/P4-25/P4-26 PASS until live evidence exists.
4. After Project_Members passes, implement R57 for Project_Notes, then Budget_Given, Employee_Spending, OOP_Claims, Salary_Admin and Investments one workflow at a time.
5. Live-verify A4-00 after the NOT-prefix correction using controlled test data.
6. Continue A4-01/A4-02 live verification and the controlled FRM-01 end-to-end test.
7. Continue R54 attachment routing and remaining Phase 4 workflows.

## Rule
Do not mark Phase 4 complete because documentation exists. Completion requires observable implementation and verification.


### R58 — Financial employee identity invariant
**FROZEN IN GITHUB.** Employee-related money records use the canonical `Employee_ID` as the employee identity reference: Budget_Given (`Recipient Employee_ID`), Employee_Spending (`Employee_ID`), OOP_Claims (`Employee_ID`) and Salary_Admin (`Employee_ID`). `Member_Record_ID` is strictly a project-membership identifier and must not be substituted for Employee_ID. Investments remains the explicit exception under the frozen Phase 3 schema (`Source_Person`).
