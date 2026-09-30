/** A4-01 — Project Processing
 * Entry: FRM-01 Projects_Responses onFormSubmit / authorized admin action.
 *
 * Contract:
 * - validates the frozen Projects + Project_Members schemas
 * - generates PRJ and MBR IDs only through A4-00
 * - resolves human-facing member identity to canonical Employee_ID
 * - creates Submission_Index traceability
 * - is idempotent for the same source event
 * - preserves the raw Form response on failure
 *
 * A4-02 owns Drive project-folder creation.
 */

const A4_01_CONFIG = {
  responseSheetName: 'Projects_Responses',
  projectsSheetName: 'Projects',
  membersSheetName: 'Project_Members',
  sourceFormName: 'FRM-01 Create / Request Project',
  adminWorkbookName: 'MASTER_COMPANY_ADMIN',
  adminSubmissionSheetName: 'Submission_Index',
  hrWorkbookName: 'MASTER_COMPANY_HR_ADMIN',
  employeesSheetName: 'Employees'
};

function processA401ProjectSubmission(e) {
  if (!e || !e.range || !e.namedValues) {
    throw new Error('A4_01_INVALID_EVENT: installable onFormSubmit event required');
  }

  const responseSheet = e.range.getSheet();
  if (responseSheet.getName() !== A4_01_CONFIG.responseSheetName) {
    throw new Error('A4_01_WRONG_SHEET: ' + responseSheet.getName());
  }

  const eventKey = buildA401EventKey_(e);
  const existingEvent = getA401EventState_(eventKey);
  if (existingEvent) {
    return existingEvent;
  }

  const raw = normalizeA401Submission_(e.namedValues);
  const validation = validateA401Submission_(raw);

  // Create the central submission trace before authoritative processing.
  const submissionId = createA401SubmissionIndex_(raw, validation.valid ? '' : '', validation.valid ? 'Received' : 'Validation Failed', eventKey);

  if (!validation.valid) {
    setA401EventState_(eventKey, {
      submissionId: submissionId,
      recordId: '',
      status: 'Validation Failed',
      message: validation.errors.join('; ')
    });
    return {
      status: 'VALIDATION_FAILED',
      submissionId: submissionId,
      errors: validation.errors
    };
  }

  setA401EventState_(eventKey, {
    submissionId: submissionId,
    recordId: '',
    status: 'PROCESSING'
  });

  try {
    const operations = getA401Operations_();
    const employees = getA401Employees_();

    const members = resolveA401Members_(raw.assignedMembers, employees);
    const existingProjectIds = readA401Column_(operations.projects, 'Project_ID');
    const existingMemberIds = readA401Column_(operations.members, 'Member_Record_ID');

    // Validate the project folder before consuming a business ID.
    const folderResult = ensureA402ProjectFolder(raw.projectName);

    const projectId = generateA4Id('PRJ', existingProjectIds);

    const projectRow = {
      Project_ID: projectId,
      Project_Name: raw.projectName,
      Description: raw.description,
      Owner: raw.owner,
      Start_Date: raw.startDate,
      Event_Date: raw.eventDate,
      Status: 'Draft',
      Drive_Folder_URL: folderResult.url,
      Notes: raw.notes,
      Created_At: raw.submittedAt
    };

    appendA401Record_(operations.projects, projectRow, [
      'Project_ID','Project_Name','Description','Owner','Start_Date',
      'Event_Date','Status','Drive_Folder_URL','Notes','Created_At'
    ]);

    const memberRows = [];
    members.forEach(function(member) {
      memberRows.push({
        Member_Record_ID: generateA4Id('MBR', existingMemberIds.concat(memberRows.map(function(r){ return r.Member_Record_ID; }))),
        Project_ID: projectId,
        Employee_ID: member.employeeId,
        Project_Role: member.projectRole || '',
        Access_Level: member.accessLevel || '',
        Active: true,
        Assigned_Date: ''
      });
    });

    memberRows.forEach(function(row) {
      appendA401Record_(operations.members, row, [
        'Member_Record_ID','Project_ID','Employee_ID','Project_Role',
        'Access_Level','Active','Assigned_Date'
      ]);
    });

    updateA401SubmissionStatus_(submissionId, projectId, 'Processed');
    setA401EventState_(eventKey, {
      submissionId: submissionId,
      recordId: projectId,
      status: 'Processed'
    });

    return {
      status: 'PROCESSED',
      submissionId: submissionId,
      projectId: projectId,
      memberCount: memberRows.length,
      driveFolderUrl: folderResult.url
    };
  } catch (err) {
    updateA401SubmissionStatus_(submissionId, '', 'Manual Review');
    setA401EventState_(eventKey, {
      submissionId: submissionId,
      recordId: '',
      status: 'Manual Review',
      message: String(err && err.message ? err.message : err)
    });
    throw err;
  }
}

