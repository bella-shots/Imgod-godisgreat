| ID | Data rule | Implementation in Phase 3 | Phase 4 relevance |
|---|---|---|---|
| D3-01 | Every core business record must have a stable unique ID. | Create ID columns and define formats: PROJECT_ID, EMPLOYEE_ID, CLAIM_ID, SPENDING_ID, MOM_ID, INVESTMENT_ID, etc. | Automation must reference IDs, not row numbers. |
| D3-02 | Dates use a consistent date format. | Use actual Sheet date values; standardize display format. | Calculations/reminders depend on valid dates. |
| D3-03 | Amounts are numeric currency values. | Use numeric cells with consistent INR/currency formatting. | Expense, salary and reimbursement calculations. |
| D3-04 | Employee identity uses a human-facing identity input resolved to the canonical Employee_ID. | Prefer respondent/account email where the Form access model permits; otherwise collect an employee email/name. Do not require normal respondents to know/type Employee_ID. | Access and automation mapping. |
| D3-05 | Project identity is authoritative as Project_ID, but Forms should be human-facing. | Collect Project Name or another controlled human-readable project selection; Phase 4 resolves it to canonical Project_ID. Do not require normal respondents to know/type Project_ID. | Project aggregation/reporting. |
| D3-06 | Proof/attachment fields store Drive references/URLs. | Do not store binary files inside Sheets. | Automation can route/check files. |
| D3-07 | Status fields use controlled values. | Use the approved controlled values defined by the Phase 3 specification locally in each relevant workbook/tab. Do not use a cross-workbook validation range and do not create a separate configuration table. | Automation branches on defined status values. |
| D3-08 | Sensitive tabs are restricted. | Do not give employees broad Editor access to salary/investment/full finance source tabs. | Automation runs against restricted sources. |
| D3-09 | Forms should collect only required business data. | Avoid unnecessary personal/sensitive information. | Reduces exposure and maintenance. |
| D3-10 | Do not hard-code the ₹5,000 rule beyond the frozen requirement. | Keep the exact calculation/allowance/extra-line/approval/salary-treatment semantics explicit for Phase 4. | Phase 4 must implement only the approved interpretation. |
| D3-11 | Do not duplicate authoritative data manually. | Use references/IDs between Projects, Employees, HR requests, Expenses, Claims and cross-domain admin/report structures.

Treat Employees as the single authoritative employee/HR profile. HR_Admin contains workflow records that reference Employees by Employee_ID. | Prevents reconciliation problems. |
| D3-12 | Submission timestamp and submitter should be captured where relevant. | Enable automatic Form timestamp and capture submitter identity where the chosen Form access model permits. | Audit trail and notifications. |

## D3-13 — Unified Employee/HR master

The `Employees` tab is the single authoritative employee and HR master record. It contains both baseline identity fields and HR attributes previously split with `HR_Admin`.

Do not duplicate employee profile attributes in `HR_Admin`. `HR_Admin` is reserved for HR request/governance workflow records keyed by `HR_Request_ID` and `Employee_ID`.

The `Employees` tab is the single authoritative employee and HR master record. It contains both baseline identity fields and HR attributes previously split with `HR_Admin`.

Do not duplicate employee profile attributes in `HR_Admin`. `HR_Admin` is reserved for HR request/governance workflow records keyed by `HR_Request_ID` and `Employee_ID`.


## D3-14 — Local controlled-value validation

There is no `Lists_Config` workbook/tab. Controlled values are maintained as local validation rules in the workbook/tab where they are used. This avoids a false cross-workbook dependency and keeps Phase 3 native Google Sheets validation implementable without Apps Script synchronization.

