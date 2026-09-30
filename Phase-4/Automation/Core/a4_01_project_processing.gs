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
  if (responseSheet.getName() !== A4_01_CONFIG.responseSheetName) throw new Error('A4_01_WRONG_SHEET: ' + responseSheet.getName());

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
  while(files.hasNext()){const file=files.next();if(file.getMimeType()===MimeType.GOOGLE_SHEETS)matches.push(file);}
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
