# PHASE 3 — RUNNING CHANGE PROMPT 005

## Change type
**Controlled architecture correction before continued human instantiation.**

Prompt-001 through Prompt-004 remain historical. This is the current authoritative Phase 3 running-change prompt.

## R20 — Separate cross-domain administration from HR

### Problem being corrected

The R18/R19 design correctly unified employee master data and removed `Lists_Config`, but it left two cross-domain structures inside `MASTER_COMPANY_HR_ADMIN`:

- `Report_Index` catalogs project, finance, HR and executive reports.
- `Submission_Index` audits and traces submissions from all eight Forms.

Neither structure is an HR master record. Keeping them in the HR workbook makes HR the owner of Finance/Operations-wide metadata and creates an unnecessary security/ownership boundary.

### Authoritative correction

Use **four** Google Sheets workbooks for Phase 3:

**1. `MASTER_COMPANY_OPERATIONS` — 4 authoritative/support tabs**
- `Projects`
- `Project_Members`
- `Project_Notes`
- `Project_MOM_Index`

Native response tabs:
- `Projects_Responses`
- `MOM_Responses`

**2. `MASTER_COMPANY_FINANCE` — 5 authoritative/support tabs**
- `Budget_Given`
- `Employee_Spending`
- `OOP_Claims`
- `Salary_Admin`
- `Investments`

Native response tabs:
- `Employee_Spending_Responses`
- `OOP_Claims_Responses`
- `Salary_Responses`
- `Investment_Responses`

Access: Site Admin / Finance Admin only. Ordinary employees have 0 direct access.

**3. `MASTER_COMPANY_HR_ADMIN` — 2 authoritative/support tabs**
- `Employees`
- `HR_Admin`

Native response tab:
- `HR_Requests_Responses`

Access: Site Admin / HR Admin only. Ordinary employees have 0 direct access.

**4. `MASTER_COMPANY_ADMIN` — 2 authoritative/support tabs**
- `Report_Index`
- `Submission_Index`

Native response tab:
- `Report_Requests_Responses`

Access: **Site Admin only.** Ordinary employees, project members, Finance Admin and HR Admin have 0 direct access unless a future explicitly approved security change says otherwise.

### Why `MASTER_COMPANY_ADMIN` exists

`Report_Index` is a cross-domain reporting catalog. It may reference project, finance and HR reports.

`Submission_Index` is a central audit/automation traceability index covering all eight Forms.

They therefore belong to a restricted administrative boundary rather than HR.

### Physical model

Authoritative/support tabs:
- Operations = 4
- Finance = 5
- HR/Admin = 2
- Admin = 2

**Total = 13 authoritative/support tabs.**

After the seven applicable Forms are linked:

**13 authoritative/support + 7 native response tabs = 20 physical tabs.** Recurring payroll is not a Form workflow.

### Form correction

FRM-06 Report Request:
- Native response destination: `Report_Requests_Responses` in `MASTER_COMPANY_ADMIN`
- Authoritative target: `Report_Index`

FRM-04 remains:
- Native response destination: `HR_Requests_Responses` in `MASTER_COMPANY_HR_ADMIN`
- Authoritative target: `HR_Admin`
- Applicable employee profile changes are processed against `Employees` in Phase 4.

### Existing R18 and R19 rules remain

- `Employees` is the single authoritative employee + HR master.
- `HR_Admin` is workflow/request-only and must not duplicate employee profile fields.
- `Lists_Config` does not exist.
- Controlled values are local native Sheet validation rules.
- No cross-workbook validation synchronization is introduced.

### Human instantiation correction

If `Report_Index` and/or `Submission_Index` have already been created inside `MASTER_COMPANY_HR_ADMIN`, do **not** keep them there.

Move/recreate them in `MASTER_COMPANY_ADMIN`, then remove only those two misplaced tabs from the HR workbook.

Do not delete:
- `Employees`
- `HR_Admin`
- `HR_Requests_Responses`

If the HR workbook has not yet been created, create it with only its two authoritative/support tabs and its native response tab.

