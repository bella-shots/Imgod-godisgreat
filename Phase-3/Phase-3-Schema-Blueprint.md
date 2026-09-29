# Master Company — Phase 3 Complete Schema & Blueprint Specification

**Authoritative Specification for Phase 3: Google Sheets + Google Forms**  
**Document Reference:** `Phase-3/Phase-3-Schema-Blueprint.md`  
**Execution Reference:** `Phase-3/ChatGPT Prompt/Prompt-005.md` (current running-change prompt; Prompt-001 through Prompt-004 remain historical)  
**Architecture:** Google Sheets (Authoritative Data Layer) • Google Forms (Controlled Input Layer) • Google Drive (File Storage) • Google Sites (Presentation Layer)  
**Budget Constraint:** ₹0.00 Additional Project Spend (Native Google consumer free-tier accounts)  

---

## 1. Architectural Distribution & Workbook Boundaries

To enforce **Access Control (Rule 15)** and **Zero-Trust Sensitive Data Protection (Rule 12)** without relying on cosmetic UI tab-hiding:
The data layer is partitioned into four distinct Google Sheets workbooks with isolated Drive permission boundaries:

1. **`MASTER_COMPANY_OPERATIONS`** (General / Project Member accessible workbook)
   - Authoritative Tabs: `Projects`, `Project_Members`, `Project_Notes`, `Project_MOM_Index`
   - Native Form Intake Tabs: `Projects_Responses`, `MOM_Responses`
   - Required Access Policy: Site Admin / Project Lead (Editor); Assigned Employees / Project Members (Viewer).
   - Native Form response tabs are intake destinations only and are not authoritative business tables.
2. **`MASTER_COMPANY_FINANCE`** (Restricted Finance & Accounting workbook)
   - Authoritative Tabs: `Budget_Given`, `Employee_Spending`, `OOP_Claims`, `Salary_Admin`, `Investments`
   - Native Form Intake Tabs: `Employee_Spending_Responses`, `OOP_Claims_Responses`, `Investment_Responses`
   - Required Access Policy: Site Admin / Finance Admin ONLY (Private / Restricted). Ordinary employees must have 0 direct access to this workbook (employees submit strictly via Forms).
   - Native Form response tabs are intake destinations only and are not authoritative business tables.
3. **`MASTER_COMPANY_HR_ADMIN`** (Restricted People Operations workbook)
   - Authoritative Tabs: `Employees`, `HR_Admin`
   - Native Form Intake Tabs: `HR_Requests_Responses`
   - Required Access Policy: Site Admin / HR Admin ONLY (Private / Restricted). Ordinary employees must have 0 direct access to this workbook.
   - Native Form response tabs are intake destinations only and are not authoritative business tables.
4. **`MASTER_COMPANY_ADMIN`** (Restricted cross-domain administration, reporting & audit workbook)
   - Authoritative Tabs: `Report_Index`, `Submission_Index`
   - Native Form Intake Tabs: `Report_Requests_Responses`
   - Required Access Policy: Site Admin ONLY (Private / Restricted). Ordinary employees and ordinary project/finance/HR users must have 0 direct access to this workbook.
   - This workbook owns cross-domain report cataloguing and central submission traceability. It is intentionally separate from HR because neither structure is an HR master record.
   - Native Form response tabs are intake destinations only and are not authoritative business tables.

### Physical tab count
Phase 3 defines **13 authoritative/support schema tabs** across the four workbooks plus **7 applicable native Form response tabs**, for **20 physical tabs total**. Recurring payroll is not a Form workflow; `Salary_Admin` is authoritative and has no native response tab. `Lists_Config` is removed; controlled values are defined locally in the relevant workbook/tab validation rules. The response tabs are platform-created intake destinations and must not be counted as additional authoritative business tables.

---

## 2. Comprehensive Tab Schemas, Formats & Validation Rules

### Tab 1: `Projects` (Master Data)
- **Workbook:** `MASTER_COMPANY_OPERATIONS`
- **Purpose:** Authoritative project registry.
- **Sensitivity:** Moderate.
- **Columns:**
  1. `Project_ID` (Text, Format: `PRJ-XXX`, e.g., `PRJ-001`. Stable unique ID. Required)
  2. `Project_Name` (Text, Required)
  3. `Description` (Text)
  4. `Owner` (Email address of project lead, Required)
  5. `Start_Date` (Date, Format: `YYYY-MM-DD`, Required)
  6. `Event_Date` (Date, Format: `YYYY-MM-DD`, Target/delivery date)
  7. `Status` (Dropdown: `Draft`, `Active`, `On Hold`, `Completed`, `Cancelled`. Apply these approved values locally in the workbook; do not depend on a cross-workbook validation range.)
  8. `Drive_Folder_URL` (URL to Phase 1 folder `MASTER COMPANY/Projects/PROJECT_XXX`)
  9. `Notes` (Text)
  10. `Created_At` (Timestamp, Format: `YYYY-MM-DD HH:mm:ss`)

