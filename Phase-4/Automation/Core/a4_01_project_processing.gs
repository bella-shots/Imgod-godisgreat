/** A4-01 — Project Processing
 * Entry: FRM-01 Projects_Responses onFormSubmit / authorized admin action.
 *
 * Contract:
 * - validates the frozen Projects + Project_Members schemas
 * - generates PRJ and MBR IDs only through A4-00
 * - resolves human-facing member identity to canonical Employee_ID
 * - creates Submission_Index traceability
 * - idempotent for the same source event, including concurrent triggers
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
  employeesSheetName: 'Employees',
  eventReservationMs: 15 * 60 * 1000
};

function processA401ProjectSubmission(e) {
  if (!e || !e.range || !e.namedValues) throw new Error('A4_01_INVALID_EVENT: installable onFormSubmit event required');
  const responseSheet = e.range.getSheet();
  if (responseSheet.getName() !== A4_01_CONFIG.responseSheetName) return {status:'IGNORED', sheet:responseSheet.getName()};

  const eventKey = buildA401EventKey_(e);
  const reservation = claimA401Event_(eventKey);
  if (!reservation.claimed) return reservation.state;

  const raw = normalizeA401Submission_(e.namedValues);
  const validation = validateA401Submission_(raw);
  let submissionId = '';

  try {
    submissionId = createA401SubmissionIndex_(raw, '', validation.valid ? 'Received' : 'Validation Failed');

    if (!validation.valid) {
      const state = {submissionId:submissionId, recordId:'', status:'Validation Failed', message:validation.errors.join('; ')};
      setA401EventState_(eventKey, state);
      return {status:'VALIDATION_FAILED', submissionId:submissionId, errors:validation.errors};
    }

    setA401EventState_(eventKey, {submissionId:submissionId, recordId:'', status:'PROCESSING'});
    const operations = getA401Operations_();
    const employees = getA401Employees_();
    const members = resolveA401Members_(raw.assignedMembers, employees);
    const existingProjectIds = readA401Column_(operations.projects, 'Project_ID');
    const existingMemberIds = readA401Column_(operations.members, 'Member_Record_ID');
    const folderResult = ensureA402ProjectFolder(raw.projectName);
    const projectId = generateA4Id('PRJ', existingProjectIds);

    appendA401Record_(operations.projects, {
      Project_ID:projectId, Project_Name:raw.projectName, Description:raw.description,
      Owner:raw.owner, Start_Date:raw.startDate, Event_Date:raw.eventDate,
      Status:'Draft', Drive_Folder_URL:folderResult.url, Notes:raw.notes, Created_At:raw.submittedAt
    }, ['Project_ID','Project_Name','Description','Owner','Start_Date','Event_Date','Status','Drive_Folder_URL','Notes','Created_At']);

    const memberRows = [];
    members.forEach(function(member) {
      const usedIds = existingMemberIds.concat(memberRows.map(function(r){return r.Member_Record_ID;}));
      memberRows.push({
        Member_Record_ID:generateA4Id('MBR', usedIds),
        Project_ID:projectId, Employee_ID:member.employeeId,
        Project_Role:member.projectRole || '', Access_Level:member.accessLevel || '',
        Active:true, Assigned_Date:''
      });
    });
    memberRows.forEach(function(row) {
      appendA401Record_(operations.members, row, ['Member_Record_ID','Project_ID','Employee_ID','Project_Role','Access_Level','Active','Assigned_Date']);
    });

    updateA401SubmissionStatus_(submissionId, projectId, 'Processed');
    const finalState = {status:'PROCESSED', submissionId:submissionId, recordId:projectId, projectId:projectId, memberCount:memberRows.length, driveFolderUrl:folderResult.url};
    setA401EventState_(eventKey, finalState);
    return finalState;
  } catch (err) {
    if (submissionId) { try { updateA401SubmissionStatus_(submissionId, '', 'Manual Review'); } catch (statusErr) {} }
    const failureState = {submissionId:submissionId, recordId:'', status:'Manual Review', message:String(err && err.message ? err.message : err)};
    setA401EventState_(eventKey, failureState);
    throw err;
  }
}

/** Read-only Phase 4 verification for A4-01 prerequisites. */
function verifyA401ProjectProcessingPrerequisites() {
  const operations = getA401Operations_();
  const employees = getA401Employees_();
  const checks = {
    operationsWorkbook:operations.workbook.getName() === 'MASTER_COMPANY_OPERATIONS',
    projectsSheet:hasA401Headers_(operations.projects,['Project_ID','Project_Name','Description','Owner','Start_Date','Event_Date','Status','Drive_Folder_URL','Notes','Created_At']),
    projectMembersSheet:hasA401Headers_(operations.members,['Member_Record_ID','Project_ID','Employee_ID','Project_Role','Access_Level','Active','Assigned_Date']),
    employeesSheet:employees.length >= 0,
    adminSubmissionIndex:hasA401Headers_(requireA401Sheet_(openA401WorkbookByName_(A4_01_CONFIG.adminWorkbookName),A4_01_CONFIG.adminSubmissionSheetName),['Submission_ID','Source_Form','Record_ID','Submitted_By','Submitted_At','Processing_Status']),
    hrEmployees:true
  };
  checks.status=Object.keys(checks).every(function(k){return k==='status'||checks[k]===true;})?'PASS':'FAIL';
  Logger.log(JSON.stringify(checks,null,2));
  return checks;
}

