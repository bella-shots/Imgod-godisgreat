| PERMISSIONS & SECURITY MATRIX |  |  |  |  |  |  |
|---|---|---|---|---|---|
| Capability | Admin | Standard User with Access | Employee Self | Server Enforcement | Sensitive Data | Test |
| Dashboard | Read/write | Read/write permitted modules | Read own | Yes | No | Try direct API |
| Create project | Yes | Configurable | No | Yes | No | Role/API test |
| Edit project | Yes | Yes if member/editor | No | Yes | No | Member test |
| Delete project | Yes | Configurable | No | Yes | No | Unauthorized delete |
| Event date | Yes | Yes if editor | No | Yes | No | Edit/reload |
| Checklist Excel | Yes | Yes if editor | No | Yes | Potential | Storage rules |
| Expense Excel | Yes | Yes if editor | No | Yes | Potential | Storage rules |
| Budget allocations | Yes | Yes if permitted | No | Yes | Financial | Role test |
| Own OOP claim | Yes | Yes | Yes | Yes | Financial | Employee sees own |
| Other employee OOP | Yes | Configurable/no by default | No | Yes | Financial | Cross-user access |
| Salary | Yes | No | No | Yes | Highly sensitive | Direct API denial |
| Salary report | Yes | No | No | Yes | Highly sensitive | Direct API denial |
| Investments | Yes | No | No | Yes | Sensitive | Direct API denial |
| MOM | Yes | Yes if editor | No | Yes | Business | Email recipient test |
| Custom page create | Yes | Configurable | No | Yes | No | ACL test |
| Custom page edit | Yes | Yes if page ACL | No | Yes | No | ACL test |
| Custom CSS | Yes | Configurable | No | Yes | Potential | Scope test |
| Custom JS | Yes | Admin/default restricted | No | Yes | Critical | Sandbox escape test |
| Themes/templates | Yes | Configurable | No | Yes | No | Apply/rollback |
| Plugins | Yes | Admin | No | Yes | Critical | Plugin isolation |
| Publish | Yes | Configurable | No | Yes | Critical | Draft vs published |
| Uploaded files / Drive assets | Yes | Yes if permitted | Own/assigned files only | Yes | Potentially sensitive | Verify direct Drive/app access |
| REVISED ACCESS MODEL |  |  |  |  |  |  |
| Employee access should be granted using individual Gmail/Google Accounts where a restricted site/file/form is required. |  |  |  |  |  |  |
| Sensitive master Sheets (salary, investments, full finance/admin records) remain restricted to admins. |  |  |  |  |  |  |
| Employees submit or view permitted information through Forms, shared project pages/files, or controlled Apps Script interfaces. |  |  |  |  |  |  |
| Do not assume Google Sites page-level access is equivalent to database-level RBAC. Sensitive record-level controls must be enforced by restricting the underlying Sheets/Drive assets and, where necessary, by Apps Script workflow checks. |  |  |  |  |  |  |