### Tab 2: `Employees` (Unified Employee + HR Master Data)
- **Workbook:** `MASTER_COMPANY_HR_ADMIN`
- **Purpose:** Single authoritative employee and people/HR master record. Employee identity, employment status, HR attributes, reimbursement eligibility and project-access baseline are kept together here to avoid splitting one person's master record across `Employees` and `HR_Admin`.
- **Sensitivity:** High (Restricted).
- **Columns:**
  1. `Employee_ID` (Text, Format: `EMP-XXX`, Stable unique ID. Required)
  2. `Name` (Text, Required)
  3. `Email` (Email address, Unique, Required)
  4. `Role` (Dropdown: `Administrator`, `Finance Admin`, `HR Admin`, `Manager`, `Project Lead`, `Team Member`, `Contractor`. Apply these approved values locally.)
  5. `Salary_Basis` (Currency INR, Format: `₹#,##0.00`, Agreed 6-month CTC/stipend)
  6. `Active` (Boolean: `TRUE` / `FALSE`, Required)
  7. `Reimbursement_Eligible` (Boolean: `TRUE` / `FALSE`, Required)
  8. `Project_Access` (Text, Comma-delimited `Project_ID` values or role tag)
  9. `Joining_Date` (Date, Format: `YYYY-MM-DD`, Required)
  10. `Employment_Status` (Dropdown: `Probation`, `Full-Time`, `Notice Period`, `Relieved`)
  11. `HR_Notes` (Text, Confidential internal notes)
  12. `Reimbursement_Settings` (Dropdown: `Standard`, `Executive`, `Contractor-Direct`)
  13. `Created_At` (Timestamp, Format: `YYYY-MM-DD HH:mm:ss`)

### Tab 3: `Project_Members` (Projects Mapping)
- **Workbook:** `MASTER_COMPANY_OPERATIONS`
- **Purpose:** Relational junction table mapping employees to projects.
- **Sensitivity:** High (Managed by Admin/Lead).
- **Columns:**
  1. `Member_Record_ID` (Text, Format: `MBR-XXX`, Stable unique ID)
  2. `Project_ID` (Text, Foreign Key -> `Projects.Project_ID`, Required)
  3. `Employee_ID` (Text, Foreign Key -> `Employees.Employee_ID`, Required)
  4. `Project_Role` (Dropdown: `Lead`, `Core Contributor`, `Reviewer`, `Observer`)
  5. `Access_Level` (Dropdown: `Viewer`, `Editor`, `Admin`)
  6. `Active` (Boolean: `TRUE` / `FALSE`, Required)
  7. `Assigned_Date` (Date, Format: `YYYY-MM-DD`)

### Tab 4: `Project_Notes` (Projects Documentation)
- **Workbook:** `MASTER_COMPANY_OPERATIONS`
- **Purpose:** Structured operational updates and project documentation notes.
- **Sensitivity:** Moderate.
- **Columns:**
  1. `Note_ID` (Text, Format: `NOT-XXX`, Stable unique ID)
  2. `Project_ID` (Text, Foreign Key -> `Projects.Project_ID`, Required)
  3. `Date` (Date, Format: `YYYY-MM-DD`, Required)
  4. `Author_Email` (Email, Submitter address)
  5. `Note` (Text, Detailed body content, Required)
  6. `Status` (Dropdown: `Draft`, `Published`, `Archived`)
  7. `Created_At` (Timestamp, Format: `YYYY-MM-DD HH:mm:ss`)

### Tab 5: `Project_MOM_Index` (Minutes of Meeting Index)
- **Workbook:** `MASTER_COMPANY_OPERATIONS`
- **Purpose:** Index catalog of meeting minutes, participants, and published Doc references.
- **Sensitivity:** Moderate.
- **Columns:**
  1. `MOM_ID` (Text, Format: `MOM-XXX`, Stable unique ID)
  2. `Project_ID` (Text, Foreign Key -> `Projects.Project_ID`, Required)
  3. `Meeting_Date` (Date, Format: `YYYY-MM-DD`, Required)
  4. `Title` (Text, Meeting subject, Required)
  5. `Participants` (Text, Comma-separated names)
  6. `Registered_Email_IDs` (Text, Comma-separated attendee emails)
  7. `Version` (Text, Format: `v1.0`, `v1.1`, etc.)
  8. `Status` (Dropdown: `Draft`, `Published`, `Revised`)
  9. `Drive_URL` (URL to MOM document in `04_MOM`)
  10. `Published_At` (Timestamp, Format: `YYYY-MM-DD HH:mm:ss`)
  11. `Published_By` (Email)