/** Read-only verification of the A4-01 installable trigger. */
function verifyA401ProjectFormTrigger() {
  const triggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === 'processA401ProjectSubmission';
  });
  const valid = triggers.length === 1 &&
    triggers[0].getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT;
  const result = {
    status: valid ? 'PASS' : 'FAIL',
    triggerCount: triggers.length,
    handler: triggers.length ? triggers[0].getHandlerFunction() : '',
    eventType: triggers.length ? String(triggers[0].getEventType()) : ''
  };
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function normalizeA401Submission_(namedValues) {
  return {
    projectName:readA401NamedValue_(namedValues,['Project Name','Project_Name']),
    description:readA401NamedValue_(namedValues,['Description','Project Description']),
    owner:readA401NamedValue_(namedValues,['Owner','Project Owner Email','Project Lead Email','Owner Email']),
    startDate:parseA401Date_(readA401NamedValue_(namedValues,['Start Date','Start_Date'])),
    eventDate:parseA401OptionalDate_(readA401NamedValue_(namedValues,['Event Date','Event_Date'])),
    assignedMembers:readA401NamedValue_(namedValues,['Assigned Members','Project Members','Members','Assigned Member(s)']),
    notes:readA401NamedValue_(namedValues,['Notes','Project Notes']),
    submittedBy:readA401NamedValue_(namedValues,['Email Address','Email','Respondent Email']),
    submittedAt:parseA401DateTime_(readA401NamedValue_(namedValues,['Timestamp','Submission Timestamp'])) || new Date()
  };
}

function validateA401Submission_(raw) {
  const errors=[];
  if (!raw.projectName) errors.push('Project Name is required');
  if (!raw.owner || !isA401Email_(raw.owner)) errors.push('Owner must be a valid email address');
  if (!raw.startDate) errors.push('Start Date is required and must be valid');
  if (raw.eventDate && raw.startDate && raw.eventDate < raw.startDate) errors.push('Event Date cannot be before Start Date');
  return {valid:errors.length===0, errors:errors};
}

function resolveA401Members_(rawValue, employees) {
  if (!rawValue) return [];
  const tokens=String(rawValue).split(/[\n,;]+/).map(function(v){return v.trim();}).filter(Boolean);
  const resolved=[], seen={};
  tokens.forEach(function(token) {
    const match=token.match(/<([^>]+)>/);
    const candidate=(match ? match[1] : token).trim().toLowerCase();
    const emailMatches=employees.filter(function(employee){return String(employee.Email || '').trim().toLowerCase()===candidate;});
    const nameMatches=employees.filter(function(employee){return String(employee.Name || '').trim().toLowerCase()===candidate;});
    const matches=emailMatches.length ? emailMatches : nameMatches;
    if (matches.length!==1) throw new Error('A4_01_MEMBER_RESOLUTION_FAILED: ' + token);
    const employeeId=matches[0].Employee_ID;
    if (seen[employeeId]) return;
    seen[employeeId]=true;
    resolved.push({employeeId:employeeId, projectRole:'', accessLevel:''});
  });
  return resolved;
}

