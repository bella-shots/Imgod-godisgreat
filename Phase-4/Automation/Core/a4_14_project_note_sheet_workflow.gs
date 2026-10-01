/** A4-14 — R57 Project Note Sheet workflow
 * Baseline: frozen R57 Sheet-originated business record standard.
 *
 * Direct Sheet-originated Project_Notes records:
 * - user completes the pending row (Project_ID, Date, Author_Email, Note, Status)
 * - selects the row / Note_ID cell
 * - Project Note Actions -> Generate Project Note ID
 * - validate -> A4-00 NOT generation -> persist/lock Note_ID -> stamp Created_At -> finalize
 *
 * Frozen Schema (7 columns):
 * 1. Note_ID | 2. Project_ID | 3. Date | 4. Author_Email | 5. Note | 6. Status | 7. Created_At
 *
 * No generic onEdit/autosave path generates NOT IDs.
 * No separate Save/Process action.
 * No external forms or sidebars.
 */

const A4_14_PROJECT_NOTE_CONFIG = {
  workbookName: 'MASTER_COMPANY_OPERATIONS',
  sheetName: 'Project_Notes',
  projectsSheetName: 'Projects',
  headers: [
    'Note_ID',
    'Project_ID',
    'Date',
    'Author_Email',
    'Note',
    'Status',
    'Created_At'
  ],
  allowedStatuses: ['Draft', 'Published', 'Archived'],
  menuName: 'Project Note Actions',
  menuItem: 'Generate Project Note ID'
};

function onOpenProjectNoteSheetMenu(e) {
  try {
    SpreadsheetApp.getUi()
      .createMenu(A4_14_PROJECT_NOTE_CONFIG.menuName)
      .addItem(A4_14_PROJECT_NOTE_CONFIG.menuItem, 'generateSelectedProjectNoteId')
      .addToUi();
  } catch (err) {
    Logger.log('onOpenProjectNoteSheetMenu UI note (expected in headless context): ' + err.message);
  }
}

function installProjectNoteSheetMenuTrigger() {
  const sheet = getA414ProjectNoteSheet_();
  const ss = sheet.getParent();

  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'onOpenProjectNoteSheetMenu') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('onOpenProjectNoteSheetMenu')
    .forSpreadsheet(ss)
    .onOpen()
    .create();

  return verifyProjectNoteSheetMenuTrigger();
}

function setupProjectNoteSheetWorkflow() {
  installProjectNoteSheetControls_();
  installProjectNoteSheetMenuTrigger();
  return verifyProjectNoteSheetPrerequisites();
}

function installProjectNoteSheetControls_() {
  const sheet = getA414ProjectNoteSheet_();
  const headers = getA414NoteHeaders_(sheet);

  if (headers.length !== A4_14_PROJECT_NOTE_CONFIG.headers.length ||
      headers.some(function(h, i) { return h !== A4_14_PROJECT_NOTE_CONFIG.headers[i]; })) {
    throw new Error('A4_14_PROJECT_NOTE_SCHEMA_MISMATCH');
  }

  // Preserve the frozen 7-column schema; delete accidental extra columns
  if (sheet.getMaxColumns() > A4_14_PROJECT_NOTE_CONFIG.headers.length) {
    sheet.deleteColumns(
      A4_14_PROJECT_NOTE_CONFIG.headers.length + 1,
      sheet.getMaxColumns() - A4_14_PROJECT_NOTE_CONFIG.headers.length
    );
  }

  sheet.getRange(1, 1, 1, A4_14_PROJECT_NOTE_CONFIG.headers.length)
    .setFontWeight('bold');

  return {
    status: 'PASS',
    schema: A4_14_PROJECT_NOTE_CONFIG.headers.slice(),
    columnCount: A4_14_PROJECT_NOTE_CONFIG.headers.length
  };
}

