| Revision | Change |
|---|---|
| R1 | Changed target architecture from custom React/Firebase app to Google Sites + Sheets + Forms + Drive + Apps Script. |
| R2 | Removed employee Google Workspace subscriptions as a prerequisite; ordinary Gmail/Google Accounts are the intended employee access model. |
| R3 | Made ₹0 additional software/service spend a hard project constraint. |
| R4 | Retained Google AI Pro as an existing user resource, not a new project cost. |
| R5 | Downgraded advanced visual-builder requirements from mandatory to out-of-scope/optional. |
| R6 | Added sensitive-data access model using restricted Sheets/Drive plus Forms/Apps Script workflows. |
| R7 | Added explicit quota/storage/access conditions so ₹0 is not incorrectly interpreted as unlimited. |
| R8 | Replaced custom app build sequence with a Google-native implementation sequence. |
| R13 | Built Phase 3 as the operational Google Sheets + Forms layer, with schema, Forms mapping, data rules, access matrix and acceptance gate. |
| R14 | Kept Apps Script automation strictly in Phase 4 and preserved the authoritative 5-phase structure. |
| R15 | Initiated Phase 3 execution per Prompt-001. Authored comprehensive Phase-3-Schema-Blueprint.md detailing 3 partitioned workbooks (OPERATIONS, FINANCE, HR_ADMIN), 14 specific tab schemas, stable ID formats, column formats, validation rules, 8 Forms mappings, and documented Rule 14 platform boundaries. Updated acceptance criteria P3-01 through P3-15 and flagged Human Action Boundary. |
| R16 | Reconciled Phase 3 specification across all documents. Explicitly separated Layer A (Google Form), Layer B (Native Response Destination), and Layer C (Authoritative Business Table). Documented Phase 4 processing boundaries for all 8 Forms. Reclassified P3-10 and P3-11 from PASS to SPEC READY / HUMAN ACTION REQUIRED to distinguish required policy from live observed evidence. |
| R17 | Running Change — reconciled Phase 3 documentation before human instantiation: clarified that `Lists_Config` is the canonical configuration definition but native cross-workbook validation linkage must not be assumed; corrected Drive attachment wording to use permission-governed Drive references/URLs rather than “public/workspace” URLs; corrected the physical tab count to 14 authoritative/support schema tabs + 8 native Form response tabs = 22 physical tabs. No architecture, business rule, Phase boundary, or live Google resource was changed. |
| R18 | Running Change — unified employee and HR master data: merged `Joining_Date`, `Employment_Status`, `HR_Notes`, and `Reimbursement_Settings` into the authoritative `Employees` record so employee identity and HR profile are not split across two master tables. Re-scoped `HR_Admin` as an HR request/governance workflow table keyed by `HR_Request_ID` and `Employee_ID`; updated FRM-04 mapping, data rules, acceptance criteria, build guidance, and Phase 3 execution prompt. No change to workbook partitioning, Phase 4 boundary, ₹5,000 rule, or live Google resources.
| R19 | Running Change — removed `Lists_Config` as a dedicated Phase 3 tab. Controlled values are now defined as local native validation rules in the workbook/tab where used; no cross-workbook validation-range dependency or Apps Script synchronization is assumed. Authoritative/support tab count changes from 14 to 13 and physical total from 22 to 21 after all 8 Forms are linked. R18 employee/HR master correction remains in force. No workbook partitioning, Phase boundary, or business-rule change. |
| R20 | Running Change — resolved the remaining ownership ambiguity in the Phase 3 workbook model. `Report_Index` and `Submission_Index` are cross-domain administrative structures, not HR data. Added a restricted `MASTER_COMPANY_ADMIN` workbook containing those 2 tabs; reduced `MASTER_COMPANY_HR_ADMIN` to its true HR-owned tabs (`Employees`, `HR_Admin`). FRM-06 response intake moves to `MASTER_COMPANY_ADMIN`. The authoritative/support total remains 13 and the physical total remains 21 after all 8 Forms are linked. No Phase boundary, business rule, or Phase 1/2 resource was changed. |

