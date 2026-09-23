# Code and Documentation Standards

## General
- Prefer simple, explicit implementations.
- Keep each change narrowly scoped.
- Use stable names and IDs.
- Avoid duplicate authoritative data.
- Do not invent missing business rules.
- Keep documentation synchronized with actual implementation state.

## Google Apps Script
When Apps Script is introduced:
- Keep automation modules separated by responsibility.
- Use clear function names.
- Keep configuration separate from business logic where practical.
- Validate inputs before mutation.
- Log meaningful failures.
- Make retries safe where triggers can repeat.
- Avoid sending duplicate notifications.
- Do not hard-code secrets.
- Preserve audit fields.

## Data conventions
- Stable Project_ID
- Stable Employee_ID
- Email identity where appropriate
- Explicit status values
- ISO-compatible dates where practical
- Numeric currency values
- Drive references rather than duplicated file contents
- Created/updated timestamps
- Created/updated-by audit fields

## Documentation
Every feature spec must state:
- Goal
- Design decisions
- Dependencies
- Implementation scope
- Explicit out-of-scope items
- Verification checklist

## Change discipline
Do not refactor unrelated files while implementing a feature.
