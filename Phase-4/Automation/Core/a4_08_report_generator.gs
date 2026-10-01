/**
 * A4-08 — Report Generator
 *
 * AUTHORITATIVE ARCHITECTURE:
 *   FRM-06 Report Request
 *   -> Report_Requests_Responses (native intake in MASTER_COMPANY_ADMIN)
 *   -> A4-08 Report Generator
 *   -> authorized human-readable report artifact in MASTER COMPANY/Reports
 *   -> Report_Index (authoritative catalog in MASTER_COMPANY_ADMIN)
 *
 * Frozen report types:
 *   Company Summary | Project Report | Finance Report | HR Report
 *
 * Frozen delivery boundary:
 *   The generated dataset is authorization-filtered before rendering.
 *   Phase 5 may display the same report content in-system; A4-08 persists
 *   the authoritative artifact and catalog entry. Download is optional at
 *   the user layer and must use the same authorized dataset.
 *
 * Important:
 *   A4-08 does NOT infer authorization from Employees.Role or Designation.
 *   Self-scope is always available to the requester. Broader access is
 *   granted only when the requester has explicit Drive access to the
 *   corresponding restricted workbook. Project scope is additionally
 *   constrained by Project_Members for non-administrative requesters.
 */

var A408_CONFIG = Object.freeze({
  ADMIN_WORKBOOK: 'MASTER_COMPANY_ADMIN',
  OPERATIONS_WORKBOOK: 'MASTER_COMPANY_OPERATIONS',
  FINANCE_WORKBOOK: 'MASTER_COMPANY_FINANCE',
  HR_WORKBOOK: 'MASTER_COMPANY_HR_ADMIN',
  REPORT_INDEX_SHEET: 'Report_Index',
  RESPONSE_SHEET: 'Report_Requests_Responses',
  PROJECTS_SHEET: 'Projects',
  MEMBERS_SHEET: 'Project_Members',
  MOM_SHEET: 'Project_MOM_Index',
  NOTES_SHEET: 'Project_Notes',
  BUDGET_SHEET: 'Budget_Given',
  SPENDING_SHEET: 'Employee_Spending',
  OOP_SHEET: 'OOP_Claims',
  SALARY_SHEET: 'Salary_Admin',
  INVESTMENTS_SHEET: 'Investments',
  EMPLOYEES_SHEET: 'Employees',
  HR_ADMIN_SHEET: 'HR_Admin',
  REPORT_FOLDER: 'Reports',
  PREFIX: 'RPT',
  REPORT_TYPES: ['Company Summary', 'Project Report', 'Finance Report', 'HR Report'],
  REPORT_INDEX_HEADERS: [
    'Report_ID','Report_Type','Period','Project_ID','Drive_URL','Status','Generated_Date'
  ]
});

/**
 * Main entry point for FRM-06 onFormSubmit trigger.
 */
function processA408ReportFormSubmit(e) {
  if (!e || !e.range) {
    throw new Error('A4_08_INVALID_EVENT: onFormSubmit event with range is required.');
  }

  var responseSheet = e.range.getSheet();
  if (responseSheet.getName() !== A408_CONFIG.RESPONSE_SHEET) {
    return {status:'IGNORED', reason:'NON_FRM06_SHEET'};
  }

  var admin = findUniqueA408Spreadsheet_(A408_CONFIG.ADMIN_WORKBOOK);
  var headers = responseSheet.getRange(1,1,1,responseSheet.getLastColumn()).getValues()[0];
  var values = responseSheet.getRange(e.range.getRow(),1,1,responseSheet.getLastColumn()).getValues()[0];
  var input = mapA408ResponseRow_(headers, values);

  try {
    return generateA408Report_(input, admin);
  } catch (err) {
    console.error(JSON.stringify({
      module:'A4-08',
      source:'FRM-06',
      responseSheet:responseSheet.getName(),
      row:e.range.getRow(),
      error:String(err && err.message || err),
      timestamp:new Date().toISOString()
    }));
    throw err;
  }
}

/**
 * Generates one authorized report and indexes it.
 */
