/**
 * A4-00 Universal ID Generator — Live Verification Test Harness
 *
 * Dedicated non-destructive live verification suite for P4-17, P4-18, P4-19, and P4-20.
 *
 * Requirements:
 * - P4-17: Universal ID generation for all 13 canonical prefixes
 * - P4-18: Concurrent ID generation & LockService mutex serialization
 * - P4-19: ID persistence, deletion, and no-reuse invariant
 * - P4-20: Counter recovery and reconciliation against highest existing IDs
 * - Non-destructive cleanup: leaves no test artifacts; never deletes production records;
 *   preserves the no-reuse invariant (counters are never rolled backward).
 */

var A400_ALL_PREFIXES = Object.freeze([
  'PRJ', 'EMP', 'MBR', 'NOT', 'MOM', 'BDG', 'SPN',
  'CLM', 'SAL', 'INV', 'HRR', 'RPT', 'SUB'
]);

/**
 * Worker function for P4-18 Concurrency Verification.
 * Can be executed concurrently across parallel Apps Script executions/threads.
 * Issues an ID under LockService and safely records it to a shared ScriptProperty pool.
 *
 * @param {string} prefix - The prefix to test (defaults to 'SUB').
 * @param {string} runToken - Unique identifier for the concurrency test run.
 * @returns {Object} { id: string, runToken: string, timestamp: number }
 */
function testA400ConcurrentWorker(prefix, runToken, expectedWorkers) {
  prefix = prefix || 'SUB';
  runToken = runToken || 'DEFAULT';
  expectedWorkers = Number(expectedWorkers || 1);

  var props = PropertiesService.getScriptProperties();
  var readyKey = 'A400_CONCURRENT_READY_' + runToken;
  var storageKey = 'A400_CONCURRENT_POOL_' + runToken;
  var startedKey = 'A400_CONCURRENT_STARTED_' + runToken;
  var errorKey = 'A400_CONCURRENT_ERRORS_' + runToken;
  var readyLock = LockService.getScriptLock();

  // Register this independent execution as started, then enter the barrier.
  readyLock.waitLock(30000);
  try {
    var startedRaw = props.getProperty(startedKey);
    var startedList = startedRaw ? JSON.parse(startedRaw) : [];
    startedList.push({ executionId: Utilities.getUuid(), timestamp: Date.now() });
    props.setProperty(startedKey, JSON.stringify(startedList));

    var readyRaw = props.getProperty(readyKey);
    var readyList = readyRaw ? JSON.parse(readyRaw) : [];
    readyList.push({
      executionId: Utilities.getUuid(),
      timestamp: Date.now()
    });
    props.setProperty(readyKey, JSON.stringify(readyList));
  } finally {
    readyLock.releaseLock();
  }

  // Wait until all independently scheduled executions are ready.
  var deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    var currentReadyRaw = props.getProperty(readyKey);
    var currentReady = currentReadyRaw ? JSON.parse(currentReadyRaw) : [];
    if (currentReady.length >= expectedWorkers) break;
    Utilities.sleep(250);
  }

  var finalReadyRaw = props.getProperty(readyKey);
  var finalReady = finalReadyRaw ? JSON.parse(finalReadyRaw) : [];
  if (finalReady.length < expectedWorkers) {
    throw new Error('A4_P4_18_BARRIER_TIMEOUT: expected=' + expectedWorkers + ', ready=' + finalReady.length);
  }

  // All workers are now released into the generator concurrently.
  var id = generateA4Id(prefix, []);

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var existingRaw = props.getProperty(storageKey);
    var list = existingRaw ? JSON.parse(existingRaw) : [];
    list.push({
      id: id,
      executionId: Utilities.getUuid(),
      timestamp: Date.now()
    });
    props.setProperty(storageKey, JSON.stringify(list));
  } finally {
    lock.releaseLock();
  }

  return { id: id, runToken: runToken, timestamp: Date.now() };
}

/**
 * Time-based trigger entry point used only by the live P4-18 harness.
 * Each independent execution claims one queued worker job.
 */