Create `MASTER_COMPANY_ADMIN` as a separate restricted Google Sheet. It should be stored under the Phase 1 `MASTER COMPANY` Drive root or another explicitly restricted admin location; do not alter Phase 1 folder structure.

### Scope firewall

Do not:
- add any fifth workbook;
- add any replacement configuration tab;
- move `Employees` or `HR_Admin` out of HR;
- duplicate employee master data;
- implement Apps Script;
- implement triggers or automation;
- change the ₹5,000 OOP rule;
- create React/Vite/Firebase/custom app code;
- modify Phase 1 or Phase 2;
- advance to Phase 4.

### R21 — Human-facing Form identity correction

### Problem corrected
The authoritative Sheets layer requires stable internal identifiers, but ordinary Form respondents must not be expected to know or manually type values such as `PRJ-001` or `EMP-001`.

### Authoritative rule
- Keep `Project_ID` and `Employee_ID` as canonical authoritative-table fields.
- Forms collect human-readable project/employee identity instead of requiring respondents to know internal IDs.
- Phase 4 resolves the submitted human-readable identity to the canonical stable ID before writing the authoritative business record.
- Native response tabs may retain the original human-facing answer for traceability.
- Do not create duplicate lookup/configuration tables or move ID resolution into Phase 3 Apps Script.
- FRM-05 specifically uses **Project Name**, not Project ID, as its respondent-facing project field.
- Apply the same usability rule to FRM-01 through FRM-08 wherever a foreign-key identity is required.

### Scope firewall for R21
Do not:
- remove stable IDs from authoritative schemas;
- require normal respondents to invent or type stable internal IDs;
- implement Apps Script or Phase 4 normalization now;
- create a `Lists_Config` or replacement lookup workbook/tab;
- change workbook ownership boundaries;
- change the ₹5,000 OOP rule.

## Verification

Confirm:
1. `Lists_Config` is absent.
2. Operations has exactly 4 authoritative/support tabs.
3. Finance has exactly 5 authoritative/support tabs.
4. HR/Admin has exactly 2 authoritative/support tabs: `Employees`, `HR_Admin`.
5. Admin has exactly 2 authoritative/support tabs: `Report_Index`, `Submission_Index`.
6. Total authoritative/support tabs = 13.
7. FRM-06 response destination is in `MASTER_COMPANY_ADMIN`.
8. The seven applicable Forms produce the expected seven native response tabs.
9. Expected physical tab count after all applicable Forms are linked = 20.
10. `Employees` remains the single employee + HR master.
11. `HR_Admin` remains workflow-only.
12. `Report_Index` and `Submission_Index` are not inside the HR workbook.
13. `MASTER_COMPANY_ADMIN` is restricted to Site Admin.
14. Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED.
15. Phase 4 and Phase 5 remain blocked.

## Execution loop

**READ → DETERMINE STATE → PLAN → IMPLEMENT → VERIFY → CORRECT → RE-VERIFY → DOCUMENT → STOP**

Do not continue to another Phase 3 unit until this running change is verified.
### R22 — FRM-05 Project Name must be a free human-facing input

### Problem corrected
The new FRM-05 had been configured with existing project names as Form choices. That makes the Form dependent on a manually maintained snapshot of the Projects table and can become stale.

### Authoritative rule
For FRM-05:
- `Project Name` is **Required**.
- Question type is **Short answer**.
- There are **no pre-populated project-name options**.
- Do not ask for `Project_ID`.
- Do not copy the current `Projects.Project_Name` values into the Form.
- Phase 4 validates the submitted Project Name and resolves it to canonical `Project_ID` before writing `Project_MOM_Index`.

### Scope firewall
Do not create a lookup/configuration table, do not implement Phase 4 now, and do not change the authoritative `Projects` or `Project_MOM_Index` schemas.


## R23 — Correct salary/payroll architecture

