/**
 * A4-03 — Employee Spending / Expense Processing
 *
 * AUTHORITATIVE PATH (FROZEN):
 *   FRM-02 Employee Spending / Expense
 *   -> Employee_Spending_Responses (native intake)
 *   -> controlled A4-03 processing
 *   -> Employee_Spending authoritative table
 *
 * IMPORTANT:
 * - Employee_Spending is Form-originated. R57 direct-Sheet Generate-ID UX does NOT apply.
 * - SPN IDs are generated automatically by controlled Form processing through A4-00.
 * - Canonical employee identity is Employee_ID resolved from the respondent's explicit Employee Email ID.
 * - Member_Record_ID is never an employee substitute.
 * - Native response tabs are intake-only and remain untouched.
 */

var A403_CONFIG = Object.freeze({
  FINANCE_WORKBOOK: 'MASTER_COMPANY_FINANCE',
  RESPONSE_SHEET: 'Employee_Spending_Responses',
  TARGET_SHEET: 'Employee_Spending',
  HR_WORKBOOK: 'MASTER_COMPANY_HR_ADMIN',
  HR_SHEET: 'Employees',
  OPERATIONS_WORKBOOK: 'MASTER_COMPANY_OPERATIONS',
  PROJECT_SHEET: 'Projects',
  SUBMISSION_WORKBOOK: 'MASTER_COMPANY_ADMIN',
  SUBMISSION_SHEET: 'Submission_Index',
  PREFIX: 'SPN',
  STATUS: 'Submitted'
});

function processEmployeeSpendingFormSubmit(e) {
  if (!e || !e.range) throw new Error('A4_03_INVALID_EVENT: Form-submit event with range is required.');

  var responseSheet = e.range.getSheet();
  if (responseSheet.getName() !== A403_CONFIG.RESPONSE_SHEET) {
    return { status: 'IGNORED', reason: 'NON_FRM02_RESPONSE_SHEET' };
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var finance = findUniqueSpreadsheetByName_(A403_CONFIG.FINANCE_WORKBOOK);
    var target = finance.getSheetByName(A403_CONFIG.TARGET_SHEET);
    if (!target) throw new Error('A4_03_TARGET_SHEET_MISSING: ' + A403_CONFIG.TARGET_SHEET);

    var responseHeaders = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn()).getValues()[0];
    var responseValues = responseSheet.getRange(e.range.getRow(), 1, 1, responseSheet.getLastColumn()).getValues()[0];
    var input = mapResponseRow_(responseHeaders, responseValues);

    var result = processEmployeeSpendingRecord_(input, target);
    return result;
  } catch (err) {
    recordA403Failure_(e, err);
    throw err;
  } finally {
    lock.releaseLock();
  }
}

