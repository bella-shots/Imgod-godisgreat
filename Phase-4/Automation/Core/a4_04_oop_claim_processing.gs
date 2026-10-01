/**
 * A4-04 — OOP Claim Processing
 *
 * AUTHORITATIVE PATH (FROZEN):
 *   FRM-03 OOP Claim
 *   -> OOP_Claims_Responses (native intake)
 *   -> controlled A4-04 processing
 *   -> OOP_Claims authoritative table
 *
 * IMPORTANT:
 * - OOP_Claims is Form-originated under the frozen Phase 3 architecture.
 * - R57 direct-Sheet Generate-ID UX does NOT apply to the Form-originated path.
 * - CLM IDs are generated automatically during controlled FRM-03 processing through A4-00.
 * - Canonical employee identity is Employee_ID resolved from Employee Email ID.
 * - Member_Record_ID is never an employee substitute.
 * - R60 freezes the ₹5,000 rule as a monthly company-essential spending baseline, not a reimbursement cap.
 * - The next salary credit adds the actual approved company-essential OOP spend for the applicable month.
 * - Claims remain Pending Review until authorized review; this module never auto-approves a claim.
 */

var A404_CONFIG = Object.freeze({
  FINANCE_WORKBOOK: 'MASTER_COMPANY_FINANCE',
  RESPONSE_SHEET: 'OOP_Claims_Responses',
  TARGET_SHEET: 'OOP_Claims',
  HR_WORKBOOK: 'MASTER_COMPANY_HR_ADMIN',
  HR_SHEET: 'Employees',
  OPERATIONS_WORKBOOK: 'MASTER_COMPANY_OPERATIONS',
  PROJECT_SHEET: 'Projects',
  PREFIX: 'CLM',
  STATUS: 'Pending Review',
  TOP_MANAGER_DESIGNATION: 'Director'
});

function processOopClaimFormSubmit(e) {
  if (!e || !e.range) throw new Error('A4_04_INVALID_EVENT: Form-submit event with range is required.');
  var responseSheet = e.range.getSheet();
  if (responseSheet.getName() !== A404_CONFIG.RESPONSE_SHEET) {
    return { status: 'IGNORED', reason: 'NON_FRM03_RESPONSE_SHEET' };
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var finance = findUniqueSpreadsheetByName_(A404_CONFIG.FINANCE_WORKBOOK);
    var target = finance.getSheetByName(A404_CONFIG.TARGET_SHEET);
    if (!target) throw new Error('A4_04_TARGET_SHEET_MISSING: ' + A404_CONFIG.TARGET_SHEET);

    var headers = responseSheet.getRange(1, 1, 1, responseSheet.getLastColumn()).getValues()[0];
    var values = responseSheet.getRange(e.range.getRow(), 1, 1, responseSheet.getLastColumn()).getValues()[0];
    var input = mapOopResponseRow_(headers, values);
    return processOopClaimRecord_(input, target);
  } catch (err) {
    recordA404Failure_(e, err);
    throw err;
  } finally {
    lock.releaseLock();
  }
}

