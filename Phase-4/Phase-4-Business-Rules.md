| ID | Business rule / behavior | Automation requirement | Important constraint |
|---|---|---|---|
| B4-01 | Stable record identity | Use Project_ID, Employee_ID, Claim_ID, Spending_ID, MOM_ID, Salary_Record_ID and Investment_ID as applicable. | Never identify records only by row position. |
| B4-02 | Expense validation | Reject/flag missing employee, date, amount, project or required proof according to the Phase 3 field definition. | Do not silently alter submitted values. |
| B4-03 | OOP claim validation | Validate month/date/amount/project/proof and employee eligibility before approval processing. | Do not auto-approve unless explicitly authorized. |
| B4-04 | ₹5,000 rule | Implement only the exact interpretation approved for the project. | Do not invent allowance treatment, extra ₹5,000 line, approval behavior or salary treatment. |
| B4-05 | Salary carry-forward | Calculate pending amount using approved salary fields and preserve monthly history. | Do not overwrite prior month records. |
| B4-06 | MOM recipients | Use registered participant/recipient email IDs from the approved MOM workflow. | Do not email arbitrary contacts unless the workflow authorizes them. |
| B4-07 | MOM versioning | Every published/update event must retain version/status metadata. | Do not destroy the prior version history. |
| B4-08 | Notifications | Send only notifications required by defined workflow events. | Avoid duplicate notifications on retries. |
| B4-09 | Reports | Reports must read from authoritative Phase 3 structures. | Do not create a second hidden database. |
| B4-10 | Drive links | Write/maintain stable Drive URLs or IDs for relevant project/report/MOM artifacts. | Do not rely on manually copied links where automation can maintain them. |
| B4-11 | Failure safety | A failed automation must leave the source record intact and visibly marked as failed/pending. | Never silently mark a failed transaction as completed. |
| B4-12 | Auditability | Important automated actions should have timestamp, record ID, action/result and error information when applicable. | Use the Phase 3 audit/submission structure. |