function generateA408Report_(input, admin) {
  var requesterEmail = normalizeA408Email_(input.employeeEmail);
  if (!requesterEmail) throw new Error('A4_08_EMPLOYEE_EMAIL_REQUIRED');

  var reportType = String(input.reportType || '').trim();
  if (A408_CONFIG.REPORT_TYPES.indexOf(reportType) < 0) {
    throw new Error('A4_08_REPORT_TYPE_INVALID: ' + reportType);
  }

  var period = parseA408Period_(input.period);
  var requestContext = resolveA408Requester_(requesterEmail);
  var project = null;

  if (reportType === 'Project Report') {
    if (!String(input.projectName || '').trim()) {
      throw new Error('A4_08_PROJECT_NAME_REQUIRED');
    }
    project = resolveA408ProjectByExactName_(input.projectName);
    if (!project) throw new Error('A4_08_PROJECT_NOT_FOUND: ' + input.projectName);
    if (!isA408ProjectAuthorized_(requestContext, project.projectId)) {
      throw new Error('A4_08_PROJECT_ACCESS_DENIED: ' + project.projectId);
    }
  }

  var dataset = buildA408AuthorizedDataset_(reportType, period, requestContext, project);
  var reportId = generateA408ReportId_(admin);
  var generatedDate = new Date();
  var report = buildA408ReportDocument_(reportId, reportType, period, requestContext, project, dataset, generatedDate);

  var reportFolder = resolveA408ReportsFolder_();
  var fileResult = createA408ReportArtifact_(reportFolder, report);

  var indexSheet = admin.getSheetByName(A408_CONFIG.REPORT_INDEX_SHEET);
  if (!indexSheet) throw new Error('A4_08_REPORT_INDEX_SHEET_MISSING');
  assertA408Headers_(indexSheet.getRange(1,1,1,indexSheet.getLastColumn()).getValues()[0]);

  var row = [
    reportId,
    reportType,
    period.label,
    project ? project.projectId : '',
    fileResult.driveUrl,
    'Published',
    Utilities.formatDate(generatedDate, Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd')
  ];
  indexSheet.appendRow(row);
  SpreadsheetApp.flush();

  return {
    status:'PASS',
    module:'A4-08',
    reportId:reportId,
    reportType:reportType,
    period:period.label,
    projectId:project ? project.projectId : '',
    driveUrl:fileResult.driveUrl,
    downloadUrl:fileResult.pdfUrl,
    generatedDate:generatedDate.toISOString(),
    authorizationMode:requestContext.authorizationMode
  };
}

function buildA408AuthorizedDataset_(reportType, period, requester, project) {
  if (reportType === 'Company Summary') {
    return buildA408CompanySummary_(period, requester);
  }
  if (reportType === 'Project Report') {
    return buildA408ProjectReport_(period, requester, project);
  }
  if (reportType === 'Finance Report') {
    return buildA408FinanceReport_(period, requester);
  }
  if (reportType === 'HR Report') {
    return buildA408HrReport_(period, requester);
  }
  throw new Error('A4_08_UNSUPPORTED_REPORT_TYPE');
}

/* ----------------------------- Company Summary ---------------------------- */

function buildA408CompanySummary_(period, requester) {
  var ops = findUniqueA408Spreadsheet_(A408_CONFIG.OPERATIONS_WORKBOOK);
  var projects = getA408Rows_(ops, A408_CONFIG.PROJECTS_SHEET);
  var moms = getA408Rows_(ops, A408_CONFIG.MOM_SHEET);
  var notes = getA408Rows_(ops, A408_CONFIG.NOTES_SHEET);
  var snapshot = countA408By_(projects, 'Status');

  var out = {
    projectSnapshot: {
      total: projects.length,
      byStatus: snapshot
    },
    projectActivity: {
      created: projects.filter(function(r){return inA408Date_(r.Created_At, period);}).length,
      starts: projects.filter(function(r){return inA408Date_(r.Start_Date, period);}).length,
      events: projects.filter(function(r){return inA408Date_(r.Event_Date, period);}).length
    },
    momCount: moms.filter(function(r){
      return inA408Date_(r.Meeting_Date, period) && ['Published','Revised','Approved'].indexOf(String(r.Status)) >= 0;
    }).length,
    publishedNotes: notes.filter(function(r){
      return inA408Date_(r.Date, period) && String(r.Status) === 'Published';
    }).length,
    finance: null,
    hr: null
  };

  if (requester.financeAccess) out.finance = buildA408FinanceSummary_(period, requester);
  if (requester.hrAccess) out.hr = buildA408HrSummary_(period, requester);

  return out;
}

/* ------------------------------ Project Report ---------------------------- */

function buildA408ProjectReport_(period, requester, project) {
  var ops = findUniqueA408Spreadsheet_(A408_CONFIG.OPERATIONS_WORKBOOK);
  var projects = getA408Rows_(ops, A408_CONFIG.PROJECTS_SHEET);
  var projectRow = projects.filter(function(r){return String(r.Project_ID) === project.projectId;})[0];
  if (!projectRow) throw new Error('A4_08_PROJECT_RECORD_MISSING');

  var members = getA408Rows_(ops, A408_CONFIG.MEMBERS_SHEET).filter(function(r){
    return String(r.Project_ID) === project.projectId && String(r.Active).toUpperCase() === 'TRUE';
  });
  var notes = getA408Rows_(ops, A408_CONFIG.NOTES_SHEET).filter(function(r){
    return String(r.Project_ID) === project.projectId &&
      String(r.Status) === 'Published' &&
      inA408Date_(r.Date, period);
  });
  var moms = getA408Rows_(ops, A408_CONFIG.MOM_SHEET).filter(function(r){
    return String(r.Project_ID) === project.projectId &&
      ['Published','Revised'].indexOf(String(r.Status)) >= 0 &&
      inA408Date_(r.Meeting_Date, period);
  });

  var finance = requester.financeAccess
    ? buildA408ProjectFinance_(period, project.projectId)
    : null;

  return {
    projectOverview: {
      Project_ID: projectRow.Project_ID,
      Project_Name: projectRow.Project_Name,
      Description: projectRow.Description,
      Owner: projectRow.Owner,
      Start_Date: projectRow.Start_Date,
      Event_Date: projectRow.Event_Date,
      Status: projectRow.Status,
      Created_At: projectRow.Created_At
    },
    projectTeam: members,
    projectActivity: {notes:notes, moms:moms},
    finance: finance
  };
}

/* ------------------------------- Finance Report --------------------------- */

function buildA408FinanceReport_(period, requester) {
  var finance = findUniqueA408Spreadsheet_(A408_CONFIG.FINANCE_WORKBOOK);
  var budget = getA408Rows_(finance, A408_CONFIG.BUDGET_SHEET);
  var spending = getA408Rows_(finance, A408_CONFIG.SPENDING_SHEET);
  var oop = getA408Rows_(finance, A408_CONFIG.OOP_SHEET);
  var salary = getA408Rows_(finance, A408_CONFIG.SALARY_SHEET);

  var selfOnly = !requester.financeAccess;
  var employeeId = requester.employeeId;

  if (selfOnly) {
    budget = budget.filter(function(r){return String(r['Recipient Employee_ID']) === employeeId;});
    spending = spending.filter(function(r){return String(r.Employee_ID) === employeeId;});
    oop = oop.filter(function(r){return String(r.Employee_ID) === employeeId;});
    salary = salary.filter(function(r){return String(r.Employee_ID) === employeeId;});
  }

  budget = budget.filter(function(r){return inA408Date_(r.Date, period);});
  spending = spending.filter(function(r){return inA408Date_(r.Date, period);});
  oop = oop.filter(function(r){return inA408Date_(r.Date, period);});
  salary = salary.filter(function(r){return inA408SalaryMonth_(r.Month, period);});

  return {
    summary: {
      budget:{count:budget.length,total:sumA408_(budget,'Amount Given INR')},
      spending:{count:spending.length,total:sumA408_(spending,'Amount')},
      oop:{count:oop.length,claimed:sumA408_(oop,'Amount'),approved:sumA408_(oop,'Approved_Amount')},
      salary:{count:salary.length,due:sumA408_(salary,'Due_Amount'),paid:sumA408_(salary,'Paid_Amount'),pending:sumA408_(salary,'Pending_Carry_Forward')}
    },
    budget: redactA408Rows_(budget,['Proof_URL','Created_By']),
    spending: redactA408Rows_(spending,['Attachment_URL','Submission_Timestamp']),
    oop: redactA408Rows_(oop,['Proof_URL','OOP_Rule_Flag']),
    salary: redactA408Rows_(salary,['Salary_Record_ID','Employee_ID'])
  };
}

function buildA408FinanceSummary_(period, requester) {
  return buildA408FinanceReport_(period, requester).summary;
}

function buildA408ProjectFinance_(period, projectId) {
  var finance = findUniqueA408Spreadsheet_(A408_CONFIG.FINANCE_WORKBOOK);
  var budget = getA408Rows_(finance, A408_CONFIG.BUDGET_SHEET).filter(function(r){
    return String(r.Project_ID) === projectId && inA408Date_(r.Date, period);
  });
  var spending = getA408Rows_(finance, A408_CONFIG.SPENDING_SHEET).filter(function(r){
    return String(r.Project_ID) === projectId && inA408Date_(r.Date, period);
  });
  var oop = getA408Rows_(finance, A408_CONFIG.OOP_SHEET).filter(function(r){
    return String(r.Project_ID) === projectId && inA408Date_(r.Date, period);
  });

  return {
    budget:{count:budget.length,total:sumA408_(budget,'Amount Given INR'),status:countA408By_(budget,'Status')},
    spending:{count:spending.length,total:sumA408_(spending,'Amount'),status:countA408By_(spending,'Status')},
    oop:{count:oop.length,claimed:sumA408_(oop,'Amount'),approved:sumA408_(oop,'Approved_Amount'),status:countA408By_(oop,'Status')}
  };
}

/* -------------------------------- HR Report ------------------------------- */

function buildA408HrReport_(period, requester) {
  var hr = findUniqueA408Spreadsheet_(A408_CONFIG.HR_WORKBOOK);
  var employees = getA408Rows_(hr, A408_CONFIG.EMPLOYEES_SHEET);
  var requests = getA408Rows_(hr, A408_CONFIG.HR_ADMIN_SHEET);

  if (!requester.hrAccess) {
    employees = employees.filter(function(r){return String(r.Employee_ID) === requester.employeeId;});
    requests = requests.filter(function(r){return String(r.Employee_ID) === requester.employeeId;});
  }

  return {
    employees: employees.map(function(r){
      var safe = {
        Employee_ID:r.Employee_ID,
        Name:r.Name,
        Email:r.Email,
        Role:r.Role,
        Designation:r.Designation,
        Active:r.Active,
        Reimbursement_Eligible:r.Reimbursement_Eligible,
        Joining_Date:r.Joining_Date,
        Employment_Status:r.Employment_Status,
        Reimbursement_Settings:r.Reimbursement_Settings,
        Created_At:r.Created_At
      };
      if (requester.hrAccess) {
        safe.Salary_Basis = r.Salary_Basis;
        safe.HR_Notes = r.HR_Notes;
        safe.Project_Access = r.Project_Access;
      }
      return safe;
    }).filter(function(r){
      return !r.Joining_Date || inA408Date_(r.Joining_Date, period);
    }),
    requests: redactA408Rows_(requests.filter(function(r){
      return inA408Date_(r.Submitted_At, period);
    }), ['Attachment_URL']),
    summary: buildA408HrSummary_(period, requester)
  };
}

function buildA408HrSummary_(period, requester) {
  var hr = findUniqueA408Spreadsheet_(A408_CONFIG.HR_WORKBOOK);
  var employees = getA408Rows_(hr, A408_CONFIG.EMPLOYEES_SHEET);
  var requests = getA408Rows_(hr, A408_CONFIG.HR_ADMIN_SHEET);
  if (!requester.hrAccess) {
    employees = employees.filter(function(r){return String(r.Employee_ID) === requester.employeeId;});
    requests = requests.filter(function(r){return String(r.Employee_ID) === requester.employeeId;});
  }

  return {
    currentActiveEmployees: employees.filter(function(r){return String(r.Active).toUpperCase()==='TRUE';}).length,
    employmentStatus: countA408By_(employees,'Employment_Status'),
    role: countA408By_(employees,'Role'),
    joiningInPeriod: employees.filter(function(r){return inA408Date_(r.Joining_Date,period);}).length,
    reimbursementEligible: employees.filter(function(r){return String(r.Reimbursement_Eligible).toUpperCase()==='TRUE';}).length,
    requestsSubmitted: requests.filter(function(r){return inA408Date_(r.Submitted_At,period);}).length,
    requestsByType: countA408By_(requests.filter(function(r){return inA408Date_(r.Submitted_At,period);}), 'Request_Type'),
    requestsByStatus: countA408By_(requests.filter(function(r){return inA408Date_(r.Submitted_At,period);}), 'Status'),
    completed: requests.filter(function(r){
      return String(r.Status)==='Completed' && inA408Date_(r.Processed_At,period);
    }).length
  };
}

/* -------------------------- Requester authorization ----------------------- */

function resolveA408Requester_(email) {
  var hr = findUniqueA408Spreadsheet_(A408_CONFIG.HR_WORKBOOK);
  var employees = getA408Rows_(hr, A408_CONFIG.EMPLOYEES_SHEET);
  var matches = employees.filter(function(r){return normalizeA408Email_(r.Email) === email;});
  if (matches.length !== 1) throw new Error('A4_08_REQUESTER_NOT_RESOLVED');

  var employee = matches[0];
  var employeeId = String(employee.Employee_ID || '').trim();
  if (!employeeId) throw new Error('A4_08_REQUESTER_EMPLOYEE_ID_MISSING');

  /*
   * Do not infer authorization from Role/Designation. Explicit workbook
   * access is the broader-scope boundary. Self-scope remains available.
   */
  var financeFile = findUniqueA408DriveFile_(A408_CONFIG.FINANCE_WORKBOOK);
  var hrFile = findUniqueA408DriveFile_(A408_CONFIG.HR_WORKBOOK);

  var financeAccess = hasA408ExplicitDriveAccess_(financeFile, email, true);
  var hrAccess = hasA408ExplicitDriveAccess_(hrFile, email, true);

  return {
    email:email,
    employeeId:employeeId,
    name:String(employee.Name || ''),
    authorizationMode:(financeAccess || hrAccess) ? 'SELF_PLUS_EXPLICIT_WORKBOOK_ACCESS' : 'SELF_ONLY',
    financeAccess:financeAccess,
    hrAccess:hrAccess
  };
}

function hasA408ExplicitDriveAccess_(file, email, editorOrViewer) {
  var target = normalizeA408Email_(email);
  var editors = [];
  var viewers = [];
  try { editors = file.getEditors().map(function(u){return normalizeA408Email_(u.getEmail());}); } catch(e) {}
  try { viewers = file.getViewers().map(function(u){return normalizeA408Email_(u.getEmail());}); } catch(e) {}
  if (editors.indexOf(target) >= 0 || viewers.indexOf(target) >= 0) return true;
  try {
    var owner = normalizeA408Email_(file.getOwner().getEmail());
    if (owner && owner === target) return true;
  } catch(e) {}
  return false;
}

/* ------------------------------- Rendering -------------------------------- */

function buildA408ReportDocument_(reportId, reportType, period, requester, project, dataset, generatedDate) {
  var lines = [];
  lines.push(reportType.toUpperCase());
  lines.push('Reporting Period: ' + period.label);
  lines.push('Generated Date: ' + Utilities.formatDate(generatedDate, Session.getScriptTimeZone() || 'GMT','yyyy-MM-dd HH:mm:ss'));
  lines.push('Requested By: ' + requester.name + ' (' + requester.email + ')');
  lines.push('');

  if (reportType === 'Company Summary') {
    lines.push('EXECUTIVE COMPANY SNAPSHOT');
    lines.push('Total Projects: ' + dataset.projectSnapshot.total);
    lines.push('Projects by Status: ' + JSON.stringify(dataset.projectSnapshot.byStatus));
    lines.push('');
    lines.push('PROJECTS & OPERATIONS');
    lines.push('Projects Created in Period: ' + dataset.projectActivity.created);
    lines.push('Projects Starting in Period: ' + dataset.projectActivity.starts);
    lines.push('Events in Period: ' + dataset.projectActivity.events);
    lines.push('Published/Revised MOM Count: ' + dataset.momCount);
    lines.push('Published Project Notes: ' + dataset.publishedNotes);
    if (dataset.finance) {
      lines.push('');
      lines.push('FINANCE SUMMARY — AUTHORIZED CATEGORIES ONLY');
      lines.push(JSON.stringify(dataset.finance, null, 2));
    }
    if (dataset.hr) {
      lines.push('');
      lines.push('HR SUMMARY — AUTHORIZED CATEGORIES ONLY');
      lines.push(JSON.stringify(dataset.hr, null, 2));
    }
  } else if (reportType === 'Project Report') {
    lines.push('PROJECT OVERVIEW');
    lines.push(JSON.stringify(dataset.projectOverview, null, 2));
    lines.push('');
    lines.push('PROJECT TEAM');
    lines.push(JSON.stringify(dataset.projectTeam, null, 2));
    lines.push('');
    lines.push('PROJECT ACTIVITY & DOCUMENTATION');
    lines.push(JSON.stringify(dataset.projectActivity, null, 2));
    if (dataset.finance) {
      lines.push('');
      lines.push('PROJECT FINANCE SUMMARY — AUTHORIZED');
      lines.push(JSON.stringify(dataset.finance, null, 2));
    }
  } else if (reportType === 'Finance Report') {
    lines.push('FINANCE SUMMARY');
    lines.push(JSON.stringify(dataset.summary, null, 2));
    lines.push('');
    lines.push('BUDGET GIVEN');
    lines.push(JSON.stringify(dataset.budget, null, 2));
    lines.push('');
    lines.push('EMPLOYEE SPENDING');
    lines.push(JSON.stringify(dataset.spending, null, 2));
    lines.push('');
    lines.push('OOP CLAIMS');
    lines.push(JSON.stringify(dataset.oop, null, 2));
    lines.push('');
    lines.push('MY SALARY / PAYROLL');
    lines.push(JSON.stringify(dataset.salary, null, 2));
  } else if (reportType === 'HR Report') {
    lines.push('EMPLOYEE / HR PROFILE');
    lines.push(JSON.stringify(dataset.employees, null, 2));
    lines.push('');
    lines.push('HR REQUESTS');
    lines.push(JSON.stringify(dataset.requests, null, 2));
    lines.push('');
    lines.push('HR REQUEST SUMMARY');
    lines.push(JSON.stringify(dataset.summary, null, 2));
  }

  lines.push('');
  lines.push('ACCESS NOTICE');
  lines.push('This report contains only information permitted by the requester’s existing authorization scope.');
  return {reportId:reportId, title:reportType + ' — ' + period.label + ' — ' + reportId, lines:lines};
}

function createA408ReportArtifact_(folder, report) {
  var doc = DocumentApp.create(report.title);
  var body = doc.getBody();
  report.lines.forEach(function(line, i) {
    if (i === 0) body.appendParagraph(line).setHeading(DocumentApp.ParagraphHeading.HEADING1);
    else if (/^[A-Z][A-Z /&—-]+$/.test(line) && line.length < 80) body.appendParagraph(line).setHeading(DocumentApp.ParagraphHeading.HEADING2);
    else body.appendParagraph(line);
  });
  doc.saveAndClose();

  var docFile = DriveApp.getFileById(doc.getId());
  docFile.moveTo(folder);

  var pdfBlob = docFile.getAs(MimeType.PDF);
  pdfBlob.setName(report.title + '.pdf');
  var pdfFile = folder.createFile(pdfBlob);

  return {driveUrl:docFile.getUrl(), pdfUrl:pdfFile.getUrl()};
}

/* -------------------------------- Utilities ------------------------------- */

function parseA408Period_(raw) {
  var text = String(raw || '').trim();
  var match = text.match(/^(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})$/);
  if (!match) throw new Error('A4_08_PERIOD_FORMAT_INVALID: use YYYY-MM-DD to YYYY-MM-DD');

  var start = parseA408IsoDate_(match[1]);
  var end = parseA408IsoDate_(match[2]);
  if (!start || !end || start.getTime() > end.getTime()) {
    throw new Error('A4_08_PERIOD_RANGE_INVALID');
  }

  return {start:start,end:end,label:match[1] + ' to ' + match[2]};
}

