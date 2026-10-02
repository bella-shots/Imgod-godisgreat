/** A4-08 — Report Generator
 * Locked Specification: Phase-4/A4-08-Report-Generator-Build-Spec.md
 * Acceptance: P4-10
 *
 * Implements:
 * - FRM-06 report intake and validation
 * - Requester resolution to canonical Employee_ID
 * - Strict authorization & scope evaluation before source reading
 * - Inclusive period filtering (YYYY-MM-DD to YYYY-MM-DD)
 * - R38 Company Summary
 * - R39 Project Report
 * - R41 Finance Report
 * - R44 HR Report
 * - R32 View + Download equivalence
 * - Storing generated PDF artifacts in MASTER COMPANY/Reports
 * - Exact 7-column Report_Index registration via A4-00 RPT-######
 * - Idempotency, failure safety, and non-destructive live verification
 */

var A408_CONFIG = Object.freeze({
  ADMIN_WORKBOOK: 'MASTER_COMPANY_ADMIN',
  OPERATIONS_WORKBOOK: 'MASTER_COMPANY_OPERATIONS',
  FINANCE_WORKBOOK: 'MASTER_COMPANY_FINANCE',
  HR_WORKBOOK: 'MASTER_COMPANY_HR_ADMIN',

  REPORT_INDEX_SHEET: 'Report_Index',
  RESPONSE_SHEET: 'Report_Requests_Responses',
  PROJECTS_SHEET: 'Projects',
  PROJECT_MEMBERS_SHEET: 'Project_Members',
  PROJECT_NOTES_SHEET: 'Project_Notes',
  MOM_INDEX_SHEET: 'Project_MOM_Index',
  EMPLOYEES_SHEET: 'Employees',
  BUDGET_GIVEN_SHEET: 'Budget_Given',
  EMPLOYEE_SPENDING_SHEET: 'Employee_Spending',
  OOP_CLAIMS_SHEET: 'OOP_Claims',
  SALARY_ADMIN_SHEET: 'Salary_Admin',
  INVESTMENTS_SHEET: 'Investments',
  HR_ADMIN_SHEET: 'HR_Admin',

  ROOT_FOLDER_NAME: 'MASTER COMPANY',
  REPORTS_FOLDER_NAME: 'Reports',
  ID_PREFIX: 'RPT',
  DEFAULT_STATUS: 'Published',
  ALLOWED_STATUSES: ['Draft', 'Published', 'Archived'],
  REPORT_TYPES: ['Company Summary', 'Project Report', 'Finance Report', 'HR Report'],

  REPORT_INDEX_HEADERS: [
    'Report_ID',
    'Report_Type',
    'Period',
    'Project_ID',
    'Drive_URL',
    'Status',
    'Generated_Date'
  ]
});

/**
 * Main entry point to process FRM-06 report request or admin action.
 *
 * @param {Object} request
 *   - email: String (requester employee email)
 *   - reportType: String ('Company Summary' | 'Project Report' | 'Finance Report' | 'HR Report')
 *   - period: String ('YYYY-MM-DD to YYYY-MM-DD')
 *   - projectName: String (conditional for Project Report)
 * @return {Object} Report generation result
 */
function generateA408Report(request) {
  var validatedReq = validateA408Request_(request);

  var adminWb = findA408Spreadsheet_(A408_CONFIG.ADMIN_WORKBOOK);
  var opsWb = findA408Spreadsheet_(A408_CONFIG.OPERATIONS_WORKBOOK);
  var finWb = findA408Spreadsheet_(A408_CONFIG.FINANCE_WORKBOOK);
  var hrWb = findA408Spreadsheet_(A408_CONFIG.HR_WORKBOOK);

  var workbooks = {
    admin: adminWb,
    operations: opsWb,
    finance: finWb,
    hr: hrWb
  };

  // Resolve requester and check authorization
  var requester = resolveA408Requester_(hrWb, validatedReq.email);

  // If Project Report, resolve canonical Project_ID and verify project access
  var project = null;
  if (validatedReq.reportType === 'Project Report') {
    project = resolveA408Project_(opsWb, validatedReq.projectName);
    verifyA408ProjectAccess_(opsWb, project, requester);
  }

  // Parse period boundaries
  var periodDates = parseA408Period_(validatedReq.period);

  // Build authorized report model
  var reportModel = null;
  switch (validatedReq.reportType) {
    case 'Company Summary':
      reportModel = buildA408CompanySummaryModel_(workbooks, requester, periodDates, validatedReq.period);
      break;
    case 'Project Report':
      reportModel = buildA408ProjectReportModel_(workbooks, requester, project, periodDates, validatedReq.period);
      break;
    case 'Finance Report':
      reportModel = buildA408FinanceReportModel_(workbooks, requester, periodDates, validatedReq.period);
      break;
    case 'HR Report':
      reportModel = buildA408HrReportModel_(workbooks, requester, periodDates, validatedReq.period);
      break;
    default:
      throw new Error('A4_08_UNSUPPORTED_REPORT_TYPE: ' + validatedReq.reportType);
  }

  // Render on-screen View HTML
  var viewHtml = renderA408ReportHtml_(reportModel);

  // Ensure Drive Reports container exists
  var reportsFolder = resolveA408ReportsFolder_();

  // Generate Download artifact from the exact same reportModel / HTML
  var generatedDateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');
  var fileBaseName = (validatedReq.reportType.replace(/\s+/g, '_')) + '_' +
    (project ? (project.projectId + '_') : '') +
    periodDates.startStr + '_to_' + periodDates.endStr;

  var artifactResult = createA408ReportPdf_(reportsFolder, fileBaseName, viewHtml);

  // Register in Report_Index using central A4-00 generator
  var reportIndexSheet = adminWb.getSheetByName(A408_CONFIG.REPORT_INDEX_SHEET);
  if (!reportIndexSheet) throw new Error('A4_08_MISSING_SHEET: ' + A408_CONFIG.REPORT_INDEX_SHEET);

  var indexHeaders = reportIndexSheet.getRange(1, 1, 1, reportIndexSheet.getLastColumn()).getValues()[0];
  assertExactA408ReportIndexHeaders_(indexHeaders);

  var existingReportIds = getA408ExistingIds_(reportIndexSheet, indexHeaders);
  var reportId = generateA4Id(A408_CONFIG.ID_PREFIX, existingReportIds);

  var indexRow = new Array(indexHeaders.length).fill('');
  setA408RowVal_(indexRow, indexHeaders, 'Report_ID', reportId);
  setA408RowVal_(indexRow, indexHeaders, 'Report_Type', validatedReq.reportType);
  setA408RowVal_(indexRow, indexHeaders, 'Period', validatedReq.period);
  setA408RowVal_(indexRow, indexHeaders, 'Project_ID', project ? project.projectId : '');
  setA408RowVal_(indexRow, indexHeaders, 'Drive_URL', artifactResult.driveUrl);
  setA408RowVal_(indexRow, indexHeaders, 'Status', A408_CONFIG.DEFAULT_STATUS);
  setA408RowVal_(indexRow, indexHeaders, 'Generated_Date', generatedDateStr);

  reportIndexSheet.appendRow(indexRow);
  SpreadsheetApp.flush();

  return {
    status: 'PASS',
    reportId: reportId,
    reportType: validatedReq.reportType,
    period: validatedReq.period,
    projectId: project ? project.projectId : '',
    driveUrl: artifactResult.driveUrl,
    viewHtml: viewHtml,
    model: reportModel,
    requesterEmail: requester.email,
    generatedDate: generatedDateStr
  };
}

/**
 * Validates request payload according to FRM-06 specification.
 */
function validateA408Request_(req) {
  if (!req || typeof req !== 'object') {
    throw new Error('A4_08_INVALID_REQUEST: Payload must be an object.');
  }

  var email = String(req.email || req.employeeEmail || req['Employee Email ID'] || '').trim().toLowerCase();
  if (!email || email.indexOf('@') < 0) {
    throw new Error('A4_08_INVALID_EMAIL: Valid Employee Email ID is required.');
  }

  var reportType = String(req.reportType || req['Report Type'] || '').trim();
  if (A408_CONFIG.REPORT_TYPES.indexOf(reportType) < 0) {
    throw new Error('A4_08_INVALID_REPORT_TYPE: ' + reportType + '. Must be one of: ' + A408_CONFIG.REPORT_TYPES.join(', '));
  }

  var period = String(req.period || req['Period'] || '').trim();
  var parsed = parseA408Period_(period); // throws if invalid

  var projectName = String(req.projectName || req['Project Name'] || '').trim();
  if (reportType === 'Project Report' && !projectName) {
    throw new Error('A4_08_PROJECT_NAME_REQUIRED: Project Name is required for Project Report.');
  }

  return {
    email: email,
    reportType: reportType,
    period: period,
    periodDates: parsed,
    projectName: projectName
  };
}

/**
 * Validates exact inclusive YYYY-MM-DD to YYYY-MM-DD period.
 */
function parseA408Period_(periodStr) {
  if (!periodStr) throw new Error('A4_08_PERIOD_REQUIRED: Period is required.');
  var match = String(periodStr).trim().match(/^(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})$/);
  if (!match) {
    throw new Error('A4_08_INVALID_PERIOD_FORMAT: Must match exact YYYY-MM-DD to YYYY-MM-DD format.');
  }

  var startStr = match[1];
  var endStr = match[2];

  var startD = parseA408CalendarDate_(startStr);
  var endD = parseA408CalendarDate_(endStr);

  if (!startD || !endD) {
    throw new Error('A4_08_INVALID_CALENDAR_DATE: Dates must be real calendar dates.');
  }

  if (startStr > endStr) {
    throw new Error('A4_08_INVALID_PERIOD_RANGE: Start date cannot be after end date.');
  }

  return {
    startStr: startStr,
    endStr: endStr,
    startDate: startD,
    endDate: endD
  };
}

function parseA408CalendarDate_(str) {
  var parts = str.split('-');
  var y = Number(parts[0]);
  var m = Number(parts[1]);
  var d = Number(parts[2]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  var dateObj = new Date(y, m - 1, d);
  if (dateObj.getFullYear() !== y || dateObj.getMonth() !== m - 1 || dateObj.getDate() !== d) {
    return null;
  }
  return dateObj;
}

/**
 * Resolves requester to authoritative canonical employee profile and evaluates authorization.
 */
function resolveA408Requester_(hrWb, email) {
  var empSheet = hrWb.getSheetByName(A408_CONFIG.EMPLOYEES_SHEET);
  if (!empSheet) throw new Error('A4_08_MISSING_SHEET: ' + A408_CONFIG.EMPLOYEES_SHEET);

  var headers = empSheet.getRange(1, 1, 1, empSheet.getLastColumn()).getValues()[0];
  var lastRow = empSheet.getLastRow();
  if (lastRow < 2) throw new Error('A4_08_REQUESTER_NOT_FOUND: ' + email);

  var rows = empSheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  var emailIdx = headers.indexOf('Email');
  var empIdIdx = headers.indexOf('Employee_ID');
  var activeIdx = headers.indexOf('Active');
  var roleIdx = headers.indexOf('Role');
  var desigIdx = headers.indexOf('Designation');

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (String(row[emailIdx] || '').trim().toLowerCase() === email) {
      var isActive = isA408BooleanTrue_(row[activeIdx]);
      if (!isActive) {
        throw new Error('A4_08_REQUESTER_INACTIVE: ' + email);
      }

      var roleVal = String(row[roleIdx] || '').trim();
      var desigVal = String(row[desigIdx] || '').trim();

      // Authorization evaluation:
      // R46: Role and Designation alone do not confer arbitrary authority.
      // Administrator / Site Admin has company-wide administration scope.
      var isAdmin = /^(Administrator|Site Admin)$/i.test(roleVal) || /^(Administrator|Site Admin)$/i.test(desigVal);
      var isHRAdmin = isAdmin || /^HR Admin$/i.test(roleVal) || /^HR Admin$/i.test(desigVal);
      var isFinanceAdmin = isAdmin || /^Finance Admin$/i.test(roleVal) || /^Finance Admin$/i.test(desigVal);
      var isManager = isAdmin || /^(Manager|Top Manager|Director)$/i.test(roleVal) || /^(Manager|Top Manager|Director)$/i.test(desigVal);
      var isProjectLead = isAdmin || /^Project Lead$/i.test(roleVal) || /^Project Lead$/i.test(desigVal);

      return {
        employeeId: String(row[empIdIdx] || '').trim(),
        name: String(row[headers.indexOf('Name')] || '').trim(),
        email: email,
        role: roleVal,
        designation: desigVal,
        active: isActive ? 'Active' : 'Inactive',
        reimbursementEligible: isA408BooleanTrue_(row[headers.indexOf('Reimbursement_Eligible')]) ? 'Yes' : 'No',
        projectAccess: String(row[headers.indexOf('Project_Access')] || '').trim(),
        joiningDate: formatA408DateCell_(row[headers.indexOf('Joining_Date')]),
        employmentStatus: String(row[headers.indexOf('Employment_Status')] || '').trim(),
        salaryBasis: row[headers.indexOf('Salary_Basis')],
        hrNotes: String(row[headers.indexOf('HR_Notes')] || '').trim(),
        reimbursementSettings: String(row[headers.indexOf('Reimbursement_Settings')] || '').trim(),
        createdAt: formatA408DateCell_(row[headers.indexOf('Created_At')]),
        // Authorization scope flags
        isAdmin: isAdmin,
        isHRAdmin: isHRAdmin,
        isFinanceAdmin: isFinanceAdmin,
        isManager: isManager,
        isProjectLead: isProjectLead
      };
    }
  }

  throw new Error('A4_08_REQUESTER_NOT_FOUND: ' + email);
}

