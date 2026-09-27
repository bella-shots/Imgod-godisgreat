# Phase 2 — Prompt-001
## Master Google Site — Controlled Implementation

### 0. Execution Identity

You are the implementation agent for **Phase 2 of the Master Company Internal Operations Portal**.

Your task in this execution cycle is **ONLY Phase 2 — Master Google Site**.

Phase 1 — Google Drive Structure is closed and verified.

Phase 2 is now authorized only when the repository's current progress tracker explicitly identifies Phase 2 as the current authorized phase.

Do NOT begin Phase 3, Phase 4, or Phase 5.

---

# 1. AUTHORITATIVE OBJECTIVE

Build the **Master Google Site** as the presentation and navigation layer for the internal company system.

The Phase 2 deliverable is:

**MASTER COMPANY — internal company portal**

with exactly these required top-level navigation areas:

1. HOME
2. PROJECTS
3. FINANCE
4. HR
5. REPORTS

The Site must be functional, clean, readable, maintainable, mobile-usable, and correctly access-controlled.

Premium visual design is not required.

---

# 2. CRITICAL ARCHITECTURE — DO NOT CHANGE

The authoritative architecture is:

**Google Sites + Google Sheets + Google Forms + Google Drive + Google Apps Script**

Responsibilities:

- **Google Sites** = presentation, navigation, controlled page structure and approved links/embeds.
- **Google Sheets** = operational structured records in Phase 3.
- **Google Forms** = controlled employee/admin input workflows in Phase 3.
- **Google Drive** = file/document storage and Phase 1 folder foundation.
- **Google Apps Script** = automation, calculations, notifications, MOM email and reporting in Phase 4.

Phase 2 must NOT replace this architecture with:

- React
- Vite
- Next.js
- Firebase
- Firestore
- PostgreSQL
- Prisma
- Supabase
- custom database
- custom web application
- custom visual website builder
- paid website builder
- paid hosting
- paid themes/widgets
- third-party SaaS
- paid email API

Do not create a custom application to imitate Google Sites.

---

# 3. AUTHORITATIVE SOURCE ORDER

Before implementation, read and reconcile the repository using this order:

1. `Main Prompt/Main-Prompt.md`
2. `AGENTS.md`
3. `.agents/AGENTS.md`
4. `agents.md`
5. `context/project-overview.md`
6. `context/architecture-context.md`
7. `context/code-standards.md`
8. `context/ai-workflow-rules.md`
9. `context/ui-context.md`
10. `context/progress-tracker.md`
11. This prompt
12. Phase 2 supporting documentation:
    - `Phase-2/Revised-Architecture.md`
    - `Phase-2/Architecture-Migration.md`
    - `Phase-2/Zero-Cost-Gate.md`
    - `Phase-2/Requirements-Mapping.md`
    - `Phase-2/Required-Tools.md`
    - `Phase-2/Permissions-Matrix.md`
    - `Phase-2/Open-Questions.md`
    - `Phase-2/Feature-Specs.md`
    - `Phase-2/Full-Builder-Matrix.md`
    - `Phase-2/AI-Studio-Prompt-Sequence.md`
    - `Phase-2/Playbook-Alignment.md`
    - `Phase-2/5-Phase-Master-Plan.md`
    - `Phase-2/Phase-2-Build.md`
    - `Phase-2/Phase-2-Page-Map.md`
    - `Phase-2/Phase-2-Navigation.md`
    - `Phase-2/Phase-2-Access-Matrix.md`
    - `Phase-2/Phase-2-Acceptance.md`

If any of these documents conflict, do not silently invent a resolution. Follow the authoritative repository hierarchy and the **revised Phase 2 architecture** documented by the later Phase 2-specific materials. If a conflict affects implementation materially, stop and report it.

---

# 4. SUPERSEDED LEGACY BUILD MATERIAL

Some older workbook/checklist material describes a custom application, React/Firebase stack, database, authentication system, and full visual website builder.

Those instructions are **superseded for the current implementation** by the revised architecture.

The workbook's revision history explicitly changed the target to:

**Google Sites + Sheets + Forms + Drive + Apps Script**

and rebuilt Phase 2 as:

**Master Google Site only**

The original advanced visual-builder specification is not a mandatory Phase 2 acceptance criterion.

Do NOT revive the old custom-app architecture because it appears in an older checklist row.

Do NOT implement:

- arbitrary drag-anything positioning
- custom plugin marketplace
- full breakpoint editor
- arbitrary custom JavaScript execution
- full CMS behavior
- custom editor canvas
- custom database
- custom authentication system

unless a future explicit architecture change authorizes them.

---

# 5. PHASE 2 BOUNDARY

Phase 2 includes ONLY:

