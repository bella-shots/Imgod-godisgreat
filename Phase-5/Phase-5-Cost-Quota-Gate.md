| ID | Verification | Acceptance condition | Status |
|---|---|---|---|
| COST-01 | Google AI Pro | The existing user subscription is treated as an existing resource, not a new project purchase. | NOT STARTED |
| COST-02 | Employee accounts | Representative employees can use normal Gmail/Google Accounts; no employee-by-employee paid Workspace subscription is required by the baseline design. | NOT STARTED |
| COST-03 | Hosting | No paid hosting service is required for the Site/Apps Script architecture. | NOT STARTED |
| COST-04 | Database | No paid database is required. | NOT STARTED |
| COST-05 | File storage | No paid third-party file/object-storage service is required. | NOT STARTED |
| COST-06 | Email | No paid email API/service has been introduced. | NOT STARTED |
| COST-07 | Automation | No paid automation platform has been introduced. | NOT STARTED |
| COST-08 | Third-party SaaS | No third-party SaaS is required for the baseline system. | NOT STARTED |
| QUOTA-01 | Apps Script email quota | Expected internal email volume is compatible with the applicable account/service quota. | NOT STARTED |
| QUOTA-02 | Apps Script runtime/triggers | Expected automation workload is compatible with applicable execution/trigger quotas. | NOT STARTED |
| QUOTA-03 | Drive/storage | Expected files fit within the storage available to the actual accounts used. | NOT STARTED |
| QUOTA-04 | Forms/Sheets usage | Expected internal usage does not depend on unlimited service behavior. | NOT STARTED |
| QUOTA-05 | Failure behavior | If a quota is reached, the system fails/defer safely and exposes the issue to the admin. | NOT STARTED |
| FINAL | Zero-additional-cost + quota gate | All cost and quota tests PASS with no hidden paid dependency. | NOT STARTED |