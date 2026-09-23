| Workflow | Recipient source | When email is sent | Content | Logging |
|---|---|---|---|---|
| MOM published | Registered MOM recipients / approved participant email IDs | MOM is published | Project, meeting/date, MOM link, relevant update/version information | Sent/failed + timestamp + MOM_ID |
| MOM updated | Registered MOM recipients / approved participant email IDs | A published MOM is updated and notification is required | Project, meeting/date, updated MOM link, version/update information | Sent/failed + timestamp + MOM_ID |
| Expense exception | Defined finance/admin recipient | Expense requires review or fails validation | Expense ID, employee, project, issue/status, link | Notification status |
| OOP approval request | Designated approver | New claim requires approval | Claim ID, employee, amount, project, proof/status link | Notification status |
| OOP status update | Employee email from Employees | Claim status changes where notification is required | Claim ID, status, approved amount if applicable, relevant information | Notification status |
| Admin automation failure | Admin/owner | Critical automation fails | Module, record ID, error summary, remediation link/context | Error log + notification result |
| Report available | Defined report recipients | Approved report is generated/published | Report type, period, link | Report_Index + send result |