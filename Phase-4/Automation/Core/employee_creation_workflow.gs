/** Employee Creation Workflow — Phase 4
 * Direct Employees-sheet workflow.
 *
 * The authoritative Employees tab remains exactly 15 columns.
 * No employee-creation Form, sidebar, custom menu, or extra schema column is used.
 *
 * Explicit sheet controls:
 * 1. In a new/pending row, type exactly "GENERATE EMPLOYEE ID" in Employee_ID.
 * 2. The script validates the row, generates EMP-000001 via A4-00, writes and
 *    protects Employee_ID, and records the pending generated record.
 * 3. After reviewing the row, type exactly "SAVE EMPLOYEE" in Created_At.
 * 4. The script validates the generated ID/pending state, writes Created_At,
 *    and commits the row.
 *
 * These are explicit user actions, not generic autosave/onEdit ID generation:
 * the edit trigger reacts only to the two exact control commands.
 */

const EMPLOYEE_CREATION_CONFIG = {
  workbookName: 'MASTER_COMPANY_HR_ADMIN',
  sheetName: 'Employees',
  idPrefix: 'EMP',
  generateCommand: 'GENERATE EMPLOYEE ID',
  saveCommand: 'SAVE EMPLOYEE',
  requiredHeaders: [
    'Employee_ID','Name','Email','Role','Designation','Salary_Basis',
    'Payment_Frequency','Active','Reimbursement_Eligible','Project_Access',
    'Joining_Date','Employment_Status','HR_Notes','Reimbursement_Settings','Created_At'
  ],
  employmentStatuses: ['Probation','Full-Time','Notice Period','Relieved'],
  paymentFrequencies: ['Monthly','One-Time'],
  reimbursementSettings: ['Standard','Executive','Contractor-Direct']
};

function getEmployeeCreationConfig() {
  return EMPLOYEE_CREATION_CONFIG;
}

/**
 * Install the single authorized edit trigger for the existing Employees sheet.
 * Safe to rerun: duplicate employee-control triggers are removed first.
 */
function installEmployeeSheetControlTrigger() {
  const sheet = getEmployeeSheet_();
  const ss = sheet.getParent();

  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'processEmployeeSheetControl') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('processEmployeeSheetControl')
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  const result = verifyEmployeeSheetControlTrigger();
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function verifyEmployeeSheetControlTrigger() {
  const ss = getEmployeeSheet_().getParent();
  const matches = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === 'processEmployeeSheetControl' &&
      trigger.getTriggerSourceId() === ss.getId();
  });

  const result = {
    status: matches.length === 1 ? 'PASS' : 'FAIL',
    triggerCount: matches.length,
    handler: 'processEmployeeSheetControl',
    eventType: 'ON_EDIT',
    spreadsheetId: ss.getId()
  };
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

/**
 * Explicit control processor. It ignores every normal edit.
 */
function processEmployeeSheetControl(e) {
  if (!e || !e.range) return;

  const sheet = e.range.getSheet();
  if (sheet.getName() !== EMPLOYEE_CREATION_CONFIG.sheetName) return;
  if (sheet.getParent().getName() !== EMPLOYEE_CREATION_CONFIG.workbookName) return;
  if (e.range.getNumRows() !== 1 || e.range.getNumColumns() !== 1) return;

  const headers = getEmployeeHeaders_(sheet);
  const editedColumn = e.range.getColumn();
  const header = headers[editedColumn - 1];
  const command = String(e.value || '').trim().toUpperCase();

  if (header === 'Employee_ID' &&
      command === EMPLOYEE_CREATION_CONFIG.generateCommand) {
    e.range.clearContent();
    generateEmployeeIdForRow_(sheet, e.range.getRow());
    return;
  }

  if (header === 'Created_At' &&
      command === EMPLOYEE_CREATION_CONFIG.saveCommand) {
    e.range.clearContent();
    saveEmployeeRow_(sheet, e.range.getRow());
  }
}

