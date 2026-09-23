# AI Workflow Rules

## Operating model
The human remains the system architect. The AI agent is the implementation engine.

The agent must not infer that a broad request authorizes the whole application. It must execute one bounded feature unit at a time.

## Before implementation
- Read `agents.md`.
- Read the required context files.
- Read the requested feature specification completely.
- Inspect the current progress tracker.
- Identify dependencies and open questions.
- Mark the feature IN PROGRESS.
- Plan before changing anything.

## During implementation
- Implement exactly the specification.
- Do not invent behavior.
- Do not silently alter architecture.
- Do not cross phase boundaries.
- Preserve security and data ownership invariants.
- Split unrelated work into separate feature units.
- Prefer provider-native Google capabilities.

## Verification
Verification must be observable and tied to the feature specification.
A build or successful script save is not proof that the business behavior works.

## Corrections
For a defect, use the smallest corrective change that fixes the root boundary. Do not re-prompt the whole project.

## State management
After implementation:
- record what changed,
- record verification,
- record decisions,
- record open issues,
- record the next feature.

## AI output
AI-generated plans or reports are not authoritative merely because they sound complete. The repository's architecture context, feature specs, progress state and verified behavior are authoritative.
