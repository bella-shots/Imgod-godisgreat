# Architecture Context

## System boundary
The Master Company Portal is a Google-native internal operations system.

## Responsibility map

| Responsibility | Authoritative system |
|---|---|
| Portal/navigation | Google Sites |
| Structured operational records | Google Sheets |
| Employee/project submissions | Google Forms |
| Files/documents | Google Drive |
| Calculations and workflow automation | Google Apps Script |
| Email notifications | Gmail/Apps Script mail capability |
| Business reporting | Sheets + Apps Script |
| Access control | Google sharing/permissions plus Apps Script authorization checks where applicable |

## Data ownership
Google Sheets are authoritative for structured records. Google Drive is authoritative for uploaded files and documents. The Google Site is not an authoritative database.

## Security invariants
- Sensitive source sheets are not broadly embedded or published.
- Salary data is restricted.
- Investment data is restricted.
- Restricted Finance/HR data is restricted.
- Project files are shared only with authorized users.
- Site editing is restricted to authorized administrators.
- Form identity and submission ownership must be handled according to the approved access model.
- Apps Script automation must not bypass intended permissions.

## Architecture constraints
- No localStorage as authoritative company storage.
- No Firebase database as the project database.
- No paid database.
- No paid hosting.
- No paid third-party email API.
- No paid third-party automation platform.
- No unnecessary third-party SaaS.
- No replacement architecture may be introduced without an explicit architecture decision.

## Phase boundaries
Phase 1 creates Drive structure only.
Phase 2 creates the Master Site.
Phase 3 creates Sheets and Forms.
Phase 4 creates Apps Script automation.
Phase 5 verifies, secures, accepts and hands over the integrated system.

## Important invariant
A later phase must not be implemented merely because its code can be written. Dependencies must be proven first.