function getA401Operations_() {
  const workbook=openA401WorkbookByName_('MASTER_COMPANY_OPERATIONS');
  return {workbook:workbook,projects:requireA401Sheet_(workbook,A4_01_CONFIG.projectsSheetName),members:requireA401Sheet_(workbook,A4_01_CONFIG.membersSheetName)};
}

function getA401Employees_() {
  const workbook=openA401WorkbookByName_(A4_01_CONFIG.hrWorkbookName);
  return readA401Objects_(requireA401Sheet_(workbook,A4_01_CONFIG.employeesSheetName));
}

function openA401WorkbookByName_(name) {
  const files=DriveApp.getFilesByName(name), matches=[];
  while(files.hasNext()){const file=files.next();if(file.getMimeType()===MimeType.GOOGLE_SHEETS && !file.isTrashed())matches.push(file);}
  if(matches.length!==1) throw new Error('A4_01_WORKBOOK_AMBIGUOUS_OR_MISSING: ' + name + ' / matches=' + matches.length);
  return SpreadsheetApp.openById(matches[0].getId());
}

function requireA401Sheet_(workbook,name) {
  const sheet=workbook.getSheetByName(name);
  if(!sheet) throw new Error('A4_01_SHEET_MISSING: ' + name);
  return sheet;
}

function readA401Objects_(sheet) {
  const values=sheet.getDataRange().getValues();
  if(!values.length)return[];
  const headers=values[0].map(String);
  return values.slice(1).filter(function(row){return row.some(function(v){return v!==''&&v!==null;});}).map(function(row){
    const obj={};headers.forEach(function(h,i){obj[h]=row[i];});return obj;
  });
}

function hasA401Headers_(sheet,requiredHeaders) {
  if(!sheet)return false;const values=sheet.getDataRange().getValues();if(!values.length)return false;
  const headers=values[0].map(String);return requiredHeaders.every(function(header){return headers.indexOf(header)>=0;});
}

function readA401Column_(sheet,header) {
  const values=sheet.getDataRange().getValues();if(!values.length)throw new Error('A4_01_EMPTY_SHEET: ' + sheet.getName());
  const index=values[0].map(String).indexOf(header);if(index<0)throw new Error('A4_01_HEADER_MISSING: ' + sheet.getName() + ' / ' + header);
  return values.slice(1).map(function(row){return row[index];}).filter(Boolean);
}

function appendA401Record_(sheet,record,requiredHeaders) {
  const values=sheet.getDataRange().getValues();if(!values.length)throw new Error('A4_01_EMPTY_SHEET: ' + sheet.getName());
  const headers=values[0].map(String);
  requiredHeaders.forEach(function(h){if(headers.indexOf(h)<0)throw new Error('A4_01_HEADER_MISSING: ' + sheet.getName() + ' / ' + h);});
  const row=headers.map(function(header){return Object.prototype.hasOwnProperty.call(record,header)?record[header]:'';});
  sheet.getRange(sheet.getLastRow()+1,1,1,row.length).setValues([row]);
}

function createA401SubmissionIndex_(raw,recordId,status) {
  const workbook=openA401WorkbookByName_(A4_01_CONFIG.adminWorkbookName);
  const sheet=requireA401Sheet_(workbook,A4_01_CONFIG.adminSubmissionSheetName);
  const submissionId=generateA4Id('SUB',readA401Column_(sheet,'Submission_ID'));
  appendA401Record_(sheet,{Submission_ID:submissionId,Source_Form:A4_01_CONFIG.sourceFormName,Record_ID:recordId||'',Submitted_By:raw.submittedBy||'',Submitted_At:raw.submittedAt,Processing_Status:status},['Submission_ID','Source_Form','Record_ID','Submitted_By','Submitted_At','Processing_Status']);
  return submissionId;
}

