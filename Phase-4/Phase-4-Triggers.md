| Trigger | Type | When it runs | Scope | Rule |
|---|---|---|---|---|
| Expense submission | Form submit trigger | When employee expense Form is submitted | Employee_Spending | Validate and process one submission; do not scan/reprocess all historical rows unnecessarily. |
| OOP submission | Form submit trigger | When OOP Form is submitted | OOP_Claims | Validate and route claim for approval. |
| MOM publish/update | Controlled action / form trigger | When MOM is marked for publish/update | Project_MOM_Index | Create version/index entry and queue/send notification. |
| Project creation | Form submit / controlled action | When project request is approved/created | Projects | Create/locate Drive project structure and save URLs. |
| Salary processing | Scheduled trigger | Defined monthly/admin processing time | Salary_Admin | Calculate carry-forward from approved records; preserve prior months. |
| Report generation | Scheduled or admin-triggered | Defined reporting period | Report_Index + source sheets | Generate only the defined report set; write outputs to Drive. |
| Notification queue | Scheduled trigger if needed | Periodic processing | Notification/audit records | Process pending notifications while avoiding duplicate sends. |
| Error monitoring | Scheduled/admin action | Periodic or on-demand | Audit/error records | Surface failed automation items to admin. |