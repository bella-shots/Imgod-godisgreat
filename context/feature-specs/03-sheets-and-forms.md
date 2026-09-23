# Feature 03 — Google Sheets + Forms

## Goal
Create the authoritative structured data layer and controlled input forms.

## Dependency
Feature 02 must be verified.

## Required data areas
- Projects
- Employees
- Project_Members
- Project_Notes
- Project_MOM_Index
- Budget_Given
- Employee_Spending
- OOP_Claims
- Salary_Admin
- Investments
- HR_Admin
- Report_Index
- Lists_Config

## Required forms
- Create/Request Project
- Employee Spending/Expense
- OOP Claim
- Employee Update/HR Request
- MOM Input
- Optional Report Request
- Investment Entry for authorized administrators
- Salary Entry for authorized administrators

## Scope
- Create schemas.
- Apply stable IDs.
- Apply controlled statuses and validation.
- Configure restricted tabs/sheets.
- Create the required forms.
- Connect form responses to authoritative sheets.

## Out of scope
- Automated calculations beyond basic validation.
- Email automation.
- Full reporting automation.
- Apps Script workflows.

## Verification
- Required sheets exist.
- Required forms exist.
- Form submissions reach the intended authoritative sheets.
- Sensitive tabs are restricted.
- No duplicate authoritative data source is introduced.
