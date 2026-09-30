# Universal Stable ID Generation Specification

**Phase:** 4 — Apps Script Automation  
**Applies to:** All authoritative business records defined by Phase 3  
**Status:** Frozen implementation contract  
**Revision:** R49

## 1. Purpose

Define one deterministic, collision-safe mechanism for generating stable IDs for all authoritative records.

## 2. Canonical formats

| Record | Prefix | Format | Example |
|---|---|---|---|
| Project | PRJ | `PRJ-000001` | `PRJ-000027` |
| Employee | EMP | `EMP-000001` | `EMP-000105` |
| Project Member | MBR | `MBR-000001` | `MBR-000189` |
| Project Note | NOT | `NOT-000001` | `NOT-000063` |
| MOM | MOM | `MOM-000001` | `MOM-000041` |
| Budget | BDG | `BDG-000001` | `BDG-000019` |
| Spending | SPN | `SPN-000001` | `SPN-000227` |
| OOP Claim | CLM | `CLM-000001` | `CLM-000036` |
| Salary | SAL | `SAL-000001` | `SAL-000842` |
| Investment | INV | `INV-000001` | `INV-000012` |
| HR Request | HRR | `HRR-000001` | `HRR-000055` |
| Report | RPT | `RPT-000001` | `RPT-000031` |
| Submission | SUB | `SUB-000001` | `SUB-000096` |

## 3. Generation algorithm

1. The caller supplies only the record type/prefix.
2. Apps Script acquires a script-level lock with `LockService`.
3. Read the stored counter for that prefix from `PropertiesService`.
4. Inspect the authoritative source for the highest valid existing numeric ID for that prefix.
5. Set the working counter to the greater of the stored counter and the highest existing number.
6. Increment the counter by one.
7. Format the number as six digits.
8. Construct `PREFIX-NNNNNN`.
9. Validate the resulting ID against the expected prefix and six-digit pattern.
10. Persist the updated counter.
11. Return the generated ID to the controlled record-creation transaction.
12. Release the lock.

## 4. Independent counters

Each prefix has its own counter. For example, `EMP-000105` does not affect the next Budget ID.

Conceptual PropertiesService keys:
`ID_COUNTER_PRJ`, `ID_COUNTER_EMP`, `ID_COUNTER_MBR`, `ID_COUNTER_NOT`, `ID_COUNTER_MOM`, `ID_COUNTER_BDG`, `ID_COUNTER_SPN`, `ID_COUNTER_CLM`, `ID_COUNTER_SAL`, `ID_COUNTER_INV`, `ID_COUNTER_HRR`, `ID_COUNTER_RPT`, `ID_COUNTER_SUB`.

## 5. Stability and reuse

- IDs are immutable after assignment.
- IDs are never generated from row number, name, date, email, project name or other business attributes.
- IDs are never reused.
- Deletion, cancellation, employee exit, or a failed transaction may leave a sequence gap.
- A gap is valid and must not be filled later.
- Employee_ID remains the canonical employee reference throughout employee-linked records.

## 6. Concurrency and duplicate events

`LockService` is mandatory around counter read/increment/write.
Every record-creation workflow must also perform an idempotency check so the same Form submission/event cannot create duplicate authoritative records.

## 7. Recovery

If the stored counter is stale or lower than an existing valid ID, the generator must advance from the highest valid existing ID before issuing the next ID.
The generator must never move a counter backwards.

## 8. Failure behavior

- preserve the source/intake record;
- log the failure;
- do not reuse an already-issued ID;
- retry only through the controlled workflow;
- do not silently create a second record.

## 9. Phase boundary

Phase 3 freezes the ID formats and invariants.
Phase 4 implements the Apps Script generator, locking, counters, reconciliation, validation and idempotency.
No manual ID-generation process is required for normal operations.