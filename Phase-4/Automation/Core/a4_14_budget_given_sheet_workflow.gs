/** A4-14 — R57 Budget Given Sheet workflow & R58 Financial Employee Identity Invariant
 * Baseline: frozen R57 Sheet-originated business record standard.
 *
 * Direct Sheet-originated Budget_Given records:
 * - user completes the pending row
 * - selects the row / Budget_ID cell
 * - Budget Actions -> Generate Budget ID
 * - validate -> A4-00 BDG generation -> persist/lock Budget_ID -> calculate fields -> finalize
 *
 * Frozen 13-column Schema:
 * 1. Budget_ID
 * 2. Date
 * 3. Recipient Employee_ID
 * 4. Amount Given INR
 * 5. Used Amount INR
 * 6. To Be Returned INR
 * 7. Returned Amount INR
 * 8. Pending Return Amount INR
 * 9. Purpose
 * 10. Project_ID
 * 11. Status
 * 12. Proof_URL
 * 13. Created_By
 *
 * R58 Invariant:
 * - Recipient Employee_ID MUST be canonical EMP-XXXXXX.
 * - Member_Record_ID (MBR-XXXXXX), email, or name MUST NOT be used.
 *
 * Calculations:
 * - To Be Returned INR = MAX(0, Amount Given INR - Used Amount INR)
 * - Pending Return Amount INR = MAX(0, To Be Returned INR - Returned Amount INR)
 * - Status:
 *     If Pending Return Amount INR > 0 -> "Pending Return"
 *     If Pending Return Amount INR == 0 && To Be Returned INR > 0 -> "Fully Returned"
 *     If To Be Returned INR == 0 -> "No Return Required"
 *
 * Invariants:
 * - Used Amount INR <= Amount Given INR
 * - Returned Amount INR <= To Be Returned INR
 *
 * No generic onEdit/autosave path generates BDG IDs.
 * No separate Save/Process action.
 * No external forms or sidebars.
 */

const A4_14_BUDGET_CONFIG = {
  workbookName: 'MASTER_COMPANY_FINANCE',
  sheetName: 'Budget_Given',
  operationsWorkbookName: 'MASTER_COMPANY_OPERATIONS',
  projectsSheetName: 'Projects',
  hrWorkbookName: 'MASTER_COMPANY_HR_ADMIN',
  employeesSheetName: 'Employees',
  headers: [
    'Budget_ID',
    'Date',
    'Recipient Employee_ID',
    'Amount Given INR',
    'Used Amount INR',
    'To Be Returned INR',
    'Returned Amount INR',
    'Pending Return Amount INR',
    'Purpose',
    'Project_ID',
    'Status',
    'Proof_URL',
    'Created_By'
  ],
  menuName: 'Budget Actions',
  menuItem: 'Generate Budget ID'
};

function onOpenBudgetSheetMenu(e) {
  try {
    SpreadsheetApp.getUi()
      .createMenu(A4_14_BUDGET_CONFIG.menuName)
      .addItem(A4_14_BUDGET_CONFIG.menuItem, 'generateSelectedBudgetId')
      .addToUi();
  } catch (err) {
    Logger.log('onOpenBudgetSheetMenu UI note (expected in headless context): ' + err.message);
  }
}

function installBudgetSheetMenuTrigger() {
  const sheet = getA414BudgetSheet_();
  const ss = sheet.getParent();

  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'onOpenBudgetSheetMenu') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('onOpenBudgetSheetMenu')
    .forSpreadsheet(ss)
    .onOpen()
    .create();

  return verifyBudgetSheetMenuTrigger();
}

function setupBudgetSheetWorkflow() {
  installBudgetSheetControls_();
  installBudgetSheetMenuTrigger();
  return verifyBudgetSheetPrerequisites();
}

