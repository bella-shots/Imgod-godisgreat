| ID | Module | Trigger / Entry | Inputs | Actions | Outputs / Status |
|---|---|---|---|---|---|
| A4-01 | Project Processing | Project Form submission / authorized admin action | Projects + Project_Members | Validate fields; assign/verify Project_ID; connect project to Drive folder; prepare project resources | Project record ready; processing status logged |
| A4-02 | Drive Project Folder Automation | Project creation event or admin action | Project_ID; Project_Name; Phase 1 folder structure | Create/locate project folder and recommended subfolders; write Drive URLs back to project record | Drive_Folder_URL and relevant child URLs |
| A4-03 | Expense Processing | Expense Form submission | Employee_Spending | Validate amount/date/project/employee; store proof reference; calculate/update processing status | Validated expense record; notification if required |
| A4-04 | OOP Claim Processing | OOP Claim Form submission | OOP_Claims; Employees; Projects; approved ₹5,000 rule | Validate claim; calculate only the approved rule; route for approval; update claim status | Claim status; approved amount when authorized; audit entry |
| A4-05 | Salary Carry-Forward | Admin salary entry/update or scheduled trigger | Salary_Admin | Calculate pending carry-forward using approved salary rule; preserve monthly history | Updated carry-forward/status |
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
- A4-14 — Explicit Generate-ID controls for Sheet-originated records: implement controlled Generate-ID actions for Project Member, Project Note, Budget and Salary records. The action validates the pending record, invokes A4-00, writes the generated ID, locks the ID field, and enables/permits commit only after successful generation. Salary must support controlled bulk generation for validated payroll imports/entries. Do not use generic row-edit/autosave triggers to generate these IDs. Employee_ID remains on its dedicated Generate Employee ID workflow. Submission_ID remains system/index-generated.


## R54 — Form attachment Drive routing
- **Project-linked receipts/proofs:** FRM-02 Employee Spending and FRM-03 OOP Claims attachments are routed to the exact Phase 1 project folder path 'MASTER COMPANY/Projects/PROJECT_<ProjectName>/03_Expenses'. Phase 4 must resolve the human-facing Project Name to the canonical Project_ID, locate the authoritative project folder, and move the uploaded file from the Form upload location into '03_Expenses'.
- **HR supporting documents:** FRM-04 attachments are routed to 'MASTER COMPANY/HR'. No employee-specific HR subfolder is invented unless a future approved Phase 1/Phase 3 revision creates one.
- **MOM artifacts:** FRM-05 has no file-upload question. The MOM processing module creates/updates the approved MOM artifact in 'MASTER COMPANY/Projects/PROJECT_<ProjectName>/04_MOM' and records the resulting Drive URL in Project_MOM_Index.Drive_URL.
- **Forms without attachments:** FRM-01 Projects, FRM-06 Report Requests and FRM-07 Investment Input do not receive an attachment-routing workflow because their current respondent-facing schemas contain no file-upload field.
- **Move vs copy:** the processed file is moved to the authoritative destination; do not leave duplicate business copies in the Form upload location unless Google Forms/platform behavior requires a retained source reference. The authoritative record stores the final destination URL/reference.
- **Access boundary:** Drive permissions of the destination folder govern access. Automation must never make an attachment public or broaden access to restricted Finance/HR material.
- **Idempotency:** retries must detect an already-routed file/record and must not create duplicate destination copies.
- **Failure:** if the destination project/folder cannot be resolved or the file cannot be moved, preserve the source submission, mark processing as failed/pending, retain the original uploaded-file reference for controlled retry, and do not mark the authoritative business record as successfully processed.


## R55 — Control-asset Drive placement normalization

- A4-15 — Control-Asset Drive Placement Verification/Normalization: locate the authoritative Master Google Site, four master workbooks (MASTER_COMPANY_OPERATIONS, MASTER_COMPANY_FINANCE, MASTER_COMPANY_HR_ADMIN, MASTER_COMPANY_ADMIN), and FRM-01 through FRM-07 by authoritative resource identity/name.
- Verify that each asset is located in the root MASTER COMPANY Drive folder.
- If an asset is elsewhere and a safe move is technically supported, move the existing asset to MASTER COMPANY; do not create a replacement or duplicate.
- Preserve existing spreadsheet/Form/Site IDs and resource identity during movement.
- Do not alter Phase 3 workbook permission boundaries or Phase 2 Site access merely to achieve placement.
- If an asset cannot be located, moved, or safely normalized, preserve the existing asset and record a visible placement failure/manual-review state.
- This module verifies/normalizes placement only; it does not create new workbooks, Forms, or a second Site.


## R55 — A4-15 Master Asset Placement / Verification
- **A4-15 — Master Asset Placement / Verification:** Phase 4 startup/admin action that locates the frozen Google Site, four master workbooks and seven Forms; verifies each asset's Drive parent; moves a misplaced existing asset to its authoritative destination when authorized; and reports missing, ambiguous, inaccessible or non-movable assets as HUMAN ACTION REQUIRED.
- Frozen destinations are exactly those defined in R55 of the Phase 3 Revision Log and Phase 4 Build specification.
- A4-15 must never create duplicate master assets merely because an existing asset is misplaced. It is idempotent and preserves existing content/data/form structure.
- A4-15 does not alter Phase 3 schemas or Form questions. R54 remains authoritative for Form-uploaded file routing.
