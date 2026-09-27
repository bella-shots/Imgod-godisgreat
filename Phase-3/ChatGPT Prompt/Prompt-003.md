# PHASE 3 — RUNNING CHANGE PROMPT 003

## Change type
**Controlled specification correction before continued human instantiation.**

This is the current authoritative Phase 3 running-change prompt. Prompt-001 and Prompt-002 remain historical and must not be overwritten.

## R18 — Unified Employee + HR Master Data

### Problem being corrected
The previous Phase 3 model split employee master attributes across:
- `Employees`
- `HR_Admin`

This created an avoidable duplicate/fragmented employee record model.

### Authoritative correction
`Employees` is now the **single authoritative employee + HR master record**.

Move these HR profile fields into `Employees`:
- `Joining_Date`
- `Employment_Status`
- `HR_Notes`
- `Reimbursement_Settings`

The resulting `Employees` master includes:
- `Employee_ID`
- `Name`
- `Email`
- `Role`
- `Salary_Basis`
- `Active`
- `Reimbursement_Eligible`
- `Project_Access`
- `Joining_Date`
- `Employment_Status`
- `HR_Notes`
- `Reimbursement_Settings`
- `Created_At`

### HR_Admin re-scope
Do **not** delete the `HR_Admin` tab.

`HR_Admin` is now the controlled **HR request/governance workflow table**, not a second employee master.

Fields:
- `HR_Request_ID` — `HRR-XXX`
- `Employee_ID`
- `Request_Type`
- `Relevant_Details`
- `Attachment_URL`
- `Status`
- `Submitted_At`
- `Processed_At`
- `Processed_By`

FRM-04 continues to use:
`HR_Requests_Responses` → `HR_Admin`

Phase 4 will create/update the HR workflow record and, where a request changes employee information, update the authoritative `Employees` record.

## Scope firewall

Do not:
- change the 3-workbook partitioning;
- delete or add workbooks;
- change the ₹5,000 OOP rule;
- implement Apps Script;
- implement triggers;
- implement HR notifications;
- implement automated employee-master updates;
- create React/Vite/Firebase/custom application code;
- modify Phase 1 or Phase 2;
- create live Google resources beyond the human-instantiation work already authorized.

The physical model remains:
**14 authoritative/support tabs + 8 native Form response tabs = 22 physical tabs.**

## Required documentation alignment

Keep these synchronized with R18:
- `Phase-3/Phase-3-Schema-Blueprint.md`
- `Phase-3/Phase-3-Data-Rules.md`
- `Phase-3/Phase-3-Forms-Map.md`
- `Phase-3/Phase-3-Acceptance.md`
- `Phase-3/Phase-3-Build.md`
- `Phase-3/Revision-Log.md`
- `context/progress-tracker.md`

Prompt-001 and Prompt-002 remain historical.

## Verification

Confirm:
1. `Employees` contains the complete employee + HR master fields.
2. `HR_Admin` contains workflow/request records only.
3. No employee profile fields are duplicated in `HR_Admin`.
4. FRM-04 targets `HR_Admin` as its workflow target.
5. `Employees` remains the authoritative employee/HR profile source.
6. Phase 4 remains blocked.
7. Phase 3 remains IN PROGRESS / HUMAN ACTION REQUIRED.
8. No live Google resource is falsely claimed as verified.

## Execution loop

**READ → DETERMINE STATE → PLAN → IMPLEMENT → VERIFY → CORRECT → RE-VERIFY → DOCUMENT → STOP**

After verification, stop at the Phase 3 human-action boundary.
