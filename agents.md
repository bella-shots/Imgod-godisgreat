# AI Development Agent Instructions

## IMPORT SAFETY GATE

When this repository is first imported into an AI development environment, **STOP before making any implementation change**. Read `Main Prompt/Main-Prompt.md` first, then this file, then the required `context/` files and current feature prompt. Do not scaffold an application, initialize React/Vite/Node, create demo code, or modify/delete files merely because the repository was imported. Determine the current authorized phase from `context/progress-tracker.md` and follow only its authoritative prompt. If the repository does not provide enough information to determine the next action, stop and request clarification rather than improvising.


## Purpose
This repository is developed using the spec-driven, architecture-first workflow defined by the project playbook.

## Authoritative order
When instructions conflict, use this order:
1. `agents.md`
2. `context/project-overview.md`
3. `context/architecture-context.md`
4. `context/code-standards.md`
5. `context/ai-workflow-rules.md`
6. `context/ui-context.md`
7. `context/progress-tracker.md`
8. The requested feature specification
9. Phase documentation under `Phase-1` through `Phase-5` as supporting source material

## Mandatory workflow
Before changing implementation:
1. Read all required context files.
2. Read the requested feature specification completely.
3. Check `progress-tracker.md`.
4. Mark the feature IN PROGRESS before implementation.
5. Produce a concise implementation plan.
6. Implement only the requested feature.
7. Do not invent unspecified behavior.
8. Do not expand scope into later features.
9. Preserve architecture boundaries and security invariants.
10. Verify the feature against its acceptance checks.
11. Review the change for unrelated modifications.
12. Update `progress-tracker.md` with status, decisions, verification, and next work.

## Hard boundaries
- Do not reintroduce the discarded React/Vite/localStorage architecture.
- The authoritative application architecture is Google Sites + Google Sheets + Google Forms + Google Drive + Google Apps Script.
- Do not introduce paid services without an explicit approved architecture change.
- Do not treat browser/client visibility as security.
- Salary, Investment, restricted Finance and restricted HR data must remain access-controlled.
- Do not silently reinterpret business rules.
- Do not implement a later phase while an earlier phase is incomplete.
- Do not claim a feature is complete without observable verification.

## Questions and defects
If a required behavior is ambiguous, record the open question and resolve it before implementing dependent behavior.

For defects:
1. Capture the exact error or failed behavior.
2. Identify the smallest affected boundary.
3. Inspect the relevant contract/current best practice.
4. Make the smallest root correction.
5. Re-run the focused verification.
6. Update the progress tracker.

## Completion rule
A feature is complete only when:
- the specified behavior exists,
- acceptance checks pass,
- architecture/security invariants remain intact,
- no unrelated scope was added,
- documentation/state is updated.