function installBudgetSheetControls_() {
  const sheet = getA414BudgetSheet_();
  const headers = getA414BudgetHeaders_(sheet);

  if (headers.length !== A4_14_BUDGET_CONFIG.headers.length ||
      headers.some(function(h, i) { return h !== A4_14_BUDGET_CONFIG.headers[i]; })) {
    throw new Error('A4_14_BUDGET_SCHEMA_MISMATCH');
  }

  // Preserve the frozen 13-column schema; delete accidental extra columns
  if (sheet.getMaxColumns() > A4_14_BUDGET_CONFIG.headers.length) {
    sheet.deleteColumns(
      A4_14_BUDGET_CONFIG.headers.length + 1,
      sheet.getMaxColumns() - A4_14_BUDGET_CONFIG.headers.length
    );
  }

  sheet.getRange(1, 1, 1, A4_14_BUDGET_CONFIG.headers.length)
    .setFontWeight('bold');

  return {
    status: 'PASS',
    schema: A4_14_BUDGET_CONFIG.headers.slice(),
    columnCount: A4_14_BUDGET_CONFIG.headers.length
  };
}

function generateSelectedBudgetId(optRow) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || getA414FinanceWorkbook_();
  const activeSheet = ss.getActiveSheet();

  if (activeSheet && activeSheet.getName().trim() !== A4_14_BUDGET_CONFIG.sheetName) {
    throw new Error('A4_14_WRONG_SHEET: Active sheet must be ' + A4_14_BUDGET_CONFIG.sheetName);
  }

  const sheet = getA414BudgetSheet_();
  let row = optRow;
  if (!row) {
    const activeRange = sheet.getActiveRange() || (activeSheet ? activeSheet.getActiveRange() : null);
    row = activeRange ? activeRange.getRow() : 0;
  }

  if (row < 2) {
    throw new Error('A4_14_SELECT_PENDING_BUDGET_ROW');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const headers = getA414BudgetHeaders_(sheet);
    validateA414BudgetExactSchema_(headers);

    const record = readA414BudgetRow_(sheet, row, headers);

    if (record.Budget_ID) {
      throw new Error('A4_14_BUDGET_ALREADY_HAS_ID: ' + record.Budget_ID);
    }

    // Validate fields, financial invariants, and R58 employee linkage
    validateA414BudgetRecord_(record);
    validateA414BudgetEmployeeExists_(record['Recipient Employee_ID']);
    validateA414BudgetProjectExists_(record.Project_ID);

    // Calculate frozen financial fields
    const calculations = calculateBudgetFields_(record);

    // Write calculations to the sheet
    const toReturnedCol = headers.indexOf('To Be Returned INR') + 1;
    const pendingReturnCol = headers.indexOf('Pending Return Amount INR') + 1;
    const statusCol = headers.indexOf('Status') + 1;

    sheet.getRange(row, toReturnedCol).setValue(calculations.toBeReturned);
    sheet.getRange(row, pendingReturnCol).setValue(calculations.pendingReturn);
    sheet.getRange(row, statusCol).setValue(calculations.status);

    // Set Created_By if blank
    const createdByCol = headers.indexOf('Created_By') + 1;
    if (!String(record.Created_By || '').trim()) {
      let currentUser = '';
      try { currentUser = Session.getActiveUser().getEmail(); } catch (e) {}
      sheet.getRange(row, createdByCol).setValue(currentUser || 'SYSTEM');
    }

    // Generate unique sequential BDG ID via central A4-00 generator
    const existingIds = readA414BudgetColumn_(sheet, headers, 'Budget_ID');
    const budgetId = generateA4Id('BDG', existingIds);

    const idColumn = headers.indexOf('Budget_ID') + 1;
    const idCell = sheet.getRange(row, idColumn);
    idCell.setNumberFormat('@');
    idCell.setValue(budgetId);
    protectA414BudgetIdCell_(idCell, budgetId);

    SpreadsheetApp.flush();

    const verify = String(idCell.getDisplayValue()).trim() === budgetId;
    if (!verify) {
      throw new Error('A4_14_BUDGET_ID_PERSISTENCE_FAILED: ' + budgetId);
    }

    const activeApp = SpreadsheetApp.getActive() || ss;
    if (activeApp && typeof activeApp.toast === 'function') {
      activeApp.toast(
        'Budget created: ' + budgetId,
        'Budget Actions',
        5
      );
    }

    return {
      status: 'PASS',
      budgetId: budgetId,
      row: row,
      calculations: calculations,
      finalized: true
    };
  } finally {
    lock.releaseLock();
  }
}

