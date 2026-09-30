| ID | User journey | Start | Expected end state | Priority | Status |
|---|---|---|---|---|---|
| E2E-01 | Employee opens Master Site | Employee Gmail/Google Account | Employee reaches HOME and required navigation without paid Workspace subscription. | Critical | NOT STARTED |
| E2E-02 | Employee views permitted project information | Employee → PROJECTS | Only permitted project information/resources are visible. | Critical | NOT STARTED |
| E2E-03 | Employee submits expense | Employee → FINANCE → Expense Form | Expense record, proof reference and processing status are created correctly. | Critical | NOT STARTED |
| E2E-04 | Employee submits OOP claim | Employee → FINANCE → OOP Form | Claim is recorded, validated and routed for approval. | Critical | NOT STARTED |
| E2E-05 | Authorized admin processes expense/claim | Admin → Finance source data | Admin can review/process the record and update status without breaking auditability. | Critical | NOT STARTED |
| E2E-06 | Salary processing | Admin → Salary workflow | Monthly salary/carry-forward result matches the approved business rule and history remains intact. | Critical | NOT STARTED |
| E2E-07 | MOM creation/publish | Project-authorized user → MOM workflow | MOM record/version is stored and intended recipients receive the correct notification. | Critical | NOT STARTED |
| E2E-08 | MOM update | Authorized user → existing MOM | Update/version is recorded and notification behavior follows the approved rule without duplicate sends. | High | NOT STARTED |
| E2E-09 | Report generation | Admin/authorized user → Reports | Report is generated from authoritative data, stored/linked correctly and visible only to intended users. | High | NOT STARTED |
| E2E-10 | Project onboarding | Admin → project workflow | Project record, Drive folder/resources and Site access/linking work as intended. | Critical | NOT STARTED |
| E2E-11 | Mobile use | Employee mobile device → Site | Core Site navigation and permitted Forms remain usable. | High | NOT STARTED |
| E2E-12 | Automation failure/retry | Controlled test failure | Failure is visible, source data is preserved, and retry does not duplicate side effects. | High | NOT STARTED |
| E2E-13 | Employee retrieves generated record | Employee submits an applicable Form → processing completes → employee opens My Records | The authoritative record appears with its generated business ID and permitted details. | Critical | NOT STARTED |
| E2E-14 | Cross-employee retrieval denial | Employee A attempts to retrieve Employee B's record by manipulating identifier/identity inputs | Access is denied and no restricted record data is disclosed. | Critical | NOT STARTED |

| E2E-15 | Universal generated-ID visibility | Create/process one representative record of each authoritative type and open its authorized module view | The correct canonical generated ID is displayed for each record type; no ID is missing or substituted with row number/form timestamp. | Critical | NOT STARTED |


## R52 — Explicit Generate-ID controls for Sheet-originated records
- E2E-16 — Sheet-originated Generate-ID → persistence → visibility: authorized user enters record data → invokes explicit Generate-ID control → central generator issues unique ID → ID is locked/persisted → record is committed → authorized website/module displays the same ID. Verify concurrent users receive distinct IDs and generic autosave/edit events never allocate IDs.
