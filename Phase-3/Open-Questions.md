| OPEN QUESTIONS / DECISIONS TO CONFIRM BEFORE PRODUCTION |  |  |  |  |  |  |
|---|---|---|---|---|---|
| ID | Question | Default for 2-Day Build | Why It Matters | Decision Needed By | Impact | Status |
| Q01 | Which visual editor engine will be used? | Google Sites native page builder; optional Apps Script HTML interface only where a custom interaction is essential or equivalent mature editor | This is the key mechanism that makes the full builder achievable in 2 days. | 20-Sep 09:00 | High | Open |
| Q02 | Should standard users be able to create projects? | Configurable permission; admin can enable | Requirement says anyone with access can edit, but project creation is not explicitly restricted. | 20-Sep 09:00 | Medium | Open |
| Q03 | Who receives MOM emails? | Registered project participant emails | Need authoritative recipient source. | 21-Sep 11:30 | Medium | Open |
| Q04 | Should uploaded Excel be parsed into editable web tables? | File is displayed/downloaded; structured expense records are separately editable | Avoid corrupting authoritative Excel while still enabling calculations. | 20-Sep 15:00 | High | Open |
| Q05 | Exact ₹5,000 interpretation? | Configurable: threshold + requested extra ₹5,000 line item | Wording can produce different accounting outcomes. | 21-Sep 08:20 | High | Open |
| Q06 | Who can run custom JavaScript? | Admin only by default | Arbitrary JS is a major security boundary. | 21-Sep 15:00 | Critical | Open |
| Q07 | Should plugins be arbitrary third-party code? | Plugin registration API, admin-controlled; no untrusted third-party runtime | Security and production stability. | 21-Sep 17:10 | Critical | Open |
| Q08 | Published custom pages run on same domain or separate route/subdomain? | Same app domain with isolated page runtime | Determines routing and script isolation design. | 21-Sep 18:00 | High | Open |
| Q07 | Must the app remain at ₹0 additional cost beyond the existing Google AI Pro subscription? | Yes — hard constraint for this build | Determines storage, email, hosting and backend choices. | 20-Sep 10:00 | High | Resolved |
| Q08 | Should normal Form respondents manually enter stable Project_ID/Employee_ID values? | No. Use human-readable identity inputs and resolve to canonical IDs in Phase 4. | Internal IDs are system identifiers, not reasonable respondent-facing inputs. | 27-Sep | High | Resolved |
| Q09 | Should FRM-05 embed current project names as a Form choice list? | No. Required Short answer; Phase 4 validates/resolves against authoritative `Projects`. | A copied choice list becomes stale as projects change and would create an unnecessary Phase 3 maintenance dependency. | 28-Sep | High | Resolved |

| Q10 | Should normal monthly payroll be entered through a salary Form? | No. Use the agreed 6-month CTC in `Employees.Salary_Basis` and generate monthly payroll records in `Salary_Admin`. | A Form-per-employee-per-month workflow is unnecessary and impractical. | 28-Sep | High | Resolved |


| Q11 | Should FRM-02 use the submitted Employee Email ID or the signed-in Google account email when they differ? | Use the explicit **Employee Email ID** as the employee identity input; retain any platform-captured signed-in email only as audit metadata. A mismatch is not silently resolved and must enter validation failure/manual review or the defined correction workflow. | Prevents a submission from being attributed to the wrong employee when a respondent uses a different Google login. | 29-Sep | High | Resolved |

| Q12 | What controlled values should FRM-04 Request Type use? | Nine locked values: Personal Information Update; Bank / Payment Details Update; Leave / Attendance Request; Employment / HR Document Request; Salary / Payroll Query; Reimbursement / Benefits Query; Project / Role Update; Resignation / Exit Request; Other. | Prevents the Form builder from inventing categories and defines the HR workflow taxonomy. | 29-Sep | Medium | Resolved |


| Q13 | What exact respondent-facing fields should FRM-06 use? | Employee Email ID (required), Report Type (4 locked values), Period (required text), conditional Project Name (free text). Recipient Email is not used. | Prevents the Form builder from inventing fields or exposing internal report/workflow columns. | 29-Sep | Medium | Resolved |


| Q14 | What should Finance Report return and who may receive it? | Finance Report is a permission-controlled consolidated report. Budget Given, Employee Spending, OOP Claims, authorized Salary/Payroll, authorized Investments, authorized financial totals and authorized project-wise financial information may be included according to requester role/designation and scope. Recipient selection is role-controlled and cannot bypass permissions. | Prevents a report request from exposing restricted salary, investment or other employee financial records. | 29-Sep | Critical | Resolved |
| Q15 | What exactly should HR Report return? | HR Report is a permission-controlled report using only the current Employees and HR_Admin schemas. HR request fields are HR_Request_ID, Employee_ID, Request_Type, Relevant_Details, Attachment_URL, Status, Submitted_At, Processed_At, and Processed_By. Employee profile fields come only from Employees. | Prevents vague HR-report definitions and prevents invented HR fields. | 29-Sep | Critical | Resolved |


## R32 — Resolved reporting output question

**Resolved:** Report delivery is not download-only and is not a raw workbook export.

The universal behavior is:
- display the generated authorized report directly in the system; and
- provide a Download Report action for users who want a copy.

The download must reflect the same authorization and report content as the displayed report. The exact downloadable file format remains a Phase 4 implementation detail.


## R32 — Resolved reporting output question

**Resolved:** Report delivery is not download-only and is not a raw workbook export.

The universal behavior is:
- display the generated authorized report directly in the system; and
- provide a Download Report action for users who want a copy.

The download must reflect the same authorization and report content as the displayed report. The exact downloadable file format remains a Phase 4 implementation detail.
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

### R38 — Redundant Company Summary section removed
The standalone “Period Activity / Key Counts” section is removed because the same period-specific information is already defined within Projects & Operations, Finance Summary, and HR Summary.

No open question remains regarding this presentation item.


### R39 — Project Report definition resolved
Resolved: What exactly should FRM-06 → Project Report return?

The frozen answer is:
1. Report Header
2. Project Overview
3. Project Team
4. Project Activity & Documentation
5. Project Finance Summary — authorized project-linked finance only
6. Access Notice

The report uses the existing Projects, Project_Members, Employees, Project_Notes, Project_MOM_Index, Budget_Given, Employee_Spending and OOP_Claims schemas only.
Project Report does not automatically expose Salary/Payroll, Investments, Salary_Basis, HR_Notes or unrelated employee HR information. Existing authorization remains the controlling boundary.
**Status:** Resolved / No open question.

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

## R41 closure — Finance Report
The Finance Report definition is closed and frozen as of 2026-09-29 following explicit user approval. The frozen seven-section content, source schemas, salary self-access rule, Investment exclusion, period handling, authorization boundary, exclusions, and View + Download behavior are authoritative. Any change requires a new revision and explicit approval.

## R43 — Finance Report OOP Claims presentation correction
The OOP Claims section must show Claim Date rather than the internal `OOP_Claims.Month` field. `OOP_Claims.Month` remains authoritative in the source schema and is retained for internal processing/reconciliation. No Form field or source schema changes.

## R42 — HR Report remains open
HR Report is **not frozen**. Its content and authorization proposal remains pending user review and explicit approval. No Phase 4 implementation may treat the current HR Report proposal as final.