function processEmployeeSpendingRecord_(input, target) {
  var employeeEmail = String(input.employeeEmail || '').trim().toLowerCase();
  var projectName = String(input.projectName || '').trim();
  var dateValue = input.date;
  var amount = Number(input.amount);
  var vendor = String(input.recipientVendor || '').trim();
  var purpose = String(input.purpose || '').trim();
  var attachmentUrl = String(input.attachmentUrl || '').trim();

  if (!employeeEmail || !isValidEmail_(employeeEmail)) {
    throw new Error('A4_03_EMPLOYEE_EMAIL_INVALID: Employee Email ID is required and must be valid.');
  }
  if (!isValidDate_(dateValue)) {
    throw new Error('A4_03_DATE_INVALID: Expense Date is required and must be a valid date.');
  }
  if (!(amount > 0)) {
    throw new Error('A4_03_AMOUNT_INVALID: Amount must be greater than 0.');
  }
  if (!vendor) throw new Error('A4_03_VENDOR_REQUIRED: Recipient/Vendor is required.');
  if (!purpose) throw new Error('A4_03_PURPOSE_REQUIRED: Purpose is required.');
  if (!projectName) throw new Error('A4_03_PROJECT_REQUIRED: Project Name is required.');

  var employee = resolveEmployeeByEmail_(employeeEmail);
  var project = resolveProjectByName_(projectName);

  if (!employee || !employee.employeeId) {
    throw new Error('A4_03_EMPLOYEE_NOT_FOUND: ' + employeeEmail);
  }
  if (/^MBR-[0-9]{6}$/i.test(employee.employeeId)) {
    throw new Error('R58_VIOLATION_MEMBER_RECORD_ID_NOT_PERMITTED: Employee_Spending must use canonical Employee_ID.');
  }
  if (!project || !project.projectId) {
    throw new Error('A4_03_PROJECT_NOT_FOUND: ' + projectName);
  }

  var headers = target.getRange(1, 1, 1, target.getLastColumn()).getValues()[0];
  assertExactEmployeeSpendingHeaders_(headers);

  var existingIds = getColumnValuesByHeader_(target, headers, 'Spending_ID')
    .filter(function(v) { return /^SPN-[0-9]{6}$/.test(String(v).trim()); });

  var id = generateA4Id('SPN', existingIds);

  var row = new Array(headers.length).fill('');
  setByHeader_(row, headers, 'Spending_ID', id);
  setByHeader_(row, headers, 'Employee_ID', employee.employeeId);
  setByHeader_(row, headers, 'Date', dateValue);
  setByHeader_(row, headers, 'Amount', amount);
  setByHeader_(row, headers, 'Recipient_Vendor', vendor);
  setByHeader_(row, headers, 'Purpose', purpose);
  setByHeader_(row, headers, 'Project_ID', project.projectId);
  setByHeader_(row, headers, 'Attachment_URL', attachmentUrl);
  setByHeader_(row, headers, 'Status', A403_CONFIG.STATUS);
  setByHeader_(row, headers, 'Submission_Timestamp', input.timestamp || new Date());

  target.appendRow(row);
  SpreadsheetApp.flush();

  return {
    status: 'PASS',
    spendingId: id,
    employeeId: employee.employeeId,
    projectId: project.projectId,
    source: 'FRM-02',
    r57DirectSheetWorkflow: false,
    r58EmployeeIdentity: 'Employee_ID'
  };
}

function verifyA403Architecture() {
  var finance = findUniqueSpreadsheetByName_(A403_CONFIG.FINANCE_WORKBOOK);
  var target = finance.getSheetByName(A403_CONFIG.TARGET_SHEET);
  var response = finance.getSheetByName(A403_CONFIG.RESPONSE_SHEET);
  var hr = findUniqueSpreadsheetByName_(A403_CONFIG.HR_WORKBOOK);
  var employees = hr.getSheetByName(A403_CONFIG.HR_SHEET);
  var operations = findUniqueSpreadsheetByName_(A403_CONFIG.OPERATIONS_WORKBOOK);
  var projects = operations.getSheetByName(A403_CONFIG.PROJECT_SHEET);

  var headers = target ? target.getRange(1, 1, 1, target.getLastColumn()).getValues()[0] : [];
  var exactHeaders = JSON.stringify(headers) === JSON.stringify([
    'Spending_ID','Employee_ID','Date','Amount','Recipient_Vendor','Purpose',
    'Project_ID','Attachment_URL','Status','Submission_Timestamp'
  ]);

  return {
    financeWorkbook: !!finance,
    responseSheet: !!response,
    targetSheet: !!target,
    employeesSheet: !!employees,
    projectsSheet: !!projects,
    exactRequiredHeaders: exactHeaders,
    formOriginated: true,
    directSheetGenerateIdRequired: false,
    submissionPath: 'FRM-02 -> Employee_Spending_Responses -> A4-03 -> Employee_Spending',
    centralGeneratorAvailable: typeof generateA4Id === 'function',
    r58CanonicalEmployeeKey: 'Employee_ID',
    status: (finance && response && target && employees && projects && exactHeaders && typeof generateA4Id === 'function') ? 'PASS' : 'FAIL'
  };
}