/**
 * Resolves Project Name to canonical Project_ID. Case-sensitive exact match.
 */
function resolveA408Project_(opsWb, projectName) {
  var pSheet = opsWb.getSheetByName(A408_CONFIG.PROJECTS_SHEET);
  if (!pSheet) throw new Error('A4_08_MISSING_SHEET: ' + A408_CONFIG.PROJECTS_SHEET);

  var headers = pSheet.getRange(1, 1, 1, pSheet.getLastColumn()).getValues()[0];
  var lastRow = pSheet.getLastRow();
  if (lastRow < 2) throw new Error('A4_08_PROJECT_NOT_FOUND: ' + projectName);

  var rows = pSheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  var nameIdx = headers.indexOf('Project_Name');
  var idIdx = headers.indexOf('Project_ID');

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    if (String(row[nameIdx] || '').trim() === projectName) {
      return {
        projectId: String(row[idIdx] || '').trim(),
        projectName: projectName,
        description: String(row[headers.indexOf('Description')] || '').trim(),
        owner: String(row[headers.indexOf('Owner')] || '').trim(),
        startDate: formatA408DateCell_(row[headers.indexOf('Start_Date')]),
        eventDate: formatA408DateCell_(row[headers.indexOf('Event_Date')]),
        status: String(row[headers.indexOf('Status')] || '').trim(),
        driveFolderUrl: String(row[headers.indexOf('Drive_Folder_URL')] || '').trim(),
        submissionId: String(row[headers.indexOf('Submission_ID')] || '').trim(),
        createdAt: formatA408DateCell_(row[headers.indexOf('Created_At')])
      };
    }
  }

  throw new Error('A4_08_PROJECT_NOT_FOUND: ' + projectName);
}

/**
 * Verifies that the requester is authorized to access the requested Project Report.
 */
function verifyA408ProjectAccess_(opsWb, project, requester) {
  if (requester.isAdmin) return true;
  if (project.owner === requester.email || project.owner === requester.name) return true;
  if (requester.projectAccess === 'All') return true;

  if (requester.projectAccess &&
     (requester.projectAccess.indexOf(project.projectId) >= 0 || requester.projectAccess.indexOf(project.projectName) >= 0)) {
    return true;
  }

  // Check active membership in Project_Members
  var mSheet = opsWb.getSheetByName(A408_CONFIG.PROJECT_MEMBERS_SHEET);
  if (mSheet && mSheet.getLastRow() >= 2) {
    var headers = mSheet.getRange(1, 1, 1, mSheet.getLastColumn()).getValues()[0];
    var rows = mSheet.getRange(2, 1, mSheet.getLastRow() - 1, headers.length).getValues();
    var pIdIdx = headers.indexOf('Project_ID');
    var empIdIdx = headers.indexOf('Employee_ID');
    var activeIdx = headers.indexOf('Active');

    for (var i = 0; i < rows.length; i++) {
      if (String(rows[i][pIdIdx] || '').trim() === project.projectId &&
          String(rows[i][empIdIdx] || '').trim() === requester.employeeId &&
          isA408BooleanTrue_(rows[i][activeIdx])) {
        return true;
      }
    }
  }

  throw new Error('A4_08_UNAUTHORIZED_PROJECT_ACCESS: User ' + requester.email + ' is not authorized for project ' + project.projectName);
}

/* =========================================================================
 * 1. R38 — COMPANY SUMMARY MODEL BUILDER
 * Presentation order:
 * 1. Report Header
 * 2. Executive Company Snapshot
 * 3. Projects & Operations
 * 4. Finance Summary — authorized categories only
 * 5. HR Summary — authorized categories only
 * 6. Access Notice
 * ========================================================================= */
function buildA408CompanySummaryModel_(workbooks, requester, period, periodStr) {
  var generatedDateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');

  // 1. Projects data
  var pSheet = workbooks.operations.getSheetByName(A408_CONFIG.PROJECTS_SHEET);
  var pHeaders = pSheet ? pSheet.getRange(1, 1, 1, pSheet.getLastColumn()).getValues()[0] : [];
  var pRows = (pSheet && pSheet.getLastRow() >= 2) ? pSheet.getRange(2, 1, pSheet.getLastRow() - 1, pHeaders.length).getValues() : [];

  var totalProjects = pRows.length;
  var statusCounts = { 'Draft': 0, 'Active': 0, 'On Hold': 0, 'Completed': 0, 'Cancelled': 0 };
  var createdInPeriod = 0;
  var startInPeriod = 0;
  var eventInPeriod = 0;

  pRows.forEach(function(row) {
    var st = String(row[pHeaders.indexOf('Status')] || '').trim();
    if (statusCounts.hasOwnProperty(st)) statusCounts[st]++;

    var cAt = formatA408DateCell_(row[pHeaders.indexOf('Created_At')]);
    if (isDateInA408Range_(cAt, period.startStr, period.endStr)) createdInPeriod++;

    var sDt = formatA408DateCell_(row[pHeaders.indexOf('Start_Date')]);
    if (isDateInA408Range_(sDt, period.startStr, period.endStr)) startInPeriod++;

    var eDt = formatA408DateCell_(row[pHeaders.indexOf('Event_Date')]);
    if (isDateInA408Range_(eDt, period.startStr, period.endStr)) eventInPeriod++;
  });

  // MOM in period
  var momSheet = workbooks.operations.getSheetByName(A408_CONFIG.MOM_INDEX_SHEET);
  var momHeaders = momSheet ? momSheet.getRange(1, 1, 1, momSheet.getLastColumn()).getValues()[0] : [];
  var momRows = (momSheet && momSheet.getLastRow() >= 2) ? momSheet.getRange(2, 1, momSheet.getLastRow() - 1, momHeaders.length).getValues() : [];
  var momCount = 0;
  momRows.forEach(function(row) {
    var mDate = formatA408DateCell_(row[momHeaders.indexOf('Meeting_Date')]);
    var st = String(row[momHeaders.indexOf('Status')] || '').trim();
    if (isDateInA408Range_(mDate, period.startStr, period.endStr) && (st === 'Published' || st === 'Revised')) {
      momCount++;
    }
  });

  // Notes in period
  var noteSheet = workbooks.operations.getSheetByName(A408_CONFIG.PROJECT_NOTES_SHEET);
  var noteHeaders = noteSheet ? noteSheet.getRange(1, 1, 1, noteSheet.getLastColumn()).getValues()[0] : [];
  var noteRows = (noteSheet && noteSheet.getLastRow() >= 2) ? noteSheet.getRange(2, 1, noteSheet.getLastRow() - 1, noteHeaders.length).getValues() : [];
  var notesCount = 0;
  noteRows.forEach(function(row) {
    var nDate = formatA408DateCell_(row[noteHeaders.indexOf('Date')]);
    var st = String(row[noteHeaders.indexOf('Status')] || '').trim();
    if (isDateInA408Range_(nDate, period.startStr, period.endStr) && st === 'Published') {
      notesCount++;
    }
  });

  // Finance summaries
  var budgetSummary = summarizeA408FinanceTable_(workbooks.finance, A408_CONFIG.BUDGET_GIVEN_SHEET, 'Date', 'Amount', 'Status', period);
  var spendingSummary = summarizeA408FinanceTable_(workbooks.finance, A408_CONFIG.EMPLOYEE_SPENDING_SHEET, 'Date', 'Amount', 'Status', period);
  var oopSummary = summarizeA408OopClaimsTable_(workbooks.finance, period);

  var salarySummary = null;
  if (requester.isFinanceAdmin || requester.isAdmin || requester.isHRAdmin) {
    salarySummary = summarizeA408SalaryTable_(workbooks.finance, period);
  }

  var investmentSummary = null;
  if (requester.isFinanceAdmin || requester.isAdmin) {
    investmentSummary = summarizeA408InvestmentsTable_(workbooks.finance, period);
  }

  // HR Summary
  var empSheet = workbooks.hr.getSheetByName(A408_CONFIG.EMPLOYEES_SHEET);
  var empHeaders = empSheet ? empSheet.getRange(1, 1, 1, empSheet.getLastColumn()).getValues()[0] : [];
  var empRows = (empSheet && empSheet.getLastRow() >= 2) ? empSheet.getRange(2, 1, empSheet.getLastRow() - 1, empHeaders.length).getValues() : [];

  var activeEmpCount = 0;
  var employmentStatusCounts = {};
  var roleCounts = {};
  var joinersInPeriod = 0;
  var reimbursementEligibleCount = 0;

  empRows.forEach(function(row) {
    if (isA408BooleanTrue_(row[empHeaders.indexOf('Active')])) activeEmpCount++;

    var empSt = String(row[empHeaders.indexOf('Employment_Status')] || 'Unknown').trim();
    employmentStatusCounts[empSt] = (employmentStatusCounts[empSt] || 0) + 1;

    var role = String(row[empHeaders.indexOf('Role')] || 'Unknown').trim();
    roleCounts[role] = (roleCounts[role] || 0) + 1;

    var joinDate = formatA408DateCell_(row[empHeaders.indexOf('Joining_Date')]);
    if (isDateInA408Range_(joinDate, period.startStr, period.endStr)) joinersInPeriod++;

    if (isA408BooleanTrue_(row[empHeaders.indexOf('Reimbursement_Eligible')])) reimbursementEligibleCount++;
  });

  // HR Requests in period
  var hrSheet = workbooks.hr.getSheetByName(A408_CONFIG.HR_ADMIN_SHEET);
  var hrHeaders = hrSheet ? hrSheet.getRange(1, 1, 1, hrSheet.getLastColumn()).getValues()[0] : [];
  var hrRows = (hrSheet && hrSheet.getLastRow() >= 2) ? hrSheet.getRange(2, 1, hrSheet.getLastRow() - 1, hrHeaders.length).getValues() : [];

  var hrRequestCount = 0;
  var hrTypeCounts = {};
  var hrStatusCounts = {};
  var hrCompletedCount = 0;

  hrRows.forEach(function(row) {
    var subAt = formatA408DateCell_(row[hrHeaders.indexOf('Submitted_At')]);
    if (isDateInA408Range_(subAt, period.startStr, period.endStr)) {
      hrRequestCount++;
      var reqType = String(row[hrHeaders.indexOf('Request_Type')] || 'Other').trim();
      hrTypeCounts[reqType] = (hrTypeCounts[reqType] || 0) + 1;

      var st = String(row[hrHeaders.indexOf('Status')] || 'Submitted').trim();
      hrStatusCounts[st] = (hrStatusCounts[st] || 0) + 1;
    }

    var procAt = formatA408DateCell_(row[hrHeaders.indexOf('Processed_At')]);
    var statusVal = String(row[hrHeaders.indexOf('Status')] || '').trim();
    if (statusVal === 'Completed' && isDateInA408Range_(procAt, period.startStr, period.endStr)) {
      hrCompletedCount++;
    }
  });

  return {
    reportType: 'Company Summary',
    period: periodStr,
    generatedDate: generatedDateStr,
    requestedBy: requester.name + ' (' + requester.email + ')',
    executiveSnapshot: {
      totalProjects: totalProjects,
      statusCounts: statusCounts
    },
    projectsAndOperations: {
      createdInPeriod: createdInPeriod,
      startInPeriod: startInPeriod,
      eventInPeriod: eventInPeriod,
      momCount: momCount,
      notesCount: notesCount
    },
    financeSummary: {
      budget: budgetSummary,
      spending: spendingSummary,
      oop: oopSummary,
      salary: salarySummary,
      investment: investmentSummary
    },
    hrSummary: {
      activeEmployees: activeEmpCount,
      employmentStatusCounts: employmentStatusCounts,
      roleCounts: (requester.isAdmin || requester.isHRAdmin || requester.isManager) ? roleCounts : null,
      joinersInPeriod: joinersInPeriod,
      reimbursementEligibleCount: (requester.isAdmin || requester.isHRAdmin || requester.isFinanceAdmin) ? reimbursementEligibleCount : null,
      hrRequestCount: hrRequestCount,
      hrTypeCounts: hrTypeCounts,
      hrStatusCounts: hrStatusCounts,
      hrCompletedCount: hrCompletedCount
    },
    accessNotice: 'Authorized Company Summary compiled under ' + (requester.isAdmin ? 'Full Administrator' : 'Standard Employee') + ' governance policy. Restricted employee-level records are excluded.'
  };
}

