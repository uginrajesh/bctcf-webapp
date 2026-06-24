// Newsletter SEND — automatic, Drive-folder driven, with PDF attachment.
// Each month, upload TWO files (same base name) to a dedicated Drive folder:
//   - a Google Doc  e.g. "June 2026 Newsletter"        -> email subject + body
//   - a PDF         e.g. "June 2026 Newsletter.pdf"    -> attached to the email
// A time-driven trigger picks up the newest Doc, attaches the matching PDF,
// emails every subscriber, then records it so it's never sent twice.
//
// (Write the newsletter locally, then upload both files. The Doc must be a
//  Google Doc — when you upload a .docx, open it with Google Docs / let Drive
//  convert it, or keep "Convert uploads" on in Drive settings.)
//
// Setup:
//   Script Properties:
//     SHEET_ID             = the Newsletter Subscribers spreadsheet id
//     NEWSLETTER_FOLDER_ID = the Drive folder you upload newsletter files into
//     ARCHIVE_FOLDER_ID    = a subfolder; sent Doc + PDF are moved here after
//                            sending (optional — omit to leave files in place)
//   Trigger: checkAndSendNewsletter | Time-driven | Hour/Day timer.
//   You can also Run checkAndSendNewsletter manually to send immediately.
//
// Guardrails (any failing one aborts and just logs why):
//   1. Same Doc is never sent twice (tracks LAST_SENT_DOC_ID).
//   2. At least MIN_DAYS_BETWEEN days since the last send.
//   3. The Doc must be unedited for MIN_SETTLE_MINUTES — a draft won't go out.
//   4. The Doc must be non-empty and there must be at least one subscriber.

var SUBSCRIBERS_SHEET = 'Subscribers';
var MIN_DAYS_BETWEEN = 24;
var MIN_SETTLE_MINUTES = 30;

// true  -> the email body is the Google Doc's text (the PDF is also attached).
// false -> the email body is the short GENERIC_BODY below, and readers open the
//          attached PDF for the full newsletter.
var INCLUDE_DOC_BODY = true;
var GENERIC_BODY =
  'Dear friends in Christ,\n\n' +
  "Please find this month's BC Tamil Catholic Family newsletter attached.\n\n" +
  'God bless,\nBC Tamil Catholic Family';

function checkAndSendNewsletter() {
  var props = PropertiesService.getScriptProperties();
  var folder = DriveApp.getFolderById(props.getProperty('NEWSLETTER_FOLDER_ID'));

  // Newest Google Doc = the email body source.
  var docs = folder.getFilesByType(MimeType.GOOGLE_DOCS);
  var newest = null;
  while (docs.hasNext()) {
    var f = docs.next();
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
  var body;
  if (INCLUDE_DOC_BODY) {
    body = doc.getBody().getText().trim();
    if (!body) { Logger.log('Abort: newsletter Doc is empty.'); return; }
  } else {
    body = GENERIC_BODY;
  }

  // Matching PDF (same base name) becomes the attachment, if present.
  var attachments = [];
  var pdf = findPdfByBaseName(folder, baseName(newest.getName()));
  if (pdf) attachments.push(pdf.getBlob());
  else Logger.log('Note: no matching PDF for "' + newest.getName() + '"; sending without attachment.');

  if (!INCLUDE_DOC_BODY && attachments.length === 0) {
    Logger.log('Abort: generic body selected but no PDF attached — nothing to send.');
    return;
  }

  var emails = getSubscribers(props.getProperty('SHEET_ID'));
  if (emails.length === 0) { Logger.log('Abort: no subscribers.'); return; }

  var unsubscribe = '\n\n----\nTo unsubscribe, reply to this email with "unsubscribe".';
  emails.forEach(function (email) {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body + unsubscribe,
      name: 'BC Tamil Catholic Family',
      attachments: attachments,
    });
  });

  props.setProperty('LAST_SENT_DOC_ID', newest.getId());
  props.setProperty('LAST_NEWSLETTER_SENT', String(Date.now()));

  // Move the sent Doc (and its PDF) into the Archive subfolder so the active
  // folder only ever holds the next newsletter.
  var archiveId = props.getProperty('ARCHIVE_FOLDER_ID');
  if (archiveId) {
    var archive = DriveApp.getFolderById(archiveId);
    newest.moveTo(archive);
    if (pdf) pdf.moveTo(archive);
  }

  Logger.log('Sent "' + subject + '" to ' + emails.length + ' subscriber(s)' +
    (attachments.length ? ' with PDF' : ' (no PDF)') +
    (archiveId ? '; archived the files.' : '.'));
}

// Strips a trailing .gdoc/.doc/.docx/.pdf so the Doc and PDF can be matched.
function baseName(name) {
  return name.replace(/\.(gdoc|docx?|pdf)$/i, '').trim();
}

function findPdfByBaseName(folder, base) {
  var pdfs = folder.getFilesByType(MimeType.PDF);
  while (pdfs.hasNext()) {
    var p = pdfs.next();
    if (baseName(p.getName()).toLowerCase() === base.toLowerCase()) return p;
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
