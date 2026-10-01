| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-01 | Deploy the approved Apps Script project. | Script is associated with the approved Google environment and required authorizations are granted. | NOT STARTED |
| P4-02 | Test project processing. | Valid project input creates/locates the required Drive structure and updates the project record correctly. | PASS — live-verified 01-Oct-2026; FRM-01 → A4-01 → A4-02 created PRJ/MBR/SUB records, resolved Employee_ID, created/reused the exact seven-folder project Drive structure, passed idempotency and ambiguity safety, preserved the raw response, and passed failure cleanup. |
| P4-03 | Test expense processing. | Valid FRM-02 submission is validated, resolved to canonical Employee_ID/Project_ID, assigned SPN-XXXXXX through controlled Form processing, stored in Employee_Spending and given the correct processing status. | PASS — live-verified 01-Oct-2026; allPassed=true. |
| P4-04 | Test invalid expense. | Invalid/missing FRM-02 data is rejected safely before authoritative transfer; source intake remains intact. | PASS — live verification harness passed 01-Oct-2026; no production data or SPN sequence was consumed. |
| P4-05 | Test OOP claim processing. | Claim is validated and routed according to the approved workflow. | PASS — live-verified 01-Oct-2026; FRM-03 → OOP_Claims_Responses → A4-04 → OOP_Claims, CLM generation, Director routing and Pending Review behavior all passed. |
| P4-06 | Test ₹5,000 rule. | Monthly company-essential OOP spend is applied to the next salary credit as actual approved spend: ₹1,000→+₹1,000; ₹5,000→+₹5,000; ₹7,000→+₹5,000+₹2,000 excess (=+₹7,000). No extra ₹5,000 line is added and claims are not auto-approved. | PASS — live-verified 01-Oct-2026; ₹1,000, ₹5,000 and ₹7,000 cases passed with no separate ₹5,000 line. |
| P4-07 | Test salary carry-forward. | Salary_Admin monthly record uses designated/base salary plus aggregated approved OOP spend from the applicable month, preserves prior salary history, and does not double-count the ₹5,000 baseline. | PASS — live-verified 01-Oct-2026; approved/pending/rejected/food cases and separate ₹1,000 allowance passed. |
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

### A4-01 + A4-02 live verification evidence — 01-Oct-2026
- A4-01 prerequisites: PASS; exact Projects, Project_Members, Employees and Submission_Index schemas verified.
- A4-01 trigger: PASS; exactly one ON_FORM_SUBMIT trigger for `processA401ProjectSubmission` on MASTER_COMPANY_OPERATIONS.
- Controlled FRM-01 live processing: PASS; generated `SUB-000001`, `PRJ-000001`, and `MBR-000001` through A4-00; resolved `fromjul21@gmail.com` to canonical `EMP-000001`.
- A4-02 Drive structure: PASS; exact `PROJECT_<ProjectName>` under `MASTER COMPANY/Projects` with `01_Admin`, `02_Checklist`, `03_Expenses`, `04_MOM`, `05_Notes`, `06_Files`, `07_Reports`.
- Idempotency/re-entry: PASS; duplicate event reservation was refused and no duplicate Projects, Project_Members, Submission_Index records or Drive folders were created.
- Existing-folder reuse: PASS; a unique existing project folder was reused without numbered duplicates.
- Ambiguous-folder safety: PASS; duplicate project/subfolder names are rejected rather than silently selected.
- Failure cleanup: PASS; A4-02 trashes a newly created project folder if required subfolder provisioning fails.
- Submission_Index traceability: PASS; `SUB-000001` mapped to `PRJ-000001` with `Processing_Status=Processed` and `Source_Form=FRM-01 Create / Request Project`.
- Raw response preservation: PASS; the native `Projects_Responses` intake row remains intact.
- Cleanup/data integrity: PASS; temporary records and Drive artifacts were removed and pre-existing records were preserved.
- Overall: `A4_01_A4_02_LIVE_VERIFICATION = PASS`.

## R52 — Explicit Generate-ID controls for Sheet-originated records
- R52 acceptance tests: P4-21 Project_Members requires explicit Generate Project Member ID; P4-22 Project_Notes requires explicit Generate Project Note ID; P4-23 Budget_Given requires explicit Generate Budget ID; P4-24 Salary_Admin supports explicit Generate Salary ID(s), including controlled bulk generation; P4-25 concurrent Generate-ID actions produce unique IDs under LockService; P4-26 generated IDs become read-only/locked and cannot be manually overwritten.

