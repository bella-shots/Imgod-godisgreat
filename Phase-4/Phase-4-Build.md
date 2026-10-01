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

R57 applies to direct Sheet-originated business records including Employee, Project Member, Project Note, Budget, Spending, OOP Claim, Salary and Investment records. Salary may use one explicit controlled bulk Generate Salary ID(s) action for a validated batch.

The following are prohibited for R57 ID issuance: generic onEdit/autosave, passive cell edits, spreadsheet-open triggers, row-position-based ID generation, manually typed business IDs, or a second Save/Process action required solely to complete ID generation.

Form/system-generated IDs remain automatic. Form-processing workflows may generate their business IDs within their controlled processing transaction, and Submission_ID remains system/index-generated.

R57 does not change the frozen Phase 3 schemas or the A4-00 ID formats. It standardizes the user interaction and transaction boundary for direct Sheet-originated records.
