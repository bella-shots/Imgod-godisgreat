| FULL REQUIREMENTS → IMPLEMENTATION MAPPING |  |  |  |  |  |  |  |
|---|---|---|---|---|---|---|---|
| ID | User Requirement | Implementation | Data/Service | Access | Acceptance Test | Priority | Checklist IDs |
| R01 | Master website: Projects / Finance / HR | Master shell + protected modules | Google Sheets + Google Account / Gmail-based access and sharing | All | Each module opens and respects role | P0 | D1-10 |
| R02 | Create/edit projects | Project CRUD + members | DB | Configurable | Admin/user with access can create/edit as configured | P0 | D1-11 |
| R03 | Event date countdown | Live countdown component | Project DB | Project access | Correct time remaining + expired state | P0 | D1-12 |
| R04 | Upload ready checklist Excel and reflect on site | File upload + metadata + preview/download | Google Drive + Google Sheets | Project access | Upload persists and appears in project | P0 | D1-13 |
| R05 | Upload ready expense Excel and reflect on site | File upload + structured expense ledger | Google Drive + Google Sheets | Project access | File visible + records calculate | P0 | D1-14,D1-15 |
| R06 | Budget given to whom + employee spending purpose/date | Allocation and expense records | DB | Project access; approvals configurable | Budget vs spent totals reconcile | P0 | D1-15 |
| R07 | MOM automatically emailed after update | MOM editor + async email job | DB + email service | Project access | Registered IDs receive update; send logged | P0 | D2-07,D2-08 |
| R08 | OOP monthly reimbursement | Claim workflow + approval | DB | Employee own; admin approval | Claim flows into salary payout | P0 | D1-18,D2-03 |
| R09 | General notes | Persistent notes | DB | Page/project access | Edit and reload | P0 | D2-09 |
| R10 | Admin-only salary sheet | Salary ledger | DB | Admin only | Direct unauthorized API blocked | P0 | D1-17 |
| R11 | Monthly due salary + carry-forward | Salary payment ledger | DB | Admin | Pending carries without data loss | P0 | D2-04 |
| R12 | Generate salary report | Report generator | Server/report library | Admin | Report totals match ledger | P0 | D2-05 |
| R13 | ₹5,000 OOP rule | Configurable calculation engine | DB/service | Admin config + employee claims | Below/equal/above threshold tests pass | P0 | D2-02,D2-03 |
| R14 | Admin-only investment details | Investment ledger | DB | Admin only | Standard user cannot read/write | P0 | D2-06 |
| R15 | Anyone with access can edit | Permission-aware editor | Auth + page ACL | Per page/site | Allowed user can edit and save | P0 | D2-19 |
| R16 | Admin-controlled pages | Protected pages + server rules | Auth + ACL | Admin | Non-admin blocked | P0 | D2-19,D2-20 |
| R17 | Create new website sheet/page | Full multi-page builder | Editor engine + DB | Configurable | Create/delete/duplicate/publish pages | P0 | D2-18 |
| R18 | Drag anything anywhere | Visual editor canvas | Editor engine | Editor access | Drag/drop/reposition elements | P0 | D1-19,D2-10 |
| R19 | Resize elements | Canvas/style manager | Editor engine | Editor access | Resize selected components | P0 | D1-19,D2-10 |
| R20 | Arbitrary columns/layouts | Nested containers + flex/grid | Editor engine | Editor access | Create complex multi-column layout | P0 | D2-10 |
| R21 | Animations | Animation/interaction controls | Editor engine/plugin | Editor access | Preview animation | P0 | D2-13 |
| R22 | Custom CSS | Scoped page/component CSS | DB + editor | Configurable; admin for sensitive pages | CSS persists and renders | P0 | D2-14 |
| R23 | Custom JavaScript | Isolated page script runtime | Sandboxed iframe/published runtime | Admin or explicit role | JS runs without compromising app shell | P0 | D2-15 |
| R24 | Themes | Global styles + templates | Editor + DB | Admin/configurable | Apply theme to new page | P0 | D2-16 |
| R25 | Plugins | Plugin registration boundary | Editor plugin API | Admin | Test plugin loads | P0 | D2-17 |
| R26 | Responsive breakpoint editor | Device manager | Editor engine | Editor access | Desktop/tablet/mobile settings persist | P0 | D2-11 |
| R27 | Fully customizable pages | Pages/assets/components/styles/scripts/publish | Editor + storage | ACL | Build a nontrivial custom page end-to-end | P0 | D2-10:D2-18 |
