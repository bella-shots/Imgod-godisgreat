# Phase 2 — Live Google Site Correction Runbook
## Fix top-level navigation without rebuilding the system

**Live Site:** https://sites.google.com/view/imgodgodisgreat/home  
**Site editor:** https://sites.google.com/d/1sx5s9r1CNjz86ljbQgmbv_Dvu6vHj5oO/edit  
**Required top-level navigation:** HOME → PROJECTS → FINANCE → HR → REPORTS

## Important limitation

The current/new Google Sites product has no supported public write API for editing its page hierarchy/navigation. Google's Sites API only supports classic Sites, and the Apps Script Sites service was shut down on 2024-09-24. Do not write or run a script claiming it can directly edit the current Site's navigation. Sources:
- https://developers.google.com/workspace/sites
- https://developers.google.com/apps-script/guides/support/sunset
- https://developers.google.com/apps-script/release-notes

Therefore, the actual navigation fix must be made in the Google Sites editor by a Site editor/owner. This runbook gives the exact changes. It does not modify the Site automatically.

## A. Correct the navigation

1. Open the Site editor link above using the Google account that owns/edits the Site.
2. Open the **Pages** panel.
3. Ensure these five pages exist and are top-level: HOME, PROJECTS, FINANCE, HR, REPORTS.
4. Reorder these five top-level pages to exactly: **HOME, PROJECTS, FINANCE, HR, REPORTS**.
5. For each of the following pages shown in the published navigation screenshot, open its page's three-dot menu in the Pages panel and choose **Hide from navigation** (wording may vary). Do **not** delete the page or its underlying spreadsheet/form/file:
   - Lists_Config
   - Report_Index
   - HR_Admin
   - Investments
   - Salary_Admin
   - OOP_Claims
   - Employee_Spending
   - Budget_Given
   - Project_MOM_Index
6. If any other internal/admin/source-data page appears at the top level, hide it from navigation too, unless the approved Phase 2 page map explicitly requires it.
7. Keep internal pages only if an actual workflow needs them; link them from the relevant hub only when authorized and appropriate. Hiding a link is not access control. Restricted Sheets/Drive files must retain their own permissions.
8. Do not change, delete, move, or rename the source workbooks, Forms, Drive folders, Apps Script projects, or operational records as part of this navigation fix.

## B. Verify the five hub pages

Use the Phase 2 site blueprint as the source of truth:
https://github.com/bella-shots/Imgod-godisgreat/blob/main/Phase-2/Phase-2-Site-Blueprint.md

- **HOME:** welcome content, quick navigation to the four other hubs, company links/notices where approved.
- **PROJECTS:** project hub, access guidance, approved project resources, and a clear placeholder if dynamic project data is not available.
- **FINANCE:** controlled entry points for expense/OOP workflows and finance reports; do not embed unrestricted sensitive source data.
- **HR:** approved employee-information and HR-request entry points; do not expose confidential employee records.
- **REPORTS:** categories for Management, Project, Finance, and HR reports; do not invent report data.

Do not rebuild pages that already meet these requirements. Correct only missing/wrong content and preserve working links.

## C. Preview, publish, and verify

1. Preview desktop and mobile layouts.
2. Confirm the navigation has only these five top-level entries in the required order.
3. Click each hub and verify its content and links.
4. Publish the changes.
5. Open the published Site in a separate tab (and, if possible, with an ordinary employee account).
6. Verify the same five-entry navigation is visible on the published Site.
7. Separately verify that an ordinary employee cannot access restricted Salary, Investments, Finance or HR source files. Do not treat hidden navigation as security.
8. Capture screenshots of the published navigation and each hub page as evidence.

## D. Completion record

Mark the navigation defect fixed only after the published Site has been inspected and the expected navigation is visible. Record the date, editor account/role (not credentials), screenshots/evidence location, and any remaining failures in the Phase 2 Google AI Reply-Report / ChatGPT Feedback workflow. Until then, mark it **HUMAN ACTION REQUIRED / NOT VERIFIED**.