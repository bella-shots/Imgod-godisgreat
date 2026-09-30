/**
 * Phase 4 — A4-15 Master Asset Placement / Verification
 *
 * Finance assets:
 *   MASTER_COMPANY_FINANCE
 *   FRM-02 — Employee Spending / Expense
 *   FRM-03 — OOP Claim
 *   FRM-07 Investment Input
 *
 * Moves existing assets into:
 *   MASTER COMPANY/Finance
 *
 * Never copies or creates duplicate business assets.
 */

const FINANCE_ASSETS = [
  {
    expectedNames: ['MASTER_COMPANY_FINANCE'],
    id: '1fOqtag0z4FcRiC_A8Va92RC7t6bdwkUaUqKtkBgFhBo'
  },
  {
    expectedNames: [
      'FRM-02 — Employee Spending / Expense',
      'FRM-02 Employee Spending'
    ],
    id: '1OSVrNelP4bJeP6SUGcjtZDxufO1UHaoQ3_eII4YDc_k'
  },
  {
    expectedNames: [
      'FRM-03 — OOP Claim',
      'FRM-03 OOP Claims'
    ],
    id: '1nbd0vlQ3GymGvHs-lab6-A9rxZsY2qMHWZ7QW9aouuk'
  },
  {
    expectedNames: ['FRM-07 Investment Input'],
    id: '1ME8HSMcuZZHVdvIo-zhcWw3ex-6BnkUmGBznrJYkXXc'
  }
];

function moveFinanceAssetsToFrozenLocation() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  const results = [];

  try {
    const masterCompany = findUniqueFolderByName_('MASTER COMPANY');
    const financeFolder = findUniqueChildFolder_(masterCompany, 'Finance');

    FINANCE_ASSETS.forEach(function(asset) {
      results.push(placeAsset_(asset, financeFolder));
    });

    Logger.log(JSON.stringify({
      module: 'A4-15',
      destination: 'MASTER COMPANY/Finance',
      results: results
    }, null, 2));
  } finally {
    lock.releaseLock();
  }
}

function placeAsset_(asset, destinationFolder) {
  const file = DriveApp.getFileById(asset.id);
  const actualName = file.getName();

  if (asset.expectedNames.indexOf(actualName) === -1) {
    throw new Error(
      'ID/name mismatch for ' + asset.id +
      ': expected one of [' + asset.expectedNames.join(', ') +
      '] but found \"' + actualName + '\".'
    );
  }

  const sameNameInDestination = destinationFolder.getFilesByName(actualName);

  while (sameNameInDestination.hasNext()) {
    const existing = sameNameInDestination.next();

    if (existing.getId() !== asset.id) {
      throw new Error(
        'DUPLICATE DETECTED: \"' + actualName +
        '\" already exists in MASTER COMPANY/Finance with a different ID: ' +
        existing.getId()
      );
    }
  }

  const parents = file.getParents();
  let alreadyInDestination = false;

  while (parents.hasNext()) {
    const parent = parents.next();

    if (parent.getId() === destinationFolder.getId()) {
      alreadyInDestination = true;
      break;
    }
  }

  if (alreadyInDestination) {
    return {
      asset: actualName,
      id: asset.id,
      status: 'ALREADY_CORRECT',
      destination: 'MASTER COMPANY/Finance'
    };
  }

  file.moveTo(destinationFolder);

  const verifyParents = file.getParents();
  let verified = false;

  while (verifyParents.hasNext()) {
    const parent = verifyParents.next();

    if (parent.getId() === destinationFolder.getId()) {
      verified = true;
      break;
    }
  }

  if (!verified) {
    throw new Error(
      'MOVE_VERIFICATION_FAILED for \"' + actualName + '\".'
    );
  }

  return {
    asset: actualName,
    id: asset.id,
    status: 'MOVED_AND_VERIFIED',
    destination: 'MASTER COMPANY/Finance'
  };
}

function findUniqueFolderByName_(name) {
  const folders = DriveApp.getFoldersByName(name);
  const matches = [];

  while (folders.hasNext()) {
    matches.push(folders.next());
  }

  if (matches.length === 0) {
    throw new Error(
      'Required folder not found: \"' + name + '\".'
    );
  }

  if (matches.length > 1) {
    throw new Error(
      'AMBIGUOUS FOLDER: \"' + name +
      '\" has multiple matches. Refusing to guess.'
    );
  }

  return matches[0];
}

function findUniqueChildFolder_(parent, childName) {
  const folders = parent.getFoldersByName(childName);
  const matches = [];

  while (folders.hasNext()) {
    matches.push(folders.next());
  }

  if (matches.length === 0) {
    throw new Error(
      'Required destination folder not found: MASTER COMPANY/' +
      childName
    );
  }

  if (matches.length > 1) {
    throw new Error(
      'AMBIGUOUS DESTINATION: MASTER COMPANY/' + childName +
      ' has multiple matching folders. Refusing to guess.'
    );
  }

  return matches[0];
}