## R54 — Form attachment routing acceptance tests
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-27 | Submit FRM-02 with a receipt and valid project | Receipt is moved to the exact project's '03_Expenses' folder and final Attachment_URL is stored. | PASS — live-verified 01-Oct-2026. |
| P4-28 | Submit FRM-03 with proof and valid project | Proof is moved to the exact project's '03_Expenses' folder and final Proof_URL is stored. | PASS — live-verified 01-Oct-2026. |
| P4-29 | Submit FRM-04 with supporting document | Document is routed to 'MASTER COMPANY/HR' without public sharing. | PASS — live-verified 01-Oct-2026. |
| P4-30 | Retry an already-routed attachment event | No duplicate business copy is created. | PASS — live-verified 01-Oct-2026. |
| P4-31 | Use invalid/unresolved project name for an attachment submission | No guessed destination is used; submission is marked failed/manual review. | PASS — live-verified 01-Oct-2026. |
| P4-32 | Simulate destination/move failure | Source submission remains intact, original file reference is retained, and processing is visibly failed/pending. | PASS — live-verified 01-Oct-2026. |

### R54 attachment routing live verification evidence — 01-Oct-2026
- Implementation: Phase-4/Automation/Core/a4_54_attachment_routing.gs integrated with A4-03, A4-04 and FRM-04 processing.
- FRM-02 receipt routing: PASS; receipt moved to exact PROJECT_<ProjectName>/03_Expenses and final Attachment_URL persisted.
- FRM-03 proof routing: PASS; proof moved to exact PROJECT_<ProjectName>/03_Expenses and final Proof_URL persisted.
- R62 integrity: PASS; proof routing leaves OOP claim Pending Review and does not auto-approve.
- FRM-04 HR routing: PASS; supporting document routed to MASTER COMPANY/HR with public sharing blocked.
- Idempotency/retry: PASS; existing target parent is detected and duplicate movement/copy is avoided.
- Invalid/unresolved project: PASS; A4_54_PROJECT_FOLDER_NOT_FOUND occurs before Drive mutation; no guessed destination is used.
- Destination failure: PASS; controlled attachment errors leave raw intake available for audit/manual review.
- Same filename handling: PASS; distinct Drive file IDs remain distinct.
- Raw response preservation: PASS across Employee_Spending_Responses, OOP_Claims_Responses and HR_Requests_Responses.
- Cleanup/data integrity: PASS; temporary artifacts removed and pre-existing records/assets preserved; no SPN/CLM sequence consumed.
- Overall: R54_ATTACHMENT_ROUTING_LIVE_VERIFICATION = PASS.

## R55 — Master Drive asset placement acceptance tests
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-33 | Verify Google Site file location | Existing MASTER COMPANY Google Site file is located at `MASTER COMPANY/Site`; published/access state is not changed merely by placement. | PASS |
| P4-34 | Verify four master workbook locations | OPERATIONS, FINANCE, HR_ADMIN and ADMIN workbooks are each in their exact frozen R55 destinations, including ADMIN under `MASTER COMPANY/Admin`. | PASS |
| P4-35 | Verify seven Form locations | FRM-01 through FRM-07 are each in their exact frozen R55 destinations. | PASS |
| P4-36 | Relocate a misplaced existing master asset | Existing asset is moved to its exact authoritative destination without creating a duplicate and without altering its business content. | NOT STARTED |
| P4-37 | Retry asset placement | Correctly placed assets remain unchanged; no duplicate assets are created. | NOT STARTED |
| P4-38 | Missing/ambiguous/inaccessible asset | Placement does not create a silent replacement; the condition is surfaced as HUMAN ACTION REQUIRED / failed placement. | NOT STARTED |
| P4-39 | Verify response-destination integrity | Form response tabs continue writing to their approved authoritative workbooks; no unauthorized response workbook/tab is introduced. | PASS |

## R48/R52/R56 — Employee creation acceptance tests
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-40 | Test the frozen one-click Employees-sheet employee creation workflow. | Existing `Employees` sheet remains exactly 15 columns; user completes a pending row, selects the employee row/Employee_ID cell, and explicitly invokes `Employee Actions → Generate Employee ID`. The single action validates the complete row, checks duplicate email, generates and locks a unique `EMP-000001`-style ID through A4-00, writes `Created_At`, and finalizes the employee immediately. No separate Save/Process action, Process column, typed command, sidebar, employee Form, or floating panel is required. | PASS — user live-verified on 01-Oct-2026. |
| P4-41 | Test Employee_ID generation rejection. | Missing/invalid required employee data prevents ID generation; no Employee_ID is issued and no employee is finalized. Generic edit/autosave events never generate an ID. | PASS — included in live one-click workflow verification on 01-Oct-2026. |
| P4-42 | Test duplicate/invalid finalization protection. | Duplicate email, invalid required data, or an already-generated Employee_ID prevents another employee-creation transaction; issued IDs are not reused and the Employee_ID remains immutable. There is no separate Save Employee action. | PASS — included in live one-click workflow verification on 01-Oct-2026. |

