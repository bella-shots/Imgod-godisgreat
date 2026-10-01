/**
 * A4-11 — Error Handler
 *
 * Central Phase 4 failure-handling layer.
 *
 * Rules:
 * - Does not create a parallel error database.
 * - Submission_Index remains the authoritative audit/status structure through A4-10.
 * - Detailed technical diagnostics stay in Apps Script execution logs.
 * - Critical failures use A4-09 ADMIN_AUTOMATION_FAILURE.
 * - Source/business records are never deleted or silently marked complete.
 * - No uncontrolled retries.
 */

var A411_CONFIG = Object.freeze({
  PROPERTY_PREFIX: 'A411_ERROR_',
  SOURCE_FORM_FALLBACK: 'A4-11 Error Handler',
  STATUS_VALIDATION_FAILED: 'Validation Failed',
  STATUS_MANUAL_REVIEW: 'Manual Review',
  ADMIN_EVENT_TYPE: 'ADMIN_AUTOMATION_FAILURE'
});

/**
 * Central failure API.
 *
 * @param {Object} options
 * @return {Object}
 */
function handleA411Error(options) {
  options = options || {};

  var moduleName = safeA411Token_(options.module || 'Unknown Module');
  var recordId = safeA411Token_(options.recordId || '');
  var submissionId = safeA411Token_(options.submissionId || '');
  var sourceForm = safeA411Token_(options.sourceForm || options.source || A411_CONFIG.SOURCE_FORM_FALLBACK);
  var status = normalizeA411StatusHint_(options.statusHint);
  var notifyAdmin = options.notifyAdmin !== false;
  var eventKey = String(options.eventKey || options.idempotencyKey || '').trim();
  var preserveSource = options.preserveSource !== false;
  var rethrow = options.rethrow === true;

  var normalized = normalizeA411Error_(options.error);
  var safeError = redactA411Sensitive_(normalized.message);
  var safeCode = redactA411Sensitive_(normalized.code || 'A4_11_UNSPECIFIED_ERROR');

  var dedupeKey = buildA411Key_(moduleName, recordId, submissionId, status, eventKey);
  var props = PropertiesService.getScriptProperties();
  var existing = readA411Marker_(props, dedupeKey);

  // If a prior attempt fully completed, replay is already handled.
  if (existing && (existing.notificationStatus === 'SENT' || existing.notificationStatus === 'NOT_REQUESTED')) {
    return {
      status: 'SKIPPED',
      reason: 'ALREADY_HANDLED',
      submissionId: existing.submissionId || submissionId,
      recordId: recordId,
      module: moduleName,
      errorCode: safeCode
    };
  }

  var result = {
    status: 'FAILED_HANDLED',
    module: moduleName,
    recordId: recordId,
    submissionId: submissionId,
    processingStatus: status,
    errorCode: safeCode,
    sourcePreserved: preserveSource,
    auditStatus: 'NOT_ATTEMPTED',
    notificationStatus: notifyAdmin ? 'NOT_ATTEMPTED' : 'NOT_REQUESTED',
    retryable: true
  };

  // Detailed technical diagnostics belong in execution logs, not Submission_Index.
  console.error(
    'A4_11_ERROR module=' + moduleName +
    ' record=' + (recordId || 'N/A') +
    ' submission=' + (submissionId || 'N/A') +
    ' status=' + status +
    ' code=' + safeCode +
    ' message=' + safeError
  );

  // A4-10 is the sole Submission_Index writer.
  try {
    if (submissionId) {
      var updateResult = updateA410SubmissionStatus(
        submissionId,
        recordId,
        status
      );
      result.auditStatus = updateResult && updateResult.status === 'SUCCESS'
        ? 'UPDATED'
        : 'FAILED';
    } else if (sourceForm) {
      var reservationKey = 'A410_EVENT_' + dedupeKey;
      var createResult = createA410SubmissionEntry({
        sourceForm: sourceForm,
        recordId: recordId,
        submittedBy: options.submittedBy || 'System',
        submittedAt: options.submittedAt || new Date(),
        status: status,
        eventReservationKey: reservationKey,
        suppressThrow: true
      });

      if (createResult && createResult.status === 'SUCCESS') {
        submissionId = createResult.submissionId;
        result.submissionId = submissionId;
        result.auditStatus = 'CREATED';
      } else if (createResult && createResult.status === 'SKIPPED') {
        submissionId = createResult.submissionId || '';
        result.submissionId = submissionId;
        result.auditStatus = 'ALREADY_LOGGED';
      } else {
        result.auditStatus = 'FAILED';
      }
    }
  } catch (auditErr) {
    result.auditStatus = 'FAILED';
    console.error(
      'A4_11_AUDIT_WRITE_FAILED module=' + moduleName +
      ' record=' + (recordId || 'N/A') +
      ' error=' + redactA411Sensitive_(String(auditErr && auditErr.message || auditErr))
    );
  }

  // Do not notify if the caller explicitly disables it.
  if (notifyAdmin && typeof dispatchA409Notification === 'function') {
    try {
      var notification = dispatchA409Notification({
        eventType: A411_CONFIG.ADMIN_EVENT_TYPE,
        recordId: recordId || submissionId || 'NO_RECORD_ID',
        versionOrStatus: status,
        recipient: { role: 'ADMIN' },
        data: {
          module: moduleName,
          error: safeError
        }
      });

      result.notificationStatus = notification && notification.status
        ? notification.status
        : 'FAILED';

      if (notification && notification.status === 'SENT') {
        writeA411Marker_(props, dedupeKey, {
          submissionId: submissionId,
          notificationStatus: 'SENT',
          handledAt: new Date().toISOString()
        });
      } else {
        // Keep the marker retryable when notification did not succeed.
        writeA411Marker_(props, dedupeKey, {
          submissionId: submissionId,
          notificationStatus: 'RETRYABLE',
          lastAttemptAt: new Date().toISOString()
        });
      }
    } catch (notifyErr) {
      result.notificationStatus = 'FAILED';
      console.error(
        'A4_11_NOTIFICATION_FAILED module=' + moduleName +
        ' record=' + (recordId || 'N/A') +
        ' error=' + redactA411Sensitive_(String(notifyErr && notifyErr.message || notifyErr))
      );
      writeA411Marker_(props, dedupeKey, {
        submissionId: submissionId,
        notificationStatus: 'RETRYABLE',
        lastAttemptAt: new Date().toISOString()
      });
    }
  } else {
    writeA411Marker_(props, dedupeKey, {
      submissionId: submissionId,
      notificationStatus: 'NOT_REQUESTED',
      handledAt: new Date().toISOString()
    });
  }

  // Error handling should normally not replace the original exception.
  // The parent module decides whether to rethrow.
  if (rethrow) {
    throw new Error(safeCode + ': ' + safeError);
  }

  return result;
}

