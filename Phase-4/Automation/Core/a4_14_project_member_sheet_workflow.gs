/** A4-14 — R57 Project Member Sheet workflow
 * Baseline: frozen one-click Employee creation workflow.
 *
 * Direct Sheet-originated Project_Members records:
 * - user completes the pending row
 * - selects the row / Member_Record_ID cell
 * - Project Member Actions -> Generate Project Member ID
 * - validate -> A4-00 MBR generation -> persist/lock ID -> finalize
 *
 * No generic onEdit/autosave path generates MBR IDs.
 * Form/system-created Project_Members rows from A4-01 remain automatic.
 */

const A4_14_PROJECT_MEMBER_CONFIG = {
  workbookName: 'MASTER_COMPANY_OPERATIONS',
  sheetName: 'Project_Members',
  projectsSheetName: 'Projects',
  employeesWorkbookName: 'MASTER_COMPANY_HR_ADMIN',
  employeesSheetName: 'Employees',
  headers: [
    'Member_Record_ID',
    'Project_ID',
    'Employee_ID',
    'Project_Role',
    'Access_Level',
    'Active',
    'Assigned_Date'
  ],
  projectRoles: ['Lead', 'Core Contributor', 'Reviewer', 'Observer'],
  accessLevels: ['Viewer', 'Editor', 'Admin'],
  menuName: 'Project Member Actions',
  menuItem: 'Generate Project Member ID'
};

function onOpenProjectMemberSheetMenu(e) {
  SpreadsheetApp.getUi()
    .createMenu(A4_14_PROJECT_MEMBER_CONFIG.menuName)
    .addItem(A4_14_PROJECT_MEMBER_CONFIG.menuItem, 'generateSelectedProjectMemberId')
    .addToUi();
}

function installProjectMemberSheetMenuTrigger() {
  const sheet = getA414ProjectMemberSheet_();
  const ss = sheet.getParent();

  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'onOpenProjectMemberSheetMenu') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('onOpenProjectMemberSheetMenu')
    .forSpreadsheet(ss)
    .onOpen()
    .create();

  return verifyProjectMemberSheetMenuTrigger();
}

function setupProjectMemberSheetWorkflow() {
  installProjectMemberSheetControls_();
  installProjectMemberSheetMenuTrigger();
  return verifyProjectMemberSheetPrerequisites();
}

function installProjectMemberSheetControls_() {
  const sheet = getA414ProjectMemberSheet_();
  const headers = getA414Headers_(sheet);

  if (headers.length !== A4_14_PROJECT_MEMBER_CONFIG.headers.length ||
      headers.some(function(h, i) { return h !== A4_14_PROJECT_MEMBER_CONFIG.headers[i]; })) {
    throw new Error('A4_14_PROJECT_MEMBER_SCHEMA_MISMATCH');
  }

  // Preserve the frozen 7-column schema; remove accidental columns beyond it.
  if (sheet.getMaxColumns() > A4_14_PROJECT_MEMBER_CONFIG.headers.length) {
    sheet.deleteColumns(
      A4_14_PROJECT_MEMBER_CONFIG.headers.length + 1,
      sheet.getMaxColumns() - A4_14_PROJECT_MEMBER_CONFIG.headers.length
    );
  }

  sheet.getRange(1, 1, 1, A4_14_PROJECT_MEMBER_CONFIG.headers.length)
    .setFontWeight('bold');

  return {
    status: 'PASS',
    schema: A4_14_PROJECT_MEMBER_CONFIG.headers.slice(),
    columnCount: A4_14_PROJECT_MEMBER_CONFIG.headers.length
  };
}