function generateEmployeeIdForRow_(sheet, rowNumber) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const row = readEmployeeRow_(sheet, rowNumber);
    validateEmployeeRow_(row);

    if (row.Employee_ID) {
      throw new Error('EMPLOYEE_ID_GENERATION_BLOCKED: Employee_ID already exists: ' + row.Employee_ID);
    }

    const existingIds = readEmployeeColumn_(sheet, 'Employee_ID');
    const employeeId = generateA4Id('EMP', existingIds);

    const idColumn = getEmployeeColumnIndex_(sheet, 'Employee_ID');
    const idCell = sheet.getRange(rowNumber, idColumn);
    idCell.setNumberFormat('@');
    idCell.setValue(employeeId);

    const protection = idCell.protect()
      .setDescription('Phase 4 immutable Employee_ID ' + employeeId);
    protection.setWarningOnly(false);

    const pending = {
      spreadsheetId: sheet.getParent().getId(),
      sheetName: sheet.getName(),
      rowNumber: rowNumber,
      employeeId: employeeId,
      email: String(row.Email).trim().toLowerCase(),
      generatedAt: new Date().toISOString()
    };

    PropertiesService.getScriptProperties()
      .setProperty('EMPLOYEE_PENDING_' + employeeId, JSON.stringify(pending));

    SpreadsheetApp.getActive().toast(
      'Employee ID generated: ' + employeeId +
      '. Review the row, then type SAVE EMPLOYEE in Created_At.',
      'Employee Creation',
      8
    );
  } finally {
    lock.releaseLock();
  }
}

function saveEmployeeRow_(sheet, rowNumber) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const row = readEmployeeRow_(sheet, rowNumber);
    validateEmployeeRow_(row);

    const employeeId = String(row.Employee_ID || '').trim().toUpperCase();
    if (!/^EMP-[0-9]{6}$/.test(employeeId)) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Generate Employee ID first.');
    }

    const pendingKey = 'EMPLOYEE_PENDING_' + employeeId;
    const pendingRaw = PropertiesService.getScriptProperties().getProperty(pendingKey);
    if (!pendingRaw) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Employee_ID was not generated by the explicit Generate-ID control.');
    }

    const pending = JSON.parse(pendingRaw);
    if (pending.spreadsheetId !== sheet.getParent().getId() ||
        pending.sheetName !== sheet.getName() ||
        Number(pending.rowNumber) !== Number(rowNumber)) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Generated Employee_ID is not associated with this pending row.');
    }

    const existingIds = readEmployeeColumn_(sheet, 'Employee_ID');
    const duplicateId = existingIds.some(function(id, index) {
      const normalized = String(id || '').trim().toUpperCase();
      return normalized === employeeId && (index + 2) !== rowNumber;
    });
    if (duplicateId) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Employee_ID already exists elsewhere: ' + employeeId);
    }

    const email = String(row.Email).trim().toLowerCase();
    const existingEmails = readEmployeeColumn_(sheet, 'Email');
    const duplicateEmail = existingEmails.some(function(value, index) {
      return String(value || '').trim().toLowerCase() === email &&
        (index + 2) !== rowNumber;
    });
    if (duplicateEmail) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Email already exists: ' + email);
    }

    const createdAtColumn = getEmployeeColumnIndex_(sheet, 'Created_At');
    sheet.getRange(rowNumber, createdAtColumn).setValue(new Date());

    PropertiesService.getScriptProperties().deleteProperty(pendingKey);

    SpreadsheetApp.getActive().toast(
      'Employee saved successfully: ' + employeeId,
      'Employee Creation',
      6
    );
  } catch (error) {
    SpreadsheetApp.getActive().toast(
      String(error.message || error),
      'Employee Creation — BLOCKED',
      10
    );
    throw error;
  } finally {
    lock.releaseLock();
  }
}

/**
 * Non-destructive prerequisite verification.
 */
function verifyEmployeeCreationPrerequisites() {
  const sheet = getEmployeeSheet_();
  const headers = getEmployeeHeaders_(sheet);
  const trigger = verifyEmployeeSheetControlTrigger();

  const checks = {
    workbook: sheet.getParent().getName() === EMPLOYEE_CREATION_CONFIG.workbookName,
    sheet: sheet.getName() === EMPLOYEE_CREATION_CONFIG.sheetName,
    exact15ColumnSchema: headers.length === 15 &&
      EMPLOYEE_CREATION_CONFIG.requiredHeaders.every(function(h, i) {
        return headers[i] === h;
      }),
    noEmployeeFormRequired: true,
    noSidebarRequired: true,
    noCustomMenuRequired: true,
    centralGeneratorAvailable: typeof generateA4Id === 'function',
    explicitGenerateAndSaveControls: true,
    employeeSheetEditTrigger: trigger.status === 'PASS'
  };

  checks.status = Object.keys(checks).every(function(k) {
    return k === 'status' || checks[k] === true;
  }) ? 'PASS' : 'FAIL';

  Logger.log(JSON.stringify(checks, null, 2));
  return checks;
}

