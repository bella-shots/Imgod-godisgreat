# A4-08 Report Generator — Locked Build Specification

**Status:** LOCKED FOR IMPLEMENTATION — 2026-10-01  
**Module:** A4-08  
**Acceptance:** P4-10  
**Implementation file:** `Phase-4/Automation/Core/a4_08_report_generator.gs`

## 1. Source of truth

This specification is derived from the current frozen Phase 3 contracts and Phase 4 rules:

- Phase 3 Schema Blueprint — R32, R37, R38, R39, R40, R41, R44
- Phase 3 Data Rules — report authorization, period and source-date rules
- Phase 3 Forms Map — FRM-06
- Phase 3 Revision Log — latest approved report revisions
- Phase 3 Report_Index schema
- Phase 4 Automation Modules — A4-08
- Phase 4 Build / Business Rules / Error Handling
- Phase 4 Access Security

Historical or superseded report definitions must not be used.

## 2. A4-08 boundary

A4-08 is responsible for:

1. Receiving/processing an authorized FRM-06 report request or authorized admin report action.
2. Validating the request.
3. Resolving the requester to the canonical employee record.
4. Resolving Project Name to canonical Project_ID when required.
5. Determining the requester's existing authorization and permitted data scope.
6. Selecting only authorized source records and fields.
7. Applying the frozen inclusive reporting period.
8. Building the requested report from the authorized dataset.
9. Making the generated report available for in-system View.
10. Providing user-initiated Download from the same authorized dataset/content.
11. Saving the generated report artifact in `MASTER COMPANY/Reports`.
12. Registering the generated artifact in `Report_Index`.
13. Handling retries, duplicate submissions, failures and schema/access errors safely.

A4-08 must NOT redesign Phase 3 schemas, add Forms/tabs/fields, bypass permissions, export raw workbooks, or create a second database.

## 3. FRM-06 request contract

FRM-06 respondent-facing inputs are exactly:

1. **Employee Email ID**
2. **Report Type**
   - Company Summary
   - Project Report
   - Finance Report
   - HR Report
3. **Period**
   - Short answer
   - Exact format: `YYYY-MM-DD to YYYY-MM-DD`
   - Start and end dates inclusive
4. **Project Name**
   - Conditional only for Project Report
   - Human-facing Project Name
   - Never request Project_ID

Do not expose Report_ID, Project_ID, Drive_URL, Status, Generated_Date, Submission_ID or other Phase 4 processing fields to respondents.

## 4. Period contract

A4-08 must validate:

- Exact `YYYY-MM-DD to YYYY-MM-DD` format.
- Real calendar dates.
- Start date <= end date.
- Inclusive start/end boundaries.

Authoritative source dates:

| Source | Date used |
|---|---|
| Projects | Created_At, Start_Date, Event_Date |
| Project_Members | Assigned_Date |
| Project_Notes | Date |
| Project_MOM_Index | Meeting_Date |
| Budget_Given | Date |
| Employee_Spending | Date |
| OOP_Claims | Date |
| Salary_Admin | Month; include a salary month when its YYYY-MM month intersects the requested range |
| Investments | Taken_Date / Actual_Return_Date where applicable |
| HR_Admin | Submitted_At; Processed_At for processing/completion metrics |
| Employees | Joining_Date for joiner activity |

Current snapshot metrics such as current project Status and current active employee count remain current snapshots. A4-08 must not invent historical status reconstruction.

## 5. Global authorization contract

Authorization is evaluated BEFORE selecting report records or restricted fields.

Required sequence:

**requester identity → canonical Employee_ID → existing authorization/scope → permitted records/fields → authorized dataset → report**

Rules:

- A report request grants no new permission.
- Report Type cannot grant permission.
- Period cannot grant permission.
- Project Name cannot grant permission.
- Download cannot grant permission.
- User-supplied employee name/email cannot be used to bypass requester scope.
- `Employees.Role` and `Employees.Designation` are not authorization fields by themselves.
- Underlying Google Sheets/Drive permission boundaries remain authoritative.
- Raw source workbooks are never report outputs.

