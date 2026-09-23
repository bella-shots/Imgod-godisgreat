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