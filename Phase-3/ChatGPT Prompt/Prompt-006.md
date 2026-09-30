# Prompt-006 — Universal Stable ID Generation Revision

## Objective

Implement and document the frozen R49 universal stable ID generation contract across the Phase 3/Phase 4 specifications.

## Required ID formats

Use a type-specific prefix plus a six-digit zero-padded sequence:
- PRJ-000001 — Project
- EMP-000001 — Employee
- MBR-000001 — Project Member
- NOT-000001 — Project Note
- MOM-000001 — MOM
- BDG-000001 — Budget
- SPN-000001 — Spending
- CLM-000001 — OOP Claim
- SAL-000001 — Salary
- INV-000001 — Investment
- HRR-000001 — HR Request
- RPT-000001 — Report
- SUB-000001 — Submission

## Rules

1. IDs are system-generated.
2. Each prefix has an independent sequence.
3. IDs are never derived from row position or business attributes.
4. IDs are immutable and never reused.
5. Sequence gaps are allowed.
6. Apps Script PropertiesService stores counters.
7. Apps Script LockService serializes concurrent ID generation.
8. Before issuing an ID, reconcile the stored counter against the highest valid existing ID.
9. Validate prefix + six-digit format.
10. Protect record creation with idempotency/duplicate-event checks.
11. Employee_ID is the canonical employee key for employee-linked authoritative records.
12. Do not change Phase 3 workbook boundaries, Forms, or business calculations.
13. Do not implement Phase 4 automation during Phase 3 execution; this prompt freezes the contract and prepares the Phase 4 implementation requirement.

## Acceptance examples

If the Budget counter is 18, the next Budget ID is BDG-000019.
If BDG-000019 is issued and the transaction later fails, BDG-000019 must not be reused.
If an existing sheet contains BDG-000025 while the stored counter says 18, the generator must reconcile to 25 and issue BDG-000026.
If two Budget records are created concurrently, they must receive distinct IDs.

## Scope firewall

Do not introduce:
- row-number IDs;
- UUIDs as the displayed business ID;
- date-based IDs;
- employee-name/project-name-derived IDs;
- manual ID entry for normal record creation;
- counter reuse;
- a new business workbook solely for counters;
- changes to Budget_Given calculations;
- changes to Form field definitions.

Update only the relevant specifications and Phase 4 implementation contract.

## R52 Implementation Clarification — Sheet-originated Generate-ID controls
Update the Phase 4 implementation contract as follows: Project_Members, Project_Notes, Budget_Given and Salary_Admin must use explicit sheet controls to request business-ID generation. Do not generate IDs on generic row edit, on Google Sheets autosave, or merely because required cells become populated. The control validates the pending record, invokes the central ID generator under LockService, writes the generated ID, locks the ID field, and permits commit/save only after successful generation. Salary must support controlled bulk generation for validated payroll imports/entries. Employee_ID remains governed by the existing Generate Employee ID → lock → Save workflow. Submission_ID remains system/index-generated.
