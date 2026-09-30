/** A4-02 — Drive Project Folder Automation
 * Creates/locates the frozen Phase 1 project folder structure:
 * MASTER COMPANY/Projects/PROJECT_<ProjectName>/
 *   01_Admin
 *   02_Checklist
 *   03_Expenses
 *   04_MOM
 *   05_Notes
 *   06_Files
 *   07_Reports
 *
 * Idempotent: existing unique folders are reused; duplicates are never created.
 */

const A4_02_SUBFOLDERS = [
  '01_Admin','02_Checklist','03_Expenses','04_MOM','05_Notes','06_Files','07_Reports'
];

function ensureA402ProjectFolder(projectName) {
  const cleanName = String(projectName || '').trim();
  if (!cleanName) throw new Error('A4_02_PROJECT_NAME_REQUIRED');

  const root = findA402UniqueFolder_(null, 'MASTER COMPANY');
  const projectsRoot = findA402UniqueFolder_(root, 'Projects');
  const folderName = 'PROJECT_' + cleanName;

  let projectFolder = findA402Folder_(projectsRoot, folderName);
  let createdProject = false;

  if (projectFolder.duplicates > 0) {
    throw new Error('A4_02_PROJECT_FOLDER_AMBIGUOUS: ' + folderName);
  }
  if (!projectFolder.folder) {
    projectFolder.folder = projectsRoot.createFolder(folderName);
    createdProject = true;
  }

  try {
    A4_02_SUBFOLDERS.forEach(function(name) {
      const child = findA402Folder_(projectFolder.folder, name);
      if (child.duplicates > 0) {
        throw new Error('A4_02_SUBFOLDER_AMBIGUOUS: ' + name);
      }
      if (!child.folder) projectFolder.folder.createFolder(name);
    });

    return {
      status: 'PASS',
      created: createdProject,
      folderId: projectFolder.folder.getId(),
      url: projectFolder.folder.getUrl(),
      folderName: folderName
    };
  } catch (err) {
    if (createdProject) {
      try { projectFolder.folder.setTrashed(true); } catch (cleanupErr) {}
    }
    throw err;
  }
}

function findA402UniqueFolder_(parent, name) {
  if (!parent) {
    const roots = DriveApp.getFoldersByName(name);
    const matches = [];
    while (roots.hasNext()) matches.push(roots.next());
    if (matches.length !== 1) {
      throw new Error('A4_02_ROOT_FOLDER_AMBIGUOUS_OR_MISSING: ' + name + ' / matches=' + matches.length);
    }
    return matches[0];
  }
  const result = findA402Folder_(parent, name);
  if (result.duplicates > 0 || !result.folder) {
    throw new Error('A4_02_FOLDER_AMBIGUOUS_OR_MISSING: ' + name);
  }
  return result.folder;
}

function findA402Folder_(parent, name) {
  const iterator = parent.getFoldersByName(name);
  const matches = [];
  while (iterator.hasNext()) matches.push(iterator.next());
  return {
    folder: matches.length === 1 ? matches[0] : null,
    duplicates: Math.max(0, matches.length - 1),
    count: matches.length
  };
}

function verifyA402ProjectFolder(projectName) {
  const result = ensureA402ProjectFolder(projectName);
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}