Approved controlled values include:
- Project Report: Draft, Active, On Hold, Completed, Cancelled
- Employee Roles: Administrator, Finance Admin, HR Admin, Manager, Project Lead, Team Member, Contractor
- Project Roles: Lead, Core Contributor, Reviewer, Observer
- Access Levels: Viewer, Editor, Admin
- Employment Status: Probation, Full-Time, Notice Period, Relieved
- Reimbursement Settings: Standard, Executive, Contractor-Direct
- Finance Status: Submitted, Approved, Rejected, Reimbursed, Partially Reconciled
- Report Types: Company Summary, Project Report, Finance Report, HR Report

Where the same controlled value is used in multiple workbooks, the approved literal values are repeated locally; no second authoritative business record is created.


## D3-15 — Cross-domain administration ownership

`Employees` and `HR_Admin` are the only Phase 3 authoritative/support tabs owned by `MASTER_COMPANY_HR_ADMIN`.

`Report_Index` and `Submission_Index` are not HR records:
- `Report_Index` is the cross-domain reporting catalog for management, project, finance and HR reports.
- `Submission_Index` is the central audit/automation traceability index for all incoming Forms.

Both belong in the restricted `MASTER_COMPANY_ADMIN` workbook so HR does not become the owner of Finance, Operations and system-wide audit metadata.

`MASTER_COMPANY_ADMIN` is Site Admin-only. Ordinary employees have no direct access.


## D3-16 — Human-facing identity vs stable IDs

Stable IDs remain mandatory in authoritative business tables, but they are not mandatory human-facing Form inputs. Forms must collect a usable human-readable identity and Phase 4 must resolve that value to the canonical ID before writing the authoritative business record. Native response tabs may preserve the original human-facing answer for traceability.

This rule prevents the Form experience from requiring ordinary employees/project participants to know internal identifiers while preserving the stable-ID invariant.
### D3-17 — FRM-05 Project Name must not be a hard-coded Form choice list

For FRM-05, `Project Name` is a required human-facing **Short answer** input with no pre-populated project-name options.

The current project list must not be copied into Google Forms as manually maintained choices. Project identity is resolved during Phase 4 against authoritative `Projects.Project_Name` to obtain canonical `Project_ID`.

Rationale: a hard-coded Form choice list can become stale and would incorrectly make Phase 3 responsible for maintaining a live project selector. This is not a new lookup/configuration structure.


### D3-18 — Salary is six-month CTC + recurring payroll

`Employees.Salary_Basis` stores the employee's agreed **6-month CTC/stipend** and must not be described as monthly CTC. Monthly salary is derived from that six-month CTC for each applicable active employee. `Salary_Admin` is the authoritative monthly payroll ledger. The former FRM-08 / `Salary_Responses` intake model is removed; no salary Form is required for normal monthly payroll. Any exceptional adjustment is a Phase 4 payroll capability.


### D3-19 — FRM-02 explicit Employee Email ID and alternate-login mismatch

For FRM-02, the respondent-facing employee field is **Employee Email ID** and is required. The value is resolved against Employees.Email to obtain the canonical Employee_ID.

If Google Forms captures a signed-in respondent email and it differs from the submitted Employee Email ID, the captured login email is audit metadata only and must not override the explicit Employee Email ID. Phase 4 must not guess or silently substitute an employee. The submission must enter validation failure/manual review or the defined correction workflow before an authoritative Employee_Spending record is created.

### D3-20 — FRM-04 Request Type controlled values

FRM-04 Request_Type is a controlled Form value. The approved literal values are:
- Personal Information Update
- Bank / Payment Details Update
- Leave / Attendance Request
- Employment / HR Document Request
- Salary / Payroll Query
- Reimbursement / Benefits Query
- Project / Role Update
- Resignation / Exit Request
- Other

The same literals must be used for the HR_Admin Request_Type workflow field. No additional category may be introduced during Phase 3 without a documented specification revision. Other is the catch-all for requests outside the defined categories.


### D3-21 — FRM-06 respondent-facing field controls

