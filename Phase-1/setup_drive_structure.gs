/**
 * MASTER COMPANY — Google Drive Hierarchy Automated Setup Script
 * 
 * Target: Zero-Cost Phase 1 Foundation
 * Creates:
 *  MASTER COMPANY/
 *  ├── Projects/
 *  │   └── PROJECT_Phase1_Test/
 *  │       ├── 01_Admin/
 *  │       ├── 02_Checklist/
 *  │       ├── 03_Expenses/
 *  │       ├── 04_MOM/
 *  │       ├── 05_Notes/
 *  │       ├── 06_Files/
 *  │       └── 07_Reports/
 *  ├── Finance/
 *  ├── HR/
 *  ├── Templates/
 *  ├── MOM/
 *  └── Reports/
 */

function createMasterDriveStructure() {
  const rootName = "MASTER COMPANY";
  const topFolders = ["Projects", "Finance", "HR", "Templates", "MOM", "Reports"];
  const sampleProjectName = "PROJECT_Phase1_Test";
  const projectSubFolders = [
    "01_Admin",
    "02_Checklist",
    "03_Expenses",
    "04_MOM",
    "05_Notes",
    "06_Files",
    "07_Reports"
  ];

  Logger.log("Starting Phase 1 Drive Hierarchy Setup...");

  // 1. Root folder
  let rootFolder = getOrCreateFolder(DriveApp.getRootFolder(), rootName);
  Logger.log("Root Folder Verified: " + rootFolder.getName() + " (ID: " + rootFolder.getId() + ")");

  // 2. Six top-level folders
  let topFolderMap = {};
  topFolders.forEach(function(folderName) {
    let f = getOrCreateFolder(rootFolder, folderName);
    topFolderMap[folderName] = f;
    Logger.log(" Top-level folder verified: " + folderName + " (ID: " + f.getId() + ")");
  });

  // 3. Sample project under Projects
  let projectsFolder = topFolderMap["Projects"];
  let sampleProj = getOrCreateFolder(projectsFolder, sampleProjectName);
  Logger.log("Sample Project verified: " + sampleProj.getName() + " (ID: " + sampleProj.getId() + ")");

  // 4. Seven project subfolders
  projectSubFolders.forEach(function(subName) {
    let sf = getOrCreateFolder(sampleProj, subName);
    Logger.log("  Subfolder verified: " + subName + " (ID: " + sf.getId() + ")");
  });

  Logger.log("==================================================");
  Logger.log("Phase 1 Drive structure successfully created!");
  Logger.log("Root Link: " + rootFolder.getUrl());
  Logger.log("==================================================");

  return {
    rootId: rootFolder.getId(),
    rootUrl: rootFolder.getUrl()
  };
}

function getOrCreateFolder(parentFolder, folderName) {
  var folders = parentFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return parentFolder.createFolder(folderName);
  }
}