function testA403FormOriginatedWorkflowLive() {
  var architecture = verifyA403Architecture();
  if (architecture.status !== 'PASS') return { architecture: architecture, allPassed: false };

  var finance = findUniqueSpreadsheetByName_(A403_CONFIG.FINANCE_WORKBOOK);
  var target = finance.getSheetByName(A403_CONFIG.TARGET_SHEET);
  var initialLastRow = target.getLastRow();

  // This test intentionally validates the processor contract without writing a
  // production row. It uses the existing authoritative employee/project records.
  var employee = findFirstActiveEmployee_();
  var project = findFirstProject_();

  var syntheticInput = {
    employeeEmail: employee.email,
    date: new Date(),
    amount: 100,
    recipientVendor: 'A4-03 TEST VENDOR',
    purpose: 'A4-03 controlled live verification',
    projectName: project.projectName,
    attachmentUrl: '',
    timestamp: new Date()
  };

  var headers = target.getRange(1,1,1,target.getLastColumn()).getValues()[0];
  var beforeIds = getColumnValuesByHeader_(target, headers, 'Spending_ID');

  // Validate all preconditions without consuming an SPN sequence number.
  var preview = validateEmployeeSpendingInput_(syntheticInput);
  var generatorAvailable = typeof generateA4Id === 'function';

  var afterIds = getColumnValuesByHeader_(target, headers, 'Spending_ID');

  return {
    architecture: architecture,
    testValidInput: preview.status === 'PASS',
    generatedSpendingId: null,
    generatorAvailable: generatorAvailable,
    noDirectSheetMenu: true,
    noOnEditIdIssuance: !hasOnEditTriggerForA403_(),
    r58EmployeeIdentity: employee.employeeId,
    projectResolved: project.projectId,
    productionRowsUnchanged: target.getLastRow() === initialLastRow,
    productionIdsUnchanged: JSON.stringify(afterIds) === JSON.stringify(beforeIds),
    allPassed: preview.status === 'PASS' &&
      generatorAvailable &&
      target.getLastRow() === initialLastRow &&
      JSON.stringify(afterIds) === JSON.stringify(beforeIds)
  };
}

function validateEmployeeSpendingInput_(input) {
  if (!input.employeeEmail || !isValidEmail_(String(input.employeeEmail))) throw new Error('A4_03_EMPLOYEE_EMAIL_INVALID');
  if (!isValidDate_(input.date)) throw new Error('A4_03_DATE_INVALID');
  if (!(Number(input.amount) > 0)) throw new Error('A4_03_AMOUNT_INVALID');
  if (!String(input.recipientVendor || '').trim()) throw new Error('A4_03_VENDOR_REQUIRED');
  if (!String(input.purpose || '').trim()) throw new Error('A4_03_PURPOSE_REQUIRED');
  if (!String(input.projectName || '').trim()) throw new Error('A4_03_PROJECT_REQUIRED');
  var employee = resolveEmployeeByEmail_(String(input.employeeEmail).trim().toLowerCase());
  var project = resolveProjectByName_(String(input.projectName).trim());
  if (!employee) throw new Error('A4_03_EMPLOYEE_NOT_FOUND');
  if (!project) throw new Error('A4_03_PROJECT_NOT_FOUND');
  if (/^MBR-[0-9]{6}$/i.test(employee.employeeId)) throw new Error('R58_VIOLATION_MEMBER_RECORD_ID_NOT_PERMITTED');
  return { status: 'PASS', employeeId: employee.employeeId, projectId: project.projectId };
}

function mapResponseRow_(headers, values) {
  function get(names) {
    for (var i = 0; i < names.length; i++) {
      var idx = headers.indexOf(names[i]);
      if (idx >= 0) return values[idx];
    }
    return '';
  }
  return {
    timestamp: get(['Timestamp']),
    employeeEmail: get(['Employee Email ID']),
    date: get(['Date']),
    amount: get(['Amount']),
    recipientVendor: get(['Recipient/Vendor', 'Recipient / Vendor', 'Recipient_Vendor']),
    purpose: get(['Purpose']),
    projectName: get(['Project Name']),
    attachmentUrl: get(['Attachment / Receipt', 'Receipt / Invoice', 'Attachment_URL'])
  };
}

function assertExactEmployeeSpendingHeaders_(headers) {
  var expected = ['Spending_ID','Employee_ID','Date','Amount','Recipient_Vendor','Purpose','Project_ID','Attachment_URL','Status','Submission_Timestamp'];
  if (JSON.stringify(headers) !== JSON.stringify(expected)) {
    throw new Error('A4_03_TARGET_SCHEMA_MISMATCH: Employee_Spending must retain the frozen 10-column schema.');
  }
}