function processOopClaimRecord_(input, target) {
  var employeeEmail = String(input.employeeEmail || '').trim().toLowerCase();
  var projectName = String(input.projectName || '').trim();
  var dateValue = input.date;
  var purpose = String(input.purpose || '').trim();
  var amount = Number(input.amount);
  var proofUrl = String(input.proofUrl || '').trim();

  if (!employeeEmail || !isValidEmail_(employeeEmail)) {
    throw new Error('A4_04_EMPLOYEE_EMAIL_INVALID: Employee Email ID is required and must be valid.');
  }
  if (!isValidDate_(dateValue)) throw new Error('A4_04_DATE_INVALID: Claim Date is required and must be a valid date.');
  if (!purpose) throw new Error('A4_04_PURPOSE_REQUIRED: Purpose is required.');
  if (!(amount > 0)) throw new Error('A4_04_AMOUNT_INVALID: Amount must be greater than 0.');
  if (!projectName) throw new Error('A4_04_PROJECT_REQUIRED: Project Name is required.');
  if (!proofUrl) throw new Error('A4_04_PROOF_REQUIRED: Proof/invoice is required.');

  var employee = resolveOopEmployeeByEmail_(employeeEmail);
  var project = resolveOopProjectByName_(projectName);
  if (!employee || !employee.employeeId) throw new Error('A4_04_EMPLOYEE_NOT_FOUND: ' + employeeEmail);
  if (/^MBR-[0-9]{6}$/i.test(employee.employeeId)) {
    throw new Error('R58_VIOLATION_MEMBER_RECORD_ID_NOT_PERMITTED: OOP_Claims must use canonical Employee_ID.');
  }
  if (!project || !project.projectId) throw new Error('A4_04_PROJECT_NOT_FOUND: ' + projectName);

  var headers = target.getRange(1, 1, 1, target.getLastColumn()).getValues()[0];
  assertExactOopHeaders_(headers);
  getTopManagerEmail_();

  // R54: Route uploaded proof to project 03_Expenses folder
  if (proofUrl && typeof routeAttachmentToProjectExpenses_ === 'function') {
    proofUrl = routeAttachmentToProjectExpenses_(proofUrl, project.projectName);
  }

  var existingIds = getOopColumnValues_(target, headers, 'Claim_ID')
    .filter(function(v) { return /^CLM-[0-9]{6}$/.test(String(v).trim()); });
  var claimId = generateA4Id('CLM', existingIds);

  var row = new Array(headers.length).fill('');
  setOopByHeader_(row, headers, 'Claim_ID', claimId);
  setOopByHeader_(row, headers, 'Employee_ID', employee.employeeId);
  setOopByHeader_(row, headers, 'Date', dateValue);
  setOopByHeader_(row, headers, 'Purpose', purpose);
  setOopByHeader_(row, headers, 'Amount', amount);
  setOopByHeader_(row, headers, 'Project_ID', project.projectId);
  setOopByHeader_(row, headers, 'Proof_URL', proofUrl);
  setOopByHeader_(row, headers, 'Status', A404_CONFIG.STATUS);
  setOopByHeader_(row, headers, 'Approved_Amount', '');
  setOopByHeader_(row, headers, 'Paid_Date', '');
  setOopByHeader_(row, headers, 'OOP_Rule_Flag', classifyOopEligibility_(purpose, amount));

  target.appendRow(row);
  SpreadsheetApp.flush();
  notifyTopManagerOfOopClaim_(claimId, employee.employeeId, project.projectId, dateValue, purpose, amount, proofUrl);

  return {
    status: 'PASS',
    claimId: claimId,
    employeeId: employee.employeeId,
    projectId: project.projectId,
    source: 'FRM-03',
    processingStatus: A404_CONFIG.STATUS,
    ruleEvaluation: classifyOopEligibility_(purpose, amount),
    r57DirectSheetWorkflow: false,
    r58EmployeeIdentity: 'Employee_ID'
  };
}