FRM-06 must collect only the report-request data defined by the current R35 Forms Map:
- Employee Email ID: required Short answer used to identify the requester; Phase 4 resolves it against `Employees.Email` to canonical `Employee_ID` and `Role`.
- Period: required text in reporting-period form such as 2026-09 or 2026-Q3; do not use a full Date field.
- Project Name: human-facing Short answer, used only when the requested report is project-specific; do not request Project_ID or hard-code current project names.
- Project Name: conditional Short answer, only when a project-specific report is requested.

System/catalog fields such as Report_ID, Project_ID, Drive_URL, Status, and Generated_Date remain non-respondent fields. Phase 4 resolves Project Name to canonical Project_ID when applicable and catalogs the generated output in Report_Index.


### D3-22 — Report requests cannot expand data permissions

A report request does not grant the requester any new access. Finance Report and other report types must be compiled only from records and fields the requester is already authorized to access. Phase 4 must evaluate authenticated requester identity, role/designation and authorized data scope before selecting report records or fields.

### D3-23 — Finance Report recipient scope is role-controlled

The Finance Report recipient scope is controlled by the requester's role/designation and authorization scope:
- Team Member / Contractor: self only for employee-linked finance records.
- Project Lead: authorized project scope, where permitted.
- Manager: authorized management/data scope; Manager status alone does not grant restricted salary/payroll or investment access.
- Finance Admin: company-wide Finance data permitted to Finance Admin.
- HR Admin: salary/payroll data where authorized; investment data is not granted merely by HR role.
- Administrator / Site Admin: company-wide data within authorized administrator scope.

Recipient must not be an unrestricted free-text lookup. Manual entry of another employee's name/email must not bypass authorization. Restricted salary, investment and other sensitive Finance records must remain inaccessible unless the requester's role explicitly permits them.
### D3-24 — HR Report exact field mapping and authorization

FRM-06 **HR Report** is a permission-controlled report compiled only from the authoritative Employees and HR_Admin schemas.

**Employee/master source (Employees) fields that may be used:**
Employee_ID, Name, Email, Role, Salary_Basis, Active, Reimbursement_Eligible, Project_Access, Joining_Date, Employment_Status, HR_Notes, Reimbursement_Settings, Created_At.

**HR workflow source (HR_Admin) fields that may be used:**
HR_Request_ID, Employee_ID, Request_Type, Relevant_Details, Attachment_URL, Status, Submitted_At, Processed_At, Processed_By.

The HR Report must not invent fields that are absent from these schemas.

For HR requests, Submitted_At is the primary request-period field. Processed_At and Processed_By represent processing metadata when populated and authorized.

Authorization must be evaluated before selecting records or fields. A report request does not grant new permissions. Team Member/Contractor access is self-only; Project Lead and Manager access is limited to explicitly authorized scope; HR Admin has authorized company-wide HR scope; Administrator/Site Admin has company-wide scope within administrator authorization. Restricted Salary_Basis and confidential HR_Notes must not be exposed merely because HR Report was selected.

HR_Admin remains workflow-only and must not duplicate employee master fields.


## R32 — Global report View/Download rule

For every FRM-06 report request, apply this sequence:

1. Authenticate/identify the requester.
2. Resolve role/designation and existing authorized scope.
3. Apply requested report type and period.
4. Select only authorized records and fields.
5. Generate a human-readable report representation.
6. Display that report directly in the system.
7. Provide a user-initiated **Download Report** option for the same authorized report.

The Download path must reuse the authorized report result; it must not independently query unrestricted source workbooks. A user cannot obtain additional information by downloading instead of viewing.

This rule applies equally to Company Summary, Project Report, Finance Report and HR Report. Report requests never grant additional permissions.


## R32 — Global report View/Download rule

For every FRM-06 report request, apply this sequence:

1. Authenticate/identify the requester.
2. Resolve role/designation and existing authorized scope.
3. Apply requested report type and period.
4. Select only authorized records and fields.
5. Generate a human-readable report representation.
6. Display that report directly in the system.
7. Provide a user-initiated **Download Report** option for the same authorized report.