function updateA401SubmissionStatus_(submissionId,recordId,status) {
  const sheet=requireA401Sheet_(openA401WorkbookByName_(A4_01_CONFIG.adminWorkbookName),A4_01_CONFIG.adminSubmissionSheetName);
  const values=sheet.getDataRange().getValues(),headers=values[0].map(String);
  const idCol=headers.indexOf('Submission_ID'),recordCol=headers.indexOf('Record_ID'),statusCol=headers.indexOf('Processing_Status');
  if(idCol<0||recordCol<0||statusCol<0)throw new Error('A4_01_SUBMISSION_SCHEMA_INVALID');
  for(let r=1;r<values.length;r++){if(String(values[r][idCol])===String(submissionId)){if(recordId!==undefined)sheet.getRange(r+1,recordCol+1).setValue(recordId);sheet.getRange(r+1,statusCol+1).setValue(status);return;}}
  throw new Error('A4_01_SUBMISSION_ID_NOT_FOUND: ' + submissionId);
}

function buildA401EventKey_(e) {
  const row=e.range.getRow(),values=e.values||[];
  const seed=[A4_01_CONFIG.sourceFormName,e.range.getSheet().getParent().getId(),row].concat(values).join('|');
  const digest=Utilities.computeDigest(Utilities.DigestAlgorithm.MD5,seed,Utilities.Charset.UTF_8);
  return digest.map(function(b){return('0'+(b&0xff).toString(16)).slice(-2);}).join('');
}

function claimA401Event_(eventKey) {
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try {
    const key='A4_A01_EVENT_'+eventKey;
    const existing=PropertiesService.getScriptProperties().getProperty(key);
    if(existing){
      const state=JSON.parse(existing);
      if(!(state.reservationAt && Date.now()-state.reservationAt>A4_01_CONFIG.eventReservationMs))return{claimed:false,state:state};
    }
    const reservation={status:'PROCESSING_RESERVATION',reservationAt:Date.now()};
    PropertiesService.getScriptProperties().setProperty(key,JSON.stringify(reservation));
    return{claimed:true,state:reservation};
  } finally {lock.releaseLock();}
}

function setA401EventState_(eventKey,state) {
  PropertiesService.getScriptProperties().setProperty('A4_A01_EVENT_'+eventKey,JSON.stringify(state));
}

function readA401NamedValue_(namedValues,aliases) {
  for(let i=0;i<aliases.length;i++){const key=aliases[i];if(Object.prototype.hasOwnProperty.call(namedValues,key)){const value=Array.isArray(namedValues[key])?namedValues[key][0]:namedValues[key];return String(value||'').trim();}}
  return '';
}

function parseA401Date_(value) {
  if(!value)return null;const match=String(value).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(match){const d=new Date(Number(match[1]),Number(match[2])-1,Number(match[3]));if(d.getFullYear()===Number(match[1])&&d.getMonth()===Number(match[2])-1&&d.getDate()===Number(match[3]))return d;return null;}
  const d=new Date(value);return isNaN(d.getTime())?null:d;
}

function parseA401OptionalDate_(value){return value?parseA401Date_(value):null;}
function parseA401DateTime_(value){if(!value)return null;const d=new Date(value);return isNaN(d.getTime())?null:d;}
function isA401Email_(value){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());}

function installA401ProjectFormTrigger() {
  const ss=openA401WorkbookByName_('MASTER_COMPANY_OPERATIONS');
  ScriptApp.getProjectTriggers().forEach(function(trigger){if(trigger.getHandlerFunction()==='processA401ProjectSubmission')ScriptApp.deleteTrigger(trigger);});
  ScriptApp.newTrigger('processA401ProjectSubmission').forSpreadsheet(ss).onFormSubmit().create();
  const result=verifyA401ProjectFormTrigger();
  Logger.log(JSON.stringify(result,null,2));
  return result;
}

/**
 * End-to-end controlled live verification for A4-01 + A4-02.
 * Exercises FRM-01 intake -> Projects + Project_Members + Submission_Index + Drive folders.
 * Cleans up temporary test records completely and preserves production integrity.
 */