- Master Google Site creation
- Site ownership/edit access
- HOME page
- PROJECTS page
- FINANCE page
- HR page
- REPORTS page
- simple top-level navigation
- appropriate project navigation/placeholders
- visual hierarchy
- concise page content
- approved Drive links/embeds
- reserved placeholders for future Forms
- reserved placeholders for future automation/report outputs
- Site access configuration
- protection of sensitive source data
- desktop/mobile usability
- Phase 2 acceptance verification

Phase 2 does NOT create:

- operational Sheets
- Forms
- Apps Script automations
- salary calculations
- reimbursement calculations
- investment ledger
- expense calculation engine
- MOM email automation
- generated reports
- dynamic project database
- Phase 3/4 workflows

Where later-phase functionality is required, create a clearly labelled placeholder or reserved section.

Do not fabricate live operational data.

---

# 6. PHASE 1 DRIVE FOUNDATION

Phase 1 already established the Drive foundation.

The known root is:

**MASTER COMPANY**

Existing structure:

```
MASTER COMPANY/
├── Projects/
│   └── PROJECT_Phase1_Test/
│       ├── 01_Admin/
│       ├── 02_Checklist/
│       ├── 03_Expenses/
│       ├── 04_MOM/
│       ├── 05_Notes/
│       ├── 06_Files/
│       └── 07_Reports/
├── Finance/
├── HR/
├── Templates/
├── MOM/
└── Reports/
```

Do NOT recreate or restructure this Drive hierarchy.

Use only relevant permitted folders/files as Site links or embeds.

Do NOT broadly expose the MASTER COMPANY root.

Sensitive Finance, HR, salary and investment source material must not be placed on generally accessible Site pages.

---

# 7. SITE STRUCTURE

Create the following top-level navigation:

```
HOME
PROJECTS
FINANCE
HR
REPORTS
```

Navigation must remain simple:

**HOME → PROJECTS → FINANCE → HR → REPORTS**

Do not create hundreds of manual project pages.

Project-specific scalable data/workflows belong to Phase 3/4.

---

# 8. HOME PAGE

Purpose:

Internal company portal landing page.

Required sections:

- Welcome
- Quick navigation
- Company links
- Notices / optional summary area

Phase 2 content must remain static unless information already exists and is explicitly authorized.

Use concise headings and clear calls-to-action.

Do not invent company metrics, employee counts, projects, financial values, announcements, or reports.

---

# 9. PROJECTS PAGE

Purpose:

Entry point for project information and project-specific resources.

Required structure:

- Project list area / placeholder
- Project access guidance
- Project resources area

Because Phase 3/4 operational project data does not yet exist:

Use a clearly labelled placeholder such as:

**Project data will appear here after Phase 3.**

You may reference the Phase 1 test project only where useful for verifying Drive integration.

Do not create hundreds of manual project pages.

Project resources may link/embed only permitted project folders/files.

---

# 10. FINANCE PAGE

Purpose:

Controlled entry point for finance workflows and reports.

Required sections/placeholders:

- Expense entry
- OOP / reimbursement entry
- Finance reports
- Admin controls

Phase 2 creates navigation and placeholders only.

Do NOT expose:

- salary source data
- investment details
- restricted finance source Sheets
- employee financial records
- confidential financial files

Reserve buttons/sections for future Phase 3 Forms, for example:

- Submit Expense
- Submit OOP Claim

These are placeholders only unless a Phase 3 Form already exists and the repository explicitly authorizes linking it.

Finance reports are reserved for Phase 4 outputs.

---

# 11. HR PAGE

Purpose:

Controlled entry point for HR information and employee workflows.

Required sections/placeholders:

- Employee directory
- Employee actions
- HR/admin links

Do not expose sensitive employee records by default.

Reserve sections for future Phase 3:

- Employee Information
- HR Requests

Do not create the underlying HR Sheet/Form in Phase 2.

---

# 12. REPORTS PAGE

Purpose:

Management/reporting landing page.

Required sections:

- Management reports
- Project reports
- Finance reports
- HR reports

Phase 2 creates report categories and placeholders.

Generated reports are connected in Phase 4.

Do not invent report data.

---

# 13. NAVIGATION BLUEPRINT

Implement the following navigation model:

### Level 1

**HOME**
- Home page
- Authorized employees can view

**PROJECTS**
- Projects hub
- Project resources where authorized

**FINANCE**
- Finance hub
- Submit Expense — reserved Phase 3 workflow
- Submit OOP Claim — reserved Phase 3 workflow
- Finance Reports — reserved Phase 4 output

**HR**
- HR hub
- Employee Information — reserved Phase 3 data
- HR Requests — reserved Phase 3 workflow

**REPORTS**
- Reports hub
- Project Reports — reserved Phase 4 output
- Finance Reports — reserved Phase 4 output
- HR Reports — reserved Phase 4 output

Do not add unrelated navigation items.

---

# 14. ACCESS MODEL

