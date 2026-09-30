| Path | Required | Purpose | Default Access | Notes |
|---|---|---|---|---|
| MASTER COMPANY | YES | Root of the entire internal portal file system. | Admin only initially | Share individual child folders as required. |
| MASTER COMPANY/Projects | YES | All project folders. | Admin + authorized project users as needed | Do not make broadly editable by default. |
| MASTER COMPANY/Finance | YES | Finance artifacts and controlled financial documents. | Admin/restricted | Sensitive. |
| MASTER COMPANY/HR | YES | HR artifacts and employee records. | Admin/authorized HR | Sensitive. |
| MASTER COMPANY/Templates | YES | Reusable master templates. | Admin edit; users view/copy as needed | Protect masters. |
| MASTER COMPANY/MOM | YES | MOM artifacts and archives. | Admin + authorized users | Per-MOM access may be narrower. |
| MASTER COMPANY/Reports | YES | Management reports and outputs. | Admin/restricted; publish selected reports separately | Do not expose sensitive reports by default. |
| MASTER COMPANY/Projects/PROJECT_<ProjectName> | Per project | Root for one project. | Admin + project members | Create during project onboarding. |
| MASTER COMPANY/Projects/PROJECT_<ProjectName>/01_Admin | Recommended | Project administrative material. | Project members as permitted |  |
| MASTER COMPANY/Projects/PROJECT_<ProjectName>/02_Checklist | Recommended | Checklist Excel and checklist-related files. | Project members as permitted |  |
| MASTER COMPANY/Projects/PROJECT_<ProjectName>/03_Expenses | Recommended | Project expense files and proofs. | Project members/finance as permitted | Sensitive finance content must be restricted. |
| MASTER COMPANY/Projects/PROJECT_<ProjectName>/04_MOM | Recommended | Project MOM files. | Project members as permitted |  |
| MASTER COMPANY/Projects/PROJECT_<ProjectName>/05_Notes | Recommended | Project notes. | Project members as permitted |  |
| MASTER COMPANY/Projects/PROJECT_<ProjectName>/06_Files | Recommended | General project files. | Project members as permitted |  |
| MASTER COMPANY/Projects/PROJECT_<ProjectName>/07_Reports | Recommended | Project-specific reports. | Project members/admin as permitted |  |

## R55 — Authoritative control-asset Drive placement

The following existing Google control assets have a canonical Drive location of the root MASTER COMPANY folder. No new asset-storage folder is introduced.

| Asset | Canonical Drive location | Rule |
|---|---|---|
| MASTER_COMPANY_OPERATIONS | MASTER COMPANY/ | Single authoritative workbook; no duplicate operational workbook may be created. |
| MASTER_COMPANY_FINANCE | MASTER COMPANY/ | Single authoritative workbook; restricted permissions remain enforced at resource level. |
| MASTER_COMPANY_HR_ADMIN | MASTER COMPANY/ | Single authoritative workbook; restricted permissions remain enforced at resource level. |
| MASTER_COMPANY_ADMIN | MASTER COMPANY/ | Single authoritative workbook; restricted permissions remain enforced at resource level. |
| FRM-01 through FRM-07 | MASTER COMPANY/ | Each Form is a single authoritative Form asset; do not create duplicate Forms to satisfy placement. |
| Master Google Site MASTER COMPANY | MASTER COMPANY/ | The authoritative Google Site document belongs in the root MASTER COMPANY Drive location. |

This placement does not grant broad access. The root folder remains protected; resource-specific sharing/access controls defined by Phases 2 and 3 remain authoritative.

Project-specific files continue to use the existing Phase 1 project folders and subfolders. This revision does not add or rename any Drive folders.

Phase 4 must locate and verify these existing assets by authoritative name/resource identity and normalize their location to the canonical MASTER COMPANY root when technically supported, without creating duplicate business assets. If a move or access change cannot be safely completed, Phase 4 must preserve the existing asset and report the placement exception for controlled human resolution.