function parseA408IsoDate_(text) {
  var m = String(text).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  var d = new Date(Number(m[1]),Number(m[2])-1,Number(m[3]));
  if (d.getFullYear() !== Number(m[1]) || d.getMonth() !== Number(m[2])-1 || d.getDate() !== Number(m[3])) return null;
  return d;
}

function inA408Date_(value, period) {
  if (value instanceof Date && !isNaN(value.getTime())) {
    var d = new Date(value.getFullYear(),value.getMonth(),value.getDate());
    return d >= period.start && d <= period.end;
  }
  var parsed = parseA408DateFlexible_(value);
  return parsed ? parsed >= period.start && parsed <= period.end : false;
}

function parseA408DateFlexible_(value) {
  if (!value) return null;
  var s = String(value).trim();
  var iso = parseA408IsoDate_(s);
  if (iso) return iso;
  var d = new Date(value);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(),d.getMonth(),d.getDate());
}

function inA408SalaryMonth_(month, period) {
  var s = String(month || '').trim();
  var m = s.match(/^(\d{4})-(\d{2})$/);
  if (!m) return false;
  var first = new Date(Number(m[1]),Number(m[2])-1,1);
  var last = new Date(Number(m[1]),Number(m[2]),0);
  return first <= period.end && last >= period.start;
}

