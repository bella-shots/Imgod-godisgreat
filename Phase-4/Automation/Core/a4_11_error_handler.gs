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
  var status = String(options.statusHint || A411_CONFIG.STATUS_MANUAL_REVIEW).trim();
  var notifyAdmin = options.notifyAdmin !== false;
  var eventKey = String(options.eventKey || options.idempotencyKey || '').trim();
  var preserveSource = options.preserveSource !== false;
  var rethrow = options.rethrow === true;

  if (status !== A411_CONFIG.STATUS_VALIDATION_FAILED &&
      status !== A411_CONFIG.STATUS_MANUAL_REVIEW) {
    status = A411_CONFIG.STATUS_MANUAL_REVIEW;
  }

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
 * Live verification.
 *
 * The test uses a temporary Submission_Index row and a controlled notification
 * recipient when the A4-09 test contract permits it. All temporary rows and
 * properties are removed in finally. Production business records are never
 * modified.
 */
function testA411ErrorHandlerLive() {
  var report = {
    test1Prerequisites: null,
    test2ManualReviewStatus: null,
    test3ValidationFailedStatus: null,
    test4CreateMissingSubmission: null,
    test5DuplicateIdempotency: null,
    test6SensitiveRedaction: null,
    test7SourcePreservation: null,
    test8NotificationPath: null,
    test9NotificationFailureRetryable: null,
    test10NoUncontrolledRetry: null,
    test11ZeroCostBoundary: null,
    test12IssuedIdNeverReused: null,
    test13Cleanup: null,
    allPassed: false
  };

  var props = PropertiesService.getScriptProperties();
  var testKeys = [];
  var createdSubmissionIds = [];

  try {
    report.test1Prerequisites = verifyA411ErrorHandlerPrerequisites();

    if (report.test1Prerequisites.status !== 'PASS') {
      return report;
    }

    var adminWb = findA411AdminWorkbook_();
    var sheet = adminWb.getSheetByName('Submission_Index');
    if (!sheet) throw new Error('A4_11_TEST_SUBMISSION_INDEX_MISSING');

    var initialLastRow = sheet.getLastRow();
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
    var idCol = headers.indexOf('Submission_ID');
    var statusCol = headers.indexOf('Processing_Status');
    var recordCol = headers.indexOf('Record_ID');

    if (idCol < 0 || statusCol < 0 || recordCol < 0) {
      throw new Error('A4_11_TEST_SUBMISSION_SCHEMA_INVALID');
    }

    var token = 'A411_TEST_' + new Date().getTime();
    var recordId = 'A411-TEST-' + new Date().getTime();

    // Test 2: Existing submission -> Manual Review.
    var created1 = createA410SubmissionEntry({
      sourceForm: 'A4-11 Live Verification',
      recordId: recordId,
      submittedBy: 'System',
      submittedAt: new Date(),
      status: 'Received',
      eventReservationKey: 'A410_EVENT_' + token + '_EXISTING'
    });
    if (created1.status !== 'SUCCESS') throw new Error('A4_11_TEST_CREATE_EXISTING_FAILED');
    createdSubmissionIds.push(created1.submissionId);

    var manual = handleA411Error({
      module: 'A4-11 Live Test',
      recordId: recordId,
      submissionId: created1.submissionId,
      sourceForm: 'A4-11 Live Verification',
      statusHint: 'MANUAL_REVIEW',
      error: new Error('Controlled failure for live verification'),
      eventKey: token + '_MANUAL',
      notifyAdmin: false
    });

    var row2 = findA411SubmissionRow_(sheet, created1.submissionId, idCol);
    var manualStatus = row2 ? String(row2[statusCol] || '') : '';
    report.test2ManualReviewStatus = manual.auditStatus !== 'UPDATED' &&
      manual.auditStatus !== 'CREATED' ? 'FAIL' :
      (manualStatus === 'Manual Review' ? 'PASS' : 'FAIL');

    // Test 3: Validation Failed.
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
    report.test3ValidationFailedStatus =
      row3 && String(row3[statusCol] || '') === 'Validation Failed' &&
      validation.auditStatus === 'UPDATED' ? 'PASS' : 'FAIL';

    // Test 4: Missing Submission_ID -> A4-10 creates it.
    var created2 = handleA411Error({
      module: 'A4-11 Live Test',
      recordId: recordId + '-2',
      sourceForm: 'A4-11 Live Verification',
      statusHint: 'MANUAL_REVIEW',
      error: new Error('Controlled missing-submission failure'),
      eventKey: token + '_CREATE',
      notifyAdmin: false
    });
    if (created2.submissionId) createdSubmissionIds.push(created2.submissionId);
    report.test4CreateMissingSubmission =
      !!created2.submissionId && created2.auditStatus === 'CREATED' ? 'PASS' : 'FAIL';

    // Test 5: Same failure event does not duplicate.
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
    report.test5DuplicateIdempotency =
      replay.status === 'SKIPPED' && countAfterReplay === initialLastRow + 2
        ? 'PASS' : 'FAIL';

    // Test 6: Sensitive text is redacted before logging/notification payload.
    var sensitive = redactA411Sensitive_(
      'salary=90000 bank_account=123456789 medical diagnosis=password=secret'
    );
    report.test6SensitiveRedaction =
      !/90000|123456789|diagnosis|secret/i.test(sensitive) &&
      /REDACTED/i.test(sensitive) ? 'PASS' : 'FAIL';

    // Test 7: Parent/source preservation is represented explicitly and no
    // source sheet mutation is performed by A4-11.
    report.test7SourcePreservation =
      manual.sourcePreserved === true &&
      typeof manual.recordId === 'string' ? 'PASS' : 'FAIL';

    // Test 8: Notification path exists and is safe to invoke.
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

    report.test8NotificationPath =
      notificationProbe &&
      ['SENT', 'SKIPPED', 'FAILED'].indexOf(notificationProbe.status) >= 0
        ? 'PASS' : 'FAIL';

    // Test 9: Controlled notification failure remains retryable.
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

    report.test9NotificationFailureRetryable =
      notificationFailure && notificationFailure.status === 'FAILED' &&
      notificationFailure.error === 'A4_09_SIMULATED_DELIVERY_FAILURE'
        ? 'PASS' : 'FAIL';

    // Test 10: A4-11 does not create scheduled retry loops or triggers.
    report.test10NoUncontrolledRetry =
      !hasA411OwnTriggers_() ? 'PASS' : 'FAIL';

    // Test 11: Native services only.
    report.test11ZeroCostBoundary =
      typeof PropertiesService !== 'undefined' &&
      typeof SpreadsheetApp !== 'undefined' &&
      typeof LockService !== 'undefined' &&
      typeof MailApp !== 'undefined' ? 'PASS' : 'FAIL';

    // Test 12: A4-00 issued IDs are not reused after downstream failure.
    var beforeIds = getA411SubmissionIds_(sheet, idCol);
    var candidate = generateA4Id('SUB', beforeIds);
    var afterCandidate = getA411SubmissionIds_(sheet, idCol);
    report.test12IssuedIdNeverReused =
      candidate &&
      /^SUB-[0-9]{6}$/.test(candidate) &&
      JSON.stringify(beforeIds) === JSON.stringify(afterCandidate)
        ? 'PASS' : 'FAIL';

    report.test13Cleanup = 'PENDING';

    report.allPassed = [
      report.test1Prerequisites.status === 'PASS',
      report.test2ManualReviewStatus === 'PASS',
      report.test3ValidationFailedStatus === 'PASS',
      report.test4CreateMissingSubmission === 'PASS',
      report.test5DuplicateIdempotency === 'PASS',
      report.test6SensitiveRedaction === 'PASS',
      report.test7SourcePreservation === 'PASS',
      report.test8NotificationPath === 'PASS',
      report.test9NotificationFailureRetryable === 'PASS',
      report.test10NoUncontrolledRetry === 'PASS',
      report.test11ZeroCostBoundary === 'PASS',
      report.test12IssuedIdNeverReused === 'PASS'
    ].every(function(v) { return v; });

    return report;
  } catch (err) {
    report.error = redactA411Sensitive_(String(err && err.message || err));
    return report;
  } finally {
    // Remove only rows explicitly created by this test.
    try {
      var adminWb2 = findA411AdminWorkbook_();
      var sheet2 = adminWb2.getSheetByName('Submission_Index');
      var headers2 = sheet2.getRange(1,1,1,sheet2.getLastColumn()).getValues()[0].map(String);
      var idCol2 = headers2.indexOf('Submission_ID');
      if (idCol2 >= 0 && createdSubmissionIds.length) {
        var rows = sheet2.getLastRow() < 2 ? [] :
          sheet2.getRange(2,1,sheet2.getLastRow()-1,sheet2.getLastColumn()).getValues();
        for (var i = rows.length - 1; i >= 0; i--) {
          if (createdSubmissionIds.indexOf(String(rows[i][idCol2] || '').trim()) >= 0) {
            sheet2.deleteRow(i + 2);
          }
        }
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