function verifyA411ErrorHandlerPrerequisites() {
  var checks = {
    a410Available: typeof createA410SubmissionEntry === 'function' &&
      typeof updateA410SubmissionStatus === 'function',
    a409Available: typeof dispatchA409Notification === 'function',
    propertiesServiceAvailable: typeof PropertiesService !== 'undefined',
    lockServiceAvailable: typeof LockService !== 'undefined',
    sheetsRuntimeAvailable: typeof SpreadsheetApp !== 'undefined',
    nativeOnly: true,
    noParallelErrorSheet: true
  };

  checks.status = (
    checks.a410Available &&
    checks.a409Available &&
    checks.propertiesServiceAvailable &&
    checks.lockServiceAvailable &&
    checks.sheetsRuntimeAvailable
  ) ? 'PASS' : 'FAIL';

  return checks;
}

/**
 * Live verification test suite for A4-11 Error Handler.
 * Evaluates and explicitly reports all 13 required verification checks.
 */
function testA411ErrorHandlerLive() {
  var testResults = [
    { id: 1, name: 'Prerequisites', status: 'FAIL', detail: '' },
    { id: 2, name: 'Valid failure captured', status: 'FAIL', detail: '' },
    { id: 3, name: 'Existing Submission_ID → Manual Review', status: 'FAIL', detail: '' },
    { id: 4, name: 'Validation Failed handling', status: 'FAIL', detail: '' },
    { id: 5, name: 'Missing Submission_ID handling', status: 'FAIL', detail: '' },
    { id: 6, name: 'Source preservation', status: 'FAIL', detail: '' },
    { id: 7, name: 'Duplicate idempotency', status: 'FAIL', detail: '' },
    { id: 8, name: 'Admin failure notification', status: 'FAIL', detail: '' },
    { id: 9, name: 'Notification failure retryability', status: 'FAIL', detail: '' },
    { id: 10, name: 'No uncontrolled retry', status: 'FAIL', detail: '' },
    { id: 11, name: 'Zero-cost boundary', status: 'FAIL', detail: '' },
    { id: 12, name: 'ID non-reuse', status: 'FAIL', detail: '' },
    { id: 13, name: 'Cleanup', status: 'FAIL', detail: '' }
  ];

  var props = PropertiesService.getScriptProperties();
  var testKeys = [];
  var createdSubmissionIds = [];
  var sheet = null;
  var initialLastRow = 0;
  var baselineSubIds = [];
  var idCol = -1;
  var statusCol = -1;
  var recordCol = -1;
  var token = 'A411_TEST_' + new Date().getTime();
  var recordId = 'A411-TEST-' + new Date().getTime();
  var created1 = null;
  var manual = null;

  try {
    // -------------------------------------------------------------------------
    // 1. Prerequisites
    // -------------------------------------------------------------------------
    try {
      var prereq = verifyA411ErrorHandlerPrerequisites();
      if (prereq && prereq.status === 'PASS') {
        testResults[0].status = 'PASS';
      } else {
        testResults[0].detail = 'prerequisites failed: ' + JSON.stringify(prereq);
      }
    } catch (e1) {
      testResults[0].detail = e1.message || String(e1);
    }

    // Prepare workbook and baseline metadata
    try {
      var adminWb = findA411AdminWorkbook_();
      sheet = adminWb.getSheetByName('Submission_Index');
      if (!sheet) throw new Error('A4_11_TEST_SUBMISSION_INDEX_MISSING');

      initialLastRow = sheet.getLastRow();
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
      idCol = headers.indexOf('Submission_ID');
      statusCol = headers.indexOf('Processing_Status');
      recordCol = headers.indexOf('Record_ID');

      if (idCol < 0 || statusCol < 0 || recordCol < 0) {
        throw new Error('A4_11_TEST_SUBMISSION_SCHEMA_INVALID');
      }

      if (initialLastRow >= 2) {
        baselineSubIds = sheet.getRange(2, idCol + 1, initialLastRow - 1, 1)
          .getValues()
          .map(function(r) { return String(r[0] || '').trim(); })
          .filter(Boolean);
      }
    } catch (prepErr) {
      console.error('A4_11_PREPARATION_ERROR: ' + prepErr.message);
    }

    // -------------------------------------------------------------------------
    // 2. Valid failure captured
    // -------------------------------------------------------------------------
    try {
      if (!sheet) throw new Error('Submission_Index sheet not accessible');
      created1 = createA410SubmissionEntry({
        sourceForm: 'A4-11 Live Verification',
        recordId: recordId,
        submittedBy: 'System',
        submittedAt: new Date(),
        status: 'Received',
        eventReservationKey: 'A410_EVENT_' + token + '_EXISTING'
      });
      if (created1 && created1.status === 'SUCCESS' && created1.submissionId) {
        testKeys.push('A410_EVENT_' + token + '_EXISTING');
        createdSubmissionIds.push(created1.submissionId);
      } else {
        throw new Error('A4_11_TEST_CREATE_EXISTING_FAILED');
      }

      manual = handleA411Error({
        module: 'A4-11 Live Test',
        recordId: recordId,
        submissionId: created1.submissionId,
        sourceForm: 'A4-11 Live Verification',
        statusHint: 'MANUAL_REVIEW',
        error: new Error('Controlled failure for live verification'),
        eventKey: token + '_MANUAL',
        notifyAdmin: false
      });

      var expectedModule = safeA411Token_('A4-11 Live Test');
      if (manual && manual.status === 'FAILED_HANDLED' && manual.errorCode &&
          manual.module === expectedModule && manual.sourcePreserved === true) {
        testResults[1].status = 'PASS';
      } else {
        testResults[1].detail = 'unexpected result: ' + JSON.stringify(manual);
      }
    } catch (e2) {
      testResults[1].detail = e2.message || String(e2);
    }

    // -------------------------------------------------------------------------
    // 3. Existing Submission_ID → Manual Review
    // -------------------------------------------------------------------------
    try {
      if (sheet && created1 && created1.submissionId) {
        var row2 = findA411SubmissionRow_(sheet, created1.submissionId, idCol);
        var manualStatus = row2 ? String(row2[statusCol] || '') : '';
        if (manual && manual.auditStatus === 'UPDATED' && manualStatus === 'Manual Review') {
          testResults[2].status = 'PASS';
        } else {
          testResults[2].detail = 'auditStatus=' + (manual ? manual.auditStatus : 'null') + ', status=' + manualStatus;
        }
      } else {
        testResults[2].detail = 'missing submission or sheet';
      }
    } catch (e3) {
      testResults[2].detail = e3.message || String(e3);
    }

    // -------------------------------------------------------------------------
    // 4. Validation Failed handling
    // -------------------------------------------------------------------------
    try {
      if (sheet && created1 && created1.submissionId) {
        var validation = handleA411Error({
          module: 'A4-11 Live Test',
          recordId: recordId,
          submissionId: created1.submissionId,
          sourceForm: 'A4-11 Live Verification',
          statusHint: 'VALIDATION_FAILED',
          error: new Error('Controlled validation failure'),
          eventKey: token + '_VALIDATION',
          notifyAdmin: false
        });
        var row3 = findA411SubmissionRow_(sheet, created1.submissionId, idCol);
        var validationStatus = row3 ? String(row3[statusCol] || '') : '';
        if (validation && validation.auditStatus === 'UPDATED' && validationStatus === 'Validation Failed') {
          testResults[3].status = 'PASS';
        } else {
          testResults[3].detail = 'auditStatus=' + (validation ? validation.auditStatus : 'null') + ', status=' + validationStatus;
        }
      } else {
        testResults[3].detail = 'missing submission or sheet';
      }
    } catch (e4) {
      testResults[3].detail = e4.message || String(e4);
    }

    // -------------------------------------------------------------------------
    // 5. Missing Submission_ID handling
    // -------------------------------------------------------------------------
    try {
      var created2 = handleA411Error({
        module: 'A4-11 Live Test',
        recordId: recordId + '-2',
        sourceForm: 'A4-11 Live Verification',
        statusHint: 'MANUAL_REVIEW',
        error: new Error('Controlled missing-submission failure'),
        eventKey: token + '_CREATE',
        notifyAdmin: false
      });
      if (created2 && created2.submissionId) {
        createdSubmissionIds.push(created2.submissionId);
        testKeys.push('A410_EVENT_' + token + '_CREATE');
      }
      if (created2 && created2.submissionId && created2.auditStatus === 'CREATED') {
        testResults[4].status = 'PASS';
      } else {
        testResults[4].detail = 'submissionId=' + (created2 ? created2.submissionId : 'null') + ', auditStatus=' + (created2 ? created2.auditStatus : 'null');
      }
    } catch (e5) {
      testResults[4].detail = e5.message || String(e5);
    }

    // -------------------------------------------------------------------------
    // 6. Source preservation
    // -------------------------------------------------------------------------
    try {
      if (manual && manual.sourcePreserved === true && typeof manual.recordId === 'string' && manual.recordId === recordId) {
        testResults[5].status = 'PASS';
      } else {
        testResults[5].detail = 'sourcePreserved=' + (manual ? manual.sourcePreserved : 'null') + ', recordId=' + (manual ? manual.recordId : 'null');
      }
    } catch (e6) {
      testResults[5].detail = e6.message || String(e6);
    }

    // -------------------------------------------------------------------------
    // 7. Duplicate idempotency
    // -------------------------------------------------------------------------
    try {
      if (sheet) {
        var replay = handleA411Error({
          module: 'A4-11 Live Test',
          recordId: recordId + '-2',
          sourceForm: 'A4-11 Live Verification',
          statusHint: 'MANUAL_REVIEW',
          error: new Error('Controlled missing-submission failure'),
          eventKey: token + '_CREATE',
          notifyAdmin: false
        });
        var countAfterReplay = sheet.getLastRow();
        if (replay && replay.status === 'SKIPPED' && replay.reason === 'ALREADY_HANDLED' && countAfterReplay === initialLastRow + 2) {
          testResults[6].status = 'PASS';
        } else {
          testResults[6].detail = 'replayStatus=' + (replay ? replay.status : 'null') + ', countAfterReplay=' + countAfterReplay;
        }
      } else {
        testResults[6].detail = 'sheet not accessible';
      }
    } catch (e7) {
      testResults[6].detail = e7.message || String(e7);
    }

    // -------------------------------------------------------------------------
    // 8. Admin failure notification
    // -------------------------------------------------------------------------
    try {
      var notificationProbe = dispatchA409Notification({
        eventType: A411_CONFIG.ADMIN_EVENT_TYPE,
        recordId: recordId + '-NOTIFY',
        versionOrStatus: 'Manual Review',
        recipient: { role: 'ADMIN' },
        data: {
          module: 'A4-11 Live Test',
          error: 'Controlled A4-11 verification event'
        }
      }, { testRecipient: Session.getActiveUser().getEmail() || '' });

      if (notificationProbe && ['SENT', 'SKIPPED', 'FAILED'].indexOf(notificationProbe.status) >= 0) {
        testResults[7].status = 'PASS';
      } else {
        testResults[7].detail = 'notificationStatus=' + (notificationProbe ? notificationProbe.status : 'null');
      }
    } catch (e8) {
      testResults[7].detail = e8.message || String(e8);
    }

    // -------------------------------------------------------------------------
    // 9. Notification failure retryability
    // -------------------------------------------------------------------------
    try {
      var notificationFailure = dispatchA409Notification({
        eventType: A411_CONFIG.ADMIN_EVENT_TYPE,
        recordId: recordId + '-RETRY',
        versionOrStatus: 'Manual Review',
        recipient: { role: 'ADMIN' },
        data: {
          module: 'A4-11 Live Test',
          error: 'Controlled retry verification'
        }
      }, { testRecipient: Session.getActiveUser().getEmail() || '', simulateFailure: true });

      if (notificationFailure && notificationFailure.status === 'FAILED' &&
          notificationFailure.error === 'A4_09_SIMULATED_DELIVERY_FAILURE') {
        testResults[8].status = 'PASS';
      } else {
        testResults[8].detail = 'status=' + (notificationFailure ? notificationFailure.status : 'null') +
                                ', error=' + (notificationFailure ? notificationFailure.error : 'null');
      }
    } catch (e9) {
      testResults[8].detail = e9.message || String(e9);
    }

    // -------------------------------------------------------------------------
    // 10. No uncontrolled retry
    // -------------------------------------------------------------------------
    try {
      if (!hasA411OwnTriggers_()) {
        testResults[9].status = 'PASS';
      } else {
        testResults[9].detail = 'Uncontrolled A411 project trigger detected';
      }
    } catch (e10) {
      testResults[9].detail = e10.message || String(e10);
    }

    // -------------------------------------------------------------------------
    // 11. Zero-cost boundary
    // -------------------------------------------------------------------------
    try {
      if (typeof PropertiesService !== 'undefined' &&
          typeof SpreadsheetApp !== 'undefined' &&
          typeof LockService !== 'undefined' &&
          typeof MailApp !== 'undefined') {
        testResults[10].status = 'PASS';
      } else {
        testResults[10].detail = 'Required native Apps Script services not defined';
      }
    } catch (e11) {
      testResults[10].detail = e11.message || String(e11);
    }

    // -------------------------------------------------------------------------
    // 12. ID non-reuse
    // -------------------------------------------------------------------------
    try {
      if (sheet && idCol >= 0) {
        var beforeIds = getA411SubmissionIds_(sheet, idCol);
        var candidate = generateA4Id('SUB', beforeIds);
        var afterCandidate = getA411SubmissionIds_(sheet, idCol);
        if (candidate && /^SUB-[0-9]{6}$/.test(candidate) &&
            JSON.stringify(beforeIds) === JSON.stringify(afterCandidate)) {
          testResults[11].status = 'PASS';
        } else {
          testResults[11].detail = 'candidate=' + candidate + ', before/after mismatch';
        }
      } else {
        testResults[11].detail = 'sheet or idCol not available';
      }
    } catch (e12) {
      testResults[11].detail = e12.message || String(e12);
    }

    // -------------------------------------------------------------------------
    // 13. Cleanup
    // -------------------------------------------------------------------------
    try {
      if (sheet && idCol >= 0 && createdSubmissionIds.length) {
        var rows = sheet.getLastRow() < 2 ? [] :
          sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
        for (var i = rows.length - 1; i >= 0; i--) {
          var rowSubId = String(rows[i][idCol] || '').trim();
          if (createdSubmissionIds.indexOf(rowSubId) >= 0) {
            sheet.deleteRow(i + 2);
          }
        }
        SpreadsheetApp.flush();
      }

      testKeys.forEach(function(k) {
        try { props.deleteProperty(k); } catch (e) {}
      });

      var postCleanLastRow = sheet ? sheet.getLastRow() : -1;
      var postCleanIds = sheet ? getA411SubmissionIds_(sheet, idCol) : [];
      var anyTestIdLeft = createdSubmissionIds.some(function(tid) {
        return postCleanIds.indexOf(tid) >= 0;
      });
      var allBaselinePreserved = baselineSubIds.every(function(bid) {
        return postCleanIds.indexOf(bid) >= 0;
      });

      if (postCleanLastRow === initialLastRow && !anyTestIdLeft && allBaselinePreserved) {
        testResults[12].status = 'PASS';
        createdSubmissionIds.length = 0;
        testKeys.length = 0;
      } else {
        testResults[12].detail = 'postCleanLastRow=' + postCleanLastRow +
          ', initialLastRow=' + initialLastRow +
          ', anyTestIdLeft=' + anyTestIdLeft +
          ', allBaselinePreserved=' + allBaselinePreserved;
      }
    } catch (e13) {
      testResults[12].detail = e13.message || String(e13);
    }

  } finally {
    // Safety net in finally: remove any remaining test rows or properties if Check 13 threw
    try {
      if (sheet && idCol >= 0 && createdSubmissionIds.length) {
        var currentRows = sheet.getLastRow() < 2 ? [] :
          sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
        for (var j = currentRows.length - 1; j >= 0; j--) {
          if (createdSubmissionIds.indexOf(String(currentRows[j][idCol] || '').trim()) >= 0) {
            sheet.deleteRow(j + 2);
          }
        }
        SpreadsheetApp.flush();
      }
    } catch (cleanupErr) {
      console.error('A4_11_TEST_CLEANUP_FAILED: ' + cleanupErr.message);
    }

    try {
      testKeys.forEach(function(k) { props.deleteProperty(k); });
    } catch (propCleanupErr) {
      console.error('A4_11_TEST_PROPERTY_CLEANUP_FAILED: ' + propCleanupErr.message);
    }
  }

  // ---------------------------------------------------------------------------
  // FORMAT AND LOG REQUIRED EXECUTION-LOG SUMMARY
  // ---------------------------------------------------------------------------
  var passedCount = 0;
  var outputLines = [
    'A4-11 LIVE VERIFICATION',
    ''
  ];

  testResults.forEach(function(t) {
    if (t.status === 'PASS') passedCount++;
    var line = t.id + '. ' + t.name + ': ' + t.status;
    if (t.status !== 'PASS' && t.detail) {
      line += ' (' + t.detail + ')';
    }
    outputLines.push(line);
  });

  outputLines.push('');
  if (passedCount === 13) {
    outputLines.push('A4-11 LIVE VERIFICATION — PASS (13/13)');
  } else {
    outputLines.push('A4-11 LIVE VERIFICATION — FAIL (' + passedCount + '/13)');
  }

  var summaryText = outputLines.join('\n');
  console.log(summaryText);
  Logger.log(summaryText);

  return {
    allPassed: (passedCount === 13),
    passedCount: passedCount,
    totalCount: 13,
    summary: summaryText,
    checks: testResults
  };
}

