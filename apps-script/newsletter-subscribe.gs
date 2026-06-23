// Newsletter subscribe endpoint.
// Deploy: a Google Sheet (e.g. "Newsletter Subscribers") + a standalone or
// bound Apps Script with this file.
//   1. Create the Sheet; note its ID (the long string in its URL).
//   2. Project Settings -> Script Properties -> add SHEET_ID = that id.
//   3. Deploy -> New deployment -> type "Web app" ->
//        Execute as: Me,  Who has access: Anyone.
//   4. Copy the Web app URL into SITE.newsletterEndpoint in src/config/site.ts.
// The site posts { "email": "..." }; we append [timestamp, email, status] and
// skip duplicates. Subscribers are stored so a newsletter can be sent later
// (see newsletter-send.gs).

var SHEET_NAME = 'Subscribers';
var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var email = '';
    try {
      email = String((JSON.parse(e.postData.contents) || {}).email || '').trim().toLowerCase();
    } catch (err) {
      email = '';
    }
    if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'invalid email' });

    var sheet = getSheet();
    var existing = sheet.getLastRow() > 1
      ? sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues().map(function (r) {
          return String(r[0]).trim().toLowerCase();
        })
      : [];
    if (existing.indexOf(email) === -1) {
      sheet.appendRow([new Date(), email, 'subscribed']);
    }
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  var ss = SpreadsheetApp.openById(id);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Email', 'Status']);
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