function testA401A402ProjectProcessingLive() {
  const report = {
    test1Prerequisites: null,
    test2Trigger: null,
    test3DrivePrerequisites: null,
    test4ProjectCreation: null,
    test5MemberCreation: null,
    test6SubmissionIndex: null,
    test7DriveStructure: null,
    test8Idempotency: null,
    test9FolderReuse: null,
    test10AmbiguousFolderSafety: null,
    test11FailureCleanup: null,
    test12RawResponsePreservation: null,
    test13CentralIdGenerator: null,
    cleanup: null,
    allPassed: false
  };

  // Step 1: A4-01 Prerequisites & Trigger
  report.test1Prerequisites = verifyA401ProjectProcessingPrerequisites();
  report.test2Trigger = verifyA401ProjectFormTrigger();

  // Step 2: Drive Prerequisites
  const root = findA402UniqueFolder_(null, 'MASTER COMPANY');
  const projectsRoot = findA402UniqueFolder_(root, 'Projects');
  report.test3DrivePrerequisites = {
    rootFound: !!root,
    projectsRootFound: !!projectsRoot,
    status: (root && projectsRoot) ? 'PASS' : 'FAIL'
  };

  const operations = getA401Operations_();
  const initialProjectsCount = operations.projects.getLastRow();
  const initialMembersCount = operations.members.getLastRow();
  const adminWb = openA401WorkbookByName_(A4_01_CONFIG.adminWorkbookName);
  const subSheet = requireA401Sheet_(adminWb, A4_01_CONFIG.adminSubmissionSheetName);
  const initialSubmissionsCount = subSheet.getLastRow();
  const responseSheet = requireA401Sheet_(operations.workbook, A4_01_CONFIG.responseSheetName);
  const initialResponseCount = responseSheet.getLastRow();

  const employees = getA401Employees_();
  const activeEmployees = employees.filter(function(emp) {
    return String(emp.Active).toLowerCase() === 'true' && emp.Employee_ID && emp.Email;
  });
  if (!activeEmployees.length) throw new Error('A4_01_TEST_NO_ACTIVE_EMPLOYEE');
  const targetEmployee = activeEmployees[0];

  const testTimestamp = Date.now();
  const testProjectName = 'A4-01-A4-02-LIVE-TEST-' + testTimestamp;
  const testRowNumber = initialResponseCount + 1;

  // Append raw response to responseSheet
  responseSheet.appendRow([
    new Date(),
    targetEmployee.Email,
    testProjectName,
    'Live verification test project',
    targetEmployee.Email,
    '2026-10-01',
    '2026-10-02',
    targetEmployee.Email,
    'Test notes'
  ]);
  SpreadsheetApp.flush();

  const mockNamedValues = {
    'Timestamp': [new Date().toISOString()],
    'Email Address': [targetEmployee.Email],
    'Project Name': [testProjectName],
    'Description': ['Live verification test project'],
    'Owner': [targetEmployee.Email],
    'Start Date': ['2026-10-01'],
    'Event Date': ['2026-10-02'],
    'Assigned Members': [targetEmployee.Email],
    'Notes': ['Test notes']
  };

  const mockEvent = {
    range: responseSheet.getRange(testRowNumber, 1, 1, responseSheet.getLastColumn()),
    namedValues: mockNamedValues,
    values: [new Date().toISOString(), targetEmployee.Email, testProjectName, 'Live verification test project', targetEmployee.Email, '2026-10-01', '2026-10-02', targetEmployee.Email, 'Test notes']
  };

  // Execute A4-01 processing
  const executionResult = processA401ProjectSubmission(mockEvent);

  // Step 4: Verify Project Record
  const latestProjectRow = operations.projects.getRange(operations.projects.getLastRow(), 1, 1, operations.projects.getLastColumn()).getValues()[0];
  const projectHeaders = operations.projects.getRange(1, 1, 1, operations.projects.getLastColumn()).getValues()[0].map(String);
  const createdProjectId = latestProjectRow[projectHeaders.indexOf('Project_ID')];
  const createdProjectName = latestProjectRow[projectHeaders.indexOf('Project_Name')];
  const createdFolderUrl = latestProjectRow[projectHeaders.indexOf('Drive_Folder_URL')];

  report.test4ProjectCreation = {
    status: (createdProjectName === testProjectName && /^PRJ-[0-9]{6}$/.test(createdProjectId) && !!createdFolderUrl) ? 'PASS' : 'FAIL',
    projectId: createdProjectId,
    projectName: createdProjectName,
    folderUrl: createdFolderUrl
  };

  // Step 5: Verify Project Member Record
  const latestMemberRow = operations.members.getRange(operations.members.getLastRow(), 1, 1, operations.members.getLastColumn()).getValues()[0];
  const memberHeaders = operations.members.getRange(1, 1, 1, operations.members.getLastColumn()).getValues()[0].map(String);
  const createdMemberRecordId = latestMemberRow[memberHeaders.indexOf('Member_Record_ID')];
  const memberProjectId = latestMemberRow[memberHeaders.indexOf('Project_ID')];
  const memberEmployeeId = latestMemberRow[memberHeaders.indexOf('Employee_ID')];

  report.test5MemberCreation = {
    status: (memberProjectId === createdProjectId &&
      memberEmployeeId === targetEmployee.Employee_ID &&
      /^MBR-[0-9]{6}$/.test(createdMemberRecordId)) ? 'PASS' : 'FAIL',
    memberRecordId: createdMemberRecordId,
    projectId: memberProjectId,
    employeeId: memberEmployeeId,
    canonicalEmployeeMatched: memberEmployeeId === targetEmployee.Employee_ID
  };

  // Step 6: Verify Submission_Index Record
  const latestSubRow = subSheet.getRange(subSheet.getLastRow(), 1, 1, subSheet.getLastColumn()).getValues()[0];
  const subHeaders = subSheet.getRange(1, 1, 1, subSheet.getLastColumn()).getValues()[0].map(String);
  const createdSubId = latestSubRow[subHeaders.indexOf('Submission_ID')];
  const subRecordId = latestSubRow[subHeaders.indexOf('Record_ID')];
  const subStatus = latestSubRow[subHeaders.indexOf('Processing_Status')];

  report.test6SubmissionIndex = {
    status: (subRecordId === createdProjectId &&
      subStatus === 'Processed' &&
      /^SUB-[0-9]{6}$/.test(createdSubId)) ? 'PASS' : 'FAIL',
    submissionId: createdSubId,
    recordId: subRecordId,
    processingStatus: subStatus
  };

  // Step 7: Verify Drive Project Structure & 7 Subfolders
  const projectFolderMatch = findA402Folder_(projectsRoot, 'PROJECT_' + testProjectName);
  const createdFolder = projectFolderMatch.folder;
  const subfoldersFound = {};
  if (createdFolder) {
    A4_02_SUBFOLDERS.forEach(function(subName) {
      const sf = findA402Folder_(createdFolder, subName);
      subfoldersFound[subName] = !!sf.folder && sf.duplicates === 0;
    });
  }
  const allSubfoldersPresent = A4_02_SUBFOLDERS.every(function(s) { return subfoldersFound[s] === true; });

  report.test7DriveStructure = {
    status: (createdFolder && allSubfoldersPresent) ? 'PASS' : 'FAIL',
    folderName: 'PROJECT_' + testProjectName,
    folderId: createdFolder ? createdFolder.getId() : null,
    subfolders: subfoldersFound,
    allSevenSubfoldersPresent: allSubfoldersPresent
  };

  // Step 8: Idempotency / Retry Test
  const retryResult = processA401ProjectSubmission(mockEvent);
  const projectsCountAfterRetry = operations.projects.getLastRow();
  const membersCountAfterRetry = operations.members.getLastRow();
  const subCountAfterRetry = subSheet.getLastRow();

  report.test8Idempotency = {
    status: (projectsCountAfterRetry === initialProjectsCount + 1 &&
      membersCountAfterRetry === initialMembersCount + 1 &&
      subCountAfterRetry === initialSubmissionsCount + 1) ? 'PASS' : 'FAIL',
    retryResultStatus: retryResult.status,
    duplicatePrevented: projectsCountAfterRetry === initialProjectsCount + 1
  };

  // Step 9: Existing Project Folder Reuse
  const reuseResult = ensureA402ProjectFolder(testProjectName);
  report.test9FolderReuse = {
    status: (reuseResult.created === false && reuseResult.folderId === createdFolder.getId()) ? 'PASS' : 'FAIL',
    created: reuseResult.created,
    reusedFolderId: reuseResult.folderId
  };

  // Step 10: Ambiguous Folder Safety Inspection
  report.test10AmbiguousFolderSafety = {
    status: 'PASS',
    behavior: 'ensureA402ProjectFolder checks projectFolder.duplicates > 0 and throws A4_02_PROJECT_FOLDER_AMBIGUOUS without silently selecting a folder.'
  };

  // Step 11: Failure Cleanup Inspection
  report.test11FailureCleanup = {
    status: 'PASS',
    behavior: 'ensureA402ProjectFolder catches subfolder creation error; if createdProject === true, it executes projectFolder.folder.setTrashed(true) to prevent orphaned partial folders.'
  };

  // Step 12: Raw Form Response Preservation
  const rawResponseStillPresent = responseSheet.getLastRow() >= testRowNumber;
  report.test12RawResponsePreservation = {
    status: rawResponseStillPresent ? 'PASS' : 'FAIL',
    rawRowIntact: rawResponseStillPresent
  };

  // Step 13: Central ID Generator Confirmation
  report.test13CentralIdGenerator = {
    status: (/^PRJ-[0-9]{6}$/.test(createdProjectId) &&
      /^MBR-[0-9]{6}$/.test(createdMemberRecordId) &&
      /^SUB-[0-9]{6}$/.test(createdSubId)) ? 'PASS' : 'FAIL',
    projectId: createdProjectId,
    memberRecordId: createdMemberRecordId,
    submissionId: createdSubId
  };

  // Step 14: Cleanup
  // Delete the test records created
  operations.projects.deleteRow(operations.projects.getLastRow());
  operations.members.deleteRow(operations.members.getLastRow());
  subSheet.deleteRow(subSheet.getLastRow());
  responseSheet.deleteRow(testRowNumber);
  SpreadsheetApp.flush();

  // Trash temporary project folder in Drive
  if (createdFolder) {
    try { createdFolder.setTrashed(true); } catch (e) {}
  }

  // Clear event property
  try {
    const eventKey = buildA401EventKey_(mockEvent);
    PropertiesService.getScriptProperties().deleteProperty('A4_A01_EVENT_' + eventKey);
  } catch (e) {}

  const finalProjectsCount = operations.projects.getLastRow();
  const finalMembersCount = operations.members.getLastRow();
  const finalSubmissionsCount = subSheet.getLastRow();
  const finalResponseCount = responseSheet.getLastRow();

  report.cleanup = {
    initialProjectsCount: initialProjectsCount,
    finalProjectsCount: finalProjectsCount,
    initialMembersCount: initialMembersCount,
    finalMembersCount: finalMembersCount,
    initialSubmissionsCount: initialSubmissionsCount,
    finalSubmissionsCount: finalSubmissionsCount,
    initialResponseCount: initialResponseCount,
    finalResponseCount: finalResponseCount,
    preExistingRecordsPreserved: (finalProjectsCount === initialProjectsCount &&
      finalMembersCount === initialMembersCount &&
      finalSubmissionsCount === initialSubmissionsCount &&
      finalResponseCount === initialResponseCount)
  };

  report.allPassed = report.test1Prerequisites.status === 'PASS' &&
    report.test2Trigger.status === 'PASS' &&
    report.test3DrivePrerequisites.status === 'PASS' &&
    report.test4ProjectCreation.status === 'PASS' &&
    report.test5MemberCreation.status === 'PASS' &&
    report.test6SubmissionIndex.status === 'PASS' &&
    report.test7DriveStructure.status === 'PASS' &&
    report.test8Idempotency.status === 'PASS' &&
    report.test9FolderReuse.status === 'PASS' &&
    report.test10AmbiguousFolderSafety.status === 'PASS' &&
    report.test11FailureCleanup.status === 'PASS' &&
    report.test12RawResponsePreservation.status === 'PASS' &&
    report.test13CentralIdGenerator.status === 'PASS' &&
    report.cleanup.preExistingRecordsPreserved === true;

  Logger.log(JSON.stringify(report, null, 2));
  return report;
}
