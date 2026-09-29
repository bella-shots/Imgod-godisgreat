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

Before human instantiation of FRM-06, use this exact respondent-facing specification:

- Report Type — Multiple choice, Required. Exact options: Company Summary, Project Report, Finance Report, HR Report.
- Period — Short answer, Required. Use reporting-period text such as 2026-09 or 2026-Q3; do not use a Date question.
- Project Name — Short answer, conditional/only when a project-specific report is requested. Do not provide a hard-coded project-name choice list and do not ask for Project_ID.
- Recipient Email — Short answer, Required.

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