The previous model incorrectly treated normal salary processing as employee-by-employee monthly Form entry. Correct model:
- `Employees.Salary_Basis` = agreed **6-month CTC/stipend**, not monthly CTC.
- Monthly payroll is derived from that stored six-month CTC for each applicable active employee.
- `Salary_Admin` is the authoritative monthly payroll ledger.
- Phase 4 generates monthly `SAL-XXX` records and records due, paid, pending carry-forward and status.
- HR/Finance does not manually submit a salary Form for every employee every month.
- Remove FRM-08 Salary Entry and do not create `Salary_Responses`.
- Do not implement payroll automation in Phase 3; keep recurring payroll processing in Phase 4.


## R25 — FRM-02 Employee Email ID and alternate-login handling

Correct the FRM-02 employee identity field as follows:

- **AS IS:** Employee ID
- **TO BE:** Employee Email ID
- Make Employee Email ID required.
- Do not ask for Employee_ID.
- Phase 4 resolves the submitted Employee Email ID against Employees.Email to obtain the canonical Employee_ID.
- If the respondent is logged into Google Forms using a different email, do not silently use that login email instead of the explicit Employee Email ID.
- If platform-captured respondent email is available, retain it only as audit/submission metadata.
- A mismatch between the signed-in email and the entered Employee Email ID must go to validation failure/manual review or the defined correction workflow; do not guess or silently substitute an employee.
- Do not add a second employee-login email question solely for this case.
- Do not change the authoritative Employee_Spending.Employee_ID field.
- Do not implement Phase 4 automation now.

### R26 — FRM-04 Request Type lock

FRM-04 must be implemented exactly as follows:
- Employee Email ID — Short answer, Required.
- Request Type — Multiple choice, Required, with exactly: Personal Information Update; Bank / Payment Details Update; Leave / Attendance Request; Employment / HR Document Request; Salary / Payroll Query; Reimbursement / Benefits Query; Project / Role Update; Resignation / Exit Request; Other.
- Relevant Details — Paragraph, Required.
- Attachment / Supporting Document — File upload, Optional.

Do not invent additional Request Type values. Do not ask for Employee_ID or HR_Request_ID. Keep HR_Admin as the workflow target and Phase 4 responsible for employee identity resolution and workflow processing.


### R27 — FRM-06 Report Request field lock

Before human instantiation of FRM-06, use the R34 superseding specification below. The earlier R27 field lock is historical:

- Report Type — Multiple choice, Required. Exact options: Company Summary, Project Report, Finance Report, HR Report.
- Period — Short answer, Required. Use reporting-period text such as 2026-09 or 2026-Q3; do not use a Date question.
- Project Name — Short answer, conditional/only when a project-specific report is requested. **CAUTION — CASE-SENSITIVE:** the respondent must enter the project name exactly as it appears in authoritative `Projects.Project_Name`, including capitalization, spaces, spelling, and punctuation. Phase 4 must require an exact match; do not ask for or enter `Project_ID`, and do not provide a hard-coded project-name choice list.

Do not add respondent-facing Report_ID, Project_ID, Drive_URL, Status, Generated_Date, Submission_ID, or Phase 4 processing fields.

The native response destination is Report_Requests_Responses in MASTER_COMPANY_ADMIN; the authoritative target is Report_Index.

Phase 4 remains responsible for resolving Project Name to canonical Project_ID when applicable and compiling/cataloguing the requested report. Do not implement Phase 4 or Apps Script during this Phase 3 change.


## R29 — Finance Report access and output definition

When implementing/reporting from FRM-06, treat **Finance Report** as a permission-controlled consolidated financial report, not as an unrestricted export of MASTER_COMPANY_FINANCE.

The implementation must:
1. Identify the authenticated requester.
2. Resolve the requester's role/designation and authorized data scope.
3. Determine the permitted recipient scope before selecting Finance records.
4. Select only records and fields the requester is already authorized to access.
5. Generate the report for the requested period.
6. Record/report delivery through the existing Report_Index workflow.

Recipient scope:
- Team Member / Contractor: self only for employee-linked Finance records.
- Project Lead: authorized project scope, where permitted.
- Manager: authorized management/data scope; Manager status alone does not grant restricted salary/payroll or investment access.
- Finance Admin: company-wide Finance data permitted to Finance Admin.
- HR Admin: salary/payroll data where authorized; investment data is not granted merely by HR role.
- Administrator / Site Admin: company-wide data within authorized administrator scope.