| R21 | Running Change — corrected the human-facing Form identity boundary. Authoritative Sheets continue to require stable Project_ID/Employee_ID values, but ordinary Form respondents must not be required to know or type those internal IDs. Forms use human-readable project/employee identity inputs where applicable; Phase 4 resolves them to canonical IDs before authoritative-table writes. Updated the schema blueprint, Forms map, data rules and acceptance gate. No workbook partition, stable-ID invariant, Phase boundary, or business rule was removed. |
| R22 | Running Change — corrected FRM-05 project selection usability. `Project Name` is a required Short answer with no pre-populated project-name choices; respondents enter the human-readable name and Phase 4 resolves it against authoritative `Projects` to canonical `Project_ID`. This prevents a stale hard-coded Form choice list and does not introduce a lookup/configuration table or change the stable-ID invariant. |

| R23 | Corrected salary architecture: `Employees.Salary_Basis` is the agreed 6-month CTC/stipend, not monthly CTC. Normal monthly payroll is generated from that CTC into authoritative `Salary_Admin`; FRM-08 / `Salary_Responses` is removed, reducing native response tabs from 8 to 7 and physical Phase 3 tabs from 21 to 20. |
| R24 | Documentation consistency correction after R23: reconciled Phase 3 prompt, build guidance, Forms map, acceptance gate and progress tracking so the authoritative model is 4 workbooks, 13 authoritative/support tabs, 7 applicable Forms, 7 native response tabs and 20 physical tabs. `Salary_Admin` remains the recurring payroll ledger with no salary Form/response tab. No new architecture, business rule or Phase boundary was introduced. |


| R25 | Running Change — corrected FRM-02 employee identity input. The respondent-facing field is explicitly **Employee Email ID** instead of Employee ID; Phase 4 resolves it against authoritative Employees.Email to canonical Employee_ID. If the respondent's signed-in Google account email differs from the entered Employee Email ID, the captured login email is audit metadata only and must not override the explicit field; the mismatch requires validation failure/manual review or the defined correction workflow. No second login-email question, authoritative schema change, workbook change, or Phase boundary change was introduced. |

| R26 | Resolved the previously unspecified FRM-04 Request_Type controlled-value gap. Locked nine respondent-facing categories: Personal Information Update; Bank / Payment Details Update; Leave / Attendance Request; Employment / HR Document Request; Salary / Payroll Query; Reimbursement / Benefits Query; Project / Role Update; Resignation / Exit Request; Other. Locked FRM-04 fields as Employee Email ID (required), Request Type (required), Relevant Details (required), and optional Attachment / Supporting Document. No internal IDs or workflow fields are respondent-facing. Updated the Phase 3 schema, Forms map, data rules, acceptance criteria, execution prompt, playbook alignment, open questions and progress tracking. No workbook partition, Phase boundary, or Phase 4 automation was changed.


| R27 | Running Change — resolved the previously underspecified FRM-06 respondent-facing field definition. Locked Report Type (required multiple choice with four approved values), Period (required short answer), conditional human-facing Project Name (short answer), and required Recipient Email. Explicitly excluded internal report/workflow fields and kept Project Name resolution/report compilation in Phase 4. Updated the Phase 3 schema, Forms map, data rules, acceptance gate, execution prompt, playbook alignment, open questions and progress tracking. No workbook partition, Phase boundary, or Phase 4 automation was changed. |

| R28 | Simplified the FRM-06 Report Type labels for ordinary users. Replaced the formal labels with: Company Summary, Project Report, Finance Report, HR Report. Updated the Phase 3 Forms Map, Schema Blueprint, Data Rules, Acceptance, Prompt-005, Playbook Alignment, Open Questions and progress tracking. The four report categories remain unchanged in meaning; only respondent-facing names were simplified. |

| R29 | Running Change — defined the Phase-3 meaning and access behavior of Finance Report. The report is a permission-controlled consolidated financial report, not an unrestricted Finance workbook export. Locked role/designation-based recipient scope, authorized categories (Budget Given, Employee Spending, OOP Claims, Salary/Payroll where authorized, Investments where authorized, financial totals and project-wise financial information where authorized), and the rule that report requests cannot expand or bypass underlying permissions. Updated the Phase 3 Forms Map, Schema Blueprint, Data Rules, Acceptance, Prompt-005, Playbook Alignment, Open Questions and progress tracking. No workbook partition or Phase boundary was changed. |

