| FEATURE-UNIT MAP — SPEC-DRIVEN EXECUTION |  |  |  |  |  |  |  |
|---|---|---|---|---|---|---|---|
| Feature ID | Feature | Goal | Dependencies | Implementation Boundary | Explicit Out of Scope for Unit | Verification | Checklist |
| F01 | Context + Architecture | Create durable product/architecture context | None | Context files, architecture, permissions, storage, editor decision | No feature implementation | All context files exist and agree | D1-01:D1-05 |
| F02 | Foundation | Create clean app and UI shell | F01 | Google Sites / Apps Script web interfaces/TS, UI system, auth-ready shell, env | Business features | Build/lint/type pass | D1-06:D1-08 |
| F03 | Core Data | Persist core entities | F01,F02 | Schema/migrations/API boundaries | UI polish | CRUD + relation tests | D1-09 |
| F04 | Master Dashboard | Navigate Projects/Finance/HR/Custom Pages | F02,F03 | Shell and navigation | Deep module logic | Routes work and roles apply | D1-10 |
| F05 | Projects | Manage projects/members/event data | F03,F04 | Project APIs + UI | Finance/MOM | CRUD + membership tests | D1-11:D1-12 |
| F06 | Project Files | Checklist/expense Excel uploads | F03,F05 | Storage + metadata + project links | Full spreadsheet editor | Upload/reload/access test | D1-13:D1-14 |
| F07 | Expense Ledger | Budget allocations + employee spending | F03,F06 | Structured records/calculations | Salary payout | Reconciliation tests | D1-15 |
| F08 | HR | Employee directory | F03,F04 | Employee APIs/UI | Performance/payroll automation | Access tests | D1-16 |
| F09 | Salary | Admin salary ledger | F07,F08 | Monthly ledger + carry-forward | Bank transfer integration | Ledger tests | D1-17,D2-04 |
| F10 | OOP | Employee reimbursement workflow | F07,F08 | Claims/approval/status | Automatic bank payment | Approval and payout tests | D1-18,D2-02:D2-03 |
| F11 | Reports | Generate salary reports | F09,F10 | Server report generation | BI dashboard | Totals reconcile | D2-05 |
| F12 | Investments | Admin investment ledger | F03 | CRUD + audit | Investment recommendations | Direct API denial for users | D2-06 |
| F13 | MOM | MOM editor + notification | F05,F03 | Content + recipients + async send | Full email campaign system | Email/send-log test | D2-07:D2-08 |
| F14 | Notes | Project notes | F05 | Persistent text records | Rich collaborative editor | Reload/access test | D2-09 |
| F15 | Visual Editor Core | Integrate mature full page builder | F02,F03 | Canvas, components, selection, drag, resize, history | No custom editor internals | Build nontrivial page | D1-19 |
| F16 | Visual Layout | Nested containers/columns/responsive | F15 | Layout + devices | 3D/WebGL editor | Desktop/tablet/mobile tests | D2-10:D2-11 |
| F17 | Visual Styling | Style manager + custom CSS | F15,F16 | Style rules/tokens/CSS | Server-side CSS compilation | CSS persistence/render test | D2-12,D2-14 |
| F18 | Visual Behavior | Animations + custom JS | F15,F17 | Interaction controls + isolated runtime | Untrusted script execution in app origin | Sandbox test | D2-13:D2-15 |
| F19 | Themes/Plugins | Templates, themes, plugin API | F15:F18 | Reusable config + extension boundary | Unreviewed arbitrary third-party plugins | Load/apply test | D2-16:D2-17 |
| F20 | Pages/Publishing | Multi-page storage, assets, preview, publish | F15:F19 | Page versions + assets + publish | Full CDN/page analytics | Publish/reload/rollback test | D2-18 |
| F21 | Access-aware CMS | Editor permissions by page/project | F04,F15,F20 | ACL on load/save/publish | Enterprise SSO provisioning | Direct API security tests | D2-19 |
| F22 | Security | Full application security audit | All | Auth/storage/XSS/script/ACL audit | Pen test beyond 2-day scope | No critical findings | D2-20 |
| F23 | Production | Deploy and verify | All | Production services/env/logs/smoke test | Long-term operations | Critical journeys pass | D2-24:D2-25 |
| REVISED PLATFORM BOUNDARY |  |  |  |  |  |  |
| Google Sites is the presentation/portal layer. |  |  |  |  |  |  |
| Forms are the default transaction/input mechanism. |  |  |  |  |  |  |
| Sheets are the operational record store. |  |  |  |  |  |  |
| Drive is the file store. |  |  |  |  |  |  |
| Apps Script is the automation layer. |  |  |  |  |  |  |
| The original full visual-builder specification is no longer a mandatory acceptance criterion under the revised objective. |  |  |  |  |  |  |