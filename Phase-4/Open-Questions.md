| OPEN QUESTIONS / DECISIONS TO CONFIRM BEFORE PRODUCTION |  |  |  |  |  |  |
|---|---|---|---|---|---|
| ID | Question | Default for 2-Day Build | Why It Matters | Decision Needed By | Impact | Status |
| Q01 | Which visual editor engine will be used? | Google Sites native page builder; optional Apps Script HTML interface only where a custom interaction is essential or equivalent mature editor | This is the key mechanism that makes the full builder achievable in 2 days. | 20-Sep 09:00 | High | Open |
| Q02 | Should standard users be able to create projects? | Configurable permission; admin can enable | Requirement says anyone with access can edit, but project creation is not explicitly restricted. | 20-Sep 09:00 | Medium | Open |
| Q03 | Who receives MOM emails? | Registered project participant emails | Need authoritative recipient source. | 21-Sep 11:30 | Medium | Open |
| Q04 | Should uploaded Excel be parsed into editable web tables? | File is displayed/downloaded; structured expense records are separately editable | Avoid corrupting authoritative Excel while still enabling calculations. | 20-Sep 15:00 | High | Open |
| Q05 | Exact ₹5,000 interpretation? | Configurable: threshold + requested extra ₹5,000 line item | Wording can produce different accounting outcomes. | 21-Sep 08:20 | High | Open |
| Q06 | Who can run custom JavaScript? | Admin only by default | Arbitrary JS is a major security boundary. | 21-Sep 15:00 | Critical | Open |
| Q07 | Should plugins be arbitrary third-party code? | Plugin registration API, admin-controlled; no untrusted third-party runtime | Security and production stability. | 21-Sep 17:10 | Critical | Open |
| Q08 | Published custom pages run on same domain or separate route/subdomain? | Same app domain with isolated page runtime | Determines routing and script isolation design. | 21-Sep 18:00 | High | Open |
| Q07 | Must the app remain at ₹0 additional cost beyond the existing Google AI Pro subscription? | Yes — hard constraint for this build | Determines storage, email, hosting and backend choices. | 20-Sep 10:00 | High | Resolved |