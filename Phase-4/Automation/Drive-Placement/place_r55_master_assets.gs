/** Phase 4 A4-15 — R55 Master Asset Placement / Verification */
const R55_ASSETS = [
  {label:'Google Site', match:'imgod_godisgreat', exact:true, dest:'MASTER COMPANY'},
  {label:'MASTER_COMPANY_OPERATIONS', match:'MASTER_COMPANY_OPERATIONS', exact:true, dest:'Projects'},
  {label:'MASTER_COMPANY_FINANCE', match:'MASTER_COMPANY_FINANCE', exact:true, dest:'Finance'},
  {label:'MASTER_COMPANY_HR_ADMIN', match:'MASTER_COMPANY_HR_ADMIN', exact:true, dest:'HR'},
  {label:'MASTER_COMPANY_ADMIN', match:'MASTER_COMPANY_ADMIN', exact:true, dest:'MASTER COMPANY'},
  {label:'FRM-01', match:'FRM-01', exact:false, dest:'Projects'},
  {label:'FRM-02', match:'FRM-02', exact:false, dest:'Finance'},
  {label:'FRM-03', match:'FRM-03', exact:false, dest:'Finance'},
  {label:'FRM-04', match:'FRM-04', exact:false, dest:'HR'},
  {label:'FRM-05', match:'FRM-05', exact:false, dest:'MOM'},
  {label:'FRM-06', match:'FRM-06', exact:false, dest:'Reports'},
  {label:'FRM-07', match:'FRM-07', exact:false, dest:'Finance'}
];

function placeR55MasterAssets() {
  const lock = LockService.getScriptLock(); lock.waitLock(30000);
  const out = [];
  try {
    const root = uniqueFolder_('MASTER COMPANY');
    R55_ASSETS.forEach(a => out.push(processR55_(a, a.dest === 'MASTER COMPANY' ? root : resolveR55Destination_(root, a.dest))));
    Logger.log(JSON.stringify({module:'A4-15', results:out}, null, 2));
  } finally { lock.releaseLock(); }
}
function processR55_(a, dest) {
  const files = DriveApp.searchFiles((a.exact ? 'title = "' : 'title contains "') + esc_(a.match) + '" and trashed = false');
  const matches=[]; while(files.hasNext()){const f=files.next(); if(a.label==='Google Site' && f.getMimeType()!=='application/vnd.google-apps.site') continue; matches.push(f);}
  if (!matches.length) return {asset:a.label,status:'HUMAN_ACTION_REQUIRED',reason:'MISSING_OR_INACCESSIBLE'};
  if (matches.length>1) return {asset:a.label,status:'HUMAN_ACTION_REQUIRED',reason:'AMBIGUOUS',candidates:matches.map(f=>({name:f.getName(),id:f.getId()}))};
  const file=matches[0], name=file.getName(), id=file.getId();
  const parents=file.getParents(); let already=false;
  while(parents.hasNext()) if(parents.next().getId()===dest.getId()){already=true;break;}
  if(already) return {asset:name,id:id,status:'ALREADY_CORRECT',destination:dest.getName()};
  const dup=dest.getFilesByName(name);
  while(dup.hasNext()){const other=dup.next();if(other.getId()!==id)return {asset:name,id:id,status:'HUMAN_ACTION_REQUIRED',reason:'DUPLICATE_IN_DESTINATION',duplicateId:other.getId()};}
  file.moveTo(dest);
  const verify=file.getParents(); let ok=false;
  while(verify.hasNext()) if(verify.next().getId()===dest.getId()){ok=true;break;}
  if(!ok) throw new Error('MOVE_VERIFICATION_FAILED: '+name);
  return {asset:name,id:id,status:'MOVED_AND_VERIFIED',destination:dest.getName()};
}
function uniqueFolder_(name){const it=DriveApp.getFoldersByName(name),a=[];while(it.hasNext())a.push(it.next());if(a.length!==1)throw new Error(a.length?'AMBIGUOUS FOLDER: '+name:'MISSING FOLDER: '+name);return a[0];}
function resolveR55Destination_(root,dest){const parts=dest.split('/');let cur=root;for(let i=0;i<parts.length;i++)cur=uniqueChild_(cur,parts[i]);return cur;}
function uniqueChild_(p,name){const it=p.getFoldersByName(name),a=[];while(it.hasNext())a.push(it.next());if(a.length!==1)throw new Error(a.length?'AMBIGUOUS DESTINATION: '+name:'MISSING DESTINATION: '+name);return a[0];}
function esc_(s){return s.replace(/\\/g,'\\\\').replace(/"/g,'\\\"');}