function getEmployeeSheet_() {
  const files = DriveApp.getFilesByName(EMPLOYEE_CREATION_CONFIG.workbookName);
  const matches = [];
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS) matches.push(file);
  }

  if (matches.length !== 1) {
    throw new Error('EMPLOYEE_WORKBOOK_AMBIGUOUS_OR_MISSING: ' +
      EMPLOYEE_CREATION_CONFIG.workbookName + ' / matches=' + matches.length);
  }

  const ss = SpreadsheetApp.openById(matches[0].getId());
  const sheet = ss.getSheetByName(EMPLOYEE_CREATION_CONFIG.sheetName);
  if (!sheet) {
    throw new Error('EMPLOYEE_SHEET_MISSING: ' + EMPLOYEE_CREATION_CONFIG.sheetName);
  }

  const headers = getEmployeeHeaders_(sheet);
  if (headers.length !== 15) {
    throw new Error('EMPLOYEE_SCHEMA_INVALID: expected exactly 15 columns; found ' + headers.length);
  }

  EMPLOYEE_CREATION_CONFIG.requiredHeaders.forEach(function(header, index) {
    if (headers[index] !== header) {
      throw new Error(
        'EMPLOYEE_HEADER_INVALID: expected column ' + (index + 1) +
        ' to be ' + header + ', found ' + headers[index]
      );
    }
  });

  return sheet;
}

function getEmployeeHeaders_(sheet) {
  return sheet.getRange(1, 1, 1, 15).getValues()[0].map(String);
}

function getEmployeeColumnIndex_(sheet, header) {
  const headers = getEmployeeHeaders_(sheet);
  const index = headers.indexOf(header);
  if (index < 0) throw new Error('EMPLOYEE_HEADER_MISSING: ' + header);
  return index + 1;
}

function readEmployeeColumn_(sheet, header) {
  const column = getEmployeeColumnIndex_(sheet, header);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  return sheet.getRange(2, column, lastRow - 1, 1).getValues()
    .map(function(row) { return row[0]; });
}

function readEmployeeRow_(sheet, rowNumber) {
  if (rowNumber < 2) {
    throw new Error('EMPLOYEE_ROW_INVALID: controls are only valid on employee data rows.');
  }

  const values = sheet.getRange(rowNumber, 1, 1, 15).getValues()[0];
  const headers = getEmployeeHeaders_(sheet);
  const row = {};

  headers.forEach(function(header, index) {
    row[header] = values[index];
  });

  return row;
}

function validateEmployeeRow_(row) {
  const name = String(row.Name || '').trim();
  const email = String(row.Email || '').trim();
  const role = String(row.Role || '').trim();
  const designation = String(row.Designation || '').trim();
  const joiningDate = row.Joining_Date;
  const paymentFrequency = String(row.Payment_Frequency || '').trim();
  const employmentStatus = String(row.Employment_Status || '').trim();
  const reimbursementSettings = String(row.Reimbursement_Settings || '').trim();

  if (!name) throw new Error('Name is required.');
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    throw new Error('A valid Email is required.');
  }
  if (!role) throw new Error('Role is required.');
  if (!designation) throw new Error('Designation is required.');
  if (!joiningDate || Object.prototype.toString.call(joiningDate) !== '[object Date]' ||
      isNaN(joiningDate.getTime())) {
    throw new Error('Joining_Date is required and must be a valid date.');
  }
  if (EMPLOYEE_CREATION_CONFIG.paymentFrequencies.indexOf(paymentFrequency) < 0) {
    throw new Error('Invalid Payment_Frequency.');
  }
  if (EMPLOYEE_CREATION_CONFIG.employmentStatuses.indexOf(employmentStatus) < 0) {
    throw new Error('Invalid Employment_Status.');
  }
  if (EMPLOYEE_CREATION_CONFIG.reimbursementSettings.indexOf(reimbursementSettings) < 0) {
    throw new Error('Invalid Reimbursement_Settings.');
  }

  if (row.Salary_Basis !== '' && row.Salary_Basis !== null &&
      row.Salary_Basis !== undefined &&
      (isNaN(Number(row.Salary_Basis)) || Number(row.Salary_Basis) < 0)) {
    throw new Error('Salary_Basis must be a non-negative number.');
  }

  if (row.Active !== true && row.Active !== false) {
    throw new Error('Active must be TRUE or FALSE.');
  }

  if (row.Reimbursement_Eligible !== true && row.Reimbursement_Eligible !== false) {
    throw new Error('Reimbursement_Eligible must be TRUE or FALSE.');
  }
}
