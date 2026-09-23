# Feature 01 — Google Drive Structure

## Goal
Create the authoritative Google Drive folder structure for the Master Company system.

## Dependencies
- Project overview
- Architecture context
- Existing Phase-1 documentation

## Required structure
MASTER COMPANY
├── Projects
├── Finance
├── HR
├── Templates
├── MOM
└── Reports

Each project must support:
- 01_Admin
- 02_Checklist
- 03_Expenses
- 04_MOM
- 05_Notes
- 06_Files
- 07_Reports

## Scope
- Create/verify the root structure.
- Establish naming conventions.
- Establish access expectations.
- Record the authoritative folder IDs/locations when the real Google environment is available.

## Out of scope
- Google Site
- Sheets
- Forms
- Apps Script automation
- Email automation
- Business calculations

## Verification
- Root folder exists.
- Six required top-level folders exist.
- Project template structure is available.
- Sensitive top-level areas have restricted sharing.
- No required folder is publicly exposed.
- Actual folder locations/IDs are recorded for the next phase.

## Done condition
All acceptance checks pass and the progress tracker records the verified Drive structure.
