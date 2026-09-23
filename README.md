# Master Website

Internal company operations portal built around the agreed 5-phase Google-native architecture.

## Architecture

- Google Drive — file and folder foundation
- Google Sites — master portal
- Google Sheets — operational data
- Google Forms — controlled data entry
- Google Apps Script — automation
- Gmail / Google Accounts — notifications and access

## Authoritative 5-Phase Build

1. Phase 1 — Google Drive structure
2. Phase 2 — Master Google Site
3. Phase 3 — Google Sheets + Forms
4. Phase 4 — Apps Script automation
5. Phase 5 — Testing + permissions + handover

## Cost Constraint

Target: ₹0 additional software/service spend.

## Current Status

Repository initialized for the actual implementation. The planning/workbook specification is complete; the Google system itself still needs to be executed phase by phase.

## Repository Structure

- docs/architecture/
- docs/phases/
- docs/decisions/
- drive/
- site/
- sheets/
- forms/
- apps-script/

The repository is the implementation source of truth. Google services remain the runtime/source-of-data layer where specified by the architecture.
