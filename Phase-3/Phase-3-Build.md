| PHASE 3 — GOOGLE SHEETS + FORMS |  |
|---|---|
| Purpose | Create the actual operational data structures and input workflows that power the Master Google Site. |
| Phase boundary | Phase 3 creates Sheets, tabs, Forms, field definitions, validation, mappings and access boundaries. It does not implement Apps Script automation; automation belongs to Phase 4. |
| Primary data store | Google Sheets. |
| Primary input layer | Google Forms. |
| File storage dependency | Google Drive from Phase 1. Forms/Sheets should store links/IDs to Drive files where appropriate. |
| Site dependency | Google Site from Phase 2 is the presentation/navigation layer. Phase 3 supplies the data and Forms that will later be embedded/linked into the Site. |
| Identity model | Normal Gmail/Google Accounts are the target employee identity model. No employee-by-employee paid Workspace subscription is required for this architecture. |
| Cost rule | No paid database, paid form service, paid SaaS, paid email service or employee Workspace subscription is introduced as a prerequisite. |
| Automation boundary | Do not implement calculations, notifications, MOM emails, salary carry-forward or automated reports in this phase. Define their source fields and outputs so Phase 4 can implement them deterministically. |
| Sensitive-data boundary | Salary, investment and other restricted HR/Finance source tabs must be admin/restricted. The `Employees` master contains sensitive HR fields and remains restricted. Employees should normally submit data through Forms rather than edit sensitive master tabs. |
| Data principle | Use one authoritative record structure per business entity. The `Employees` tab is the single authoritative employee + HR master record; `HR_Admin` is a workflow/request table and must not duplicate employee profile data. Avoid duplicate manual copies of the same record across unrelated Sheets. Native Form response tabs are intake destinations, not additional authoritative business tables. |
| Auditability | Use stable IDs and timestamp/submitter fields where needed so later Apps Script automation can trace records. Phase 3 defines 14 authoritative/support schema tabs plus 8 native Form response tabs (22 physical tabs total after all Forms are linked). |
| Phase 3 exit condition | All required Sheets/tabs and Forms exist; fields match the requirements; validation rules are defined; access boundaries are configured; mappings are tested; and all Phase 3 acceptance tests PASS. |