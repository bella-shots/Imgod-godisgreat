# Employee Record Self-Service Architecture

**Revision:** R50  
**Status:** Frozen architecture requirement  
**Scope:** Phase 4 processing contract + Phase 5 employee-facing website behavior  
**Implementation status:** Architecture only — NOT IMPLEMENTED / NOT VERIFIED

## 1. Requirement

After an employee submits an applicable Google Form, the platform must allow that employee to retrieve the resulting authoritative business record through the company website.

This is a self-service retrieval requirement, not a requirement for a custom ID-generation button inside Google Forms.

## 2. Canonical flow

Employee submits Google Form
→ Google Forms automatically creates the native response row
→ Phase 4 processing validates/resolves the submission
→ Phase 4 generates the authoritative business ID
→ Phase 4 creates/updates the authoritative business record
→ the record becomes available to the authorized employee-facing website
→ employee opens **My Records**
→ system resolves the employee to the canonical Employee_ID
→ system returns only records the employee is authorized to view.

## 3. ID visibility

The generated business ID remains the authoritative record identifier.

Examples:
- Budget → BDG-000001
- Spending → SPN-000001
- OOP Claim → CLM-000001
- HR Request → HRR-000001
- Project-related records → their applicable canonical ID.

The employee must not manually enter or generate these IDs as part of ordinary Form submission.

The website must display the generated ID when the corresponding record is available to the employee.

## 4. Employee identity resolution

Employee_ID is the canonical employee key.

The self-service layer must resolve the authenticated/requesting employee to the authoritative Employees record and canonical Employee_ID before returning employee-scoped records.

Where a Form explicitly collects Employee Email ID, Phase 4 resolves that human-facing input to Employee_ID according to the existing identity-resolution rules. The website must not use a user-entered Employee_ID as an authorization bypass.

## 5. My Records

The employee-facing website must provide a **My Records** area.

At minimum it must support:
- listing records available to the current employee;
- displaying the generated business ID;
- displaying record type;
- displaying relevant date/status fields;
- opening a permitted record detail view.

The exact presentation/UI may be implemented later. The data and authorization contract is frozen now.

## 6. Record-type scope

The self-service architecture applies to employee-linked records where the employee is an authorized viewer.

This includes, where applicable:
- Employee Spending
- OOP Claims
- Budget Given records where the employee is the recipient
- HR Requests
- the employee's own Salary/Payroll information where already authorized by the existing Finance/HR contracts
- authorized Project/Project Member/Project Note/MOM information according to existing project access rules.

It does not grant employees access to unrestricted Finance, Salary, Investment, HR, or other sensitive records.

## 7. Security invariant

"My Records" is an authorization-controlled view, not a filtered display over broadly exposed source Sheets.

The underlying restricted workbooks remain restricted.

The website/self-service layer must enforce that an employee cannot retrieve another employee's restricted records by:
- changing an ID in a URL;
- submitting another Employee_ID;
- submitting another employee's email;
- guessing a business ID;
- changing a record type;
- manipulating query parameters.

Direct source-workbook access remains governed by the existing Phase 3/Phase 5 permission model.

## 8. Form response vs authoritative record

The native Google Form response is an intake/staging record.

The generated business ID belongs to the authoritative business record created/updated during Phase 4 processing.

The website must not treat a native Form response timestamp or row number as the business ID.

## 9. No schema expansion required

R50 does not add a new Phase 3 workbook, authoritative tab, Form field, or counter table.

The existing Submission_Index.Record_ID provides the central processing linkage between a Submission_ID and the generated/mapped target business Record_ID.

## 10. Implementation boundary

- Phase 3: preserves the existing Forms, response tabs, authoritative schemas and identity inputs.
- Phase 4: processes submissions, generates IDs, creates/updates authoritative records, and exposes an authorized retrieval contract for the self-service layer.
- Phase 5: implements the employee-facing My Records experience and verifies end-to-end authorization and retrieval.
- This R50 change does not authorize Phase 4 code implementation while Phase 4 remains blocked by the repository execution gate.

## 11. Required end-to-end behavior

For a Budget submission:

Form submission
→ Budget_Given_Responses receives the native response
→ Phase 4 processes the response
→ Budget ID generated, e.g. BDG-000001
→ authoritative Budget_Given record exists
→ Submission_Index links the submission to BDG-000001
→ employee opens My Records
→ employee is resolved to canonical Employee_ID
→ BDG-000001 appears if the employee is the authorized recipient/viewer
→ employee can open the permitted Budget details.

