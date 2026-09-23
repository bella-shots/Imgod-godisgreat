| ID | Acceptance test | Expected result | Status |
|---|---|---|---|
| P4-01 | Deploy the approved Apps Script project. | Script is associated with the approved Google environment and required authorizations are granted. | NOT STARTED |
| P4-02 | Test project processing. | Valid project input creates/locates the required Drive structure and updates the project record correctly. | NOT STARTED |
| P4-03 | Test expense processing. | Valid expense submission is validated, stored and given the correct processing status. | NOT STARTED |
| P4-04 | Test invalid expense. | Invalid/missing data is flagged safely without corrupting the source record. | NOT STARTED |
| P4-05 | Test OOP claim processing. | Claim is validated and routed according to the approved workflow. | NOT STARTED |
| P4-06 | Test ₹5,000 rule. | The approved rule is calculated exactly as specified; no unapproved interpretation is introduced. | NOT STARTED |
| P4-07 | Test salary carry-forward. | Monthly salary records produce the approved carry-forward while preserving historical records. | NOT STARTED |
| P4-08 | Test MOM publish/update. | MOM record/version/index is updated and the correct recipients are identified. | NOT STARTED |
| P4-09 | Test MOM email. | Email is sent to the approved recipient list and send result is logged. | NOT STARTED |
| P4-10 | Test report generation. | Defined report is generated from authoritative Phase 3 data and indexed in Drive. | NOT STARTED |
| P4-11 | Test duplicate trigger protection. | Retrying the same event does not create duplicate folders, records or emails. | NOT STARTED |
| P4-12 | Test failure handling. | Forced error creates a visible failure state and appropriate admin notification/log entry. | NOT STARTED |
| P4-13 | Test sensitive access. | Automation does not broaden employee access to restricted Finance, Salary, Investment or HR source data. | NOT STARTED |
| P4-14 | Test quota-safe behavior. | Expected internal workload does not require unlimited email/trigger/runtime assumptions; deferred/failure behavior is controlled. | NOT STARTED |
| P4-15 | Verify zero additional-cost boundary. | No paid automation, hosting, database, email API or Workspace subscription has been introduced. | NOT STARTED |
| P4-16 | Phase 4 closure. | All Phase 4 tests PASS and evidence is recorded; system is ready for Phase 5 final testing/handover. | NOT STARTED |