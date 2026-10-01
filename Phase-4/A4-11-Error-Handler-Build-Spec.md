# A4-11 Error Handler — Build Specification

## Purpose
Centralize Phase 4 automation failure handling without creating a parallel error database.

## Authoritative sources
- Phase-4/Phase-4-Error-Handling.md
- Phase-4/Phase-4-Access-Security.md
- Phase-4/Phase-4-Triggers.md
- Phase-4/Phase-4-Email-Workflows.md
- Phase-4/Phase-4-Business-Rules.md
- Phase-3/Phase-3-Schema-Blueprint.md — Submission_Index
- Phase-3/Phase-3-Data-Rules.md
- A4-10 Audit Logger
- A4-09 Notification Engine

## Contract
1. Preserve the original/source record or Form response on every failure.
2. Never silently mark a failed transaction as completed.
3. If a Submission_ID exists, update Submission_Index Processing_Status to Validation Failed for validation failures or Manual Review for recoverable/system/manual-intervention failures.
4. A4-10 is the sole authoritative Submission_Index writer.
5. A4-11 must not create a second error-log sheet or database.
6. Detailed technical error information is retained in execution logs (console.error / Apps Script logs); broad-access Submission_Index stores only its frozen six fields.
7. Critical automation failures use A4-09 ADMIN_AUTOMATION_FAILURE.
8. Notification failures must not destroy or overwrite the parent business/source record and must remain safely retryable.
9. No uncontrolled retry loop. Retry is explicit/controlled only.
10. Duplicate/replayed failure events must be idempotent.
11. Sensitive values must never be placed into audit rows, notification content, or broad-access error messages.
12. Use only native Apps Script/Sheets/PropertiesService/LockService/MailApp through A4-09. No paid/external service.
13. If an A4-00 ID has already been issued and a later commit fails, never reuse that ID; preserve the pending/manual-review state.
14. Error handling must be non-blocking where possible: failure to write audit/notification metadata must not corrupt the parent transaction.
15. A4-11 is a reusable central API called by existing modules' catch/failure paths, not a replacement business processor.

## Public API
- handleA411Error(options)
  - module, error, sourceForm/source, recordId, submissionId
  - statusHint: VALIDATION_FAILED | MANUAL_REVIEW
  - eventKey/idempotencyKey
  - notifyAdmin (default true for critical failures)
  - preserveSource (default true)
  - contextLink/remediationLink when safe
- verifyA411ErrorHandlerPrerequisites()
- testA411ErrorHandlerLive()

## Failure processing
1. Normalize the error to a safe code/message.
2. Redact sensitive content.
3. Determine target Submission_ID if supplied.
4. If no Submission_ID exists and the failure originates from a Form/intake event, create one through A4-10 with the appropriate failure status.
5. If Submission_ID exists, update it through A4-10 in place.
6. Log detailed technical context with Apps Script execution logging.
7. Dispatch A4-09 ADMIN_AUTOMATION_FAILURE exactly once for the same module/record/status event.
8. Return a structured failure result unless the caller explicitly requests rethrow.
9. Preserve the original source record and any already-issued business ID.

## Idempotency
Use a deterministic A4-11 property key based on source/module + record/submission + failure status. Store only a compact execution marker/result, not sensitive payloads. Replays return SKIPPED/ALREADY_HANDLED and do not create duplicate Submission_Index rows or notifications.

## Required live verification
1. Prerequisites pass.
2. Valid failure is captured.
3. Existing Submission_ID transitions to Manual Review.
4. Validation failure uses Validation Failed.
5. Missing Submission_ID can create a Submission_Index failure record when source metadata is sufficient.
6. Source record preservation.
7. Duplicate failure event is idempotent.
8. A4-09 admin notification is dispatched.
9. Notification failure does not destroy parent/source state.
10. Sensitive-data redaction.
11. No uncontrolled retry / explicit retry only.
12. Zero-cost/native-service boundary.
13. Already-issued ID is never reused after commit failure.
14. Cleanup leaves production rows/properties unchanged except controlled audit evidence.

## Acceptance boundary
A4-11 is not PASS merely because the code exists. It requires an actual live Apps Script execution of testA411ErrorHandlerLive() with all required checks passing.