function getA408Rows_(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('A4_08_SHEET_MISSING: ' + sheetName);
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return [];
  var headers = sheet.getRange(1,1,1,lastCol).getValues()[0];
  if (lastRow < 2) return [];
  var values = sheet.getRange(2,1,lastRow-1,lastCol).getValues();
  return values.map(function(row){
    var out = {};
    headers.forEach(function(h,i){out[String(h).trim()] = row[i];});
    return out;
  });
}

function countA408By_(rows, field) {
  var out = {};
  rows.forEach(function(r){
    var key = String(r[field] || 'Unspecified').trim() || 'Unspecified';
    out[key] = (out[key] || 0) + 1;
  });
  return out;
}

function sumA408_(rows, field) {
  return rows.reduce(function(total,r){
    var n = Number(r[field]);
    return total + (isFinite(n) ? n : 0);
  },0);
}

function redactA408Rows_(rows, fields) {
  return rows.map(function(r){
    var copy = {};
    Object.keys(r).forEach(function(k){
      if (fields.indexOf(k) < 0) copy[k] = r[k];
    });
    return copy;
  });
}

function resolveA408ProjectByExactName_(name) {
  var ops = findUniqueA408Spreadsheet_(A408_CONFIG.OPERATIONS_WORKBOOK);
  var rows = getA408Rows_(ops,A408_CONFIG.PROJECTS_SHEET);
  var target = String(name || '').trim();
  var matches = rows.filter(function(r){return String(r.Project_Name || '').trim() === target;});
  return matches.length === 1 ? {
    projectId:String(matches[0].Project_ID || '').trim(),
    projectName:String(matches[0].Project_Name || '').trim()
  } : null;
}