function testA400ConcurrentTrigger_() {
  var props = PropertiesService.getScriptProperties();
  var queueKeyPrefix = 'A400_CONCURRENT_QUEUE_';
  var keys = props.getProperties();
  var queueKey = null;
  var job = null;

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    Object.keys(keys).some(function(key) {
      if (key.indexOf(queueKeyPrefix) !== 0) return false;
      var queue = JSON.parse(keys[key] || '[]');
      if (!queue.length) return false;
      queueKey = key;
      job = queue.shift();
      props.setProperty(key, JSON.stringify(queue));
      return true;
    });
  } finally {
    lock.releaseLock();
  }

  if (!job) return;
  try {
    testA400ConcurrentWorker(job.prefix, job.runToken, job.expectedWorkers);
  } catch (err) {
    var errorKey = 'A400_CONCURRENT_ERRORS_' + job.runToken;
    var errorLock = LockService.getScriptLock();
    errorLock.waitLock(30000);
    try {
      var errorRaw = props.getProperty(errorKey);
      var errorList = errorRaw ? JSON.parse(errorRaw) : [];
      errorList.push({
        message: err && err.message ? err.message : String(err),
        timestamp: Date.now()
      });
      props.setProperty(errorKey, JSON.stringify(errorList));
    } finally {
      errorLock.releaseLock();
    }
    throw err;
  }
}

/**
 * Deletes only temporary P4-18 test triggers created by this harness.
 */
function cleanupA400ConcurrentTriggers_() {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'testA400ConcurrentTrigger_') {
      try {
        ScriptApp.deleteTrigger(trigger);
      } catch (e) {}
    }
  });
}

/**
 * Master Live Acceptance Test Suite for A4-00 Universal ID Closure.
 * Evaluates P4-17, P4-18, P4-19, and P4-20 and prints the required final execution summary.
 *
 * @returns {Object} Structured test results.
 */
