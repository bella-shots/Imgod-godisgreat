| ID | Module | Trigger / Entry | Inputs | Actions | Outputs / Status |
|---|---|---|---|---|---|
| A4-01 | Project Processing | Project Form submission / authorized admin action | Projects + Project_Members | Validate fields; assign/verify Project_ID; connect project to Drive folder; prepare project resources | Project record ready; processing status logged |
| A4-02 | Drive Project Folder Automation | Project creation event or admin action | Project_ID; Project_Name; Phase 1 folder structure | Create/locate project folder and recommended subfolders; write Drive URLs back to project record | Drive_Folder_URL and relevant child URLs |
| A4-03 | Expense Processing | Expense Form submission or approved Sheet-originated record action | Employee_Spending | Validate amount/date/project/employee; store proof reference; calculate/update processing status; for direct Sheet-originated creation, require the R57 explicit Generate-ID action for SPN | Validated expense record; notification if required |
| A4-04 | OOP Claim Processing | OOP Claim Form submission | OOP_Claims; Employees; Projects; approved ₹5,000 rule | Validate claim; generate CLM through A4-00; route to Top Manager; update approval/status fields; apply approved salary rule | Claim status; approved amount when authorized; audit entry |
| A4-05 | Salary Carry-Forward | Admin salary entry/update or scheduled trigger | Salary_Admin | Calculate pending carry-forward using approved salary rule; preserve monthly history; for Sheet-originated salary creation/import, use the R57 controlled Generate Salary ID(s) action | Updated carry-forward/status |
| A4-06 | MOM Processing | MOM create/update/publish action | Project_MOM_Index + MOM content/Drive file | Validate participants and recipient emails; version/index record; publish/update status | MOM index updated; email job generated |
| A4-07 | MOM Email Sender | MOM publish/update trigger or queued email action | MOM recipients + approved content/link | Send notification using approved Apps Script mail service; record send result | Email sent/failed status and timestamp |
| A4-08 | Report Generator | Scheduled/admin request | Projects; Finance; HR; Report_Index | Generate defined reports, save output to Drive, update report index | Report URL/status/date |
| A4-09 | Notification Engine | Defined status/change events | Record IDs + recipient mapping | Send only required notifications; avoid duplicate sends | Notification log/status |
| A4-10 | Audit Logger | Important automation actions | Action type; record ID; actor; timestamp; result | Write audit/submission status to approved audit structure | Traceable automation history |
| A4-11 | Error Handler | Any module exception | Error context | Catch/log error; preserve source record; mark processing failure; notify admin where required | Error log + safe failure state |
| A4-00 | Central ID Generator | Any authorized record-creation workflow | Record type/prefix + existing authoritative records + stored counter | Acquire ScriptLock; reconcile stored counter with highest valid existing ID; increment the independent prefix counter in PropertiesService; generate and validate the next ID; release lock; return the ID for the record-creation transaction | Unique stable ID such as `BDG-000001`; safe under concurrent submissions |

| A4-12 | Employee Record Self-Service Linkage | Successful authoritative record creation/update | Submission_ID + generated Record_ID + canonical Employee_ID + authorization scope | Preserve the submission-to-record linkage and expose the record only through the authorized Phase 5 self-service retrieval contract; do not broaden source-workbook permissions | Employee can retrieve authorized record and generated business ID through My Records |

| A4-13 | Generated-ID Persistence and Visibility Linkage | Successful authoritative record creation/update | Record type + generated Record_ID + Submission_ID where applicable | Persist the canonical generated ID with the authoritative record and preserve linkage required for the corresponding authorized website/module view | Generated ID available in the correct module; no permission expansion |

## R52 — Explicit Generate-ID controls for Sheet-originated records

## R56 — Frozen one-click Employee creation
- The Employee creation workflow is a single explicit user action: the user completes the pending employee row, selects the employee row/Employee_ID cell, and invokes **Employee Actions → Generate Employee ID**.
- That single action performs complete validation, duplicate-email validation, A4-00 EMP-XXXXXX generation, Employee_ID persistence and locking, Created_At timestamping, and finalization of the employee record.
- There is **no separate Save Employee action**, **no Process action**, **no Process column**, and no employee-creation sidebar/form.
- Employee_ID generation remains explicitly user initiated; generic onEdit/autosave events must never generate Employee_ID.
- The authoritative Employees schema remains exactly the frozen 15-column Phase 3 schema.