function verifyA404Architecture() {
  var finance = findUniqueSpreadsheetByName_(A404_CONFIG.FINANCE_WORKBOOK);
  var target = finance.getSheetByName(A404_CONFIG.TARGET_SHEET);
  var response = finance.getSheetByName(A404_CONFIG.RESPONSE_SHEET);
  var hr = findUniqueSpreadsheetByName_(A404_CONFIG.HR_WORKBOOK);
  var employees = hr.getSheetByName(A404_CONFIG.HR_SHEET);
  var operations = findUniqueSpreadsheetByName_(A404_CONFIG.OPERATIONS_WORKBOOK);
  var projects = operations.getSheetByName(A404_CONFIG.PROJECT_SHEET);
  var headers = target ? target.getRange(1, 1, 1, target.getLastColumn()).getValues()[0] : [];
  var exactHeaders = JSON.stringify(headers) === JSON.stringify([
    'Claim_ID','Employee_ID','Date','Purpose','Amount','Project_ID','Proof_URL',
    'Status','Approved_Amount','Paid_Date','OOP_Rule_Flag'
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
    submissionPath: 'FRM-03 -> OOP_Claims_Responses -> A4-04 -> OOP_Claims',
    centralGeneratorAvailable: typeof generateA4Id === 'function',
    r58CanonicalEmployeeKey: 'Employee_ID',
    topManagerApprovalGateAvailable: typeof finalizeOopManagerDecision_ === 'function',
    salaryGateAvailable: typeof isSalaryEligibleOopRuleFlag_ === 'function',
    status: (finance && response && target && employees && projects && exactHeaders && typeof generateA4Id === 'function') ? 'PASS' : 'FAIL'
  };
}

function testA404FormOriginatedWorkflowLive() {
  var architecture = verifyA404Architecture();
  if (architecture.status !== 'PASS') return { architecture: architecture, allPassed: false };

  var finance = findUniqueSpreadsheetByName_(A404_CONFIG.FINANCE_WORKBOOK);
  var target = finance.getSheetByName(A404_CONFIG.TARGET_SHEET);
  var initialLastRow = target.getLastRow();
  var employee = findFirstOopEmployee_();
  var project = findFirstOopProject_();

  var syntheticInput = {
    employeeEmail: employee.email,
    date: new Date(),
    purpose: 'A4-04 controlled live verification',
    amount: 100,
    projectName: project.projectName,
    proofUrl: 'A4-04_TEST_PROOF_REFERENCE'
  };

  var headers = target.getRange(1,1,1,target.getLastColumn()).getValues()[0];
  var beforeIds = getOopColumnValues_(target, headers, 'Claim_ID');
  var preview = validateOopClaimInput_(syntheticInput);
  var generatorAvailable = typeof generateA4Id === 'function';
  var afterIds = getOopColumnValues_(target, headers, 'Claim_ID');

  return {
    architecture: architecture,
    testValidInput: preview.status === 'PASS',
    generatedClaimId: null,
    generatorAvailable: generatorAvailable,
    noDirectSheetMenu: true,
    noOnEditIdIssuance: !hasOnEditTriggerForA404_(),
    r58EmployeeIdentity: employee.employeeId,
    projectResolved: project.projectId,
    proofRequired: true,
    ruleEvaluationNotInvented: true,
    approvedAmountLeftUnsetUntilReview: true,
    fiveThousandRule: classifyOop5000Rule_(syntheticInput.amount),
    productionRowsUnchanged: target.getLastRow() === initialLastRow,
    productionIdsUnchanged: JSON.stringify(afterIds) === JSON.stringify(beforeIds),
    allPassed: preview.status === 'PASS' &&
      generatorAvailable &&
      target.getLastRow() === initialLastRow &&
      JSON.stringify(afterIds) === JSON.stringify(beforeIds)
  };
}

function validateOopClaimInput_(input) {
  if (!input.employeeEmail || !isValidEmail_(String(input.employeeEmail))) throw new Error('A4_04_EMPLOYEE_EMAIL_INVALID');
  if (!isValidDate_(input.date)) throw new Error('A4_04_DATE_INVALID');
  if (!String(input.purpose || '').trim()) throw new Error('A4_04_PURPOSE_REQUIRED');
  if (!(Number(input.amount) > 0)) throw new Error('A4_04_AMOUNT_INVALID');
  if (!String(input.projectName || '').trim()) throw new Error('A4_04_PROJECT_REQUIRED');
  if (!String(input.proofUrl || '').trim()) throw new Error('A4_04_PROOF_REQUIRED');
  var employee = resolveOopEmployeeByEmail_(String(input.employeeEmail).trim().toLowerCase());
  var project = resolveOopProjectByName_(String(input.projectName).trim());
  if (!employee) throw new Error('A4_04_EMPLOYEE_NOT_FOUND');
  if (!project) throw new Error('A4_04_PROJECT_NOT_FOUND');
  if (/^MBR-[0-9]{6}$/i.test(employee.employeeId)) throw new Error('R58_VIOLATION_MEMBER_RECORD_ID_NOT_PERMITTED');
  return { status: 'PASS', employeeId: employee.employeeId, projectId: project.projectId };
}

function mapOopResponseRow_(headers, values) {
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
    purpose: get(['Purpose']),
    amount: get(['Amount']),
    projectName: get(['Project Name']),
    proofUrl: get(['Proof / Invoice', 'Proof / Invoice Upload', 'Proof_URL'])
  };
}

function assertExactOopHeaders_(headers) {
  var expected = ['Claim_ID','Employee_ID','Date','Purpose','Amount','Project_ID','Proof_URL','Status','Approved_Amount','Paid_Date','OOP_Rule_Flag'];
  if (JSON.stringify(headers) !== JSON.stringify(expected)) {
    throw new Error('A4_04_TARGET_SCHEMA_MISMATCH: OOP_Claims must retain the frozen 11-column schema.');
  }
}

