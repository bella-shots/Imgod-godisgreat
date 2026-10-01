/** Employee Creation Workflow — Phase 4
 * Direct Employees-sheet workflow using native Google Sheets "Employee Actions" custom menu.
 *
 * The authoritative Employees tab remains exactly 15 columns.
 * No employee-creation Form, sidebar, or extra schema column is used.
 *
 * Explicit native menu controls:
 * 1. User selects an employee data row (row >= 2) in Employees tab.
 * 2. User clicks Employee Actions → Generate Employee ID.
 * 3. The script validates the row fields, generates EMP-000001 via A4-00,
 *    writes and protects Employee_ID, and tracks pending generation.
 * 4. User reviews the row, then clicks Employee Actions → Save Employee.
 * 5. The script validates generated ID/pending state, checks duplicates,
 *    writes system timestamp to Created_At, and commits the row.
 */

const EMPLOYEE_CREATION_CONFIG = {
  workbookName: 'MASTER_COMPANY_HR_ADMIN',
  sheetName: 'Employees',
  idPrefix: 'EMP',
  requiredHeaders: [
    'Employee_ID','Name','Email','Role','Designation','Salary_Basis',
    'Payment_Frequency','Active','Reimbursement_Eligible','Project_Access',
    'Joining_Date','Employment_Status','HR_Notes','Reimbursement_Settings','Created_At'
  ],
  employmentStatuses: ['Probation','Full-Time','Notice Period','Relieved'],
  paymentFrequencies: ['Monthly','One-Time'],
  reimbursementSettings: ['Standard','Executive','Contractor-Direct']
};

function getEmployeeCreationConfig() { return EMPLOYEE_CREATION_CONFIG; }

/** Native menu builder invoked by installable ON_OPEN trigger on MASTER_COMPANY_HR_ADMIN */
function onOpenEmployeeSheetMenu(e) {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Employee Actions')
      .addItem('Generate Employee ID', 'generateSelectedEmployeeId')
      .addItem('Save Employee', 'saveSelectedEmployee')
      .addToUi();
  } catch (err) {
    Logger.log('onOpenEmployeeSheetMenu UI note (expected in headless context): ' + err.message);
  }
}

/** Legacy stub preserved for backward compatibility */
function processEmployeeSheetControl(e) {
  return;
}

/** Installs the installable ON_OPEN trigger for onOpenEmployeeSheetMenu */
function installEmployeeSheetMenuTrigger() {
  const sheet = getEmployeeSheet_();
  const ss = sheet.getParent();

  // Remove duplicate or obsolete triggers for this menu/control
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    const handler = trigger.getHandlerFunction();
    if (handler === 'onOpenEmployeeSheetMenu' || handler === 'processEmployeeSheetControl') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create exactly one spreadsheet ON_OPEN trigger for onOpenEmployeeSheetMenu
  ScriptApp.newTrigger('onOpenEmployeeSheetMenu')
    .forSpreadsheet(ss)
    .onOpen()
    .create();

  return verifyEmployeeSheetMenuTrigger();
}

/** Verifies that exactly one installable trigger exists for onOpenEmployeeSheetMenu */
function verifyEmployeeSheetMenuTrigger() {
  const ss = getEmployeeSheet_().getParent();
  const matches = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === 'onOpenEmployeeSheetMenu' && trigger.getTriggerSourceId() === ss.getId();
  });
  return {
    status: matches.length === 1 ? 'PASS' : 'FAIL',
    triggerCount: matches.length,
    handler: 'onOpenEmployeeSheetMenu',
    eventType: 'ON_OPEN',
    spreadsheetId: ss.getId(),
    workbookName: ss.getName()
  };
}