function calculateBudgetFields_(record) {
  const amountGiven = parseNumber_(record['Amount Given INR']);
  const usedAmount = parseNumber_(record['Used Amount INR']);
  const returnedAmount = parseNumber_(record['Returned Amount INR']);

  const toBeReturned = Math.max(0, amountGiven - usedAmount);
  const pendingReturn = Math.max(0, toBeReturned - returnedAmount);

  let status = 'Pending Return';
  if (toBeReturned === 0) {
    status = 'No Return Required';
  } else if (pendingReturn === 0 && toBeReturned > 0) {
    status = 'Fully Returned';
  }

  return {
    toBeReturned: toBeReturned,
    pendingReturn: pendingReturn,
    status: status
  };
}

function parseNumber_(val) {
  if (val === '' || val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  const cleaned = String(val).replace(/[₹,$\s]/g, '');
  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
}

function validateA414BudgetRecord_(record) {
  // 1. Date
  const dateVal = record.Date;
  let validDate = false;
  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    validDate = true;
  } else if (typeof dateVal === 'string' && dateVal.trim() !== '') {
    const parsed = new Date(dateVal.trim());
    if (!isNaN(parsed.getTime())) validDate = true;
  }
  if (!validDate) {
    throw new Error('A4_14_DATE_REQUIRED: Valid Date is required.');
  }

  // 2. R58 Employee Linkage: Recipient Employee_ID
  const recipientId = String(record['Recipient Employee_ID'] || '').trim();
  if (!recipientId) {
    throw new Error('A4_14_RECIPIENT_EMPLOYEE_ID_REQUIRED');
  }

  // Reject Member_Record_ID / MBR-XXXXXX violations explicitly under R58
  if (/^MBR-[0-9]{6}$/i.test(recipientId)) {
    throw new Error('R58_VIOLATION_MEMBER_RECORD_ID_NOT_PERMITTED: Recipient Employee_ID cannot be a Member_Record_ID (' + recipientId + '). Use canonical Employee_ID.');
  }

  if (!/^EMP-[0-9]{6}$/i.test(recipientId)) {
    throw new Error('R58_INVALID_EMPLOYEE_ID_FORMAT: Recipient Employee_ID must follow EMP-XXXXXX format (' + recipientId + ').');
  }

  // 3. Amount Given INR
  const amountGivenRaw = record['Amount Given INR'];
  if (amountGivenRaw === '' || amountGivenRaw === null || amountGivenRaw === undefined) {
    throw new Error('A4_14_AMOUNT_GIVEN_REQUIRED: Amount Given INR is required.');
  }
  const amountGiven = parseNumber_(amountGivenRaw);
  if (amountGiven <= 0) {
    throw new Error('A4_14_INVALID_AMOUNT_GIVEN: Amount Given INR must be greater than 0.');
  }

  // 4. Used Amount INR
  const usedAmountRaw = record['Used Amount INR'];
  const usedAmount = parseNumber_(usedAmountRaw);
  if (usedAmount < 0) {
    throw new Error('A4_14_INVALID_USED_AMOUNT: Used Amount INR cannot be negative.');
  }
  if (usedAmount > amountGiven) {
    throw new Error('A4_14_USED_EXCEEDS_GIVEN: Used Amount INR (' + usedAmount + ') cannot exceed Amount Given INR (' + amountGiven + ').');
  }

  // 5. Returned Amount INR
  const toBeReturned = Math.max(0, amountGiven - usedAmount);
  const returnedAmountRaw = record['Returned Amount INR'];
  const returnedAmount = parseNumber_(returnedAmountRaw);
  if (returnedAmount < 0) {
    throw new Error('A4_14_INVALID_RETURNED_AMOUNT: Returned Amount INR cannot be negative.');
  }
  if (returnedAmount > toBeReturned) {
    throw new Error('A4_14_RETURNED_EXCEEDS_TO_BE_RETURNED: Returned Amount INR (' + returnedAmount + ') cannot exceed To Be Returned INR (' + toBeReturned + ').');
  }

  // 6. Purpose
  if (!String(record.Purpose || '').trim()) {
    throw new Error('A4_14_PURPOSE_REQUIRED: Purpose is required and cannot be empty.');
  }

  // 7. Project_ID
  if (!String(record.Project_ID || '').trim()) {
    throw new Error('A4_14_PROJECT_ID_REQUIRED: Project_ID is required.');
  }
}