## 6. Company Summary — R38 frozen presentation

Exact presentation order:

1. Report Header
2. Executive Company Snapshot
3. Projects & Operations
4. Finance Summary — authorized categories only
5. HR Summary — authorized categories only
6. Access Notice

There is NO separate “Period Activity / Key Counts” section.

### Executive Company Snapshot / Projects & Operations

Use authoritative Projects data:

- Total projects currently registered.
- Current project count by Status: Draft, Active, On Hold, Completed, Cancelled.
- Projects created during requested period.
- Projects with Start_Date in requested period.
- Projects with Event_Date in requested period.
- Published/revised MOM count for period.
- Published Project Notes count for period.

Current Status counts are snapshots.

### Finance Summary

Only authorized categories:

- Budget Given: count, total Amount, Status breakdown.
- Employee Spending: count, total Amount, Status breakdown.
- OOP Claims: count, total claimed Amount, total Approved_Amount, Status breakdown, paid amount where determinable.
- Salary/Payroll: only where already authorized; Due_Amount, Paid_Amount, Pending_Carry_Forward, record count, Status breakdown.
- Investments: only where already authorized; count, total Amount, Status breakdown.

Do not expose unauthorized individual salary/investment records.

### HR Summary

Only authorized information:

- Current Active employee count.
- Current employee count by Employment_Status.
- Current employee count by approved Role where aggregate visibility is authorized.
- Employees whose Joining_Date falls within the requested period.
- Reimbursement-eligible employee count where authorized.
- HR requests submitted during period.
- Request count by Request_Type.
- Request count by Status.
- Completed request count using Processed_At and Status = Completed.

Never expose restricted Salary_Basis, HR_Notes, attachments or confidential employee-level records merely because Company Summary was requested.

## 7. Project Report — R39 frozen presentation

Exact presentation order:

1. Report Header
2. Project Overview
3. Project Team
4. Project Activity & Documentation
5. Project Finance Summary — authorized project-linked finance only
6. Access Notice

### Project Overview

Show:

- Project_ID
- Project_Name
- Description
- Owner
- Start_Date
- Event_Date
- current Status
- Created_At

Project Name must resolve to Project_ID using the existing exact/case-sensitive Projects.Project_Name rule.

### Project Team

Only authorized active project-member information:

- authorized active member count
- authorized member identity
- Project_Role
- Active
- Assigned_Date

### Project Activity & Documentation

Project Notes:

- linked to requested Project_ID
- Status = Published
- Date
- authorized author identity
- Note content

MOM:

- linked to requested Project_ID
- Status = Published or Revised
- Meeting_Date
- Title
- Participants
- Version
- Status

Do not use raw document/attachment URLs as a permission bypass.

### Project Finance Summary

Authorized project-linked records only:

- Budget_Given: count, total Amount, Status breakdown.
- Employee_Spending: count, total Amount, Status breakdown.
- OOP_Claims: count, total claimed Amount, total Approved_Amount, Status breakdown, paid amount where determinable.

Salary/Payroll and Investments are NOT ordinary Project Report content.

## 8. Finance Report — R41 frozen presentation

Exact presentation order:

1. Report Header
2. Finance Summary
3. Budget Given
4. Employee Spending
5. OOP Claims
6. My Salary / Payroll
7. Access Notice

### Finance Summary

From the same authorized detailed dataset:

- Budget Given count + total Amount.
- Employee Spending count + total Amount.
- OOP Claims count + total claimed Amount + total Approved_Amount.
- My Salary/Payroll count + total Due + total Paid + total Pending Carry-Forward.

### Budget Given

Show authorized records:

- Date
- Amount
- Purpose
- Project
- Status

No Proof_URL merely because Finance Report was selected.

### Employee Spending

Show authorized records:

- Date
- Amount
- Recipient / Vendor
- Purpose
- Project
- Status