Finance Report content, subject to authorization and period, includes Budget Given; Employee Spending; OOP Claims; authorized Salary/Payroll; authorized Investments; authorized financial totals/aggregations; and authorized project-wise financial information.

Do not implement Recipient as an unrestricted free-text lookup. A requester must not be able to enter another employee's email/name and thereby obtain restricted data. A report request must never expand the requester's underlying permissions.
## R31 — Define HR Report exactly from the authoritative schema

The **HR Report** option in FRM-06 must be implemented as a permission-controlled HR report, not as an unrestricted export of MASTER_COMPANY_HR_ADMIN.

Use only the current authoritative schemas.

### HR_Admin report fields
Use exactly:
- HR_Request_ID
- Employee_ID
- Request_Type
- Relevant_Details
- Attachment_URL
- Status
- Submitted_At
- Processed_At
- Processed_By

Map the previously vague concepts explicitly:
- Employee/requester = Employee_ID, resolved through Employees
- Request type = Request_Type
- Request details = Relevant_Details
- Status = Status
- Request date = Submitted_At
- Processing information = Processed_At + Processed_By
- Supporting document = Attachment_URL

### Employees source
Employee/HR profile information must come only from the authoritative Employees schema. Do not duplicate employee master fields into HR_Admin.

### Restrictions
Do not invent HR fields that are absent from the authoritative schemas.

The report compiler must apply requester identity, role/designation and authorized scope before selecting records or fields. Team Member/Contractor is self-only; Project Lead and Manager are limited to authorized scope; HR Admin has authorized company-wide HR scope; Administrator/Site Admin has company-wide scope within authorization.

Salary_Basis and HR_Notes are restricted and must not be exposed merely because HR Report was selected.

A report request does not grant new permissions.


## R32 — Universal report View + Download contract

### Problem corrected
Earlier report wording could be interpreted as producing a downloadable file or raw workbook export rather than a report that users can simply view. The reporting behavior must be consistent across all report types.

### Authoritative rule
For every FRM-06 request — **Company Summary, Project Report, Finance Report, or HR Report** — Phase 4 must:
1. identify/authenticate the requester;
2. apply existing role/designation and authorization scope;
3. apply report type and period;
4. select only authorized records and fields;
5. generate a human-readable report;
6. display the report directly in the system; and
7. provide a user-initiated **Download Report** action.

The user chooses whether to download. Download is not required for viewing.

The downloaded artifact must be generated from the same authorized report result shown to the requester. Download must never expose additional fields, records, source workbook tabs, or otherwise bypass the requester's permissions.

Raw Google Sheets workbooks are source data, not report outputs. The exact download format is a Phase 4 implementation detail unless separately frozen.

### Scope firewall for R32
Do not:
- make reports download-only;
- make raw workbook exports the report output;
- create a separate weaker authorization path for downloads;
- expose restricted fields merely because a report was requested;
- implement Phase 4 during Phase 3.

### Verification
Confirm:
1. Company Summary supports View + Download.
2. Project Report supports View + Download.
3. Finance Report supports View + Download.
4. HR Report supports View + Download.
5. View does not require Download.
6. Download cannot expose information beyond the displayed authorized report.
7. Raw source workbooks are not presented as report outputs.
8. Phase 4 remains responsible for implementation.
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


### R36 — FRM-06 Project Name exact case-sensitive matching

For FRM-06, when the Project Name field is shown for a project-specific report, treat it as **case-sensitive**.

The respondent must enter the Project Name **exactly as it appears in the authoritative Projects.Project_Name field**, including:
- capitalization;
- spaces;
- spelling; and
- punctuation.

Phase 4 must resolve the submitted Project Name using an **exact match** against Projects.Project_Name. Do not silently perform case-insensitive, fuzzy, trimmed, normalized, or approximate matching that could select a different project.

Do not ask for or enter Project_ID. Do not create a hard-coded project-name choice list in FRM-06.

