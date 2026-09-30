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
