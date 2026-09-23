| FULL WEBSITE BUILDER — CAPABILITY CHECKLIST |  |  |  |  |  |  |  |
|---|---|---|---|---|---|---|---|
| Capability | Required | Engine Responsibility | Our Integration | Security / Persistence | Acceptance Test | Day/Task | Status |
| Drag & drop components | Yes | Editor canvas/component system | Configure component palette | Persist component tree | Drag text/image/button/container and save | D1-19 | Not Started |
| Move/reposition | Yes | Canvas selection/commands | Configure commands | Persist positions | Move component and reload | D1-19 | Not Started |
| Resize | Yes | Canvas/style manager | Configure dimensions/handles | Persist width/height | Resize desktop/mobile independently | D1-19,D2-10 | Not Started |
| Arbitrary columns | Yes | Nested containers/layout system | Configure flex/grid/containers | Persist hierarchy | Build 3-column + nested layout | D2-10 | Not Started |
| Free-form placement where supported | Yes | Editor positioning | Enable absolute/relative positioning modes | Validate page scope | Place element independently without breaking others | D2-10 | Not Started |
| Layers/component tree | Yes | Editor layer manager | Expose tree panel | Persist hierarchy | Select nested element from tree | D2-10 | Not Started |
| Undo/redo | Yes | Editor command/history system | Configure history | Version snapshot | Undo/redo multiple changes | D1-19 | Not Started |
| Typography | Yes | Style manager | Expose font/size/weight/line height | Persist style rules | Style heading/text | D2-12 | Not Started |
| Colors/backgrounds | Yes | Style manager | Expose controls | Persist | Change background/color | D2-12 | Not Started |
| Spacing | Yes | Style manager | Margin/padding/gap controls | Persist | Change spacing | D2-12 | Not Started |
| Flex/grid | Yes | Style manager | Expose layout properties | Persist | Responsive flex/grid test | D2-10,D2-12 | Not Started |
| Responsive breakpoints | Yes | Device manager | Desktop/tablet/mobile + custom breakpoints | Persist per device | Different mobile layout | D2-11 | Not Started |
| Animations | Yes | Commands/plugins/CSS | Configure animation controls | Persist animation definition | Preview animation | D2-13 | Not Started |
| Interactions/events | Yes | Commands/components | Configure click/hover actions | Persist event config | Button interaction test | D2-13 | Not Started |
| Custom CSS | Yes | CSS/style system | Page + component CSS editor | Scoped/persisted | Custom CSS changes page | D2-14 | Not Started |
| Custom JavaScript | Yes | Script/component/plugin boundary | Admin-controlled script editor + sandbox | Isolated runtime | Script executes in preview/published page | D2-15 | Not Started |
| Themes | Yes | Global style/template system | Theme selector + tokens | Persist theme version | Apply theme to page | D2-16 | Not Started |
| Templates | Yes | Page/component storage | Save as template/duplicate | Versioned | Create page from template | D2-16 | Not Started |
| Plugins/extensions | Yes | Editor plugin API | Registration + admin controls | Version/allowlist | Load test extension | D2-17 | Not Started |
| Pages | Yes | Page manager | Create/rename/delete/duplicate | DB persistence | Create 2 pages | D2-18 | Not Started |
| Assets | Yes | Asset manager | Upload images/files | Object storage + ACL | Upload and reuse asset | D2-18 | Not Started |
| Preview | Yes | Editor runtime | Preview route | No edit controls | Preview matches published | D2-18 | Not Started |
| Publish/unpublish | Yes | Page storage/runtime | Draft/published state | Versioned | Publish then unpublish | D2-18 | Not Started |
| Version snapshots | Yes | Storage/version layer | Save page versions | Immutable snapshot | Restore prior version | D2-18 | Not Started |
| Permissions | Yes | App API/auth layer | Page/site ACL | Server enforced | Direct API denial | D2-19 | Not Started |
| BUILDER COST RULE | Use the open-source editor core and open-source/custom extensions. No paid visual-editor plugin is mandatory. The builder must remain fully customizable: drag/drop, arbitrary layouts, resize, responsive breakpoints, animations, custom CSS/JS, themes, templates, plugins/extensions, pages and publishing. |  |  |  |  |  |