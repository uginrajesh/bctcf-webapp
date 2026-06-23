// Newsletter SEND — automatic, Drive-folder driven.
// Drop this month's newsletter as a Google Doc into a dedicated Drive folder;
// a time-driven trigger picks up the newest Doc and emails it to every
// subscriber, then records it so it is never sent twice.
//
// Setup:
//   Script Properties (Project Settings -> Script Properties):
//     SHEET_ID             = the Newsletter Subscribers spreadsheet id
//     NEWSLETTER_FOLDER_ID = the Drive folder you drop newsletter Docs into
//   Trigger (clock icon -> Add trigger):
//     Function: checkAndSendNewsletter | Time-driven | Hour/Day timer.
//   You can also Run checkAndSendNewsletter manually to send immediately.
//
// Guardrails (any failing one aborts and just logs why):
//   1. Same Doc is never sent twice (tracks LAST_SENT_DOC_ID).
//   2. At least MIN_DAYS_BETWEEN days since the last send.
//   3. The Doc must have been left unedited for MIN_SETTLE_MINUTES — so a
//      draft you are still writing won't go out.
//   4. The Doc must be non-empty and there must be at least one subscriber.

var SUBSCRIBERS_SHEET = 'Subscribers';
var MIN_DAYS_BETWEEN = 24;
var MIN_SETTLE_MINUTES = 30;

function checkAndSendNewsletter() {
  var props = PropertiesService.getScriptProperties();

  var folder = DriveApp.getFolderById(props.getProperty('NEWSLETTER_FOLDER_ID'));
  var files = folder.getFilesByType(MimeType.GOOGLE_DOCS);
  var newest = null;
  while (files.hasNext()) {
    var f = files.next();
    if (!newest || f.getDateCreated() > newest.getDateCreated()) newest = f;
  }
  if (!newest) { Logger.log('Abort: no Google Doc in the folder.'); return; }

  if (newest.getId() === props.getProperty('LAST_SENT_DOC_ID')) {
    Logger.log('Abort: newest newsletter already sent.'); return;
  }

  var minutesSinceEdit = (Date.now() - newest.getLastUpdated().getTime()) / 60000;
  if (minutesSinceEdit < MIN_SETTLE_MINUTES) {
    Logger.log('Abort: Doc edited ' + minutesSinceEdit.toFixed(0) +
      ' min ago; waiting for it to settle.'); return;
  }

  var last = Number(props.getProperty('LAST_NEWSLETTER_SENT') || 0);
  var daysSince = (Date.now() - last) / 86400000;
  if (last && daysSince < MIN_DAYS_BETWEEN) {
    Logger.log('Abort: only ' + daysSince.toFixed(1) + ' days since last send (min ' +
      MIN_DAYS_BETWEEN + ').'); return;
  }

  var doc = DocumentApp.openById(newest.getId());
  var subject = doc.getName();
  var body = doc.getBody().getText().trim();
  if (!body) { Logger.log('Abort: newsletter Doc is empty.'); return; }

  var emails = getSubscribers(props.getProperty('SHEET_ID'));
  if (emails.length === 0) { Logger.log('Abort: no subscribers.'); return; }

  var unsubscribe = '\n\n----\nTo unsubscribe, reply to this email with "unsubscribe".';
  emails.forEach(function (email) {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body + unsubscribe,
      name: 'BC Tamil Catholic Family',
    });
  });

  props.setProperty('LAST_SENT_DOC_ID', newest.getId());
  props.setProperty('LAST_NEWSLETTER_SENT', String(Date.now()));
  Logger.log('Sent "' + subject + '" to ' + emails.length + ' subscriber(s).');
}

function getSubscribers(sheetId) {
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName(SUBSCRIBERS_SHEET);
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet
    .getRange(2, 2, sheet.getLastRow() - 1, 2) // columns B (email) + C (status)
    .getValues()
    .filter(function (r) { return String(r[1]).trim().toLowerCase() !== 'unsubscribed'; })
    .map(function (r) { return String(r[0]).trim(); })
    .filter(function (e) { return e; });
}
