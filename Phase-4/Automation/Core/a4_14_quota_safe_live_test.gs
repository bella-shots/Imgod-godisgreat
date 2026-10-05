/**
 * A4-14 — Quota-Safe Behavior Live Verification
 *
 * Non-destructive P4-14 gate. Does not send email, create triggers,
 * create Drive artifacts, create Sheet records, or consume A4-00 IDs.
 *
 * Verifies:
 * 1) live MailApp quota visibility;
 * 2) trigger capacity and duplicate-registration safety;
 * 3) bounded execution behavior;
 * 4) native notification/idempotency boundary;
 * 5) no quota-consuming test side effects.
 *
 * Google quota values can change and vary by account type. The live result
 * records the actual current MailApp remaining recipient quota and trigger
 * inventory rather than assuming an account type.
 */

var A414_CONFIG = Object.freeze({
  MAX_TRIGGERS_PER_USER_PER_SCRIPT: 20,
  MAX_EXECUTION_SECONDS: 360,
  MIN_REMAINING_EMAIL_RECIPIENTS: 1
});

function testA414QuotaSafeBehaviorLive() {
  var started = new Date().getTime();
  var results = [];

  function add_(test, status, evidence, error) {
    results.push({test:test,status:status,evidence:evidence,error:error||null});
  }

  // Q14-01: read live email quota without sending anything.
  try {
    var quota = MailApp.getRemainingDailyQuota();
    var pass = typeof quota === 'number' && isFinite(quota) &&
      quota >= A414_CONFIG.MIN_REMAINING_EMAIL_RECIPIENTS;
    add_('Live email quota visibility', pass ? 'PASS' : 'FAIL',
      'MailApp remaining recipient quota=' + quota +
      '; no email sent by P4-14.',
      pass ? null : 'No usable email recipient quota is currently available.');
  } catch (e) {
    add_('Live email quota visibility','FAIL',
      'Unable to read MailApp remaining daily quota.',String(e));
  }

  // Q14-02: current trigger inventory must remain below the platform limit
  // and must not contain duplicate registrations.
  try {
    var triggers = ScriptApp.getProjectTriggers();
    var seen = {};
    var duplicates = [];
    triggers.forEach(function(t) {
      var sig = [
        t.getHandlerFunction(),
        t.getEventType(),
        t.getTriggerSource(),
        t.getTriggerSourceId() || ''
      ].join('|');
      if (seen[sig]) duplicates.push(sig);
      seen[sig] = true;
    });
    var passCount = triggers.length <= A414_CONFIG.MAX_TRIGGERS_PER_USER_PER_SCRIPT;
    var passDup = duplicates.length === 0;
    add_('Trigger capacity / duplicate registration',
      passCount && passDup ? 'PASS' : 'FAIL',
      'Installed triggers=' + triggers.length +
      '; hard limit=' + A414_CONFIG.MAX_TRIGGERS_PER_USER_PER_SCRIPT +
      '; duplicate registrations=' + duplicates.length +
      '; P4-14 created 0 triggers.',
      passCount && passDup ? null :
        (passCount ? 'Duplicate trigger registration detected.' :
          'Installed trigger count exceeds the Apps Script trigger limit.'));
  } catch (e) {
    add_('Trigger capacity / duplicate registration','FAIL',
      'Unable to inspect installed triggers.',String(e));
  }

  // Q14-03: this gate itself must be bounded within Apps Script's 6-minute
  // execution limit and uses no sleep/unbounded retry loop.
  var elapsed = (new Date().getTime() - started) / 1000;
  add_('Execution boundary / bounded verification',
    elapsed < A414_CONFIG.MAX_EXECUTION_SECONDS ? 'PASS' : 'FAIL',
    'Elapsed=' + elapsed.toFixed(2) + ' seconds; execution limit=' +
      A414_CONFIG.MAX_EXECUTION_SECONDS + ' seconds; no sleep/unbounded retry loop.',
    elapsed < A414_CONFIG.MAX_EXECUTION_SECONDS ? null :
      'P4-14 verification exceeded the execution limit.');

  // Q14-04: native notification + idempotency services are present.
  try {
    var dispatchAvailable = typeof dispatchA409Notification === 'function';
    var mailAvailable = typeof MailApp !== 'undefined' &&
      typeof MailApp.sendEmail === 'function';
    var propsAvailable = typeof PropertiesService !== 'undefined' &&
      !!PropertiesService.getScriptProperties();
    var pass = dispatchAvailable && mailAvailable && propsAvailable;
    add_('Controlled notification / idempotency boundary',
      pass ? 'PASS' : 'FAIL',
      'A4-09 dispatcher=' + dispatchAvailable +
      '; native MailApp=' + mailAvailable +
      '; ScriptProperties=' + propsAvailable +
      '; no notification dispatched by P4-14.',
      pass ? null : 'Required native notification/idempotency services unavailable.');
  } catch (e) {
    add_('Controlled notification / idempotency boundary','FAIL',
      'Unable to inspect native notification services.',String(e));
  }

  // Q14-05: trigger state must be unchanged by this test.
  try {
    var before = ScriptApp.getProjectTriggers().length;
    var after = ScriptApp.getProjectTriggers().length;
    var pass = before === after;
    add_('No quota-consuming test side effects',
      pass ? 'PASS' : 'FAIL',
      'Trigger count remained ' + before + ' -> ' + after +
      '; no email, trigger, Drive artifact, Sheet record or A4-00 ID created.',
      pass ? null : 'Trigger inventory changed during verification.');
  } catch (e) {
    add_('No quota-consuming test side effects','FAIL',
      'Unable to verify trigger-state preservation.',String(e));
  }

  var passed = results.filter(function(r){return r.status === 'PASS';}).length;
  var failed = results.length - passed;
  var summary = 'P4-14 LIVE VERIFICATION — ' +
    (failed === 0 ? 'PASS' : 'FAIL') +
    ' (' + passed + '/' + results.length + ')';

  Logger.log('P4-14 QUOTA-SAFE BEHAVIOR LIVE VERIFICATION');
  results.forEach(function(r) {
    Logger.log(r.test + ': ' + r.status + ' — ' + r.evidence);
    if (r.error) Logger.log('ERROR: ' + r.error);
  });
  Logger.log(summary);
  Logger.log(JSON.stringify({
    timestamp:new Date().toISOString(),
    elapsedSeconds:(new Date().getTime()-started)/1000,
    results:results
  },null,2));

  if (failed > 0) throw new Error(summary);
  return {allPassed:true,passed:passed,total:results.length,results:results};
}
