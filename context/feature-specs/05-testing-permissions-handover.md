# Feature 05 — Testing, Permissions and Handover

## Goal
Verify the integrated system and complete controlled handover.

## Dependency
Feature 04 must be verified.

## End-to-end checks
- Employee opens Master Site.
- Employee accesses permitted project information.
- Employee submits an expense.
- Employee submits an OOP claim.
- Authorized admin processes expense/claim.
- Salary processing works for authorized users.
- MOM is created/published.
- MOM update creates the expected version/notification behavior.
- Report generation works.
- Project onboarding works.
- Mobile use is acceptable.
- Automation failure/retry behavior is understood.

## Security checks
- Site access
- Finance source-sheet restriction
- Salary_Admin restriction
- Investments restriction
- Restricted HR restriction
- Site editing restriction
- Project file sharing
- Admin sensitive access
- Form identity
- Automation permissions
- Public exposure check
- Former/inactive employee access

## Cost/quota gate
Verify:
- No new paid service is required.
- Apps Script email/runtime/trigger quotas are understood.
- Drive/storage usage is acceptable.
- Forms/Sheets usage is acceptable.
- Quota failure behavior is safe.

## UAT
A representative employee and authorized administrator complete the required workflows.

## Handover
Deliver:
- Drive structure
- Site
- Sheets
- Forms
- Apps Script
- automation map
- permissions map
- maintenance guide
- backup/recovery guidance
- quota/cost note
- known limitations
- UAT sign-off
- final closure

## Done condition
All critical acceptance tests pass, no unresolved critical security/access defect remains, no business-blocking defect remains, cost/quota gate passes, UAT passes and handover is complete.
