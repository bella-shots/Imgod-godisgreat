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
- Authoritative implementation prompt: `Phase-3/ChatGPT Prompt/Prompt-006.md`
- Prompt-001, Prompt-002 and Prompt-003 remain historical and are not overwritten.
- Prompt-005 records historical running changes R20 through R23. Prompt-006 freezes the R49 universal stable ID generation revision. R20 moves cross-domain `Report_Index` and `Submission_Index` into the restricted `MASTER_COMPANY_ADMIN` workbook; R21 corrects the human-facing Form identity boundary; R22 makes FRM-05 Project Name a free Short answer; R23 removes the recurring salary Form and makes `Salary_Admin` the payroll ledger. R19 and R18 remain in force. The authoritative/support count is 13 and the applicable/native response count is 7, for 20 physical tabs after all applicable Forms are linked.

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
- Locked the current respondent-facing FRM-06 fields: Employee Email ID (required short answer), Report Type (required multiple choice), Period (required short answer), and conditional Project Name (short answer for project-specific reports). Recipient Email is removed.
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


## R32 — Current reporting contract

- **Status:** FROZEN FOR PHASE 4 IMPLEMENTATION
- All FRM-06 report types must be generated as authorized human-readable reports.
- Reports are displayed directly in the system; users are not required to download to view them.
- Each displayed report provides a user-initiated Download Report action.
- Download uses the same authorized report result and cannot expose more data than the displayed report.
- Raw source workbooks are not report outputs.
- Exact download format remains a Phase 4 implementation detail.


## R32 — Current reporting contract

- **Status:** FROZEN FOR PHASE 4 IMPLEMENTATION
- All FRM-06 report types must be generated as authorized human-readable reports.
- Reports are displayed directly in the system; users are not required to download to view them.
- Each displayed report provides a user-initiated Download Report action.
- Download uses the same authorized report result and cannot expose more data than the displayed report.
- Raw source workbooks are not report outputs.
- Exact download format remains a Phase 4 implementation detail.
\n\n### R33 — FRM-06 Period field description clarification\n\nFor the respondent-facing FRM-06 **Period** field:\n\n> **Enter the reporting period for which you want the report. Use YYYY-MM for a monthly report (e.g., 2026-09) or YYYY-QN for a quarterly report (e.g., 2026-Q3).**\n\nThe field remains a **required Short answer** and is not a Date question. This clarification did not change the field types or reporting-period semantics at the time. R34 subsequently revises the FRM-06 field set by adding the required Employee Email ID requester-identity field.

### R34 — FRM-06 requester identity and alternate-account handling (historical; superseded by R35)

R34 revised R27 for FRM-06 requester identity. The Form must explicitly capture the requester's **Employee Email ID** because the Google account used to open/submit the Form may differ from the employee's company identity.

The R34 historical respondent-facing FRM-06 field set was:

| # | Field | Type | Required |
|---|---|---|---|
| 1 | Employee Email ID | Short answer | Yes |
| 2 | Report Type | Multiple choice | Yes |
| 3 | Period | Short answer | Yes |
| 4 | Project Name | Short answer | Conditional / only when a project-specific report is requested |

**Employee Email ID description:**
> Enter your company Employee Email ID. This is used to identify your employee record for report authorization. Do not enter your Employee ID.

Phase 4 resolves the submitted Employee Email ID against authoritative `Employees.Email` to obtain the canonical `Employee_ID` and the employee's authoritative `Role`. The respondent does not select or enter Employee_ID or Designation/Role.

If Google Forms captures a signed-in Google account email and it differs from the submitted Employee Email ID, the captured login email is audit metadata only. It must not override the explicit Employee Email ID. A mismatch must go to validation failure/manual review or the defined correction workflow before report generation. No silent identity substitution is permitted.

**Report Type** remains a required Multiple choice with exactly:
- Company Summary
- Project Report
- Finance Report
- HR Report