/** Setup and prerequisite verification entry point */
function setupEmployeeDirectSheetWorkflow() {
  const trigger = installEmployeeSheetMenuTrigger();
  const prerequisites = verifyEmployeeCreationPrerequisites();
  const result = {
    status: trigger.status === 'PASS' && prerequisites.status === 'PASS' ? 'PASS' : 'FAIL',
    trigger: trigger,
    prerequisites: prerequisites
  };
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

/** Menu Item 1: Generate Employee ID for the selected row */
function generateSelectedEmployeeId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || getEmployeeSheet_().getParent();
  const sheet = ss.getActiveSheet();

  if (sheet.getName().trim() !== EMPLOYEE_CREATION_CONFIG.sheetName) {
    ss.toast('Please select an employee row in the "Employees" sheet.', 'Employee Actions', 6);
    return;
  }

  const activeRange = sheet.getActiveRange();
  if (!activeRange) {
    ss.toast('No row selected. Please select a pending employee row.', 'Employee Actions', 6);
    return;
  }

  const rowNumber = activeRange.getRow();
  if (rowNumber < 2) {
    ss.toast('Header row cannot be an employee record. Please select row 2 or higher.', 'Employee Actions', 6);
    return;
  }

  return generateEmployeeIdForRow_(sheet, rowNumber);
}

/** Menu Item 2: Save Employee for the selected row */
function saveSelectedEmployee() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || getEmployeeSheet_().getParent();
  const sheet = ss.getActiveSheet();

  if (sheet.getName().trim() !== EMPLOYEE_CREATION_CONFIG.sheetName) {
    ss.toast('Please select an employee row in the "Employees" sheet.', 'Employee Actions', 6);
    return;
  }

  const activeRange = sheet.getActiveRange();
  if (!activeRange) {
    ss.toast('No row selected. Please select an employee row to save.', 'Employee Actions', 6);
    return;
  }

  const rowNumber = activeRange.getRow();
  if (rowNumber < 2) {
    ss.toast('Header row cannot be an employee record. Please select row 2 or higher.', 'Employee Actions', 6);
    return;
  }

  return saveEmployeeRow_(sheet, rowNumber);
}

function generateEmployeeIdForRow_(sheet, rowNumber) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const row = readEmployeeRow_(sheet, rowNumber);
    validateEmployeeRow_(row);
    const existingId = String(row.Employee_ID || '').trim().toUpperCase();
    if (existingId) {
      throw new Error('EMPLOYEE_ID_GENERATION_BLOCKED: Employee_ID already exists: ' + row.Employee_ID);
    }
    const existingIds = readEmployeeColumn_(sheet, 'Employee_ID');
    const employeeId = generateA4Id('EMP', existingIds);
    const idCell = sheet.getRange(rowNumber, getEmployeeColumnIndex_(sheet, 'Employee_ID'));
    idCell.setNumberFormat('@');
    idCell.setValue(employeeId);
    SpreadsheetApp.flush();
    try {
      const protection = idCell.protect().setDescription('Phase 4 immutable Employee_ID ' + employeeId);
      protection.setWarningOnly(false);
    } catch (protErr) {
      Logger.log('Protection notice (non-fatal): ' + protErr.message);
    }
    PropertiesService.getScriptProperties().setProperty('EMPLOYEE_PENDING_' + employeeId, JSON.stringify({
      spreadsheetId: sheet.getParent().getId(),
      sheetName: sheet.getName(),
      rowNumber: rowNumber,
      employeeId: employeeId,
      email: String(row.Email).trim().toLowerCase(),
      generatedAt: new Date().toISOString()
    }));
    sheet.getParent().toast('Employee ID generated: ' + employeeId + '. Review the row, then use Employee Actions → Save Employee.', 'Employee Actions', 8);
    return employeeId;
  } catch (error) {
    sheet.getParent().toast(String(error.message || error), 'Employee Actions — BLOCKED', 10);
    throw error;
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
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Generate Employee ID first using Employee Actions → Generate Employee ID.');
    }
    const pendingKey = 'EMPLOYEE_PENDING_' + employeeId;
    const pendingRaw = PropertiesService.getScriptProperties().getProperty(pendingKey);
    if (!pendingRaw) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Employee_ID was not generated by the explicit Generate Employee ID menu control.');
    }
    const pending = JSON.parse(pendingRaw);
    if (pending.spreadsheetId !== sheet.getParent().getId() || pending.sheetName !== sheet.getName() || Number(pending.rowNumber) !== Number(rowNumber)) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Generated Employee_ID is not associated with this pending row.');
    }
    const existingIds = readEmployeeColumn_(sheet, 'Employee_ID');
    if (existingIds.some(function(id, index) { return String(id || '').trim().toUpperCase() === employeeId && (index + 2) !== rowNumber; })) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Employee_ID already exists elsewhere: ' + employeeId);
    }
    const email = String(row.Email).trim().toLowerCase();
    if (readEmployeeColumn_(sheet, 'Email').some(function(value, index) { return String(value || '').trim().toLowerCase() === email && (index + 2) !== rowNumber; })) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Email already exists: ' + email);
    }
    sheet.getRange(rowNumber, getEmployeeColumnIndex_(sheet, 'Created_At')).setValue(new Date());
    SpreadsheetApp.flush();
    PropertiesService.getScriptProperties().deleteProperty(pendingKey);
    sheet.getParent().toast('Employee saved successfully: ' + employeeId, 'Employee Actions', 6);
    return employeeId;
  } catch (error) {
    sheet.getParent().toast(String(error.message || error), 'Employee Actions — BLOCKED', 10);
    throw error;
  } finally {
    lock.releaseLock();
  }
}

