| Scenario | Required behavior | Do not do |
|---|---|---|
| Missing required form data | Mark processing failure/needs correction and notify appropriate user/admin. | Do not silently create an incomplete record. |
| Invalid project/employee ID | Stop processing and record the error. | Do not guess the intended project/employee. |
| Drive folder creation failure | Leave project record visible as pending/error and notify admin. | Do not mark Drive setup complete. |
| Email send failure | Record failure and allow controlled retry. | Do not duplicate successful prior sends. |
| Quota/rate limit | Record deferred/failed state and retry only within safe quota policy. | Do not create an uncontrolled retry loop. |
| Duplicate trigger execution | Use record ID/status/idempotency check before applying side effects. | Do not send duplicate emails or create duplicate folders. |
| Sheet schema mismatch | Stop affected module and surface a clear admin error. | Do not write into guessed columns. |
| Permission/access failure | Record failure and notify admin. | Do not weaken permissions automatically to make the script work. |
| ID counter conflict / rollback | Reconcile the stored prefix counter against the highest valid existing ID and advance before issuing a new ID. | Do not issue an ID below an existing ID or silently overwrite an existing record. |
| ID generation collision | Reject the collision, log the failure, and retry only within the controlled ID-generation transaction. | Do not reuse an already-issued ID. |
| Concurrent ID requests | Serialize generation with Apps Script LockService. | Do not read/increment/write a shared counter without a lock. |

## R52 — Explicit Generate-ID controls for Sheet-originated records

## R56 — One-click Employee creation transaction safety
- The Employee creation action is one explicit Generate Employee ID transaction; there is no separate Save/Process recovery step.
- If validation or duplicate-email checks fail, no Employee_ID is issued and the employee is not finalized.
- If an Employee_ID has already been issued for the selected row, the action must not allocate another ID.
- If the ID is issued but a later finalization write fails, the issued ID is never reused; the record remains visibly recoverable/manual-review and the failure is logged.
- Generic onEdit/autosave events must never invoke Employee_ID generation.

- R52 error-handling requirements: reject Generate-ID when required fields are incomplete/invalid; never issue an ID from generic onEdit/autosave; LockService serializes concurrent Generate-ID actions; if generation succeeds but commit/save fails, the issued ID is not reused; repeated Generate-ID on an already-ID'd/locked record must not allocate another sequence value.

## R57 — Universal Generate-ID error-handling contract for user-created Sheet records
- If required fields or record-specific validation fail, the explicit Generate-ID action must stop before ID issuance and before authoritative finalization.
- If applicable duplicate/identity validation fails, no new business ID may be issued.
- If the record already has a valid generated ID, repeating the action must not allocate another sequence value.
- If A4-00 successfully issues an ID but the subsequent authoritative commit/finalization fails, the issued ID is never reused. Preserve the pending/source state, log the failure and surface a controlled recovery/manual-review state.
- Concurrent Generate-ID actions must remain serialized by LockService.
- Generic edit/autosave triggers must never be used as a fallback path for ID issuance after an explicit action fails.
- Form/system-generated IDs continue to use their controlled processing/error-handling path and are not converted into R57 manual actions.


## R58 — Financial employee-linkage validation

Financial employee-related workflows must reject or flag any attempt to resolve an employee through `Member_Record_ID`. The canonical employee reference is `Employee_ID` for `Budget_Given`, `Employee_Spending`, `OOP_Claims` and `Salary_Admin`. `Investments` is excluded from this rule because its frozen schema uses `Source_Person`.

## R62 — OOP approval and salary-gate failures
- If the authoritative `Employees` master does not contain exactly one active employee with `Designation = Director`, FRM-03 processing must not silently create an un-routable claim; surface `A4_04_TOP_MANAGER_RESOLUTION_FAILED` for administrator action.
- If manager notification fails after claim creation, leave the claim in `Pending Review`, log the failure, and allow controlled retry. Never mark it Approved because an email failed.
- If a non-manager attempts an approval action, reject with `A4_04_MANAGER_AUTHORIZATION_REQUIRED` and make no claim changes.
- If a claim is not `Pending Review`, reject repeated approval/rejection attempts; do not alter an already-decided claim.
- A food-related claim cannot use the normal company-essential approval action; it must use the explicit food-business-exception action.
- A claim that is `Pending Review` or `Rejected`, or has no positive `Approved_Amount`, must contribute zero to the salary OOP component.
- A food-related claim with `FOOD_REQUIRES_REVIEW_EXCEPTION_OR_ORDINARY` remains excluded from salary even if its status is manually changed incorrectly; salary eligibility is based on the controlled approval flags.
- Only `APPROVED_COMPANY_ESSENTIAL` and `APPROVED_FOOD_BUSINESS_EXCEPTION` are salary-eligible OOP classifications.
- Never bypass the Top Manager approval gate to make a payroll calculation succeed.
