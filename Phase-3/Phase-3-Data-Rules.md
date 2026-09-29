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

FRM-06 must collect only the report-request data defined by the current R34 Forms Map:
- Report Type: required controlled multiple-choice value using exactly Company Summary, Project Report, Finance Report, HR Report.
- Period: required text in reporting-period form such as 2026-09 or 2026-Q3; do not use a full Date field.
- Project Name: human-facing Short answer, used only when the requested report is project-specific; do not request Project_ID or hard-code current project names.
- Recipient Email: required Short answer for report delivery/distribution.

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