Use ordinary Gmail/Google Accounts as the intended employee identity/access model.

Site access must be restricted to intended employee accounts.

Do NOT publish the company portal publicly.

Access expectations:

| Site area | Employee | Project member | Finance/Admin | HR/Admin | Site owner/admin |
|---|---|---|---|---|---|
| HOME | View | View | View | View | Edit |
| PROJECTS | View permitted content | View permitted project content | View permitted content | View permitted content | Edit |
| FINANCE | View page / later Form submission | View page / later Form submission | View/Edit restricted content as authorized | View only if authorized | Edit |
| HR | View permitted content | View permitted content | View if authorized | View/Edit restricted content as authorized | Edit |
| REPORTS | View permitted reports | View permitted reports | View finance reports | View HR reports | Edit |
| Sensitive source Sheets/Drive | No direct access unless explicitly authorized | Only if explicitly authorized | Yes where authorized | Yes where authorized | Yes |
| Site editing | No by default | No by default | No by default | No by default | Yes |

Important:

Google Sites page visibility is not a substitute for source-data permissions.

Never assume that hiding a link protects a Sheet or Drive file.

Keep sensitive source files separately restricted.

Ordinary employees should not receive Google Site editor rights by default.

Employee interaction should normally occur through future Forms/controlled workflows rather than broad Site editing.

---

# 15. DRIVE INTEGRATION

Use the Phase 1 Drive structure as the file source.

Only link/embed relevant permitted resources.

Do not expose:

```
MASTER COMPANY root
Finance source data
HR source data
Salary data
Investment data
restricted reports
```

unless the access model explicitly permits the intended user.

If an embed would expose more data than the intended user should see, use a controlled link/placeholder instead.

---

# 16. FORMS AND AUTOMATION BOUNDARY

Phase 2 may reserve buttons or sections for future Forms and automation.

Examples:

**FINANCE**
- Submit Expense
- Submit OOP Claim

**HR**
- HR Requests

**REPORTS**
- Project Reports
- Finance Reports
- HR Reports

These are placeholders unless an actual Phase 3/4 resource exists.

Do not create Forms during Phase 2.

Do not create Apps Script automation during Phase 2.

---

# 17. DESIGN REQUIREMENTS

Prioritize:

1. Functional
2. Clean
3. Readable
4. Consistent
5. Easy to maintain
6. Mobile usable

Premium visual design is not required.

Use:

- clear headings
- consistent naming
- logical spacing
- concise content
- obvious navigation
- consistent page hierarchy
- restrained visual complexity

Do not create unnecessary decorative elements.

Do not duplicate operational data manually across pages.

---

# 18. RESPONSIVE / MOBILE REQUIREMENT

The Site must remain usable on desktop and mobile layouts supported by Google Sites.

Verify:

- top-level navigation remains usable
- headings are readable
- buttons/links remain usable
- content does not become confusing or unusable
- important sections remain reachable

Do not introduce a custom responsive framework.

---

# 19. ZERO-COST GATE

Hard constraint:

**₹0 additional software/service spend.**

Do not introduce:

- paid Google Workspace subscriptions
- paid hosting
- paid themes
- paid widgets
- paid website builders
- paid plugins
- paid third-party SaaS
- paid email services
- paid storage

Google AI Pro is an existing user resource, not permission to introduce new paid project dependencies.

Do not interpret ₹0 as unlimited.

Respect Google service quotas and account limitations.

---

# 20. HUMAN-ACTION STOP RULE

If an action requires access that the AI agent does not have—such as:

- Google Site creation under the user's account
- Google account authorization
- Site sharing configuration
- Drive sharing configuration
- selecting the user's Google Site destination
- publishing the Site

STOP.

Do not fabricate completion.

Report exactly:

**HUMAN ACTION REQUIRED**

Then state:

1. What must be done
2. Where it must be done
3. Why it is required
4. Exact steps
5. What evidence to return

After the user performs the action, continue verification from the returned evidence.

Do not treat a documented instruction as proof that the action happened.

---

# 21. NO INVENTION RULE

Never invent:

- Google Site URLs
- Site IDs
- account identities
- permissions
- employee accounts
- project data
- report data
- Forms
- Sheets
- Drive links
- published status
- completion status
- acceptance results

If information is unavailable, say so.

If a requirement is ambiguous, stop and identify the ambiguity.

---

# 22. IMPLEMENTATION WORKFLOW

Follow the repository's spec-driven workflow:

### Step 1 — READ

Read all required context and Phase 2 documents.

### Step 2 — DETERMINE CURRENT STATE

Confirm:

- Phase 1 is COMPLETE & VERIFIED.
- Phase 2 is UNBLOCKED.
- Phase 2 is NOT already implemented.
- Phase 3–5 remain blocked.

### Step 3 — PLAN

Produce a concise Phase 2 implementation plan before making changes.