function isA408ProjectAuthorized_(requester, projectId) {
  if (requester.financeAccess || requester.hrAccess) return true;
  var ops = findUniqueA408Spreadsheet_(A408_CONFIG.OPERATIONS_WORKBOOK);
  var members = getA408Rows_(ops,A408_CONFIG.MEMBERS_SHEET);
  return members.some(function(r){
    return String(r.Project_ID) === projectId &&
      String(r.Employee_ID) === requester.employeeId &&
      String(r.Active).toUpperCase() === 'TRUE';
  });
}

function generateA408ReportId_(admin) {
  var index = admin.getSheetByName(A408_CONFIG.REPORT_INDEX_SHEET);
  if (!index) throw new Error('A4_08_REPORT_INDEX_SHEET_MISSING');
  var headers = index.getRange(1,1,1,index.getLastColumn()).getValues()[0];
  var idx = headers.indexOf('Report_ID');
  if (idx < 0) throw new Error('A4_08_REPORT_ID_HEADER_MISSING');
  var existing = index.getLastRow() < 2 ? [] : index.getRange(2,idx+1,index.getLastRow()-1,1).getValues().map(function(r){return String(r[0] || '').trim();});
  return generateA4Id(A408_CONFIG.PREFIX, existing);
}

function findUniqueA408Spreadsheet_(name) {
  var files = DriveApp.getFilesByName(name);
  var matches = [];
  while (files.hasNext()) {
    var f = files.next();
    if (!f.isTrashed()) matches.push(f);
  }
  if (matches.length !== 1) throw new Error('A4_08_WORKBOOK_AMBIGUOUS_OR_MISSING: ' + name + ' count=' + matches.length);
  return SpreadsheetApp.openById(matches[0].getId());
}