## R57 — Universal explicit Generate-ID acceptance tests for user-created Sheet records
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-43 | Verify common Generate-ID UX for Sheet-originated business records. | Each applicable direct-Sheet workflow exposes one record-specific Generate-ID action; no separate Save/Process action is required solely to complete ID generation. | PASS — live-verified 01-Oct-2026 across Employee, Project_Members, Project_Notes, Budget_Given and Salary_Admin. |
| P4-44 | Test validation-before-ID issuance across applicable Sheet workflows. | Incomplete/invalid pending records are rejected before A4-00 issuance; no business ID is created and no authoritative finalization occurs. | PASS — live-verified 01-Oct-2026 across Employee, Project_Members, Project_Notes, Budget_Given and Salary_Admin. |
| P4-45 | Test ID generation + locking + finalization. | A valid pending Sheet record receives the correct canonical ID through A4-00, the ID is persisted and locked, and the appropriate authoritative commit/finalization completes in the same controlled action. | PASS — live-verified 01-Oct-2026 across Employee, Project_Members, Project_Notes, Budget_Given and Salary_Admin. |
| P4-46 | Test duplicate/already-ID'd protection. | Duplicate/identity violations or an already-generated ID prevent another sequence allocation; issued IDs are never reused. | PASS — live-verified 01-Oct-2026 across Employee, Project_Members, Project_Notes, Budget_Given and Salary_Admin. |
| P4-47 | Test no generic ID issuance. | onEdit/autosave/passive edit/spreadsheet-open events never issue business IDs for direct Sheet-originated records. | PASS — live-verified 01-Oct-2026 across Employee, Project_Members, Project_Notes, Budget_Given and Salary_Admin. |
| P4-48 | Test controlled Salary bulk generation. | A validated Salary batch can use one explicit Generate Salary ID(s) action; each SAL ID is generated through A4-00 and no generic edit trigger issues IDs. | PASS — live-verified 01-Oct-2026; single-row and 3-row bulk generation, validation-before-ID issuance, duplicate protection, locking, concurrency and no generic ID issuance all passed. |
| P4-49 | Verify Form/system-generated exception. | Form-triggered business IDs and Submission_ID remain automatic within their controlled system processing workflows; R57 does not require manual Generate-ID actions for them. | PARTIAL — Employee_Spending is now live-verified Form-originated with automatic SPN generation through controlled FRM-02 processing; broader system/form verification remains pending. |

## R58 — Financial employee identity invariant
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-50 | Verify employee linkage for money-related records. | `Budget_Given` uses `Recipient Employee_ID`; `Employee_Spending`, `OOP_Claims`, and `Salary_Admin` use `Employee_ID`; no financial workflow uses `Member_Record_ID` as the employee reference. `Investments` remains the explicit exception because its frozen schema uses `Source_Person`. | PASS — live-verified 01-Oct-2026; Budget_Given, Employee_Spending, OOP_Claims and Salary_Admin use canonical Employee_ID, while Investments remains the explicit frozen Source_Person exception. |

### Salary_Admin R57/R58 live verification evidence — 01-Oct-2026
- Implementation: `Phase-4/Automation/Core/a4_14_salary_sheet_workflow.gs` in the existing MASTER COMPANY Phase 4 Automation project.
- Salary_Admin remains the authoritative salary sheet with exactly 11 frozen columns; no Salary Form, response tab, Process column, or extra schema column was introduced.
- Explicit UX: `Salary Actions → Generate Salary ID(s)`; no sidebar, floating panel, or separate Save/Process action.
- Single-row and controlled 3-row bulk generation passed; all rows were pre-validated before SAL allocation.
- Validation-before-ID issuance passed for missing/invalid Employee_ID, MBR misuse, missing Due_Amount, invalid frequency/period rules, and already-ID'd rows.
- Canonical employee identity is `Employee_ID`; `Member_Record_ID` (`MBR-*`), names and email addresses are rejected as employee keys.
- Duplicate employee/month batch protection passed; already-finalized rows cannot receive another ID.
- SAL IDs are generated through A4-00 as `SAL-000001`-style six-digit IDs under LockService; generated ID cells are protected/immutable.
- No ON_EDIT, ON_CHANGE or periodic trigger issues SAL IDs; issuance occurs only through the explicit Salary Actions menu.
- Historical salary records remained unchanged; temporary verification records were removed and pre-existing data was preserved.
- Overall: `SALARY_ADMIN_R57_LIVE_VERIFICATION = PASS`.