**Period** remains a required Short answer with this description:
> Enter the reporting period for which you want the report. Use YYYY-MM for a monthly report (e.g., 2026-09) or YYYY-QN for a quarterly report (e.g., 2026-Q3).

**Project Name** remains a conditional Short answer for project-specific reports. **CAUTION — CASE-SENSITIVE:** Enter the Project Name **exactly as it appears in the authoritative `Projects.Project_Name` field**, including capitalization, spaces, spelling, and punctuation. The value is case-sensitive and must be an exact match for Phase 4 resolution. Do not ask for or enter `Project_ID`. Do not provide a hard-coded project-name choice list.

There is no respondent-facing Recipient Email field. Reports are displayed in the system and may be downloaded by the requester; report delivery to an arbitrary email address is not part of FRM-06.

Do not add respondent-facing Employee_ID, Designation/Role, Report_ID, Project_ID, Drive_URL, Status, Generated_Date, Submission_ID, or other Phase 4 processing fields.

This revision changes the FRM-06 respondent-facing field count from five to four. It does not change the authoritative workbook schemas, Report_Index schema, report types, or the Phase 4 authorization boundary.


## R36 session note

- Added an explicit **CAUTION — CASE-SENSITIVE** rule for FRM-06 Project Name.
- The respondent must enter the project name exactly as it appears in authoritative Projects.Project_Name, including capitalization, spaces, spelling, and punctuation.
- Phase 4 must require an exact match for Project Name resolution; no silent case-insensitive, fuzzy, trimmed, normalized, or approximate project selection is permitted.
- FRM-06 remains four respondent-facing fields: Employee Email ID, Report Type, Period, and conditional Project Name.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.

### R37 — Company Summary report definition is frozen

**Date:** 2026-09-29

**Purpose:** Freeze exactly what FRM-06 **Company Summary** displays and what the user can download.

#### 1. Report Header
Show:
- Report Title: Company Summary
- Reporting Period: exact FRM-06 Period value
- Generated Date
- Requested By: authorized employee identity resolved from Employee Email ID

Do not expose Report_ID, Submission_ID, canonical Employee_ID, or source-workbook URLs in the ordinary user-facing report.

#### 2. Executive Company Snapshot / Projects & Operations
Show:
- Total projects currently registered in Projects.
- Current project count by Status: Draft, Active, On Hold, Completed, Cancelled.
- Projects created during the requested period, using Projects.Created_At.
- Projects with Start_Date in the requested period.
- Projects with Event_Date in the requested period.
- Published/revised MOM count for the period, using Project_MOM_Index.Meeting_Date and reportable status.
- Published project-note count for the period, using Project_Notes.Date with Status = Published.

**Historical-status rule:** Projects.Status is a current master field and Phase 3 has no status-history table. Therefore current Status counts are a **current snapshot**, not a reconstruction of the selected period. The report must never claim otherwise.

#### 3. Finance Summary — authorization controlled
Only show Finance categories already authorized for the requester.

**Budget Given:** record count; total Amount; count/amount by Status, using Budget_Given.Date for period filtering.

**Employee Spending:** record count; total Amount; count/amount by Status, using Employee_Spending.Date.

**OOP Claims:** record count; total claimed Amount; total Approved_Amount; count/amount by Status; paid amount where determinable from the authoritative schema and Status = Paid, using OOP_Claims.Date.

**Salary / Payroll:** only for roles already authorized for salary/payroll. Show period Due_Amount, Paid_Amount, Pending_Carry_Forward totals; payroll record count; Status breakdown. Do not expose employee-level salary rows unless separately authorized.

**Investments:** only for roles already authorized for investment information. Show period-relevant record count, total Amount, and Status breakdown. Do not expose Source_Person, Notes, or individual rows in the standard Company Summary unless separately authorized.

Unauthorized Finance categories are omitted; they are never substituted with unrestricted source data.