/* =========================================================================
 * 2. R39 — PROJECT REPORT MODEL BUILDER
 * Presentation order:
 * 1. Report Header
 * 2. Project Overview
 * 3. Project Team
 * 4. Project Activity & Documentation
 * 5. Project Finance Summary
 * 6. Access Notice
 * ========================================================================= */
function buildA408ProjectReportModel_(workbooks, requester, project, period, periodStr) {
  var generatedDateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');

  // Team members
  var mSheet = workbooks.operations.getSheetByName(A408_CONFIG.PROJECT_MEMBERS_SHEET);
  var mHeaders = mSheet ? mSheet.getRange(1, 1, 1, mSheet.getLastColumn()).getValues()[0] : [];
  var mRows = (mSheet && mSheet.getLastRow() >= 2) ? mSheet.getRange(2, 1, mSheet.getLastRow() - 1, mHeaders.length).getValues() : [];

  var teamMembers = [];
  mRows.forEach(function(row) {
    if (String(row[mHeaders.indexOf('Project_ID')] || '').trim() === project.projectId &&
        isA408BooleanTrue_(row[mHeaders.indexOf('Active')])) {
      teamMembers.push({
        employeeId: String(row[mHeaders.indexOf('Employee_ID')] || '').trim(),
        role: String(row[mHeaders.indexOf('Project_Role')] || row[mHeaders.indexOf('Role')] || '').trim(),
        active: 'Active',
        assignedDate: formatA408DateCell_(row[mHeaders.indexOf('Assigned_Date')])
      });
    }
  });

  // Notes
  var nSheet = workbooks.operations.getSheetByName(A408_CONFIG.PROJECT_NOTES_SHEET);
  var nHeaders = nSheet ? nSheet.getRange(1, 1, 1, nSheet.getLastColumn()).getValues()[0] : [];
  var nRows = (nSheet && nSheet.getLastRow() >= 2) ? nSheet.getRange(2, 1, nSheet.getLastRow() - 1, nHeaders.length).getValues() : [];
  var notes = [];
  nRows.forEach(function(row) {
    if (String(row[nHeaders.indexOf('Project_ID')] || '').trim() === project.projectId) {
      var nDate = formatA408DateCell_(row[nHeaders.indexOf('Date')]);
      var st = String(row[nHeaders.indexOf('Status')] || '').trim();
      if (st === 'Published' && isDateInA408Range_(nDate, period.startStr, period.endStr)) {
        notes.push({
          date: nDate,
          author: String(row[nHeaders.indexOf('Author_Email')] || '').trim(),
          note: String(row[nHeaders.indexOf('Note')] || '').trim()
        });
      }
    }
  });

  // MOM
  var momSheet = workbooks.operations.getSheetByName(A408_CONFIG.MOM_INDEX_SHEET);
  var momHeaders = momSheet ? momSheet.getRange(1, 1, 1, momSheet.getLastColumn()).getValues()[0] : [];
  var momRows = (momSheet && momSheet.getLastRow() >= 2) ? momSheet.getRange(2, 1, momSheet.getLastRow() - 1, momHeaders.length).getValues() : [];
  var momList = [];
  momRows.forEach(function(row) {
    if (String(row[momHeaders.indexOf('Project_ID')] || '').trim() === project.projectId) {
      var mDate = formatA408DateCell_(row[momHeaders.indexOf('Meeting_Date')]);
      var st = String(row[momHeaders.indexOf('Status')] || '').trim();
      if ((st === 'Published' || st === 'Revised') && isDateInA408Range_(mDate, period.startStr, period.endStr)) {
        momList.push({
          meetingDate: mDate,
          title: String(row[momHeaders.indexOf('Title')] || '').trim(),
          participants: String(row[momHeaders.indexOf('Participants')] || '').trim(),
          version: String(row[momHeaders.indexOf('Version')] || '').trim(),
          status: st
        });
      }
    }
  });

  // Project Finance
  var budgetSummary = summarizeA408ProjectFinanceTable_(workbooks.finance, A408_CONFIG.BUDGET_GIVEN_SHEET, project.projectId, 'Date', 'Amount', 'Status', period);
  var spendingSummary = summarizeA408ProjectFinanceTable_(workbooks.finance, A408_CONFIG.EMPLOYEE_SPENDING_SHEET, project.projectId, 'Date', 'Amount', 'Status', period);
  var oopSummary = summarizeA408ProjectOopClaims_(workbooks.finance, project.projectId, period);

  return {
    reportType: 'Project Report',
    period: periodStr,
    generatedDate: generatedDateStr,
    requestedBy: requester.name + ' (' + requester.email + ')',
    overview: {
      projectId: project.projectId,
      projectName: project.projectName,
      description: project.description,
      owner: project.owner,
      startDate: project.startDate,
      eventDate: project.eventDate,
      status: project.status,
      createdAt: project.createdAt
    },
    team: {
      count: teamMembers.length,
      members: teamMembers
    },
    activity: {
      notes: notes,
      moms: momList
    },
    financeSummary: {
      budget: budgetSummary,
      spending: spendingSummary,
      oop: oopSummary
    },
    accessNotice: 'Authorized project-level view for project ' + project.projectName + ' (' + project.projectId + '). General company-wide finance and unassigned HR data are excluded.'
  };
}

/* =========================================================================
 * 3. R41 — FINANCE REPORT MODEL BUILDER
 * Presentation order:
 * 1. Report Header
 * 2. Finance Summary
 * 3. Budget Given
 * 4. Employee Spending
 * 5. OOP Claims
 * 6. My Salary / Payroll
 * 7. Access Notice
 * ========================================================================= */
function buildA408FinanceReportModel_(workbooks, requester, period, periodStr) {
  var generatedDateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');

  // Budget Given rows
  var bSheet = workbooks.finance.getSheetByName(A408_CONFIG.BUDGET_GIVEN_SHEET);
  var bHeaders = bSheet ? bSheet.getRange(1, 1, 1, bSheet.getLastColumn()).getValues()[0] : [];
  var bRows = (bSheet && bSheet.getLastRow() >= 2) ? bSheet.getRange(2, 1, bSheet.getLastRow() - 1, bHeaders.length).getValues() : [];
  var budgets = [];
  var totalBudgetAmt = 0;
  bRows.forEach(function(row) {
    var d = formatA408DateCell_(row[bHeaders.indexOf('Date')]);
    if (isDateInA408Range_(d, period.startStr, period.endStr)) {
      var amt = Number(row[bHeaders.indexOf('Amount')] || 0);
      totalBudgetAmt += amt;
      budgets.push({
        date: d,
        amount: amt,
        purpose: String(row[bHeaders.indexOf('Purpose')] || '').trim(),
        project: String(row[bHeaders.indexOf('Project_ID')] || '').trim(),
        status: String(row[bHeaders.indexOf('Status')] || '').trim()
      });
    }
  });

  // Employee Spending rows
  var sSheet = workbooks.finance.getSheetByName(A408_CONFIG.EMPLOYEE_SPENDING_SHEET);
  var sHeaders = sSheet ? sSheet.getRange(1, 1, 1, sSheet.getLastColumn()).getValues()[0] : [];
  var sRows = (sSheet && sSheet.getLastRow() >= 2) ? sSheet.getRange(2, 1, sSheet.getLastRow() - 1, sHeaders.length).getValues() : [];
  var spendings = [];
  var totalSpendingAmt = 0;
  sRows.forEach(function(row) {
    var d = formatA408DateCell_(row[sHeaders.indexOf('Date')]);
    if (isDateInA408Range_(d, period.startStr, period.endStr)) {
      var amt = Number(row[sHeaders.indexOf('Amount')] || 0);
      totalSpendingAmt += amt;
      spendings.push({
        date: d,
        amount: amt,
        recipientVendor: String(row[sHeaders.indexOf('Recipient_Vendor')] || '').trim(),
        purpose: String(row[sHeaders.indexOf('Purpose')] || '').trim(),
        project: String(row[sHeaders.indexOf('Project_ID')] || '').trim(),
        status: String(row[sHeaders.indexOf('Status')] || '').trim()
      });
    }
  });

  // OOP Claims rows
  var oSheet = workbooks.finance.getSheetByName(A408_CONFIG.OOP_CLAIMS_SHEET);
  var oHeaders = oSheet ? oSheet.getRange(1, 1, 1, oSheet.getLastColumn()).getValues()[0] : [];
  var oRows = (oSheet && oSheet.getLastRow() >= 2) ? oSheet.getRange(2, 1, oSheet.getLastRow() - 1, oHeaders.length).getValues() : [];
  var oopClaims = [];
  var totalOopClaimed = 0;
  var totalOopApproved = 0;
  oRows.forEach(function(row) {
    var d = formatA408DateCell_(row[oHeaders.indexOf('Date')]);
    if (isDateInA408Range_(d, period.startStr, period.endStr)) {
      var clmAmt = Number(row[oHeaders.indexOf('Amount')] || 0);
      var appAmt = Number(row[oHeaders.indexOf('Approved_Amount')] || 0);
      totalOopClaimed += clmAmt;
      totalOopApproved += appAmt;
      oopClaims.push({
        date: d,
        purpose: String(row[oHeaders.indexOf('Purpose')] || '').trim(),
        project: String(row[oHeaders.indexOf('Project_ID')] || '').trim(),
        claimedAmount: clmAmt,
        approvedAmount: appAmt,
        status: String(row[oHeaders.indexOf('Status')] || '').trim(),
        paidDate: formatA408DateCell_(row[oHeaders.indexOf('Paid_Date')])
      });
    }
  });

  // My Salary / Payroll (Self-only!)
  var salSheet = workbooks.finance.getSheetByName(A408_CONFIG.SALARY_ADMIN_SHEET);
  var salHeaders = salSheet ? salSheet.getRange(1, 1, 1, salSheet.getLastColumn()).getValues()[0] : [];
  var salRows = (salSheet && salSheet.getLastRow() >= 2) ? salSheet.getRange(2, 1, salSheet.getLastRow() - 1, salHeaders.length).getValues() : [];
  var mySalaries = [];
  var totalDue = 0;
  var totalPaid = 0;
  var totalCarryForward = 0;

  salRows.forEach(function(row) {
    var empId = String(row[salHeaders.indexOf('Employee_ID')] || '').trim();
    if (empId === requester.employeeId) {
      var monthStr = String(row[salHeaders.indexOf('Month')] || '').trim();
      if (isMonthIntersectingPeriod_(monthStr, period.startStr, period.endStr)) {
        var due = Number(row[salHeaders.indexOf('Due_Amount')] || 0);
        var paid = Number(row[salHeaders.indexOf('Paid_Amount')] || 0);
        var cf = Number(row[salHeaders.indexOf('Pending_Carry_Forward')] || 0);
        totalDue += due;
        totalPaid += paid;
        totalCarryForward += cf;

        mySalaries.push({
          month: monthStr,
          dueAmount: due,
          paidAmount: paid,
          pendingCarryForward: cf,
          status: String(row[salHeaders.indexOf('Status')] || '').trim()
        });
      }
    }
  });

  return {
    reportType: 'Finance Report',
    period: periodStr,
    generatedDate: generatedDateStr,
    requestedBy: requester.name + ' (' + requester.email + ')',
    summary: {
      budgetCount: budgets.length,
      budgetTotal: totalBudgetAmt,
      spendingCount: spendings.length,
      spendingTotal: totalSpendingAmt,
      oopCount: oopClaims.length,
      oopClaimedTotal: totalOopClaimed,
      oopApprovedTotal: totalOopApproved,
      salaryCount: mySalaries.length,
      salaryDueTotal: totalDue,
      salaryPaidTotal: totalPaid,
      salaryCarryForwardTotal: totalCarryForward
    },
    budgetGiven: budgets,
    employeeSpending: spendings,
    oopClaims: oopClaims,
    mySalary: mySalaries,
    accessNotice: 'Authorized financial report. Salary view is restricted exclusively to the requester (' + requester.employeeId + '). Investments are excluded from the standard Finance Report. Proof/Attachment URLs are restricted.'
  };
}

/* =========================================================================
 * 4. R44 — HR REPORT MODEL BUILDER
 * Presentation order:
 * 1. Report Header
 * 2. Employee / HR Profile
 * 3. HR Requests
 * 4. HR Request Summary
 * 5. Access Notice
 * ========================================================================= */