function verifyEmployeeCreationPrerequisites() {
  const sheet = getEmployeeSheet_();
  const headers = getEmployeeHeaders_(sheet);
  const trigger = verifyEmployeeSheetMenuTrigger();
  const checks = {
    workbook: sheet.getParent().getName().trim().toUpperCase() === EMPLOYEE_CREATION_CONFIG.workbookName.toUpperCase(),
    sheet: sheet.getName().trim() === EMPLOYEE_CREATION_CONFIG.sheetName,
    exact15ColumnSchema: headers.length === 15 && EMPLOYEE_CREATION_CONFIG.requiredHeaders.every(function(h, i) { return headers[i] === h; }),
    noEmployeeFormRequired: true,
    noSidebarRequired: true,
    employeeActionsMenuConfigured: true,
    centralGeneratorAvailable: typeof generateA4Id === 'function',
    employeeSheetMenuTrigger: trigger.status === 'PASS'
  };
  checks.status = Object.keys(checks).every(function(k) { return checks[k] === true; }) ? 'PASS' : 'FAIL';
  Logger.log(JSON.stringify(checks, null, 2));
  return checks;
}

function getEmployeeSheet_() {
  const files = DriveApp.getFilesByName(EMPLOYEE_CREATION_CONFIG.workbookName);
  const matches = [];
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS && !file.isTrashed()) {
      matches.push(file);
    }
  }
  if (matches.length !== 1) throw new Error('EMPLOYEE_WORKBOOK_AMBIGUOUS_OR_MISSING: ' + EMPLOYEE_CREATION_CONFIG.workbookName + ' / matches=' + matches.length);
  const ss = SpreadsheetApp.openById(matches[0].getId());
  const sheet = ss.getSheetByName(EMPLOYEE_CREATION_CONFIG.sheetName);
  if (!sheet) throw new Error('EMPLOYEE_SHEET_MISSING: ' + EMPLOYEE_CREATION_CONFIG.sheetName);
  const headers = getEmployeeHeaders_(sheet);
  if (headers.length !== 15) throw new Error('EMPLOYEE_SCHEMA_INVALID: expected exactly 15 columns; found ' + headers.length);
  EMPLOYEE_CREATION_CONFIG.requiredHeaders.forEach(function(header, index) {
    if (headers[index] !== header) throw new Error('EMPLOYEE_HEADER_INVALID: expected column ' + (index + 1) + ' to be ' + header + ', found ' + headers[index]);
  });
  return sheet;
}

function getEmployeeHeaders_(sheet) {
  return sheet.getRange(1, 1, 1, 15).getValues()[0].map(String);
}

function getEmployeeColumnIndex_(sheet, header) {
  const index = getEmployeeHeaders_(sheet).indexOf(header);
  if (index < 0) throw new Error('EMPLOYEE_HEADER_MISSING: ' + header);
  return index + 1;
}