- A4-14 — Explicit Generate-ID controls for Sheet-originated records: implement controlled Generate-ID actions for Project Member, Project Note, Budget and Salary records. The action validates the pending record, invokes A4-00, writes the generated ID, locks the ID field, and enables/permits commit only after successful generation. Salary must support controlled bulk generation for validated payroll imports/entries. Do not use generic row-edit/autosave triggers to generate these IDs. Employee_ID remains on its dedicated Generate Employee ID workflow. Submission_ID remains system/index-generated.

## R57 — Universal explicit Generate-ID rule for user-created Sheet records
- Every **user-created authoritative Sheet record that requires a business ID** must use one explicit **Generate-ID action** as the controlled creation/finalization entry point.
- The single Generate-ID action must, in one controlled workflow: validate the pending record, check applicable duplicate/identity constraints, invoke A4-00, persist the canonical business ID, lock the ID field against manual overwrite, and perform the appropriate authoritative commit/finalization.
- Generic `onEdit`, autosave, passive cell edits, spreadsheet-open events, or row-position-based triggers must never issue a business ID.
- This standard applies to Sheet-originated business IDs including Employee, Project Member, Project Note, Budget, Spending, OOP Claim, Salary and Investment records where those records are created directly by a user in a Sheet.
- The user-facing action should follow the same interaction pattern across these workflows: select the pending record → choose the record-specific Generate-ID action → validation → A4-00 generation → ID persistence/locking → commit/finalization.
- Salary bulk imports/entries may use one explicit controlled **Generate Salary ID(s)** action that validates the eligible batch and generates each required SAL ID through A4-00; it must not rely on generic edit/autosave events.
- **Form/system-generated IDs remain automatic.** Form-triggered workflows may generate their required IDs during controlled processing, and Submission_ID remains system/index-generated. R57 does not convert Form submissions into manual Generate-ID workflows.
- No implementation may introduce a second Save/Process step solely to complete the Generate-ID workflow unless a future approved rule explicitly requires one.
- A4-14 must be treated as the implementation module for this universal pattern, while the individual processing modules remain responsible for their own record-specific validation and business rules.
- A4-00 remains the sole authoritative ID generator; R49/R52/R56 invariants continue to apply.


## Financial employee-linkage invariant

All employee-related financial workflows must resolve the employee through the canonical `Employee_ID`. `Member_Record_ID` is only a project-membership identifier and must not be substituted for `Employee_ID` in `Budget_Given`, `Employee_Spending`, `OOP_Claims` or `Salary_Admin`. `Investments` is the explicit exception under the frozen Phase 3 schema because it uses `Source_Person` rather than `Employee_ID`.

## R62 — OOP approval workflow
- **A4-04** now has an explicit Employee → Top Manager approval chain for FRM-03 claims.
- On valid submission, the claim is created as `Pending Review` and the single active `Director` in `MASTER_COMPANY_HR_ADMIN → Employees` is notified by Apps Script email.
- The Director-designated Top Manager has controlled actions: `Approve Company-Essential Claim`, `Approve Food Business Exception`, or `Reject OOP Claim`.
- Ordinary food-related claims cannot be approved through the normal company-essential action; a genuine business exception requires the dedicated exception approval action.
- Only explicitly approved claims receive `Approved_Amount` and an approved salary-eligible `OOP_Rule_Flag`.
- **A4-05** aggregates only approved salary-eligible OOP claims. Pending, rejected, and food claims that remain `FOOD_REQUIRES_REVIEW_EXCEPTION_OR_ORDINARY` are excluded.
- `APPROVED_FOOD_BUSINESS_EXCEPTION` is the only food-related classification that may enter the OOP salary component.
- The existing 11-column `OOP_Claims` schema is preserved; no new approval columns are added.
