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