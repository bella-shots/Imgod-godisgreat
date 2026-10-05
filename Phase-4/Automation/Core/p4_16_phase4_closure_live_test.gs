/**
 * P4-16 — Phase 4 Closure live verification
 *
 * Purpose:
 *   Final, non-destructive closure gate for Phase 4.
 *
 * This harness does NOT:
 *   - send email
 *   - create triggers
 *   - create Drive files/folders
 *   - write business records
 *   - generate A4-00 business IDs
 *   - change permissions
 *   - change production configuration
 *
 * P4-16 closes only after this live harness passes and the GitHub
 * acceptance/tracker evidence is updated from that observed result.
 */

function testP416Phase4ClosureLive() {
  var startedAt = new Date().getTime();
  var checks = [];
  var beforeTriggerSignature = getP416TriggerSignature_();
  var beforeTriggerCount = ScriptApp.getProjectTriggers().length;
  var beforePropertyKeys = getP416PropertyKeys_();

  function pass(id, message) {
    checks.push({id: id, status: 'PASS', message: message});
  }

  function fail(id, message) {
    checks.push({id: id, status: 'FAIL', message: message});
  }

  function requireFunction(id, name) {
    if (typeof this[name] === 'function') {
      pass(id, name + ' is available in the live Apps Script project.');
    } else {
      fail(id, name + ' is missing from the live Apps Script project.');
    }
  }

  try {
    // C16-01 — Core production entry points are present in the live project.
    [
      'generateA4Id',
      'processA401ProjectSubmission',
      'processEmployeeSpendingFormSubmit',
      'processOopClaimFormSubmit',
      'processMomFormSubmit',
      'sendMomDistributionEmail',
      'generateA408Report',
      'dispatchA409Notification',
      'createA410SubmissionEntry',
      'handleA411Error',
      'testA413SensitiveAccessLive',
      'testA414QuotaSafeBehaviorLive',
      'testP415ZeroAdditionalCostLive',
      'testA400UniversalIdClosureLive'
    ].forEach(function(name) {
      requireFunction('C16-01', name);
    });

    // C16-02 — Explicit direct-sheet workflows are present.
    [
      'setupEmployeeDirectSheetWorkflow',
      'generateSelectedEmployeeId',
      'generateSelectedProjectMemberId',
      'generateSelectedProjectNoteId',
      'generateSelectedBudgetId',
      'generateSelectedSalaryIds'
    ].forEach(function(name) {
      requireFunction('C16-02', name);
    });

    // C16-03 — Trigger architecture is bounded and duplicate-free.
    var triggers = ScriptApp.getProjectTriggers();
    var seen = {};
    var duplicateCount = 0;

    triggers.forEach(function(trigger) {
      var handler = trigger.getHandlerFunction();
      var sourceId = trigger.getTriggerSourceId ? trigger.getTriggerSourceId() : '';
      var eventType = trigger.getEventType ? String(trigger.getEventType()) : '';
      var key = [handler, sourceId, eventType].join('|');
      if (seen[key]) duplicateCount++;
      seen[key] = true;
    });

    if (triggers.length <= 20 && duplicateCount === 0) {
      pass('C16-03', 'Live triggers are bounded at ' + triggers.length + '/20 with 0 duplicate registrations.');
    } else {
      fail('C16-03', 'Trigger safety failed: installed=' + triggers.length + ', duplicateRegistrations=' + duplicateCount + '.');
    }

    // C16-04 — Native Google boundary remains available.
    var nativeServicesOk =
      typeof SpreadsheetApp !== 'undefined' &&
      typeof DriveApp !== 'undefined' &&
      typeof FormApp !== 'undefined' &&
      typeof MailApp !== 'undefined' &&
      typeof PropertiesService !== 'undefined' &&
      typeof LockService !== 'undefined' &&
      typeof ScriptApp !== 'undefined';

    if (nativeServicesOk) {
      pass('C16-04', 'Approved Google-native Sheets/Drive/Forms/MailApp/Properties/Lock/Script services are available.');
    } else {
      fail('C16-04', 'One or more required approved Google-native services are unavailable.');
    }

    // C16-05 — Closure execution itself is bounded.
    var elapsed = new Date().getTime() - startedAt;
    if (elapsed < 360000) {
      pass('C16-05', 'Closure verification elapsed ' + (elapsed / 1000).toFixed(2) + ' seconds; bounded below 360 seconds.');
    } else {
      fail('C16-05', 'Closure verification exceeded the 360-second execution boundary.');
    }

    // C16-06 — No side effects from this closure harness.
    var afterTriggerCount = ScriptApp.getProjectTriggers().length;
    var afterTriggerSignature = getP416TriggerSignature_();
    var afterPropertyKeys = getP416PropertyKeys_();

    var triggerUnchanged =
      beforeTriggerCount === afterTriggerCount &&
      beforeTriggerSignature === afterTriggerSignature;

    var propertyUnchanged =
      beforePropertyKeys.join('|') === afterPropertyKeys.join('|');

    if (triggerUnchanged && propertyUnchanged) {
      pass('C16-06', 'Closure harness produced no trigger or ScriptProperties side effects.');
    } else {
      fail(
        'C16-06',
        'Closure harness changed trigger/property state: triggers ' +
        beforeTriggerCount + ' -> ' + afterTriggerCount +
        ', propertiesChanged=' + (!propertyUnchanged) + '.'
      );
    }

    // C16-07 — Final readiness boundary.
    var failed = checks.filter(function(check) {
      return check.status !== 'PASS';
    });

    if (failed.length === 0) {
      pass(
        'C16-07',
        'All Phase 4 live closure invariants passed. Documentation closure may proceed; Phase 5 remains the next phase.'
      );
    } else {
      fail(
        'C16-07',
        'Phase 4 closure blocked because ' + failed.length + ' live closure check(s) failed.'
      );
    }

    var finalElapsed = new Date().getTime() - startedAt;
    var finalFailed = checks.filter(function(check) {
      return check.status !== 'PASS';
    });

    var result = {
      overall: finalFailed.length === 0 ? 'PASS' : 'FAIL',
      checkCount: 7,
      passed: checks.filter(function(check) { return check.status === 'PASS'; }).length,
      failed: finalFailed.length,
      checks: checks,
      triggerCountBefore: beforeTriggerCount,
      triggerCountAfter: afterTriggerCount,
      duplicateTriggerRegistrations: duplicateCount,
      elapsedSeconds: Number((finalElapsed / 1000).toFixed(2)),
      nonDestructive: triggerUnchanged && propertyUnchanged
    };

    Logger.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    var failure = {
      overall: 'FAIL',
      checkCount: 7,
      passed: checks.filter(function(check) { return check.status === 'PASS'; }).length,
      failed: checks.length + 1,
      error: String(error && error.message ? error.message : error),
      checks: checks,
      triggerCountBefore: beforeTriggerCount,
      triggerCountAfter: ScriptApp.getProjectTriggers().length,
      nonDestructive: false
    };
    Logger.log(JSON.stringify(failure, null, 2));
    throw error;
  }
}

function getP416TriggerSignature_() {
  return ScriptApp.getProjectTriggers()
    .map(function(trigger) {
      var handler = trigger.getHandlerFunction();
      var sourceId = trigger.getTriggerSourceId ? trigger.getTriggerSourceId() : '';
      var eventType = trigger.getEventType ? String(trigger.getEventType()) : '';
      return [handler, sourceId, eventType].join('|');
    })
    .sort()
    .join('||');
}

function getP416PropertyKeys_() {
  var properties = PropertiesService.getScriptProperties().getProperties();
  return Object.keys(properties).sort();
}
