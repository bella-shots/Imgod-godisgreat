/** A4-15 diagnostic — locate the existing MASTER COMPANY Google Site without modifying it. */
function locateMasterCompanySite() {
  const queries = [
    'title contains "MASTER COMPANY" and trashed = false',
    'title contains "MASTER" and trashed = false'
  ];
  const seen = {};
  const results = [];
  queries.forEach(function(q) {
    const files = DriveApp.searchFiles(q);
    while (files.hasNext()) {
      const f = files.next();
      if (seen[f.getId()]) continue;
      seen[f.getId()] = true;
      results.push({
        name: f.getName(),
        id: f.getId(),
        mimeType: f.getMimeType(),
        url: f.getUrl()
      });
    }
  });
  Logger.log(JSON.stringify({
    module:'A4-15',
    purpose:'Google Site location diagnostic',
    results:results
  }, null, 2));
}
