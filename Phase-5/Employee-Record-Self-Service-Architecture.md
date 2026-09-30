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