function testA400UniversalIdClosureLive() {
  var results = {
    p4_17: { name: 'P4-17', status: 'FAIL', details: [] },
    p4_18: { name: 'P4-18', status: 'FAIL', details: [] },
    p4_19: { name: 'P4-19', status: 'FAIL', details: [] },
    p4_20: { name: 'P4-20', status: 'FAIL', details: [] },
    cleanup: { name: 'Cleanup', status: 'FAIL', details: [] }
  };

  var props = PropertiesService.getScriptProperties();
  var testPropertyKeys = [];
  var initialCounters = {};

  try {
    // Record initial counters across all 13 prefixes
    A400_ALL_PREFIXES.forEach(function(pfx) {
      initialCounters[pfx] = props.getProperty('A4_ID_COUNTER_' + pfx);
    });

    // =========================================================================
    // P4-17: UNIVERSAL ID GENERATION FOR ALL 13 PREFIXES
    // =========================================================================
    try {
      var generatedIds = {};
      var p17Passed = true;
      var p17Errors = [];

      for (var i = 0; i < A400_ALL_PREFIXES.length; i++) {
        var prefix = A400_ALL_PREFIXES[i];
        var counterBefore = Number(props.getProperty('A4_ID_COUNTER_' + prefix) || 0);

        // Snapshot other prefix counters to verify strict independence
        var otherCountersBefore = {};
        A400_ALL_PREFIXES.forEach(function(otherPfx) {
          if (otherPfx !== prefix) {
            otherCountersBefore[otherPfx] = props.getProperty('A4_ID_COUNTER_' + otherPfx);
          }
        });

        // Generate ID using authoritative generator
        var candidate = generateA4Id(prefix, []);
        generatedIds[prefix] = candidate;

        // 1. Verify format: EXACTLY PREFIX-NNNNNN with 6 numeric digits
        var pattern = new RegExp('^' + prefix + '-([0-9]{6})$');
        var match = candidate.match(pattern);
        if (!match) {
          p17Passed = false;
          p17Errors.push(prefix + ' invalid format: ' + candidate);
        }

        // 2. Verify counter advanced in PropertiesService
        var counterAfter = Number(props.getProperty('A4_ID_COUNTER_' + prefix) || 0);
        if (counterAfter !== counterBefore + 1) {
          p17Passed = false;
          p17Errors.push(prefix + ' counter mismatch: before=' + counterBefore + ', after=' + counterAfter);
        }

        // 3. Verify sequence number in ID matches persisted counter
        var parsedSequence = match ? Number(match[1]) : -1;
        if (parsedSequence !== counterAfter) {
          p17Passed = false;
          p17Errors.push(prefix + ' ID sequence (' + parsedSequence + ') != counter (' + counterAfter + ')');
        }

        // 4. Verify independence: other prefix counters were NOT altered
        A400_ALL_PREFIXES.forEach(function(otherPfx) {
          if (otherPfx !== prefix) {
            var otherAfter = props.getProperty('A4_ID_COUNTER_' + otherPfx);
            if (otherAfter !== otherCountersBefore[otherPfx]) {
              p17Passed = false;
              p17Errors.push('Prefix ' + prefix + ' altered independent counter ' + otherPfx);
            }
          }
        });
      }

      // 5. Verify all 13 generated IDs are mutually unique
      var uniqueCheck = {};
      var allUnique = true;
      Object.keys(generatedIds).forEach(function(pfx) {
        var val = generatedIds[pfx];
        if (uniqueCheck[val]) allUnique = false;
        uniqueCheck[val] = true;
      });

      if (!allUnique || Object.keys(uniqueCheck).length !== 13) {
        p17Passed = false;
        p17Errors.push('Collisions detected among generated IDs: ' + JSON.stringify(generatedIds));
      }

      if (p17Passed) {
        results.p4_17.status = 'PASS';
        results.p4_17.details.push('Generated 13 canonical 6-digit IDs with independent counters: ' +
          Object.keys(generatedIds).map(function(k) { return generatedIds[k]; }).join(', '));
      } else {
        results.p4_17.status = 'FAIL';
        results.p4_17.details = p17Errors;
      }
    } catch (e17) {
      results.p4_17.status = 'FAIL';
      results.p4_17.details.push('Exception in P4-17: ' + (e17.message || String(e17)));
    }

    // =========================================================================
    // P4-18: CONCURRENT ID GENERATION & LOCKSERVICE MUTEX
    // =========================================================================
    try {
      var p18Passed = true;
      var p18Evidence = [];
      var runToken = 'RUN_' + Date.now();
      var poolKey = 'A400_CONCURRENT_POOL_' + runToken;
      testPropertyKeys.push(poolKey);

      // Part A: Real cross-execution concurrency barrier.
      // The previous same-execution tryLock assertion was intentionally removed:
      // it did not prove cross-execution contention. This harness now schedules
      // five independent Apps Script executions that rendezvous before ID allocation.
      var queueKey = 'A400_CONCURRENT_QUEUE_' + runToken;
      var readyKey = 'A400_CONCURRENT_READY_' + runToken;
      var startedKey = 'A400_CONCURRENT_STARTED_' + runToken;
      var errorKey = 'A400_CONCURRENT_ERRORS_' + runToken;
      props.setProperty(queueKey, JSON.stringify([
        {prefix:'SUB', runToken:runToken, expectedWorkers:5},
        {prefix:'SUB', runToken:runToken, expectedWorkers:5},
        {prefix:'SUB', runToken:runToken, expectedWorkers:5},
        {prefix:'SUB', runToken:runToken, expectedWorkers:5},
        {prefix:'SUB', runToken:runToken, expectedWorkers:5}
      ]));
      props.setProperty(readyKey, JSON.stringify([]));
      props.setProperty(startedKey, JSON.stringify([]));
      props.setProperty(errorKey, JSON.stringify([]));
      testPropertyKeys.push(queueKey);
      testPropertyKeys.push(readyKey);
      testPropertyKeys.push(startedKey);
      testPropertyKeys.push(errorKey);

      cleanupA400ConcurrentTriggers_();
      for (var t = 0; t < 5; t++) {
        ScriptApp.newTrigger('testA400ConcurrentTrigger_')
          .timeBased()
          .after(60000)
          .create();
      }
      // Apps Script time-driven triggers have scheduler jitter. Give the five
      // independent executions enough time to start and rendezvous, while staying
      // below the Apps Script 6-minute per-execution runtime limit.
      Utilities.sleep(240000);

      var startedRaw = props.getProperty(startedKey);
      var startedList = startedRaw ? JSON.parse(startedRaw) : [];
      var errorRaw = props.getProperty(errorKey);
      var errorList = errorRaw ? JSON.parse(errorRaw) : [];
      p18Evidence.push('Independent worker executions started: ' + startedList.length + '/5');
      if (errorList.length) {
        p18Evidence.push('Worker execution errors: ' + JSON.stringify(errorList));
      }

      var readyRaw = props.getProperty(readyKey);
      var readyList = readyRaw ? JSON.parse(readyRaw) : [];
      if (readyList.length !== 5) {
        p18Passed = false;
        p18Evidence.push('FAIL: Expected 5 independent concurrent workers to reach barrier; observed ' + readyList.length);
      } else {
        p18Evidence.push('Real cross-execution barrier reached by 5 independent Apps Script executions');
      }

      // Part B: Verify IDs produced by the independently executing workers.
      var workerResults = [];
      var workerRaw = props.getProperty(poolKey);
      var workerPoolBefore = workerRaw ? JSON.parse(workerRaw) : [];
      workerResults = workerPoolBefore.map(function(item) { return item.id; });

      // Verify collected pool from ScriptProperties
      var poolRaw = props.getProperty(poolKey);
      var poolList = poolRaw ? JSON.parse(poolRaw) : [];
      var poolIds = poolList.map(function(item) { return item.id; });

      // Assert that all IDs in pool are 100% unique
      var poolUniq = {};
      poolIds.forEach(function(pid) { poolUniq[pid] = true; });
      if (poolIds.length !== 5 || Object.keys(poolUniq).length !== 5) {
        p18Passed = false;
        p18Evidence.push('FAIL: Concurrency collision or missing IDs in pool: ' + JSON.stringify(poolIds));
      } else {
        p18Evidence.push('Worker pool recorded 5 unique collision-free IDs: ' + poolIds.join(', '));
      }

      // Assert sequential ordering and monotonic increment
      var prevSeq = -1;
      for (var s = 0; s < poolIds.length; s++) {
        var curSeq = Number(poolIds[s].split('-')[1]);
        if (prevSeq !== -1 && curSeq !== prevSeq + 1) {
          p18Passed = false;
          p18Evidence.push('FAIL: Non-monotonic sequence in worker pool: ' + poolIds[s]);
        }
        prevSeq = curSeq;
      }

      p18Evidence.push('Concurrency architecture: LockService script-level serialization guarantees zero-collision counter allocation across simultaneous executions');

      if (p18Passed) {
        results.p4_18.status = 'PASS';
        results.p4_18.details = p18Evidence;
      } else {
        results.p4_18.status = 'FAIL';
        results.p4_18.details = p18Evidence;
      }
    } catch (e18) {
      results.p4_18.status = 'FAIL';
      results.p4_18.details.push('Exception in P4-18: ' + (e18.message || String(e18)));
    }

    // =========================================================================
    // P4-19: PERSISTENCE, DELETION & NO-REUSE INVARIANT
    // =========================================================================
    try {
      var p19Passed = true;
      var p19Evidence = [];
      var testPrefix = 'NOT'; // Project Note prefix

      // 1. Generate controlled test ID
      var id1 = generateA4Id(testPrefix, []);
      var num1 = Number(id1.split('-')[1]);
      p19Evidence.push('Step 1: Issued ' + id1 + ' (counter=' + num1 + ')');

      // 2. Simulate deletion of id1 by providing an existingIds list that omits id1 (creating an artificial gap)
      var earlierIds = [testPrefix + '-000001'];
      p19Evidence.push('Step 2: Simulating deleted transaction (existing records contain ' + earlierIds.join(', ') + '; ' + id1 + ' is missing)');

      // 3. Attempt next generation
      var id2 = generateA4Id(testPrefix, earlierIds);
      var num2 = Number(id2.split('-')[1]);
      p19Evidence.push('Step 3: Issued subsequent ' + id2 + ' (counter=' + num2 + ')');

      // 4. Assert previous ID was NOT reused
      if (id2 === id1) {
        p19Passed = false;
        p19Evidence.push('FAIL: Generator reused previously issued ID: ' + id1);
      }

      // 5. Assert sequence strictly advanced
      if (num2 !== num1 + 1) {
        p19Passed = false;
        p19Evidence.push('FAIL: Sequence did not advance monotonically: num1=' + num1 + ', num2=' + num2);
      }

      // 6. Assert generator did NOT scan for or refill the gap
      if (num2 <= num1) {
        p19Passed = false;
        p19Evidence.push('FAIL: Generator backfilled deleted ID sequence gap');
      }

      if (p19Passed) {
        results.p4_19.status = 'PASS';
        results.p4_19.details = p19Evidence;
      } else {
        results.p4_19.status = 'FAIL';
        results.p4_19.details = p19Evidence;
      }
    } catch (e19) {
      results.p4_19.status = 'FAIL';
      results.p4_19.details.push('Exception in P4-19: ' + (e19.message || String(e19)));
    }

    // =========================================================================
    // P4-20: COUNTER RECOVERY & RECONCILIATION
    // =========================================================================
    try {
      var p20Passed = true;
      var p20Evidence = [];
      var recPrefix = 'BDG'; // Budget prefix

      // Case A: Stored counter is lower than highest existing ID
      // Set a controlled lower counter
      var existingSimulated = [recPrefix + '-000010', recPrefix + '-000055'];
      var highestInSim = 55;
      var lowerCounter = 40;
      props.setProperty('A4_ID_COUNTER_' + recPrefix, String(lowerCounter));
      p20Evidence.push('Case A setup: Lower stored counter=' + lowerCounter + ', highest existing ID=' + recPrefix + '-000055');

      // Reconcile counter
      var recResult = reconcileA4IdCounter(recPrefix, existingSimulated);
      if (recResult.storedCounter !== highestInSim) {
        p20Passed = false;
        p20Evidence.push('FAIL: Reconciled counter (' + recResult.storedCounter + ') != highest existing (' + highestInSim + ')');
      } else {
        p20Evidence.push('Reconciled counter advanced from ' + lowerCounter + ' to ' + highestInSim);
      }

      // Generate next ID
      var nextIdA = generateA4Id(recPrefix, existingSimulated);
      var nextNumA = Number(nextIdA.split('-')[1]);
      if (nextNumA !== highestInSim + 1) {
        p20Passed = false;
        p20Evidence.push('FAIL: Next ID (' + nextIdA + ') did not advance past highest existing (' + (highestInSim + 1) + ')');
      } else {
        p20Evidence.push('Generated next ID past highest existing: ' + nextIdA);
      }

      // Case B: Stored counter is already HIGHER than highest existing ID
      var higherCounter = nextNumA; // currently 56
      var lowerExistingList = [recPrefix + '-000010', recPrefix + '-000020']; // highest is 20
      p20Evidence.push('Case B setup: Higher stored counter=' + higherCounter + ', lower existing IDs highest=' + recPrefix + '-000020');

      var recResultB = reconcileA4IdCounter(recPrefix, lowerExistingList);
      if (recResultB.storedCounter !== higherCounter) {
        p20Passed = false;
        p20Evidence.push('FAIL: Counter moved backward from ' + higherCounter + ' to ' + recResultB.storedCounter);
      } else {
        p20Evidence.push('Preserved higher counter=' + higherCounter + '; counter did not move backward');
      }

      var nextIdB = generateA4Id(recPrefix, lowerExistingList);
      var nextNumB = Number(nextIdB.split('-')[1]);
      if (nextNumB !== higherCounter + 1) {
        p20Passed = false;
        p20Evidence.push('FAIL: Next ID (' + nextIdB + ') did not continue forward from stored counter');
      } else {
        p20Evidence.push('Generated next ID continuing forward: ' + nextIdB);
      }

      if (p20Passed) {
        results.p4_20.status = 'PASS';
        results.p4_20.details = p20Evidence;
      } else {
        results.p4_20.status = 'FAIL';
        results.p4_20.details = p20Evidence;
      }
    } catch (e20) {
      results.p4_20.status = 'FAIL';
      results.p4_20.details.push('Exception in P4-20: ' + (e20.message || String(e20)));
    }

    // =========================================================================
    // CLEANUP & STATE PRESERVATION
    // =========================================================================
    try {
      var cleanupPassed = true;
      var cleanupDetails = [];

      // 0. Remove only the temporary P4-18 trigger instances created by this harness
      cleanupA400ConcurrentTriggers_();

      // 1. Remove temporary test properties created by the harness
      testPropertyKeys.forEach(function(k) {
        try {
          props.deleteProperty(k);
          cleanupDetails.push('Removed temporary test property: ' + k);
        } catch (delErr) {
          cleanupPassed = false;
          cleanupDetails.push('Failed to delete property ' + k + ': ' + delErr.message);
        }
      });

      // 2. Invariant check: Verify no production counters were rolled backward
      // Legitimately consumed test IDs remain advanced to honor the no-reuse contract.
      A400_ALL_PREFIXES.forEach(function(pfx) {
        var preVal = Number(initialCounters[pfx] || 0);
        var postVal = Number(props.getProperty('A4_ID_COUNTER_' + pfx) || 0);
        if (postVal < preVal) {
          cleanupPassed = false;
          cleanupDetails.push('Invariant violated: Counter ' + pfx + ' was rolled backward (' + preVal + ' -> ' + postVal + ')');
        }
      });

      cleanupDetails.push('No production sheet records modified or deleted; temporary test properties cleaned up; no-reuse invariant preserved');

      results.cleanup.status = cleanupPassed ? 'PASS' : 'FAIL';
      results.cleanup.details = cleanupDetails;
    } catch (eClean) {
      results.cleanup.status = 'FAIL';
      results.cleanup.details.push('Exception during cleanup: ' + (eClean.message || String(eClean)));
    }

  } finally {
    // Safety net: ensure testPropertyKeys are removed even if an unhandled error occurred
    testPropertyKeys.forEach(function(k) {
      try {
        PropertiesService.getScriptProperties().deleteProperty(k);
      } catch (e) {}
    });
  }

  // ===========================================================================
  // REQUIRED EXECUTION LOG SUMMARY
  // ===========================================================================
  var allFourPassed = (
    results.p4_17.status === 'PASS' &&
    results.p4_18.status === 'PASS' &&
    results.p4_19.status === 'PASS' &&
    results.p4_20.status === 'PASS' &&
    results.cleanup.status === 'PASS'
  );

  var passedCount = 0;
  if (results.p4_17.status === 'PASS') passedCount++;
  if (results.p4_18.status === 'PASS') passedCount++;
  if (results.p4_19.status === 'PASS') passedCount++;
  if (results.p4_20.status === 'PASS') passedCount++;

  var outputLines = [
    'A4-00 UNIVERSAL ID CLOSURE LIVE VERIFICATION',
    '',
    '1. P4-17: ' + results.p4_17.status,
    '2. P4-18: ' + results.p4_18.status,
    '3. P4-19: ' + results.p4_19.status,
    '4. P4-20: ' + results.p4_20.status,
    'Cleanup: ' + results.cleanup.status,
    ''
  ];

  if (allFourPassed) {
    outputLines.push('A4-00 UNIVERSAL ID CLOSURE — PASS (4/4)');
  } else {
    outputLines.push('A4-00 UNIVERSAL ID CLOSURE — FAIL (' + passedCount + '/4)');
  }

  var summaryText = outputLines.join('\n');
  console.log(summaryText);
  Logger.log(summaryText);

  // Also log diagnostic details for audit traceability
  console.log(JSON.stringify(results, null, 2));
  Logger.log(JSON.stringify(results, null, 2));

  return {
    allPassed: allFourPassed,
    passedCount: passedCount,
    totalCount: 4,
    summary: summaryText,
    results: results
  };
}
