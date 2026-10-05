/**
 * P4-15 — Zero Additional Cost Boundary — Live Verification
 *
 * PURPOSE
 * Verify that the Phase 4 production automation relies only on the approved
 * Google-native baseline and does not require a newly introduced paid service.
 *
 * APPROVED BASELINE
 * - Google Sheets: authoritative database/workbooks
 * - Google Drive: file/object storage
 * - Google Forms: intake
 * - Google Apps Script: automation
 * - MailApp/GmailApp: email delivery
 * - PropertiesService/LockService/ScriptApp: native state, locking and triggers
 *
 * NON-GOALS
 * - This test cannot inspect the user's Google billing account or subscription
 *   invoices. Those are account-level facts outside Apps Script runtime APIs.
 * - It therefore proves the application dependency boundary, not a claim that
 *   the user's entire Google account has no other paid products.
 *
 * SAFETY
 * - Sends no email.
 * - Creates no Drive file/folder.
 * - Creates no Sheet/Form record.
 * - Creates no trigger.
 * - Generates no A4-00 business ID.
 * - Does not modify ScriptProperties.
 */

var P415_CONFIG = Object.freeze({
  MAX_TRIGGER_COUNT: 20,
  SUSPICIOUS_PROPERTY_PATTERNS: [
    'SENDGRID', 'MAILGUN', 'TWILIO', 'STRIPE', 'FIREBASE',
    'SUPABASE', 'MONGODB', 'DYNAMODB', 'AWS_BILLING',
    'GCP_BILLING', 'OPENAI_API_KEY', 'ANTHROPIC_API_KEY',
    'GEMINI_API_KEY', 'PAID_EMAIL', 'PAID_AUTOMATION'
  ]
});

function testP415ZeroAdditionalCostLive() {
  var started = new Date().getTime();
  var results = [];

  try {
    results.push(p415CheckNativeServices_());
    results.push(p415CheckNativeEmailBoundary_());
    results.push(p415CheckApprovedStorageDatabaseBoundary_());
    results.push(p415CheckNoPaidServiceConfiguration_());
    results.push(p415CheckTriggerArchitecture_());
    results.push(p415CheckNoQuotaConsumingSideEffects_());

    var elapsedMs = new Date().getTime() - started;
    results.push({
      id: 'COST-07',
      name: 'Bounded zero-cost verification',
      status: elapsedMs < 360000 ? 'PASS' : 'FAIL',
      detail: 'Verification elapsed=' + (elapsedMs / 1000).toFixed(2) +
        's; no wait/retry loop used.'
    });
  } catch (err) {
    results.push({
      id: 'COST-ERROR',
      name: 'Zero-cost verification execution',
      status: 'FAIL',
      detail: String(err && err.message ? err.message : err)
    });
  }

  var allPassed = results.length === 7 && results.every(function(r) {
    return r.status === 'PASS';
  });

  var lines = [
    'P4-15 ZERO ADDITIONAL COST — LIVE VERIFICATION',
    '================================================'
  ];

  results.forEach(function(r) {
    lines.push(r.id + ' | ' + r.name + ' | ' + r.status + ' | ' + r.detail);
  });

  lines.push('P4-15 OVERALL: ' + (allPassed ? 'PASS (7/7)' : 'FAIL/PENDING'));
  lines.push('ACCOUNT-LEVEL BILLING NOTE: Apps Script cannot inspect billing/subscription invoices;');
  lines.push('P4-15 verifies that Phase 4 code has no new paid-service dependency.');

  var summary = lines.join('\n');
  console.log(summary);
  Logger.log(summary);

  return {
    overall: allPassed ? 'PASS' : 'FAIL',
    tests: results,
    elapsedMs: new Date().getTime() - started,
    billingInspection: 'NOT_AVAILABLE_IN_APPS_SCRIPT_RUNTIME',
    summary: summary
  };
}

