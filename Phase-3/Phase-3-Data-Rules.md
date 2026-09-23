| ID | Data rule | Implementation in Phase 3 | Phase 4 relevance |
|---|---|---|---|
| D3-01 | Every core business record must have a stable unique ID. | Create ID columns and define formats: PROJECT_ID, EMPLOYEE_ID, CLAIM_ID, SPENDING_ID, MOM_ID, INVESTMENT_ID, etc. | Automation must reference IDs, not row numbers. |
| D3-02 | Dates use a consistent date format. | Use actual Sheet date values; standardize display format. | Calculations/reminders depend on valid dates. |
| D3-03 | Amounts are numeric currency values. | Use numeric cells with consistent INR/currency formatting. | Expense, salary and reimbursement calculations. |
| D3-04 | Employee identity uses email + Employee_ID. | Do not rely solely on free-text employee names. | Access and automation mapping. |
| D3-05 | Project identity uses Project_ID. | Forms should use controlled project selection where feasible. | Project aggregation/reporting. |
| D3-06 | Proof/attachment fields store Drive references/URLs. | Do not store binary files inside Sheets. | Automation can route/check files. |
| D3-07 | Status fields use controlled values. | Maintain lists in CONFIG and use data validation where feasible. | Automation branches on defined status values. |
| D3-08 | Sensitive tabs are restricted. | Do not give employees broad Editor access to salary/investment/full finance source tabs. | Automation runs against restricted sources. |
| D3-09 | Forms should collect only required business data. | Avoid unnecessary personal/sensitive information. | Reduces exposure and maintenance. |
| D3-10 | Do not hard-code the ₹5,000 rule beyond the frozen requirement. | Keep the exact calculation/allowance/extra-line/approval/salary-treatment semantics explicit for Phase 4. | Phase 4 must implement only the approved interpretation. |
| D3-11 | Do not duplicate authoritative data manually. | Use references/IDs between Projects, Employees, Expenses, Claims and reports. | Prevents reconciliation problems. |
| D3-12 | Submission timestamp and submitter should be captured where relevant. | Enable automatic Form timestamp and capture submitter identity where the chosen Form access model permits. | Audit trail and notifications. |