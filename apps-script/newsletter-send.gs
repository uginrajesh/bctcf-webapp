// Newsletter SEND - automatic, Drive-folder driven, PDF-anchored.
// Each month, upload your newsletter PDF to a dedicated Drive folder:
//   - a PDF  e.g. "June 2026 Newsletter.pdf"  -> the email's attachment.
// A time-driven trigger picks up the newest PDF, emails every subscriber with
// the PDF attached, then records it so it's never sent twice.
//
// The PDF is the newsletter (keeps all its layout/images). The email body is a
// short note telling people to open the attachment - see GENERIC_BODY below.
// (Write the newsletter in Word locally, export a PDF, upload the PDF. You can
//  also upload the .docx alongside it for your own records; the script ignores
//  everything that isn't a PDF.)
//
// Setup:
//   Script Properties:
//     SHEET_ID             = the Newsletter Subscribers spreadsheet id
//     NEWSLETTER_FOLDER_ID = the Drive folder you upload the newsletter PDF into
//     ARCHIVE_FOLDER_ID    = a subfolder; the sent PDF (and a matching .docx, if
//                            present) are moved here after sending (optional -
//                            omit to leave files in place)
//   Trigger: checkAndSendNewsletter | Time-driven | Hour/Day timer.
//   You can also Run checkAndSendNewsletter manually to send immediately.
//
// Guardrails (any failing one aborts and just logs why):
//   1. The same PDF is never sent twice (tracks LAST_SENT_PDF_ID).
//   2. At least MIN_DAYS_BETWEEN days since the last send.
//   3. The PDF must be untouched for MIN_SETTLE_MINUTES - a file you're still
//      uploading/replacing won't go out mid-upload.
//   4. There must be at least one subscriber.

var SUBSCRIBERS_SHEET = 'Subscribers';
var MIN_DAYS_BETWEEN = 24;
var MIN_SETTLE_MINUTES = 30;

// The email body. The PDF carries the actual newsletter, so this is just a short
// note pointing readers to the attachment.
var GENERIC_BODY =
  'Dear friends in Christ,\n\n' +
  "Please find this month's BC Tamil Catholic Family newsletter attached.\n\n" +
  'God bless,\nBC Tamil Catholic Family';

function checkAndSendNewsletter() {
  var props = PropertiesService.getScriptProperties();
  var folder = DriveApp.getFolderById(props.getProperty('NEWSLETTER_FOLDER_ID'));

  // Newest PDF = the newsletter to send.
  var pdfs = folder.getFilesByType(MimeType.PDF);
  var newest = null;
  while (pdfs.hasNext()) {
    var f = pdfs.next();
    if (!newest || f.getDateCreated() > newest.getDateCreated()) newest = f;
  }
  if (!newest) { Logger.log('Abort: no PDF in the folder.'); return; }

  if (newest.getId() === props.getProperty('LAST_SENT_PDF_ID')) {
    Logger.log('Abort: newest newsletter already sent.'); return;
  }

  var minutesSinceEdit = (Date.now() - newest.getLastUpdated().getTime()) / 60000;
  if (minutesSinceEdit < MIN_SETTLE_MINUTES) {
    Logger.log('Abort: PDF updated ' + minutesSinceEdit.toFixed(0) +
      ' min ago; waiting for it to settle.'); return;
  }

  var last = Number(props.getProperty('LAST_NEWSLETTER_SENT') || 0);
  var daysSince = (Date.now() - last) / 86400000;
  if (last && daysSince < MIN_DAYS_BETWEEN) {
    Logger.log('Abort: only ' + daysSince.toFixed(1) + ' days since last send (min ' +
      MIN_DAYS_BETWEEN + ').'); return;
  }

  var emails = getSubscribers(props.getProperty('SHEET_ID'));
  if (emails.length === 0) { Logger.log('Abort: no subscribers.'); return; }

  var subject = baseName(newest.getName());
  var attachment = newest.getBlob();
  var unsubscribe = '\n\n----\nTo unsubscribe, reply to this email and we\'ll remove you from the list.';
  emails.forEach(function (email) {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: GENERIC_BODY + unsubscribe,
      name: 'BC Tamil Catholic Family',
      attachments: [attachment],
    });
  });

  props.setProperty('LAST_SENT_PDF_ID', newest.getId());
  props.setProperty('LAST_NEWSLETTER_SENT', String(Date.now()));

  // Move the sent PDF (and a matching .docx, if present) into the Archive
  // subfolder so the active folder only ever holds the next newsletter.
  var archiveId = props.getProperty('ARCHIVE_FOLDER_ID');
  if (archiveId) {
    var archive = DriveApp.getFolderById(archiveId);
    newest.moveTo(archive);
    var companion = findCompanion(folder, baseName(newest.getName()));
    if (companion) companion.moveTo(archive);
  }

  Logger.log('Sent "' + subject + '" to ' + emails.length + ' subscriber(s) with PDF' +
    (archiveId ? '; archived the files.' : '.'));
}

// Strips a trailing .gdoc/.doc/.docx/.pdf so the PDF and its source doc match.
function baseName(name) {
  return name.replace(/\.(gdoc|docx?|pdf)$/i, '').trim();
}

// Finds the non-PDF file (e.g. the .docx source) that shares the PDF's base name.
function findCompanion(folder, base) {
  var files = folder.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    if (f.getMimeType() === MimeType.PDF) continue;
    if (baseName(f.getName()).toLowerCase() === base.toLowerCase()) return f;
  }
  return null;
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