### Investments R58 live verification evidence — 01-Oct-2026
- Implementation: `Phase-4/Automation/Core/a4_07_investment_processing.gs` in the existing MASTER COMPANY Phase 4 Automation project.
- Investments remains the authoritative administrative capital ledger with exactly 8 frozen columns: `Investment_ID`, `Source_Person`, `Amount`, `Taken_Date`, `Expected_Return_Date`, `Actual_Return_Date`, `Status`, `Notes`.
- Creation path: Form-originated via `FRM-07 — Investment Entry` → `Investment_Responses` → `A4-07` → `Investments`. No manual Generate Investment ID menu or extra Form was introduced.
- R58 Source_Person exception: PASS; `Source_Person` is preserved as the authoritative investor/entity identifier; `Employee_ID` is not required or added; `Member_Record_ID` is strictly prohibited from substitution.
- Automatic A4-00 `INV-000001`-style ID generation under LockService; sequential allocation, reconciliation, and uniqueness verified.
- Validation-before-ID issuance passed for missing Source_Person, invalid/negative amounts, invalid dates, and invalid status values.
- Duplicate/idempotency protection passed; access control verified (non-public Finance workbook); temporary verification records removed and pre-existing records preserved.
- Overall: `INVESTMENT_R58_LIVE_VERIFICATION = PASS`.


### Budget_Given R57/R58 live evidence — 01-Oct-2026
- Authoritative workbook: `MASTER_COMPANY_FINANCE`
- Authoritative sheet: `Budget_Given`
- Frozen 13-column schema preserved exactly; no extra columns added.
- Explicit action: `Budget Actions → Generate Budget ID`.
- Valid test generated `BDG-000001`.
- Invalid Employee_ID, invalid Project_ID, invalid Amount Given, Used > Amount Given, Returned > To Be Returned, missing Purpose, and already-ID'd row were all rejected.
- ID persistence/locking passed; no generic edit issuance was present.
- Frozen calculation/status branches passed: Pending Return, Fully Returned, No Return Required.
- R58 passed for the tested workflow: canonical `EMP-000001` accepted and `MBR-000001` rejected.
- Cleanup passed: temporary records removed, final sheet returned to header-only, pre-existing records preserved.
- Overall: `BUDGET_GIVEN_R57_LIVE_VERIFICATION = PASS`.

### Employee_Spending architecture decision — 01-Oct-2026
- Frozen Phase 3 sources confirm `FRM-02 Employee Spending / Expense` is the authoritative creation path.
- Native `Employee_Spending_Responses` is an intake-only response tab.
- `Employee_Spending` is the authoritative Finance table.
- Ordinary employees submit spending strictly through FRM-02 and do not receive direct access to the restricted Finance workbook.
- Therefore R57 direct-Sheet Generate-ID UX is **not applicable** to Employee_Spending.
- A4-03 automatically generates `SPN-XXXXXX` through A4-00 during controlled Form processing.
- The implementation does not add a Generate Spending ID menu, direct-Sheet Save/Process action, new Form, new tab, or schema column.
- **Live verification on 01-Oct-2026 returned `allPassed: true`.**
- Verified exact 10-column schema, workbook/sheet resolution, Employee_ID and Project_ID resolution, A4-00 SPN availability, no SPN sequence consumption by the test, no onEdit ID issuance, R58 rejection of Member_Record_ID, and production-data preservation.
- **Overall: A4-03 Employee Spending Form-Originated Workflow = PASS.**


### OOP_Claims architecture decision — 01-Oct-2026
- Frozen Phase 3 sources confirm `FRM-03 OOP Claim` is the authoritative creation path.
- Native `OOP_Claims_Responses` is an intake-only response tab.
- `OOP_Claims` is the authoritative Finance table.
- Therefore R57 direct-Sheet Generate-ID UX is **not applicable** to OOP_Claims.
- A4-04 automatically generates `CLM-XXXXXX` through A4-00 during controlled Form processing.
- Canonical employee identity is `Employee_ID`; `Member_Record_ID` is explicitly rejected.
- Project Name is resolved to canonical `Project_ID`; proof is required.
- Claims enter `Pending Review`; no silent auto-approval is introduced.
- R60/R61 are now frozen: ₹5,000 is the company-essential monthly baseline, ordinary food is excluded, and ₹1,000 monthly food allowance is separate. A4-04 creates claims as `Pending Review` and routes them to the Top Manager for explicit approval; `Approved_Amount` remains unset until approval. A4-05 uses only explicitly approved salary-eligible claims.
- **Live verification of the complete approval and salary chain = PASS on 01-Oct-2026.**