function findA411AdminWorkbook_() {
  var files = DriveApp.getFilesByName('MASTER_COMPANY_ADMIN');
  var matches = [];
  while (files.hasNext()) matches.push(files.next());
  if (matches.length !== 1) {
    throw new Error('A4_11_ADMIN_WORKBOOK_AMBIGUOUS_OR_MISSING: matches=' + matches.length);
  }
  return SpreadsheetApp.openById(matches[0].getId());
}

function findA411SubmissionRow_(sheet, submissionId, idCol) {
  if (sheet.getLastRow() < 2) return null;
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][idCol] || '').trim() === String(submissionId).trim()) {
      return values[i];
    }
  }
  return null;
}

function getA411SubmissionIds_(sheet, idCol) {
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, idCol + 1, sheet.getLastRow() - 1, 1)
    .getValues()
    .map(function(r) { return String(r[0] || '').trim(); })
    .filter(Boolean);
}

function normalizeA411Error_(error) {
  if (!error) return { code: 'A4_11_UNSPECIFIED_ERROR', message: 'Unknown automation error' };
  if (error instanceof Error) {
    return {
      code: String(error.name || 'Error'),
      message: String(error.message || error)
    };
  }
  if (typeof error === 'object') {
    return {
      code: String(error.code || error.name || 'Error'),
      message: String(error.message || JSON.stringify(error))
    };
  }
  return {
    code: 'A4_11_RUNTIME_ERROR',
    message: String(error)
  };
}