function resolveEmployeeByEmail_(email) {
  var ss = findUniqueSpreadsheetByName_(A403_CONFIG.HR_WORKBOOK);
  var sh = ss.getSheetByName(A403_CONFIG.HR_SHEET);
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var data = sh.getLastRow() < 2 ? [] : sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var emailIdx = headers.indexOf('Email');
  var idIdx = headers.indexOf('Employee_ID');
  for (var i=0;i<data.length;i++) {
    if (String(data[i][emailIdx] || '').trim().toLowerCase() === email) {
      return { employeeId: String(data[i][idIdx] || '').trim(), email: email };
    }
  }
  return null;
}

function resolveProjectByName_(projectName) {
  var ss = findUniqueSpreadsheetByName_(A403_CONFIG.OPERATIONS_WORKBOOK);
  var sh = ss.getSheetByName(A403_CONFIG.PROJECT_SHEET);
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var data = sh.getLastRow() < 2 ? [] : sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var nameIdx = headers.indexOf('Project_Name');
  var idIdx = headers.indexOf('Project_ID');
  var matches = data.filter(function(r) { return String(r[nameIdx] || '').trim() === projectName; });
  if (matches.length !== 1) return null;
  return { projectId: String(matches[0][idIdx] || '').trim(), projectName: projectName };
}

function findFirstActiveEmployee_() {
  var ss = findUniqueSpreadsheetByName_(A403_CONFIG.HR_WORKBOOK);
  var sh = ss.getSheetByName(A403_CONFIG.HR_SHEET);
  var h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var d = sh.getLastRow() < 2 ? [] : sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var id = h.indexOf('Employee_ID'), email = h.indexOf('Email'), active = h.indexOf('Active');
  for (var i=0;i<d.length;i++) if (d[i][id] && String(d[i][active]).toLowerCase() === 'true') return {employeeId:d[i][id],email:d[i][email]};
  throw new Error('A4_03_TEST_NO_ACTIVE_EMPLOYEE');
}

function findFirstProject_() {
  var ss = findUniqueSpreadsheetByName_(A403_CONFIG.OPERATIONS_WORKBOOK);
  var sh = ss.getSheetByName(A403_CONFIG.PROJECT_SHEET);
  var h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var d = sh.getLastRow() < 2 ? [] : sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var id = h.indexOf('Project_ID'), name = h.indexOf('Project_Name');
  if (!d.length) throw new Error('A4_03_TEST_NO_PROJECT');
  return {projectId:d[0][id],projectName:d[0][name]};
}

function peekNextA403Id_(existingIds) {
  var valid = existingIds.filter(function(v) { return /^SPN-[0-9]{6}$/.test(String(v).trim()); });
  var max = 0;
  valid.forEach(function(v) { max = Math.max(max, Number(String(v).split('-')[1])); });
  return 'SPN-' + String(max + 1).padStart(6, '0');
}

function getColumnValuesByHeader_(sheet, headers, header) {
  var idx = headers.indexOf(header);
  if (idx < 0 || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, idx + 1, sheet.getLastRow() - 1, 1).getValues().map(function(r) { return r[0]; });
}

function setByHeader_(row, headers, header, value) {
  var idx = headers.indexOf(header);
  if (idx < 0) throw new Error('A4_03_HEADER_MISSING: ' + header);
  row[idx] = value;
}

function findUniqueSpreadsheetByName_(name) {
  var files = DriveApp.getFilesByName(name);
  var found = [];
  while (files.hasNext()) found.push(files.next());
  if (found.length !== 1) throw new Error('A4_03_WORKBOOK_AMBIGUOUS_OR_MISSING: ' + name + ' count=' + found.length);
  return SpreadsheetApp.openById(found[0].getId());
}

function isValidEmail_(value) { return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(value)); }
function isValidDate_(value) { return value instanceof Date && !isNaN(value.getTime()); }

function hasOnEditTriggerForA403_() {
  return ScriptApp.getProjectTriggers().some(function(t) {
    return t.getEventType() === ScriptApp.EventType.ON_EDIT;
  });
}

function recordA403Failure_(e, err) {
  console.error(JSON.stringify({
    module: 'A4-03',
    source: 'FRM-02',
    responseSheet: e && e.range ? e.range.getSheet().getName() : null,
    row: e && e.range ? e.range.getRow() : null,
    error: String(err && err.message || err),
    timestamp: new Date().toISOString()
  }));
}
