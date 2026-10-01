/** A4-00 — Central ID Generator
 * Frozen contract:
 * - independent six-digit sequence per prefix
 * - LockService serialization
 * - reconcile counter against highest valid existing ID
 * - never reuse an issued ID
 * - no row-position dependence
 * - safe collision detection
 *
 * No business record is written by this module. The caller owns the transaction.
 */

const A4_ID_CONFIG = {
  PRJ: {label:'Project_ID'},
  EMP: {label:'Employee_ID'},
  MBR: {label:'Member_Record_ID'},
  NOT: {label:'Note_ID'},
  BDG: {label:'Budget_ID'},
  SPN: {label:'Spending_ID'},
  CLM: {label:'Claim_ID'},
  SAL: {label:'Salary_Record_ID'},
  MOM: {label:'MOM_ID'},
  INV: {label:'Investment_ID'},
  HRR: {label:'HR_Request_ID'},
  RPT: {label:'Report_ID'},
  SUB: {label:'Submission_ID'}
};

const A4_ID_PROPERTY_PREFIX = 'A4_ID_COUNTER_';
const A4_ID_WIDTH = 6;

function generateA4Id(prefix, existingIds) {
  prefix = normalizeA4Prefix_(prefix);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    const propertyKey = A4_ID_PROPERTY_PREFIX + prefix;
    const stored = parseA4Sequence_(props.getProperty(propertyKey));
    const highestExisting = getHighestA4IdNumber_(prefix, existingIds || []);
    const next = Math.max(stored, highestExisting) + 1;
    const candidate = formatA4Id_(prefix, next);

    if (containsA4Id_(existingIds || [], candidate)) {
      throw new Error('A4_ID_COLLISION: ' + candidate);
    }

    // Issued IDs are consumed permanently, even if the caller later fails
    // to commit the business record. This preserves the no-reuse invariant.
    props.setProperty(propertyKey, String(next));
    return candidate;
  } finally {
    lock.releaseLock();
  }
}

function reconcileA4IdCounter(prefix, existingIds) {
  prefix = normalizeA4Prefix_(prefix);
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    const propertyKey = A4_ID_PROPERTY_PREFIX + prefix;
    const stored = parseA4Sequence_(props.getProperty(propertyKey));
    const highest = getHighestA4IdNumber_(prefix, existingIds || []);
    const reconciled = Math.max(stored, highest);

    // Never move a counter backward; issued IDs must never be reused.
    props.setProperty(propertyKey, String(reconciled));

    return {
      prefix: prefix,
      highestExisting: highest,
      storedCounterBefore: stored,
      storedCounter: reconciled,
      nextId: formatA4Id_(prefix, reconciled + 1)
    };
  } finally {
    lock.releaseLock();
  }
}

/** Non-destructive preview helper. Does not consume or issue an ID. */
function previewA4Id(prefix, existingIds) {
  prefix = normalizeA4Prefix_(prefix);
  const stored = parseA4Sequence_(
    PropertiesService.getScriptProperties().getProperty(A4_ID_PROPERTY_PREFIX + prefix)
  );
  const highestExisting = getHighestA4IdNumber_(prefix, existingIds || []);
  return formatA4Id_(prefix, Math.max(stored, highestExisting) + 1);
}

/** Non-destructive test harness. Does not advance production counters. */
function testA4IdGeneratorNonDestructive() {
  const samples = {
    PRJ: ['PRJ-000001','PRJ-000004'],
    EMP: ['EMP-000010'],
    BDG: ['BDG-000099'],
    NOT: ['NOT-000002']
  };
  const out = Object.keys(samples).map(function(prefix) {
    return {prefix:prefix, preview:previewA4Id(prefix, samples[prefix])};
  });
  Logger.log(JSON.stringify(out, null, 2));
  return out;
}

function listA4SupportedPrefixes() {
  Logger.log(JSON.stringify(Object.keys(A4_ID_CONFIG), null, 2));
  return Object.keys(A4_ID_CONFIG);
}

function normalizeA4Prefix_(prefix) {
  const value = String(prefix || '').trim().toUpperCase();
  if (!A4_ID_CONFIG[value]) throw new Error('A4_INVALID_PREFIX: ' + value);
  return value;
}

function parseA4Sequence_(value) {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error('A4_INVALID_COUNTER: ' + value);
  return n;
}

function getHighestA4IdNumber_(prefix, ids) {
  const re = new RegExp('^' + prefix + '-([0-9]{6})$');
  let highest = 0;
  (ids || []).forEach(function(raw) {
    const value = String(raw || '').trim().toUpperCase();
    if (!value) return;
    const match = value.match(re);
    if (match) highest = Math.max(highest, Number(match[1]));
  });
  return highest;
}

function formatA4Id_(prefix, number) {
  if (!Number.isInteger(number) || number < 1 || number > 999999) {
    throw new Error('A4_SEQUENCE_OUT_OF_RANGE: ' + prefix + ' / ' + number);
  }
  return prefix + '-' + String(number).padStart(A4_ID_WIDTH, '0');
}

function containsA4Id_(ids, candidate) {
  const wanted = String(candidate).toUpperCase();
  return (ids || []).some(function(raw) {
    return String(raw || '').trim().toUpperCase() === wanted;
  });
}


