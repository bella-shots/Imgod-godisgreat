| OPEN QUESTIONS / DECISIONS TO CONFIRM BEFORE PRODUCTION |  |  |  |  |  |  |
|---|---|---|---|---|---|
| ID | Question | Default for 2-Day Build | Why It Matters | Decision Needed By | Impact | Status |
| Q01 | Which visual editor engine will be used? | Google Sites native page builder; optional Apps Script HTML interface only where a custom interaction is essential or equivalent mature editor | This is the key mechanism that makes the full builder achievable in 2 days. | 20-Sep 09:00 | High | Open |
| Q02 | Should standard users be able to create projects? | Configurable permission; admin can enable | Requirement says anyone with access can edit, but project creation is not explicitly restricted. | 20-Sep 09:00 | Medium | Open |
| Q03 | Who receives MOM emails? | Registered project participant emails | Need authoritative recipient source. | 21-Sep 11:30 | Medium | Open |
| Q04 | Should uploaded Excel be parsed into editable web tables? | File is displayed/downloaded; structured expense records are separately editable | Avoid corrupting authoritative Excel while still enabling calculations. | 20-Sep 15:00 | High | Open |
| Q05 | Exact ₹5,000 interpretation? | Configurable: threshold + requested extra ₹5,000 line item | Wording can produce different accounting outcomes. | 21-Sep 08:20 | High | Open |
| Q06 | Who can run custom JavaScript? | Admin only by default | Arbitrary JS is a major security boundary. | 21-Sep 15:00 | Critical | Open |
| Q07 | Should plugins be arbitrary third-party code? | Plugin registration API, admin-controlled; no untrusted third-party runtime | Security and production stability. | 21-Sep 17:10 | Critical | Open |
| Q08 | Published custom pages run on same domain or separate route/subdomain? | Same app domain with isolated page runtime | Determines routing and script isolation design. | 21-Sep 18:00 | High | Open |
| Q07 | Must the app remain at ₹0 additional cost beyond the existing Google AI Pro subscription? | Yes — hard constraint for this build | Determines storage, email, hosting and backend choices. | 20-Sep 10:00 | High | Resolved |
| Q08 | Should normal Form respondents manually enter stable Project_ID/Employee_ID values? | No. Use human-readable identity inputs and resolve to canonical IDs in Phase 4. | Internal IDs are system identifiers, not reasonable respondent-facing inputs. | 27-Sep | High | Resolved |
| Q09 | Should FRM-05 embed current project names as a Form choice list? | No. Required Short answer; Phase 4 validates/resolves against authoritative `Projects`. | A copied choice list becomes stale as projects change and would create an unnecessary Phase 3 maintenance dependency. | 28-Sep | High | Resolved |

| Q10 | Should normal monthly payroll be entered through a salary Form? | No. Use the agreed 6-month CTC in `Employees.Salary_Basis` and generate monthly payroll records in `Salary_Admin`. | A Form-per-employee-per-month workflow is unnecessary and impractical. | 28-Sep | High | Resolved |


| Q11 | Should FRM-02 use the submitted Employee Email ID or the signed-in Google account email when they differ? | Use the explicit **Employee Email ID** as the employee identity input; retain any platform-captured signed-in email only as audit metadata. A mismatch is not silently resolved and must enter validation failure/manual review or the defined correction workflow. | Prevents a submission from being attributed to the wrong employee when a respondent uses a different Google login. | 29-Sep | High | Resolved |

| Q12 | What controlled values should FRM-04 Request Type use? | Nine locked values: Personal Information Update; Bank / Payment Details Update; Leave / Attendance Request; Employment / HR Document Request; Salary / Payroll Query; Reimbursement / Benefits Query; Project / Role Update; Resignation / Exit Request; Other. | Prevents the Form builder from inventing categories and defines the HR workflow taxonomy. | 29-Sep | Medium | Resolved |


| Q13 | What exact respondent-facing fields should FRM-06 use? | Employee Email ID (required), Report Type (4 locked values), Period (required text), conditional Project Name (free text). Recipient Email is not used. | Prevents the Form builder from inventing fields or exposing internal report/workflow columns. | 29-Sep | Medium | Resolved |


