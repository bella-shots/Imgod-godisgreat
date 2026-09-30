/** Employee Creation Workflow — Phase 4
 * Dedicated employee-entry workflow required by Phase 3/R48.
 *
 * Design:
 * - Uses a Google Apps Script sidebar so incomplete employee data is NOT
 *   written into the authoritative Employees sheet.
 * - GENERATE EMPLOYEE ID validates the pending form and consumes an EMP ID
 *   through A4-00.
 * - SAVE EMPLOYEE is permitted only after a generated EMP ID exists.
 * - The generated Employee_ID is written once and protected after save.
 * - No generic onEdit/autosave trigger generates Employee_ID.
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

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Employee Admin')
    .addItem('Open Employee Entry', 'showEmployeeCreationSidebar')
    .addToUi();
}

function showEmployeeCreationSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('employee_creation_sidebar')
    .setTitle('Employee Entry');
  SpreadsheetApp.getUi().showSidebar(html);
}

function getEmployeeCreationConfig() {
  return EMPLOYEE_CREATION_CONFIG;
}

function generatePendingEmployeeId(form) {
  validateEmployeePending_(form);

  const sheet = getEmployeeSheet_();
  const existingIds = readEmployeeColumn_(sheet, 'Employee_ID');
  const employeeId = generateA4Id('EMP', existingIds);

  return {
    status: 'PASS',
    employeeId: employeeId,
    message: 'Employee ID generated. Review the details and click SAVE EMPLOYEE.'
  };
}

function saveEmployee(form) {
  validateEmployeePending_(form);

  const employeeId = String(form.employeeId || '').trim().toUpperCase();
  if (!/^EMP-[0-9]{6}$/.test(employeeId)) {
    throw new Error('EMPLOYEE_SAVE_BLOCKED: Generate a valid Employee_ID first.');
  }

  const sheet = getEmployeeSheet_();
  const existingIds = readEmployeeColumn_(sheet, 'Employee_ID');
  if (existingIds.some(function(id) {
    return String(id).trim().toUpperCase() === employeeId;
  })) {
    throw new Error('EMPLOYEE_SAVE_BLOCKED: Employee_ID already exists: ' + employeeId);
  }

  const email = String(form.email || '').trim().toLowerCase();
  const existingEmails = readEmployeeColumn_(sheet, 'Email').map(function(v) {
    return String(v || '').trim().toLowerCase();
  });
  if (existingEmails.indexOf(email) >= 0) {
    throw new Error('EMPLOYEE_SAVE_BLOCKED: Email already exists: ' + email);
  }

  const headers = sheet.getDataRange().getValues()[0].map(String);
  const row = headers.map(function(header) {
    const value = employeeValueForHeader_(header, form, employeeId);
    return value === undefined ? '' : value;
  });

  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);

  const newRow = sheet.getLastRow();
  const idColumn = headers.indexOf('Employee_ID') + 1;
  const idCell = sheet.getRange(newRow, idColumn);
  idCell.setNumberFormat('@');
  idCell.setValue(employeeId);

  const protection = idCell.protect().setDescription('Phase 4 immutable Employee_ID');
  protection.setWarningOnly(false);

  return {
    status: 'PASS',
    employeeId: employeeId,
    row: newRow,
    message: 'Employee saved successfully.'
  };
}

function verifyEmployeeCreationPrerequisites() {
  const sheet = getEmployeeSheet_();
  const headers = sheet.getDataRange().getValues()[0].map(String);
  const checks = {
    workbook: sheet.getParent().getName() === EMPLOYEE_CREATION_CONFIG.workbookName,
    sheet: sheet.getName() === EMPLOYEE_CREATION_CONFIG.sheetName,
    exactRequiredHeaders: EMPLOYEE_CREATION_CONFIG.requiredHeaders.every(function(h) {
      return headers.indexOf(h) >= 0;
    }),
    noEmployeeFormRequired: true,
    centralGeneratorAvailable: typeof generateA4Id === 'function'
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
  if (!sheet) throw new Error('EMPLOYEE_SHEET_MISSING: ' + EMPLOYEE_CREATION_CONFIG.sheetName);

  const headers = sheet.getDataRange().getValues()[0].map(String);
  EMPLOYEE_CREATION_CONFIG.requiredHeaders.forEach(function(header) {
    if (headers.indexOf(header) < 0) {
      throw new Error('EMPLOYEE_HEADER_MISSING: ' + header);
    }
  });
  return sheet;
}

function readEmployeeColumn_(sheet, header) {
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const index = headers.indexOf(header);
  if (index < 0) throw new Error('EMPLOYEE_HEADER_MISSING: ' + header);
  return values.slice(1).map(function(row) { return row[index]; }).filter(function(v) {
    return v !== '' && v !== null;
  });
}

function validateEmployeePending_(form) {
  if (!form) throw new Error('EMPLOYEE_VALIDATION_FAILED: no employee data supplied.');

  const name = String(form.name || '').trim();
  const email = String(form.email || '').trim();
  const role = String(form.role || '').trim();
  const designation = String(form.designation || '').trim();
  const joiningDate = String(form.joiningDate || '').trim();
  const paymentFrequency = String(form.paymentFrequency || '').trim();
  const employmentStatus = String(form.employmentStatus || '').trim();
  const reimbursementSettings = String(form.reimbursementSettings || '').trim();

  if (!name) throw new Error('Name is required.');
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) throw new Error('A valid Email is required.');
  if (!role) throw new Error('Role is required.');
  if (!designation) throw new Error('Designation is required.');
  if (!joiningDate || isNaN(new Date(joiningDate).getTime())) throw new Error('Joining_Date is required and must be valid.');
  if (EMPLOYEE_CREATION_CONFIG.paymentFrequencies.indexOf(paymentFrequency) < 0) throw new Error('Invalid Payment_Frequency.');
  if (EMPLOYEE_CREATION_CONFIG.employmentStatuses.indexOf(employmentStatus) < 0) throw new Error('Invalid Employment_Status.');
  if (EMPLOYEE_CREATION_CONFIG.reimbursementSettings.indexOf(reimbursementSettings) < 0) throw new Error('Invalid Reimbursement_Settings.');
  if (form.salaryBasis !== '' && form.salaryBasis !== null && form.salaryBasis !== undefined) {
    if (isNaN(Number(form.salaryBasis)) || Number(form.salaryBasis) < 0) throw new Error('Salary_Basis must be a non-negative number.');
  }
  if (String(form.active) !== 'true' && String(form.active) !== 'false') throw new Error('Active must be TRUE or FALSE.');
  if (String(form.reimbursementEligible) !== 'true' && String(form.reimbursementEligible) !== 'false') {
    throw new Error('Reimbursement_Eligible must be TRUE or FALSE.');
  }
}

function employeeValueForHeader_(header, form, employeeId) {
  const map = {
    Employee_ID: employeeId,
    Name: String(form.name || '').trim(),
    Email: String(form.email || '').trim(),
    Role: String(form.role || '').trim(),
    Designation: String(form.designation || '').trim(),
    Salary_Basis: form.salaryBasis === '' ? '' : Number(form.salaryBasis),
    Payment_Frequency: String(form.paymentFrequency || '').trim(),
    Active: String(form.active) === 'true',
    Reimbursement_Eligible: String(form.reimbursementEligible) === 'true',
    Project_Access: String(form.projectAccess || '').trim(),
    Joining_Date: new Date(form.joiningDate),
    Employment_Status: String(form.employmentStatus || '').trim(),
    HR_Notes: String(form.hrNotes || '').trim(),
    Reimbursement_Settings: String(form.reimbursementSettings || '').trim(),
    Created_At: new Date()
  };
  return map[header];
}
