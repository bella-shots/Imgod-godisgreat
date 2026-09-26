/**
 * Phase 1 — Read-Only Google Drive Permission Audit
 *
 * Purpose:
 * Verify the existing MASTER COMPANY Drive hierarchy without
 * creating, modifying, deleting, or changing any Drive permissions.
 *
 * Run:
 *   verifyPhase1DriveSecurity
 *
 * Review the execution log after running.
 */

function verifyPhase1DriveSecurity() {
  const ROOT_NAME = 'MASTER COMPANY';
  const TOP_LEVEL = ['Projects', 'Finance', 'HR', 'Templates', 'MOM', 'Reports'];
  const PROJECT_NAME = 'PROJECT_Phase1_Test';
  const PROJECT_SUBFOLDERS = [
    '01_Admin',
    '02_Checklist',
    '03_Expenses',
    '04_MOM',
    '05_Notes',
    '06_Files',
    '07_Reports'
  ];

  Logger.log('Starting Phase 1 read-only Drive security audit...');

  const root = findChildFolder_(DriveApp.getRootFolder(), ROOT_NAME);
  if (!root) {
    throw new Error('MASTER COMPANY folder not found.');
  }

  Logger.log('Root verified: %s (ID: %s)', ROOT_NAME, root.getId());
  logAccess_(ROOT_NAME, root);

  TOP_LEVEL.forEach(function(name) {
    const folder = findChildFolder_(root, name);
    if (!folder) {
      Logger.log('MISSING top-level folder: %s', name);
      return;
    }

    Logger.log('Top-level verified: %s (ID: %s)', name, folder.getId());
    logAccess_(ROOT_NAME + '/' + name, folder);
  });

  const projects = findChildFolder_(root, 'Projects');
  if (projects) {
    const project = findChildFolder_(projects, PROJECT_NAME);
    if (!project) {
      Logger.log('MISSING sample project: %s', PROJECT_NAME);
    } else {
      Logger.log(
        'Sample project verified: %s (ID: %s)',
        PROJECT_NAME,
        project.getId()
      );
      logAccess_(ROOT_NAME + '/Projects/' + PROJECT_NAME, project);

      PROJECT_SUBFOLDERS.forEach(function(name) {
        const folder = findChildFolder_(project, name);
        Logger.log(
          'Project subfolder %s: %s',
          name,
          folder ? 'PRESENT' : 'MISSING'
        );
      });
    }
  }

  Logger.log('--- Expected security interpretation ---');
  Logger.log('Finance: admin-only / no ordinary employee access.');
  Logger.log('HR: admin-only / no ordinary employee access.');
  Logger.log('Templates: ordinary users must not have Editor access.');
  Logger.log('All confidential folders/files: General access should be Restricted.');
  Logger.log('Project access: users should receive only intended project access.');
  Logger.log(
    'IMPORTANT: This audit reports the access exposed by DriveApp. ' +
    'It does not change permissions and does not replace a test-user access test.'
  );

  Logger.log('Phase 1 read-only security audit completed.');
}

function findChildFolder_(parentFolder, name) {
  const it = parentFolder.getFoldersByName(name);
  return it.hasNext() ? it.next() : null;
}

function logAccess_(path, folder) {
  Logger.log('--- %s ---', path);

  const editors = folder.getEditors().map(function(user) {
    return user.getEmail();
  });

  const viewers = folder.getViewers().map(function(user) {
    return user.getEmail();
  });

  Logger.log('Editors: %s', editors.length ? editors.join(', ') : '(none)');
  Logger.log('Viewers: %s', viewers.length ? viewers.join(', ') : '(none)');

  try {
    Logger.log('Sharing access: %s', folder.getSharingAccess());
  } catch (e) {
    Logger.log('Sharing access: unavailable (%s)', e.message);
  }

  try {
    Logger.log('Sharing permission: %s', folder.getSharingPermission());
  } catch (e) {
    Logger.log('Sharing permission: unavailable (%s)', e.message);
  }
}