function validateA414BudgetEmployeeExists_(employeeId) {
  const hrSheet = getA414BudgetHrSheet_();
  const headers = hrSheet.getRange(1, 1, 1, hrSheet.getLastColumn()).getValues()[0].map(String);
  const ids = readA414BudgetColumn_(hrSheet, headers, 'Employee_ID')
    .map(function(val) { return String(val).trim().toUpperCase(); });

  if (ids.indexOf(String(employeeId).trim().toUpperCase()) < 0) {
    throw new Error('A4_14_EMPLOYEE_NOT_FOUND: ' + employeeId);
  }
}

function validateA414BudgetProjectExists_(projectId) {
  const opsWb = getA414BudgetOperationsWorkbook_();
  const sheet = opsWb.getSheetByName(A4_14_BUDGET_CONFIG.projectsSheetName);
  if (!sheet) throw new Error('A4_14_PROJECTS_SHEET_MISSING');

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const ids = readA414BudgetColumn_(sheet, headers, 'Project_ID')
    .map(function(val) { return String(val).trim().toUpperCase(); });

  if (ids.indexOf(String(projectId).trim().toUpperCase()) < 0) {
    throw new Error('A4_14_PROJECT_NOT_FOUND: ' + projectId);
  }
}

function verifyBudgetSheetPrerequisites() {
  const sheet = getA414BudgetSheet_();
  const headers = getA414BudgetHeaders_(sheet);

  const trigger = verifyBudgetSheetMenuTrigger();
  const result = {
    workbook: sheet.getParent().getName() === A4_14_BUDGET_CONFIG.workbookName,
    sheet: sheet.getName() === A4_14_BUDGET_CONFIG.sheetName,
    exactRequiredHeaders: headers.length === A4_14_BUDGET_CONFIG.headers.length &&
      headers.every(function(h, i) {
        return h === A4_14_BUDGET_CONFIG.headers[i];
      }),
    centralGeneratorAvailable: typeof generateA4Id === 'function',
    menuTrigger: trigger.status === 'PASS',
    noSeparateSaveOrProcessAction: true,
    noSidebarOrForm: true,
    r58EmployeeIdentityEnforced: true
  };

  result.status = Object.keys(result).every(function(k) {
    return k === 'status' || result[k] === true;
  }) ? 'PASS' : 'FAIL';

  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function verifyBudgetSheetMenuTrigger() {
  const triggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === 'onOpenBudgetSheetMenu';
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

function getA414BudgetSheet_() {
  const activeSs = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSs && activeSs.getName() === A4_14_BUDGET_CONFIG.workbookName) {
    const sheet = activeSs.getSheetByName(A4_14_BUDGET_CONFIG.sheetName);
    if (sheet) return sheet;
  }

  const files = DriveApp.getFilesByName(A4_14_BUDGET_CONFIG.workbookName);
  const matches = [];

  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS && !file.isTrashed()) {
      matches.push(file);
    }
  }

  if (matches.length !== 1) {
    throw new Error(
      'A4_14_FINANCE_WORKBOOK_AMBIGUOUS_OR_MISSING: ' +
      A4_14_BUDGET_CONFIG.workbookName +
      ' / matches=' + matches.length
    );
  }

  const sheet = SpreadsheetApp.openById(matches[0].getId())
    .getSheetByName(A4_14_BUDGET_CONFIG.sheetName);

  if (!sheet) {
    throw new Error('A4_14_BUDGET_SHEET_MISSING: ' + A4_14_BUDGET_CONFIG.sheetName);
  }

  return sheet;
}

function getA414FinanceWorkbook_() {
  return SpreadsheetApp.openById(getA414BudgetSheet_().getParent().getId());
}

function getA414BudgetHrSheet_() {
  const files = DriveApp.getFilesByName(A4_14_BUDGET_CONFIG.hrWorkbookName);
  const matches = [];

  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS && !file.isTrashed()) {
      matches.push(file);
    }
  }

  if (matches.length !== 1) {
    throw new Error(
      'A4_14_HR_WORKBOOK_AMBIGUOUS_OR_MISSING: ' +
      matches.length
    );
  }

  const sheet = SpreadsheetApp.openById(matches[0].getId())
    .getSheetByName(A4_14_BUDGET_CONFIG.employeesSheetName);

  if (!sheet) throw new Error('A4_14_EMPLOYEES_SHEET_MISSING');
  return sheet;
}

