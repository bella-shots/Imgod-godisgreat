| PHASE 4 — APPS SCRIPT AUTOMATION |  |
|---|---|
| Purpose | Turn the Phase 3 Sheets + Forms into an operational workflow using Google Apps Script. |
| Phase boundary | Phase 4 implements automation against the approved Phase 3 data structures. It does not redesign the Site, create new core schemas, or perform the final system-wide testing/handover of Phase 5. |
| Runtime | Google Apps Script attached to or associated with the project owner's Google environment. |
| Cost rule | Do not introduce Cloud Functions, Cloud Run, paid email APIs, paid automation platforms, paid databases or other paid services. |
| Identity rule | Use the authorized owner/admin account for privileged automation. Employees continue using normal Gmail/Google Accounts for Forms/site access. |
| Data rule | Automation must reference stable IDs and approved Sheet columns from Phase 3; never depend on fragile row numbers where a stable ID exists. |
| Automation principles | Idempotent where practical; log important actions; avoid duplicate emails; validate required fields before processing; fail safely without corrupting source records. |
| Quota principle | Design for Apps Script execution, email-recipient, trigger and runtime quotas. The system must not assume unlimited automation. |
| Human approval principle | Where a workflow requires approval, Apps Script records the request/status and notifies the designated approver; it must not silently self-approve unless the requirement explicitly permits it. |
| Phase 4 exit condition | All required automation modules work against the Phase 3 structures, trigger correctly, produce expected outputs, respect access boundaries and pass all Phase 4 acceptance tests. |

## R55 — Master Drive asset placement and verification

## R56 — Frozen Employee creation UX and transaction

The Employee creation workflow is now frozen as a **single explicit action** against the existing MASTER_COMPANY_HR_ADMIN → Employees sheet.

1. HR/Admin fills the pending employee row.
2. HR/Admin selects the employee row/Employee_ID cell.
3. HR/Admin invokes **Employee Actions → Generate Employee ID**.
4. The workflow validates the complete employee record and duplicate email constraints.
5. A4-00 generates the canonical EMP-XXXXXX ID.
6. The workflow writes and locks Employee_ID.
7. The workflow writes Created_At.
8. The employee record is finalized immediately.

The following are explicitly **not** part of the frozen workflow: separate Save Employee action, Process action, Process column, employee-creation Form, sidebar, floating panel, or generic onEdit/autosave ID generation.

The authoritative Employees schema remains exactly the Phase 3 15-column schema.

## R57 — Universal Sheet-originated business-ID creation standard

R57 freezes the common UX and transaction contract for every user-created authoritative Sheet record that requires a business ID.

1. User completes the pending record using the already-frozen Sheet schema.
2. User selects the pending record.
3. User invokes the record-specific **Generate-ID** action.
4. The action validates the complete pending record and applicable duplicate/identity constraints.
5. A4-00 generates the canonical stable ID.
6. The workflow persists and locks the ID field.
7. The workflow performs the appropriate authoritative commit/finalization for that record type.
8. The completed record is left in its approved post-creation state.

R57 applies to direct Sheet-originated business records including Employee, Project Member, Project Note, Budget, Salary and Investment records. Employee_Spending and OOP_Claims are frozen Form-originated workflows and therefore remain automatic during controlled Form processing; they do not receive direct-Sheet Generate-ID UX. Salary may use one explicit controlled bulk Generate Salary ID(s) action for a validated batch.

The following are prohibited for R57 ID issuance: generic onEdit/autosave, passive cell edits, spreadsheet-open triggers, row-position-based ID generation, manually typed business IDs, or a second Save/Process action required solely to complete ID generation.

Form/system-generated IDs remain automatic. Form-processing workflows may generate their business IDs within their controlled processing transaction, and Submission_ID remains system/index-generated.

R57 does not change the frozen Phase 3 schemas or the A4-00 ID formats. It standardizes the user interaction and transaction boundary for direct Sheet-originated records.


## R58 — Financial employee identity invariant

Phase 4 financial automation must preserve the Phase 3 employee-linkage contract: `Employee_ID` is the canonical employee identity reference for `Budget_Given`, `Employee_Spending`, `OOP_Claims` and `Salary_Admin`. `Member_Record_ID` is never a substitute for `Employee_ID` in these workflows. `Investments` remains the explicit schema exception using `Source_Person`.

## R62 — OOP Employee → Top Manager approval transaction

The OOP workflow is now explicitly human-approved before salary eligibility:

1. Employee submits FRM-03.
2. A4-04 validates the submission, resolves `Employee_ID`/`Project_ID`, generates `CLM-XXXXXX`, stores the claim as `Pending Review`, and requires proof.
3. A4-04 notifies the configured Top Manager by email.
4. The Top Manager opens `MASTER_COMPANY_FINANCE → OOP_Claims`, selects the claim, and uses the controlled `Top Manager Actions` menu.
5. `Approve Company-Essential Claim` changes the claim to `Approved`, writes `Approved_Amount`, and classifies it as `APPROVED_COMPANY_ESSENTIAL`.
6. `Approve Food Business Exception` is required for a food-related claim that the Top Manager determines is a genuine business exception; it writes `Approved_Amount` and `APPROVED_FOOD_BUSINESS_EXCEPTION`.
7. `Reject OOP Claim` sets `Rejected` and clears salary eligibility.
8. A4-05 includes only `Approved` claims with a salary-eligible approval flag in the next monthly salary calculation.

The configured Top Manager email is stored in Apps Script Script Properties as `TOP_MANAGER_EMAIL`. Approval actions verify the active manager identity against that configured address. No new Sheet column, Form, or employee-facing approval form is introduced.