## 12. Non-goals

R50 does not require:
- a custom Generate ID button inside Google Forms;
- exposing restricted Finance workbooks to employees;
- giving employees direct Sheet access;
- a new database;
- a new business-ID field in Forms;
- email as the only way to retrieve the ID;
- immediate Form confirmation-page display of the generated ID.

## 13. Verification

This architecture requirement is frozen but currently:

**NOT IMPLEMENTED / NOT VERIFIED — HUMAN ACTION REQUIRED**

Implementation and live verification belong to the existing Phase 4/Phase 5 execution boundaries.


## 14. Universal generated-ID visibility matrix — R51

The generated-ID visibility requirement applies to **every authoritative record type**, not only employee-submitted or employee-linked records.

| Record | Generated ID | Authoritative record | Website/module where ID can be viewed |
|---|---|---|---|
| Project | `PRJ-000001` | Projects | Projects |
| Employee | `EMP-000001` | Employees | Employees |
| Project Member | `MBR-000001` | Project_Members | Project Members |
| Project Note | `NOT-000001` | Project_Notes | Project Notes |
| MOM | `MOM-000001` | Project_MOM_Index / MOM content | MOM / MOM Index |
| Budget | `BDG-000001` | Budget_Given | Budget Given |
| Spending | `SPN-000001` | Employee_Spending | Employee Spending |
| OOP Claim | `CLM-000001` | OOP_Claims | OOP Claims |
| Salary | `SAL-000001` | Salary_Admin | Salary / Payroll |
| Investment | `INV-000001` | Investments | Investments |
| HR Request | `HRR-000001` | HR_Admin | HR Requests |
| Report | `RPT-000001` | Report_Index | Reports |
| Submission | `SUB-000001` | Submission_Index | Submission / Processing History |

### Universal rule

Whenever an authoritative record exists, its generated business ID must be displayed in the corresponding authorized website/module view of that record.

The ID must not be hidden merely because it was generated automatically. It is the canonical record identifier and must be available for reference, search, support, audit and authorized navigation.

### Authorization rule

"Where it can be viewed" means **where an authorized user can view it**. It does not mean every employee can view every ID or every underlying record.

Existing authorization rules remain unchanged:
- Employees may see only records/data already authorized for them.
- Admins may see records within their administrative scope.
- Sensitive Salary, Investment, HR and Finance data remain restricted according to the existing permissions model.
- The generated ID itself must never be used to bypass authorization.

### Retrieval/search rule

Where the corresponding module supports record lookup/search, the generated ID must be a supported canonical lookup/reference value.

A user must not need to know or manually construct an ID to create a record. The system generates it. After creation, authorized users can see and reference it in the relevant module.

### Record-creation rule

This universal visibility requirement does not change when IDs are generated:
- Phase 4 generates the authoritative business ID during controlled authoritative record creation.
- The generated ID is persisted with the authoritative record.
- The website/module reads the persisted ID when displaying the record.

### Submission_ID clarification

`SUB-000001` is the canonical identifier for the Submission_Index record. It is visible in the authorized Submission/Processing History view and is also the linkage key used to trace an intake submission to its resulting authoritative business record where applicable.

### Employee_ID clarification

`EMP-000001` is both the authoritative Employee record ID and the canonical employee key used by employee-linked business records. Its display in Employees is subject to employee-directory visibility rules; its use internally must not be exposed as an authorization mechanism.

### R51 scope boundary

R51 changes the architecture from a **partial employee self-service record-visibility requirement** to a **universal generated-ID visibility requirement for all 13 authoritative record types**.

It does not:
- add new Phase 3 Forms;
- add new workbook tabs;
- change ID formats;
- change ID-generation timing/algorithm;
- grant additional data permissions;
- expose restricted Sheets directly;
- implement Apps Script;
- implement the website.

Status: **ARCHITECTURE FROZEN / IMPLEMENTATION PENDING / HUMAN VERIFICATION REQUIRED**


## R52 — Explicit Generate-ID controls for Sheet-originated records
- R52 — Sheet-originated record creation and generated-ID visibility: Project Member, Project Note, Budget and Salary records obtain IDs through explicit controlled Generate-ID actions before commit; Sheets autosave/edit events are not ID-generation triggers. Once generated, the ID is persisted in the authoritative row and shown in the corresponding authorized website/module view. Employee_ID retains its existing dedicated workflow. Submission_ID remains system/index-generated.
