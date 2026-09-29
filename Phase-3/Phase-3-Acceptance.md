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
- Recipient Email — Short answer, Required.

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

### R34 — FRM-06 requester identity and alternate-account handling

R27 is revised for FRM-06 requester identity. The Form must explicitly capture the requester's **Employee Email ID** because the Google account used to open/submit the Form may differ from the employee's company identity.

The authoritative respondent-facing FRM-06 field set is now:

| # | Field | Type | Required |
|---|---|---|---|
| 1 | Employee Email ID | Short answer | Yes |
| 2 | Report Type | Multiple choice | Yes |
| 3 | Period | Short answer | Yes |
| 4 | Project Name | Short answer | Conditional / only when a project-specific report is requested |
| 5 | Recipient Email | Short answer | Yes |

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

**Project Name** remains a conditional Short answer for project-specific reports. It is a human-facing project name; do not ask for Project_ID or provide a hard-coded project-name choice list.

**Recipient Email** remains a required Short answer for report delivery/distribution.

Do not add respondent-facing Employee_ID, Designation/Role, Report_ID, Project_ID, Drive_URL, Status, Generated_Date, Submission_ID, or other Phase 4 processing fields.

This revision changes the FRM-06 respondent-facing field count from four to five. It does not change the authoritative workbook schemas, Report_Index schema, report types, or the Phase 4 authorization boundary.
