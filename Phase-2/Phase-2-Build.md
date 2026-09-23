| PHASE 2 — MASTER GOOGLE SITE |  |
|---|---|
| Purpose | Build the Master Google Site as the presentation/navigation layer for the internal company system. |
| Phase boundary | Phase 2 builds the Site structure, pages, navigation, visual hierarchy, access approach and placeholders. It does not create the operational Sheets/Forms or Apps Script automation; those belong to Phases 3 and 4. |
| Primary site | MASTER COMPANY — internal company portal. |
| Required top-level navigation | HOME; PROJECTS; FINANCE; HR; REPORTS |
| Home purpose | Company landing page with clear navigation to the five major areas and a simple internal-portal layout. |
| Projects purpose | Entry point for project information and project-specific resources. Phase 2 creates the page structure; project records and dynamic data are added in Phase 3/4. |
| Finance purpose | Controlled entry point for finance workflows and reports. Do not embed unrestricted sensitive source Sheets. |
| HR purpose | Controlled entry point for HR information and employee workflows. Do not expose sensitive employee records by default. |
| Reports purpose | Management/reporting landing page. Phase 2 creates the structure; generated reports are connected in later phases. |
| Navigation rule | Top-level navigation must remain simple: HOME → PROJECTS → FINANCE → HR → REPORTS. |
| Project navigation | Use nested project pages only where appropriate. Avoid creating hundreds of manual pages; Phase 3/4 should handle scalable project data/workflows. |
| Design priority | Functional, clean, readable and easy to maintain. Premium visual design is not a requirement. |
| Responsive requirement | Site must remain usable on desktop and mobile layouts supported by Google Sites. |
| Content rule | Use concise headings, clear calls-to-action and consistent naming. Do not duplicate operational data manually in multiple pages. |
| Phase 2 placeholders | Where Phase 3/4 content does not yet exist, place clearly labelled placeholders such as 'Project data will appear here after Phase 3' rather than inventing data. |
| Drive integration | Use the Phase 1 Drive structure as the file source. Link/embed only the relevant folders/files; do not expose MASTER COMPANY broadly. |
| Forms integration | Phase 2 may reserve sections/buttons for future Forms workflows, but actual Forms are created in Phase 3. |
| Automation integration | Phase 2 may reserve sections/buttons for future automated reports/MOM notifications, but automation is Phase 4. |
| Access model | Use restricted site sharing for the intended employee Google Accounts. Do not publish confidential company information publicly. |
| Sensitive information | Salary, investments and unrestricted Finance/HR source data must not be placed directly on generally accessible Site pages. |
| Admin area | If an admin-only area is needed, keep it restricted and avoid assuming Google Sites alone provides record-level RBAC. |
| Site ownership | Keep site ownership/edit rights with the designated administrator(s). Ordinary employees should not automatically receive site editing rights. |
| Employee editing | Employee interaction should normally happen through Forms or controlled workflows, not by giving broad Google Site editor access. |
| Zero additional cost | Do not introduce paid themes, third-party widgets, paid hosting or paid website builders. |
| Advanced builder exclusions | No requirement for arbitrary drag-anything positioning, custom plugin marketplace, full breakpoint editor, reusable component engine, arbitrary custom JavaScript execution or full CMS behavior. |
| Phase 2 exit condition | Site is structurally complete, navigation works, required pages exist, access is correctly configured, and all Phase 2 acceptance tests PASS. |