### R60 — OOP-to-Salary rule implementation — 01-Oct-2026
- A4-04 now classifies each OOP claim against the frozen ₹5,000 monthly company-essential baseline.
- A4-05 now calculates the next monthly salary credit from base salary + aggregated approved OOP spend for the applicable month.
- The calculation explicitly handles below ₹5,000, exactly ₹5,000, and above ₹5,000 cases.
- No separate ₹5,000 reimbursement line is created.
- Only claims with Status = Approved and a positive Approved_Amount contribute to the salary addition.
- Salary history is preserved; prior Salary_Admin records are not overwritten.
- **Live verification of A4-04 and A4-05 = PASS on 01-Oct-2026.**

### R61 — Food allowance vs company-essential OOP — 01-Oct-2026
- Every eligible employee receives a fixed ₹1,000 food/eatables allowance each month independently of actual food spending.
- The ₹1,000 allowance is not reduced when unused and does not depend on an OOP claim.
- Ordinary food/eatables are excluded from the ₹5,000 company-essential OOP rule.
- Food-related expenses may enter the OOP workflow only for documented company-essential exceptions such as a necessary client/business meeting or hosted guest expense; approval alone does not make an ordinary personal food expense eligible.
- A4-04 flags food-related claims for review instead of automatically treating them as company-essential OOP.
- A4-05 includes only approved company-essential OOP in the OOP salary addition and adds the fixed ₹1,000 monthly food allowance separately.
- The ₹1,000 food allowance and approved company-essential OOP amount must never be merged or double-counted.

## R62 — OOP Top Manager approval acceptance tests
| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-51 | Test employee OOP submission routing | Valid FRM-03 submission creates a CLM record with `Pending Review` and notifies the single active `Director` resolved from `Employees`. | PASS — live-verified 01-Oct-2026; FRM-03 created CLM-000001 in Pending Review and notified the single active Director. |
| P4-52 | Test non-manager approval rejection | An account other than the resolved active `Director` cannot approve/reject a claim. | PASS — live-verified 01-Oct-2026; non-Director approval/rejection was rejected and claim remained Pending Review. |
| P4-53 | Test normal company-essential approval | Director-designated Top Manager approval changes `Pending Review` → `Approved`, writes positive `Approved_Amount`, sets `APPROVED_COMPANY_ESSENTIAL`, and makes the claim salary-eligible. | PASS — live-verified 01-Oct-2026; Director approval produced Approved, positive Approved_Amount and APPROVED_COMPANY_ESSENTIAL. |
| P4-54 | Test ordinary food claim | Food-related claim remains excluded from salary unless explicitly approved as a genuine business exception. | PASS — live-verified 01-Oct-2026; ordinary food remained excluded from company-essential salary eligibility. |
| P4-55 | Test food business exception approval | Director-designated Top Manager uses `Approve Food Business Exception`; claim becomes `Approved`, receives positive `Approved_Amount` and `APPROVED_FOOD_BUSINESS_EXCEPTION`, and is eligible for salary. | PASS — live-verified 01-Oct-2026; Director food-business exception produced Approved, positive Approved_Amount and APPROVED_FOOD_BUSINESS_EXCEPTION. |
| P4-56 | Test rejection gate | Rejected claim contributes ₹0 to next-month OOP salary credit. | PASS — live-verified 01-Oct-2026; rejected claims contributed ₹0. |
| P4-57 | Test salary gate | A4-05 includes only `Approved` claims with `APPROVED_COMPANY_ESSENTIAL` or `APPROVED_FOOD_BUSINESS_EXCEPTION`; pending/unapproved/ordinary-food claims contribute ₹0. | PASS — live-verified 01-Oct-2026; only explicitly approved salary-eligible claims contributed to A4-05. |
| P4-58 | Test no schema expansion | OOP_Claims remains the frozen 11-column schema; approval workflow uses existing fields and Apps Script controls. | PASS — live-verified 01-Oct-2026; OOP_Claims remained exactly 11 columns with no schema expansion. |

### R62 workflow decision — 01-Oct-2026
- Employee submits FRM-03.
- A4-04 resolves the active `Director` from `Employees`, routes the claim to that person, and leaves it `Pending Review`.
- Only explicit approval by that resolved Director makes the claim eligible for the next salary calculation.
- Ordinary food claims are not eligible; genuine client/business/hosted-guest exceptions require the dedicated food-business-exception approval action.
- A4-05 excludes all unapproved and non-salary-eligible claims.
