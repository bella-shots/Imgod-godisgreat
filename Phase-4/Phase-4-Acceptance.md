| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-01 | Deploy the approved Apps Script project. | Script is associated with the approved Google environment and required authorizations are granted. | NOT STARTED |
| P4-02 | Test project processing. | Valid project input creates/locates the required Drive structure and updates the project record correctly. | NOT STARTED |
| P4-03 | Test expense processing. | Valid expense submission is validated, stored and given the correct processing status. | NOT STARTED |
| P4-04 | Test invalid expense. | Invalid/missing data is flagged safely without corrupting the source record. | NOT STARTED |
| P4-05 | Test OOP claim processing. | Claim is validated and routed according to the approved workflow. | NOT STARTED |
| P4-06 | Test ₹5,000 rule. | The approved rule is calculated exactly as specified; no unapproved interpretation is introduced. | NOT STARTED |
| P4-07 | Test salary carry-forward. | Monthly salary records produce the approved carry-forward while preserving historical records. | NOT STARTED |
| P4-08 | Test MOM publish/update. | MOM record/version/index is updated and the correct recipients are identified. | NOT STARTED |
| P4-09 | Test MOM email. | Email is sent to the approved recipient list and send result is logged. | NOT STARTED |
| P4-10 | Test report generation. | Defined report is generated from authoritative Phase 3 data and indexed in Drive. | NOT STARTED |
| P4-11 | Test duplicate trigger protection. | Retrying the same event does not create duplicate folders, records or emails. | NOT STARTED |
| P4-12 | Test failure handling. | Forced error creates a visible failure state and appropriate admin notification/log entry. | NOT STARTED |
| P4-13 | Test sensitive access. | Automation does not broaden employee access to restricted Finance, Salary, Investment or HR source data. | NOT STARTED |
| P4-14 | Test quota-safe behavior. | Expected internal workload does not require unlimited email/trigger/runtime assumptions; deferred/failure behavior is controlled. | NOT STARTED |
| P4-15 | Verify zero additional-cost boundary. | No paid automation, hosting, database, email API or Workspace subscription has been introduced. | NOT STARTED |
| P4-16 | Phase 4 closure. | All Phase 4 tests PASS and evidence is recorded; system is ready for Phase 5 final testing/handover. | NOT STARTED |
| P4-17 | Test universal ID generation for all 13 prefixes. | Each new record receives the correct prefix + six-digit format; sequences are independent. | NOT STARTED |
| P4-18 | Test concurrent ID generation. | Simultaneous requests receive distinct IDs with no duplicate/collision. | NOT STARTED |
| P4-19 | Test ID persistence/deletion behavior. | Issued IDs remain stable and are never reused; gaps are allowed. | NOT STARTED |
| P4-20 | Test counter recovery. | A stored counter lower than an existing valid ID is reconciled before a new ID is issued. | NOT STARTED |


## R52 — Explicit Generate-ID controls for Sheet-originated records
- R52 acceptance tests: P4-21 Project_Members requires explicit Generate Project Member ID; P4-22 Project_Notes requires explicit Generate Project Note ID; P4-23 Budget_Given requires explicit Generate Budget ID; P4-24 Salary_Admin supports explicit Generate Salary ID(s), including controlled bulk generation; P4-25 concurrent Generate-ID actions produce unique IDs under LockService; P4-26 generated IDs become read-only/locked and cannot be manually overwritten.


## R54 — Form attachment routing acceptance tests
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-27 | Submit FRM-02 with a receipt and valid project | Receipt is moved to the exact project's '03_Expenses' folder and final Attachment_URL is stored. | NOT STARTED |
| P4-28 | Submit FRM-03 with proof and valid project | Proof is moved to the exact project's '03_Expenses' folder and final Proof_URL is stored. | NOT STARTED |
| P4-29 | Submit FRM-04 with supporting document | Document is routed to 'MASTER COMPANY/HR' without public sharing. | NOT STARTED |
| P4-30 | Retry an already-routed attachment event | No duplicate business copy is created. | NOT STARTED |
| P4-31 | Use invalid/unresolved project name for an attachment submission | No guessed destination is used; submission is marked failed/manual review. | NOT STARTED |
| P4-32 | Simulate destination/move failure | Source submission remains intact, original file reference is retained, and processing is visibly failed/pending. | NOT STARTED |

## R55 — Master Drive asset placement acceptance tests
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-33 | Verify Google Site file location | Existing MASTER COMPANY Google Site file is located at `MASTER COMPANY/Site`; published/access state is not changed merely by placement. | PASS | 30-Sep-2026 R55 execution: `imgod_godisgreat` ALREADY_CORRECT under Site. |
| P4-34 | Verify four master workbook locations | OPERATIONS, FINANCE, HR_ADMIN and ADMIN workbooks are each in their exact frozen R55 destinations, including ADMIN under `MASTER COMPANY/Admin`. | PASS | 30-Sep-2026 R55 execution: all four workbooks ALREADY_CORRECT in Projects, Finance, HR and Admin respectively. |
| P4-35 | Verify seven Form locations | FRM-01 through FRM-07 are each in their exact frozen R55 destinations. | PASS | 30-Sep-2026 R55 execution: all seven Forms ALREADY_CORRECT in their approved folders. |
| P4-36 | Relocate a misplaced existing master asset | Existing asset is moved to its exact authoritative destination without creating a duplicate and without altering its business content. | NOT STARTED |
| P4-37 | Retry asset placement | Correctly placed assets remain unchanged; no duplicate assets are created. | NOT STARTED |
| P4-38 | Missing/ambiguous/inaccessible asset | Placement does not create a silent replacement; the condition is surfaced as HUMAN ACTION REQUIRED / failed placement. | NOT STARTED |
| P4-39 | Verify response-destination integrity | Form response tabs continue writing to their approved authoritative workbooks; no unauthorized response workbook/tab is introduced. | PASS | 30-Sep-2026 P4-39 read-only Apps Script verification: all 7 Forms matched their approved workbook IDs and required response tabs existed. |

## R48/R52 — Employee creation acceptance tests
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-40 | Test direct Employees-sheet employee creation controls. | Existing `Employees` sheet remains exactly 15 columns; user selects the employee row and uses the native `Employee Actions` menu to explicitly `Generate Employee ID`, then `Save Employee`. The system generates and locks a unique `EMP-000001`-style ID and commits the validated row with a system timestamp. No typed command, sidebar, employee Form, or extra schema column is required. | NOT STARTED |
| P4-41 | Test Employee_ID generation rejection. | Missing/invalid required employee data prevents ID generation; no authoritative employee row is committed and no generic edit/autosave action generates an ID. | NOT STARTED |
| P4-42 | Test Employee save rejection without generated ID. | `Save Employee` cannot commit a row unless the Employee_ID was generated by the explicit Generate-ID menu action for that exact pending row. | NOT STARTED |
