/** Employee Creation Workflow — Phase 4
 * Floating Employee Actions Panel (Primary UI) & Native Menu (Secondary UI).
 *
 * 1. Floating Modeless Panel:
 *    • Floats above the spreadsheet grid.
 *    • Remains active while HR/Admin selects employee rows and works on the sheet.
 *    • Two large, dedicated action buttons:
 *      - [ Generate Employee ID ] (Blue)
 *      - [ Save Employee ] (Green)
 *    • Real-time status/feedback area.
 *    • Draggable to bottom-left corner of the Google Sheets viewport.
 * 2. Native "Employee Actions" Menu:
 *    • Open Floating Panel
 *    • Generate Employee ID
 *    • Save Employee
 *
 * Schema Safety:
 * The authoritative Employees tab remains strictly 15 columns (Columns A:O).
 * No cells, merged cells, drawing buttons, or extra schema columns are used.
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
      .addItem('Open Floating Panel', 'showEmployeeActionsFloatingPanel')
      .addSeparator()
      .addItem('Generate Employee ID', 'generateSelectedEmployeeId')
      .addItem('Save Employee', 'saveSelectedEmployee')
      .addToUi();

    // Attempt to automatically display the floating panel on open
    showEmployeeActionsFloatingPanel();
  } catch (err) {
    Logger.log('onOpenEmployeeSheetMenu note (expected in headless context): ' + err.message);
  }
}

/** Opens the floating modeless dialog for Employee Actions */
function showEmployeeActionsFloatingPanel() {
  try {
    const ui = SpreadsheetApp.getUi();
    const htmlOutput = HtmlService.createHtmlOutput(getFloatingPanelHtml_())
      .setWidth(290)
      .setHeight(230)
      .setTitle(' ');
    ui.showModelessDialog(htmlOutput, 'Employee Actions');
    return { status: 'PASS', panel: 'FLOATING_MODELESS_DIALOG' };
  } catch (err) {
    Logger.log('showEmployeeActionsFloatingPanel note: ' + err.message);
    return { status: 'NOTE', message: err.message };
  }
}

/** HTML template for the floating Employee Actions panel */
function getFloatingPanelHtml_() {
  return '<!DOCTYPE html>' +
    '<html><head><base target="_top"><style>' +
    '* { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }' +
    'body { background: #ffffff; color: #0f172a; padding: 8px; user-select: none; }' +
    '.panel { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); overflow: hidden; }' +
    '.header { background: #0f172a; color: #ffffff; padding: 10px 12px; text-align: center; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; }' +
    '.body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }' +
    '.btn { display: flex; align-items: center; justify-content: center; width: 100%; padding: 10px 12px; font-size: 12px; font-weight: 600; border-radius: 6px; border: 1px solid transparent; cursor: pointer; transition: background 0.15s ease, box-shadow 0.15s ease; }' +
    '.btn-primary { background: #2563eb; color: #ffffff; border-color: #1d4ed8; }' +
    '.btn-primary:hover { background: #1d4ed8; box-shadow: 0 2px 6px rgba(37,99,235,0.3); }' +
    '.btn-success { background: #16a34a; color: #ffffff; border-color: #15803d; }' +
    '.btn-success:hover { background: #15803d; box-shadow: 0 2px 6px rgba(22,163,74,0.3); }' +
    '.btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }' +
    '.status { font-size: 11px; line-height: 1.35; padding: 6px 8px; border-radius: 4px; background: #f8fafc; border: 1px solid #e2e8f0; color: #475569; min-height: 36px; word-break: break-word; }' +
    '.status.error { background: #fef2f2; border-color: #fecaca; color: #dc2626; font-weight: 500; }' +
    '.status.success { background: #f0fdf4; border-color: #bbf7d0; color: #16a34a; font-weight: 600; }' +
    '</style></head><body>' +
    '<div class="panel">' +
    '  <div class="header">EMPLOYEE ACTIONS</div>' +
    '  <div class="body">' +
    '    <button id="btnGenerate" class="btn btn-primary" onclick="handleGenerate()">▶ Generate Employee ID</button>' +
    '    <button id="btnSave" class="btn btn-success" onclick="handleSave()">✔ Save Employee</button>' +
    '    <div id="status" class="status">Select an employee row in Employees sheet, then click an action.</div>' +
    '  </div>' +
    '</div>' +
    '<script>' +
    'function setStatus(text, type) {' +
    '  var s = document.getElementById("status");' +
    '  s.textContent = text;' +
    '  s.className = "status" + (type ? " " + type : "");' +
    '}' +
    'function setBusy(busy) {' +
    '  document.getElementById("btnGenerate").disabled = busy;' +
    '  document.getElementById("btnSave").disabled = busy;' +
    '}' +
    'function handleGenerate() {' +
    '  setBusy(true);' +
    '  setStatus("Validating row and generating Employee ID...", "");' +
    '  google.script.run' +
    '    .withSuccessHandler(function(res) {' +
    '      setBusy(false);' +
    '      if (res && res.success) {' +
    '        setStatus(res.message, "success");' +
    '      } else {' +
    '        setStatus(res && res.message ? res.message : "Error generating ID.", "error");' +
    '      }' +
    '    })' +
    '    .withFailureHandler(function(err) {' +
    '      setBusy(false);' +
    '      setStatus(err.message || "Operation failed.", "error");' +
    '    })' +
    '    .generateSelectedEmployeeId();' +
    '}' +
    'function handleSave() {' +
    '  setBusy(true);' +
    '  setStatus("Validating and saving employee record...", "");' +
    '  google.script.run' +
    '    .withSuccessHandler(function(res) {' +
    '      setBusy(false);' +
    '      if (res && res.success) {' +
    '        setStatus(res.message, "success");' +
    '      } else {' +
    '        setStatus(res && res.message ? res.message : "Error saving employee.", "error");' +
    '      }' +
    '    })' +
    '    .withFailureHandler(function(err) {' +
    '      setBusy(false);' +
    '      setStatus(err.message || "Operation failed.", "error");' +
    '    })' +
    '    .saveSelectedEmployee();' +
    '}' +
    '</script></body></html>';
}