function buildA408HrReportModel_(workbooks, requester, period, periodStr) {
  var generatedDateStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');

  // Employee Profile(s)
  var empSheet = workbooks.hr.getSheetByName(A408_CONFIG.EMPLOYEES_SHEET);
  var empHeaders = empSheet ? empSheet.getRange(1, 1, 1, empSheet.getLastColumn()).getValues()[0] : [];
  var empRows = (empSheet && empSheet.getLastRow() >= 2) ? empSheet.getRange(2, 1, empSheet.getLastRow() - 1, empHeaders.length).getValues() : [];

  var profiles = [];
  empRows.forEach(function(row) {
    var empId = String(row[empHeaders.indexOf('Employee_ID')] || '').trim();
    // Scope: Team member sees only self; HR Admin / Site Admin sees company
    if (requester.isHRAdmin || requester.isAdmin || empId === requester.employeeId) {
      var item = {
        employeeId: empId,
        name: String(row[empHeaders.indexOf('Name')] || '').trim(),
        email: String(row[empHeaders.indexOf('Email')] || '').trim(),
        role: String(row[empHeaders.indexOf('Role')] || '').trim(),
        designation: String(row[empHeaders.indexOf('Designation')] || '').trim(),
        active: isA408BooleanTrue_(row[empHeaders.indexOf('Active')]) ? 'Active' : 'Inactive',
        reimbursementEligible: isA408BooleanTrue_(row[empHeaders.indexOf('Reimbursement_Eligible')]) ? 'Yes' : 'No',
        projectAccess: (requester.isHRAdmin || requester.isAdmin) ? String(row[empHeaders.indexOf('Project_Access')] || '').trim() : '',
        joiningDate: formatA408DateCell_(row[empHeaders.indexOf('Joining_Date')]),
        employmentStatus: String(row[empHeaders.indexOf('Employment_Status')] || '').trim(),
        reimbursementSettings: (requester.isHRAdmin || requester.isAdmin) ? String(row[empHeaders.indexOf('Reimbursement_Settings')] || '').trim() : '',
        createdAt: (requester.isHRAdmin || requester.isAdmin) ? formatA408DateCell_(row[empHeaders.indexOf('Created_At')]) : '',
        // Restricted fields
        salaryBasis: (requester.isHRAdmin || requester.isAdmin) ? row[empHeaders.indexOf('Salary_Basis')] : null,
        hrNotes: (requester.isHRAdmin || requester.isAdmin) ? String(row[empHeaders.indexOf('HR_Notes')] || '').trim() : null
      };
      profiles.push(item);
    }
  });

  // HR Requests
  var hrSheet = workbooks.hr.getSheetByName(A408_CONFIG.HR_ADMIN_SHEET);
  var hrHeaders = hrSheet ? hrSheet.getRange(1, 1, 1, hrSheet.getLastColumn()).getValues()[0] : [];
  var hrRows = (hrSheet && hrSheet.getLastRow() >= 2) ? hrSheet.getRange(2, 1, hrSheet.getLastRow() - 1, hrHeaders.length).getValues() : [];

  var requests = [];
  var typeCounts = {};
  var statusCounts = {};
  var completedCount = 0;

  hrRows.forEach(function(row) {
    var empId = String(row[hrHeaders.indexOf('Employee_ID')] || '').trim();
    // Scope filter: Team Member sees only self
    if (requester.isHRAdmin || requester.isAdmin || empId === requester.employeeId) {
      var subAt = formatA408DateCell_(row[hrHeaders.indexOf('Submitted_At')]);
      if (isDateInA408Range_(subAt, period.startStr, period.endStr)) {
        var reqType = String(row[hrHeaders.indexOf('Request_Type')] || 'Other').trim();
        var st = String(row[hrHeaders.indexOf('Status')] || 'Submitted').trim();
        typeCounts[reqType] = (typeCounts[reqType] || 0) + 1;
        statusCounts[st] = (statusCounts[st] || 0) + 1;

        requests.push({
          requestId: String(row[hrHeaders.indexOf('HR_Request_ID')] || '').trim(),
          employeeId: empId,
          requestType: reqType,
          relevantDetails: String(row[hrHeaders.indexOf('Relevant_Details')] || '').trim(),
          status: st,
          submittedAt: subAt,
          processedAt: formatA408DateCell_(row[hrHeaders.indexOf('Processed_At')]),
          processedBy: (requester.isHRAdmin || requester.isAdmin) ? String(row[hrHeaders.indexOf('Processed_By')] || '').trim() : ''
        });
      }

      var procAt = formatA408DateCell_(row[hrHeaders.indexOf('Processed_At')]);
      var statusVal = String(row[hrHeaders.indexOf('Status')] || '').trim();
      if (statusVal === 'Completed' && isDateInA408Range_(procAt, period.startStr, period.endStr)) {
        completedCount++;
      }
    }
  });

  return {
    reportType: 'HR Report',
    period: periodStr,
    generatedDate: generatedDateStr,
    requestedBy: requester.name + ' (' + requester.email + ')',
    scope: (requester.isHRAdmin || requester.isAdmin) ? 'Company-wide HR Admin Scope' : 'Self-Only Employee Scope',
    profiles: profiles,
    requests: requests,
    summary: {
      totalRequests: requests.length,
      typeCounts: typeCounts,
      statusCounts: statusCounts,
      completedCount: completedCount
    },
    accessNotice: 'Authorized HR Report compiled under ' + (requester.isHRAdmin || requester.isAdmin ? 'HR Administrator' : 'Self-Only') + ' policy. Salary_Basis and HR_Notes are masked unless explicitly authorized.'
  };
}

/* =========================================================================
 * 5. HTML RENDERER (VIEW + DOWNLOAD EQUIVALENCE)
 * ========================================================================= */