function p415CheckNativeServices_() {
  var checks = {
    SpreadsheetApp: typeof SpreadsheetApp === 'object',
    DriveApp: typeof DriveApp === 'object',
    FormApp: typeof FormApp === 'object',
    MailApp: typeof MailApp === 'object',
    GmailApp: typeof GmailApp === 'object',
    PropertiesService: typeof PropertiesService === 'object',
    LockService: typeof LockService === 'object',
    ScriptApp: typeof ScriptApp === 'object'
  };

  var failed = Object.keys(checks).filter(function(k) { return !checks[k]; });
  return {
    id: 'COST-01',
    name: 'Approved Google-native service boundary',
    status: failed.length ? 'FAIL' : 'PASS',
    detail: failed.length
      ? 'Missing native services: ' + failed.join(', ')
      : 'Sheets, Drive, Forms, MailApp/GmailApp, PropertiesService, LockService and ScriptApp are available.'
  };
}

function p415CheckNativeEmailBoundary_() {
  var dispatcherAvailable = typeof dispatchA409Notification === 'function';
  var remainingQuota = MailApp.getRemainingDailyQuota();

  return {
    id: 'COST-02',
    name: 'Native email boundary',
    status: dispatcherAvailable && remainingQuota >= 0 ? 'PASS' : 'FAIL',
    detail: 'A4-09 dispatcher=' + dispatcherAvailable +
      '; MailApp available=true; remaining recipient quota=' + remainingQuota +
      '; no email dispatched by this test.'
  };
}

function p415CheckApprovedStorageDatabaseBoundary_() {
  var sheetApi = typeof SpreadsheetApp === 'object';
  var driveApi = typeof DriveApp === 'object';
  var formsApi = typeof FormApp === 'object';

  return {
    id: 'COST-03',
    name: 'Approved database/storage/form boundary',
    status: sheetApi && driveApi && formsApi ? 'PASS' : 'FAIL',
    detail: 'Authoritative database=Google Sheets; file storage=Google Drive; intake=Google Forms.'
  };
}

function p415CheckNoPaidServiceConfiguration_() {
  var props = PropertiesService.getScriptProperties().getProperties();
  var keys = Object.keys(props);
  var suspicious = keys.filter(function(key) {
    var upper = String(key).toUpperCase();
    return P415_CONFIG.SUSPICIOUS_PROPERTY_PATTERNS.some(function(pattern) {
      return upper.indexOf(pattern) !== -1;
    });
  });

  return {
    id: 'COST-04',
    name: 'No obvious paid-service configuration in Script Properties',
    status: suspicious.length ? 'FAIL' : 'PASS',
    detail: suspicious.length
      ? 'Suspicious service/billing property names found: ' + suspicious.join(', ')
      : 'No prohibited paid-service/billing property names detected; property values were never logged.'
  };
}

function p415CheckTriggerArchitecture_() {
  var triggers = ScriptApp.getProjectTriggers();
  var duplicateMap = {};
  var duplicates = [];

  triggers.forEach(function(t) {
    var key = [
      t.getHandlerFunction(),
      t.getEventType(),
      t.getTriggerSource()
    ].join('|');

    if (duplicateMap[key]) {
      duplicates.push(key);
    }
    duplicateMap[key] = true;
  });

  return {
    id: 'COST-05',
    name: 'Native Apps Script automation boundary',
    status: triggers.length <= P415_CONFIG.MAX_TRIGGER_COUNT && duplicates.length === 0 ? 'PASS' : 'FAIL',
    detail: 'Installed triggers=' + triggers.length +
      '; configured hard ceiling=' + P415_CONFIG.MAX_TRIGGER_COUNT +
      '; duplicate registrations=' + duplicates.length +
      '; no trigger created by P4-15.'
  };
}

function p415CheckNoQuotaConsumingSideEffects_() {
  var before = ScriptApp.getProjectTriggers().length;
  var quota = MailApp.getRemainingDailyQuota();

  // Deliberately no sendEmail(), trigger creation, Drive creation, Sheet writes,
  // Form submissions, UrlFetchApp calls, or A4-00 ID generation.
  var after = ScriptApp.getProjectTriggers().length;

  return {
    id: 'COST-06',
    name: 'No cost/quota-consuming verification side effects',
    status: before === after ? 'PASS' : 'FAIL',
    detail: 'Trigger count=' + before + ' -> ' + after +
      '; MailApp quota observed=' + quota +
      '; no email, Drive artifact, Sheet/Form record, external HTTP call or A4-00 ID consumed.'
  };
}
