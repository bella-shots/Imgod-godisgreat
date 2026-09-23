| PHASE 5 — TESTING + PERMISSIONS + HANDOVER |  |
|---|---|
| Purpose | Perform the final system-wide verification and prepare the Master Website for real internal use. |
| Phase boundary | Phase 5 validates Phases 1–4 as one integrated system. It does not add new business features unless a defect blocks an already-approved requirement. |
| Primary objective | Prove that the business objective is met using the agreed Google-native architecture with normal Gmail/Google Accounts and ₹0 additional software/service spend. |
| Testing principle | Test actual user journeys end-to-end, not merely individual components. |
| Defect principle | A failed acceptance test is a defect/blocked condition until corrected and retested. Do not mark a requirement PASS based only on implementation claims. |
| Permissions principle | Verify access using representative accounts/roles, including at least an ordinary employee and an authorized admin. |
| Sensitive-data principle | Explicitly test that employees cannot reach restricted Salary, Investment, Finance or HR source data through the Site, Drive, Sheets or Forms. |
| Cost principle | Verify that the deployed solution has not introduced a new paid database, hosting service, email service, automation service, third-party SaaS or employee Workspace subscription. |
| Quota principle | Verify expected usage is compatible with the applicable Google service quotas and that no workflow assumes unlimited execution/email capacity. |
| UAT principle | A representative employee must be able to perform the intended day-to-day workflows without needing to understand the underlying Sheets/Apps Script implementation. |
| Handover principle | The administrator must receive the site, Drive structure, Sheets, Forms, Apps Script project, documentation, ownership/access instructions and recovery/maintenance guidance. |
| Closure rule | PHASE_5_COMPLETE = all critical acceptance tests PASS + no unresolved critical security/access defect + no unresolved business-blocking defect + cost/quota gate PASS + UAT PASS + handover complete. |