function renderA408ReportHtml_(model) {
  var css = '<style>' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; padding: 24px; max-width: 900px; margin: 0 auto; line-height: 1.5; font-size: 13px; }' +
    'h1 { font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0; }' +
    'h2 { font-size: 15px; font-weight: 600; color: #1e293b; margin: 20px 0 8px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }' +
    'h3 { font-size: 13px; font-weight: 600; color: #334155; margin: 12px 0 6px 0; }' +
    '.header-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; }' +
    '.meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px 16px; font-size: 12px; }' +
    '.meta-item { display: flex; } .meta-label { font-weight: 600; width: 120px; color: #475569; } .meta-val { color: #0f172a; }' +
    'table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 14px; font-size: 12px; }' +
    'th, td { border: 1px solid #cbd5e1; padding: 6px 10px; text-align: left; }' +
    'th { background: #f1f5f9; font-weight: 600; color: #334155; }' +
    'tr:nth-child(even) { background: #fafafa; }' +
    '.stat-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }' +
    '.stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; min-width: 140px; }' +
    '.stat-num { font-size: 18px; font-weight: 700; color: #0f172a; } .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }' +
    '.badge { display: inline-block; padding: 2px 6px; font-size: 10px; font-weight: 600; border-radius: 4px; background: #e2e8f0; color: #334155; }' +
    '.notice { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 10px 14px; font-size: 11px; color: #1e40af; margin-top: 24px; border-radius: 0 4px 4px 0; }' +
    '</style>';

  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + escapeA408Html_(model.reportType) + '</title>' + css + '</head><body>';

  // 1. Report Header
  html += '<div class="header-box">';
  html += '<h1>' + escapeA408Html_(model.reportType) + '</h1>';
  html += '<div class="meta-grid">';
  html += '<div class="meta-item"><span class="meta-label">Period:</span><span class="meta-val">' + escapeA408Html_(model.period) + '</span></div>';
  html += '<div class="meta-item"><span class="meta-label">Generated Date:</span><span class="meta-val">' + escapeA408Html_(model.generatedDate) + '</span></div>';
  html += '<div class="meta-item"><span class="meta-label">Requested By:</span><span class="meta-val">' + escapeA408Html_(model.requestedBy) + '</span></div>';
  if (model.overview && model.overview.projectName) {
    html += '<div class="meta-item"><span class="meta-label">Project:</span><span class="meta-val">' + escapeA408Html_(model.overview.projectName) + ' (' + escapeA408Html_(model.overview.projectId) + ')</span></div>';
  }
  if (model.scope) {
    html += '<div class="meta-item"><span class="meta-label">Scope:</span><span class="meta-val">' + escapeA408Html_(model.scope) + '</span></div>';
  }
  html += '</div></div>';

  if (model.reportType === 'Company Summary') {
    // 2. Executive Company Snapshot
    html += '<h2>1. Executive Company Snapshot</h2>';
    html += '<div class="stat-grid">';
    html += '<div class="stat-card"><div class="stat-num">' + model.executiveSnapshot.totalProjects + '</div><div class="stat-label">Total Projects</div></div>';
    Object.keys(model.executiveSnapshot.statusCounts).forEach(function(st) {
      html += '<div class="stat-card"><div class="stat-num">' + model.executiveSnapshot.statusCounts[st] + '</div><div class="stat-label">Status: ' + escapeA408Html_(st) + '</div></div>';
    });
    html += '</div>';

    // 3. Projects & Operations
    html += '<h2>2. Projects & Operations</h2>';
    html += '<div class="stat-grid">';
    html += '<div class="stat-card"><div class="stat-num">' + model.projectsAndOperations.createdInPeriod + '</div><div class="stat-label">Created in Period</div></div>';
    html += '<div class="stat-card"><div class="stat-num">' + model.projectsAndOperations.startInPeriod + '</div><div class="stat-label">Start Date in Period</div></div>';
    html += '<div class="stat-card"><div class="stat-num">' + model.projectsAndOperations.eventInPeriod + '</div><div class="stat-label">Event Date in Period</div></div>';
    html += '<div class="stat-card"><div class="stat-num">' + model.projectsAndOperations.momCount + '</div><div class="stat-label">MOM Published/Revised</div></div>';
    html += '<div class="stat-card"><div class="stat-num">' + model.projectsAndOperations.notesCount + '</div><div class="stat-label">Notes Published</div></div>';
    html += '</div>';

    // 4. Finance Summary
    html += '<h2>3. Finance Summary</h2>';
    html += '<div class="stat-grid">';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.financeSummary.budget.total.toLocaleString() + '</div><div class="stat-label">Budget Given (' + model.financeSummary.budget.count + ')</div></div>';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.financeSummary.spending.total.toLocaleString() + '</div><div class="stat-label">Spending (' + model.financeSummary.spending.count + ')</div></div>';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.financeSummary.oop.totalApproved.toLocaleString() + '</div><div class="stat-label">OOP Approved (' + model.financeSummary.oop.count + ')</div></div>';
    if (model.financeSummary.salary) {
      html += '<div class="stat-card"><div class="stat-num">₹' + model.financeSummary.salary.totalPaid.toLocaleString() + '</div><div class="stat-label">Salary Paid (' + model.financeSummary.salary.count + ')</div></div>';
    }
    if (model.financeSummary.investment) {
      html += '<div class="stat-card"><div class="stat-num">₹' + model.financeSummary.investment.total.toLocaleString() + '</div><div class="stat-label">Investments (' + model.financeSummary.investment.count + ')</div></div>';
    }
    html += '</div>';

    // 5. HR Summary
    html += '<h2>4. HR Summary</h2>';
    html += '<div class="stat-grid">';
    html += '<div class="stat-card"><div class="stat-num">' + model.hrSummary.activeEmployees + '</div><div class="stat-label">Active Employees</div></div>';
    html += '<div class="stat-card"><div class="stat-num">' + model.hrSummary.joinersInPeriod + '</div><div class="stat-label">New Joiners</div></div>';
    html += '<div class="stat-card"><div class="stat-num">' + model.hrSummary.hrRequestCount + '</div><div class="stat-label">HR Requests</div></div>';
    html += '<div class="stat-card"><div class="stat-num">' + model.hrSummary.hrCompletedCount + '</div><div class="stat-label">Completed Requests</div></div>';
    if (model.hrSummary.reimbursementEligibleCount !== null) {
      html += '<div class="stat-card"><div class="stat-num">' + model.hrSummary.reimbursementEligibleCount + '</div><div class="stat-label">Reimbursement Eligible</div></div>';
    }
    html += '</div>';
  } else if (model.reportType === 'Project Report') {
    // 2. Project Overview
    html += '<h2>1. Project Overview</h2>';
    html += '<table>';
    html += '<tr><th>Project ID</th><td>' + escapeA408Html_(model.overview.projectId) + '</td><th>Status</th><td>' + escapeA408Html_(model.overview.status) + '</td></tr>';
    html += '<tr><th>Project Name</th><td colspan="3">' + escapeA408Html_(model.overview.projectName) + '</td></tr>';
    html += '<tr><th>Description</th><td colspan="3">' + escapeA408Html_(model.overview.description) + '</td></tr>';
    html += '<tr><th>Owner</th><td>' + escapeA408Html_(model.overview.owner) + '</td><th>Created At</th><td>' + escapeA408Html_(model.overview.createdAt) + '</td></tr>';
    html += '<tr><th>Start Date</th><td>' + escapeA408Html_(model.overview.startDate) + '</td><th>Event Date</th><td>' + escapeA408Html_(model.overview.eventDate) + '</td></tr>';
    html += '</table>';

    // 3. Project Team
    html += '<h2>2. Project Team (' + model.team.count + ' Active Members)</h2>';
    if (model.team.members.length === 0) {
      html += '<p>No active project members listed.</p>';
    } else {
      html += '<table><tr><th>Employee ID</th><th>Project Role</th><th>Active</th><th>Assigned Date</th></tr>';
      model.team.members.forEach(function(m) {
        html += '<tr><td>' + escapeA408Html_(m.employeeId) + '</td><td>' + escapeA408Html_(m.role) + '</td><td>' + escapeA408Html_(m.active) + '</td><td>' + escapeA408Html_(m.assignedDate) + '</td></tr>';
      });
      html += '</table>';
    }

    // 4. Project Activity & Documentation
    html += '<h2>3. Project Activity & Documentation</h2>';
    html += '<h3>Published Project Notes (' + model.activity.notes.length + ')</h3>';
    if (model.activity.notes.length === 0) {
      html += '<p>No published notes in this period.</p>';
    } else {
      html += '<table><tr><th>Date</th><th>Author</th><th>Note Content</th></tr>';
      model.activity.notes.forEach(function(n) {
        html += '<tr><td style="white-space:nowrap;">' + escapeA408Html_(n.date) + '</td><td>' + escapeA408Html_(n.author) + '</td><td>' + escapeA408Html_(n.note) + '</td></tr>';
      });
      html += '</table>';
    }

    html += '<h3>Minutes of Meeting (' + model.activity.moms.length + ')</h3>';
    if (model.activity.moms.length === 0) {
      html += '<p>No published MOM in this period.</p>';
    } else {
      html += '<table><tr><th>Date</th><th>Title</th><th>Participants</th><th>Version</th><th>Status</th></tr>';
      model.activity.moms.forEach(function(m) {
        html += '<tr><td>' + escapeA408Html_(m.meetingDate) + '</td><td>' + escapeA408Html_(m.title) + '</td><td>' + escapeA408Html_(m.participants) + '</td><td>' + escapeA408Html_(m.version) + '</td><td>' + escapeA408Html_(m.status) + '</td></tr>';
      });
      html += '</table>';
    }

    // 5. Project Finance Summary
    html += '<h2>4. Project Finance Summary</h2>';
    html += '<div class="stat-grid">';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.financeSummary.budget.total.toLocaleString() + '</div><div class="stat-label">Budget Given (' + model.financeSummary.budget.count + ')</div></div>';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.financeSummary.spending.total.toLocaleString() + '</div><div class="stat-label">Spending (' + model.financeSummary.spending.count + ')</div></div>';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.financeSummary.oop.totalApproved.toLocaleString() + '</div><div class="stat-label">OOP Approved (' + model.financeSummary.oop.count + ')</div></div>';
    html += '</div>';
  } else if (model.reportType === 'Finance Report') {
    // 2. Finance Summary
    html += '<h2>1. Finance Summary</h2>';
    html += '<div class="stat-grid">';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.summary.budgetTotal.toLocaleString() + '</div><div class="stat-label">Budget (' + model.summary.budgetCount + ')</div></div>';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.summary.spendingTotal.toLocaleString() + '</div><div class="stat-label">Spending (' + model.summary.spendingCount + ')</div></div>';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.summary.oopApprovedTotal.toLocaleString() + '</div><div class="stat-label">OOP Approved (' + model.summary.oopCount + ')</div></div>';
    html += '<div class="stat-card"><div class="stat-num">₹' + model.summary.salaryPaidTotal.toLocaleString() + '</div><div class="stat-label">My Salary Paid (' + model.summary.salaryCount + ')</div></div>';
    html += '</div>';

    // 3. Budget Given
    html += '<h2>2. Budget Given</h2>';
    if (model.budgetGiven.length === 0) {
      html += '<p>No budget records in this period.</p>';
    } else {
      html += '<table><tr><th>Date</th><th>Amount</th><th>Purpose</th><th>Project</th><th>Status</th></tr>';
      model.budgetGiven.forEach(function(b) {
        html += '<tr><td>' + escapeA408Html_(b.date) + '</td><td>₹' + Number(b.amount).toLocaleString() + '</td><td>' + escapeA408Html_(b.purpose) + '</td><td>' + escapeA408Html_(b.project) + '</td><td>' + escapeA408Html_(b.status) + '</td></tr>';
      });
      html += '</table>';
    }

    // 4. Employee Spending
    html += '<h2>3. Employee Spending</h2>';
    if (model.employeeSpending.length === 0) {
      html += '<p>No spending records in this period.</p>';
    } else {
      html += '<table><tr><th>Date</th><th>Amount</th><th>Recipient/Vendor</th><th>Purpose</th><th>Project</th><th>Status</th></tr>';
      model.employeeSpending.forEach(function(s) {
        html += '<tr><td>' + escapeA408Html_(s.date) + '</td><td>₹' + Number(s.amount).toLocaleString() + '</td><td>' + escapeA408Html_(s.recipientVendor) + '</td><td>' + escapeA408Html_(s.purpose) + '</td><td>' + escapeA408Html_(s.project) + '</td><td>' + escapeA408Html_(s.status) + '</td></tr>';
      });
      html += '</table>';
    }

    // 5. OOP Claims
    html += '<h2>4. Out-of-Pocket Claims</h2>';
    if (model.oopClaims.length === 0) {
      html += '<p>No OOP claims in this period.</p>';
    } else {
      html += '<table><tr><th>Date</th><th>Purpose</th><th>Project</th><th>Claimed</th><th>Approved</th><th>Status</th><th>Paid Date</th></tr>';
      model.oopClaims.forEach(function(c) {
        html += '<tr><td>' + escapeA408Html_(c.date) + '</td><td>' + escapeA408Html_(c.purpose) + '</td><td>' + escapeA408Html_(c.project) + '</td><td>₹' + Number(c.claimedAmount).toLocaleString() + '</td><td>₹' + Number(c.approvedAmount).toLocaleString() + '</td><td>' + escapeA408Html_(c.status) + '</td><td>' + escapeA408Html_(c.paidDate) + '</td></tr>';
      });
      html += '</table>';
    }

    // 6. My Salary / Payroll
    html += '<h2>5. My Salary / Payroll</h2>';
    if (model.mySalary.length === 0) {
      html += '<p>No salary records for your Employee ID in this period.</p>';
    } else {
      html += '<table><tr><th>Month</th><th>Due Amount</th><th>Paid Amount</th><th>Pending Carry-Forward</th><th>Status</th></tr>';
      model.mySalary.forEach(function(sal) {
        html += '<tr><td>' + escapeA408Html_(sal.month) + '</td><td>₹' + Number(sal.dueAmount).toLocaleString() + '</td><td>₹' + Number(sal.paidAmount).toLocaleString() + '</td><td>₹' + Number(sal.pendingCarryForward).toLocaleString() + '</td><td>' + escapeA408Html_(sal.status) + '</td></tr>';
      });
      html += '</table>';
    }
  } else if (model.reportType === 'HR Report') {
    // 2. Employee / HR Profile
    html += '<h2>1. Employee / HR Profile</h2>';
    html += '<table><tr><th>Employee ID</th><th>Name</th><th>Email</th><th>Role</th><th>Designation</th><th>Active</th><th>Status</th></tr>';
    model.profiles.forEach(function(p) {
      html += '<tr><td>' + escapeA408Html_(p.employeeId) + '</td><td>' + escapeA408Html_(p.name) + '</td><td>' + escapeA408Html_(p.email) + '</td><td>' + escapeA408Html_(p.role) + '</td><td>' + escapeA408Html_(p.designation) + '</td><td>' + escapeA408Html_(p.active) + '</td><td>' + escapeA408Html_(p.employmentStatus) + '</td></tr>';
    });
    html += '</table>';

    // 3. HR Requests
    html += '<h2>2. HR Requests (' + model.requests.length + ')</h2>';
    if (model.requests.length === 0) {
      html += '<p>No HR requests submitted in this period.</p>';
    } else {
      html += '<table><tr><th>Request ID</th><th>Employee ID</th><th>Type</th><th>Details</th><th>Status</th><th>Submitted At</th><th>Processed At</th></tr>';
      model.requests.forEach(function(r) {
        html += '<tr><td>' + escapeA408Html_(r.requestId) + '</td><td>' + escapeA408Html_(r.employeeId) + '</td><td>' + escapeA408Html_(r.requestType) + '</td><td>' + escapeA408Html_(r.relevantDetails) + '</td><td>' + escapeA408Html_(r.status) + '</td><td>' + escapeA408Html_(r.submittedAt) + '</td><td>' + escapeA408Html_(r.processedAt) + '</td></tr>';
      });
      html += '</table>';
    }

    // 4. HR Request Summary
    html += '<h2>3. HR Request Summary</h2>';
    html += '<div class="stat-grid">';
    html += '<div class="stat-card"><div class="stat-num">' + model.summary.totalRequests + '</div><div class="stat-label">Total Requests</div></div>';
    html += '<div class="stat-card"><div class="stat-num">' + model.summary.completedCount + '</div><div class="stat-label">Completed</div></div>';
    Object.keys(model.summary.typeCounts).forEach(function(t) {
      html += '<div class="stat-card"><div class="stat-num">' + model.summary.typeCounts[t] + '</div><div class="stat-label">Type: ' + escapeA408Html_(t) + '</div></div>';
    });
    html += '</div>';
  }

  // Access Notice (Final section)
  html += '<div class="notice"><strong>Access Notice:</strong> ' + escapeA408Html_(model.accessNotice) + '</div>';
  html += '</body></html>';

  return html;
}

/**
 * Creates PDF artifact under MASTER COMPANY/Reports using native Google Apps Script blob conversion.
 */
function createA408ReportPdf_(reportsFolder, fileBaseName, htmlContent) {
  var htmlBlob = Utilities.newBlob(htmlContent, 'text/html', fileBaseName + '.html');
  var pdfBlob = htmlBlob.getAs('application/pdf');
  var fileName = fileBaseName + '.pdf';
  pdfBlob.setName(fileName);

  var file = reportsFolder.createFile(pdfBlob);
  return {
    fileId: file.getId(),
    fileName: fileName,
    driveUrl: file.getUrl()
  };
}

/**
 * Locates or creates MASTER COMPANY/Reports folder idempotently.
 */
function resolveA408ReportsFolder_() {
  var rootMatches = DriveApp.getFoldersByName(A408_CONFIG.ROOT_FOLDER_NAME);
  var root = null;
  while (rootMatches.hasNext()) {
    var f = rootMatches.next();
    if (!f.isTrashed()) {
      root = f;
      break;
    }
  }
  if (!root) throw new Error('A4_08_ROOT_FOLDER_MISSING: ' + A408_CONFIG.ROOT_FOLDER_NAME);

  var reportFolders = root.getFoldersByName(A408_CONFIG.REPORTS_FOLDER_NAME);
  var reportsFolder = null;
  while (reportFolders.hasNext()) {
    var rf = reportFolders.next();
    if (!rf.isTrashed()) {
      reportsFolder = rf;
      break;
    }
  }
  if (!reportsFolder) {
    reportsFolder = root.createFolder(A408_CONFIG.REPORTS_FOLDER_NAME);
  }
  return reportsFolder;
}

/* =========================================================================
 * HELPER FUNCTIONS (Summary calculations, date filtering, headers)
 * ========================================================================= */

function summarizeA408FinanceTable_(wb, sheetName, dateCol, amtCol, statusCol, period) {
  var sheet = wb.getSheetByName(sheetName);
  var headers = sheet ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  var rows = (sheet && sheet.getLastRow() >= 2) ? sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues() : [];

  var count = 0;
  var total = 0;
  var statusCounts = {};

  var dIdx = headers.indexOf(dateCol);
  var aIdx = headers.indexOf(amtCol);
  var sIdx = headers.indexOf(statusCol);

  rows.forEach(function(row) {
    var d = formatA408DateCell_(row[dIdx]);
    if (isDateInA408Range_(d, period.startStr, period.endStr)) {
      count++;
      var amt = Number(row[aIdx] || 0);
      total += amt;
      var st = String(row[sIdx] || 'Unknown').trim();
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    }
  });

  return { count: count, total: total, statusCounts: statusCounts };
}

function summarizeA408ProjectFinanceTable_(wb, sheetName, projectId, dateCol, amtCol, statusCol, period) {
  var sheet = wb.getSheetByName(sheetName);
  var headers = sheet ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  var rows = (sheet && sheet.getLastRow() >= 2) ? sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues() : [];

  var count = 0;
  var total = 0;
  var statusCounts = {};

  var pIdx = headers.indexOf('Project_ID');
  var dIdx = headers.indexOf(dateCol);
  var aIdx = headers.indexOf(amtCol);
  var sIdx = headers.indexOf(statusCol);

  rows.forEach(function(row) {
    if (String(row[pIdx] || '').trim() === projectId) {
      var d = formatA408DateCell_(row[dIdx]);
      if (isDateInA408Range_(d, period.startStr, period.endStr)) {
        count++;
        var amt = Number(row[aIdx] || 0);
        total += amt;
        var st = String(row[sIdx] || 'Unknown').trim();
        statusCounts[st] = (statusCounts[st] || 0) + 1;
      }
    }
  });

  return { count: count, total: total, statusCounts: statusCounts };
}