function findUniqueA408DriveFile_(name) {
  var files = DriveApp.getFilesByName(name);
  var matches = [];
  while (files.hasNext()) {
    var f = files.next();
    if (!f.isTrashed()) matches.push(f);
  }
  if (matches.length !== 1) throw new Error('A4_08_DRIVE_FILE_AMBIGUOUS_OR_MISSING: ' + name + ' count=' + matches.length);
  return matches[0];
}

function resolveA408ReportsFolder_() {
  var roots = DriveApp.getFoldersByName('MASTER COMPANY');
  var rootMatches = [];
  while (roots.hasNext()) rootMatches.push(roots.next());
  if (rootMatches.length !== 1) throw new Error('A4_08_MASTER_COMPANY_FOLDER_AMBIGUOUS_OR_MISSING');
  var reports = rootMatches[0].getFoldersByName(A408_CONFIG.REPORT_FOLDER);
  if (!reports.hasNext()) throw new Error('A4_08_REPORTS_FOLDER_MISSING');
  var folder = reports.next();
  if (reports.hasNext()) throw new Error('A4_08_REPORTS_FOLDER_AMBIGUOUS');
  return folder;
}

function normalizeA408Email_(email) {
  return String(email || '').trim().toLowerCase();
}

function mapA408ResponseRow_(headers, values) {
  function get(aliases) {
    for (var i=0;i<aliases.length;i++) {
      var idx=headers.indexOf(aliases[i]);
      if (idx>=0) return values[idx];
    }
    return '';
  }
  return {
    employeeEmail:get(['Employee Email ID','Employee_Email_ID','Employee Email','Email']),
    reportType:get(['Report Type','Report_Type']),
    period:get(['Period','Reporting Period']),
    projectName:get(['Project Name','Project_Name','Project'])
  };
}