### Tab 6: `Budget_Given` (Finance Disbursals)
- **Workbook:** `MASTER_COMPANY_FINANCE`
- **Purpose:** Disbursals/advances allocated to personnel for project execution.
- **Sensitivity:** High (Restricted).
- **Columns:**
  1. `Budget_ID` (Text, Format: `BDG-XXX`, Stable unique ID)
  2. `Date` (Date, Format: `YYYY-MM-DD`, Disbursal date, Required)
  3. `Recipient` (Email / Name of recipient, Required)
  4. `Amount` (Currency INR, Format: `₹#,##0.00`, Number > 0, Required)
  5. `Purpose` (Text, Operational description, Required)
  6. `Project_ID` (Text, Foreign Key -> `Projects.Project_ID`, Required)
  7. `Status` (Dropdown: `Disbursed`, `Partially Reconciled`, `Reconciled`, `Returned`)
  8. `Proof_URL` (URL to transfer receipt in `03_Expenses`)
  9. `Created_By` (Email of disburser)

### Tab 7: `Employee_Spending` (Finance Expenses)
- **Workbook:** `MASTER_COMPANY_FINANCE`
- **Purpose:** Employee direct expense records and vendor spending claims.
- **Sensitivity:** High (Restricted source tab).
- **Columns:**
  1. `Spending_ID` (Text, Format: `SPN-XXX`, Stable unique ID)
  2. `Employee_ID` (Text, Foreign Key -> `Employees.Employee_ID`, Required)
  3. `Date` (Date, Format: `YYYY-MM-DD`, Incurred date, Required)
  4. `Amount` (Currency INR, Format: `₹#,##0.00`, Number > 0, Required)
  5. `Recipient_Vendor` (Text, Vendor/Merchant name, Required)
  6. `Purpose` (Text, Business rationale, Required)
  7. `Project_ID` (Text, Foreign Key -> `Projects.Project_ID`, Required)
  8. `Attachment_URL` (URL to uploaded receipt/invoice in Drive)
  9. `Status` (Dropdown: `Submitted`, `Approved`, `Rejected`, `Reimbursed`)
  10. `Submission_Timestamp` (Timestamp from Form)

### Tab 8: `OOP_Claims` (Out-of-Pocket Reimbursements)
- **Workbook:** `MASTER_COMPANY_FINANCE`
- **Purpose:** Monthly out-of-pocket claims submitted by employees.
- **Sensitivity:** High (Restricted source tab).
- **Columns:**
  1. `Claim_ID` (Text, Format: `CLM-XXX`, Stable unique ID)
  2. `Employee_ID` (Text, Foreign Key -> `Employees.Employee_ID`, Required)
  3. `Month` (Text, Format: `YYYY-MM`, e.g., `2026-09`, Required)
  4. `Date` (Date, Format: `YYYY-MM-DD`, Date of claim, Required)
  5. `Purpose` (Text, Claim description, Required)
  6. `Amount` (Currency INR, Format: `₹#,##0.00`, Number > 0, Required)
  7. `Project_ID` (Text, Foreign Key -> `Projects.Project_ID`, Required)
  8. `Proof_URL` (URL to invoice proof in Google Drive)
  9. `Status` (Dropdown: `Submitted`, `Pending Review`, `Approved`, `Rejected`, `Paid`)
  10. `Approved_Amount` (Currency INR, Format: `₹#,##0.00`, Determined in Phase 4)
  11. `Paid_Date` (Date, Format: `YYYY-MM-DD`)
  12. `OOP_Rule_Flag` (Text, Reserved for Phase 4 ₹5,000 threshold evaluation)

### Tab 9: `Salary_Admin` (Administrative Payroll Ledger)
- **Workbook:** `MASTER_COMPANY_FINANCE`
- **Purpose:** Monthly administrative compensation, payout, and carry-forward balances.
- **Sensitivity:** Extreme (Admin only).
- **Columns:**
  1. `Salary_Record_ID` (Text, Format: `SAL-XXX`, Stable unique ID)
  2. `Employee_ID` (Text, Foreign Key -> `Employees.Employee_ID`, Required)
  3. `Month` (Text, Format: `YYYY-MM`, Required)
  4. `Due_Amount` (Currency INR, Format: `₹#,##0.00`, Agreed base CTC)
  5. `Paid_Amount` (Currency INR, Format: `₹#,##0.00`, Actual disburse)
  6. `Pending_Carry_Forward` (Currency INR, Format: `₹#,##0.00`, Remaining debt to employee)
  7. `Status` (Dropdown: `Pending`, `Partial`, `Paid`, `Carry-Forward`)
  8. `Notes` (Text)
  9. `Updated_At` (Timestamp)

