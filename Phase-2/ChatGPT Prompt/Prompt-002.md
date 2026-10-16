# Phase 2 — Prompt-002
## Correct Published Google Site Navigation and Page Structure

### Execution identity
This is a **new defect-correction cycle** for Phase 2. Preserve Prompt-001 and all earlier reports/feedback. Do not overwrite prior cycle files.

### Reported live defect
The administrator shared a screenshot of the published Site at:
`https://sites.google.com/view/imgodgodisgreat/lists_config`

The screenshot shows a page titled `Lists_Config`, apparently blank, and top navigation containing internal data/workbook pages such as `Lists_Config`, `Report_Index`, `HR_Admin`, `Investments`, `Salary_Admin`, `OOP_Claims`, `Employee_Spending`, `Budget_Given`, and `Project_MOM_Index`.

This conflicts with the Phase 2 specification, which requires exactly these five top-level areas, in this order:
1. HOME
2. PROJECTS
3. FINANCE
4. HR
5. REPORTS

The screenshot is evidence of a discrepancy, not proof that source workbooks, Forms, Apps Script or their permissions are broken.

### Mandatory source files
Read the current repository instructions and Phase 2 materials before acting:
- `Main Prompt/Main-Prompt.md`
- `agents.md`, `.agents/AGENTS.md`
- `context/project-overview.md`
- `context/architecture-context.md`
- `context/code-standards.md`
- `context/ai-workflow-rules.md`
- `context/ui-context.md`
- `context/progress-tracker.md`
- `Phase-2/Phase-2-Build.md`
- `Phase-2/Phase-2-Navigation.md`
- `Phase-2/Phase-2-Page-Map.md`
- `Phase-2/Phase-2-Site-Blueprint.md`
- `Phase-2/Phase-2-Acceptance.md`
- `Phase-2/Phase-2-Access-Matrix.md`
- `Phase-2/Permissions-Matrix.md`
- `Phase-2/Instructions.md`
- `Phase-2/Required-Tools.md`

Treat the revised Google-native architecture as authoritative:
**Google Sites + Google Sheets + Google Forms + Google Drive + Google Apps Script.**
No React/Vite/Firebase/custom web app, paid service, or new database.

### Required correction
1. Inspect the available supported Google Sites APIs and the existing repository code/integrations. Verify capability from current official documentation rather than assuming a legacy API works.
2. Determine whether the published Google Sites page/navigation can actually be edited programmatically with an officially supported API in this project/account.
3. Do **not** use the retired legacy Apps Script `Sites` service or invent unsupported methods/endpoints. Do not use browser automation, undocumented endpoints, scraping, or brittle DOM manipulation as a production fix.
4. If a supported API can make the required Site changes, implement the smallest safe, idempotent fix in the correct existing code location. It must:
   - preserve the existing Site and its ownership;
   - keep exactly HOME → PROJECTS → FINANCE → HR → REPORTS as top-level navigation;
   - move/remove internal source/workbook pages from top-level navigation without deleting the underlying Sheets, Forms, Drive files, or operational records;
   - preserve relevant page content and approved links;
   - avoid exposing restricted salary, investment, finance or HR source data;
   - provide dry-run/audit output before changes, where supported;
   - log what was changed and fail safely if a target page cannot be identified.
5. If no supported write API exists for the current Google Sites product, **do not fabricate a script that claims to fix the live Site**. Instead, produce a precise human-action procedure for the Google Sites editor with:
   - the exact five top-level navigation labels and order;
   - which internal pages must be removed from the navigation (not deleted from Drive/Sheets);
   - which content should remain linked from the relevant hub page, subject to permissions;
   - required HOME/PROJECTS/FINANCE/HR/REPORTS page structure from the Site Blueprint;
   - preview/publish steps;
   - post-publish verification steps.
   If useful, provide an audit/checklist helper only if it uses supported services and clearly state that it cannot change the Site itself.
6. Do not change workbook schemas, Forms, business records, Apps Script automations, or Drive hierarchy to solve a navigation/page-layout defect.
7. Re-test the live Site after any supported fix. Do not mark tests PASS based only on code generation or claims. If live access or a human-only edit is required, mark the item HUMAN ACTION REQUIRED / BLOCKED and give exact instructions.

### Acceptance checks
- Top-level navigation is exactly HOME, PROJECTS, FINANCE, HR, REPORTS in that order.
- HOME has welcome content, quick navigation and notices/summary area.
- PROJECTS is a project hub with approved project resources and clear placeholder text where dynamic data is unavailable.
- FINANCE has controlled workflow/report entry points and does not expose restricted source data.
- HR has approved employee/HR entry points and does not expose confidential records.
- REPORTS has Management, Project, Finance and HR report categories.
- No internal workbook/admin/source page such as Lists_Config, HR_Admin, Salary_Admin, Investments, Employee_Spending, Budget_Given, or Project_MOM_Index appears as top-level employee navigation unless a specific approved requirement authorizes it.
- Site source data and file permissions remain unchanged.
- Desktop/mobile preview remains usable.
- Published result is inspected and evidence is recorded.

### Required deliverables
Create a truthful `Report-002.md` in `Phase-2/Google AI Reply-Report/` after execution. Record:
- official API capability findings and source URLs;
- files changed and why;
- whether a code-based live fix was possible;
- tests actually performed and evidence;
- exact human action required, if any;
- residual risks and next action.

Do not claim the published Site was fixed unless it was actually modified and verified. Preserve the audit trail. Stop only after completion or a genuine human-only action is required.
