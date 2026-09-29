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


### R25 — FRM-02 Employee Email ID and alternate-login handling

FRM-02 respondent-facing employee identity is now explicitly **Employee Email ID** (required), rather than Employee_ID or an ambiguous generic employee-identity label.

Phase 4 resolves the submitted Employee Email ID against authoritative Employees.Email to obtain Employee_ID.

If the respondent is signed into Google Forms with a different email address, the signed-in address is retained only as submission/audit metadata where platform capture is enabled. It must not override the explicit Employee Email ID. A mismatch must not be silently mapped to another employee; Phase 4 places the submission into validation failure/manual review or the defined correction workflow before authoritative transfer.

### R26 — FRM-04 Request Type controlled values

FRM-04 is locked to these respondent-facing fields:

| Field | Type | Required |
|---|---|---|
| Employee Email ID | Short answer | Yes |
| Request Type | Multiple choice | Yes |
| Relevant Details | Paragraph | Yes |
| Attachment / Supporting Document | File upload | No |

Request Type must use exactly these nine controlled values:
1. Personal Information Update
2. Bank / Payment Details Update
3. Leave / Attendance Request
4. Employment / HR Document Request
5. Salary / Payroll Query
6. Reimbursement / Benefits Query
7. Project / Role Update
8. Resignation / Exit Request
9. Other

Do not add Employee_ID, HR_Request_ID, Status, Submitted_At, Processed_At, or Processed_By to the Form. Phase 4 resolves Employee Email ID to canonical Employee_ID and creates/updates the HR workflow record.


### R27 — FRM-06 Report Request field lock

FRM-06 respondent-facing fields are locked as follows:

| Field | Type | Required |
|---|---|---|
| Report Type | Multiple choice | Yes |
| Period | Short answer | Yes |
| Project Name | Short answer | Conditional / only when a project-specific report is requested |
| Recipient Email | Short answer | Yes |

Report Type must use exactly these four approved Report_Index.Report_Type values:
1. Company Summary
2. Project Report
3. Finance Report
4. HR Report

Period is a text reporting period such as 2026-09 or 2026-Q3; it is not a Date question.

Project Name is a human-facing free-text input. Do not ask for Project_ID, do not hard-code a project-name choice list, and do not create a lookup/configuration tab. Phase 4 resolves the supplied Project Name to canonical Project_ID when applicable.

Recipient Email is required because the Forms Map explicitly requires FRM-06 to capture recipient email for Phase 4 report delivery/distribution.

Do not ask respondents for Report_ID, Project_ID, Drive_URL, Status, Generated_Date, Submission_ID, or other Phase 4/system fields.

The native response destination remains Report_Requests_Responses in MASTER_COMPANY_ADMIN; Report_Index remains the authoritative catalog.
