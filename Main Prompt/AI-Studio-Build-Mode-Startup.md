# Google AI Studio Build Mode — Startup Prompt

## Purpose

This is the **first prompt to execute in Google AI Studio Build Mode after importing this repository**.

It is intentionally a control prompt, not an application-building prompt.

## STARTUP PROMPT

Copy the block below into the Google AI Studio Build Mode prompt box and execute it **before asking for any implementation**:

---

You are operating inside an existing controlled repository.

**DO NOT BUILD AN APPLICATION YET.**

Your first task is repository initialization and instruction loading only.

### Mandatory first actions

1. Read `Main Prompt/Main-Prompt.md`.
2. Read `AGENTS.md`.
3. Read `.agents/AGENTS.md`.
4. Read `agents.md`.
5. Read all required files under `context/`.
6. Read `context/progress-tracker.md`.
7. Determine the current authorized phase and feature from the progress tracker.
8. Locate the authoritative `ChatGPT Prompt/Prompt-NNN.md` for that current phase.
9. Read that prompt completely.
10. Read the supporting documentation required by that prompt.

### ABSOLUTE RESTRICTIONS DURING THIS STARTUP TURN

- Do NOT create application code.
- Do NOT initialize React.
- Do NOT initialize Vite.
- Do NOT initialize Node/npm.
- Do NOT initialize Firebase.
- Do NOT create a database.
- Do NOT create demo data.
- Do NOT create placeholder UI.
- Do NOT create configuration files for an application.
- Do NOT delete or rewrite project documentation.
- Do NOT change architecture.
- Do NOT implement Phase 2, 3, 4, or 5 while an earlier phase is active.
- Do NOT claim anything is complete without actual evidence.
- Do NOT invent missing requirements, IDs, URLs, credentials, permissions, test results, or business rules.

### ARCHITECTURE

The approved architecture is:

Google Sites + Google Sheets + Google Forms + Google Drive + Google Apps Script.

Do not replace this architecture.

### REQUIRED OUTPUT

After reading the repository, return a concise:

**REPOSITORY UNDERSTANDING REPORT**

containing:

1. Current authorized phase
2. Current authorized feature
3. Authoritative implementation prompt path
4. What the repository says is already completed
5. What remains to be done
6. Any required human action
7. Any ambiguity or missing authoritative input

Then **STOP**.

Do not implement anything in this startup turn.

Only continue to implementation when a subsequent instruction explicitly authorizes the current feature and the authoritative phase prompt permits implementation.

---

## Why this exists

Google AI Studio Build Mode officially supports importing an existing GitHub repository and then executing prompts against the imported application. This file gives that first prompt a version-controlled, repeatable source rather than relying on memory or an ad-hoc chat message.

This is **not** claimed to be a hidden system hook or automatic Build Mode trigger. The actual Build Mode prompt execution remains the explicit trigger.

## After startup

Once the Repository Understanding Report is correct, the next prompt must follow:

**READ → DETERMINE CURRENT STATE → SELECT AUTHORITATIVE PROMPT → UNDERSTAND → PLAN → IMPLEMENT EXACTLY → VERIFY → DOCUMENT → STOP AT BOUNDARY**
