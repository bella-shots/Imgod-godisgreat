# PHASE 3 — RUNNING CHANGE PROMPT 004

## Change type
**Controlled specification correction before continued human instantiation.**

Prompt-001, Prompt-002 and Prompt-003 remain historical. This is the current authoritative Phase 3 running-change prompt.

## R19 — Remove Lists_Config and use local validation

### Problem being corrected
The previous Phase 3 design introduced `Lists_Config` in `MASTER_COMPANY_OPERATIONS` as a canonical validation configuration tab while also prohibiting assumptions that Finance and HR could natively reference that cross-workbook range.

That creates unnecessary configuration indirection and a cross-workbook dependency that native Google Sheets validation cannot reliably satisfy without Phase 4 synchronization.

### Authoritative correction

**Remove `Lists_Config` from the Phase 3 data model.**

Do not create or retain `Lists_Config` as an authoritative/support tab.

Controlled values must instead be defined as **local native Google Sheets validation rules** in the workbook/tab where they are used.

Approved controlled values remain:

- Project Status: `Draft`, `Active`, `On Hold`, `Completed`, `Cancelled`
- Employee Roles: `Administrator`, `Finance Admin`, `HR Admin`, `Project Lead`, `Team Member`, `Contractor`
- Project Roles: `Lead`, `Core Contributor`, `Reviewer`, `Observer`
- Access Levels: `Viewer`, `Editor`, `Admin`
- Employment Status: `Probation`, `Full-Time`, `Notice Period`, `Relieved`
- Reimbursement Settings: `Standard`, `Executive`, `Contractor-Direct`
- Finance Status: `Submitted`, `Approved`, `Rejected`, `Reimbursed`, `Partially Reconciled`
- Report Types: `Executive Summary`, `Project Status`, `Finance Audit`, `HR Rollup`

If the same controlled values are needed in multiple workbooks, repeat the approved literal values locally. This is configuration, not a second authoritative business record.

### Correct physical model

Authoritative/support tabs:

**Operations — 4**
- Projects
- Project_Members
- Project_Notes
- Project_MOM_Index

**Finance — 5**
- Budget_Given
- Employee_Spending
- OOP_Claims
- Salary_Admin
- Investments

**HR/Admin — 4**
- Employees
- HR_Admin
- Report_Index
- Submission_Index

Total:
**13 authoritative/support tabs + 8 native Form response tabs = 21 physical tabs.**

## Existing R18 rule remains

`Employees` remains the single authoritative employee + HR master record.

`HR_Admin` remains the HR request/governance workflow table and must not duplicate employee profile attributes.

## Scope firewall

Do not:
- change the 3-workbook partitioning;
- add a replacement configuration tab;
- create cross-workbook validation synchronization;
- implement Apps Script;
- implement triggers or automation;
- change the ₹5,000 OOP rule;
- create React/Vite/Firebase/custom app code;
- modify Phase 1 or Phase 2;
- advance to Phase 4.

## Human instantiation correction

The user has already created `MASTER_COMPANY_OPERATIONS` with `Lists_Config`.

That tab must now be **deleted** before Phase 3 can be considered physically aligned with R19.

Do not delete any other tab.

The other 13 authoritative/support tabs remain required.

## Verification

Confirm:
1. `Lists_Config` is absent.
2. Operations has exactly 4 authoritative/support tabs.
3. Finance has exactly 5 authoritative/support tabs.
4. HR/Admin has exactly 4 authoritative/support tabs.
5. Total authoritative/support tabs = 13.
6. After all Forms are linked, expected physical tab count = 21.
7. Controlled values are locally defined where needed.
8. `Employees` remains the single employee + HR master.
9. `HR_Admin` remains workflow-only.
10. Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED.
11. Phase 4 and Phase 5 remain blocked.

## Execution loop

**READ → DETERMINE STATE → PLAN → IMPLEMENT → VERIFY → CORRECT → RE-VERIFY → DOCUMENT → STOP**

Do not continue to another Phase 3 unit until this running change is verified.
