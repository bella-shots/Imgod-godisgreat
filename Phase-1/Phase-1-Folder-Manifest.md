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