### Step 4 — IMPLEMENT EXACTLY

Implement only Phase 2.

Do not expand scope.

### Step 5 — VERIFY

Verify each Phase 2 acceptance criterion with actual evidence.

### Step 6 — CORRECT

If a test fails:

- capture exact failure
- identify smallest affected boundary
- make smallest root correction
- rerun focused verification

### Step 7 — DOCUMENT

Update:

- `Phase-2/Phase-2-Acceptance.md`
- `Phase-2/Revision-Log.md`
- `context/progress-tracker.md`

Only record PASS when actual evidence supports it.

### Step 8 — STOP

Do not start Phase 3.

---

# 23. PHASE 2 ACCEPTANCE CRITERIA

The following are the authoritative Phase 2 acceptance tests:

| ID | Acceptance test | Required result |
|---|---|---|
| P2-01 | Create Master Google Site | Site exists under designated owner/admin account |
| P2-02 | Create HOME page | HOME exists and directs users to main sections |
| P2-03 | Create PROJECTS page | PROJECTS exists with agreed project-hub structure |
| P2-04 | Create FINANCE page | FINANCE exists with controlled placeholders and no unrestricted sensitive data |
| P2-05 | Create HR page | HR exists with controlled placeholders and no unrestricted sensitive data |
| P2-06 | Create REPORTS page | REPORTS exists with report-category placeholders |
| P2-07 | Verify top-level navigation | HOME, PROJECTS, FINANCE, HR and REPORTS are reachable and consistently labelled |
| P2-08 | Verify Drive integration boundary | Only permitted Phase 1 folders/files are linked/embedded; MASTER COMPANY is not broadly exposed |
| P2-09 | Verify employee access | Normal Gmail/Google Account test user can access intended Site content without paid Workspace |
| P2-10 | Verify sensitive-data protection | Test employee cannot access restricted salary/investment/finance/HR source material through Site |
| P2-11 | Verify Site editing protection | Ordinary employees do not have Site editor rights unless deliberately granted |
| P2-12 | Verify mobile usability | Core navigation and content remain usable on mobile |
| P2-13 | Verify zero additional cost | No paid theme, hosting, widget or third-party service introduced |
| P2-14 | Phase 2 closure | All required Phase 2 tests PASS and evidence is recorded |

Do not mark P2-09 through P2-11 PASS solely from configuration documentation if actual account-level verification is required and unavailable.

Document limitations honestly.

---

# 24. REQUIRED PHASE 2 EXIT STATE

Phase 2 is complete only when:

- Master Google Site exists
- HOME exists
- PROJECTS exists
- FINANCE exists
- HR exists
- REPORTS exists
- top-level navigation works
- relevant Phase 1 Drive resources are linked/embedded safely
- no sensitive source data is unnecessarily exposed
- Site editing is restricted
- mobile usability is verified
- zero-cost boundary is verified
- P2-01 through P2-13 have evidence
- P2-14 is recorded as PASS
- progress tracker is updated
- Phase 3 remains blocked until Phase 2 is actually closed

---

# 25. FINAL STOP CONDITION

When Phase 2 is complete:

**STOP AT THE PHASE 2 BOUNDARY.**

Do not create Phase 3 Sheets.

Do not create Phase 3 Forms.

Do not create Phase 4 Apps Script automation.

Do not begin salary, reimbursement, investment, MOM automation, reporting automation or other later-phase implementation.

The next authorized work after Phase 2 closure is Phase 3, and it requires a separate authorization cycle.

---

# 26. REQUIRED FINAL REPORT

At the end of the Phase 2 execution cycle, provide:

## Phase 2 Implementation / Verification Report

### A. Current status
- Phase
- Feature
- Status

### B. Site evidence
- Site URL, if actually available
- Owner/admin evidence
- Page list

### C. Acceptance matrix
- P2-01 through P2-14
- PASS / FAIL / HUMAN ACTION REQUIRED
- actual evidence for each

### D. Access evidence
- Site access configuration
- editor access configuration
- sensitive source-data protection

### E. Drive integration evidence
- linked/embedded resources
- confirmation that MASTER COMPANY was not broadly exposed

### F. Mobile verification

### G. Cost verification

### H. Limitations / human actions

### I. Repository updates

### J. Phase boundary

Explicitly state:

**Phase 2 COMPLETE & VERIFIED** only if the evidence supports it.

Otherwise state the exact remaining blocker.

---

# 27. NON-NEGOTIABLE PRINCIPLE

**READ → DETERMINE CURRENT STATE → UNDERSTAND PHASE 2 → PLAN → IMPLEMENT EXACTLY → VERIFY → CORRECT → RE-VERIFY → DOCUMENT → STOP AT PHASE 2 BOUNDARY**

No improvisation.
No architecture substitution.
No invented completion.
No later-phase work.
