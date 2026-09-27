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
| R13 | Built Phase 3 as the operational Google Sheets + Forms layer, with schema, Forms mapping, data rules, access matrix and acceptance gate. |
| R14 | Kept Apps Script automation strictly in Phase 4 and preserved the authoritative 5-phase structure. |
| R15 | Initiated Phase 3 execution per Prompt-001. Authored comprehensive Phase-3-Schema-Blueprint.md detailing 3 partitioned workbooks (OPERATIONS, FINANCE, HR_ADMIN), 14 specific tab schemas, stable ID formats, column formats, validation rules, 8 Forms mappings, and documented Rule 14 platform boundaries. Updated acceptance criteria P3-01 through P3-15 and flagged Human Action Boundary. |
| R16 | Reconciled Phase 3 specification across all documents. Explicitly separated Layer A (Google Form), Layer B (Native Response Destination), and Layer C (Authoritative Business Table). Documented Phase 4 processing boundaries for all 8 Forms. Reclassified P3-10 and P3-11 from PASS to SPEC READY / HUMAN ACTION REQUIRED to distinguish required policy from live observed evidence. |