No Attachment_URL merely because Finance Report was selected.

### OOP Claims

Show authorized records:

- Claim Date
- Purpose
- Project
- Claimed Amount
- Approved Amount
- Status
- Paid Date when applicable

Use OOP_Claims.Date. Do not expose Proof_URL or OOP_Rule_Flag merely because Finance Report was selected.

### My Salary / Payroll

Every employee may see their own authorized Salary_Admin records:

- Month
- Due Amount
- Paid Amount
- Pending Carry-Forward
- Status

Other employees' payroll requires separate authorization.

### Explicit exclusion

**Investments are NOT part of the standard Finance Report.**

## 9. HR Report — R44 frozen presentation

Exact presentation order:

1. Report Header
2. Employee / HR Profile
3. HR Requests
4. HR Request Summary
5. Access Notice

### Employee / HR Profile

Use only authorized fields from Employees:

- Employee_ID
- Name
- Email
- Role
- Designation
- Active
- Reimbursement_Eligible
- Project_Access where authorized
- Joining_Date
- Employment_Status
- Reimbursement_Settings where authorized
- Created_At where authorized
- Salary_Basis only under its explicit authorization rule
- HR_Notes only for explicitly authorized HR/Admin users

### HR Requests

Use only HR_Admin:

- HR_Request_ID
- Employee_ID / resolved employee identity
- Request_Type
- Relevant_Details
- Status
- Submitted_At
- Processed_At when populated
- Processed_By when populated and authorized
- Attachment_URL only when authorized

### HR Request Summary

- Total authorized requests in period.
- Count by Request_Type.
- Count by Status.
- Completed count using Processed_At where Status = Completed.

### Authorization

- Team Member / Contractor: own authorized profile + own HR requests.
- Project Lead: explicitly authorized project/scope only.
- Manager: authorized management scope only.
- HR Admin: authorized company-wide HR scope, including restricted fields where policy permits.
- Administrator / Site Admin: company-wide within administrator authorization.

Role/Designation alone must not be treated as authorization.

## 10. View + Download — R32 mandatory contract

All four report types use the same delivery model:

**Report request → authorization → authorized dataset → in-system View → optional user-initiated Download**

Requirements:

- Report must be directly viewable in the system.
- Display must expose a **Download Report** action.
- Download is not automatic.
- Download must be generated from the exact same authorized dataset/content displayed on screen.
- Download must not independently query unrestricted source workbooks.
- Download must not add fields, rows, records, hidden data or source-workbook content.
- Raw workbook exports are prohibited.

### Download artifact

Phase 4 implementation choice: generate a PDF artifact from the same authorized report model/content and store it under:

`MASTER COMPANY/Reports`

The Report_Index Drive_URL points to that generated report artifact.

## 11. Report_Index contract

Authoritative workbook: `MASTER_COMPANY_ADMIN`.

Exact 7-column order:

1. `Report_ID`
2. `Report_Type`
3. `Period`
4. `Project_ID`
5. `Drive_URL`
6. `Status`
7. `Generated_Date`

Rules:

- Report_ID generated through A4-00 using RPT prefix.
- Report_ID format: `RPT-000001`.
- Project_ID populated for Project Report; otherwise blank unless the frozen contract explicitly requires a project scope.
- Status uses only frozen values: Draft, Published, Archived.
- Generated_Date uses YYYY-MM-DD.
- Do not add columns.
- Do not store raw report data in Report_Index.

## 12. A4-00 integration

A4-08 must use the existing central ID generator for Report_ID.

It must NOT:

- create its own counter,
- derive IDs from row numbers,
- use timestamp IDs,
- manually increment Report_Index,
- generate IDs from Project_ID or employee identity.

Duplicate/idempotency protection must prevent the same report request/source event from creating duplicate authoritative report records.

## 13. Drive behavior