| R30 | Consistency correction — added Manager to the controlled Employees.Role values so the new Finance Report role-based recipient rule has an explicit implementable designation. Manager access remains limited by authorized management/data scope and does not automatically grant restricted salary/payroll or investment access. |
| R31 | Defined the exact Phase-3 meaning, field mapping and authorization boundary for HR Report. Replaced vague HR request labels with the actual HR_Admin columns: HR_Request_ID, Employee_ID, Request_Type, Relevant_Details, Attachment_URL, Status, Submitted_At, Processed_At, and Processed_By. Defined Employees as the sole source for employee/HR master information, prohibited invented HR fields, defined period handling and locked role-based authorization. Updated the Schema Blueprint, Forms Map, Data Rules, Acceptance, Playbook Alignment, Open Questions, Prompt-005 and progress tracking. No workbook, Phase boundary or live Google resource was changed. |


## R32 session note
- Locked a **global report-delivery contract** for all four FRM-06 report types: Company Summary, Project Report, Finance Report and HR Report.
- A generated report must be directly **viewable in the system**; downloading is optional and user-initiated through a Download Report action.
- The downloaded artifact must contain the same authorized report content shown on screen and must never bypass authorization or expose additional source fields/records.
- Raw source workbooks are not report outputs.
- Exact download file format remains a Phase 4 implementation decision; View + Download behavior is frozen now.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.


## R32 session note
- Locked a **global report-delivery contract** for all four FRM-06 report types: Company Summary, Project Report, Finance Report and HR Report.
- A generated report must be directly **viewable in the system**; downloading is optional and user-initiated through a Download Report action.
- The downloaded artifact must contain the same authorized report content shown on screen and must never bypass authorization or expose additional source fields/records.
- Raw source workbooks are not report outputs.
- Exact download file format remains a Phase 4 implementation decision; View + Download behavior is frozen now.
- Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED; Phase 4 remains blocked.
\n\n### R33 — FRM-06 Period field description clarification\n\nFor the respondent-facing FRM-06 **Period** field:\n\n> **Enter the reporting period for which you want the report. Use YYYY-MM for a monthly report (e.g., 2026-09) or YYYY-QN for a quarterly report (e.g., 2026-Q3).**\n\nThe field remains a **required Short answer** and is not a Date question. This clarification did not change the field types or reporting-period semantics at the time. R34 subsequently revises the FRM-06 field set by adding the required Employee Email ID requester-identity field.

### R34 — FRM-06 requester identity and alternate-account handling

R27 is revised for FRM-06 requester identity. The Form must explicitly capture the requester's **Employee Email ID** because the Google account used to open/submit the Form may differ from the employee's company identity.

The authoritative respondent-facing FRM-06 field set is now:

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


## R35 — Remove Recipient Email from FRM-06

### Problem corrected
R34 required both Employee Email ID and Recipient Email. The current report contract displays the authorized report in the system and provides optional user-initiated download; it does not require email delivery.

### Authoritative correction
FRM-06 now has exactly four respondent-facing fields:
1. Employee Email ID — Short answer, Required
2. Report Type — Multiple choice, Required
3. Period — Short answer, Required
4. Project Name — Short answer, Conditional / only when a project-specific report is requested

Remove Recipient Email from FRM-06. Do not add an email-recipient substitute field.

Employee Email ID remains the requester-identity input because the Google account used to submit the Form may differ from the employee's company identity. Phase 4 resolves Employee Email ID against authoritative `Employees.Email` to the canonical `Employee_ID` and authoritative `Role`. Captured Google login email, if available, remains audit metadata only and must not silently override the explicit Employee Email ID.

Reports continue to follow R32: authenticate the requester, apply authorization, generate the authorized report, display it in the system, and provide optional Download Report. No email delivery is implied by FRM-06.