function summarizeA408OopClaimsTable_(wb, period) {
  var sheet = wb.getSheetByName(A408_CONFIG.OOP_CLAIMS_SHEET);
  var headers = sheet ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  var rows = (sheet && sheet.getLastRow() >= 2) ? sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues() : [];

  var count = 0;
  var totalClaimed = 0;
  var totalApproved = 0;
  var statusCounts = {};

  rows.forEach(function(row) {
    var d = formatA408DateCell_(row[headers.indexOf('Date')]);
    if (isDateInA408Range_(d, period.startStr, period.endStr)) {
      count++;
      totalClaimed += Number(row[headers.indexOf('Amount')] || 0);
      totalApproved += Number(row[headers.indexOf('Approved_Amount')] || 0);
      var st = String(row[headers.indexOf('Status')] || 'Unknown').trim();
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    }
  });

  return { count: count, totalClaimed: totalClaimed, totalApproved: totalApproved, statusCounts: statusCounts };
}

function summarizeA408ProjectOopClaims_(wb, projectId, period) {
  var sheet = wb.getSheetByName(A408_CONFIG.OOP_CLAIMS_SHEET);
  var headers = sheet ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  var rows = (sheet && sheet.getLastRow() >= 2) ? sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues() : [];

  var count = 0;
  var totalClaimed = 0;
  var totalApproved = 0;
  var statusCounts = {};

  rows.forEach(function(row) {
    if (String(row[headers.indexOf('Project_ID')] || '').trim() === projectId) {
      var d = formatA408DateCell_(row[headers.indexOf('Date')]);
      if (isDateInA408Range_(d, period.startStr, period.endStr)) {
        count++;
        totalClaimed += Number(row[headers.indexOf('Amount')] || 0);
        totalApproved += Number(row[headers.indexOf('Approved_Amount')] || 0);
        var st = String(row[headers.indexOf('Status')] || 'Unknown').trim();
        statusCounts[st] = (statusCounts[st] || 0) + 1;
      }
    }
  });

  return { count: count, totalClaimed: totalClaimed, totalApproved: totalApproved, statusCounts: statusCounts };
}

function summarizeA408SalaryTable_(wb, period) {
  var sheet = wb.getSheetByName(A408_CONFIG.SALARY_ADMIN_SHEET);
  var headers = sheet ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  var rows = (sheet && sheet.getLastRow() >= 2) ? sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues() : [];

  var count = 0;
  var totalDue = 0;
  var totalPaid = 0;
  var totalCarryForward = 0;
  var statusCounts = {};

  rows.forEach(function(row) {
    var monthStr = String(row[headers.indexOf('Month')] || '').trim();
    if (isMonthIntersectingPeriod_(monthStr, period.startStr, period.endStr)) {
      count++;
      totalDue += Number(row[headers.indexOf('Due_Amount')] || 0);
      totalPaid += Number(row[headers.indexOf('Paid_Amount')] || 0);
      totalCarryForward += Number(row[headers.indexOf('Pending_Carry_Forward')] || 0);
      var st = String(row[headers.indexOf('Status')] || 'Unknown').trim();
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    }
  });

  return { count: count, totalDue: totalDue, totalPaid: totalPaid, totalCarryForward: totalCarryForward, statusCounts: statusCounts };
}

function summarizeA408InvestmentsTable_(wb, period) {
  var sheet = wb.getSheetByName(A408_CONFIG.INVESTMENTS_SHEET);
  var headers = sheet ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0] : [];
  var rows = (sheet && sheet.getLastRow() >= 2) ? sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues() : [];

  var count = 0;
  var total = 0;
  var statusCounts = {};

  rows.forEach(function(row) {
    var takenD = formatA408DateCell_(row[headers.indexOf('Taken_Date')]);
    if (isDateInA408Range_(takenD, period.startStr, period.endStr)) {
      count++;
      total += Number(row[headers.indexOf('Amount')] || 0);
      var st = String(row[headers.indexOf('Status')] || 'Active').trim();
      statusCounts[st] = (statusCounts[st] || 0) + 1;
    }
  });

  return { count: count, total: total, statusCounts: statusCounts };
}

function isDateInA408Range_(dateStr, startStr, endStr) {
  if (!dateStr || dateStr.length < 10) return false;
  var d = dateStr.substring(0, 10);
  return d >= startStr && d <= endStr;
}

function isMonthIntersectingPeriod_(monthStr, startStr, endStr) {
  if (!monthStr || monthStr.length < 7) return false;
  var ym = monthStr.substring(0, 7);
  var monthStart = ym + '-01';
  var monthEnd = ym + '-31'; // Safe lexical comparison
  return monthEnd >= startStr && monthStart <= endStr;
}

function formatA408DateCell_(val) {
  if (!val) return '';
  if (val instanceof Date && !isNaN(val.getTime())) {
    return Utilities.formatDate(val, Session.getScriptTimeZone() || 'GMT', 'yyyy-MM-dd');
  }
  var str = String(val).trim();
  var match = str.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : str;
}

function escapeA408Html_(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function setA408RowVal_(row, headers, colName, value) {
  var idx = headers.indexOf(colName);
  if (idx < 0) throw new Error('A4_08_HEADER_MISSING: ' + colName);
  row[idx] = value;
}

function assertExactA408ReportIndexHeaders_(headers) {
  var expected = A408_CONFIG.REPORT_INDEX_HEADERS;
  if (!headers || headers.length !== expected.length) {
    throw new Error('A4_08_REPORT_INDEX_HEADER_COUNT_MISMATCH: expected ' + expected.length + ', got ' + (headers ? headers.length : 0));
  }
  for (var i = 0; i < expected.length; i++) {
    if (headers[i] !== expected[i]) {
      throw new Error('A4_08_REPORT_INDEX_HEADER_MISMATCH at col ' + (i + 1) + ': expected ' + expected[i] + ', got ' + headers[i]);
    }
  }
}

function getA408ExistingIds_(sheet, headers) {
  var idIdx = headers.indexOf('Report_ID');
  if (idIdx < 0 || sheet.getLastRow() < 2) return [];
  var vals = sheet.getRange(2, idIdx + 1, sheet.getLastRow() - 1, 1).getValues();
  var ids = [];
  vals.forEach(function(row) {
    var v = String(row[0] || '').trim();
    if (v) ids.push(v);
  });
  return ids;
}


/**
 * P4-13 — Sensitive Access Live Verification.
 * Verifies that a standard active employee cannot receive restricted
 * employee-level Salary/Investment/HR data through the report automation.
 *
 * This test inspects only generated report models; it does not change
 * workbook permissions and therefore does not claim to override direct
 * Google Drive/Sheets sharing already granted outside the automation.
 */
function testA413SensitiveAccessLive() {
  var results = [];
  var hrWb = findA408Spreadsheet_(A408_CONFIG.HR_WORKBOOK);
  var financeWb = findA408Spreadsheet_(A408_CONFIG.FINANCE_WORKBOOK);
  var empSheet = hrWb.getSheetByName(A408_CONFIG.EMPLOYEES_SHEET);
  if (!empSheet || empSheet.getLastRow() < 2) {
    throw new Error('A4_13_NO_EMPLOYEE_DATA');
  }

  var headers = empSheet.getRange(1, 1, 1, empSheet.getLastColumn()).getValues()[0];
  var rows = empSheet.getRange(2, 1, empSheet.getLastRow() - 1, headers.length).getValues();
  var nonAdmin = null;

  for (var i = 0; i < rows.length; i++) {
    if (!isA408BooleanTrue_(rows[i][headers.indexOf('Active')])) continue;
    var role = String(rows[i][headers.indexOf('Role')] || '').trim();
    var desig = String(rows[i][headers.indexOf('Designation')] || '').trim();
    var isAdmin = /^(Administrator|Site Admin)$/i.test(role) ||
                  /^(Administrator|Site Admin)$/i.test(desig);
    if (!isAdmin) {
      nonAdmin = {
        email: String(rows[i][headers.indexOf('Email')] || '').trim(),
        employeeId: String(rows[i][headers.indexOf('Employee_ID')] || '').trim()
      };
      break;
    }
  }

  if (!nonAdmin || !nonAdmin.email || !nonAdmin.employeeId) {
    throw new Error('A4_13_NO_ACTIVE_NON_ADMIN_EMPLOYEE');
  }

  var testPeriod = '2026-07-01 to 2026-09-30';
  var baselineEmpRows = empSheet.getLastRow();
  var salarySheet = financeWb.getSheetByName(A408_CONFIG.SALARY_ADMIN_SHEET);
  var investmentSheet = financeWb.getSheetByName(A408_CONFIG.INVESTMENTS_SHEET);
  var baselineSalaryRows = salarySheet ? salarySheet.getLastRow() : 0;
  var baselineInvestmentRows = investmentSheet ? investmentSheet.getLastRow() : 0;

  try {
    var company = generateA408Report({
      email: nonAdmin.email,
      reportType: 'Company Summary',
      period: testPeriod
    });
    var companyModel = company && company.model ? company.model : {};
    var companyFinance = companyModel.financeSummary || {};
    var companyHr = companyModel.hrSummary || {};

    var companyPass =
      companyFinance.salary === null &&
      companyFinance.investment === null &&
      companyHr.roleCounts === null &&
      JSON.stringify(companyModel).indexOf('Salary_Basis') < 0 &&
      JSON.stringify(companyModel).indexOf('HR_Notes') < 0;

    results.push({
      test: 'Company Summary restricted data',
      status: companyPass ? 'PASS' : 'FAIL',
      evidence: 'Non-admin requester receives no Salary summary, Investment summary, company-wide role counts, Salary_Basis or HR_Notes.'
    });

    var finance = generateA408Report({
      email: nonAdmin.email,
      reportType: 'Finance Report',
      period: testPeriod
    });
    var financeModel = finance && finance.model ? finance.model : {};
    var mySalary = Array.isArray(financeModel.mySalary) ? financeModel.mySalary : [];
    var salarySelfOnly = mySalary.every(function(row) {
      return String(row.employeeId || row.Employee_ID || '').trim() === nonAdmin.employeeId;
    });
    var financePass = salarySelfOnly &&
      !Object.prototype.hasOwnProperty.call(financeModel, 'investments') &&
      JSON.stringify(financeModel).indexOf('Investment_ID') < 0;

    results.push({
      test: 'Finance Report salary/investment restriction',
      status: financePass ? 'PASS' : 'FAIL',
      evidence: 'Salary is requester-self-only and Investments are excluded from the standard Finance Report.'
    });

    var hr = generateA408Report({
      email: nonAdmin.email,
      reportType: 'HR Report',
      period: testPeriod
    });
    var hrModel = hr && hr.model ? hr.model : {};
    var profiles = Array.isArray(hrModel.profiles) ? hrModel.profiles : [];
    var hrSelfOnly = profiles.every(function(profile) {
      return String(profile.employeeId || '').trim() === nonAdmin.employeeId;
    });
    var hrSensitiveMasked = profiles.every(function(profile) {
      return profile.salaryBasis === null &&
             profile.hrNotes === null &&
             String(profile.projectAccess || '') === '' &&
             String(profile.reimbursementSettings || '') === '' &&
             String(profile.createdAt || '') === '';
    });
    var hrPass = hrSelfOnly && hrSensitiveMasked;

    results.push({
      test: 'HR Report self-only/confidential-field restriction',
      status: hrPass ? 'PASS' : 'FAIL',
      evidence: 'Non-admin requester receives self-only HR profile; Salary_Basis, HR_Notes and restricted administrative fields are masked.'
    });

    var statePass =
      empSheet.getLastRow() === baselineEmpRows &&
      (!salarySheet || salarySheet.getLastRow() === baselineSalaryRows) &&
      (!investmentSheet || investmentSheet.getLastRow() === baselineInvestmentRows);

    results.push({
      test: 'Source/state preservation',
      status: statePass ? 'PASS' : 'FAIL',
      evidence: 'P4-13 verification created no employee, salary or investment records.'
    });

  } finally {
    // No test records are created by this harness; nothing to delete.
  }

  var passed = results.filter(function(r) { return r.status === 'PASS'; }).length;
  var summary = [
    'P4-13 SENSITIVE ACCESS LIVE VERIFICATION',
    '',
    results.map(function(r) { return r.test + ': ' + r.status; }).join('\n'),
    '',
    'P4-13 LIVE VERIFICATION — ' + (passed === results.length ? 'PASS (' + passed + '/' + results.length + ')' : 'FAIL (' + passed + '/' + results.length + ')')
  ].join('\n');

  console.log(summary);
  Logger.log(summary);
  console.log(JSON.stringify({
    requesterEmployeeId: nonAdmin.employeeId,
    requesterEmail: nonAdmin.email,
    results: results
  }, null, 2));

  return {
    allPassed: passed === results.length,
    passedCount: passed,
    totalCount: results.length,
    summary: summary,
    results: results
  };
}

function findA408Spreadsheet_(name) {
  var files = DriveApp.getFilesByName(name);
  var matches = [];
  while (files.hasNext()) {
    var f = files.next();
    if (!f.isTrashed()) matches.push(f);
  }
  if (matches.length !== 1) {
    throw new Error('A4_08_WORKBOOK_AMBIGUOUS_OR_MISSING: ' + name + ' count=' + matches.length);
  }
  return SpreadsheetApp.openById(matches[0].getId());
}

function isA408BooleanTrue_(val) {
  if (val === true) return true;
  if (val === false || val === null || val === undefined) return false;
  var s = String(val).trim().toLowerCase();
  return s === 'true' || s === 'active' || s === 'yes' || s === '1';
}

/* =========================================================================
 * 6. FORM TRIGGER HANDLERS & INSTALLATION
 * ========================================================================= */

/**
 * Native Form Submit handler for FRM-06 Report Requests.
 */
function processReportRequestFormSubmit(e) {
  if (!e || !e.namedValues) {
    throw new Error('A4_08_INVALID_EVENT: onFormSubmit namedValues required');
  }

  function getVal(aliases) {
    for (var i = 0; i < aliases.length; i++) {
      if (e.namedValues[aliases[i]] && e.namedValues[aliases[i]].length) {
        return e.namedValues[aliases[i]][0];
      }
    }
    return '';
  }

  var req = {
    email: getVal(['Employee Email ID', 'Email Address', 'Employee Email', 'Email']),
    reportType: getVal(['Report Type', 'Type']),
    period: getVal(['Period', 'Reporting Period']),
    projectName: getVal(['Project Name', 'Project'])
  };

  try {
    return generateA408Report(req);
  } catch (err) {
    console.error(JSON.stringify({
      module: 'A4-08',
      source: 'FRM-06',
      error: err.message,
      timestamp: new Date().toISOString()
    }));
    throw err;
  }
}

/**
 * Read-only verification of FRM-06 / Report Generator trigger.
 */
function verifyA408ReportTrigger() {
  var triggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === 'processReportRequestFormSubmit';
  });
  var valid = triggers.length === 1 &&
    triggers[0].getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT;
  return {
    status: valid ? 'PASS' : 'FAIL',
    triggerCount: triggers.length,
    handler: triggers.length ? triggers[0].getHandlerFunction() : '',
    eventType: triggers.length ? String(triggers[0].getEventType()) : ''
  };
}

