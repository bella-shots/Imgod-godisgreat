| GOOGLE AI STUDIO — EXECUTION PROMPT SEQUENCE |  |  |  |  |  |
|---|---|---|---|---|---|
| Prompt # | When to use | Prompt objective | Required input/context | Expected AI Studio behavior | Done condition |
| P01 | Start of project | Create architecture and context before coding | User requirements + playbook | Produce project-overview, architecture-context, code-standards, ai-workflow-rules, ui-context, progress-tracker, agents.md | Files created and internally consistent |
| P02 | Before foundation | Initialize clean application | P01 files | Create app, env, lint/type/build, Git; no feature implementation | Clean build |
| P03 | Before each feature | Implement one feature unit | Relevant context + feature spec | Plan first, implement exact scope, verify, update tracker | Feature verification passes |
| P04 | When builder starts | Integrate mature visual editor | F01/F02 + builder matrix | Install/configure editor engine; do not recreate editor internals | Core drag/select/move/resize works |
| P05 | When a defect appears | Focused correction | Exact error + affected feature spec | Inspect boundary/docs, make smallest root fix, rerun tests | Defect fixed, no unrelated changes |
| P06 | Security pass | Audit custom JS and authorization | Permissions + builder runtime design | Test direct API calls, storage access, script isolation and XSS boundaries | No critical security issue |
| P07 | Production | Deploy and verify | Production env config | Build, deploy, inspect logs, smoke test | Production critical flows pass |
| P06 | Before backend/storage setup | Enforce zero-additional-cost architecture | Read Required Tools + architecture context + 20-user scale | Use Google Sheets/Auth, Google Drive, Google Apps Script MailApp/GmailApp where sufficient, open-source libraries and a no-billing deployment route where supported. Do not introduce Google Drive, Google Apps Script, Not required; use Apps Script email services within quotas, paid editor plugins or other paid SaaS without explicit approval. | Dependency scan and configuration show no mandatory paid service. |
| REVISED AI BUILD INSTRUCTION |  |  |  |  |  |
| Do not generate a React/Firebase application unless explicitly requested later. |  |  |  |  |  |
| Generate Google Apps Script, Google Forms/Sheets structures, Drive folder structure, and Google Sites embedding/navigation instructions. |  |  |  |  |  |
| Treat ordinary Gmail/Google Accounts as the employee identity/access model. |  |  |  |  |  |
| Treat ₹0 additional software/service spend as a hard constraint. |  |  |  |  |  |
| Do not introduce paid Workspace subscriptions, Firebase billing, Cloud Run, paid databases, paid email APIs or third-party SaaS as hidden dependencies. |  |  |  |  |  |