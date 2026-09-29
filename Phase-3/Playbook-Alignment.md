| ALIGNMENT WITH UPLOADED APP-BUILDING PLAYBOOK |  |  |  |  |
|---|---|---|---|---|
| Playbook Principle | How this workbook applies it | Where | Why it matters for 2-day build | Status |
| Architecture before coding | Architecture, builder-engine choice, data ownership, security boundaries are first tasks. | D1-01:D1-04 | Prevents Google AI Studio from improvising the system. | Applied |
| Six-file context + agents.md | Created before implementation and restored on Day 2. | D1-05,D2-01 | Lets AI Studio resume without rediscovering requirements. | Applied |
| Feature specs | Business modules and builder capabilities are decomposed into units. | Feature Specs | Controls AI scope and reduces debugging loops. | Applied |
| One unit at a time | Each checklist item has dependency, exact action and verification. | 2-Day Checklist | Allows parallel-looking speed without architectural drift. | Applied |
| Provider-native capabilities | Full builder uses mature editor engine rather than custom canvas implementation. | D1-19,D2-10:D2-18 | This is the main mechanism for fitting full builder into 2 days. | Applied |
| Server-side authorization | Permissions are enforced at mutation/API boundaries. | Permissions Matrix,D2-19:D2-20 | UI-only hiding is insufficient. | Applied |
| Focused corrections | Exact errors become corrective prompts rather than full-project re-prompts. | AI Studio Prompt Sequence | Reduces regression and wasted time. | Applied |
| Review before completion | AI-generated code is reviewed before merge/deploy. | D2-23 | Catches spec/security mismatches. | Applied |
| Production verification | Deploy, inspect logs and test critical flows. | D2-24:D2-25 | Prevents assuming a successful build is a successful product. | Applied |
| Cost-aware architecture | Architecture assigns each responsibility to an existing/free/open-source service appropriate for a ~20-person internal system. | Read Me; Required Tools; architecture tasks | Prevents unnecessary infrastructure and keeps the 2-day build aligned with the user's ₹0 additional-cost constraint. | Applied |
| Ambiguity handling / specification sync | R21 was recorded as a focused correction after an observed Form usability mismatch; authoritative IDs were preserved while human-facing inputs were clarified and downstream resolution was bounded to Phase 4. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Revision-Log; progress-tracker | Prevents the implementation agent from guessing how respondents obtain internal IDs. | Applied |
| Focused correction / anti-staleness | R22 corrects FRM-05 so Project Name is a required Short answer rather than a manually maintained Form choice list; Phase 4 remains the identity-resolution boundary. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005; Revision-Log; progress-tracker | Prevents a stale project selector and keeps live identity resolution out of Phase 3. | Applied |

| Salary workflow correction | Recurring payroll is derived from the employee's agreed 6-month CTC and recorded monthly in `Salary_Admin`; normal payroll is not repetitive Form entry. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005 | Prevents an impractical employee-by-employee monthly salary-entry workflow and keeps recurring payroll automation in Phase 4. | Applied |


| Focused correction / identity mismatch handling | R25 makes FRM-02's respondent-facing field explicitly Employee Email ID and defines deterministic handling when the respondent is logged into a different Google account: do not silently substitute the login email; retain it only as audit metadata and route mismatch to validation/manual review before authoritative transfer. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005; Revision-Log | Prevents accidental employee misattribution while keeping Phase 4 as the identity-resolution boundary. | Applied |

| Focused correction / HR request taxonomy | R26 locks FRM-04 Request Type to nine controlled values and defines the exact respondent-facing field set, eliminating the previously unspecified controlled-value gap. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005; Revision-Log; progress-tracker | Prevents implementation agents from inventing HR request categories and keeps the Form/workflow boundary explicit. | Applied |


| Focused correction / FRM-06 report-request field lock | R27 locks the respondent-facing FRM-06 fields to Report Type, Period, conditional Project Name and Recipient Email, with exact report-type values and no internal/Phase 4 fields. | Phase-3-Schema-Blueprint; Phase-3-Forms-Map; Phase-3-Data-Rules; Phase-3-Acceptance; Prompt-005; Revision-Log; progress-tracker | Prevents the Form builder from inventing report categories, identity fields or workflow fields and keeps report compilation in Phase 4. | Applied |


### R29 — Finance Report security alignment

FRM-06 Finance Report is aligned to the playbook's restricted-data principle: report generation is a controlled presentation of already-authorized data, not a permission-escalation mechanism. The report compiler must enforce requester role/designation and authorized scope before selecting Finance records. Recipient selection must be role-controlled and cannot be used to bypass Finance/HR restrictions.
### R31 — HR Report must follow authoritative schema, not generic HR assumptions

For **FRM-06 → HR Report**, implementation guidance must map report content directly to the current Employees and HR_Admin schemas.

Do not describe report contents using vague labels such as “workflow information”, “processing information”, or “employee/requester” without mapping them to actual columns.

The exact HR_Admin mapping is:
- Employee/requester → Employee_ID resolved through Employees
- Request type → Request_Type
- Request details → Relevant_Details
- Status → Status
- Request date → Submitted_At
- Processing information → Processed_At and Processed_By
- Supporting document → Attachment_URL

The exact employee-profile source is Employees; HR_Admin must not become a duplicate employee master.

The implementation must not invent HR fields that are not present in the authoritative schema.


## R32 — Required Phase 4 reporting behavior

The Phase 3 contract now requires the Phase 4 Apps Script reporting layer to treat reports as **generated presentation outputs**, not raw Sheet exports.

For every FRM-06 report type, Phase 4 must implement: authorization → report generation → in-system display → user-initiated download of the same authorized report.

The implementation must not create separate weaker/stronger authorization paths for View and Download. The exact download format is intentionally left open for Phase 4 unless separately approved.


## R32 — Required Phase 4 reporting behavior

The Phase 3 contract now requires the Phase 4 Apps Script reporting layer to treat reports as **generated presentation outputs**, not raw Sheet exports.

For every FRM-06 report type, Phase 4 must implement: authorization → report generation → in-system display → user-initiated download of the same authorized report.

The implementation must not create separate weaker/stronger authorization paths for View and Download. The exact download format is intentionally left open for Phase 4 unless separately approved.
