| Revision | Change |
|---|---|
| R1 | Changed target architecture from custom React/Firebase app to Google Sites + Sheets + Forms + Drive + Apps Script. |
| R2 | Removed employee Google Workspace subscriptions as a prerequisite; ordinary Gmail/Google Accounts are the intended employee access model. |
| R3 | Made ₹0 additional software/service spend a hard project constraint. |
| R4 | Retained Google AI Pro as an existing user resource, not a new project cost. |
| R5 | Downgraded advanced visual-builder requirements from mandatory to out-of-scope/optional. |
| R6 | Added sensitive-data access model using restricted Sheets/Drive plus Forms/Apps Script workflows. |
| R7 | Added explicit quota/storage/access conditions so ₹0 is not incorrectly interpreted as unlimited. |
| R8 | Replaced custom app build sequence with a Google-native implementation sequence. |
| R9 | Corrected the project structure to exactly 5 phases. Detailed implementation steps are now sub-tasks/checkpoints, not separate phases. |
| R10 | Built Phase 1 as a concrete Google Drive foundation with folder manifest, access rules and acceptance tests. |
| R11 | Completed Phase 1 verification across P1-01 through P1-12 based on existing Drive structure verification and permission audit (all folders PRIVATE with 0 shared users). Documented limitation regarding lack of active secondary test accounts. Formally closed Phase 1. |

| R55 | Frozen the canonical Drive placement of the four master workbooks, FRM-01 through FRM-07, and the Master Google Site: all are authoritative control assets located in the existing root MASTER COMPANY folder. No new Drive folder is introduced. Phase 4 must verify/normalize placement without creating duplicates; resource-specific permissions remain authoritative. |