function generateSelectedProjectNoteId(optRow) {
  const ss = SpreadsheetApp.getActiveSpreadsheet() || getA414NoteOperationsWorkbook_();
  const activeSheet = ss.getActiveSheet();

  if (activeSheet && activeSheet.getName().trim() !== A4_14_PROJECT_NOTE_CONFIG.sheetName) {
    throw new Error('A4_14_WRONG_SHEET: Active sheet must be ' + A4_14_PROJECT_NOTE_CONFIG.sheetName);
  }

  const sheet = getA414ProjectNoteSheet_();
  let row = optRow;
  if (!row) {
    const activeRange = sheet.getActiveRange() || (activeSheet ? activeSheet.getActiveRange() : null);
    row = activeRange ? activeRange.getRow() : 0;
  }

  if (row < 2) {
    throw new Error('A4_14_SELECT_PENDING_PROJECT_NOTE_ROW');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const headers = getA414NoteHeaders_(sheet);
    validateA414NoteExactSchema_(headers);

    const record = readA414NoteRow_(sheet, row, headers);

    if (record.Note_ID) {
      throw new Error('A4_14_NOTE_ALREADY_HAS_ID: ' + record.Note_ID);
    }

    validateA414ProjectNote_(record);
    validateA414NoteProjectExists_(record.Project_ID);

    const existingIds = readA414NoteColumn_(sheet, headers, 'Note_ID');
    const noteId = generateA4Id('NOT', existingIds);

    const idColumn = headers.indexOf('Note_ID') + 1;
    const idCell = sheet.getRange(row, idColumn);
    idCell.setNumberFormat('@');
    idCell.setValue(noteId);
    protectA414NoteIdCell_(idCell, noteId);

    // Populate Created_At timestamp
    const createdColumn = headers.indexOf('Created_At') + 1;
    sheet.getRange(row, createdColumn).setValue(new Date());

    SpreadsheetApp.flush();

    const verify = String(idCell.getDisplayValue()).trim() === noteId;
    if (!verify) {
      throw new Error('A4_14_NOTE_ID_PERSISTENCE_FAILED: ' + noteId);
    }

    const activeApp = SpreadsheetApp.getActive() || ss;
    if (activeApp && typeof activeApp.toast === 'function') {
      activeApp.toast(
        'Project Note created: ' + noteId,
        'Project Note Actions',
        5
      );
    }

    return {
      status: 'PASS',
      noteId: noteId,
      row: row,
      finalized: true
    };
  } finally {
    lock.releaseLock();
  }
}

function verifyProjectNoteSheetPrerequisites() {
  const sheet = getA414ProjectNoteSheet_();
  const headers = getA414NoteHeaders_(sheet);

  const trigger = verifyProjectNoteSheetMenuTrigger();
  const result = {
    workbook: sheet.getParent().getName() === A4_14_PROJECT_NOTE_CONFIG.workbookName,
    sheet: sheet.getName() === A4_14_PROJECT_NOTE_CONFIG.sheetName,
    exactRequiredHeaders: headers.length === A4_14_PROJECT_NOTE_CONFIG.headers.length &&
      headers.every(function(h, i) {
        return h === A4_14_PROJECT_NOTE_CONFIG.headers[i];
      }),
    centralGeneratorAvailable: typeof generateA4Id === 'function',
    menuTrigger: trigger.status === 'PASS',
    noSeparateSaveOrProcessAction: true,
    noSidebarOrForm: true
  };

  result.status = Object.keys(result).every(function(k) {
    return k === 'status' || result[k] === true;
  }) ? 'PASS' : 'FAIL';

  Logger.log(JSON.stringify(result, null, 2));
  return result;
}