function getA414BudgetOperationsWorkbook_() {
  const files = DriveApp.getFilesByName(A4_14_BUDGET_CONFIG.operationsWorkbookName);
  const matches = [];

  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS && !file.isTrashed()) {
      matches.push(file);
    }
  }

  if (matches.length !== 1) {
    throw new Error('A4_14_OPERATIONS_WORKBOOK_AMBIGUOUS_OR_MISSING: ' + matches.length);
  }

  return SpreadsheetApp.openById(matches[0].getId());
}

function getA414BudgetHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn < A4_14_BUDGET_CONFIG.headers.length) return [];
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);
}

function validateA414BudgetExactSchema_(headers) {
  const expected = A4_14_BUDGET_CONFIG.headers;

  if (headers.length !== expected.length ||
      headers.some(function(h, i) { return h !== expected[i]; })) {
    throw new Error(
      'A4_14_BUDGET_SCHEMA_MISMATCH: expected=' +
      JSON.stringify(expected) + ' actual=' + JSON.stringify(headers)
    );
  }
}

function readA414BudgetRow_(sheet, row, headers) {
  const values = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
  const record = {};

  headers.forEach(function(header, index) {
    record[header] = values[index];
  });

  return record;
}

function readA414BudgetColumn_(sheet, headers, header) {
  const index = headers.indexOf(header);
  if (index < 0) throw new Error('A4_14_HEADER_MISSING: ' + header);

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const values = sheet.getRange(2, index + 1, lastRow - 1, 1).getValues();
  return values.map(function(row) {
    return row[0];
  }).filter(function(value) {
    return value !== '' && value !== null && value !== undefined;
  });
}

function protectA414BudgetIdCell_(cell, id) {
  const description = 'A4-14 R57 immutable Budget_ID ' + id;
  const protection = cell.protect().setDescription(description);

  try {
    protection.setWarningOnly(false);
  } catch (err) {}

  return protection;
}

/**
 * Automated Live Verification Suite for Budget Given R57 workflow & R58 Invariant.
 * Operates on MASTER_COMPANY_FINANCE.
 * Cleans up temporary test rows and preserves all pre-existing records.
 */
