| Original / Earlier Approach | Revised Approach | Reason |
|---|---|---|
| React/TypeScript custom frontend | Google Sites + Forms + optional Apps Script HTML | Much simpler and avoids custom frontend maintenance. |
| Firebase Authentication | Normal Gmail/Google Accounts + Google sharing | Employees should not need paid Workspace accounts. |
| Firestore | Google Sheets | Sufficient for small internal operational records; simple and familiar. |
| Firebase Storage | Google Drive | Native document/file storage and sharing. |
| Firebase Hosting | Google Sites / Apps Script | Avoid separate hosting layer. |
| Cloud Functions | Apps Script | Automation, triggers and email without a separate server runtime. |
| GrapesJS/full visual builder | Google Sites native builder | User accepted a simpler-looking, non-advanced site. |
| Gmail API / paid email services | Apps Script MailApp/GmailApp where sufficient | Avoid unnecessary API/service complexity and cost. |
| Custom database RBAC | Restricted Sheets/Drive + Forms + controlled Apps Script workflows | Fits the small internal use case while protecting sensitive records. |
| Custom deployment pipeline | Google Sites publishing + Apps Script deployment | Reduces engineering/deployment overhead. |