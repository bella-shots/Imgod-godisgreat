# PHASE 3 — RUNNING CHANGE PROMPT 002

## Change type
**Controlled specification correction before human instantiation.**

This is a revision of Phase 3 Prompt-001. It does not authorize Phase 4, Phase 5, Apps Script, or any new architecture.

## Required repository context
Read the existing Phase 3 controls and the revised authoritative documents before acting.

## Change set

### RC-03-01 — Lists_Config boundary
Treat `MASTER_COMPANY_OPERATIONS / Lists_Config` as the **canonical configuration definition** for controlled values.

Do NOT claim that native Google Sheets data-validation ranges can directly reference the Operations workbook from Finance or HR in Phase 3.

Where Finance or HR native validation cannot directly reference Operations, apply the exact approved values from `Lists_Config` as local validation values and document that `Lists_Config` remains the canonical configuration definition. Do not create a second authoritative business-record source.

Do not implement Apps Script synchronization. Any automated synchronization is a Phase 4 concern.

### RC-03-02 — Drive reference wording
Use **Drive file reference/URL governed by actual Google Drive sharing permissions**.

Do not describe attachment references as inherently public.

Do not change Drive permissions merely to satisfy this wording correction.

### RC-03-03 — Physical tab count
Use the following authoritative count:

- 14 authoritative/support schema tabs
- 8 native Form response tabs
- 22 physical tabs total after all eight Forms are linked

Response tabs are intake destinations, not additional authoritative business tables.

Do not create a ninth response tab.

## Scope restrictions
- No React/Vite/Firebase/custom application.
- No Apps Script.
- No new business rules.
- No change to the ₹5,000 OOP rule.
- No change to workbook partitioning.
- No live Google Sheet/Form creation in this revision prompt unless the human separately provides the required live access and explicitly authorizes that action.
- Preserve historical Prompt-001 and Report-001 records.

## Verification
Before reporting completion, verify that:
1. Phase-3-Schema-Blueprint.md reflects all three corrections.
2. Phase-3-Data-Rules.md reflects the validation boundary.
3. Phase-3-Acceptance.md reflects the corrected tab count and validation/Drive wording.
4. Revision-Log.md records this running change.
5. No Phase 4/5 implementation was introduced.
6. Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED until live Sheets/Forms evidence is supplied.

## Stop condition
After documentation/specification verification, STOP at the Phase 3 human-action boundary. Do not mark P3-01 through P3-12 or P3-15 PASS without live evidence.