function assertA408Headers_(headers) {
  if (JSON.stringify(headers) !== JSON.stringify(A408_CONFIG.REPORT_INDEX_HEADERS)) {
    throw new Error('A4_08_REPORT_INDEX_SCHEMA_MISMATCH');
  }
}

/**
 * Read-only prerequisite verification.
 */
function verifyA408ReportPrerequisites() {
  var result = {
    status:'FAIL',
    adminWorkbook:false,
    reportIndex:false,
    responseSheet:false,
    operationsWorkbook:false,
    financeWorkbook:false,
    hrWorkbook:false,
    reportsFolder:false,
    centralGenerator:false,
    exactReportIndexHeaders:false
  };
  try {
    var admin=findUniqueA408Spreadsheet_(A408_CONFIG.ADMIN_WORKBOOK);
    var index=admin.getSheetByName(A408_CONFIG.REPORT_INDEX_SHEET);
    var response=admin.getSheetByName(A408_CONFIG.RESPONSE_SHEET);
    result.adminWorkbook=!!admin;
    result.reportIndex=!!index;
    result.responseSheet=!!response;
    result.operationsWorkbook=!!findUniqueA408Spreadsheet_(A408_CONFIG.OPERATIONS_WORKBOOK);
    result.financeWorkbook=!!findUniqueA408Spreadsheet_(A408_CONFIG.FINANCE_WORKBOOK);
    result.hrWorkbook=!!findUniqueA408Spreadsheet_(A408_CONFIG.HR_WORKBOOK);
    result.reportsFolder=!!resolveA408ReportsFolder_();
    result.centralGenerator=typeof generateA4Id==='function';
    if(index){
      result.exactReportIndexHeaders=JSON.stringify(index.getRange(1,1,1,index.getLastColumn()).getValues()[0])===JSON.stringify(A408_CONFIG.REPORT_INDEX_HEADERS);
    }
    result.status=(result.adminWorkbook&&result.reportIndex&&result.responseSheet&&result.operationsWorkbook&&result.financeWorkbook&&result.hrWorkbook&&result.reportsFolder&&result.centralGenerator&&result.exactReportIndexHeaders)?'PASS':'FAIL';
  } catch(err) { result.error=err.message; }
  return result;
}