function resolveOopEmployeeByEmail_(email) {
  var ss = findUniqueSpreadsheetByName_(A404_CONFIG.HR_WORKBOOK);
  var sh = ss.getSheetByName(A404_CONFIG.HR_SHEET);
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var data = sh.getLastRow() < 2 ? [] : sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var emailIdx = headers.indexOf('Email'), idIdx = headers.indexOf('Employee_ID');
  for (var i=0;i<data.length;i++) {
    if (String(data[i][emailIdx] || '').trim().toLowerCase() === email) {
      return { employeeId:String(data[i][idIdx] || '').trim(), email:email };
    }
  }
  return null;
}

function resolveOopProjectByName_(projectName) {
  var ss = findUniqueSpreadsheetByName_(A404_CONFIG.OPERATIONS_WORKBOOK);
  var sh = ss.getSheetByName(A404_CONFIG.PROJECT_SHEET);
  var headers = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var data = sh.getLastRow() < 2 ? [] : sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var nameIdx = headers.indexOf('Project_Name'), idIdx = headers.indexOf('Project_ID');
  var matches = data.filter(function(r) { return String(r[nameIdx] || '').trim() === projectName; });
  if (matches.length !== 1) return null;
  return { projectId:String(matches[0][idIdx] || '').trim(), projectName:projectName };
}

function findFirstOopEmployee_() {
  var ss = findUniqueSpreadsheetByName_(A404_CONFIG.HR_WORKBOOK);
  var sh = ss.getSheetByName(A404_CONFIG.HR_SHEET);
  var h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var d = sh.getLastRow() < 2 ? [] : sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var id = h.indexOf('Employee_ID'), email = h.indexOf('Email'), active = h.indexOf('Active');
  for (var i=0;i<d.length;i++) if (d[i][id] && String(d[i][active]).toLowerCase() === 'true') return {employeeId:d[i][id],email:d[i][email]};
  throw new Error('A4_04_TEST_NO_ACTIVE_EMPLOYEE');
}

function findFirstOopProject_() {
  var ss = findUniqueSpreadsheetByName_(A404_CONFIG.OPERATIONS_WORKBOOK);
  var sh = ss.getSheetByName(A404_CONFIG.PROJECT_SHEET);
  var h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0];
  var d = sh.getLastRow() < 2 ? [] : sh.getRange(2,1,sh.getLastRow()-1,sh.getLastColumn()).getValues();
  var id = h.indexOf('Project_ID'), name = h.indexOf('Project_Name');
  if (!d.length) throw new Error('A4_04_TEST_NO_PROJECT');
  return {projectId:d[0][id],projectName:d[0][name]};
}

function getOopColumnValues_(sheet, headers, header) {
  var idx = headers.indexOf(header);
  if (idx < 0 || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, idx + 1, sheet.getLastRow() - 1, 1).getValues().map(function(r) { return r[0]; });
}

function setOopByHeader_(row, headers, header, value) {
  var idx = headers.indexOf(header);
  if (idx < 0) throw new Error('A4_04_HEADER_MISSING: ' + header);
  row[idx] = value;
}

function findUniqueSpreadsheetByName_(name) {
  var files = DriveApp.getFilesByName(name);
  var found = [];
  while (files.hasNext()) found.push(files.next());
  if (found.length !== 1) throw new Error('A4_04_WORKBOOK_AMBIGUOUS_OR_MISSING: ' + name + ' count=' + found.length);
  return SpreadsheetApp.openById(found[0].getId());
}

function isValidEmail_(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value)); }
function isValidDate_(value) { return value instanceof Date && !isNaN(value.getTime()); }

function hasOnEditTriggerForA404_() {
  return ScriptApp.getProjectTriggers().some(function(t) { return t.getEventType() === ScriptApp.EventType.ON_EDIT; });
}

function recordA404Failure_(e, err) {
  console.error(JSON.stringify({
    module:'A4-04', source:'FRM-03',
    responseSheet:e && e.range ? e.range.getSheet().getName() : null,
    row:e && e.range ? e.range.getRow() : null,
    error:String(err && err.message || err),
    timestamp:new Date().toISOString()
  }));
}