#### 4. HR Summary — authorization controlled
Only show HR information within the requester's existing authorization.

**Employee snapshot:**
- Current Active employee count.
- Current employee count by Employment_Status.
- Current employee count by approved Role where role-level aggregates are authorized.
- Employees whose Joining_Date falls within the requested period.
- Reimbursement-eligible employee count where authorized.

**HR workflow activity:**
- HR requests submitted during the period using HR_Admin.Submitted_At.
- Request count by Request_Type.
- Request count by Status.
- Completed HR requests during the period using Processed_At and Status = Completed.

Never expose Salary_Basis, HR_Notes, employee-level confidential HR records, attachments, or other restricted fields merely because Company Summary was selected.

#### 5. Required presentation order
1. Report Header
2. Executive Company Snapshot
3. Projects & Operations
4. Finance Summary — authorized categories only
5. HR Summary — authorized categories only
6. Access Notice

Access Notice: the report contains only information permitted by the requester's existing authorization scope.

Unauthorized sections/categories are omitted rather than shown as empty restricted placeholders.

#### 6. What Company Summary must NOT contain
- Raw workbook tabs or workbook exports.
- Unrestricted employee-level Finance or HR records.
- Unauthorized Salary_Basis.
- HR_Notes.
- Unauthorized individual salary records.
- Unauthorized individual investment records.
- Drive proof/attachment URLs.
- Internal processing fields.
- Invented fields absent from the authoritative Phase 3 schemas.

#### 7. Period rules
- Date-range `YYYY-MM-DD to YYYY-MM-DD`: applicable dated activity whose authoritative date falls within the inclusive requested range.
- Projects.Created_At = project creation activity.
- Projects.Start_Date = project-start activity.
- Projects.Event_Date = event/delivery-date activity.
- Project_MOM_Index.Meeting_Date = MOM activity.
- Project_Notes.Date = note activity.
- Budget_Given.Date = Budget Given activity.
- Employee_Spending.Date = Employee Spending activity.
- OOP_Claims.Date = OOP activity; OOP_Claims.Month remains authoritative and must be consistent with the claim date.
- Salary_Admin.Month = payroll activity.
- Investments.Taken_Date and Actual_Return_Date = applicable investment activity.
- HR_Admin.Submitted_At = HR-request activity; Processed_At = processing/completion activity.
- Employees.Joining_Date = joiner activity. Current employee snapshot counts are not retroactively reconstructed for past periods because no employee-history table exists.

#### 8. View + Download
After generation, Company Summary must be viewable directly in the system and provide **Download Report**.

The downloaded report must contain the **same authorized content and values shown on screen**. It must not add rows, fields, hidden data, workbook tabs, or unrestricted source information.

Exact download file format remains a Phase 4 implementation choice under R32. PDF is permitted and fits the existing Report_Index.Drive_URL cataloguing model.

#### 9. Authorization invariant
Company Summary is a reporting view, not an authorization mechanism.

Phase 4 must:
1. resolve requester from Employee Email ID;
2. determine authoritative employee record and role;
3. determine authorized data scope;
4. select only permitted source records/fields;
5. calculate the report from that authorized dataset;
6. display the authorized result;
7. generate the download from that same authorized result; and
8. register the generated report in Report_Index.

No report request, Period, Project Name, or download action may expand permissions.

**R37 closes the previously undefined Company Summary content. It does not change the FRM-06 respondent-facing fields, workbook schemas, R32 View + Download contract, R29 Finance authorization, R31 HR authorization, or Phase 4 ownership of implementation.**

### R38 — Company Summary presentation corrected
The redundant standalone “Period Activity / Key Counts” section has been removed. Period-specific information remains embedded in the relevant Projects & Operations, Finance Summary, and HR Summary sections.

R38 does not advance Phase 3 to Phase 4. Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED.


