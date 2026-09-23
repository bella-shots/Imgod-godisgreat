# Master Website Architecture

## Objective

Create a simple internal company portal covering Projects, Finance, HR, and Reports without introducing unnecessary paid infrastructure.

## System Layers

| Layer | Google service | Responsibility |
|---|---|---|
| File layer | Google Drive | Project files, templates, MOMs, reports and controlled source documents |
| Portal layer | Google Sites | HOME, PROJECTS, FINANCE, HR, REPORTS |
| Data layer | Google Sheets | Structured operational records |
| Input layer | Google Forms | Controlled employee/admin submissions |
| Automation layer | Google Apps Script | Processing, calculations, notifications, reports and workflow automation |
| Notification/access | Gmail + Google Accounts | Email notifications and user access |

## Security Boundary

Sensitive salary, investment, finance and HR source data must not be broadly exposed through the public/site layer. Access is controlled at the Drive/Sheet/Form level and the Google Site is used as the presentation/navigation layer.

## Important Scope Boundary

Google Sites is intentionally not treated as a full arbitrary visual website builder. The original advanced drag/drop builder requirements are deprioritized because the agreed business objective can be met with the simpler Google-native architecture.

## Five Phases

### Phase 1 — Google Drive structure

Create the secure Drive foundation with MASTER COMPANY as the root and Projects, Finance, HR, Templates, MOM and Reports beneath it.

### Phase 2 — Master Google Site

Create HOME, PROJECTS, FINANCE, HR and REPORTS.

### Phase 3 — Google Sheets + Forms

Create the operational data structures and controlled input forms.

### Phase 4 — Apps Script automation

Automate MOM emails, expense calculations, reimbursement, salary carry-forward, reports and notifications.

### Phase 5 — Testing + permissions + handover

Perform end-to-end testing, security/permission testing, cost/quota verification, UAT, defect closure and handover.

## Source of Truth

This architecture document records the agreed implementation direction. Phase-specific execution documents will live under docs/phases/.