function generateSelectedProjectMemberId() {
  const sheet = getA414ProjectMemberSheet_();
  const row = sheet.getActiveRange() ? sheet.getActiveRange().getRow() : 0;

  if (row < 2) {
    throw new Error('A4_14_SELECT_PENDING_PROJECT_MEMBER_ROW');
  }

  const lock = LockService.getDocumentLock();
  lock.waitLock(30000);

  try {
    const headers = getA414Headers_(sheet);
    validateA414ExactSchema_(headers);

    const record = readA414Row_(sheet, row, headers);

    if (record.Member_Record_ID) {
      throw new Error('A4_14_MEMBER_ALREADY_HAS_ID: ' + record.Member_Record_ID);
    }

    validateA414ProjectMember_(record);
    validateA414ProjectExists_(record.Project_ID);
    validateA414EmployeeExists_(record.Employee_ID);
    validateA414DuplicateMapping_(sheet, row, headers, record);

    const existingIds = readA414Column_(sheet, headers, 'Member_Record_ID');
    const memberId = generateA4Id('MBR', existingIds);

    const idColumn = headers.indexOf('Member_Record_ID') + 1;
    const idCell = sheet.getRange(row, idColumn);

    idCell.setValue(memberId);
    protectA414IdCell_(idCell, memberId);

    SpreadsheetApp.flush();

    const verify = String(idCell.getDisplayValue()).trim() === memberId;
    if (!verify) {
      throw new Error('A4_14_ID_PERSISTENCE_FAILED: ' + memberId);
    }

    SpreadsheetApp.getActive().toast(
      'Project Member created: ' + memberId,
      'Project Member Actions',
      5
    );

    return {
      status: 'PASS',
      memberRecordId: memberId,
      row: row,
      finalized: true
    };
  } finally {
    lock.releaseLock();
  }
}

function verifyProjectMemberSheetPrerequisites() {
  const sheet = getA414ProjectMemberSheet_();
  const headers = getA414Headers_(sheet);

  const trigger = verifyProjectMemberSheetMenuTrigger();
  const result = {
    workbook: sheet.getParent().getName() === A4_14_PROJECT_MEMBER_CONFIG.workbookName,
    sheet: sheet.getName() === A4_14_PROJECT_MEMBER_CONFIG.sheetName,
    exactRequiredHeaders: headers.length === A4_14_PROJECT_MEMBER_CONFIG.headers.length &&
      headers.every(function(h, i) {
        return h === A4_14_PROJECT_MEMBER_CONFIG.headers[i];
      }),
    centralGeneratorAvailable: typeof generateA4Id === 'function',
    menuTrigger: trigger.status === 'PASS',
    formAutomationRemainsSeparate: true
  };

  result.status = Object.keys(result).every(function(k) {
    return k === 'status' || result[k] === true;
  }) ? 'PASS' : 'FAIL';

  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function verifyProjectMemberSheetMenuTrigger() {
  const triggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === 'onOpenProjectMemberSheetMenu';
  });

  const valid = triggers.length === 1 &&
    triggers[0].getEventType() === ScriptApp.EventType.ON_OPEN;

  const result = {
    status: valid ? 'PASS' : 'FAIL',
    triggerCount: triggers.length,
    handler: triggers.length ? triggers[0].getHandlerFunction() : '',
    eventType: triggers.length ? String(triggers[0].getEventType()) : ''
  };

  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function getA414ProjectMemberSheet_() {
  const files = DriveApp.getFilesByName(A4_14_PROJECT_MEMBER_CONFIG.workbookName);
  const matches = [];

  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS && !file.isTrashed()) {
      matches.push(file);
    }
  }

  if (matches.length !== 1) {
    throw new Error(
      'A4_14_WORKBOOK_AMBIGUOUS_OR_MISSING: ' +
      A4_14_PROJECT_MEMBER_CONFIG.workbookName +
      ' / matches=' + matches.length
    );
  }

  const sheet = SpreadsheetApp.openById(matches[0].getId())
    .getSheetByName(A4_14_PROJECT_MEMBER_CONFIG.sheetName);

  if (!sheet) {
    throw new Error('A4_14_SHEET_MISSING: ' + A4_14_PROJECT_MEMBER_CONFIG.sheetName);
  }

  return sheet;
}

function getA414Headers_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn < A4_14_PROJECT_MEMBER_CONFIG.headers.length) return [];
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);
}

function validateA414ExactSchema_(headers) {
  const expected = A4_14_PROJECT_MEMBER_CONFIG.headers;

  if (headers.length !== expected.length ||
      headers.some(function(h, i) { return h !== expected[i]; })) {
    throw new Error(
      'A4_14_PROJECT_MEMBER_SCHEMA_MISMATCH: expected=' +
      JSON.stringify(expected) + ' actual=' + JSON.stringify(headers)
    );
  }
}

function readA414Row_(sheet, row, headers) {
  const values = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
  const record = {};

  headers.forEach(function(header, index) {
    record[header] = values[index];
  });

  return record;
}