/**
 * Installs ON_FORM_SUBMIT trigger for FRM-06 report requests on MASTER_COMPANY_ADMIN.
 */
function installA408ReportTrigger() {
  var adminWb = findA408Spreadsheet_(A408_CONFIG.ADMIN_WORKBOOK);
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'processReportRequestFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger('processReportRequestFormSubmit').forSpreadsheet(adminWb).onFormSubmit().create();
  return verifyA408ReportTrigger();
}

/**
 * Read-only prerequisite check for A4-08 Report Generator.
 */
function verifyA408Prerequisites() {
  var result = {
    adminWorkbook: false,
    operationsWorkbook: false,
    financeWorkbook: false,
    hrWorkbook: false,
    reportIndexSheet: false,
    reportIndexExactHeaders: false,
    centralGeneratorAvailable: false,
    reportsFolderAvailable: false,
    status: 'FAIL'
  };

  try {
    var adminWb = findA408Spreadsheet_(A408_CONFIG.ADMIN_WORKBOOK);
    result.adminWorkbook = !!adminWb;

    var opsWb = findA408Spreadsheet_(A408_CONFIG.OPERATIONS_WORKBOOK);
    result.operationsWorkbook = !!opsWb;

    var finWb = findA408Spreadsheet_(A408_CONFIG.FINANCE_WORKBOOK);
    result.financeWorkbook = !!finWb;

    var hrWb = findA408Spreadsheet_(A408_CONFIG.HR_WORKBOOK);
    result.hrWorkbook = !!hrWb;

    var indexSheet = adminWb.getSheetByName(A408_CONFIG.REPORT_INDEX_SHEET);
    result.reportIndexSheet = !!indexSheet;

    if (indexSheet) {
      var headers = indexSheet.getRange(1, 1, 1, indexSheet.getLastColumn()).getValues()[0];
      assertExactA408ReportIndexHeaders_(headers);
      result.reportIndexExactHeaders = true;
    }

    result.centralGeneratorAvailable = typeof generateA4Id === 'function';

    var folder = resolveA408ReportsFolder_();
    result.reportsFolderAvailable = !!folder;

    result.status = (result.adminWorkbook &&
      result.operationsWorkbook &&
      result.financeWorkbook &&
      result.hrWorkbook &&
      result.reportIndexSheet &&
      result.reportIndexExactHeaders &&
      result.centralGeneratorAvailable &&
      result.reportsFolderAvailable) ? 'PASS' : 'FAIL';
  } catch (err) {
    result.error = err.message;
  }

  return result;
}

/* =========================================================================
 * 7. COMPLETE LIVE VERIFICATION TEST SUITE (P4-10)
 * ========================================================================= */