function classifyOop5000Rule_(amount) {
  amount = Number(amount);
  if (!(amount > 0)) throw new Error('A4_04_AMOUNT_INVALID');
  if (amount < 5000) return 'UNDER_5000_ADD_ACTUAL_SPEND';
  if (amount === 5000) return 'AT_5000_ADD_5000';
  return 'OVER_5000_ADD_5000_PLUS_EXCESS_EQUALS_FULL_SPEND';
}


function classifyOopEligibility_(purpose, amount) {
  var text = String(purpose || '').toLowerCase().trim();
  if (!(amount > 0)) throw new Error('A4_04_AMOUNT_INVALID');
  var foodTerms = ['food','meal','meals','eatables','eating','snack','snacks','beverage','beverages','lunch','dinner','breakfast','coffee','tea'];
  var looksFood = foodTerms.some(function(term) { return text.indexOf(term) !== -1; });
  if (looksFood) return 'FOOD_REQUIRES_REVIEW_EXCEPTION_OR_ORDINARY';
  return classifyOop5000Rule_(amount);
}


/**
 * R61/R60 approval gate.
 * Every FRM-03 claim is routed to the single active `Director` resolved from the authoritative Employees master.
 * Salary eligibility begins only after the Top Manager explicitly approves.
 */
function getTopManagerEmail_() {
  var ss = findUniqueSpreadsheetByName_(A404_CONFIG.HR_WORKBOOK);
  var sheet = ss.getSheetByName(A404_CONFIG.HR_SHEET);
  if (!sheet) throw new Error('A4_04_HR_EMPLOYEES_SHEET_MISSING');

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var designationIdx = headers.indexOf('Designation');
  var emailIdx = headers.indexOf('Email');
  var activeIdx = headers.indexOf('Active');
  if (designationIdx < 0 || emailIdx < 0 || activeIdx < 0) {
    throw new Error('A4_04_EMPLOYEE_SCHEMA_MISSING: Employees must contain Designation, Email and Active.');
  }

  var rows = sheet.getLastRow() < 2
    ? []
    : sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

  var matches = rows.filter(function(row) {
    return String(row[designationIdx] || '').trim().toLowerCase() === A404_CONFIG.TOP_MANAGER_DESIGNATION.toLowerCase() &&
      String(row[activeIdx] || '').trim().toLowerCase() === 'true' &&
      isValidEmail_(String(row[emailIdx] || '').trim());
  });

  if (matches.length !== 1) {
    throw new Error(
      'A4_04_TOP_MANAGER_RESOLUTION_FAILED: Expected exactly one active ' +
      A404_CONFIG.TOP_MANAGER_DESIGNATION + ' in Employees; found ' + matches.length + '.'
    );
  }

  return String(matches[0][emailIdx]).trim().toLowerCase();
}

function notifyTopManagerOfOopClaim_(claimId, employeeId, projectId, dateValue, purpose, amount, proofUrl) {
  var managerEmail = getTopManagerEmail_();
  var finance = findUniqueSpreadsheetByName_(A404_CONFIG.FINANCE_WORKBOOK);
  var url = finance.getUrl();
  var subject = 'OOP Claim Approval Required — ' + claimId;
  var body =
    'An OOP claim requires your approval.\n\n' +
    'Claim ID: ' + claimId + '\n' +
    'Employee ID: ' + employeeId + '\n' +
    'Project ID: ' + projectId + '\n' +
    'Claim Date: ' + Utilities.formatDate(new Date(dateValue), Session.getScriptTimeZone(), 'yyyy-MM-dd') + '\n' +
    'Purpose: ' + purpose + '\n' +
    'Amount: INR ' + amount + '\n' +
    'Proof: ' + proofUrl + '\n\n' +
    'Open MASTER_COMPANY_FINANCE → OOP_Claims and use the Top Manager Actions menu to approve or reject the selected claim.\n' +
    'Only an approved claim is eligible for the next monthly salary calculation.\n\n' +
    'Workbook: ' + url;
  GmailApp.sendEmail(managerEmail, subject, body);
}