- Generated reports belong under the authoritative `MASTER COMPANY/Reports` container.
- A4-08 must locate/reuse the approved Reports container.
- Do not create duplicate top-level business folders.
- Do not silently substitute another folder if the approved destination is missing/ambiguous/inaccessible.
- Drive permission failures must surface a controlled failure/manual-review state.
- Report_Index stores the generated Drive_URL.

## 14. Failure and retry behavior

A4-08 must follow Phase 4 failure-safety rules:

- Invalid/missing required data → reject before report commit/ID issuance.
- Invalid Project Name → stop; never guess.
- Invalid Period → stop.
- Unauthorized report scope → stop; do not broaden access.
- Schema mismatch → stop affected report generation.
- Drive failure → source request remains intact; no Published success state.
- Duplicate trigger → idempotency check before side effects.
- A4-00 collision/concurrency → use central generator and LockService; never reuse an issued ID.
- If Report_ID is issued but a later commit fails, do not reuse the ID; preserve recoverable state and log/manual-review condition.
- No uncontrolled retry loops.

## 15. Required implementation structure

The A4-08 code should separate these concerns:

1. Request intake/normalization.
2. Schema/resource resolution.
3. Requester identity resolution.
4. Authorization/scope evaluation.
5. Period parsing/validation.
6. Report-specific authorized dataset builders.
7. Report presentation/model builders.
8. View payload generation.
9. Download artifact generation.
10. Report_Index registration.
11. Idempotency/retry protection.
12. Failure logging and safe recovery.
13. Non-destructive verification helpers.

Do not place authorization checks after report data has already been assembled from unrestricted sources.

## 16. Mandatory acceptance coverage for P4-10

Before P4-10 can be PASS, live verification must demonstrate at minimum:

1. FRM-06 request validation.
2. Correct four report-type routing.
3. Exact Period validation and inclusive filtering.
4. Company Summary R38 exact section order/content.
5. Project Report R39 exact section order/content.
6. Finance Report R41 exact section order/content.
7. HR Report R44 exact section order/content.
8. Project Name → Project_ID resolution.
9. Unauthorized project request rejection.
10. Requester authorization is evaluated before source selection.
11. Restricted Finance fields are not exposed.
12. Restricted HR fields are not exposed.
13. Salary_Basis restrictions work.
14. HR_Notes restrictions work.
15. Investments are excluded from standard Finance Report.
16. View output contains only authorized data.
17. Download contains exactly the same authorized data as View.
18. Raw workbook/source export is impossible through the report flow.
19. Report_ID comes from A4-00.
20. Report_Index exact 7-column contract is preserved.
21. Generated report is stored under MASTER COMPANY/Reports.
22. Duplicate request/trigger does not create duplicate report records.
23. Drive failure leaves a safe recoverable state.
24. Schema mismatch is detected rather than guessed around.
25. Pre-existing production data is preserved during testing.
26. Temporary test artifacts are cleaned up.

## 17. Explicit prohibitions

A4-08 must NOT:

- create or modify Phase 3 workbook schemas;
- add FRM-06 questions;
- add Report_Index columns;
- expose raw workbook tabs;
- expose unrestricted Finance data;
- expose unrestricted HR data;
- expose another employee's salary merely because Finance/HR Admin access exists;
- expose HR_Notes to ordinary employees/managers;
- expose Proof_URL or Attachment_URL merely because a report was requested;
- include Investments in standard Finance Report;
- use Role/Designation alone as an authorization decision;
- let Project Name or Download expand permissions;
- create a second report database;
- create a second ID generator;
- issue Report_ID from onEdit/autosave/row position;
- silently invent missing source fields;
- silently create replacement business assets when the approved Drive destination is missing/ambiguous.

## 18. Lock statement

This document is the **A4-08 implementation contract**.

Implementation must follow this specification exactly unless a later, explicitly approved Phase 3/Phase 4 revision supersedes a rule.

**No A4-08 production code should be written against earlier report drafts or historical R27–R36 wording.**

**Current state after this specification:** A4-08 remains NOT STARTED. This document locks the build contract; it does not constitute implementation or P4-10 PASS.
