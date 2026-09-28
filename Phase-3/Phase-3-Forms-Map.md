| Form ID | Form | Native Response Destination | Authoritative Target | Phase 3 Native Capability | Phase 4 Processing Required |
|---|---|---|---|---|---|
| FRM-01 | Create / Request Project | Projects_Responses (in MASTER_COMPANY_OPERATIONS) | Projects and Project_Members | Native Google Forms records flat row submission with project details and list of assigned members. | Normalization required: Parse assigned members into multiple normalized junction records in Project_Members; assign stable PRJ-XXX and MBR-XXX IDs; create Phase 1 Drive project folders. |
| FRM-02 | Employee Spending / Expense | Employee_Spending_Responses (in MASTER_COMPANY_FINANCE) | Employee_Spending | Native Google Forms captures raw expense details and stores receipt in Drive via native upload engine. | Validation and transfer: Validate employee identity; assign stable SPN-XXX ID; evaluate status; route attachment link to Employee_Spending. |
| FRM-03 | OOP Claim | OOP_Claims_Responses (in MASTER_COMPANY_FINANCE) | OOP_Claims | Native Google Forms captures raw claim metadata and proof file in Drive. | Business rule execution: Assign stable CLM-XXX ID; evaluate the frozen ₹5,000 threshold rule; populate Approved_Amount and OOP_Rule_Flag; update status. |
| FRM-04 | Employee Update / HR Request | HR_Requests_Responses (in MASTER_COMPANY_HR_ADMIN) | HR_Admin | Native Google Forms logs request details and optional attachment to response sheet. | Workflow routing: Dispatch email notifications to HR Admin; create/update an `HRR-XXX` request record in `HR_Admin` keyed to `Employee_ID`; update `Submission_Index`. Employee profile changes are applied to the authoritative `Employees` master during Phase 4 processing where applicable. |
| FRM-05 | MOM Input | MOM_Responses (in MASTER_COMPANY_OPERATIONS) | Project_MOM_Index | Native Google Forms captures meeting metadata, attendee emails, and notes. | Document and distribution engine: Assign stable MOM-XXX ID; generate published Google Doc in 04_MOM; distribute email notices to registered attendee emails; record in Project_MOM_Index. |
| FRM-06 | Report Request (optional) | Report_Requests_Responses (in MASTER_COMPANY_ADMIN) | Report_Index | Native Google Forms logs report request type, period, and recipient email. | Report compiler: On-demand compilation of requested report; generate output PDF/Sheet; catalog in Report_Index. |
| FRM-07 | Investment Entry (admin) | Investment_Responses (in MASTER_COMPANY_FINANCE) | Investments | Native Google Forms captures capital inflow/outflow entries from authorized Admin. | Ledger transfer: Assign stable INV-XXX ID; validate dates; transfer record into authoritative Investments ledger. |


## R21 — Human-facing identity input rule

The Forms layer must be usable by ordinary respondents. Stable internal IDs remain authoritative in the Sheets layer, but normal respondents must not be required to know or type them.

| Form | Human-facing input | Phase 4 resolution |
|---|---|---|
| FRM-01 Create / Request Project | Project Name; human-facing member identity | Resolve/assign canonical `Project_ID` and `Employee_ID` values as applicable; generate stable record IDs. |
| FRM-02 Employee Spending / Expense | Employee identity (prefer respondent email where available) + Project Name | Resolve to `Employee_ID` and `Project_ID`. |
| FRM-03 OOP Claim | Employee identity + Project Name | Resolve to `Employee_ID` and `Project_ID`. |
| FRM-04 Employee Update / HR Request | Employee identity (prefer respondent email where available) | Resolve to `Employee_ID`. |
| FRM-05 MOM Input | Project Name | Resolve to `Project_ID`. |
| FRM-06 Report Request | Project Name when a project-specific report is requested | Resolve to `Project_ID` when supplied. |
| FRM-07 Investment Entry | Source Person name/entity | No employee/project foreign-key resolution is required by the authoritative schema. |
 |

**Invariant:** No normal respondent should be asked to manually invent or guess a stable system ID such as `PRJ-001` or `EMP-001`. The authoritative tables retain the IDs; Phase 4 performs the lookup/normalization.
### R22 — FRM-05 Project Name control

FRM-05 **Project Name** must be implemented as a **required Short answer**, not as a pre-populated dropdown of current project names.

The Form must not embed a manually maintained list copied from `Projects.Project_Name`. Respondents enter the human-readable project name; Phase 4 resolves and validates it against the authoritative `Projects` table and writes the canonical `Project_ID` to `Project_MOM_Index`.

This preserves the R21 rule while preventing stale hard-coded Form choices. No lookup/configuration tab is introduced.


### R23 — Salary is recurring payroll, not a monthly Form

FRM-08 / `Salary_Responses` is removed from the Phase 3 Form architecture. `Employees.Salary_Basis` stores the agreed **6-month CTC/stipend**. Phase 4 derives monthly salary for each applicable active employee and creates the monthly `SAL-XXX` record in `Salary_Admin`. HR/Finance does not fill a salary Form for every employee every month. `Salary_Admin` is the authoritative payroll ledger and no `Salary_Responses` tab is created.