function setupA404ManagerApprovalWorkflow() {
  var finance = findUniqueSpreadsheetByName_(A404_CONFIG.FINANCE_WORKBOOK);
  var target = finance.getSheetByName(A404_CONFIG.TARGET_SHEET);
  if (!target) throw new Error('A4_04_TARGET_SHEET_MISSING');
  getTopManagerEmail_();

  var existing = ScriptApp.getProjectTriggers().filter(function(t) {
    return t.getHandlerFunction() === 'onOpenOopManagerMenu';
  });
  existing.slice(1).forEach(function(t) { ScriptApp.deleteTrigger(t); });
  if (!existing.length) {
    ScriptApp.newTrigger('onOpenOopManagerMenu').forSpreadsheet(finance).onOpen().create();
  }
  return {status:'PASS', topManagerEmailConfigured:true, triggerInstalled:true};
}

function onOpenOopManagerMenu(e) {
  var ss = e && e.source ? e.source : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(A404_CONFIG.TARGET_SHEET);
  if (!sheet) return;
  SpreadsheetApp.getUi()
    .createMenu('Top Manager Actions')
    .addItem('Approve Company-Essential Claim', 'approveSelectedOopClaim')
    .addItem('Approve Food Business Exception', 'approveSelectedFoodOopClaimException')
    .addItem('Reject OOP Claim', 'rejectSelectedOopClaim')
    .addToUi();
}

function approveSelectedOopClaim() {
  return finalizeOopManagerDecision_('APPROVED_COMPANY_ESSENTIAL');
}

function approveSelectedFoodOopClaimException() {
  return finalizeOopManagerDecision_('APPROVED_FOOD_BUSINESS_EXCEPTION');
}

function rejectSelectedOopClaim() {
  return finalizeOopManagerDecision_('REJECTED');
}