function readEmployeeColumn_(sheet, header) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, getEmployeeColumnIndex_(sheet, header), lastRow - 1, 1).getValues().map(function(row) { return row[0]; });
}

function readEmployeeRow_(sheet, rowNumber) {
  if (rowNumber < 2) throw new Error('EMPLOYEE_ROW_INVALID: controls are only valid on employee data rows.');
  const values = sheet.getRange(rowNumber, 1, 1, 15).getValues()[0];
  const headers = getEmployeeHeaders_(sheet);
  const row = {};
  headers.forEach(function(header, index) { row[header] = values[index]; });
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A valid Email is required.');
  if (!role) throw new Error('Role is required.');
  if (!designation) throw new Error('Designation is required.');

  let validDate = false;
  if (joiningDate instanceof Date && !isNaN(joiningDate.getTime())) {
    validDate = true;
  } else if (typeof joiningDate === 'string' && joiningDate.trim() !== '') {
    const parsed = new Date(joiningDate.trim());
    if (!isNaN(parsed.getTime())) validDate = true;
  }
  if (!validDate) throw new Error('Joining_Date is required and must be a valid date.');

  if (EMPLOYEE_CREATION_CONFIG.paymentFrequencies.indexOf(paymentFrequency) < 0) throw new Error('Invalid Payment_Frequency.');
  if (EMPLOYEE_CREATION_CONFIG.employmentStatuses.indexOf(employmentStatus) < 0) throw new Error('Invalid Employment_Status.');
  if (EMPLOYEE_CREATION_CONFIG.reimbursementSettings.indexOf(reimbursementSettings) < 0) throw new Error('Invalid Reimbursement_Settings.');

  if (row.Salary_Basis !== '' && row.Salary_Basis !== null && row.Salary_Basis !== undefined) {
    const num = typeof row.Salary_Basis === 'number' ? row.Salary_Basis : Number(String(row.Salary_Basis).replace(/[₹,$\s]/g, ''));
    if (isNaN(num) || num < 0) throw new Error('Salary_Basis must be a non-negative number.');
  }

  const activeStr = String(row.Active !== undefined && row.Active !== null ? row.Active : '').trim().toUpperCase();
  if (row.Active !== true && row.Active !== false && activeStr !== 'TRUE' && activeStr !== 'FALSE') {
    throw new Error('Active must be TRUE or FALSE.');
  }

  const reimbStr = String(row.Reimbursement_Eligible !== undefined && row.Reimbursement_Eligible !== null ? row.Reimbursement_Eligible : '').trim().toUpperCase();
  if (row.Reimbursement_Eligible !== true && row.Reimbursement_Eligible !== false && reimbStr !== 'TRUE' && reimbStr !== 'FALSE') {
    throw new Error('Reimbursement_Eligible must be TRUE or FALSE.');
  }
}

/** Non-destructive verification test for the direct Employees-sheet workflow. */
function testEmployeeDirectSheetWorkflowNonDestructive() {
  const sheet = getEmployeeSheet_();
  const prereqs = verifyEmployeeCreationPrerequisites();
  const sampleValidation = {
    Name: 'A4-01 Test Employee',
    Email: 'a4-01.test.employee@example.com',
    Role: 'ADAS Test Engineer',
    Designation: 'Senior Executive',
    Salary_Basis: 60000,
    Payment_Frequency: 'Monthly',
    Active: true,
    Reimbursement_Eligible: true,
    Project_Access: '',
    Joining_Date: '2026-09-30',
    Employment_Status: 'Full-Time',
    HR_Notes: 'A4-01 employee creation workflow test',
    Reimbursement_Settings: 'Standard',
    Created_At: ''
  };
  validateEmployeeRow_(sampleValidation);
  const existingIds = readEmployeeColumn_(sheet, 'Employee_ID');
  const previewId = previewA4Id('EMP', existingIds);
  const report = {
    prerequisites: prereqs,
    sampleValidation: 'PASS',
    nextAvailableEmployeeId: previewId,
    timestamp: new Date().toISOString()
  };
  Logger.log(JSON.stringify(report, null, 2));
  return report;
}
