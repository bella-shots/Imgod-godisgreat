# Feature 04 — Apps Script Automation

## Goal
Automate approved business workflows after the Drive, Site, Sheets and Forms foundations are verified.

## Dependency
Feature 03 must be verified.

## Required automation modules
- Project processing
- Drive project-folder automation
- Expense processing
- OOP claim processing
- Salary carry-forward
- MOM processing
- MOM email sender
- Report generator
- Notification engine
- Audit logger
- Error handler

## Required workflows
- MOM published/updated notification
- Expense exception notification
- OOP approval request
- OOP status update
- Admin automation failure notification
- Report available notification

## Business rules
- Stable IDs
- Expense validation
- OOP validation
- Exact approved ₹5,000 rule only where the authoritative requirement specifies it
- Salary carry-forward
- MOM recipients
- MOM versioning
- Notification deduplication
- Reports from authoritative data
- Drive references
- Failure safety and auditability

## Scope
Implement only verified rules from the Phase-4 specifications.

## Out of scope
- New business rules invented by the agent.
- New paid services.
- Replacement databases.
- Unapproved architecture changes.

## Verification
Every automation has a controlled test input, expected result, failure path and audit outcome.
