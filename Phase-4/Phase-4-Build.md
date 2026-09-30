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

Phase 4 includes a controlled **Master Asset Placement / Verification** step. This step follows the revised Drive hierarchy established on 30-Sep-2026. It ensures the already-created Google Site, Phase 3 master workbooks, and Phase 3 Forms are stored in their frozen authoritative Drive locations.

### Frozen destinations
| Asset | Authoritative Drive location |
|---|---|
| Google Site file | `MASTER COMPANY/Site` |
| MASTER_COMPANY_OPERATIONS | `MASTER COMPANY/Projects/MASTER_COMPANY_OPERATIONS` |
| MASTER_COMPANY_FINANCE | `MASTER COMPANY/Finance/MASTER_COMPANY_FINANCE` |
| MASTER_COMPANY_HR_ADMIN | `MASTER COMPANY/HR/MASTER_COMPANY_HR_ADMIN` |
| MASTER_COMPANY_ADMIN | `MASTER COMPANY/Admin/MASTER_COMPANY_ADMIN` |
| FRM-01 Projects | `MASTER COMPANY/Projects/FRM-01 Projects` |
| FRM-02 Employee Spending | `MASTER COMPANY/Finance/FRM-02 Employee Spending` |
| FRM-03 OOP Claims | `MASTER COMPANY/Finance/FRM-03 OOP Claims` |
| FRM-04 HR Request | `MASTER COMPANY/HR/FRM-04 HR Request` |
| FRM-05 MOM Input | `MASTER COMPANY/MOM/FRM-05 MOM Input` |
| FRM-06 Report Request | `MASTER COMPANY/Reports/FRM-06 Report Request` |
| FRM-07 Investment Input | `MASTER COMPANY/Finance/FRM-07 Investment Input` |

### Required Phase 4 behavior
1. Locate each asset by its frozen identity/name and verify its current Drive parent.
2. If an existing asset is in the wrong Drive location and the authorized owner account can move it, move it to the frozen destination.
3. Do not create duplicate workbooks, Forms, or Sites merely because an asset is misplaced.
4. Preserve existing workbook contents, Form questions/response destinations, and Site content during placement.
5. Verify the final Drive parent and retain the authoritative Drive file ID/URL where an approved index/configuration location already exists; do not add unauthorized Phase 3 schema columns solely for placement metadata.
6. If an asset cannot be found, is ambiguous, is inaccessible, or cannot be moved without human action, preserve the current source state and surface **HUMAN ACTION REQUIRED**. Do not silently create a replacement.
7. Placement is idempotent: rerunning it on correctly placed assets makes no duplicate and no unnecessary move.
8. Form response destinations remain the existing authoritative Phase 3 workbooks/tabs. R54 continues to govern uploaded-file routing.

### Phase boundary
The asset-placement step is Phase 4 infrastructure/verification only. It does not authorize changing Phase 3 schemas, creating new response tabs, redesigning the Site, or changing Form questions.
