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
   - Native Form Intake Tabs: `Employee_Spending_Responses`, `OOP_Claims_Responses`, `Salary_Responses`, `Investment_Responses`
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
Phase 3 defines **13 authoritative/support schema tabs** across the four workbooks plus **8 native Form response tabs**, for **21 physical tabs total** after all eight Forms are linked. `Lists_Config` is removed; controlled values are defined locally in the relevant workbook/tab validation rules. The response tabs are platform-created intake destinations and must not be counted as additional authoritative business tables.

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
  4. `Role` (Dropdown: `Administrator`, `Finance Admin`, `HR Admin`, `Project Lead`, `Team Member`, `Contractor`. Apply these approved values locally.)
  5. `Salary_Basis` (Currency INR, Format: `₹#,##0.00`, Monthly agreed CTC/stipend)
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
  2. `Report_Type` (Dropdown: `Executive Summary`, `Project Status`, `Finance Audit`, `HR Rollup`)
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

### 3. Google Forms Mapping & Three-Layer Data Pipeline
 
The architecture enforces a strict distinction across three layers:
- **Layer A (Google Form):** User-facing intake interface.
- **Layer B (Native Form Response Destination):** The raw destination sheet where Google Forms writes incoming submissions.
- **Layer C (Authoritative Business Table):** The normalized business source-of-truth table.
- **Phase 4 Processing:** The automation boundary responsible for validation, stable ID generation, normalization, and business logic.
 
| Form ID | Form Name | Native Response Destination (Layer B) | Authoritative Target (Layer C) | Phase 3 Native Capability | Phase 4 Processing Required |
|---|---|---|---|---|---|
| **FRM-01** | Create / Request Project | `Projects_Responses` in `MASTER_COMPANY_OPERATIONS` | `Projects` and `Project_Members` | Native Google Forms records flat row submission with project details and list of assigned members. | **Phase 4 Normalization Required:** Parse assigned members into multiple normalized junction records in `Project_Members`; assign stable `PRJ-XXX` and `MBR-XXX` IDs; create Phase 1 Drive project folders. |
| **FRM-02** | Employee Spending / Expense | `Employee_Spending_Responses` in `MASTER_COMPANY_FINANCE` | `Employee_Spending` | Native Google Forms captures raw expense details and stores receipt in Drive via native upload engine. | **Phase 4 Processing Required:** Validate employee identity against `Employees`; assign stable `SPN-XXX` ID; evaluate status; route attachment link to `Employee_Spending`. |
| **FRM-03** | OOP Claim | `OOP_Claims_Responses` in `MASTER_COMPANY_FINANCE` | `OOP_Claims` | Native Google Forms captures raw claim metadata and proof file in Drive. | **Phase 4 Processing Required:** Assign stable `CLM-XXX` ID; evaluate the frozen ₹5,000 threshold rule; populate `Approved_Amount` and `OOP_Rule_Flag`; update status. |
| **FRM-04** | Employee Update / HR Request | `HR_Requests_Responses` in `MASTER_COMPANY_HR_ADMIN` | `HR_Admin` | Native Google Forms logs request details and optional attachment to response sheet. | **Phase 4 Processing Required:** Create/update an `HRR-XXX` workflow record in `HR_Admin`, dispatch notifications to HR Admin, and update `Submission_Index`. Employee master updates belong in `Employees`; `HR_Admin` is the workflow queue, not a duplicate employee table. |
| **FRM-05** | MOM Input | `MOM_Responses` in `MASTER_COMPANY_OPERATIONS` | `Project_MOM_Index` | Native Google Forms captures meeting metadata, attendee emails, and notes. | **Phase 4 Processing Required:** Assign stable `MOM-XXX` ID; generate published Google Doc in `04_MOM`; distribute email notices to registered attendee emails; record in `Project_MOM_Index`. |
| **FRM-06** | Report Request (Optional) | `Report_Requests_Responses` in `MASTER_COMPANY_ADMIN` | `Report_Index` | Native Google Forms logs report request type, period, and recipient email. | **Phase 4 Processing Required:** On-demand compilation of requested report; generate output PDF/Sheet; catalog in `Report_Index`. |
| **FRM-07** | Investment Entry (Admin) | `Investment_Responses` in `MASTER_COMPANY_FINANCE` | `Investments` | Native Google Forms captures capital inflow/outflow entries from authorized Admin. | **Phase 4 Processing Required:** Assign stable `INV-XXX` ID; validate dates; transfer record into authoritative `Investments` ledger. |
| **FRM-08** | Salary Entry (Admin) | `Salary_Responses` in `MASTER_COMPANY_FINANCE` | `Salary_Admin` | Native Google Forms captures monthly compensation and payout figures from authorized Admin. | **Phase 4 Processing Required:** Assign stable `SAL-XXX` ID; compute pending carry-forward balances; update `Salary_Admin`. |

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
