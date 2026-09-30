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
  MBR: {label:'Project_Member_ID'},
  PNT: {label:'Project_Note_ID'},
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

    // Reconcile against authoritative existing IDs before issuing anything.
    const highestExisting = getHighestA4IdNumber_(prefix, existingIds || []);
    let next = Math.max(stored, highestExisting) + 1;

    const candidate = formatA4Id_(prefix, next);
    if (containsA4Id_(existingIds || [], candidate)) {
      throw new Error('A4_ID_COLLISION: ' + candidate);
    }

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
    const highest = getHighestA4IdNumber_(prefix, existingIds || []);
    PropertiesService.getScriptProperties()
      .setProperty(A4_ID_PROPERTY_PREFIX + prefix, String(highest));
    return {
      prefix: prefix,
      highestExisting: highest,
      storedCounter: highest,
      nextId: formatA4Id_(prefix, highest + 1)
    };
  } finally {
    lock.releaseLock();
  }
}

/** Test harness only. Does not write a business record. */
function testA4IdGenerator() {
  const samples = {
    PRJ: ['PRJ-000001','PRJ-000004'],
    EMP: ['EMP-000010'],
    BDG: ['BDG-000099']
  };
  const out = Object.keys(samples).map(function(prefix) {
    const id = generateA4Id(prefix, samples[prefix]);
    return {prefix:prefix, generated:id};
  });
  Logger.log(JSON.stringify(out, null, 2));
}

/** Reconciles all frozen 13 prefixes using supplied existing-ID arrays.
 * This function is intentionally empty by default: callers/modules must supply
 * authoritative IDs rather than allowing this core module to guess sheet columns.
 */
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