### Scope firewall
Do not:
- add Recipient Email back to FRM-06;
- add an arbitrary email-recipient field under another name;
- allow report requests to expand permissions;
- change Report_Index schema;
- implement Phase 4 or Apps Script during this Phase 3 revision.

### Verification
Confirm:
1. FRM-06 has exactly four respondent-facing fields.
2. Employee Email ID is required.
3. Report Type is required with the four locked report types.
4. Period is required and uses the locked YYYY-MM / YYYY-QN description.
5. Project Name is conditional only for Project Report.
6. Recipient Email is absent from the current FRM-06 specification.
7. Reports remain View + optional Download in Phase 4.
8. Report_Index schema is unchanged.
9. Historical R34 remains identifiable as historical; current FRM-06 uses R35.


### R36 — FRM-06 Project Name exact case-sensitive matching

The current FRM-06 **Project Name** field is explicitly **case-sensitive**. When a project-specific report is requested, the respondent must enter the project name **exactly as it appears in the authoritative Projects.Project_Name field**, including capitalization, spaces, spelling, and punctuation.

Phase 4 must resolve the submitted Project Name using an exact match against Projects.Project_Name. No case-insensitive, fuzzy, trimmed, normalized, or approximate match may silently select a different project. Do not ask for or enter Project_ID, and do not provide a hard-coded project-name choice list in FRM-06.

This revision clarifies the existing human-facing Project Name rule and does not change the four-field FRM-06 structure, report types, workbook schemas, authorization boundary, or Phase 4 ownership of identity resolution.

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
**Date:** 2026-09-29

**Decision:** Remove the standalone “Period Activity / Key Counts” section from Company Summary.

**Reason:** It duplicated period-specific information already contained in Projects & Operations, Finance Summary, and HR Summary.

**Current Company Summary order:**
1. Report Header
2. Executive Company Snapshot
3. Projects & Operations
4. Finance Summary — authorized categories only
5. HR Summary — authorized categories only
6. Access Notice

**Not changed:** Company Summary source mappings, authorization rules, exclusions, View + Download contract, FRM-06 fields, or workbook schemas.


### R39 — Project Report definition frozen
**Date:** 2026-09-29

Defined and froze the complete FRM-06 Project Report output contract:
- six-section presentation order;
- Project Overview source mapping;
- project-member display boundary;
- project notes and MOM period/status rules;
- authorized project-linked finance summary;
- exclusion of Salary/Payroll and Investments from ordinary Project Report content;
- exact Project Name → Project_ID resolution using the existing case-sensitive rule;
- project authorization requirement;
- global View + Download behavior.

No FRM-06 respondent-facing field, workbook schema, Phase boundary or existing Company Summary/Finance/HR rule was changed.

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

### R41 — Finance Report definition frozen
**Date:** 2026-09-29

Finance Report was explicitly reviewed and approved by the user and is now frozen. The authoritative structure is: Report Header; Finance Summary; Budget Given; Employee Spending; OOP Claims; My Salary / Payroll; Access Notice.

Key frozen corrections:
- Investments are excluded from the standard Finance Report.
- Every employee may see their own `Salary_Admin` payroll records.
- Other employees' salary/payroll requires separate authorization.
- Finance Admin access to the Finance workbook does not automatically grant visibility into everyone’s salary.
- The report uses R40 exact inclusive date ranges and R32 View + Download.
- Unauthorized data and restricted proof/attachment/internal fields are omitted.
- No new Phase 3 fields or schemas are introduced.

### R42 — HR Report status correction
**Date:** 2026-09-29

R42 is **DRAFT / NOT FROZEN**. The earlier repository wording that described HR Report as frozen was premature. HR Report remains pending user review and explicit approval. Phase 4 must not treat R42 as a final contract.

### R43 — Finance Report OOP Claims presentation correction
**Date:** 2026-09-29

The user-facing Finance Report no longer displays the redundant `OOP_Claims.Month` field. The OOP Claims section displays Claim Date, Purpose, Project, Claimed Amount, Approved Amount, Status, and Paid Date when applicable.