/**
 * A4-00 live acceptance harness for P4-17, P4-19 and P4-20.
 *
 * This harness intentionally consumes IDs when exercising the real generator.
 * Consumed IDs are never restored or reused; sequence gaps are valid under R57.
 * It does not create business records or mutate authoritative workbook rows.
 */
function testA4IdGeneratorP417P419P420Live() {
  const prefixes = Object.keys(A4_ID_CONFIG);
  const results = [];
  let allPassed = true;

  // P4-17 — all 13 prefixes, canonical PREFIX-NNNNNN format, independent sequences.
  const p417 = prefixes.map(function(prefix) {
    const id = generateA4Id(prefix, []);
    const valid = new RegExp('^' + prefix + '-[0-9]{6}$').test(id);
    return {prefix: prefix, id: id, passed: valid};
  });
  const p417Passed = p417.length === 13 && p417.every(function(x) { return x.passed; });
  results.push({test:'P4-17', passed:p417Passed, details:p417});
  allPassed = allPassed && p417Passed;

  // P4-19 — an issued ID remains consumed even when no business row is written.
  const p419Prefix = 'NOT';
  const first = generateA4Id(p419Prefix, []);
  const second = generateA4Id(p419Prefix, [first]);
  const p419Passed = first !== second &&
    new RegExp('^' + p419Prefix + '-[0-9]{6}$').test(first) &&
    new RegExp('^' + p419Prefix + '-[0-9]{6}$').test(second);
  results.push({test:'P4-19', passed:p419Passed, first:first, second:second, issuedIdNotReused:first !== second});
  allPassed = allPassed && p419Passed;

  // P4-20 — force a stale counter for a test prefix, reconcile against a higher
  // valid existing ID, then confirm the next generated ID advances beyond it.
  const p420Prefix = 'RPT';
  const props = PropertiesService.getScriptProperties();
  const key = A4_ID_PROPERTY_PREFIX + p420Prefix;
  const before = parseA4Sequence_(props.getProperty(key));
  const recoveryExisting = p420Prefix + '-' + String(before + 10).padStart(A4_ID_WIDTH, '0');
  props.setProperty(key, String(before));
  const reconciliation = reconcileA4IdCounter(p420Prefix, [recoveryExisting]);
  const recoveredId = generateA4Id(p420Prefix, [recoveryExisting]);
  const recoveredNumber = Number(recoveredId.split('-')[1]);
  const expectedMinimum = before + 11;
  const p420Passed = reconciliation.storedCounterBefore === before &&
    reconciliation.storedCounter >= before + 10 &&
    recoveredNumber >= expectedMinimum &&
    recoveredNumber > Number(recoveryExisting.split('-')[1]);
  results.push({
    test:'P4-20',
    passed:p420Passed,
    storedCounterBefore:before,
    highestExisting:reconciliation.highestExisting,
    reconciledCounter:reconciliation.storedCounter,
    recoveryExisting:recoveryExisting,
    recoveredId:recoveredId
  });
  allPassed = allPassed && p420Passed;

  const summary = {allPassed:allPassed, results:results};
  Logger.log('A4-00 P4-17/P4-19/P4-20 LIVE VERIFICATION ' + JSON.stringify(summary));
  return summary;
}

/**
 * P4-18 concurrency worker. Run this function from multiple simultaneous
 * Apps Script executions using the same runId. Each execution waits briefly
 * before generating an ID, increasing the chance of true overlap.
 *
 * Example runId: A400-CONCURRENCY-20261001
 */
function testA4IdGeneratorConcurrencyWorker(runId) {
  runId = String(runId || '').trim();
  if (!runId) throw new Error('A4_P418_RUN_ID_REQUIRED');
  Utilities.sleep(3000);
  const id = generateA4Id('NOT', []);
  const key = 'A4_P418_RESULT_' + runId;
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const props = PropertiesService.getScriptProperties();
    const current = JSON.parse(props.getProperty(key) || '[]');
    current.push({id:id, timestamp:new Date().toISOString()});
    props.setProperty(key, JSON.stringify(current));
    Logger.log('A4-00 P4-18 WORKER runId=' + runId + ' id=' + id);
    return {runId:runId, id:id, count:current.length};
  } finally {
    lock.releaseLock();
  }
}

/**
 * P4-18 result verifier. After multiple worker executions complete, call with
 * the same runId and expected worker count.
 */
function verifyA4IdGeneratorConcurrency(runId, expectedCount) {
  runId = String(runId || '').trim();
  expectedCount = Number(expectedCount);
  if (!runId || !Number.isInteger(expectedCount) || expectedCount < 2) {
    throw new Error('A4_P418_INVALID_VERIFIER_INPUT');
  }
  const key = 'A4_P418_RESULT_' + runId;
  const props = PropertiesService.getScriptProperties();
  const rows = JSON.parse(props.getProperty(key) || '[]');
  const ids = rows.map(function(x) { return String(x.id); });
  const unique = new Set(ids);
  const valid = ids.every(function(id) { return /^NOT-[0-9]{6}$/.test(id); });
  const passed = rows.length === expectedCount && unique.size === expectedCount && valid;
  const summary = {runId:runId, expectedCount:expectedCount, actualCount:rows.length, uniqueCount:unique.size, passed:passed, ids:ids};
  Logger.log('A4-00 P4-18 LIVE VERIFICATION ' + JSON.stringify(summary));
  if (passed) props.deleteProperty(key);
  return summary;
}