This is a clarification of the existing FRM-06 human-facing identity rule. Do not change the four-field FRM-06 structure, report types, workbook schemas, authorization boundary, or Phase 4 ownership of identity resolution.

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

### R38 — Company Summary presentation implementation correction
When implementing Company Summary, do not generate a standalone “Period Activity / Key Counts” section.

Place period-specific metrics within the relevant Projects & Operations, Finance Summary, and HR Summary sections. Preserve all other R37 rules.


### R39 — Project Report implementation contract
When implementing FRM-06 Project Report, use this exact contract.

Output order:
1. Report Header
2. Project Overview
3. Project Team
4. Project Activity & Documentation
5. Project Finance Summary — authorized project-linked finance only
6. Access Notice

Project Overview: current Projects record — Project_ID, Project_Name, Description, Owner, Start_Date, Event_Date, current Status and Created_At. Treat Status as current snapshot only.
Project Team: resolve Project_Members to Employees and show only project-context identity plus Project_Role, Active and Assigned_Date. Never expose Salary_Basis, HR_Notes or unrelated HR fields merely because Project Report was selected.
Project Activity & Documentation: include period-relevant Published Project_Notes and Published/Revised Project_MOM_Index records. Use Project_Notes.Date and Project_MOM_Index.Meeting_Date for period filtering.
Project Finance Summary: include only authorized project-linked Budget_Given, Employee_Spending and OOP_Claims records for the requested period, with counts/totals/status breakdowns as applicable. Do not include Salary/Payroll or Investments as ordinary Project Report content.
Authorization: exact case-sensitive Project Name → Project_ID resolution is mandatory; requester must already be authorized for the project. The report request cannot grant project, Finance or HR access.
Delivery: display the authorized report in the system and provide Download Report with identical authorized content. Do not export raw source workbooks.
Do not change FRM-06 fields or create new Phase-3 schemas while implementing this contract.

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

## R41 — Frozen Finance Report implementation contract
Before implementing FRM-06 Finance Report generation, Phase 4 must treat R41 as a frozen contract. Use exactly the approved seven-section structure: Report Header, Finance Summary, Budget Given, Employee Spending, OOP Claims, My Salary / Payroll, Access Notice. Use existing Finance schemas and R40 exact inclusive date ranges. Investments are outside the standard Finance Report. Every employee may access their own Salary_Admin payroll records; broader payroll access requires separate authorization. Do not expose proof/attachment URLs, internal fields, or unrestricted workbook data. R32 View + Download applies.

## R42 — HR Report implementation status
**Superseded by R44.** R42 was draft-only. R44 is now the frozen HR Report implementation contract.
## R43 — Finance Report OOP Claims presentation correction
For the Finance Report OOP Claims section, display:
- Claim Date
- Purpose
- Project
- Claimed Amount
- Approved Amount
- Status
- Paid Date when applicable

Do **not** display `OOP_Claims.Month` in the user-facing report. It remains in the authoritative `OOP_Claims` source schema for internal processing/reconciliation and must remain consistent with `OOP_Claims.Date`.

R43 is a presentation correction only. It does not change FRM-06 fields, workbook schemas, period filtering, authorization, or the Phase 4 boundary.

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
   - Salary_Basis only where the requester is explicitly authorized
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

## R45 — Compensation and payroll architecture correction
Implement compensation with two exact payment frequencies: Monthly and One-Time.

- Employees.Salary_Basis = agreed compensation basis; for standard employees, agreed 6-month CTC/stipend.
- Employees.Payment_Frequency = Monthly or One-Time.
- Salary_Admin.Payment_Frequency mirrors the applicable arrangement.
- Salary_Admin.Month is required for Monthly records and blank for One-Time records.
- Salary_Admin.Payment_Date is required for One-Time records.
- Monthly arrangements generate recurring monthly compensation records.
- One-Time arrangements generate a single compensation/payment obligation and must not be represented as artificial monthly payroll.
- Employees may view their own Salary_Basis/CTC and Payment_Frequency; broader compensation visibility requires authorization.
- No salary Form or response tab is introduced.
