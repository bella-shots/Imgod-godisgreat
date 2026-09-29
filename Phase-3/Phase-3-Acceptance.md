| ID | Acceptance test | Expected result | Status | Observed Evidence / Notes |
|---|---|---|---|---|
| P3-01 | Create the required operational Sheets/tabs. | All 13 authoritative/support schema tabs exist, plus the 7 applicable native Form response tabs (20 physical tabs total). `Salary_Admin` is authoritative and has no native Form response tab. | SPEC READY / HUMAN ACTION REQUIRED | Detailed structural schema and 4-workbook partitioning model established in `Phase-3-Schema-Blueprint.md`. Physical instantiation in Google Sheets requires Admin Google Account action. Response tabs are intake destinations, not additional authoritative business tables. |
| P3-02 | Create Projects structure. | Project records contain the defined fields and stable Project_ID. | SPEC READY / HUMAN ACTION REQUIRED | Schema defined with `Project_ID` (`PRJ-XXX`), `Project_Name`, `Owner`, `Start_Date`, `Event_Date`, `Status`, `Drive_Folder_URL`. Awaiting spreadsheet creation. |
| P3-03 | Create Employees structure. | Employee records contain identity, role, active, reimbursement-related and HR master fields in one authoritative record. | SPEC READY / HUMAN ACTION REQUIRED | Schema defined with `Employee_ID` (`EMP-XXX`), `Email`, `Role`, `Salary_Basis`, `Active`, `Reimbursement_Eligible`, `Project_Access`, `Joining_Date`, `Employment_Status`, `HR_Notes`, and `Reimbursement_Settings`. `Employees` is the single authoritative employee/HR master. |
| P3-04 | Create Finance structures. | Budget, spending, OOP, salary and investment records exist with appropriate fields. | SPEC READY / HUMAN ACTION REQUIRED | Schemas defined for `Budget_Given` (`BDG-`), `Employee_Spending` (`SPN-`), `OOP_Claims` (`CLM-`), `Salary_Admin` (`SAL-`), `Investments` (`INV-`). Awaiting spreadsheet creation. |
| P3-05 | Create HR/report/audit structures. | Required controlled support tabs exist. | SPEC READY / HUMAN ACTION REQUIRED | `HR_Admin` is defined as the controlled HR request/governance workflow keyed by `HR_Request_ID` and `Employee_ID`. `Report_Index` and `Submission_Index` are cross-domain administrative support structures owned by `MASTER_COMPANY_ADMIN`, not HR. No duplicate employee master is permitted. |
| P3-06 | Create required Forms. | Project, expense, OOP, HR, MOM and admin workflows exist as applicable. | SPEC READY / HUMAN ACTION REQUIRED | 7 applicable Forms mapped in `Phase-3-Forms-Map.md`; recurring payroll is not a Form and detailed with input fields and validation types in `Phase-3-Schema-Blueprint.md`. Awaiting Form creation. |
| P3-07 | Verify Form-to-Sheet mappings. | Each form submission lands in the intended authoritative structure. | PLATFORM LIMITATION / PHASE 4 PROCESSING REQUIRED | Native Form response destinations defined for all 7 applicable Forms (`Projects_Responses`, `Employee_Spending_Responses`, `OOP_Claims_Responses`, `HR_Requests_Responses`, `MOM_Responses`, `Report_Requests_Responses`, `Investment_Responses`). Authoritative business records (`Employee_Spending`, `Projects`, etc.) are separated from response intake. FRM-01 normalization and multi-table ingestion require Phase 4 Apps Script. No Phase 4 code exists in Phase 3. |
| P3-08 | Verify validation. | Dates, amounts, statuses, employees and projects use appropriate validation/controlled values. | SPEC READY / HUMAN ACTION REQUIRED | Controlled values are defined as local native validation rules in the relevant workbook/tab. No cross-workbook validation range or `Lists_Config` dependency exists. Awaiting in-sheet application. |
| P3-09 | Verify Drive attachment handling. | Uploaded proofs/files are stored in Drive and referenced rather than embedded as binary data in Sheets, with access governed by actual Drive permissions. | SPEC READY / HUMAN ACTION REQUIRED | Drive file reference/URL fields (`Proof_URL`, `Attachment_URL`) specified. The specification does not describe these references as inherently public. Phase 1 folder routing automation deferred to Phase 4. |
| P3-10 | Verify sensitive access. | Employees cannot directly edit/read restricted salary, investment and sensitive master tabs. | SPEC READY / HUMAN ACTION REQUIRED | Required security policy: 4-workbook partitioning model specifies 0 direct employee access to `MASTER_COMPANY_FINANCE`, `MASTER_COMPANY_HR_ADMIN`, and `MASTER_COMPANY_ADMIN`. `MASTER_COMPANY_ADMIN` is Site Admin-only. Testing against actual Google sharing permissions requires human configuration. |
| P3-11 | Verify normal Gmail model. | Representative employee Gmail/Google Account can use permitted Forms without paid Workspace dependency. | SPEC READY / HUMAN ACTION REQUIRED | Design targets standard consumer Google accounts at ₹0.00 spend. Testing access with a representative non-admin Google Account requires human verification in live environment. |
| P3-12 | Verify stable IDs and audit fields. | Core records have stable IDs and required submission metadata. | SPEC READY / HUMAN ACTION REQUIRED | Formats specified for all core entities and workflow records (`PRJ-`, `EMP-`, `MBR-`, `NOT-`, `MOM-`, `BDG-`, `SPN-`, `CLM-`, `SAL-`, `INV-`, `RPT-`, `SUB-`, `HRR-`). Row numbers forbidden. |
| P3-13 | Verify Phase 4 readiness. | All automation inputs/outputs required for Phase 4 are defined; no business rule is silently invented. | PASS | Phase 4 input requirements (MOM attendee list, OOP rule evaluation fields, salary carry-forward balance fields, audit submission index) are fully specified in the schema, and zero Phase 4 Apps Script/triggers have been implemented in Phase 3. |
| P3-14 | Verify zero additional-cost boundary. | No paid database/form/SaaS service has been introduced. | PASS | Verified in repository architecture: zero paid database, zero paid form service, zero third-party SaaS, zero paid automation service, and zero paid Workspace subscription prerequisites. |
| P3-15 | Phase 3 closure. | All Phase 3 acceptance tests PASS and evidence is recorded. | NOT VERIFIED | Specifications, data rules, and cost constraints verified. Awaiting human execution (Sheet & Form instantiation in user's Google account). |

| P3-16 | Verify human-facing Form identity inputs. | Normal respondents are not required to type or invent stable internal IDs; project/employee identities are collected in human-readable form and resolved to canonical IDs during Phase 4. | SPEC READY / HUMAN ACTION REQUIRED | R21 correction added to the schema, Forms map and data rules. Live Form verification remains a human-account action. |
### P3-17 — FRM-05 human-facing project input

**Requirement:** FRM-05 uses a required `Project Name` **Short answer** field with no pre-populated project-name choices.

**Verify:** The live Form does not contain a manually maintained list of current project names and does not ask for `Project_ID`. The respondent enters the human-readable Project Name; Phase 4 is responsible for validation/resolution to canonical `Project_ID`.

**Status:** SPEC READY / HUMAN ACTION REQUIRED until the live Form is verified.


### P3-18 — Verify salary/payroll architecture

`Employees.Salary_Basis` must be the agreed **6-month CTC/stipend**, not monthly CTC. No `Salary_Responses` tab or FRM-08 monthly salary-entry Form is created. Phase 4 will derive monthly salary for each applicable active employee and maintain monthly `SAL-XXX` records in `Salary_Admin`.

**Status:** SPEC READY / HUMAN ACTION REQUIRED for live workbook verification.


### P3-19 — Verify FRM-02 Employee Email ID handling

**Requirement:** FRM-02 uses a required **Employee Email ID** field rather than Employee_ID.

**Verify:** The live Form does not ask the respondent to type EMP-XXX. The submitted Employee Email ID resolves to Employees.Email during Phase 4. If the respondent is logged into Google Forms with a different email, the captured login address does not override the explicit Employee Email ID; the mismatch is held for validation failure/manual review or the defined correction workflow.

**Status:** SPEC READY / HUMAN ACTION REQUIRED until the live Form is verified.

### P3-20 — Verify FRM-04 Request Type

Requirement: FRM-04 uses the locked nine-value Request Type list.

Verify the live Form contains exactly:
- Personal Information Update
- Bank / Payment Details Update
- Leave / Attendance Request
- Employment / HR Document Request
- Salary / Payroll Query
- Reimbursement / Benefits Query
- Project / Role Update
- Resignation / Exit Request
- Other

Also verify Employee Email ID is required, Relevant Details is required, Attachment / Supporting Document is optional, no Employee_ID or HR_Request_ID is requested, and the Form remains linked to HR_Requests_Responses.

Status: SPEC READY / HUMAN ACTION REQUIRED until the live Form is verified.


### P3-21 — Verify FRM-06 Report Request

Verify the live FRM-06 Form contains exactly these respondent-facing fields (R34):
- Employee Email ID — Short answer, Required; used for requester identity resolution. Do not ask for Employee_ID or Designation/Role.
- Period — Short answer, Required.
- Project Name — Short answer, conditional/only when a project-specific report is requested; no hard-coded project-name list and no Project_ID.

Also verify:
- Native response destination is Report_Requests_Responses in MASTER_COMPANY_ADMIN.
- No Report_ID, Project_ID, Drive_URL, Status, Generated_Date, Submission_ID, or Phase 4 processing field is respondent-facing.
- Report_Index remains the authoritative catalog.

Status: SPEC READY / HUMAN ACTION REQUIRED until the live Form is verified.


### P3-22 — Verify Finance Report authorization and contents

The employee Role controlled values must include Manager so the role-based recipient rule can be implemented.

Verify that FRM-06 Finance Report is not an unrestricted export of the Finance workbook.

For a Team Member/Contractor test account, verify employee-linked Finance records are restricted to self only. For Project Lead/Manager accounts, verify recipient scope is limited to the user's authorized project/management/data scope. For Finance Admin, verify authorized company-wide Finance reporting works. Verify salary/payroll and investment information are exposed only to roles explicitly authorized for those categories.

Verify that the system does not allow a requester to bypass authorization by typing another employee's name/email into a recipient field or by selecting Finance Report.

Verify that the report can contain, subject to authorization and period: Budget Given; Employee Spending; OOP Claims; authorized Salary/Payroll; authorized Investments; authorized financial totals/aggregations; and authorized project-wise financial information.

**Status:** SPEC READY / HUMAN ACTION REQUIRED until Phase 4 implementation and permission tests exist.
### P3-23 — Verify HR Report exact contents and authorization

Verify that **FRM-06 → HR Report** is compiled only from the current authoritative Employees and HR_Admin schemas.

Verify that the report compiler recognizes these Employees fields:
Employee_ID, Name, Email, Role, Salary_Basis, Active, Reimbursement_Eligible, Project_Access, Joining_Date, Employment_Status, HR_Notes, Reimbursement_Settings, Created_At.

Verify that the report compiler recognizes these HR_Admin fields:
HR_Request_ID, Employee_ID, Request_Type, Relevant_Details, Attachment_URL, Status, Submitted_At, Processed_At, Processed_By.

Verify:
- Submitted_At is the primary period field for HR request records.
- Processed_At and Processed_By are included only when populated and authorized.
- Attachment_URL is exposed only when the requester is authorized to access the underlying document.
- Salary_Basis and HR_Notes are not exposed to ordinary Team Member/Contractor or unauthorized Project Lead/Manager requesters.
- Team Member/Contractor requests return only the requester's own authorized HR information.
- Project Lead/Manager requests are limited to explicitly authorized scope.
- HR Admin and Administrator/Site Admin receive only the company-wide fields permitted by their authorization.
- Selecting HR Report cannot grant access to another employee's restricted HR data.
- No fields absent from Employees or HR_Admin are invented.

**Status:** SPEC READY / HUMAN ACTION REQUIRED until Phase 4 implementation and permission tests exist.


## R32 — Report delivery acceptance criteria

The Phase 3 reporting contract is accepted only when the following are frozen for Phase 4:

- All four FRM-06 report types are viewable directly in the system after authorized generation.
- A user is not required to download a report to read it.
- Every generated report provides a user-initiated Download action.
- The downloaded artifact represents the same authorized report content shown to the requester.
- Download cannot expose additional fields/records beyond the on-screen authorization scope.
- Raw Finance/HR/Operations/Admin workbooks are never treated as the report output.
- Authorization is applied before report data is selected and before either View or Download delivery.
- Report request parameters do not grant permissions.
- Exact download format is a Phase 4 implementation detail unless separately frozen; View + Download behavior is mandatory.


## R32 — Report delivery acceptance criteria

The Phase 3 reporting contract is accepted only when the following are frozen for Phase 4:

- All four FRM-06 report types are viewable directly in the system after authorized generation.
- A user is not required to download a report to read it.
- Every generated report provides a user-initiated Download action.
- The downloaded artifact represents the same authorized report content shown to the requester.
- Download cannot expose additional fields/records beyond the on-screen authorization scope.
- Raw Finance/HR/Operations/Admin workbooks are never treated as the report output.
- Authorization is applied before report data is selected and before either View or Download delivery.
- Report request parameters do not grant permissions.
- Exact download format is a Phase 4 implementation detail unless separately frozen; View + Download behavior is mandatory.
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

### R38 — Company Summary acceptance correction
Acceptance criterion for Company Summary presentation is now:
1. Report Header
2. Executive Company Snapshot
3. Projects & Operations
4. Finance Summary — authorized categories only
5. HR Summary — authorized categories only
6. Access Notice

A separate “Period Activity / Key Counts” section must **not** appear. Period-specific metrics must remain within their relevant sections.


### R39 — Project Report acceptance criteria
FRM-06 Project Report is accepted as Phase-3 SPEC READY only when Phase 4 satisfies all of the following:
1. Report header shows Report Type, Project Name, Period, Generated Date and Requested By.
2. Project Overview uses the authoritative Projects record and treats Status as a current snapshot.
3. Project Team is derived from Project_Members + Employees and does not expose restricted HR fields.
4. Project Notes are limited to the requested period and Published status.
5. Project MOMs are limited to the requested period and Published/Revised status.
6. Project Finance Summary includes only authorized project-linked Budget_Given, Employee_Spending and OOP_Claims records for the requested period.
7. Salary/Payroll and Investments are not exposed merely because Project Report was selected.
8. Project Name is resolved by the frozen exact, case-sensitive Projects.Project_Name rule.
9. Requesting a report does not grant project, Finance or HR permissions.
10. On-screen and downloaded Project Reports contain the same authorized content.
11. No raw source workbook export is presented as the Project Report.
**Status:** SPEC READY / HUMAN ACTION REQUIRED until Phase 4 implementation and permission tests exist.

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

## R41 — Finance Report acceptance criteria
Finance Report is accepted only if it uses existing Finance schemas; applies the exact inclusive R40 date range; produces the frozen authorized aggregates; excludes Salary/Payroll unless authorized; excludes Investments unless authorized; enforces Team Member/Contractor self-only, Project Lead project scope, Manager authorized management scope, Finance Admin Finance scope, HR Admin authorized salary scope, and Administrator/Site Admin existing scope; omits unauthorized categories; does not expose proof URLs or confidential fields merely by report selection; and makes View and Download identical in authorized content. The request cannot expand permissions.

## R42 — HR Report acceptance criteria
HR Report is accepted only if it uses Employees and HR_Admin; distinguishes current snapshots from historical reconstruction; uses Joining_Date, Submitted_At, and Processed_At according to the frozen rules; enforces existing role/scope authorization; keeps Team Member/Contractor self-only; limits Project Lead/Manager to explicit authorized scope; restricts HR Admin and Administrator/Site Admin to existing authorized scope; does not expose Salary_Basis, HR_Notes, restricted records, or attachments merely by report selection; and makes View and Download identical in authorized content. The request cannot expand permissions.