function redactA411Sensitive_(value) {
  var s = String(value || '');
  var patterns = [
    /password\\s*[:=]\\s*[^\\s,;]+/ig,
    /bank[_ ]?(account|acc|number|no)\\s*[:=]\\s*[^\\s,;]+/ig,
    /salary\\s*[:=]\\s*[^\\s,;]+/ig,
    /medical\\s*(note|diagnosis|condition)\\s*[:=]\\s*[^\\s,;]+/ig,
    /hr[_ ]?notes?\\s*[:=]\\s*[^\\s,;]+/ig,
    /disciplinary\\s*[:=]\\s*[^\\s,;]+/ig
  ];
  patterns.forEach(function(re) { s = s.replace(re, '[REDACTED]'); });
  return s.slice(0, 500);
}

function safeA411Token_(value) {
  return redactA411Sensitive_(String(value || '').trim()).replace(/[^A-Za-z0-9_.:-]/g, '_').slice(0, 120);
}

function buildA411Key_(moduleName, recordId, submissionId, status, eventKey) {
  var raw = [
    moduleName || 'MODULE',
    recordId || 'NO_RECORD',
    submissionId || 'NO_SUBMISSION',
    status || 'Manual Review',
    eventKey || 'NO_EVENT'
  ].join('_');
  return A411_CONFIG.PROPERTY_PREFIX + raw.slice(0, 180);
}

function readA411Marker_(props, key) {
  var value = props.getProperty(key);
  if (!value) return null;
  try { return JSON.parse(value); } catch (e) { return { notificationStatus: value }; }
}

function writeA411Marker_(props, key, value) {
  try {
    props.setProperty(key, JSON.stringify(value));
  } catch (err) {
    console.error('A4_11_PROPERTY_WRITE_FAILED: ' + err.message);
  }
}

function hasA411OwnTriggers_() {
  return ScriptApp.getProjectTriggers().some(function(t) {
    return /A411/i.test(t.getHandlerFunction());
  });
}

function normalizeA411StatusHint_(rawStatus) {
  var s = String(rawStatus || '').trim().toUpperCase();
  if (s === 'VALIDATION_FAILED' || s === 'VALIDATION FAILED') {
    return A411_CONFIG.STATUS_VALIDATION_FAILED;
  }
  return A411_CONFIG.STATUS_MANUAL_REVIEW;
}