### Tab 10: `Investments` (Administrative Capital Ledger)
- **Workbook:** `MASTER_COMPANY_FINANCE`
- **Purpose:** Loans, capital infusions, and investment returns tracking.
- **Sensitivity:** Extreme (Admin only).
- **Columns:**
  1. `Investment_ID` (Text, Format: `INV-XXX`, Stable unique ID)
  2. `Source_Person` (Text, Investor/Entity name, Required)
  3. `Amount` (Currency INR, Format: `₹#,##0.00`, Capital amount, Required)
  4. `Taken_Date` (Date, Format: `YYYY-MM-DD`, Required)
  5. `Expected_Return_Date` (Date, Format: `YYYY-MM-DD`)
  6. `Actual_Return_Date` (Date, Format: `YYYY-MM-DD`)
  7. `Status` (Dropdown: `Active`, `Returned`, `Rolled Over`, `Defaulted`)
  8. `Notes` (Text)

### Tab 11: `HR_Admin` (HR Request & Governance Workflow)
- **Workbook:** `MASTER_COMPANY_HR_ADMIN`
- **Purpose:** Controlled HR request/workflow queue. It is not a second employee master and must not duplicate employee profile fields. The authoritative employee/HR profile remains `Employees`.
- **Sensitivity:** High (Admin / HR only).
- **Columns:**
  1. `HR_Request_ID` (Text, Format: `HRR-XXX`, Stable unique request ID)
  2. `Employee_ID` (Text, Foreign Key -> `Employees.Employee_ID`, Required)
  3. `Request_Type` (Controlled value, Required)
  4. `Relevant_Details` (Text, Request/update details, Required)
  5. `Attachment_URL` (Drive file reference/URL governed by actual Drive sharing permissions)
  6. `Status` (Dropdown: `Submitted`, `In Review`, `Completed`, `Rejected`)
  7. `Submitted_At` (Timestamp)
  8. `Processed_At` (Timestamp)
  9. `Processed_By` (Email)

### Tab 12: `Report_Index` (Reporting Catalog)
- **Workbook:** `MASTER_COMPANY_ADMIN`
- **Purpose:** Register of generated management, financial, and operational reports.
- **Sensitivity:** High (Restricted).
- **Columns:**
  1. `Report_ID` (Text, Format: `RPT-XXX`, Stable unique ID)
  2. `Report_Type` (Dropdown: `Company Summary`, `Project Report`, `Finance Report`, `HR Report`)
  3. `Period` (Text, e.g., `2026-Q3`, `2026-09`)
  4. `Project_ID` (Text, Optional, Foreign Key -> `Projects.Project_ID`)
  5. `Drive_URL` (URL to PDF/Sheet report in `MASTER COMPANY/Reports`)
  6. `Status` (Dropdown: `Draft`, `Published`, `Archived`)
  7. `Generated_Date` (Date, Format: `YYYY-MM-DD`)

### Tab 13: `Submission_Index` (Audit & Automation Traceability)
- **Workbook:** `MASTER_COMPANY_ADMIN`
- **Purpose:** Audit log of all incoming Form submissions and Phase 4 processing states.
- **Sensitivity:** High.
- **Columns:**
  1. `Submission_ID` (Text, Format: `SUB-XXX`, Stable unique ID)
  2. `Source_Form` (Text, Name of Google Form submitted)
  3. `Record_ID` (Text, Generated/Mapped target business record ID)
  4. `Submitted_By` (Email of submitter)
  5. `Submitted_At` (Timestamp)
  6. `Processing_Status` (Dropdown: `Received`, `Processed`, `Validation Failed`, `Manual Review`)

---

### 3. Human-Facing Form Identity vs Authoritative IDs

The authoritative business tables retain stable internal IDs such as `Project_ID` and `Employee_ID`. These IDs are system identifiers and must not be treated as mandatory human-facing Form inputs when a respondent can identify the record using a human-readable value.

