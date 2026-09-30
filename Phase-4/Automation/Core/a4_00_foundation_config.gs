/** Phase 4 foundation/configuration
 * Keep this file limited to configuration and health checks.
 * Do not place business-module logic here.
 */

const A4_FOUNDATION = {
  version: '4.0.0',
  costBoundary: 'Google Apps Script + approved Google services only',
  privilegedRuntime: 'authorized owner/admin account',
  idWidth: 6,
  supportedIdPrefixes: ['PRJ','EMP','MBR','PNT','BDG','SPN','CLM','SAL','MOM','INV','HRR','RPT','SUB']
};

function verifyA4Foundation() {
  const props = PropertiesService.getScriptProperties();
  const lock = LockService.getScriptLock();
  const result = {
    status:'PASS',
    module:'A4-FOUNDATION',
    version:A4_FOUNDATION.version,
    idWidth:A4_FOUNDATION.idWidth,
    supportedIdPrefixes:A4_FOUNDATION.supportedIdPrefixes,
    lockAvailable:!!lock,
    scriptPropertiesAvailable:!!props
  };
  Logger.log(JSON.stringify(result, null, 2));
  return result;
}
