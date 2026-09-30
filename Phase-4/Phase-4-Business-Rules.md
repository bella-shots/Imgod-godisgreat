| ID | Business rule / behavior | Automation requirement | Important constraint |
|---|---|---|---|
| B4-01 | Stable record identity | Use Project_ID, Employee_ID, Claim_ID, Spending_ID, MOM_ID, Salary_Record_ID and Investment_ID as applicable. | Never identify records only by row position. |
| B4-02 | Expense validation | Reject/flag missing employee, date, amount, project or required proof according to the Phase 3 field definition. | Do not silently alter submitted values. |
| B4-03 | OOP claim validation | Validate claim date/amount/project/proof and employee eligibility before approval processing. Derive reporting month from the claim date when required; do not require or store a separate OOP month field. | Do not auto-approve unless explicitly authorized. |
| B4-04 | ₹5,000 rule | Implement only the exact interpretation approved for the project. | Do not invent allowance treatment, extra ₹5,000 line, approval behavior or salary treatment. |
| B4-05 | Salary carry-forward | Calculate pending amount using approved salary fields and preserve monthly history. | Do not overwrite prior month records. |
| B4-06 | MOM recipients | Use registered participant/recipient email IDs from the approved MOM workflow. | Do not email arbitrary contacts unless the workflow authorizes them. |
| B4-07 | MOM versioning | Every published/update event must retain version/status metadata. | Do not destroy the prior version history. |
| B4-08 | Notifications | Send only notifications required by defined workflow events. | Avoid duplicate notifications on retries. |
| B4-09 | Reports | Reports must read from authoritative Phase 3 structures. | Do not create a second hidden database. |
| B4-10 | Drive links | Write/maintain stable Drive URLs or IDs for relevant project/report/MOM artifacts. | Do not rely on manually copied links where automation can maintain them. |
| B4-11 | Failure safety | A failed automation must leave the source record intact and visibly marked as failed/pending. | Never silently mark a failed transaction as completed. |
| B4-12 | Auditability | Important automated actions should have timestamp, record ID, action/result and error information when applicable. | Use the Phase 3 audit/submission structure. |
| B4-00 | Universal stable ID generation | Generate every authoritative record ID through the central Apps Script ID generator using the record-type prefix and six-digit zero-padded sequence. | IDs must never depend on row position or business attributes; never reuse an issued ID. |


## R52 — Explicit Generate-ID controls for Sheet-originated records
- For Project_Members, Project_Notes, Budget_Given and Salary_Admin, ID generation is explicitly user/system initiated through the designated Generate-ID control. Generic onEdit/autosave events must never issue a business ID. The generator validates the pending row, serializes issuance with LockService, writes the ID, locks the ID field, and only then permits commit/save. Salary supports controlled bulk generation for validated payroll imports/entries. Employee_ID retains its frozen dedicated workflow.


## R54 — Form attachment Drive routing business rules
- FRM-02 Employee Spending and FRM-03 OOP Claims proofs/receipts are project-linked files and must be routed to the exact existing Phase 1 project subfolder '03_Expenses'.
- FRM-04 HR supporting documents must be routed to the existing 'MASTER COMPANY/HR' folder; do not invent employee-specific subfolders.
- FRM-05 has no file-upload field. MOM artifacts are stored in the existing project '04_MOM' subfolder and the resulting URL is recorded in Project_MOM_Index.Drive_URL.
- Routing uses the exact human-facing Project Name to resolve the canonical project and its Drive folder; it must not guess a project.
- Destination-folder permissions remain authoritative. No public sharing or permission broadening is allowed.
- Routing must be idempotent; retries must not create duplicate business copies.


## R55 — Master Drive asset placement business rules
- The Google Site file, four master workbooks and seven Forms have frozen authoritative Drive destinations defined by R55.
- Phase 4 must verify the current Drive parent for every asset and relocate an existing misplaced asset when authorized and technically possible.
- Do not create a replacement workbook, Form or Site when the existing asset can be located and moved.
- Do not silently choose an alternate folder or create a new folder outside the frozen Phase 1 hierarchy.
- Placement is idempotent and must not duplicate assets on retries.
- Existing workbook contents, Form questions/response destinations, and Site content must be preserved during placement.
- If an asset is missing, ambiguous, inaccessible, or cannot be moved without human action, preserve the current source state and surface HUMAN ACTION REQUIRED; do not mark placement PASS.

- The Google Site file, four master workbooks and seven Forms have frozen authoritative Drive destinations defined by R55.
- Phase 4 must verify the current Drive parent for every asset and relocate an existing misplaced asset when authorized and technically possible.
- Do not create a replacement workbook, Form or Site when the existing asset can be located and moved.
- Do not silently choose an alternate folder or create a new folder outside the frozen Phase 1 hierarchy.
- Placement is idempotent and must not duplicate assets on retries.
- Existing workbook contents, Form questions/response destinations, and Site content must be preserved during placement.
- If an asset is missing, ambiguous, inaccessible, or cannot be moved without human action, preserve the current source state and surface HUMAN ACTION REQUIRED; do not mark placement PASS.