## R39 session note — Project Report frozen
- Project Report is now fully defined and frozen for Phase 4.
- Frozen output order: Report Header; Project Overview; Project Team; Project Activity & Documentation; Project Finance Summary; Access Notice.
- Project Report uses only existing Phase-3 schemas and existing authorization.
- Project Name exact case-sensitive resolution remains mandatory.
- Project Report does not grant project/Finance/HR permissions.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Finance Report and HR Report are not being finalized in R39.

### R40 — FRM-06 universal exact date-range Period format

**Decision:** The respondent-facing **FRM-06 Period** field now uses one standard format for **all four report types**: Company Summary, Project Report, Finance Report, and HR Report.

**Required format:**
`YYYY-MM-DD to YYYY-MM-DD`

**Example:**
`2026-07-01 to 2026-09-30`

This is a required **Short answer** field, not a Google Forms Date question.

**Period semantics:**
- The start date and end date are both inclusive.
- The start date must be on or before the end date.
- The requested period is an exact calendar date range.
- A report must include period-filtered records whose authoritative activity date falls within that inclusive range.
- This replaces the active use of monthly `YYYY-MM` and quarterly `YYYY-QN` formats for FRM-06. Earlier monthly/quarterly wording in R33/R34 and earlier specifications remains historical revision history and is superseded for current implementation by R40.
- The same date-range rule applies regardless of report type; users do not use different Period formats for Company Summary, Project Report, Finance Report, or HR Report.

**Authoritative source-date rules:**
- `Projects.Created_At`, `Start_Date`, and `Event_Date` use their corresponding dates.
- `Project_Notes.Date` filters project notes.
- `Project_MOM_Index.Meeting_Date` filters MOM activity.
- `Budget_Given.Date` filters Budget Given activity.
- `Employee_Spending.Date` filters Employee Spending activity.
- `OOP_Claims.Date` filters OOP activity; `OOP_Claims.Month` must remain consistent with the claim date.
- `Salary_Admin.Month` is month-based. Include a salary record when its `YYYY-MM` calendar month intersects the requested date range.
- `Investments.Taken_Date` and `Actual_Return_Date` are used for applicable investment activity.
- `HR_Admin.Submitted_At` filters HR request submissions; `Processed_At` is used for processing/completion activity.
- `Employees.Joining_Date` filters joiner activity.
- Current snapshot metrics, such as current project Status or current active employee count, remain current snapshots and are not reconstructed historically.

**Project Report example:** If Project A has Published Project Notes dated July, August, and September 2026, a request for `2026-07-01 to 2026-09-30` includes all qualifying Published notes in that entire range.

**Validation:** Phase 4 must validate the Period format before report generation. Invalid dates, impossible calendar dates, reversed ranges, or malformed separators must fail validation/manual review according to the existing submission workflow.

**No new Form field is added.** The existing FRM-06 Period field is simply standardized to the R40 date-range format.

## R41/R42 status update — 2026-09-29
Finance Report: **DEFINED + FROZEN (R41)** — explicitly approved.
HR Report: **DRAFT / NOT FROZEN (R42)** — pending user review and explicit approval.
Company Summary: FROZEN (R37/R38).
Project Report: FROZEN (R39).
FRM-06 Period: FROZEN exact date range (R40).

All completed report contracts must remain frozen until a new revision is explicitly approved. Phase 3 remains HUMAN ACTION REQUIRED for live Google Sheet/Form verification. Phase 4 implementation remains blocked until the remaining Phase 3 gate is satisfied.

## R43 — Finance Report OOP Claims presentation correction
Finance Report R41 has been updated by R43 to remove the redundant user-facing `OOP_Claims.Month` field. The report displays Claim Date instead. `OOP_Claims.Month` remains in the authoritative source schema for internal processing/reconciliation.

R43 does not change FRM-06 fields, workbook schemas, period filtering, authorization, or the Phase 4 boundary.

## R44 — HR Report definition frozen
**Date:** 2026-09-29

HR Report is now explicitly reviewed, defined and approved as a frozen Phase-3 contract.