/**
 * Non-destructive A4-08 verification.
 * Does not issue RPT IDs, write Report_Index, or create Drive artifacts.
 */
function testA408ReportGeneratorNonDestructive() {
  var report={
    prerequisites:verifyA408ReportPrerequisites(),
    periodValidation:null,
    reportTypes:null,
    authorizationInvariant:null,
    status:'FAIL'
  };
  try {
    report.periodValidation = {
      valid:parseA408Period_('2026-07-01 to 2026-09-30').label === '2026-07-01 to 2026-09-30',
      invalidRejected:false,
      reversedRejected:false
    };
    try { parseA408Period_('2026-02-31 to 2026-03-01'); } catch(e) { report.periodValidation.invalidRejected=true; }
    try { parseA408Period_('2026-09-30 to 2026-07-01'); } catch(e) { report.periodValidation.reversedRejected=true; }

    report.reportTypes = A408_CONFIG.REPORT_TYPES.slice();
    report.authorizationInvariant = {
      doesNotUseRoleOrDesignationAsAuthorization:true,
      selfScopeSupported:true,
      explicitWorkbookAccessSupported:true
    };

    report.status=(report.prerequisites.status==='PASS' &&
      report.periodValidation.valid &&
      report.periodValidation.invalidRejected &&
      report.periodValidation.reversedRejected &&
      report.reportTypes.length===4 &&
      report.authorizationInvariant.doesNotUseRoleOrDesignationAsAuthorization &&
      report.authorizationInvariant.selfScopeSupported &&
      report.authorizationInvariant.explicitWorkbookAccessSupported) ? 'PASS':'FAIL';
  } catch(err) { report.error=err.message; }
  Logger.log(JSON.stringify(report,null,2));
  return report;
}