The Download path must reuse the authorized report result; it must not independently query unrestricted source workbooks. A user cannot obtain additional information by downloading instead of viewing.

This rule applies equally to Company Summary, Project Report, Finance Report and HR Report. Report requests never grant additional permissions.
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

### R38 — Remove redundant Company Summary “Period Activity / Key Counts” section
Do not generate a standalone **“Period Activity / Key Counts”** section in Company Summary.

Period filtering and period-specific counts remain embedded within:
- Projects & Operations
- Finance Summary
- HR Summary

No duplicate catch-all period section is permitted. All other R37 rules remain unchanged.


### R39 — Project Report definition and rules
FRM-06 Project Report is a project-scoped report generated only after exact Project Name resolution and existing authorization checks.

Frozen presentation order:
1. Report Header
2. Project Overview
3. Project Team
4. Project Activity & Documentation
5. Project Finance Summary — authorized project-linked finance only
6. Access Notice

Project Overview uses the current authoritative Projects record; current Status is a current snapshot, not historical reconstruction.
Project Team is resolved through Project_Members and Employees and may show only project-context identity, Project_Role, Active and Assigned_Date. Salary_Basis, HR_Notes and unrelated HR fields remain restricted.
Project Notes are reportable only when linked to the project and Status = Published. Project MOMs are reportable only when linked to the project and Status = Published or Revised.
Project-linked finance is limited to authorized Budget_Given, Employee_Spending and OOP_Claims records for the requested period. Salary/Payroll and Investments are not ordinary Project Report content.
Period filtering uses the authoritative source dates defined in R39.
Requesting a Project Report never grants project, Finance or HR access.
Exact case-sensitive Project Name matching from R36 remains mandatory.
View + Download follows R32; download cannot reveal more than the on-screen authorized report.

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

## R41 — Frozen Finance Report data rules
Finance Report is frozen to the user-approved seven-section structure: Report Header; Finance Summary; Budget Given; Employee Spending; OOP Claims; My Salary / Payroll; Access Notice.

Use only the existing Finance schemas. Apply R40 exact inclusive date-range filtering using `Budget_Given.Date`, `Employee_Spending.Date`, `OOP_Claims.Date`, and `Salary_Admin.Month`. Investments are outside the standard Finance Report. Every employee may access their own Salary_Admin payroll records; broader payroll access requires separate authorization. Do not expose proof/attachment URLs or internal fields merely because the report was requested. Unauthorized records/categories are omitted. R32 View + Download applies identically to on-screen and downloaded authorized content.

**R41 is frozen. Changes require a new revision and explicit approval.**

### R43 — Finance Report OOP Claims presentation correction
**Date:** 2026-09-29

The user-facing Finance Report must **not display `OOP_Claims.Month`**. Show Claim Date instead, together with Purpose, Project, Claimed Amount, Approved Amount, Status, and Paid Date when applicable.

`OOP_Claims.Month` remains in the authoritative source schema and remains an internal processing/reconciliation field. It must remain consistent with `OOP_Claims.Date`.

R43 changes presentation only; it does not remove or rename the authoritative `OOP_Claims.Month` column.**

## R42 — HR Report definition — DRAFT / NOT FROZEN
**Status:** Draft pending user review and explicit approval.

The current HR Report text remains a proposal only. It must **not** be treated as an approved/frozen Phase 3 contract or implemented as final behavior until the user reviews and explicitly approves it.

The current proposal uses:
1. Report Header
2. Employee / Workforce Snapshot
3. HR Workflow Activity
4. Access Notice

It proposes using only `Employees` and `HR_Admin`, R40 exact inclusive date ranges, existing authorization scope, and R32 View + Download. It proposes current workforce snapshots plus period-filtered HR workflow activity using `Employees.Joining_Date`, `HR_Admin.Submitted_At`, and `Processed_At` with Status = Completed.

**This is not frozen.** Do not treat its proposed fields, authorization details, exclusions, or presentation as final until separately approved.

