| REQUIRED TOOLS — GOOGLE AI STUDIO IMPLEMENTATION |  |  |  |  |  |  |  |
|---|---|---|---|---|---|---|---|
| Tool / Service | Role in this app | Required? | Recommended choice | Cost model for this project | Why / Boundary | Fallback | Configured |
| Google AI Studio | Primary AI-assisted app builder/coding environment | Yes | Google AI Studio + existing Google AI Pro | Existing subscription / target ₹0 additional | Primary implementation environment. Use persistent repo context, specs and verification. | Other AI coding agent |  |
| Google AI Pro | Existing user subscription | Already available | User's existing plan | Already paid by user; no new purchase | Provides expanded Google AI access/storage benefits relevant to the workflow. | N/A |  |
| Git + GitHub | Version control and recovery | Yes | Git + GitHub Free | ₹0 | Keep development history, branches and rollback points. | GitLab/Bitbucket free tier |  |
| Google Sites + Google Forms + Google Sheets + Google Drive + Google Apps Script | Application UI/runtime | Yes | Google Sites + Google Forms + Google Sheets + Google Drive + Google Apps Script | ₹0 / open source | Application and editor integration layer. | Equivalent frontend |  |
| Google Sites native page builder; optional Apps Script HTML interface only where a custom interaction is essential or equivalent | Full visual website builder | Yes | Google Sites native page builder; optional Apps Script HTML interface only where a custom interaction is essential open-source core | ₹0 / open source | Provides the editor foundation; do not hand-build the editor engine from zero. | Other open-source page-builder engine |  |
| Not required for Google Sites; standard HTML/CSS only for Apps Script web interfaces | Styling | Recommended | Not required for Google Sites; standard HTML/CSS only for Apps Script web interfaces | ₹0 / open source | Fast application UI styling. | Plain CSS |  |
| Not required | Reusable application UI components | Recommended | Not required | ₹0 / open source | Dashboard/forms/dialogs/tables. | Equivalent open-source UI library |  |
| Google Account / Gmail-based access and sharing | User identity and login | Yes | Google Account / Gmail-based access and sharing | ₹0 target for ~20 users | Internal company user authentication; avoid unnecessary paid authentication methods. | Google OAuth directly |  |
| Google Sheets | Structured application database | Yes | Google Sheets | ₹0 target for ~20 users / low volume | Projects, employees, expenses, salary, permissions, pages and metadata. | Other free Google-backed database option |  |
| Google Drive | Uploaded Excel/PDF/image/file storage | Yes | Google Drive API | Use existing Google storage; no new storage subscription | Avoid Google Drive so the app does not require Blaze just for file storage. | Local/deployment storage only for temporary artifacts |  |
| Google Apps Script MailApp/GmailApp where sufficient | MOM email delivery | Yes | Google Apps Script MailApp/GmailApp where sufficient | ₹0 target for low internal volume | Send updated MOM to registered project recipients; no Resend/SendGrid required initially. | Manual email fallback |  |
| XLSX / ExcelJS | Excel read/write/reporting | Yes | Open-source Not required for runtime library | ₹0 / open source | Read existing Excel files and generate/update reports where needed. | CSV parser |  |
| PDF library | PDF report generation | If required | pdf-lib / jsPDF or equivalent | ₹0 / open source | Generate downloadable reports without paid reporting SaaS. | HTML print/PDF |  |
| Hosting / deployment | Serve the application | Yes | Google AI Studio supported deployment / Google Sites / Apps Script free option | ₹0 target; stay within no-cost limits | Select a deployment route that does not require paid billing for this internal app. | Other free hosting |  |
| Paid visual-editor plugins | Optional editor extensions | No | Open-source/custom extensions only | ₹0 | Do not introduce paid plugins into the mandatory architecture. | Build required extension with open source APIs |  |
| Google Drive | Binary file storage | No | Do not use as mandatory storage | Avoid billing dependency | Use Google Drive instead so Google Drive/Blaze is not required. | Google Drive |  |
| Google Apps Script | Serverless backend functions | No | Do not make mandatory | Avoid billing dependency | Use the application's supported server-side runtime/backend instead. | Google AI Studio full-stack server runtime |  |
| Resend / SendGrid / Mailgun | Third-party transactional email | No | Do not use initially | ₹0 | Google Apps Script MailApp/GmailApp where sufficient is sufficient for the low-volume internal MOM workflow. | Google Apps Script MailApp/GmailApp where sufficient |  |
| Clerk | Third-party authentication | No | Do not use | ₹0 | Google Account / Gmail-based access and sharing is sufficient for ~20 internal users. | Google Account / Gmail-based access and sharing |  |
| Google Sheets + Prisma | Alternative relational DB stack | No | Do not use unless a concrete need appears | ₹0 by avoiding it | Google Sheets is simpler for the 2-day internal application. | Google Sheets |  |
| Not required | Real-time collaboration | No | Do not use for MVP | ₹0 | The requirement is multi-user access/editing, not simultaneous cursor-level collaborative editing. | Google Sheets updates |  |
| Not required; use Apps Script triggers | Background jobs | No | Do not use for MVP | ₹0 | MOM/report tasks can remain within the chosen backend/runtime for this low-volume system. | Server-side async operations |  |
| REVISED REQUIRED TOOLSET |  |  |  |  |  |  |  |
| Google Sites — portal/navigation/presentation |  |  |  |  |  |  |  |
| Google Sheets — structured operational data |  |  |  |  |  |  |  |
| Google Forms — employee/admin data entry |  |  |  |  |  |  |  |
| Google Drive — files and document storage |  |  |  |  |  |  |  |
| Google Apps Script — automation, calculations, email and controlled workflows |  |  |  |  |  |  |  |
| Google AI Pro / Google AI Studio — optional development/AI assistance using the user's existing subscription |  |  |  |  |  |  |  |
| Ordinary Gmail/Google Accounts — employee access; paid Workspace subscriptions are not a prerequisite |  |  |  |  |  |  |  |
| Explicitly excluded unless later proven necessary: Firebase billing, Cloud Run, paid databases, paid email APIs, third-party SaaS, paid hosting, employee Workspace subscriptions |  |  |  |  |  |  |  |