**Human-facing input rule:**
- Forms should collect a human-readable project identity (for example, Project Name) rather than requiring the respondent to know/type `Project_ID`.
- Forms should collect a human-readable employee identity (preferably the respondent's Google account/email where the access model permits, otherwise an employee email/name) rather than requiring the respondent to know/type `Employee_ID`.
- For project-related Forms, a human-readable Project Name may be used as the input; Phase 4 resolves it to the canonical `Project_ID` in `Projects`.
- For employee-related Forms, the collected employee identity is resolved to the canonical `Employee_ID` in `Employees`.
- This is a lookup/normalization boundary, not a second business record and not a replacement for the authoritative ID columns.
- Native response tabs may contain the human-facing answer. The authoritative business table must contain the canonical stable ID after Phase 4 processing.
- No Form should ask a normal respondent to manually invent or guess a `PRJ-XXX`, `EMP-XXX`, `MOM-XXX`, `SPN-XXX`, or similar system ID.

This correction preserves the stable-ID invariant while making the Forms usable by ordinary employees/project participants.

### 3. Google Forms Mapping & Three-Layer Data Pipeline
 
The architecture enforces a strict distinction across three layers:
- **Layer A (Google Form):** User-facing intake interface.
- **Layer B (Native Form Response Destination):** The raw destination sheet where Google Forms writes incoming submissions.
- **Layer C (Authoritative Business Table):** The normalized business source-of-truth table.
- **Phase 4 Processing:** The automation boundary responsible for validation, stable ID generation, normalization, and business logic.
 
| Form ID | Form Name | Native Response Destination (Layer B) | Authoritative Target (Layer C) | Phase 3 Native Capability | Phase 4 Processing Required |
|---|---|---|---|---|---|
| **FRM-01** | Create / Request Project | `Projects_Responses` in `MASTER_COMPANY_OPERATIONS` | `Projects` and `Project_Members` | Native Google Forms records flat row submission with human-facing project details and list of assigned members. | **Phase 4 Normalization Required:** Resolve the submitted project/member identity values as applicable; assign stable `PRJ-XXX` and `MBR-XXX` IDs; parse assigned members into normalized junction records in `Project_Members`; create Phase 1 Drive project folders. |
| **FRM-02** | Employee Spending / Expense | `Employee_Spending_Responses` in `MASTER_COMPANY_FINANCE` | `Employee_Spending` | Native Google Forms captures raw expense details using human-facing employee/project identity and stores receipt in Drive via native upload engine. | **Phase 4 Processing Required:** Resolve employee identity to `Employee_ID` and project identity to `Project_ID`; assign stable `SPN-XXX` ID; evaluate status; route attachment link to `Employee_Spending`. |
| **FRM-03** | OOP Claim | `OOP_Claims_Responses` in `MASTER_COMPANY_FINANCE` | `OOP_Claims` | Native Google Forms captures raw claim metadata using human-facing employee/project identity and proof file in Drive. | **Phase 4 Processing Required:** Resolve employee identity to `Employee_ID` and project identity to `Project_ID`; assign stable `CLM-XXX` ID; evaluate the frozen ₹5,000 threshold rule; populate `Approved_Amount` and `OOP_Rule_Flag`; update status. |
| **FRM-04** | Employee Update / HR Request | `HR_Requests_Responses` in `MASTER_COMPANY_HR_ADMIN` | `HR_Admin` | Native Google Forms logs human-facing employee identity, request details and optional attachment to response sheet. | **Phase 4 Processing Required:** Resolve employee identity to `Employee_ID`; create/update an `HRR-XXX` workflow record in `HR_Admin`, dispatch notifications to HR Admin, and update `Submission_Index`. Employee master updates belong in `Employees`; `HR_Admin` is the workflow queue, not a duplicate employee table. |
| **FRM-05** | MOM Input | `MOM_Responses` in `MASTER_COMPANY_OPERATIONS` | `Project_MOM_Index` | Native Google Forms captures meeting metadata using a human-facing Project Name, attendee emails, and notes. | **Phase 4 Processing Required:** Resolve Project Name to canonical `Project_ID`; assign stable `MOM-XXX` ID; generate published Google Doc in `04_MOM`; distribute email notices to registered attendee emails; record in `Project_MOM_Index`. |
| **FRM-06** | Report Request (Optional) | `Report_Requests_Responses` in `MASTER_COMPANY_ADMIN` | `Report_Index` | Native Google Forms logs report request type, period, recipient email, and human-facing project identity when a project-specific report is requested. | **Phase 4 Processing Required:** Resolve project identity to canonical `Project_ID` when supplied; compile the requested report; generate output PDF/Sheet; catalog in `Report_Index`. |
| **FRM-07** | Investment Entry (Admin) | `Investment_Responses` in `MASTER_COMPANY_FINANCE` | `Investments` | Native Google Forms captures capital inflow/outflow entries from authorized Admin. | **Phase 4 Processing Required:** Assign stable `INV-XXX` ID; validate dates; transfer record into authoritative `Investments` ledger. |
| **Payroll** | Monthly Salary Processing | **No Form / no native response tab** | `Salary_Admin` | Monthly payroll is generated from each applicable employee's agreed 6-month CTC stored in `Employees.Salary_Basis`. | **Phase 4 Processing Required:** Derive monthly due amount; create the monthly `SAL-XXX` record; calculate/record paid amount, pending carry-forward and status. |

---

## 4. Drive Upload & Attachment Integrity Rules

- **Native Forms Upload Engine:** When a respondent uploads an expense receipt or claim invoice via Google Forms (Forms 02, 03, 04), Google Drive automatically places the file into the designated `Form Responses` folder under the owner's Google Drive.
- **Reference Over Binary:** Google Sheets stores a Drive file reference/URL in the `Proof_URL` or `Attachment_URL` column. The reference is governed by the actual Google Drive sharing permissions; it must not be described as inherently public. Zero binary files are stored in Sheets cells.
- **Phase 4 Automation Boundary:** Automated routing of proofs into project-specific folders (e.g., `MASTER COMPANY/Projects/PROJECT_XXX/03_Expenses`) requires Apps Script triggers and is strictly deferred to Phase 4.

---

## 5. Frozen Business Invariants

1. **₹5,000 OOP Policy Invariant:**
   The ₹5,000 allowance is neither hardcoded nor automatically computed in Phase 3. The schema provisions `Amount`, `Approved_Amount`, and `OOP_Rule_Flag` to allow Phase 4 deterministic rule execution based on human-approved policy.
2. **One Authoritative Record Principle:**
   No business record exists in duplicate across tabs. `Projects` holds the canonical project definition; `Employees` holds the canonical person profile. All mappings use foreign keys (`Project_ID`, `Employee_ID`).
3. **Stable ID Invariant:**
   Row numbers are never used as permanent IDs. Prefixed alphanumeric identifiers (`PRJ-`, `EMP-`, `MBR-`, `NOT-`, `MOM-`, `BDG-`, `SPN-`, `CLM-`, `SAL-`, `INV-`, `RPT-`, `SUB-`) guarantee data integrity across sorting, filtering, and deletion.
4. **Unified Employee/HR Master Invariant:** `Employees` is the single authoritative employee and HR master profile. `HR_Admin` is a workflow/request table only and must not duplicate employee profile attributes such as Joining_Date, Employment_Status, HR_Notes, or Reimbursement_Settings.

5. **Cost Hard Gate:**
   100% native Google Sheets and Google Forms running in standard Google Accounts. Total additional software spend: **₹0.00**.
6. **Cross-domain administration boundary:** `Report_Index` and `Submission_Index` are administrative support structures, not HR data. They live in the restricted `MASTER_COMPANY_ADMIN` workbook and must not be moved into `MASTER_COMPANY_HR_ADMIN`.
### R22 — FRM-05 Project Name input control

For **FRM-05 — MOM Input**, the respondent-facing `Project Name` field is a **Short answer** field, required, with **no pre-populated project-name options**.

- Do not configure a hard-coded dropdown/list of current project names in the Form.
- Do not copy the current `Projects.Project_Name` values into Form choices.
- Do not require the respondent to know or type `Project_ID`.
- The respondent enters the human-readable Project Name.
- Phase 4 validates/resolves the submitted Project Name against the authoritative `Projects` table and obtains the canonical `Project_ID`.
- This avoids a stale Form choice list when projects are added, renamed, completed, or cancelled.
- This does not create a lookup/configuration table and does not move Phase 4 resolution into Phase 3.

This is a focused correction to the R21 human-facing identity rule and applies specifically to the current FRM-05 instantiation.


### R23 — Salary/payroll architecture correction

`Employees.Salary_Basis` is the agreed **6-month CTC/stipend**, not monthly CTC. Monthly payroll is derived from that stored six-month CTC for each applicable active employee during Phase 4.

`Salary_Admin` is the authoritative monthly payroll ledger. HR/Finance must not re-enter every employee's salary through a Form every month. The former FRM-08 / `Salary_Responses` model is removed from Phase 3; no `Salary_Responses` tab is to be created. Phase 4 will generate monthly `SAL-XXX` records and handle due, paid, carry-forward and status values. Exceptional payroll adjustments must be explicitly designed in Phase 4 rather than reintroducing a repetitive monthly salary-entry Form.


### R25 — FRM-02 Employee Email ID and alternate-login handling

For **FRM-02 — Employee Spending / Expense**, the respondent-facing employee identity field is explicitly:

- **Employee Email ID** — required human-facing input.
- Do not ask for or require Employee_ID (for example, EMP-001).
- The submitted Employee Email ID is resolved in Phase 4 against the authoritative Employees.Email value to obtain the canonical Employee_ID.
- If Google Forms automatically captures the signed-in respondent email, that platform-captured address may be retained as audit metadata/Submitted_By, but it must **not override** the explicit Employee Email ID field.
- If the signed-in Google account uses a different email from the Employee Email ID entered by the respondent, Phase 4 must not silently substitute the signed-in email or guess the employee identity.
- The submission must be held for validation failure/manual review or corrected through the defined workflow before an authoritative Employee_Spending record is written.
- No additional employee-login/email field is required merely to handle this mismatch.

This is a focused correction to the R21 human-facing identity rule for FRM-02 and does not change the authoritative Employee_Spending.Employee_ID field or the Phase 4 identity-resolution boundary.

### R26 — FRM-04 Request Type controlled values

For FRM-04 — Employee Update / HR Request, the respondent-facing Form fields are locked as:

1. Employee Email ID — Short answer, Required.
2. Request Type — Multiple choice, Required, with exactly these controlled values:
   - Personal Information Update
   - Bank / Payment Details Update
   - Leave / Attendance Request
   - Employment / HR Document Request
   - Salary / Payroll Query
   - Reimbursement / Benefits Query
   - Project / Role Update
   - Resignation / Exit Request
   - Other
3. Relevant Details — Paragraph, Required.
4. Attachment / Supporting Document — File upload, Optional.

The Form must not ask for Employee_ID, HR_Request_ID, Status, Submitted_At, Processed_At, or Processed_By. Those remain workflow fields handled by the response pipeline and Phase 4. HR_Admin.Request_Type uses the same nine approved literal values.


### R27 — FRM-06 Report Request field specification

For the Phase 3 human-instantiation of FRM-06, use this exact respondent-facing field specification:

1. Report Type — Multiple choice, Required. Exact values: Company Summary, Project Report, Finance Report, HR Report.
2. Period — Short answer, Required. Example values: 2026-09 or 2026-Q3.
3. Project Name — Short answer, Conditional / only when a project-specific report is requested. Human-facing input; no hard-coded project-name choices and no Project_ID question.
4. Recipient Email — Short answer, Required.

Do not expose Report_ID, Project_ID, Drive_URL, Status, Generated_Date, Submission_ID, or Phase 4 processing fields to respondents.

Report_Requests_Responses remains the native intake destination in MASTER_COMPANY_ADMIN; Report_Index remains the authoritative report catalog.


### R29 — Finance Report definition and role-based access

Finance Report is a consolidated report of company financial activity for the requested Period, subject to the requester's authorization. It is **not** an unrestricted export of MASTER_COMPANY_FINANCE.

The Phase 4 report compiler must first identify the requester and determine the requester's approved role/designation and data scope. It must then determine the permitted recipient scope and permitted fields before reading/selecting Finance records for the report.

Approved role-based scope for the Finance Report:
- Team Member / Contractor: self-only employee-linked finance records.
- Project Lead: employee-linked finance records within authorized project scope, where permitted.
- Manager: employee-linked finance records within the manager's authorized management/data scope. Manager status alone does not grant restricted salary/payroll or investment access.
- Finance Admin: company-wide Finance data permitted to Finance Admin, including restricted Finance categories.
- HR Admin: salary/payroll information where HR authorization permits; Finance investment information is not granted merely by HR role.
- Administrator / Site Admin: company-wide data within the administrator's authorized scope.

The Finance Report can include these categories, filtered by authorization and period:
- **Budget Given:** Date, Recipient, Amount, Purpose, Project, Status.
- **Employee Spending:** Employee/recipient, Date, Amount, Vendor, Purpose, Project, Status.
- **OOP Claims:** Employee/recipient, Month/Date, Amount, Purpose, Project, Status, Approved Amount, Paid Date.
- **Salary / Payroll:** only for roles explicitly authorized to access salary/payroll data.
- **Investments:** only for roles explicitly authorized to access investment data.
- **Financial totals/aggregations:** calculated only from authorized records/fields.
- **Project-wise financial information:** only for an authorized project scope.

Recipient must never be an unrestricted free-text mechanism for bypassing access control. Phase 4 must derive/validate recipient options from the requester's role/designation and authorized scope. Manually entering another employee's email/name must not grant access to that employee's restricted data.

A report request grants no new permission. The requester can receive only data that the requester was already authorized to access through the company's access model.
### R31 — HR Report exact scope and field mapping

**Purpose:** Define exactly what **FRM-06 → HR Report** may return. The HR Report must be derived only from the authoritative Employees and HR_Admin schemas already defined in Phase 3. No generic or invented HR fields may be introduced.

#### A. Employee / HR master information — source: Employees

The HR Report may use these existing Employees columns, subject to requester authorization:

- Employee_ID — canonical internal employee identifier.
- Name — employee name.
- Email — employee email.
- Role — controlled employee role.
- Salary_Basis — agreed 6-month CTC/stipend; restricted and shown only to explicitly authorized roles.
- Active — active/inactive state.
- Reimbursement_Eligible — reimbursement eligibility.
- Project_Access — project-access baseline, only where the requester is authorized to see it.
- Joining_Date — joining date.
- Employment_Status — employment status.
- HR_Notes — confidential internal HR notes; not part of ordinary employee/manager HR reports and exposed only to explicitly authorized HR/Admin users.
- Reimbursement_Settings — reimbursement setting, subject to authorization.
- Created_At — employee master creation timestamp, subject to authorization.

#### B. HR request / workflow information — source: HR_Admin

The HR Report may use these exact HR_Admin columns:

1. HR_Request_ID — unique identifier of the HR request.
2. Employee_ID — canonical employee reference for the requester/subject.
3. Request_Type — one of the nine locked HR request categories.
4. Relevant_Details — details submitted by the employee in FRM-04.
5. Attachment_URL — supporting-document reference, only where the requester is authorized to access the document.
6. Status — current request workflow status: Submitted, In Review, Completed, or Rejected.
7. Submitted_At — timestamp when the HR request was submitted.
8. Processed_At — timestamp when processing was completed/recorded, where populated.
9. Processed_By — email of the person recorded as processing the request, where populated and authorized.

**Therefore, the earlier vague labels are replaced by these exact mappings:**
- “Employee/requester” → HR_Admin.Employee_ID, resolved through Employees to the authorized employee identity.
- “Request type” → HR_Admin.Request_Type.
- “Request details” → HR_Admin.Relevant_Details.
- “Status” → HR_Admin.Status.
- “Request date” → HR_Admin.Submitted_At.
- “Processing information” → HR_Admin.Processed_At and HR_Admin.Processed_By.
- “Attachment/supporting document” → HR_Admin.Attachment_URL, only when authorized.

#### C. HR Report does NOT invent or duplicate fields

The HR Report must not create a second HR master or invent fields such as Department, Manager, Designation, Leave Balance, Attendance, Performance Score, Recruitment Status, Employee Phone, Address, etc. unless those fields are separately added to the authoritative Phase 3 schema through a documented revision.

HR_Admin remains a workflow table only. Employee profile information must be joined from Employees; it must not be copied into HR_Admin.

#### D. Period filtering

FRM-06 supplies a Period. Phase 4 must apply that period to reportable records using the relevant existing date/timestamp fields. For HR requests, the primary request-period field is Submitted_At. For employee master data, fields such as Joining_Date and Created_At may be used where the report definition requires a period-sensitive employee view.

#### E. Authorization

Selecting **HR Report** does not grant additional HR access.

Minimum scope rules for the HR Report:

- **Team Member / Contractor:** own employee profile information that is appropriate for self-service, plus own HR requests. No other employee's HR records.
- **Project Lead:** only employee/HR information within an explicitly authorized project scope, and only fields permitted by the underlying HR access policy. Project Lead status alone does not grant access to confidential HR notes, salary/CTC, or unrestricted HR records.
- **Manager:** authorized management scope only. Manager status alone does not grant unrestricted salary/CTC, HR notes, or all HR records.
- **HR Admin:** authorized company-wide HR information, including HR workflow records and restricted HR fields where the HR role permits them.
- **Administrator / Site Admin:** company-wide information within the administrator's authorized scope.

Phase 4 must determine the authenticated requester, role, authorized employee/project scope, and permitted fields before selecting HR records.

A requester must not be able to obtain another employee's restricted HR information by typing that employee's email/name into the Recipient Email field or by selecting HR Report.

**HR Report is therefore a permission-controlled HR report, not an export of the entire MASTER_COMPANY_HR_ADMIN workbook.**


## R32 — Universal report delivery: in-system View + user-initiated Download

All four FRM-06 report types — **Company Summary, Project Report, Finance Report, and HR Report** — use the same report delivery model.

A report request must produce an **authorized, human-readable report** that is **viewable directly in the system**. The user must not be forced to download a file merely to read the report.

The displayed report must provide a **Download Report** action. Download is an explicit user choice, not the default delivery mechanism.

The downloaded report must be generated from the **same authorized report dataset/content shown to the requester**. Download must never expose fields, records, or source-workbook content beyond what the requester is authorized to view on screen.

Source workbook tabs remain data sources; they are not themselves the report output. A raw workbook export is not a valid substitute for the report view.

Phase 4 owns implementation of the report-generation, authorization, in-system display, download generation, and delivery flow. The exact download file format may be selected during Phase 4 implementation, but View + optional Download is mandatory.
