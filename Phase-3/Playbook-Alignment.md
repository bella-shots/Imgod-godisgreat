| ALIGNMENT WITH UPLOADED APP-BUILDING PLAYBOOK |  |  |  |  |
|---|---|---|---|---|
| Playbook Principle | How this workbook applies it | Where | Why it matters for 2-day build | Status |
| Architecture before coding | Architecture, builder-engine choice, data ownership, security boundaries are first tasks. | D1-01:D1-04 | Prevents Google AI Studio from improvising the system. | Applied |
| Six-file context + agents.md | Created before implementation and restored on Day 2. | D1-05,D2-01 | Lets AI Studio resume without rediscovering requirements. | Applied |
| Feature specs | Business modules and builder capabilities are decomposed into units. | Feature Specs | Controls AI scope and reduces debugging loops. | Applied |
| One unit at a time | Each checklist item has dependency, exact action and verification. | 2-Day Checklist | Allows parallel-looking speed without architectural drift. | Applied |
| Provider-native capabilities | Full builder uses mature editor engine rather than custom canvas implementation. | D1-19,D2-10:D2-18 | This is the main mechanism for fitting full builder into 2 days. | Applied |
| Server-side authorization | Permissions are enforced at mutation/API boundaries. | Permissions Matrix,D2-19:D2-20 | UI-only hiding is insufficient. | Applied |
| Focused corrections | Exact errors become corrective prompts rather than full-project re-prompts. | AI Studio Prompt Sequence | Reduces regression and wasted time. | Applied |
| Review before completion | AI-generated code is reviewed before merge/deploy. | D2-23 | Catches spec/security mismatches. | Applied |
| Production verification | Deploy, inspect logs and test critical flows. | D2-24:D2-25 | Prevents assuming a successful build is a successful product. | Applied |
| Cost-aware architecture | Architecture assigns each responsibility to an existing/free/open-source service appropriate for a ~20-person internal system. | Read Me; Required Tools; architecture tasks | Prevents unnecessary infrastructure and keeps the 2-day build aligned with the user's ₹0 additional-cost constraint. | Applied |
| Ambiguity handling / specification sync | R21 was recorded as a focused correction after an observed Form usability mismatch; authoritative IDs were preserved while human-facing inputs were clarified and downstream resolution was bounded to Phase 4. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Revision-Log; progress-tracker | Prevents the implementation agent from guessing how respondents obtain internal IDs. | Applied |
| Focused correction / anti-staleness | R22 corrects FRM-05 so Project Name is a required Short answer rather than a manually maintained Form choice list; Phase 4 remains the identity-resolution boundary. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005; Revision-Log; progress-tracker | Prevents a stale project selector and keeps live identity resolution out of Phase 3. | Applied |

| Salary workflow correction | Recurring payroll is derived from the employee's agreed 6-month CTC and recorded monthly in `Salary_Admin`; normal payroll is not repetitive Form entry. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005 | Prevents an impractical employee-by-employee monthly salary-entry workflow and keeps recurring payroll automation in Phase 4. | Applied |


| Focused correction / identity mismatch handling | R25 makes FRM-02's respondent-facing field explicitly Employee Email ID and defines deterministic handling when the respondent is logged into a different Google account: do not silently substitute the login email; retain it only as audit metadata and route mismatch to validation/manual review before authoritative transfer. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005; Revision-Log | Prevents accidental employee misattribution while keeping Phase 4 as the identity-resolution boundary. | Applied |

| Focused correction / HR request taxonomy | R26 locks FRM-04 Request Type to nine controlled values and defines the exact respondent-facing field set, eliminating the previously unspecified controlled-value gap. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005; Revision-Log; progress-tracker | Prevents implementation agents from inventing HR request categories and keeps the Form/workflow boundary explicit. | Applied |


