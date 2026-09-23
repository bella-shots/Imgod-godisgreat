| REVISED MASTER WEBSITE ARCHITECTURE — ₹0 ADDITIONAL COST / NORMAL GMAIL MODEL |  |
|---|---|
| Decision | Replace the custom Google Sites / Apps Script web interfaces/Google-native services (Sites, Sheets, Forms, Drive, Apps Script) application architecture with a Google-native internal portal architecture. |
| Existing paid resource | User already has Google AI Pro. This is treated as an existing resource, not a new project cost. |
| Employee accounts | Employees may use ordinary free personal Gmail/Google Accounts. No employee-by-employee paid Google Workspace subscription is required for the target implementation. |
| Target incremental software/service cost | ₹0 additional software/service spend, subject to the capabilities, storage/usage quotas and account/service limits of the Google services used. |
| Primary portal | Google Sites — navigation, pages, internal portal presentation and access-controlled entry point. |
| Data layer | Google Sheets — structured operational records such as projects, employees, expenses, claims, salary/admin records and investments. |
| Input layer | Google Forms — employee/admin submissions such as expense claims, OOP claims, project requests, MOM inputs and employee updates. |
| File layer | Google Drive — checklist Excel files, expense Excel files, proofs, project documents, MOM files and reports. |
| Automation layer | Google Apps Script — calculations, notifications, MOM email, record processing, file handling and controlled workflows. |
| AI/build layer | Google AI Pro / Google AI Studio may be used by the owner/developer to generate, refine and maintain Apps Script, HTML/CSS/JS embeds and documentation. AI Studio is not required to be the runtime host. |
| Sensitive-data principle | Do not expose authoritative salary, investment or full-finance Sheets to all employees. Employees interact through Forms or controlled interfaces; sensitive source Sheets remain restricted to admins. |
| Important platform boundary | Google Sites is the portal/presentation layer, not a full transactional database or arbitrary visual website-builder runtime. |
| Visual-builder tradeoff | The original advanced builder requirements are intentionally downgraded/removed: no requirement for arbitrary drag-anything layout, full custom JS plugin ecosystem, advanced breakpoint editor, reusable component engine, etc. |
| Project Excel handling | Ready-made Excel files remain in Drive and are linked/embedded from the project page. Where structured data is required, Apps Script/Sheets can optionally import or copy relevant data. |
| MOM workflow | MOM data is captured in Forms/Sheets/Docs as appropriate; Apps Script sends notification emails to selected recipients using the owner's authorized account, subject to Apps Script/Gmail quotas. |
| Employee access model | Use individual Gmail/Google Account sharing and Forms access. Do not make sensitive master Sheets broadly editable. |
| Scaling target | Initial target remains approximately 20 users, with design principles that can accommodate growth toward approximately 100 users, subject to Google service quotas and permission-management complexity. |
| What this architecture does NOT promise | It does not reproduce the original Google Sites / Apps Script web interfaces/Google-native services (Sites, Sheets, Forms, Drive, Apps Script) full visual website-builder feature set. The priority is meeting the business/operations objective simply and at ₹0 additional software/service cost. |
| Build principle | Prefer native Google services and the simplest maintainable workflow. Do not introduce Google-native services (Sites, Sheets, Forms, Drive, Apps Script) billing, paid databases, paid email APIs, or employee Workspace subscriptions unless a future requirement explicitly proves them necessary. |
|  |  |
| AUTHORITATIVE PHASE STRUCTURE |  |
| The project consists of exactly 5 phases: (1) Google Drive structure, (2) Master Google Site, (3) Google Sheets + Forms, (4) Apps Script automation, (5) Testing + permissions + handover. |  |