function normalizeA401Submission_(namedValues) {
  return {
    projectName: readA401NamedValue_(namedValues, ['Project Name','Project_Name']),
    description: readA401NamedValue_(namedValues, ['Description','Project Description']),
    owner: readA401NamedValue_(namedValues, ['Owner','Project Owner Email','Project Lead Email','Owner Email']),
    startDate: parseA401Date_(readA401NamedValue_(namedValues, ['Start Date','Start_Date'])),
    eventDate: parseA401OptionalDate_(readA401NamedValue_(namedValues, ['Event Date','Event_Date'])),
    assignedMembers: readA401NamedValue_(namedValues, ['Assigned Members','Project Members','Members','Assigned Member(s)']),
    notes: readA401NamedValue_(namedValues, ['Notes','Project Notes']),
    submittedBy: readA401NamedValue_(namedValues, ['Email Address','Email','Respondent Email']),
    submittedAt: parseA401DateTime_(readA401NamedValue_(namedValues, ['Timestamp','Submission Timestamp'])) || new Date()
  };
}

function validateA401Submission_(raw) {
  const errors = [];
  if (!raw.projectName) errors.push('Project Name is required');
  if (!raw.owner || !isA401Email_(raw.owner)) errors.push('Owner must be a valid email address');
  if (!raw.startDate) errors.push('Start Date is required and must be valid');
  if (raw.eventDate && raw.startDate && raw.eventDate < raw.startDate) {
    errors.push('Event Date cannot be before Start Date');
  }
  return {valid: errors.length === 0, errors: errors};
}

function resolveA401Members_(rawValue, employees) {
  if (!rawValue) return [];
  const tokens = String(rawValue)
    .split(/[\n,;]+/)
    .map(function(v){ return v.trim(); })
    .filter(Boolean);

  const resolved = [];
  const seen = {};
  tokens.forEach(function(token) {
    const match = token.match(/<([^>]+)>/);
    const candidate = (match ? match[1] : token).trim().toLowerCase();

    const emailMatches = employees.filter(function(e) {
      return String(e.Email || '').trim().toLowerCase() === candidate;
    });
    const nameMatches = employees.filter(function(e) {
      return String(e.Name || '').trim().toLowerCase() === candidate;
    });
    const matches = emailMatches.length ? emailMatches : nameMatches;

    if (matches.length !== 1) {
      throw new Error('A4_01_MEMBER_RESOLUTION_FAILED: ' + token);
    }

    const employeeId = matches[0].Employee_ID;
    if (seen[employeeId]) return;
    seen[employeeId] = true;

    resolved.push({
      employeeId: employeeId,
      projectRole: '',
      accessLevel: ''
    });
  });
  return resolved;
}

function getA401Operations_() {
  const workbook = openA401WorkbookByName_('MASTER_COMPANY_OPERATIONS');
  return {
    workbook: workbook,
    projects: requireA401Sheet_(workbook, A4_01_CONFIG.projectsSheetName),
    members: requireA401Sheet_(workbook, A4_01_CONFIG.membersSheetName)
  };
}

function getA401Employees_() {
  const workbook = openA401WorkbookByName_(A4_01_CONFIG.hrWorkbookName);
  const sheet = requireA401Sheet_(workbook, A4_01_CONFIG.employeesSheetName);
  return readA401Objects_(sheet);
}

function openA401WorkbookByName_(name) {
  const files = DriveApp.getFilesByName(name);
  const matches = [];
  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS) matches.push(file);
  }
  if (matches.length !== 1) {
    throw new Error('A4_01_WORKBOOK_AMBIGUOUS_OR_MISSING: ' + name + ' / matches=' + matches.length);
  }
  return SpreadsheetApp.openById(matches[0].getId());
}

function requireA401Sheet_(workbook, name) {
  const sheet = workbook.getSheetByName(name);
  if (!sheet) throw new Error('A4_01_SHEET_MISSING: ' + name);
  return sheet;
}

function readA401Objects_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (!values.length) return [];
  const headers = values[0].map(String);
  return values.slice(1).filter(function(row){
    return row.some(function(v){ return v !== '' && v !== null; });
  }).map(function(row){
    const obj = {};
    headers.forEach(function(h,i){ obj[h] = row[i]; });
    return obj;
  });
}