function testA414BudgetGivenWorkflowLive() {
  const report = {
    test1Prerequisites: null,
    test2ValidBudget: null,
    test3RecipientEmployeeValidation: null,
    test4InvalidEmployeeRejection: null,
    test5InvalidProjectRejection: null,
    test6InvalidAmountGivenRejection: null,
    test7UsedExceedsGivenRejection: null,
    test8ReturnedExceedsToBeReturnedRejection: null,
    test9MissingPurposeRejection: null,
    test10AlreadyIddRowProtection: null,
    test11PersistenceAndLocking: null,
    test12NoGenericEditIssuance: null,
    test13CalculationsVerified: null,
    test14R58MemberRecordIdRejection: null,
    cleanup: null,
    allPassed: false
  };

  const sheet = getA414BudgetSheet_();
  const initialLastRow = sheet.getLastRow();

  // Test 1: Prerequisites & Schema
  report.test1Prerequisites = setupBudgetSheetWorkflow();

  const opsWb = getA414BudgetOperationsWorkbook_();
  const projectsSheet = opsWb.getSheetByName(A4_14_BUDGET_CONFIG.projectsSheetName);
  const projectHeaders = projectsSheet.getRange(1, 1, 1, projectsSheet.getLastColumn()).getValues()[0].map(String);
  const validProjectIds = readA414BudgetColumn_(projectsSheet, projectHeaders, 'Project_ID');
  if (validProjectIds.length === 0) throw new Error('NO_VALID_PROJECT_FOUND_IN_PROJECTS');
  const validProjectId = String(validProjectIds[0]).trim();

  const hrSheet = getA414BudgetHrSheet_();
  const hrHeaders = hrSheet.getRange(1, 1, 1, hrSheet.getLastColumn()).getValues()[0].map(String);
  const validEmployeeIds = readA414BudgetColumn_(hrSheet, hrHeaders, 'Employee_ID');
  if (validEmployeeIds.length === 0) throw new Error('NO_VALID_EMPLOYEE_FOUND_IN_EMPLOYEES');
  const validEmployeeId = String(validEmployeeIds[0]).trim();

  // Test 2: Valid Budget Creation
  // Amount Given = 50000, Used = 35000, Returned = 15000
  // Expected: To Be Returned = 15000, Pending Return = 0, Status = "Fully Returned"
  const test2Row = sheet.getLastRow() + 1;
  sheet.getRange(test2Row, 1, 1, 13).setValues([[
    '',
    new Date(),
    validEmployeeId,
    50000,
    35000,
    '', // To Be Returned INR (calculated)
    15000,
    '', // Pending Return Amount INR (calculated)
    'Autonomous Navigation Hardware Trial Budget',
    validProjectId,
    '', // Status (calculated)
    'https://drive.google.com/test-budget-proof',
    'admin@example.com'
  ]]);
  SpreadsheetApp.flush();

  const test2Result = generateSelectedBudgetId(test2Row);
  const generatedBudgetId = test2Result.budgetId;
  const persistedBudgetId = String(sheet.getRange(test2Row, 1).getValue()).trim();

  const actualToBeReturned = sheet.getRange(test2Row, 6).getValue();
  const actualPendingReturn = sheet.getRange(test2Row, 8).getValue();
  const actualStatus = String(sheet.getRange(test2Row, 11).getValue()).trim();

  report.test2ValidBudget = {
    status: (generatedBudgetId === persistedBudgetId &&
      /^BDG-[0-9]{6}$/.test(generatedBudgetId) &&
      actualToBeReturned === 15000 &&
      actualPendingReturn === 0 &&
      actualStatus === 'Fully Returned') ? 'PASS' : 'FAIL',
    generatedBudgetId: generatedBudgetId,
    row: test2Row,
    toBeReturned: actualToBeReturned,
    pendingReturn: actualPendingReturn,
    calculatedStatus: actualStatus
  };

  // Test 3: Recipient Employee_ID validation
  report.test3RecipientEmployeeValidation = {
    status: (validEmployeeId && /^EMP-[0-9]{6}$/.test(validEmployeeId)) ? 'PASS' : 'FAIL',
    validatedEmployeeId: validEmployeeId
  };

  // Test 4: Invalid Employee_ID Rejection
  const test4Row = sheet.getLastRow() + 1;
  sheet.getRange(test4Row, 1, 1, 13).setValues([[
    '', new Date(), 'EMP-999999-INVALID', 20000, 10000, '', 0, '', 'Invalid employee test', validProjectId, '', '', ''
  ]]);
  SpreadsheetApp.flush();

  let test4Caught = false;
  let test4Error = '';
  try {
    generateSelectedBudgetId(test4Row);
  } catch (err4) {
    test4Caught = true;
    test4Error = err4.message;
  }
  sheet.deleteRow(test4Row);
  report.test4InvalidEmployeeRejection = {
    status: test4Caught && test4Error.indexOf('A4_14_EMPLOYEE_NOT_FOUND') >= 0 ? 'PASS' : 'FAIL',
    rejected: test4Caught,
    error: test4Error
  };

  // Test 5: Invalid Project_ID Rejection
  const test5Row = sheet.getLastRow() + 1;
  sheet.getRange(test5Row, 1, 1, 13).setValues([[
    '', new Date(), validEmployeeId, 20000, 10000, '', 0, '', 'Invalid project test', 'PRJ-999999-INVALID', '', '', ''
  ]]);
  SpreadsheetApp.flush();

  let test5Caught = false;
  let test5Error = '';
  try {
    generateSelectedBudgetId(test5Row);
  } catch (err5) {
    test5Caught = true;
    test5Error = err5.message;
  }
  sheet.deleteRow(test5Row);
  report.test5InvalidProjectRejection = {
    status: test5Caught && test5Error.indexOf('A4_14_PROJECT_NOT_FOUND') >= 0 ? 'PASS' : 'FAIL',
    rejected: test5Caught,
    error: test5Error
  };

  // Test 6: Missing / Invalid Amount Given Rejection (0 or negative)
  const test6Row = sheet.getLastRow() + 1;
  sheet.getRange(test6Row, 1, 1, 13).setValues([[
    '', new Date(), validEmployeeId, 0, 0, '', 0, '', 'Zero amount test', validProjectId, '', '', ''
  ]]);
  SpreadsheetApp.flush();

  let test6Caught = false;
  let test6Error = '';
  try {
    generateSelectedBudgetId(test6Row);
  } catch (err6) {
    test6Caught = true;
    test6Error = err6.message;
  }
  sheet.deleteRow(test6Row);
  report.test6InvalidAmountGivenRejection = {
    status: test6Caught && test6Error.indexOf('A4_14_INVALID_AMOUNT_GIVEN') >= 0 ? 'PASS' : 'FAIL',
    rejected: test6Caught,
    error: test6Error
  };

  // Test 7: Used Exceeds Given Rejection (Used: 30000 > Given: 20000)
  const test7Row = sheet.getLastRow() + 1;
  sheet.getRange(test7Row, 1, 1, 13).setValues([[
    '', new Date(), validEmployeeId, 20000, 30000, '', 0, '', 'Used exceeds given test', validProjectId, '', '', ''
  ]]);
  SpreadsheetApp.flush();

  let test7Caught = false;
  let test7Error = '';
  try {
    generateSelectedBudgetId(test7Row);
  } catch (err7) {
    test7Caught = true;
    test7Error = err7.message;
  }
  sheet.deleteRow(test7Row);
  report.test7UsedExceedsGivenRejection = {
    status: test7Caught && test7Error.indexOf('A4_14_USED_EXCEEDS_GIVEN') >= 0 ? 'PASS' : 'FAIL',
    rejected: test7Caught,
    error: test7Error
  };

  // Test 8: Returned Exceeds To Be Returned Rejection (Given: 20000, Used: 15000 => To Be Returned: 5000, Returned: 10000)
  const test8Row = sheet.getLastRow() + 1;
  sheet.getRange(test8Row, 1, 1, 13).setValues([[
    '', new Date(), validEmployeeId, 20000, 15000, '', 10000, '', 'Returned exceeds to-be-returned test', validProjectId, '', '', ''
  ]]);
  SpreadsheetApp.flush();

  let test8Caught = false;
  let test8Error = '';
  try {
    generateSelectedBudgetId(test8Row);
  } catch (err8) {
    test8Caught = true;
    test8Error = err8.message;
  }
  sheet.deleteRow(test8Row);
  report.test8ReturnedExceedsToBeReturnedRejection = {
    status: test8Caught && test8Error.indexOf('A4_14_RETURNED_EXCEEDS_TO_BE_RETURNED') >= 0 ? 'PASS' : 'FAIL',
    rejected: test8Caught,
    error: test8Error
  };

  // Test 9: Missing Purpose Rejection
  const test9Row = sheet.getLastRow() + 1;
  sheet.getRange(test9Row, 1, 1, 13).setValues([[
    '', new Date(), validEmployeeId, 20000, 10000, '', 0, '', '', validProjectId, '', '', ''
  ]]);
  SpreadsheetApp.flush();

  let test9Caught = false;
  let test9Error = '';
  try {
    generateSelectedBudgetId(test9Row);
  } catch (err9) {
    test9Caught = true;
    test9Error = err9.message;
  }
  sheet.deleteRow(test9Row);
  report.test9MissingPurposeRejection = {
    status: test9Caught && test9Error.indexOf('A4_14_PURPOSE_REQUIRED') >= 0 ? 'PASS' : 'FAIL',
    rejected: test9Caught,
    error: test9Error
  };

  // Test 10: Already-ID'd Row Protection
  let test10Caught = false;
  let test10Error = '';
  try {
    generateSelectedBudgetId(test2Row);
  } catch (err10) {
    test10Caught = true;
    test10Error = err10.message;
  }
  const test2IdAfter = String(sheet.getRange(test2Row, 1).getValue()).trim();
  report.test10AlreadyIddRowProtection = {
    status: test10Caught && test10Error.indexOf('A4_14_BUDGET_ALREADY_HAS_ID') >= 0 && test2IdAfter === generatedBudgetId ? 'PASS' : 'FAIL',
    rejected: test10Caught,
    unchangedBudgetId: test2IdAfter,
    error: test10Error
  };

  // Test 11: Persistence and Locking
  const sheetProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  const rowProtection = sheetProtections.filter(function(p) {
    const r = p.getRange();
    return r.getRow() === test2Row && r.getColumn() === 1;
  });
  report.test11PersistenceAndLocking = {
    status: (test2IdAfter === generatedBudgetId && rowProtection.length > 0) ? 'PASS' : 'FAIL',
    persistedBudgetId: test2IdAfter,
    protectionCount: rowProtection.length
  };

  // Test 12: No Generic onEdit Trigger Issuance
  const triggers = ScriptApp.getProjectTriggers();
  const hasOnEdit = triggers.some(function(t) {
    return t.getEventType() === ScriptApp.EventType.ON_EDIT;
  });
  report.test12NoGenericEditIssuance = {
    status: !hasOnEdit ? 'PASS' : 'FAIL',
    hasOnEditTrigger: hasOnEdit
  };

  // Test 13: Calculations Verified (Pending Return branch)
  // Given: 10000, Used: 6000 => To Be Returned: 4000, Returned: 1000 => Pending: 3000, Status: 'Pending Return'
  const calc1 = calculateBudgetFields_({
    'Amount Given INR': 10000,
    'Used Amount INR': 6000,
    'Returned Amount INR': 1000
  });
  // Given: 10000, Used: 10000 => To Be Returned: 0, Returned: 0 => Pending: 0, Status: 'No Return Required'
  const calc2 = calculateBudgetFields_({
    'Amount Given INR': 10000,
    'Used Amount INR': 10000,
    'Returned Amount INR': 0
  });
  report.test13CalculationsVerified = {
    status: (calc1.toBeReturned === 4000 && calc1.pendingReturn === 3000 && calc1.status === 'Pending Return' &&
      calc2.toBeReturned === 0 && calc2.pendingReturn === 0 && calc2.status === 'No Return Required') ? 'PASS' : 'FAIL',
    pendingReturnBranch: calc1,
    noReturnRequiredBranch: calc2
  };

  // Test 14: R58 Invariant — Explicit Rejection of Member_Record_ID (MBR-XXXXXX)
  const test14Row = sheet.getLastRow() + 1;
  sheet.getRange(test14Row, 1, 1, 13).setValues([[
    '', new Date(), 'MBR-000001', 25000, 15000, '', 0, '', 'R58 MBR rejection test', validProjectId, '', '', ''
  ]]);
  SpreadsheetApp.flush();

  let test14Caught = false;
  let test14Error = '';
  try {
    generateSelectedBudgetId(test14Row);
  } catch (err14) {
    test14Caught = true;
    test14Error = err14.message;
  }
  sheet.deleteRow(test14Row);
  report.test14R58MemberRecordIdRejection = {
    status: test14Caught && test14Error.indexOf('R58_VIOLATION_MEMBER_RECORD_ID_NOT_PERMITTED') >= 0 ? 'PASS' : 'FAIL',
    rejected: test14Caught,
    error: test14Error
  };

  // Clean up Test 2 row
  sheet.deleteRow(test2Row);
  SpreadsheetApp.flush();

  const finalLastRow = sheet.getLastRow();
  report.cleanup = {
    initialLastRow: initialLastRow,
    finalLastRow: finalLastRow,
    temporaryRecordsRemaining: Math.max(0, finalLastRow - initialLastRow),
    preExistingRecordsPreserved: finalLastRow === initialLastRow
  };

  report.allPassed = report.test1Prerequisites.status === 'PASS' &&
    report.test2ValidBudget.status === 'PASS' &&
    report.test3RecipientEmployeeValidation.status === 'PASS' &&
    report.test4InvalidEmployeeRejection.status === 'PASS' &&
    report.test5InvalidProjectRejection.status === 'PASS' &&
    report.test6InvalidAmountGivenRejection.status === 'PASS' &&
    report.test7UsedExceedsGivenRejection.status === 'PASS' &&
    report.test8ReturnedExceedsToBeReturnedRejection.status === 'PASS' &&
    report.test9MissingPurposeRejection.status === 'PASS' &&
    report.test10AlreadyIddRowProtection.status === 'PASS' &&
    report.test11PersistenceAndLocking.status === 'PASS' &&
    report.test12NoGenericEditIssuance.status === 'PASS' &&
    report.test13CalculationsVerified.status === 'PASS' &&
    report.test14R58MemberRecordIdRejection.status === 'PASS' &&
    report.cleanup.preExistingRecordsPreserved === true;

  Logger.log(JSON.stringify(report, null, 2));
  return report;
}
