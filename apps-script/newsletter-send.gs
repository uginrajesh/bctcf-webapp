// Newsletter SEND (scaffold — for when you start sending newsletters).
// Reads the newsletter body from a Google Doc and emails it to everyone in the
// Subscribers sheet. Built with guardrails so an accidental run can't blast an
// email or double-send.
//
// Setup (later):
//   Script Properties:
//     SHEET_ID            = the Newsletter Subscribers spreadsheet id
//     NEWSLETTER_DOC_ID   = a Google Doc holding this month's newsletter
//     NEWSLETTER_ARMED    = "true"  (safety switch; set to "true" only when ready)
//   Run sendNewsletter() manually, or add a trigger later (e.g. when a Doc is
//   dropped in a Drive folder).
//
// Guardrails (all must pass, else it aborts and logs why):
//   1. NEWSLETTER_ARMED must equal "true".
//   2. At least MIN_DAYS_BETWEEN days since the last send (stored in
//      LAST_NEWSLETTER_SENT) — prevents accidental repeat sends.
//   3. The Doc must have non-empty content.

var SUBSCRIBERS_SHEET = 'Subscribers';
var MIN_DAYS_BETWEEN = 24;

function sendNewsletter() {
  var props = PropertiesService.getScriptProperties();

  if (props.getProperty('NEWSLETTER_ARMED') !== 'true') {
    Logger.log('Aborted: NEWSLETTER_ARMED is not "true".');
    return;
  }

  var last = Number(props.getProperty('LAST_NEWSLETTER_SENT') || 0);
  var daysSince = (Date.now() - last) / (24 * 60 * 60 * 1000);
  if (last && daysSince < MIN_DAYS_BETWEEN) {
    Logger.log('Aborted: only ' + daysSince.toFixed(1) + ' days since last send (min ' +
      MIN_DAYS_BETWEEN + ').');
    return;
  }

  var doc = DocumentApp.openById(props.getProperty('NEWSLETTER_DOC_ID'));
  var subject = doc.getName();
  var body = doc.getBody().getText().trim();
  if (!body) {
    Logger.log('Aborted: newsletter Doc is empty.');
    return;
  }

  var emails = getSubscribers(props.getProperty('SHEET_ID'));
  if (emails.length === 0) {
    Logger.log('Aborted: no subscribers.');
    return;
  }

  var unsubscribe = '\n\n----\nTo unsubscribe, reply to this email with "unsubscribe".';
  emails.forEach(function (email) {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body + unsubscribe,
      name: 'BC Tamil Catholic Family',
    });
  });

  props.setProperty('LAST_NEWSLETTER_SENT', String(Date.now()));
  // One-shot safety: re-arm intentionally before the next send.
  props.setProperty('NEWSLETTER_ARMED', 'false');
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
