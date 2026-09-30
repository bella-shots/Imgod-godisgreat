/** Phase 4 P4-39 — Form Response-Destination Integrity Verifier
 * READ-ONLY: this script does not modify Forms, response destinations, Sheets, or Drive.
 *
 * Verifies the seven frozen Phase-3 Form -> response-workbook mappings.
 * Native response tabs are checked by workbook destination ID; tab names are
 * reported from the workbook so the operator can compare them to the frozen map.
 */

const P4_39_EXPECTED = [
  {form:'FRM-01 — Create / Request Project', workbook:'MASTER_COMPANY_OPERATIONS', tab:'Projects_Responses'},
  {form:'FRM-02 — Employee Spending / Expense', workbook:'MASTER_COMPANY_FINANCE', tab:'Employee_Spending_Responses'},
  {form:'FRM-03 — OOP Claim', workbook:'MASTER_COMPANY_FINANCE', tab:'OOP_Claims_Responses'},
  {form:'FRM-04 — Employee Update / HR Request', workbook:'MASTER_COMPANY_HR_ADMIN', tab:'HR_Requests_Responses'},
  {form:'FRM-05 — MOM Input', workbook:'MASTER_COMPANY_OPERATIONS', tab:'MOM_Responses'},
  {form:'FRM-06 — Report Request', workbook:'MASTER_COMPANY_ADMIN', tab:'Report_Requests_Responses'},
  {form:'FRM-07 — Investment Entry', workbook:'MASTER_COMPANY_FINANCE', tab:'Investment_Responses'}
];

function verifyP4_39ResponseDestinations() {
  const results = P4_39_EXPECTED.map(verifyP4_39_);
  const pass = results.every(r => r.status === 'PASS');
  Logger.log(JSON.stringify({
    module:'P4-39',
    status: pass ? 'PASS' : 'FAIL',
    readOnly:true,
    results:results
  }, null, 2));
}

function verifyP4_39_(expected) {
  const form = findUniqueForm_(expected.form);
  if (!form) return {form:expected.form,status:'HUMAN_ACTION_REQUIRED',reason:'FORM_MISSING_OR_INACCESSIBLE'};

  const destinationId = form.getDestinationId();
  const destinationType = String(form.getDestinationType());
  if (!destinationId) {
    return {
      form:form.getTitle(),
      formId:form.getId(),
      status:'FAIL',
      reason:'NO_RESPONSE_DESTINATION',
      destinationType:destinationType
    };
  }

  const workbook = findUniqueSpreadsheet_(expected.workbook);
  if (!workbook) return {
    form:form.getTitle(),
    formId:form.getId(),
    status:'HUMAN_ACTION_REQUIRED',
    reason:'EXPECTED_WORKBOOK_MISSING_OR_INACCESSIBLE',
    expectedWorkbook:expected.workbook,
    actualDestinationId:destinationId
  };

  const workbookMatch = destinationId === workbook.getId();
  const sheet = workbook.getSheetByName(expected.tab);
  const tabExists = !!sheet;

  return {
    form:form.getTitle(),
    formId:form.getId(),
    status:(destinationType === 'SPREADSHEET' && workbookMatch && tabExists) ? 'PASS' : 'FAIL',
    expectedWorkbook:expected.workbook,
    expectedWorkbookId:workbook.getId(),
    expectedTab:expected.tab,
    actualDestinationType:destinationType,
    actualDestinationId:destinationId,
    workbookIdMatch:workbookMatch,
    expectedTabExists:tabExists
  };
}

function findUniqueForm_(title) {
  const files = DriveApp.searchFiles(
    'title = "' + escP4_39_(title) + '" and mimeType = "application/vnd.google-apps.form" and trashed = false'
  );
  const matches = [];
  while (files.hasNext()) matches.push(files.next());
  if (matches.length > 1) throw new Error('AMBIGUOUS FORM: ' + title);
  return matches.length ? FormApp.openById(matches[0].getId()) : null;
}

function findUniqueSpreadsheet_(title) {
  const files = DriveApp.searchFiles(
    'title = "' + escP4_39_(title) + '" and mimeType = "application/vnd.google-apps.spreadsheet" and trashed = false'
  );
  const matches = [];
  while (files.hasNext()) matches.push(files.next());
  if (matches.length > 1) throw new Error('AMBIGUOUS WORKBOOK: ' + title);
  return matches.length ? SpreadsheetApp.openById(matches[0].getId()) : null;
}

function escP4_39_(s) {
  return s.replace(/\\/g,'\\\\').replace(/"/g,'\\\"');
}
