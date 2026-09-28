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
- Project Status: Draft, Active, On Hold, Completed, Cancelled
- Employee Roles: Administrator, Finance Admin, HR Admin, Project Lead, Team Member, Contractor
- Project Roles: Lead, Core Contributor, Reviewer, Observer
- Access Levels: Viewer, Editor, Admin
- Employment Status: Probation, Full-Time, Notice Period, Relieved
- Reimbursement Settings: Standard, Executive, Contractor-Direct
- Finance Status: Submitted, Approved, Rejected, Reimbursed, Partially Reconciled
- Report Types: Executive Summary, Project Status, Finance Audit, HR Rollup

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
