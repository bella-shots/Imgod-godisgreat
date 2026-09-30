# GitHub → Existing Phase 4 Apps Script Deployment

## Purpose

GitHub is the source of truth for Phase 4 Apps Script source code.

The deployment workflow pushes the contents of:

Phase-4/Automation/

to the existing Phase 4 Google Apps Script project.

No second Apps Script project is created.

## One-time GitHub secrets

Add these repository secrets:

1. APPS_SCRIPT_ID
   - The Script ID of the existing Phase 4 Apps Script project.

2. CLASP_CREDENTIALS
   - The clasp authentication JSON for the authorized Google account that owns/controls the existing Apps Script project.

Do not commit either value to GitHub.

## Deployment behavior

A push to main that changes Phase-4/Automation/** automatically runs:

1. Checkout repository
2. Install clasp
3. Load the authorized clasp credentials
4. Target the existing Apps Script project using APPS_SCRIPT_ID
5. Push GitHub source with clasp
6. Run clasp status

The workflow can also be started manually from GitHub Actions.

## Important rule

GitHub is the source of truth.

Do not create a second Apps Script project and do not maintain a separate manually edited copy of Phase 4 source.

## First deployment

Before enabling the workflow for production:

1. Add APPS_SCRIPT_ID.
2. Add CLASP_CREDENTIALS.
3. Run the workflow manually.
4. Confirm the push succeeds.
5. Open the existing Apps Script project and confirm the expected .gs/.html files are present.
6. Run the relevant Phase 4 verification functions.

## Safety

The workflow only deploys source under Phase-4/Automation.

It does not execute business workflows, submit Forms, modify Sheets data, or move Drive assets merely by deploying code.

Business triggers/functions continue to run inside the existing Apps Script project after deployment.
