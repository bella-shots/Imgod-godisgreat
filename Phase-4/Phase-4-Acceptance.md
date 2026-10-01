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

## R48/R52/R56 — Employee creation acceptance tests
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-40 | Test the frozen one-click Employees-sheet employee creation workflow. | Existing `Employees` sheet remains exactly 15 columns; user completes a pending row, selects the employee row/Employee_ID cell, and explicitly invokes `Employee Actions → Generate Employee ID`. The single action validates the complete row, checks duplicate email, generates and locks a unique `EMP-000001`-style ID through A4-00, writes `Created_At`, and finalizes the employee immediately. No separate Save/Process action, Process column, typed command, sidebar, employee Form, or floating panel is required. | PASS — user live-verified on 01-Oct-2026. |
| P4-41 | Test Employee_ID generation rejection. | Missing/invalid required employee data prevents ID generation; no Employee_ID is issued and no employee is finalized. Generic edit/autosave events never generate an ID. | PASS — included in live one-click workflow verification on 01-Oct-2026. |
| P4-42 | Test duplicate/invalid finalization protection. | Duplicate email, invalid required data, or an already-generated Employee_ID prevents another employee-creation transaction; issued IDs are not reused and the Employee_ID remains immutable. There is no separate Save Employee action. | PASS — included in live one-click workflow verification on 01-Oct-2026. |

## R57 — Universal explicit Generate-ID acceptance tests for user-created Sheet records
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-43 | Verify common Generate-ID UX for Sheet-originated business records. | Each applicable direct-Sheet workflow exposes one record-specific Generate-ID action; no separate Save/Process action is required solely to complete ID generation. | NOT STARTED |
| P4-44 | Test validation-before-ID issuance across applicable Sheet workflows. | Incomplete/invalid pending records are rejected before A4-00 issuance; no business ID is created and no authoritative finalization occurs. | NOT STARTED |
| P4-45 | Test ID generation + locking + finalization. | A valid pending Sheet record receives the correct canonical ID through A4-00, the ID is persisted and locked, and the appropriate authoritative commit/finalization completes in the same controlled action. | NOT STARTED |
| P4-46 | Test duplicate/already-ID'd protection. | Duplicate/identity violations or an already-generated ID prevent another sequence allocation; issued IDs are never reused. | NOT STARTED |
| P4-47 | Test no generic ID issuance. | onEdit/autosave/passive edit/spreadsheet-open events never issue business IDs for direct Sheet-originated records. | NOT STARTED |
| P4-48 | Test controlled Salary bulk generation. | A validated Salary batch can use one explicit Generate Salary ID(s) action; each SAL ID is generated through A4-00 and no generic edit trigger issues IDs. | NOT STARTED |
| P4-49 | Verify Form/system-generated exception. | Form-triggered business IDs and Submission_ID remain automatic within their controlled system processing workflows; R57 does not require manual Generate-ID actions for them. | NOT STARTED |


## R58 — Financial employee identity invariant
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-50 | Verify employee linkage for money-related records. | `Budget_Given` uses `Recipient Employee_ID`; `Employee_Spending`, `OOP_Claims`, and `Salary_Admin` use `Employee_ID`; no financial workflow uses `Member_Record_ID` as the employee reference. `Investments` remains the explicit exception because its frozen schema uses `Source_Person`. | NOT STARTED |