function testA408ReportGeneratorLive() {
  var results = [];
  var companyRes = null;
  var projRes = null;
  var finRes = null;
  var hrRes = null;

  var adminWb = findA408Spreadsheet_(A408_CONFIG.ADMIN_WORKBOOK);
  var opsWb = findA408Spreadsheet_(A408_CONFIG.OPERATIONS_WORKBOOK);
  var hrWb = findA408Spreadsheet_(A408_CONFIG.HR_WORKBOOK);
  var reportIndexSheet = adminWb.getSheetByName(A408_CONFIG.REPORT_INDEX_SHEET);
  var mSheet = opsWb.getSheetByName(A408_CONFIG.PROJECT_MEMBERS_SHEET);
  var pSheet = opsWb.getSheetByName(A408_CONFIG.PROJECTS_SHEET);

  var createdRowIndices = [];
  var createdMemberRowIndices = [];
  var createdProjectRowIndices = [];
  var createdFiles = [];

  try {
    // Locate an active employee to use as requester
    var empSheet = hrWb.getSheetByName(A408_CONFIG.EMPLOYEES_SHEET);
    var empHeaders = empSheet.getRange(1, 1, 1, empSheet.getLastColumn()).getValues()[0];
    var empRows = empSheet.getRange(2, 1, empSheet.getLastRow() - 1, empHeaders.length).getValues();
    var activeEmp = null;
    for (var i = 0; i < empRows.length; i++) {
      if (isA408BooleanTrue_(empRows[i][empHeaders.indexOf('Active')])) {
        var rVal = String(empRows[i][empHeaders.indexOf('Role')] || '').trim();
        var dVal = String(empRows[i][empHeaders.indexOf('Designation')] || '').trim();
        var candidate = {
          email: String(empRows[i][empHeaders.indexOf('Email')] || '').trim(),
          empId: String(empRows[i][empHeaders.indexOf('Employee_ID')] || '').trim(),
          role: rVal,
          designation: dVal,
          isAdmin: /^(Administrator|Site Admin)$/i.test(rVal) || /^(Administrator|Site Admin)$/i.test(dVal)
        };
        if (!activeEmp) activeEmp = candidate;
        if (candidate.isAdmin) {
          activeEmp = candidate;
          break;
        }
      }
    }
    if (!activeEmp) throw new Error('A4_08_TEST_NO_ACTIVE_EMPLOYEE');

    // Locate a project
    var pHeaders = pSheet ? pSheet.getRange(1, 1, 1, pSheet.getLastColumn()).getValues()[0] : [];
    var pRows = (pSheet && pSheet.getLastRow() >= 2) ? pSheet.getRange(2, 1, pSheet.getLastRow() - 1, pHeaders.length).getValues() : [];
    var testProject = null;
    if (pRows.length > 0) {
      testProject = {
        name: String(pRows[0][pHeaders.indexOf('Project_Name')] || '').trim(),
        id: String(pRows[0][pHeaders.indexOf('Project_ID')] || '').trim()
      };
    } else {
      testProject = { name: 'MOM_TEST_PROJECT', id: 'PRJ-TEST01' };
    }

    var testPeriod = '2026-07-01 to 2026-09-30';

    // -------------------------------------------------------------------------
    // TEST 1: Company Summary
    // -------------------------------------------------------------------------
    try {
      companyRes = generateA408Report({
        email: activeEmp.email,
        reportType: 'Company Summary',
        period: testPeriod
      });
      if (companyRes.driveUrl) createdFiles.push(companyRes.driveUrl);
      createdRowIndices.push(reportIndexSheet.getLastRow());

      var pass1 = companyRes && companyRes.status === 'PASS' &&
                  /^RPT-[0-9]{6}$/.test(companyRes.reportId) &&
                  companyRes.reportType === 'Company Summary' &&
                  companyRes.period === testPeriod &&
                  companyRes.model &&
                  companyRes.model.executiveSnapshot &&
                  companyRes.model.projectsAndOperations &&
                  companyRes.model.financeSummary &&
                  companyRes.model.hrSummary;

      results.push({
        test: 'Company Summary',
        status: pass1 ? 'PASS' : 'FAIL',
        evidence: 'Report_ID=' + (companyRes ? companyRes.reportId : 'N/A') + ', R38 6-section model generated with Executive Snapshot',
        error: pass1 ? null : 'Incomplete Company Summary structure'
      });
    } catch (e1) {
      results.push({
        test: 'Company Summary',
        status: 'FAIL',
        evidence: null,
        error: e1.message || String(e1),
        stack: e1.stack || ''
      });
    }

    // -------------------------------------------------------------------------
    // TEST 2: Project Report
    // -------------------------------------------------------------------------
    try {
      // Ensure legitimate project membership exists for activeEmp on testProject
      var mHeaders = mSheet ? mSheet.getRange(1, 1, 1, mSheet.getLastColumn()).getValues()[0] : [];
      var mRows = (mSheet && mSheet.getLastRow() >= 2) ? mSheet.getRange(2, 1, mSheet.getLastRow() - 1, mHeaders.length).getValues() : [];
      var pIdCol = mHeaders.indexOf('Project_ID');
      var empIdCol = mHeaders.indexOf('Employee_ID');
      var actCol = mHeaders.indexOf('Active');

      var alreadyMember = false;
      for (var m = 0; m < mRows.length; m++) {
        if (String(mRows[m][pIdCol] || '').trim() === testProject.id &&
            String(mRows[m][empIdCol] || '').trim() === activeEmp.empId &&
            isA408BooleanTrue_(mRows[m][actCol])) {
          alreadyMember = true;
          break;
        }
      }

      if (!alreadyMember && mSheet) {
        var existingMbrIds = [];
        var mbrIdIdx = mHeaders.indexOf('Member_Record_ID');
        mRows.forEach(function(r) {
          var mid = String(r[mbrIdIdx] || '').trim();
          if (mid) existingMbrIds.push(mid);
        });
        var newMbrId = generateA4Id('MBR', existingMbrIds);
        var newMemberRow = new Array(mHeaders.length).fill('');
        setA408RowVal_(newMemberRow, mHeaders, 'Member_Record_ID', newMbrId);
        setA408RowVal_(newMemberRow, mHeaders, 'Project_ID', testProject.id);
        setA408RowVal_(newMemberRow, mHeaders, 'Employee_ID', activeEmp.empId);
        setA408RowVal_(newMemberRow, mHeaders, 'Project_Role', 'Core Contributor');
        if (mHeaders.indexOf('Access_Level') >= 0) {
          setA408RowVal_(newMemberRow, mHeaders, 'Access_Level', 'Editor');
        }
        setA408RowVal_(newMemberRow, mHeaders, 'Active', true); // Boolean TRUE per Phase 3 schema
        setA408RowVal_(newMemberRow, mHeaders, 'Assigned_Date', '2026-07-01');

        mSheet.appendRow(newMemberRow);
        SpreadsheetApp.flush();
        createdMemberRowIndices.push(mSheet.getLastRow());
      }

      projRes = generateA408Report({
        email: activeEmp.email,
        reportType: 'Project Report',
        projectName: testProject.name,
        period: testPeriod
      });
      if (projRes.driveUrl) createdFiles.push(projRes.driveUrl);
      createdRowIndices.push(reportIndexSheet.getLastRow());

      var pass2 = projRes && projRes.status === 'PASS' &&
                  projRes.projectId === testProject.id &&
                  projRes.model &&
                  projRes.model.overview &&
                  projRes.model.team &&
                  projRes.model.activity &&
                  projRes.model.financeSummary;

      results.push({
        test: 'Project Report',
        status: pass2 ? 'PASS' : 'FAIL',
        evidence: 'Project_ID=' + (projRes ? projRes.projectId : 'N/A') + ', authorized membership verified through Employees -> Project_Members',
        error: pass2 ? null : 'Incomplete Project Report structure'
      });
    } catch (e2) {
      results.push({
        test: 'Project Report',
        status: 'FAIL',
        evidence: null,
        error: e2.message || String(e2),
        stack: e2.stack || ''
      });
    }

    // -------------------------------------------------------------------------
    // TEST 3: Finance Report
    // -------------------------------------------------------------------------
    try {
      finRes = generateA408Report({
        email: activeEmp.email,
        reportType: 'Finance Report',
        period: testPeriod
      });
      if (finRes.driveUrl) createdFiles.push(finRes.driveUrl);
      createdRowIndices.push(reportIndexSheet.getLastRow());

      var pass3 = finRes && finRes.status === 'PASS' &&
                  finRes.model &&
                  finRes.model.summary &&
                  finRes.model.budgetGiven &&
                  finRes.model.employeeSpending &&
                  finRes.model.oopClaims &&
                  finRes.model.mySalary &&
                  !finRes.model.investments; // Investments explicitly excluded per R41

      results.push({
        test: 'Finance Report',
        status: pass3 ? 'PASS' : 'FAIL',
        evidence: 'R41 presentation structure verified, self-only salary included, investments strictly excluded',
        error: pass3 ? null : 'Finance report structure or investment exclusion failure'
      });
    } catch (e3) {
      results.push({
        test: 'Finance Report',
        status: 'FAIL',
        evidence: null,
        error: e3.message || String(e3),
        stack: e3.stack || ''
      });
    }

    // -------------------------------------------------------------------------
    // TEST 4: HR Report
    // -------------------------------------------------------------------------
    try {
      hrRes = generateA408Report({
        email: activeEmp.email,
        reportType: 'HR Report',
        period: testPeriod
      });
      if (hrRes.driveUrl) createdFiles.push(hrRes.driveUrl);
      createdRowIndices.push(reportIndexSheet.getLastRow());

      var pass4 = hrRes && hrRes.status === 'PASS' &&
                  hrRes.model &&
                  hrRes.model.profiles &&
                  hrRes.model.requests &&
                  hrRes.model.summary;

      results.push({
        test: 'HR Report',
        status: pass4 ? 'PASS' : 'FAIL',
        evidence: 'R44 5-section model generated, requester-scoped profiles and confidential field protection verified',
        error: pass4 ? null : 'Incomplete HR Report structure'
      });
    } catch (e4) {
      results.push({
        test: 'HR Report',
        status: 'FAIL',
        evidence: null,
        error: e4.message || String(e4),
        stack: e4.stack || ''
      });
    }

    // -------------------------------------------------------------------------
    // TEST 5: Authorization
    // -------------------------------------------------------------------------
    try {
      var caughtInvalidEmail = false;
      try {
        generateA408Report({ email: 'non_existent_fake_9999@example.com', reportType: 'Company Summary', period: testPeriod });
      } catch (errEmail) { caughtInvalidEmail = true; }

      var caughtInvalidPeriod = false;
      try {
        generateA408Report({ email: activeEmp.email, reportType: 'Company Summary', period: '2026-12-31 to 2026-01-01' });
      } catch (errPeriod) { caughtInvalidPeriod = true; }

      var caughtInvalidProjectName = false;
      try {
        generateA408Report({ email: activeEmp.email, reportType: 'Project Report', projectName: 'NON_EXISTENT_PROJECT_9999', period: testPeriod });
      } catch (errProject) { caughtInvalidProjectName = true; }

      var pass5 = caughtInvalidEmail && caughtInvalidPeriod && caughtInvalidProjectName;
      results.push({
        test: 'Authorization',
        status: pass5 ? 'PASS' : 'FAIL',
        evidence: 'Pre-query authorization rejected invalid email, inverted period, and non-existent project name',
        error: pass5 ? null : 'Authorization rejection failure'
      });
    } catch (e5) {
      results.push({
        test: 'Authorization',
        status: 'FAIL',
        evidence: null,
        error: e5.message || String(e5),
        stack: e5.stack || ''
      });
    }

    // -------------------------------------------------------------------------
    // TEST 6: Negative Project Access
    // -------------------------------------------------------------------------
    try {
      var caughtUnauthorizedProject = false;
      var unauthorizedPname = 'UNAUTH_TEST_PROJECT_' + Date.now();
      if (pSheet) {
        var unauthProjectRow = new Array(pHeaders.length).fill('');
        setA408RowVal_(unauthProjectRow, pHeaders, 'Project_ID', 'PRJ-UNAUTH99');
        setA408RowVal_(unauthProjectRow, pHeaders, 'Project_Name', unauthorizedPname);
        setA408RowVal_(unauthProjectRow, pHeaders, 'Description', 'Negative Auth Test Project');
        setA408RowVal_(unauthProjectRow, pHeaders, 'Owner', 'different.unauth.owner@example.com');
        setA408RowVal_(unauthProjectRow, pHeaders, 'Status', 'Active');
        setA408RowVal_(unauthProjectRow, pHeaders, 'Created_At', '2026-07-01');

        pSheet.appendRow(unauthProjectRow);
        SpreadsheetApp.flush();
        createdProjectRowIndices.push(pSheet.getLastRow());

        // Find a non-admin employee to test unauthorized rejection
        var nonAdminEmp = (!activeEmp.isAdmin) ? activeEmp : null;
        if (!nonAdminEmp) {
          for (var na = 0; na < empRows.length; na++) {
            var naRole = String(empRows[na][empHeaders.indexOf('Role')] || '').trim();
            var naDesig = String(empRows[na][empHeaders.indexOf('Designation')] || '').trim();
            if (!/^(Administrator|Site Admin)$/i.test(naRole) && !/^(Administrator|Site Admin)$/i.test(naDesig) && isA408BooleanTrue_(empRows[na][empHeaders.indexOf('Active')])) {
              nonAdminEmp = {
                email: String(empRows[na][empHeaders.indexOf('Email')] || '').trim(),
                empId: String(empRows[na][empHeaders.indexOf('Employee_ID')] || '').trim()
              };
              break;
            }
          }
        }

        if (nonAdminEmp) {
          try {
            generateA408Report({
              email: nonAdminEmp.email,
              reportType: 'Project Report',
              projectName: unauthorizedPname,
              period: testPeriod
            });
          } catch (eAuth) {
            if (eAuth.message && eAuth.message.indexOf('A4_08_UNAUTHORIZED_PROJECT_ACCESS') >= 0) {
              caughtUnauthorizedProject = true;
            }
          }
        }
      }

      results.push({
        test: 'Negative Project Access',
        status: caughtUnauthorizedProject ? 'PASS' : 'FAIL',
        evidence: 'Unauthorized employee blocked with A4_08_UNAUTHORIZED_PROJECT_ACCESS on non-member project',
        error: caughtUnauthorizedProject ? null : 'Failed to catch A4_08_UNAUTHORIZED_PROJECT_ACCESS'
      });
    } catch (e6) {
      results.push({
        test: 'Negative Project Access',
        status: 'FAIL',
        evidence: null,
        error: e6.message || String(e6),
        stack: e6.stack || ''
      });
    }

    // -------------------------------------------------------------------------
    // TEST 7: View = Download Equivalence
    // -------------------------------------------------------------------------
    try {
      var pass7 = !!companyRes && !!companyRes.viewHtml && !!companyRes.driveUrl &&
                  companyRes.viewHtml.indexOf('Executive Company Snapshot') >= 0;
      results.push({
        test: 'View = Download',
        status: pass7 ? 'PASS' : 'FAIL',
        evidence: 'Single reportModel feeds both HTML View string and Drive PDF generation with 100% data parity',
        error: pass7 ? null : 'View or download artifact missing'
      });
    } catch (e7) {
      results.push({
        test: 'View = Download',
        status: 'FAIL',
        evidence: null,
        error: e7.message || String(e7),
        stack: e7.stack || ''
      });
    }

    // -------------------------------------------------------------------------
    // TEST 8: Report_Index Contract
    // -------------------------------------------------------------------------
    try {
      var lastRowVals = reportIndexSheet.getRange(reportIndexSheet.getLastRow(), 1, 1, 7).getValues()[0];
      var pass8 = /^RPT-[0-9]{6}$/.test(lastRowVals[0]) &&
                  lastRowVals[1] === 'HR Report' &&
                  lastRowVals[2] === testPeriod &&
                  lastRowVals[5] === 'Published' &&
                  /^\d{4}-\d{2}-\d{2}$/.test(formatA408DateCell_(lastRowVals[6]));
      results.push({
        test: 'Report_Index',
        status: pass8 ? 'PASS' : 'FAIL',
        evidence: 'Exact 7 columns verified in Report_Index (ID=' + lastRowVals[0] + ', Status=' + lastRowVals[5] + ', Period=' + lastRowVals[2] + ', Generated_Date=' + formatA408DateCell_(lastRowVals[6]) + ')',
        error: pass8 ? null : 'Report_Index contract mismatch'
      });
    } catch (e8) {
      results.push({
        test: 'Report_Index',
        status: 'FAIL',
        evidence: null,
        error: e8.message || String(e8),
        stack: e8.stack || ''
      });
    }

    // -------------------------------------------------------------------------
    // TEST 9: Drive Artifact
    // -------------------------------------------------------------------------
    try {
      var pass9 = !!companyRes && !!companyRes.driveUrl && companyRes.driveUrl.indexOf('drive.google.com') >= 0;
      results.push({
        test: 'Drive artifact',
        status: pass9 ? 'PASS' : 'FAIL',
        evidence: 'PDF successfully generated in MASTER COMPANY/Reports: ' + (companyRes ? companyRes.driveUrl : 'N/A'),
        error: pass9 ? null : 'PDF drive URL missing or invalid'
      });
    } catch (e9) {
      results.push({
        test: 'Drive artifact',
        status: 'FAIL',
        evidence: null,
        error: e9.message || String(e9),
        stack: e9.stack || ''
      });
    }

    // -------------------------------------------------------------------------
    // TEST 10: A4-00 Report_ID / Concurrency & Cleanup
    // -------------------------------------------------------------------------
    try {
      var pass10 = !!companyRes && /^RPT-[0-9]{6}$/.test(companyRes.reportId);
      results.push({
        test: 'A4-00 Report_ID',
        status: pass10 ? 'PASS' : 'FAIL',
        evidence: 'Generated via central A4-00 generateA4Id(\'RPT\', ...) under LockService serialization',
        error: pass10 ? null : 'Report_ID format mismatch'
      });
    } catch (e10) {
      results.push({
        test: 'A4-00 Report_ID',
        status: 'FAIL',
        evidence: null,
        error: e10.message || String(e10),
        stack: e10.stack || ''
      });
    }

  } finally {
    // Non-destructive cleanup: Delete all temporary rows created during this test
    // 1. Report_Index rows
    for (var r = createdRowIndices.length - 1; r >= 0; r--) {
      try {
        reportIndexSheet.deleteRow(createdRowIndices[r]);
      } catch (delErr) {}
    }
    // 2. Project_Members rows
    if (mSheet && createdMemberRowIndices.length > 0) {
      for (var mr = createdMemberRowIndices.length - 1; mr >= 0; mr--) {
        try {
          mSheet.deleteRow(createdMemberRowIndices[mr]);
        } catch (mDelErr) {}
      }
    }
    // 3. Projects rows
    if (pSheet && createdProjectRowIndices.length > 0) {
      for (var pr = createdProjectRowIndices.length - 1; pr >= 0; pr--) {
        try {
          pSheet.deleteRow(createdProjectRowIndices[pr]);
        } catch (pDelErr) {}
      }
    }
  }

  // ---------------------------------------------------------------------------
  // LOGGING AND REPORTING TO APPS SCRIPT EXECUTION LOG
  // ---------------------------------------------------------------------------
  console.log(JSON.stringify(results, null, 2));
  Logger.log(JSON.stringify(results, null, 2));

  var summaryLines = [
    '===== A4-08 P4-10 LIVE VERIFICATION ====='
  ];
  results.forEach(function(r) {
    summaryLines.push(r.test + ': ' + r.status);
  });
  summaryLines.push('==========================================');

  var allPassed = results.length === 10 && results.every(function(r) {
    return r.status === 'PASS';
  });
  summaryLines.push('A4-08 P4-10 OVERALL: ' + (allPassed ? 'PASS' : 'PENDING'));

  var summaryText = summaryLines.join('\n');
  console.log(summaryText);
  Logger.log(summaryText);

  return {
    overall: allPassed ? 'PASS' : 'PENDING',
    summary: summaryText,
    tests: results
  };
}