### Approved presentation
1. **Report Header**
   - Report Type
   - Requested Period
   - Generated Date
   - Requested By
   - Employee/Scope context when applicable and authorized

2. **Employee / HR Profile**
   - Employee_ID
   - Name
   - Email
   - Role
   - Active
   - Reimbursement_Eligible
   - Project_Access, only where authorized
   - Joining_Date
   - Employment_Status
   - Reimbursement_Settings, only where authorized
   - Created_At, only where authorized
   - Salary_Basis — the employee's own agreed compensation basis/CTC may be shown to that employee; HR Admin/Administrator may view it within authorized scope; other employees require separate authorization
   - HR_Notes only for explicitly authorized HR/Admin users; not ordinary employee/manager report content

3. **HR Requests**
   - HR_Request_ID
   - Employee_ID / resolved employee identity
   - Request_Type
   - Relevant_Details
   - Status
   - Submitted_At
   - Processed_At, when populated
   - Processed_By, when populated and authorized
   - Attachment_URL only when the requester is authorized to access the supporting document

4. **HR Request Summary**
   - Total authorized HR requests in the requested period
   - Request count by Request_Type
   - Request count by Status
   - Completed request count, using Processed_At where populated and Status = Completed

5. **Access Notice**
   - States that the report contains only HR information the requester is authorized to access.
   - Restricted employee data, Salary_Basis, HR_Notes, attachments and other confidential fields are omitted unless the requester's authorization explicitly permits them.

### Source and period rules
- Employee profile information comes only from the authoritative Employees schema.
- HR workflow information comes only from the authoritative HR_Admin schema.
- For HR requests, HR_Admin.Submitted_At is the primary period-filtering field; Processed_At may be used for processing/completion metrics.
- Employee Joining_Date and Created_At may be used for explicitly defined period-sensitive profile metrics.
- R40 applies: the requested Period is YYYY-MM-DD to YYYY-MM-DD, inclusive.
- Current employee fields such as Active and Employment_Status are current snapshots; the report does not reconstruct historical employee status because no status-history table exists.

### Authorization
- Team Member / Contractor: own authorized employee profile information and own HR requests only.
- Project Lead: only explicitly authorized project/scope information and permitted fields; role alone does not grant salary/CTC, HR Notes or unrestricted HR access.
- Manager: authorized management scope only; role alone does not grant unrestricted salary/CTC, HR Notes or all employee records.
- HR Admin: authorized company-wide HR information, including HR workflow records and restricted fields where the HR role permits them.
- Administrator / Site Admin: company-wide information within administrator authorization.
- Requester identity is resolved from the submitted Employee Email ID and authenticated account context; supplying another employee's email/name cannot expand access.
- Selecting HR Report cannot grant or expand permissions.
- The report is a permission-controlled HR report, not an export of MASTER_COMPANY_HR_ADMIN.

### Delivery
- R32 View + Download applies.
- Downloaded content must match the authorized on-screen report.
- No raw workbook export.
- No new FRM-06 fields or Phase-3 schemas are introduced.
- No report request, Period, Project Name or download action can expand permissions.

**R44 is frozen. Phase 4 may implement the HR Report only according to this contract. Further changes require a new revision and explicit approval.**

## R45 — Compensation/payroll architecture correction
The compensation model now supports Monthly and One-Time arrangements. Employees.Payment_Frequency and Salary_Admin.Payment_Frequency are authoritative; Salary_Admin.Month applies to Monthly records, while Payment_Date supports One-Time payments. Employee self-service includes their own Salary_Basis/CTC and Payment_Frequency.


## R46 session note
- Corrected the Employees schema so `Role` means the employee's functional responsibility / what they do.
- Added `Designation` as the employee's company level/position.
- HR Report Employee / HR Profile now includes both Role and Designation when authorized.
- Role and Designation are not authorization/access fields; Phase 4 must not infer permissions from either alone.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.