| Focused correction / FRM-06 report-request field lock | R35 supersedes the historical R27/R34 field lock. Current FRM-06 fields are Employee Email ID, Report Type, Period, and conditional Project Name; Recipient Email is removed. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005; Revision-Log; progress-tracker | Prevents the Form builder from inventing report categories, identity fields or workflow fields and keeps report compilation in Phase 4. | Applied |


### R29 — Finance Report security alignment

FRM-06 Finance Report is aligned to the playbook's restricted-data principle: report generation is a controlled presentation of already-authorized data, not a permission-escalation mechanism. The report compiler must enforce requester role/designation and authorized scope before selecting Finance records. Report access must be role-controlled and cannot be used to bypass Finance/HR restrictions.
### R31 — HR Report must follow authoritative schema, not generic HR assumptions

For **FRM-06 → HR Report**, implementation guidance must map report content directly to the current Employees and HR_Admin schemas.

Do not describe report contents using vague labels such as “workflow information”, “processing information”, or “employee/requester” without mapping them to actual columns.

The exact HR_Admin mapping is:
- Employee/requester → Employee_ID resolved through Employees
- Request type → Request_Type
- Request details → Relevant_Details
- Status → Status
- Request date → Submitted_At
- Processing information → Processed_At and Processed_By
- Supporting document → Attachment_URL

The exact employee-profile source is Employees; HR_Admin must not become a duplicate employee master.

The implementation must not invent HR fields that are not present in the authoritative schema.


## R32 — Required Phase 4 reporting behavior

The Phase 3 contract now requires the Phase 4 Apps Script reporting layer to treat reports as **generated presentation outputs**, not raw Sheet exports.

For every FRM-06 report type, Phase 4 must implement: authorization → report generation → in-system display → user-initiated download of the same authorized report.

The implementation must not create separate weaker/stronger authorization paths for View and Download. The exact download format is intentionally left open for Phase 4 unless separately approved.


## R32 — Required Phase 4 reporting behavior

The Phase 3 contract now requires the Phase 4 Apps Script reporting layer to treat reports as **generated presentation outputs**, not raw Sheet exports.

For every FRM-06 report type, Phase 4 must implement: authorization → report generation → in-system display → user-initiated download of the same authorized report.

The implementation must not create separate weaker/stronger authorization paths for View and Download. The exact download format is intentionally left open for Phase 4 unless separately approved.
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

### R38 — Company Summary presentation correction
Phase 4 must not create a separate “Period Activity / Key Counts” section. Period-specific activity is displayed inside the relevant Company Summary sections. This is a presentation correction only; no source schema or Form field changes.


### R39 — Project Report implementation alignment
The Phase-4 implementation contract for Project Report is now frozen.

Implementation sequence:
1. Identify/authenticate requester.
2. Resolve the submitted Project Name using the exact case-sensitive Projects.Project_Name rule.
3. Resolve canonical Project_ID.
4. Verify requester already has authorized access to that project.
5. Select only authorized project, project-member, documentation and project-linked finance records.
6. Generate the frozen six-section Project Report.
7. Display it in the system.
8. Provide optional Download Report containing the same authorized content.

Do not use Project Report to grant project access, bypass Finance/HR restrictions, expose raw workbook tabs, or invent new business fields.

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

## R41 — Frozen Finance Report contract
Finance Report is frozen to the user-approved seven-section structure: Report Header, Finance Summary, Budget Given, Employee Spending, OOP Claims, My Salary / Payroll, Access Notice. It uses existing Finance schemas, R40 exact inclusive date ranges, existing authorization boundaries, and R32 View + Download. Investments are outside the standard Finance Report. Every employee may view their own Salary_Admin payroll; broader payroll visibility requires separate authorization. No report request may expand permissions.

**R43 presentation correction:** OOP Claims in the user-facing Finance Report shows Claim Date, not the internal `OOP_Claims.Month` field. The authoritative `OOP_Claims.Month` source column remains unchanged.

## R42 — HR Report contract — draft / not frozen
HR Report remains a draft proposal pending user review and explicit approval. It must not be treated as a frozen contract or implemented as final behavior.