function readA401Column_(sheet, header) {
  const values = sheet.getDataRange().getValues();
  if (!values.length) throw new Error('A4_01_EMPTY_SHEET: ' + sheet.getName());
  const index = values[0].map(String).indexOf(header);
  if (index < 0) throw new Error('A4_01_HEADER_MISSING: ' + sheet.getName() + ' / ' + header);
  return values.slice(1).map(function(row){ return row[index]; }).filter(Boolean);
}

function appendA401Record_(sheet, record, requiredHeaders) {
  const range = sheet.getDataRange();
  const values = range.getValues();
  if (!values.length) throw new Error('A4_01_EMPTY_SHEET: ' + sheet.getName());
  const headers = values[0].map(String);

  requiredHeaders.forEach(function(h){
    if (headers.indexOf(h) < 0) throw new Error('A4_01_HEADER_MISSING: ' + sheet.getName() + ' / ' + h);
  });

  const row = headers.map(function(header){
    return Object.prototype.hasOwnProperty.call(record, header) ? record[header] : '';
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);
}

function createA401SubmissionIndex_(raw, recordId, status, eventKey) {
  const workbook = openA401WorkbookByName_(A4_01_CONFIG.adminWorkbookName);
  const sheet = requireA401Sheet_(workbook, A4_01_CONFIG.adminSubmissionSheetName);
  const existingIds = readA401Column_(sheet, 'Submission_ID');
  const submissionId = generateA4Id('SUB', existingIds);

  appendA401Record_(sheet, {
    Submission_ID: submissionId,
    Source_Form: A4_01_CONFIG.sourceFormName,
    Record_ID: recordId || '',
    Submitted_By: raw.submittedBy || '',
    Submitted_At: raw.submittedAt,
    Processing_Status: status
  }, ['Submission_ID','Source_Form','Record_ID','Submitted_By','Submitted_At','Processing_Status']);

  return submissionId;
}

function updateA401SubmissionStatus_(submissionId, recordId, status) {
  const workbook = openA401WorkbookByName_(A4_01_CONFIG.adminWorkbookName);
  const sheet = requireA401Sheet_(workbook, A4_01_CONFIG.adminSubmissionSheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(String);
  const idCol = headers.indexOf('Submission_ID');
  const recordCol = headers.indexOf('Record_ID');
  const statusCol = headers.indexOf('Processing_Status');
  if (idCol < 0 || recordCol < 0 || statusCol < 0) throw new Error('A4_01_SUBMISSION_SCHEMA_INVALID');

  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idCol]) === String(submissionId)) {
      if (recordId !== undefined) sheet.getRange(r + 1, recordCol + 1).setValue(recordId);
      sheet.getRange(r + 1, statusCol + 1).setValue(status);
      return;
    }
  }
  throw new Error('A4_01_SUBMISSION_ID_NOT_FOUND: ' + submissionId);
}

function buildA401EventKey_(e) {
  const row = e.range.getRow();
  const values = e.values || [];
  const seed = [A4_01_CONFIG.sourceFormName, e.range.getSheet().getParent().getId(), row].concat(values).join('|');
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, seed, Utilities.Charset.UTF_8);
  return digest.map(function(b){ return ('0' + (b & 0xff).toString(16)).slice(-2); }).join('');
}

function getA401EventState_(eventKey) {
  const value = PropertiesService.getScriptProperties().getProperty('A4_A01_EVENT_' + eventKey);
  return value ? JSON.parse(value) : null;
}

function setA401EventState_(eventKey, state) {
  PropertiesService.getScriptProperties().setProperty(
    'A4_A01_EVENT_' + eventKey,
    JSON.stringify(state)
  );
}

function readA401NamedValue_(namedValues, aliases) {
  for (let i = 0; i < aliases.length; i++) {
    const key = aliases[i];
    if (Object.prototype.hasOwnProperty.call(namedValues, key)) {
      const value = Array.isArray(namedValues[key]) ? namedValues[key][0] : namedValues[key];
      return String(value || '').trim();
    }
  }
  return '';
}

function parseA401Date_(value) {
  if (!value) return null;
  const match = String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    if (d.getFullYear() === Number(match[1]) && d.getMonth() === Number(match[2]) - 1 && d.getDate() === Number(match[3])) return d;
    return null;
  }
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function parseA401OptionalDate_(value) {
  return value ? parseA401Date_(value) : null;
}

function parseA401DateTime_(value) {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function isA401Email_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function installA401ProjectFormTrigger() {
  const ss = SpreadsheetApp.openById(
    DriveApp.getFilesByName('MASTER_COMPANY_OPERATIONS').next().getId()
  );
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'processA401ProjectSubmission') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger('processA401ProjectSubmission')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
  return {status:'PASS', trigger:'processA401ProjectSubmission'};
}
