| Area | Requirement |
|---|---|
| Script ownership | Privileged Apps Script should be owned/managed by the designated administrator account. |
| Sensitive source data | Scripts may access restricted Salary, Investments, Finance and HR tabs only under the approved owner/admin authorization. |
| Employee data | Do not expose entire sensitive Sheets to employees merely because Apps Script needs to process them. |
| Email authorization | Send automated emails only through the authorized account/service available to the script and within applicable quotas. |
| Drive permissions | Automation must not broaden Drive sharing automatically beyond the approved project/user access model. |
| Web apps, if used | If an Apps Script web app is introduced later, explicitly define execution identity, access restriction and input validation before deployment. |
| Secrets | Do not store passwords/API keys or unrelated credentials in Sheets. Use appropriate Google service authorization/configuration. |
| Logging | Do not log unnecessary sensitive employee/salary information into broad-access audit sheets. |
| Least privilege | Each automation should access only the Sheets/Drive resources required for its function. |