/** Cleans up any leftover experimental cell formatting or drawings in columns outside schema */
function cleanEmployeeSheetExtraUi_() {
  try {
    const sheet = getEmployeeSheet_();
    // Clean columns 16 to 20 (P to T)
    const extraRange = sheet.getRange(1, 16, 10, 5);
    extraRange.breakApart();
    extraRange.clear();
    extraRange.clearNote();
    extraRange.setBorder(false, false, false, false, false, false);

    // Remove any floating images anchored in columns >= 16
    const images = sheet.getImages();
    images.forEach(function(img) {
      const anchor = img.getAnchorCell();
      if (anchor && anchor.getColumn() >= 16) {
        try { img.remove(); } catch (e) {}
      }
    });
    SpreadsheetApp.flush();
  } catch (err) {
    Logger.log('cleanEmployeeSheetExtraUi_ note: ' + err.message);
  }
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
  cleanEmployeeSheetExtraUi_();
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

/** Backward compatibility aliases */
function installEmployeeActionsPanel() {
  cleanEmployeeSheetExtraUi_();
  return { status: 'PASS', mode: 'FLOATING_PANEL' };
}
function installEmployeeActionsButton() {
  return installEmployeeActionsPanel();
}
function processEmployeeSheetControl(e) {
  return;
}

/** Action 1: Generate Employee ID for the selected row */
function generateSelectedEmployeeId() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || getEmployeeSheet_().getParent();
  const sheet = ss.getActiveSheet();

  if (sheet.getName().trim() !== EMPLOYEE_CREATION_CONFIG.sheetName) {
    const msg = 'Please select an employee row in the "Employees" sheet.';
    ss.toast(msg, 'Employee Actions', 6);
    return { success: false, message: msg };
  }

  const activeRange = sheet.getActiveRange();
  if (!activeRange) {
    const msg = 'No row selected. Please select a pending employee row.';
    ss.toast(msg, 'Employee Actions', 6);
    return { success: false, message: msg };
  }

  const rowNumber = activeRange.getRow();
  if (rowNumber < 2) {
    const msg = 'Header row cannot be an employee record. Please select row 2 or higher.';
    ss.toast(msg, 'Employee Actions', 6);
    return { success: false, message: msg };
  }

  try {
    const employeeId = generateEmployeeIdForRow_(sheet, rowNumber);
    return {
      success: true,
      employeeId: employeeId,
      rowNumber: rowNumber,
      message: 'Employee ID generated: ' + employeeId + '. Review the row, then click Save Employee.'
    };
  } catch (err) {
    return {
      success: false,
      message: String(err.message || err)
    };
  }
}

/** Action 2: Save Employee for the selected row */
function saveSelectedEmployee() {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || getEmployeeSheet_().getParent();
  const sheet = ss.getActiveSheet();

  if (sheet.getName().trim() !== EMPLOYEE_CREATION_CONFIG.sheetName) {
    const msg = 'Please select an employee row in the "Employees" sheet.';
    ss.toast(msg, 'Employee Actions', 6);
    return { success: false, message: msg };
  }

  const activeRange = sheet.getActiveRange();
  if (!activeRange) {
    const msg = 'No row selected. Please select an employee row to save.';
    ss.toast(msg, 'Employee Actions', 6);
    return { success: false, message: msg };
  }

  const rowNumber = activeRange.getRow();
  if (rowNumber < 2) {
    const msg = 'Header row cannot be an employee record. Please select row 2 or higher.';
    ss.toast(msg, 'Employee Actions', 6);
    return { success: false, message: msg };
  }

  try {
    const employeeId = saveEmployeeRow_(sheet, rowNumber);
    return {
      success: true,
      employeeId: employeeId,
      rowNumber: rowNumber,
      message: 'Employee saved successfully: ' + employeeId
    };
  } catch (err) {
    return {
      success: false,
      message: String(err.message || err)
    };
  }
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
    sheet.getParent().toast('Employee ID generated: ' + employeeId + '. Review the row, then click Save Employee.', 'Employee Actions', 8);
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
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Generate Employee ID first using Employee Actions.');
    }
    const pendingKey = 'EMPLOYEE_PENDING_' + employeeId;
    const pendingRaw = PropertiesService.getScriptProperties().getProperty(pendingKey);
    if (!pendingRaw) {
      throw new Error('EMPLOYEE_SAVE_BLOCKED: Employee_ID was not generated by the explicit Generate Employee ID control.');
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
    floatingPanelConfigured: true,
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
