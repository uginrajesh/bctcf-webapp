// Newsletter UNSUBSCRIBE - automatic, Gmail-driven. OFF by default.
//
// When someone replies "unsubscribe" to a newsletter, the reply lands in the
// community inbox (bctamilcatholicfamily@gmail.com). This script scans for those
// replies and sets the sender's Status to "unsubscribed" in the Subscribers
// sheet, so newsletter-send.gs skips them. The reply is then marked read so it
// isn't processed twice.
//
// It is DISABLED until you set ENABLED = true AND add a time-driven trigger -
// until then, running it just logs that it's off and changes nothing. Enable it
// later if hand-processing unsubscribe replies ever becomes a chore.
//
// To enable:
//   1. Put this in the SAME Apps Script project as newsletter-send.gs (it reuses
//      the SHEET_ID Script Property), or a new project with SHEET_ID set.
//   2. Set ENABLED = true below.
//   3. Run processUnsubscribes once and grant the Gmail authorization prompt.
//   4. Triggers -> Add Trigger -> processUnsubscribes -> Time-driven -> Hour timer.
//
// Caveat: it can only match replies sent from the SAME address the person
// subscribed with. Replies from a different address are left unread and logged
// so a coordinator can handle them by hand - so glance at the inbox now and then.

var ENABLED = false;
var SUBSCRIBERS_SHEET = 'Subscribers';
// Unread inbox messages from the last 60 days that mention "unsubscribe".
var SEARCH_QUERY = 'in:inbox is:unread newer_than:60d "unsubscribe"';

function processUnsubscribes() {
  if (!ENABLED) {
    Logger.log('Unsubscribe processing is OFF (set ENABLED = true to enable).');
    return;
  }

  var sheet = SpreadsheetApp
    .openById(PropertiesService.getScriptProperties().getProperty('SHEET_ID'))
    .getSheetByName(SUBSCRIBERS_SHEET);
  if (!sheet) { Logger.log('Abort: Subscribers sheet not found.'); return; }

  var threads = GmailApp.search(SEARCH_QUERY);
  var unsubscribed = 0, unmatched = 0;

  for (var t = 0; t < threads.length; t++) {
    var messages = threads[t].getMessages();
    for (var m = 0; m < messages.length; m++) {
      var msg = messages[m];
      if (!msg.isUnread()) continue;
      if (!/unsubscribe/i.test(msg.getPlainBody())) continue;

      var from = extractEmail(msg.getFrom());
      if (from && markUnsubscribed(sheet, from)) {
        msg.markRead();      // handled - don't process again
        unsubscribed++;
      } else {
        // Left unread on purpose so a coordinator notices and handles it.
        Logger.log('Could not match "' + from + '" to a subscriber - handle by hand.');
        unmatched++;
      }
    }
  }

  Logger.log('Unsubscribed ' + unsubscribed + ' subscriber(s); ' +
    unmatched + ' reply(ies) need manual review.');
}

// "Name <email@x.com>" -> "email@x.com"; "email@x.com" -> "email@x.com".
function extractEmail(from) {
  var m = String(from).match(/<([^>]+)>/);
  return (m ? m[1] : String(from)).trim().toLowerCase();
}

// Sets column C (Status) to "unsubscribed" for the row whose column B (Email)
// matches. Returns true if a matching, not-already-unsubscribed row was updated.
function markUnsubscribed(sheet, email) {
  if (sheet.getLastRow() < 2) return false;
  var rows = sheet.getRange(2, 2, sheet.getLastRow() - 1, 2).getValues(); // B + C
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][0]).trim().toLowerCase() !== email) continue;
    if (String(rows[i][1]).trim().toLowerCase() === 'unsubscribed') return false;
    sheet.getRange(i + 2, 3).setValue('unsubscribed'); // column C of this row
    return true;
  }
  return false;
}