`OOP_Claims.Month` remains in the authoritative `OOP_Claims` schema for internal processing/reconciliation and must remain consistent with `OOP_Claims.Date`.

R43 changes report presentation only. It does not change the workbook schema, FRM-06 fields, period filtering, authorization model, or Phase 4 source data.

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

### R45 — Compensation and payroll architecture correction
**Date:** 2026-09-29

Expanded the compensation architecture to support recurring monthly compensation and one-time payments. Added Employees.Payment_Frequency and Salary_Admin.Payment_Frequency; made Salary_Admin.Month conditional for Monthly records and added Salary_Admin.Payment_Date for One-Time records. Preserved Employees.Salary_Basis as the agreed compensation basis and clarified self-service CTC visibility. No salary Form/response tab was added.


| R46 | Running Change — corrected the employee master distinction between functional Role and company Designation/level. `Employees.Role` now means what the employee does / functional responsibility; `Employees.Designation` means the employee's company level/position. Added `Designation` to the authoritative Employees schema and HR Report profile. Explicitly separated both fields from authorization/access classification. No new Form field or salary response tab was introduced. |


## R47 — Budget_Given spending and return tracking
Replaced the old Budget_Given status model (`Disbursed`, `Partially Reconciled`, `Reconciled`, `Returned`) with a simple calculated money-flow model. `Amount Given INR` and `Used Amount INR` determine calculated `To Be Returned INR`; `Returned Amount INR` determines calculated `Pending Return Amount INR`; Status is automatically derived as `Pending Return`, `Fully Returned`, or `No Return Required`. Any positive pending amount, including ₹1, remains `Pending Return`. Used Amount cannot exceed Amount Given and Returned Amount cannot exceed To Be Returned. `Recipient Email / Name` is name-or-email, not email-only. No Form, workbook-boundary, Lists_Config, cross-workbook validation, or Phase 4 architecture change.


### R48 — Employee_ID generation gate + canonical employee reference rule
- Employees remains the direct HR/Admin employee-entry surface.
- Added mandatory **GENERATE EMPLOYEE ID** control before **SAVE EMPLOYEE**.
- Saving a new employee without a generated Employee_ID is prohibited.
- Employee_ID is system-generated, stable, never name-derived, never manually overwritten, and never reused.
- Canonical employee references in authoritative business records use Employee_ID; employee names remain display attributes.
- Budget_Given employee recipient field is Recipient Employee_ID instead of Recipient Email / Name.
- Phase 4 Apps Script owns enforcement; Phase 3 freezes the requirement.


### R48 clarification — Global Employee_ID canonical reference rule
- Expanded the Employee_ID rule beyond Budget_Given.
- Employee-linked authoritative records and internal lookups use Employee_ID, including Employee Spending, OOP Claims, Salary Admin, HR Admin, Project Members, Budget Given employee recipients, Reports/internal lookups and future employee-related tables.
- Explicitly preserved non-employee Name fields and entity references: Employees.Name, Recipient_Vendor, and Investments.Source_Person.


| R49 | Running Change — froze the universal stable ID generation standard. All authoritative IDs now use a type-specific prefix plus a six-digit zero-padded sequence (for example `BDG-000001`). IDs are system-generated, immutable, never reused, independent of row position/business attributes, and gaps are allowed. Phase 4 must implement independent per-prefix counters using Apps Script PropertiesService with LockService concurrency protection, startup/recovery reconciliation against existing records, format validation, and duplicate-trigger/idempotency protection. Employee_ID remains the canonical employee key for employee-linked authoritative records. This revision changes ID format/Generation policy only; it does not change workbook boundaries, Phase 3 tab structure, Forms, business calculations, or the Phase 4 boundary.


| R50 | Architecture change — frozen employee self-service retrieval contract. After an applicable Form submission is processed and an authoritative business record receives its system-generated ID, the employee must be able to retrieve the authorized record and view its generated ID through the company website's My Records area. This does not add Form fields, change workbook schemas, expose restricted source workbooks, or move implementation into Phase 3. Phase 4 owns processing/linkage; Phase 5 owns the employee-facing retrieval experience and end-to-end verification. |