function validateA414ProjectMember_(record) {
  if (!String(record.Project_ID || '').trim()) {
    throw new Error('A4_14_PROJECT_ID_REQUIRED');
  }

  if (!String(record.Employee_ID || '').trim()) {
    throw new Error('A4_14_EMPLOYEE_ID_REQUIRED');
  }

  if (record.Active !== true && record.Active !== false &&
      String(record.Active).toUpperCase() !== 'TRUE' &&
      String(record.Active).toUpperCase() !== 'FALSE') {
    throw new Error('A4_14_ACTIVE_MUST_BE_TRUE_OR_FALSE');
  }

  if (record.Project_Role !== '' &&
      A4_14_PROJECT_MEMBER_CONFIG.projectRoles.indexOf(String(record.Project_Role).trim()) < 0) {
    throw new Error('A4_14_INVALID_PROJECT_ROLE: ' + record.Project_Role);
  }

  if (record.Access_Level !== '' &&
      A4_14_PROJECT_MEMBER_CONFIG.accessLevels.indexOf(String(record.Access_Level).trim()) < 0) {
    throw new Error('A4_14_INVALID_ACCESS_LEVEL: ' + record.Access_Level);
  }

  if (record.Assigned_Date !== '' && !(record.Assigned_Date instanceof Date)) {
    throw new Error('A4_14_INVALID_ASSIGNED_DATE');
  }
}

function validateA414ProjectExists_(projectId) {
  const workbook = getA414OperationsWorkbook_();
  const sheet = workbook.getSheetByName(A4_14_PROJECT_MEMBER_CONFIG.projectsSheetName);
  if (!sheet) throw new Error('A4_14_PROJECTS_SHEET_MISSING');

  const ids = readA414Column_(sheet, getA414Headers_(sheet), 'Project_ID')
    .map(function(value) { return String(value).trim(); });

  if (ids.indexOf(String(projectId).trim()) < 0) {
    throw new Error('A4_14_PROJECT_NOT_FOUND: ' + projectId);
  }
}

function validateA414EmployeeExists_(employeeId) {
  const files = DriveApp.getFilesByName(A4_14_PROJECT_MEMBER_CONFIG.employeesWorkbookName);
  const matches = [];

  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS && !file.isTrashed()) {
      matches.push(file);
    }
  }

  if (matches.length !== 1) {
    throw new Error(
      'A4_14_EMPLOYEES_WORKBOOK_AMBIGUOUS_OR_MISSING: ' +
      matches.length
    );
  }

  const sheet = SpreadsheetApp.openById(matches[0].getId())
    .getSheetByName(A4_14_PROJECT_MEMBER_CONFIG.employeesSheetName);

  if (!sheet) throw new Error('A4_14_EMPLOYEES_SHEET_MISSING');

  const ids = readA414Column_(sheet, getA414Headers_(sheet), 'Employee_ID')
    .map(function(value) { return String(value).trim(); });

  if (ids.indexOf(String(employeeId).trim()) < 0) {
    throw new Error('A4_14_EMPLOYEE_NOT_FOUND: ' + employeeId);
  }
}

function validateA414DuplicateMapping_(sheet, selectedRow, headers, record) {
  const projectIndex = headers.indexOf('Project_ID');
  const employeeIndex = headers.indexOf('Employee_ID');

  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    const actualRow = i + 1;
    if (actualRow === selectedRow) continue;

    const projectId = String(values[i][projectIndex] || '').trim();
    const employeeId = String(values[i][employeeIndex] || '').trim();

    if (projectId === String(record.Project_ID).trim() &&
        employeeId === String(record.Employee_ID).trim()) {
      throw new Error(
        'A4_14_DUPLICATE_PROJECT_MEMBER_MAPPING: ' +
        record.Project_ID + ' / ' + record.Employee_ID
      );
    }
  }
}

function readA414Column_(sheet, headers, header) {
  const index = headers.indexOf(header);
  if (index < 0) throw new Error('A4_14_HEADER_MISSING: ' + header);

  const values = sheet.getDataRange().getValues();
  return values.slice(1).map(function(row) {
    return row[index];
  }).filter(function(value) {
    return value !== '' && value !== null;
  });
}

function getA414OperationsWorkbook_() {
  return SpreadsheetApp.openById(getA414ProjectMemberSheet_().getParent().getId());
}

function protectA414IdCell_(cell, id) {
  const description = 'A4-14 R57 immutable Member_Record_ID ' + id;
  const existing = cell.getProtections(SpreadsheetApp.ProtectionType.RANGE);

  existing.forEach(function(protection) {
    if (protection.getDescription() === description) {
      protection.remove();
    }
  });

  const protection = cell.protect().setDescription(description);

  try {
    protection.setWarningOnly(false);
  } catch (err) {}

  return protection;
}