| Q14 | What should Finance Report return and who may receive it? | Finance Report is a permission-controlled consolidated report. Budget Given, Employee Spending, OOP Claims, authorized Salary/Payroll, authorized Investments, authorized financial totals and authorized project-wise financial information may be included according to requester role/designation and scope. Recipient selection is role-controlled and cannot bypass permissions. | Prevents a report request from exposing restricted salary, investment or other employee financial records. | 29-Sep | Critical | Resolved |
| Q15 | What exactly should HR Report return? | HR Report is a permission-controlled report using only the current Employees and HR_Admin schemas. HR request fields are HR_Request_ID, Employee_ID, Request_Type, Relevant_Details, Attachment_URL, Status, Submitted_At, Processed_At, and Processed_By. Employee profile fields come only from Employees. | Prevents vague HR-report definitions and prevents invented HR fields. | 29-Sep | Critical | Resolved |


## R32 — Resolved reporting output question

**Resolved:** Report delivery is not download-only and is not a raw workbook export.

The universal behavior is:
- display the generated authorized report directly in the system; and
- provide a Download Report action for users who want a copy.

The download must reflect the same authorization and report content as the displayed report. The exact downloadable file format remains a Phase 4 implementation detail.


## R32 — Resolved reporting output question

**Resolved:** Report delivery is not download-only and is not a raw workbook export.

The universal behavior is:
- display the generated authorized report directly in the system; and
- provide a Download Report action for users who want a copy.

The download must reflect the same authorization and report content as the displayed report. The exact downloadable file format remains a Phase 4 implementation detail.
\n\n### R33 — FRM-06 Period field description clarification\n\nFor the respondent-facing FRM-06 **Period** field:\n\n> **Enter the reporting period for which you want the report. Use YYYY-MM for a monthly report (e.g., 2026-09) or YYYY-QN for a quarterly report (e.g., 2026-Q3).**\n\nThe field remains a **required Short answer** and is not a Date question. This clarification did not change the field types or reporting-period semantics at the time. R34 subsequently revises the FRM-06 field set by adding the required Employee Email ID requester-identity field.

### R34 — FRM-06 requester identity and alternate-account handling (historical; superseded by R35)

R34 revised R27 for FRM-06 requester identity. The Form must explicitly capture the requester's **Employee Email ID** because the Google account used to open/submit the Form may differ from the employee's company identity.

The R34 historical respondent-facing FRM-06 field set was:

| # | Field | Type | Required |
|---|---|---|---|
| 1 | Employee Email ID | Short answer | Yes |
| 2 | Report Type | Multiple choice | Yes |
| 3 | Period | Short answer | Yes |
| 4 | Project Name | Short answer | Conditional / only when a project-specific report is requested |

**Employee Email ID description:**
> Enter your company Employee Email ID. This is used to identify your employee record for report authorization. Do not enter your Employee ID.

Phase 4 resolves the submitted Employee Email ID against authoritative `Employees.Email` to obtain the canonical `Employee_ID` and the employee's authoritative `Role`. The respondent does not select or enter Employee_ID or Designation/Role.

If Google Forms captures a signed-in Google account email and it differs from the submitted Employee Email ID, the captured login email is audit metadata only. It must not override the explicit Employee Email ID. A mismatch must go to validation failure/manual review or the defined correction workflow before report generation. No silent identity substitution is permitted.

**Report Type** remains a required Multiple choice with exactly:
- Company Summary
- Project Report
- Finance Report
- HR Report

**Period** remains a required Short answer with this description:
> Enter the reporting period for which you want the report. Use YYYY-MM for a monthly report (e.g., 2026-09) or YYYY-QN for a quarterly report (e.g., 2026-Q3).

**Project Name** remains a conditional Short answer for project-specific reports. **CAUTION — CASE-SENSITIVE:** Enter the Project Name **exactly as it appears in the authoritative `Projects.Project_Name` field**, including capitalization, spaces, spelling, and punctuation. The value is case-sensitive and must be an exact match for Phase 4 resolution. Do not ask for or enter `Project_ID`. Do not provide a hard-coded project-name choice list.

There is no respondent-facing Recipient Email field. Reports are displayed in the system and may be downloaded by the requester; report delivery to an arbitrary email address is not part of FRM-06.

Do not add respondent-facing Employee_ID, Designation/Role, Report_ID, Project_ID, Drive_URL, Status, Generated_Date, Submission_ID, or other Phase 4 processing fields.

This revision changes the FRM-06 respondent-facing field count from five to four. It does not change the authoritative workbook schemas, Report_Index schema, report types, or the Phase 4 authorization boundary.