## R47 — Budget_Given spending and return tracking
Replaced the old Budget_Given status model (`Disbursed`, `Partially Reconciled`, `Reconciled`, `Returned`) with a simple calculated money-flow model. `Amount Given INR` and `Used Amount INR` determine calculated `To Be Returned INR`; `Returned Amount INR` determines calculated `Pending Return Amount INR`; Status is automatically derived as `Pending Return`, `Fully Returned`, or `No Return Required`. Any positive pending amount, including ₹1, remains `Pending Return`. Used Amount cannot exceed Amount Given and Returned Amount cannot exceed To Be Returned. `Recipient Email / Name` is name-or-email, not email-only. No Form, workbook-boundary, Lists_Config, cross-workbook validation, or Phase 4 architecture change.


### Phase 3 R48 — Employee creation workflow frozen
- **Employee entry surface:** MASTER_COMPANY_HR_ADMIN → Employees sheet.
- **Mandatory sequence:** enter details → **GENERATE EMPLOYEE ID** → generated EMP-XXX locked → **SAVE EMPLOYEE**.
- **Save gate:** no employee record may be committed without a valid generated Employee_ID.
- **Canonical reference:** employee-linked authoritative records use Employee_ID; names are display-only for employee identity.
- **Phase 4 dependency:** Apps Script must implement and enforce the Generate-ID and Save controls.


### Phase 3 R48 clarification — Global employee reference rule
- Employee_ID is the canonical key for every employee-linked authoritative record and internal lookup.
- Covered domains: Employee Spending, OOP Claims, Salary Admin, HR Admin, Project Members, Budget Given employee recipients, Reports/internal lookups and future employee-related tables.
- Names remain display attributes; vendor and non-employee investment-source fields are not converted.


### Phase 3 — Finance Budget_Given verification recorded

**Verified / PASS — 2026-09-30:** MASTER_COMPANY_FINANCE → Budget_Given

Verified against the current Phase-3-Schema-Blueprint.md:
- 13-column structure and order
- canonical Recipient Employee_ID
- Used Amount validation
- automatic To Be Returned calculation
- Returned Amount validation
- automatic Pending Return calculation
- automatic Status with the three approved values
- ₹1 pending-return behavior
- returning money does not reduce Used Amount

The remaining Finance authoritative tabs — Employee_Spending, OOP_Claims, Salary_Admin, and Investments — remain pending separate live-sheet verification. Overall Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED.


### Phase 3 — Operations workbook verification recorded

**Verified / PASS:** MASTER_COMPANY_OPERATIONS
- Projects
- Project_Members
- Project_Notes
- Project_MOM_Index

The Operations workbook verification is complete. This is a partial Phase 3 completion milestone only; the overall Phase 3 status remains IN PROGRESS / HUMAN ACTION REQUIRED until the remaining workbook/Form and acceptance gates are completed.


### R49 — Universal stable ID generation frozen
- Phase 3 ID formats are now `PREFIX-000001` with six-digit zero-padded sequences.
- System generation, independent per-prefix counters, immutability, no reuse, gap tolerance, and Employee_ID canonical-reference rules are frozen.
- Phase 4 must implement PropertiesService counters, LockService concurrency protection, existing-ID reconciliation, format validation and idempotency.
- No Phase 3 workbook/form/business-calculation changes were introduced by R49.


### R50 — Employee self-service record retrieval architecture
- **Status:** ARCHITECTURE FROZEN / IMPLEMENTATION PENDING
- After applicable Form submission processing, the generated authoritative business ID must be retrievable by the authorized employee through the company website's **My Records** area.
- The employee-facing layer must resolve the current employee to canonical Employee_ID and enforce record-level authorization.
- Restricted source workbooks remain restricted; My Records is not direct Sheet access.
- No Phase 3 Form field, workbook/tab, ID format, or business calculation changed.
- Phase 4 owns submission-to-authoritative-record linkage and processing; Phase 5 owns My Records UI/retrieval and end-to-end verification.
- Current live status remains unchanged: Phase 3 IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 BLOCKED; Phase 5 BLOCKED.