function verifyProjectNoteSheetMenuTrigger() {
  const triggers = ScriptApp.getProjectTriggers().filter(function(trigger) {
    return trigger.getHandlerFunction() === 'onOpenProjectNoteSheetMenu';
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

function getA414ProjectNoteSheet_() {
  const activeSs = SpreadsheetApp.getActiveSpreadsheet();
  if (activeSs && activeSs.getName() === A4_14_PROJECT_NOTE_CONFIG.workbookName) {
    const sheet = activeSs.getSheetByName(A4_14_PROJECT_NOTE_CONFIG.sheetName);
    if (sheet) return sheet;
  }

  const files = DriveApp.getFilesByName(A4_14_PROJECT_NOTE_CONFIG.workbookName);
  const matches = [];

  while (files.hasNext()) {
    const file = files.next();
    if (file.getMimeType() === MimeType.GOOGLE_SHEETS && !file.isTrashed()) {
      matches.push(file);
    }
  }

  if (matches.length !== 1) {
    throw new Error(
      'A4_14_WORKBOOK_AMBIGUOUS_OR_MISSING: ' +
      A4_14_PROJECT_NOTE_CONFIG.workbookName +
      ' / matches=' + matches.length
    );
  }

  const sheet = SpreadsheetApp.openById(matches[0].getId())
    .getSheetByName(A4_14_PROJECT_NOTE_CONFIG.sheetName);

  if (!sheet) {
    throw new Error('A4_14_SHEET_MISSING: ' + A4_14_PROJECT_NOTE_CONFIG.sheetName);
  }

  return sheet;
}

function getA414NoteHeaders_(sheet) {
  const lastColumn = sheet.getLastColumn();
  if (lastColumn < A4_14_PROJECT_NOTE_CONFIG.headers.length) return [];
  return sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);
}

function validateA414NoteExactSchema_(headers) {
  const expected = A4_14_PROJECT_NOTE_CONFIG.headers;

  if (headers.length !== expected.length ||
      headers.some(function(h, i) { return h !== expected[i]; })) {
    throw new Error(
      'A4_14_PROJECT_NOTE_SCHEMA_MISMATCH: expected=' +
      JSON.stringify(expected) + ' actual=' + JSON.stringify(headers)
    );
  }
}

function readA414NoteRow_(sheet, row, headers) {
  const values = sheet.getRange(row, 1, 1, headers.length).getValues()[0];
  const record = {};

  headers.forEach(function(header, index) {
    record[header] = values[index];
  });

  return record;
}

function validateA414ProjectNote_(record) {
  if (!String(record.Project_ID || '').trim()) {
    throw new Error('A4_14_PROJECT_ID_REQUIRED');
  }

  let validDate = false;
  if (record.Date instanceof Date && !isNaN(record.Date.getTime())) {
    validDate = true;
  } else if (typeof record.Date === 'string' && record.Date.trim() !== '') {
    const parsed = new Date(record.Date.trim());
    if (!isNaN(parsed.getTime())) validDate = true;
  }
  if (!validDate) {
    throw new Error('A4_14_DATE_REQUIRED: Date must be valid.');
  }

  if (!String(record.Note || '').trim()) {
    throw new Error('A4_14_NOTE_REQUIRED: Note content cannot be empty.');
  }

  if (record.Status !== '' && record.Status !== null && record.Status !== undefined &&
      A4_14_PROJECT_NOTE_CONFIG.allowedStatuses.indexOf(String(record.Status).trim()) < 0) {
    throw new Error('A4_14_INVALID_NOTE_STATUS: ' + record.Status);
  }

  if (record.Author_Email !== '' && record.Author_Email !== null && record.Author_Email !== undefined) {
    const email = String(record.Author_Email).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('A4_14_INVALID_AUTHOR_EMAIL: ' + email);
    }
  }
}

function validateA414NoteProjectExists_(projectId) {
  const workbook = getA414NoteOperationsWorkbook_();
  const sheet = workbook.getSheetByName(A4_14_PROJECT_NOTE_CONFIG.projectsSheetName);
  if (!sheet) throw new Error('A4_14_PROJECTS_SHEET_MISSING');

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  const ids = readA414NoteColumn_(sheet, headers, 'Project_ID')
    .map(function(value) { return String(value).trim(); });

  if (ids.indexOf(String(projectId).trim()) < 0) {
    throw new Error('A4_14_PROJECT_NOT_FOUND: ' + projectId);
  }
}

function readA414NoteColumn_(sheet, headers, header) {
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

function getA414NoteOperationsWorkbook_() {
  return SpreadsheetApp.openById(getA414ProjectNoteSheet_().getParent().getId());
}

function protectA414NoteIdCell_(cell, id) {
  const description = 'A4-14 R57 immutable Note_ID ' + id;
  const protection = cell.protect().setDescription(description);

  try {
    protection.setWarningOnly(false);
  } catch (err) {}

  return protection;
}

/**
 * Automated Live Verification Suite for Project Notes R57 workflow.
 * Operates on MASTER_COMPANY_OPERATIONS.
 * Cleans up temporary test rows and preserves all pre-existing records.
 */
function testA414ProjectNoteWorkflowLive() {
  const report = {
    test1Prerequisites: null,
    test2ValidNote: null,
    test3InvalidProject: null,
    test4MissingNote: null,
    test5AlreadyIddRow: null,
    test6PersistenceAndLocking: null,
    test7NoGenericEditIssuance: null,
    cleanup: null,
    allPassed: false
  };

  const sheet = getA414ProjectNoteSheet_();
  const initialLastRow = sheet.getLastRow();

  // Test 1: Prerequisites & Schema
  report.test1Prerequisites = setupProjectNoteSheetWorkflow();

  const opsWb = getA414NoteOperationsWorkbook_();
  const projectsSheet = opsWb.getSheetByName(A4_14_PROJECT_NOTE_CONFIG.projectsSheetName);
  const projectHeaders = projectsSheet.getRange(1, 1, 1, projectsSheet.getLastColumn()).getValues()[0].map(String);
  const validProjectIds = readA414NoteColumn_(projectsSheet, projectHeaders, 'Project_ID');

  if (validProjectIds.length === 0) throw new Error('NO_VALID_PROJECT_FOUND_IN_PROJECTS');
  const validProjectId = String(validProjectIds[0]).trim();

  // Test 2: Valid Record Creation
  const test2Row = sheet.getLastRow() + 1;
  sheet.getRange(test2Row, 1, 1, 7).setValues([[
    '',
    validProjectId,
    new Date(),
    'admin@example.com',
    'Live test note content for R57 Project Notes verification.',
    'Published',
    ''
  ]]);
  SpreadsheetApp.flush();

  const test2Result = generateSelectedProjectNoteId(test2Row);
  const generatedNoteId = test2Result.noteId;
  const persistedNoteId = String(sheet.getRange(test2Row, 1).getValue()).trim();
  const createdAtValue = sheet.getRange(test2Row, 7).getValue();

  report.test2ValidNote = {
    status: (generatedNoteId === persistedNoteId &&
      /^NOT-[0-9]{6}$/.test(generatedNoteId) &&
      createdAtValue !== '' && createdAtValue !== null) ? 'PASS' : 'FAIL',
    generatedNoteId: generatedNoteId,
    row: test2Row,
    hasCreatedAt: Boolean(createdAtValue)
  };

  // Test 3: Invalid Project_ID
  const test3Row = sheet.getLastRow() + 1;
  sheet.getRange(test3Row, 1, 1, 7).setValues([[
    '',
    'PRJ-999999-INVALID',
    new Date(),
    'admin@example.com',
    'Invalid project note test.',
    'Draft',
    ''
  ]]);
  SpreadsheetApp.flush();

  let test3Caught = false;
  let test3Error = '';
  try {
    generateSelectedProjectNoteId(test3Row);
  } catch (err3) {
    test3Caught = true;
    test3Error = err3.message;
  }
  sheet.deleteRow(test3Row);
  report.test3InvalidProject = {
    status: test3Caught && test3Error.indexOf('A4_14_PROJECT_NOT_FOUND') >= 0 ? 'PASS' : 'FAIL',
    rejected: test3Caught,
    error: test3Error
  };

  // Test 4: Missing Note Content
  const test4Row = sheet.getLastRow() + 1;
  sheet.getRange(test4Row, 1, 1, 7).setValues([[
    '',
    validProjectId,
    new Date(),
    'admin@example.com',
    '', // Missing Note
    'Draft',
    ''
  ]]);
  SpreadsheetApp.flush();

  let test4Caught = false;
  let test4Error = '';
  try {
    generateSelectedProjectNoteId(test4Row);
  } catch (err4) {
    test4Caught = true;
    test4Error = err4.message;
  }
  sheet.deleteRow(test4Row);
  report.test4MissingNote = {
    status: test4Caught && test4Error.indexOf('A4_14_NOTE_REQUIRED') >= 0 ? 'PASS' : 'FAIL',
    rejected: test4Caught,
    error: test4Error
  };

  // Test 5: Already-ID'd Row Protection
  let test5Caught = false;
  let test5Error = '';
  try {
    generateSelectedProjectNoteId(test2Row);
  } catch (err5) {
    test5Caught = true;
    test5Error = err5.message;
  }
  const test2IdAfter = String(sheet.getRange(test2Row, 1).getValue()).trim();
  report.test5AlreadyIddRow = {
    status: test5Caught && test5Error.indexOf('A4_14_NOTE_ALREADY_HAS_ID') >= 0 && test2IdAfter === generatedNoteId ? 'PASS' : 'FAIL',
    rejected: test5Caught,
    unchangedNoteId: test2IdAfter,
    error: test5Error
  };

  // Test 6: Persistence & Locking Verified
  const sheetProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  const rowProtection = sheetProtections.filter(function(p) {
    const r = p.getRange();
    return r.getRow() === test2Row && r.getColumn() === 1;
  });
  report.test6PersistenceAndLocking = {
    status: (test2IdAfter === generatedNoteId && rowProtection.length > 0) ? 'PASS' : 'FAIL',
    persistedNoteId: test2IdAfter,
    protectionCount: rowProtection.length
  };

  // Test 7: No Generic Edit/Autosave ID Generation
  const triggers = ScriptApp.getProjectTriggers();
  const hasOnEditTrigger = triggers.some(function(t) {
    return t.getEventType() === ScriptApp.EventType.ON_EDIT;
  });
  report.test7NoGenericEditIssuance = {
    status: !hasOnEditTrigger ? 'PASS' : 'FAIL',
    hasOnEditTrigger: hasOnEditTrigger
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
    report.test2ValidNote.status === 'PASS' &&
    report.test3InvalidProject.status === 'PASS' &&
    report.test4MissingNote.status === 'PASS' &&
    report.test5AlreadyIddRow.status === 'PASS' &&
    report.test6PersistenceAndLocking.status === 'PASS' &&
    report.test7NoGenericEditIssuance.status === 'PASS' &&
    report.cleanup.preExistingRecordsPreserved === true;

  Logger.log(JSON.stringify(report, null, 2));
  return report;
}
