| PHASE 1 — GOOGLE DRIVE STRUCTURE |  |
|---|---|
| Purpose | Create the authoritative Google Drive foundation before building the Site, Sheets, Forms or Apps Script. |
| Phase boundary | Phase 1 is only the Drive/file foundation. Do not start the Master Site, operational Sheets, Forms or automation as Phase 1 work. |
| Cost rule | Use the existing Google account/resources. Do not introduce a paid storage provider, third-party file service or employee Workspace subscription. |
| Employee identity rule | Employees may use normal Gmail/Google Accounts. They do not need paid Workspace subscriptions for the target architecture. |
| Owner/admin rule | The owner/admin account is the authoritative owner of the MASTER COMPANY structure. Avoid making individual employees owners of core folders/files unless deliberately required. |
| Root folder | MASTER COMPANY |
| Required top-level folders | Projects; Finance; HR; Templates; MOM; Reports |
| Folder hierarchy | MASTER COMPANY / Projects / [Project Name] / ... |
| Project folder purpose | Each project gets one dedicated folder containing its project-specific files, ready-made checklist Excel, expense Excel, MOM material, notes and other project documents. |
| Finance folder purpose | Finance-controlled documents, expense source files, reports and finance-related artifacts. Sensitive source data must not be broadly shared. |
| HR folder purpose | Employee/HR documents and controlled HR records. Sensitive employee data must remain restricted. |
| Templates folder purpose | Reusable templates for project setup, checklists, expenses, MOMs, reports and other standard documents. |
| MOM folder purpose | Published and/or archived MOM documents and related artifacts, organized consistently. |
| Reports folder purpose | Generated management reports and approved report outputs. |
| Required naming convention | Use stable, human-readable names. Recommended project folder format: PROJECT_<ProjectName>. Use consistent subfolder/file naming so Apps Script can locate assets deterministically. |
| Recommended project subfolders | 01_Admin; 02_Checklist; 03_Expenses; 04_MOM; 05_Notes; 06_Files; 07_Reports |
| Access principle | Do not give all employees Editor access to MASTER COMPANY. Access should be granted to the minimum folders/files needed for their role or project. |
| Sensitive access | Finance, HR and any salary/investment source material should be restricted to authorized admins. Employee access should normally happen through Forms, controlled Site pages or controlled Apps Script workflows. |
| Project access | Project members may receive access to their project's permitted folder/files. Project-specific sharing must not automatically expose Finance/HR/salary/investment data. |
| Template access | Templates can be shared as View/Copy sources where practical. Keep master templates protected from accidental editing. |
| Drive sharing principle | Use individual Gmail/Google Accounts for restricted sharing where needed. Avoid public links for confidential material. |
| Phase 1 does not include | Creating the Site; building operational Sheets; creating Forms; writing Apps Script; implementing calculations; sending automated emails. |
| Phase 1 completion gate | PASS only when the complete folder hierarchy exists, access rules are applied, naming conventions are documented, required templates/folder placeholders are present, and a test user cannot access restricted material. |