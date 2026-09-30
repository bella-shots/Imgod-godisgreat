/**
 * Phase 4 — A4-15 Master Asset Placement / Verification
 * Finance subset: moves the four existing Finance assets into the frozen
 * MASTER COMPANY/Finance destination without creating copies.
 *
 * HUMAN ACTION REQUIRED: Run this once from an Apps Script project that has
 * Drive access to the same Google account that owns/controls MASTER COMPANY.
 *
 * Frozen assets:
 *   MASTER_COMPANY_FINANCE
 *   FRM-02 Employee Spending
 *   FRM-03 OOP Claims
 *   FRM-07 Investment Input
 */

const FINANCE_ASSETS = [
  { name: 'MASTER_COMPANY_FINANCE', id: '1fOqtag0z4FcRiC_A8Va92RC7t6bdwkUaUqKtkBgFhBo' },
  { name: 'FRM-02 Employee Spending', id: '1OSVrNelP4bJeP6SUGcjtZDxufO1UHaoQ3_eII4YDc_k' },
  { name: 'FRM-03 OOP Claims', id: '1nbd0vlQ3GymGvHs-lab6-A9rxZsY2qMHWZ7QW9aouuk' },
  { name: 'FRM-07 Investment Input', id: '1ME8HSMcuZZHVdvIo-zhcWw3ex-6BnkUmGBznrJYkXXc' }
];

function moveFinanceAssetsToFrozenLocation() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  const results = [];

  try {
    const masterCompany = findUniqueFolderByName_('MASTER COMPANY');
    const financeFolder = findUniqueChildFolder_(masterCompany, 'Finance');

    FINANCE_ASSETS.forEach(asset => {
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

  if (file.getName() !== asset.name) {
    throw new Error(
      'ID/name mismatch for ' + asset.id +
      ': expected "' + asset.name + '" but found "' + file.getName() + '".'
    );
  }

  // Refuse to create a duplicate business asset.
  const sameNameInDestination = destinationFolder.getFilesByName(asset.name);
  if (sameNameInDestination.hasNext()) {
    const existing = sameNameInDestination.next();
    if (existing.getId() !== asset.id) {
      throw new Error(
        'DUPLICATE DETECTED: "' + asset.name +
        '" already exists in MASTER COMPANY/Finance with a different ID: ' +
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
      asset: asset.name,
      id: asset.id,
      status: 'ALREADY_CORRECT',
      destination: 'MASTER COMPANY/Finance'
    };
  }

  // Move the existing file; never copy it.
  file.moveTo(destinationFolder);

  // Verify the move.
  const verifyParents = file.getParents();
  let verified = false;
  while (verifyParents.hasNext()) {
    if (verifyParents.next().getId() === destinationFolder.getId()) {
      verified = true;
      break;
    }
  }

  if (!verified) {
    throw new Error('MOVE_VERIFICATION_FAILED for "' + asset.name + '".');
  }

  return {
    asset: asset.name,
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
    throw new Error('Required folder not found: "' + name + '".');
  }

  if (matches.length > 1) {
    throw new Error(
      'AMBIGUOUS FOLDER: "' + name +
      '" has multiple matches. Refusing to guess.'
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
      'Required destination folder not found: MASTER COMPANY/' + childName
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