### R51 — Universal generated-ID visibility
- **Status:** ARCHITECTURE FROZEN / IMPLEMENTATION PENDING
- All 13 generated IDs must be displayed in their corresponding authorized website/module views.
- This includes PRJ, EMP, MBR, NOT, MOM, BDG, SPN, CLM, SAL, INV, HRR, RPT and SUB.
- This does not change Phase 3 schemas/forms, ID generation rules, or permissions.


### R52 — Explicit Generate-ID controls for Sheet-originated records
- R52 — Explicit Generate-ID controls for Sheet-originated records. Status: ARCHITECTURE FROZEN / IMPLEMENTATION PENDING. Project Member (MBR), Project Note (NOT), Budget (BDG) and Salary (SAL) IDs are not generated merely because a row is edited or autosaved. Each requires an explicit controlled Generate-ID action; the generated ID is written to the authoritative row, locked/read-only, and the record cannot be committed without it. Salary supports controlled bulk generation for validated payroll imports/entries. Employee_ID remains unchanged under its existing Generate Employee ID → lock → Save workflow. Submission_ID remains system/index-generated and is not a manual Generate-ID workflow. Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 and Phase 5 implementation remain blocked pending the existing Phase 3 gate.
 

## R54 session note — Form attachment Drive routing frozen
- Frozen the missing Phase 4 Drive-routing contract using the existing Phase 1 folder manifest only.
- FRM-02 Employee Spending receipt/proof → `MASTER COMPANY/Projects/PROJECT_<ProjectName>/03_Expenses`.
- FRM-03 OOP Claim proof → `MASTER COMPANY/Projects/PROJECT_<ProjectName>/03_Expenses`.
- FRM-04 HR supporting document → `MASTER COMPANY/HR`.
- FRM-05 has no file-upload field; MOM artifacts → project `04_MOM`, with `Project_MOM_Index.Drive_URL` recorded.
- FRM-01, FRM-06 and FRM-07 have no attachment-routing workflow under their current schemas.
- Routing is Phase 4 Apps Script behavior; no Phase 3 Form/schema change is required.
- Destination permissions remain authoritative; no public sharing or permission expansion is permitted.
- Duplicate routing must be idempotent; unresolved destination/move failure must preserve the source reference and surface a safe failure/pending state.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked until the Phase 3 gate is formally closed.


## R55 session note
- Repository-wide inspection found no prior authoritative contract specifying the Drive storage location of the four master workbooks, FRM-01 through FRM-07, or the Master Google Site.
- Frozen canonical placement: all four master workbooks, all seven Forms, and the Master Google Site belong in the existing root MASTER COMPANY Drive folder.
- No new Drive folder was introduced and no existing Phase 1 folder was renamed or repurposed.
- Phase 4 now includes A4-15 control-asset placement verification/normalization and acceptance tests P4-33 through P4-38.
- Phase 4 must preserve existing resource identity, content and permissions, must not create duplicates, and must surface failures for human resolution.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains BLOCKED until Phase 3 is verified.



## R55 session note — Master Drive asset locations frozen
- Repository-wide inspection found no earlier authoritative location contract for the master Google Site, four master workbooks, or seven Forms.
- Frozen destinations are defined in Phase 3 R55 and implemented as a Phase 4 placement/verification requirement.
- Phase 4 A4-15 must locate/verify and, where authorized, move existing assets to their exact destinations without creating duplicates.
- Phase 4 acceptance P4-33 through P4-39 covers live verification, relocation, idempotency, failure handling and response-destination integrity.
- No new top-level Drive folder is introduced and the verified Phase 1 folder hierarchy remains unchanged.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains BLOCKED pending the existing Phase 3 gate.