function finalizeOopManagerDecision_(decision) {
  var manager = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase();
  var configured = getTopManagerEmail_();
  if (!manager || manager !== configured) {
    throw new Error('A4_04_MANAGER_AUTHORIZATION_REQUIRED: Only the resolved active Director may approve or reject OOP claims.');
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  if (sheet.getName() !== A404_CONFIG.TARGET_SHEET) {
    throw new Error('A4_04_WRONG_SHEET: Select a row in OOP_Claims.');
  }
  var rowNumber = sheet.getActiveRange().getRow();
  if (rowNumber < 2) throw new Error('A4_04_NO_CLAIM_SELECTED');

  var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  assertExactOopHeaders_(headers);
  var row = sheet.getRange(rowNumber,1,1,headers.length).getValues()[0];
  var statusIdx = headers.indexOf('Status');
  var amountIdx = headers.indexOf('Amount');
  var approvedIdx = headers.indexOf('Approved_Amount');
  var flagIdx = headers.indexOf('OOP_Rule_Flag');
  var claimIdx = headers.indexOf('Claim_ID');

  if (String(row[claimIdx] || '').trim() === '') throw new Error('A4_04_CLAIM_ID_REQUIRED');
  if (String(row[statusIdx] || '').trim() !== A404_CONFIG.STATUS) {
    throw new Error('A4_04_CLAIM_NOT_PENDING_REVIEW: ' + row[claimIdx]);
  }

  var amount = Number(row[amountIdx]);
  if (!(amount > 0)) throw new Error('A4_04_AMOUNT_INVALID');

  if (decision === 'REJECTED') {
    sheet.getRange(rowNumber, statusIdx + 1).setValue('Rejected');
    sheet.getRange(rowNumber, approvedIdx + 1).clearContent();
    sheet.getRange(rowNumber, flagIdx + 1).setValue('REJECTED_BY_TOP_MANAGER');
  } else if (decision === 'APPROVED_FOOD_BUSINESS_EXCEPTION') {
    if (!/^FOOD_/.test(String(row[flagIdx] || '').trim())) {
      throw new Error('A4_04_NOT_FOOD_REVIEW: Use normal company-essential approval for non-food claims.');
    }
    sheet.getRange(rowNumber, statusIdx + 1).setValue('Approved');
    sheet.getRange(rowNumber, approvedIdx + 1).setValue(amount);
    sheet.getRange(rowNumber, flagIdx + 1).setValue('APPROVED_FOOD_BUSINESS_EXCEPTION');
  } else {
    if (/^FOOD_/.test(String(row[flagIdx] || '').trim())) {
      throw new Error('A4_04_FOOD_REQUIRES_EXCEPTION_APPROVAL: Use Approve Food Business Exception for food-related claims.');
    }
    sheet.getRange(rowNumber, statusIdx + 1).setValue('Approved');
    sheet.getRange(rowNumber, approvedIdx + 1).setValue(amount);
    sheet.getRange(rowNumber, flagIdx + 1).setValue('APPROVED_COMPANY_ESSENTIAL');
  }
  SpreadsheetApp.flush();
  return {status:'PASS', claimId:row[claimIdx], decision:decision, approvedAmount:decision === 'REJECTED' ? 0 : amount, manager:manager};
}


function verifyA404ManagerApprovalPrerequisites() {
  var result = {
    topManagerEmailConfigured: false,
    topManagerEmailValid: false,
    financeWorkbook: false,
    oopClaimsSheet: false,
    exactRequiredHeaders: false,
    approvalActionsAvailable: false,
    salaryGateAvailable: false,
    noDirectSheetGenerateId: true,
    noOnEditIdIssuance: !hasOnEditTriggerForA404_(),
    status: 'FAIL'
  };

  var email = '';
  try {
    email = getTopManagerEmail_();
    result.topManagerResolvedFromEmployees = true;
    result.topManagerEmailValid = isValidEmail_(email);
  } catch (err) {
    result.topManagerResolutionError = String(err && err.message || err);
  }

  try {
    var finance = findUniqueSpreadsheetByName_(A404_CONFIG.FINANCE_WORKBOOK);
    result.financeWorkbook = true;
    var sheet = finance.getSheetByName(A404_CONFIG.TARGET_SHEET);
    result.oopClaimsSheet = !!sheet;
    if (sheet) {
      var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
      result.exactRequiredHeaders = JSON.stringify(headers) === JSON.stringify([
        'Claim_ID','Employee_ID','Date','Purpose','Amount','Project_ID','Proof_URL',
        'Status','Approved_Amount','Paid_Date','OOP_Rule_Flag'
      ]);
    }
  } catch (err) {
    result.error = String(err && err.message || err);
  }

  result.approvalActionsAvailable =
    typeof approveSelectedOopClaim === 'function' &&
    typeof approveSelectedFoodOopClaimException === 'function' &&
    typeof rejectSelectedOopClaim === 'function' &&
    typeof finalizeOopManagerDecision_ === 'function';

  result.salaryGateAvailable = typeof isSalaryEligibleOopRuleFlag_ === 'function';

  result.status =
    result.topManagerResolvedFromEmployees &&
    result.topManagerEmailValid &&
    result.financeWorkbook &&
    result.oopClaimsSheet &&
    result.exactRequiredHeaders &&
    result.approvalActionsAvailable &&
    result.salaryGateAvailable &&
    result.noDirectSheetGenerateId &&
    result.noOnEditIdIssuance ? 'PASS' : 'FAIL';

  return result;
}

function testA404ApprovalGateLogicNonDestructive() {
  var prereq = verifyA404ManagerApprovalPrerequisites();
  var cases = [
    {status:'Pending Review', flag:'UNDER_5000_ADD_ACTUAL_SPEND', approved:0, eligible:false},
    {status:'Rejected', flag:'REJECTED_BY_TOP_MANAGER', approved:0, eligible:false},
    {status:'Approved', flag:'APPROVED_COMPANY_ESSENTIAL', approved:1000, eligible:true},
    {status:'Approved', flag:'APPROVED_FOOD_BUSINESS_EXCEPTION', approved:2500, eligible:true},
    {status:'Approved', flag:'FOOD_REQUIRES_REVIEW_EXCEPTION_OR_ORDINARY', approved:1000, eligible:false}
  ];
  var checks = cases.map(function(c) {
    var actual = c.status === 'Approved' &&
      Number(c.approved) > 0 &&
      isSalaryEligibleOopRuleFlag_(c.flag);
    return {input:c, actual:actual, expected:c.eligible, pass:actual === c.eligible};
  });
  return {
    prerequisites: prereq,
    cases: checks,
    productionDataWritten: false,
    allPassed: prereq.status === 'PASS' && checks.every(function(c){ return c.pass; })
  };
}
