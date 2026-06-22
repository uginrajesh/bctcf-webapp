// Deploy: bound to the prayer-requests responses Sheet.
// Set Script Property CALENDAR_ID to the community calendar id.
// Triggers → Add trigger → sendPrayerDigestIfMassTomorrow →
//   Time-driven → Day timer → 8pm–9pm.
// Adjust SHEET_NAME, the timestamp/intention column indexes, and the
// MASS_KEYWORD if your form/calendar differ.

var MASS_KEYWORD = 'holy mass';
var SHEET_NAME = 'Form Responses 1';
var TIMESTAMP_COL = 0;   // column A = submission timestamp
var INTENTION_COL = 1;   // column B = the prayer intention text

// --- copied verbatim from src/lib/digest-window.ts (keep in sync) ---
function computeDigestWindow(now, massDatesISO) {
  var nowMs = now.getTime();
  var in24h = nowMs + 24 * 60 * 60 * 1000;
  var sorted = massDatesISO
    .map(function (s) { return { s: s, t: new Date(s).getTime() }; })
    .filter(function (x) { return !isNaN(x.t); })
    .sort(function (a, b) { return a.t - b.t; });
  var next = null;
  for (var i = 0; i < sorted.length; i++) {
    if (sorted[i].t >= nowMs && sorted[i].t <= in24h) { next = sorted[i]; break; }
  }
  if (!next) return { sendToday: false, sinceISO: null, nextMassISO: null };
  var prev = null;
  for (var j = sorted.length - 1; j >= 0; j--) {
    if (sorted[j].t < next.t && sorted[j].t < nowMs) { prev = sorted[j]; break; }
  }
  return {
    sendToday: true,
    sinceISO: prev ? prev.s : new Date(0).toISOString(),
    nextMassISO: next.s,
  };
}
// --- end copied logic ---

function sendPrayerDigestIfMassTomorrow() {
  var props = PropertiesService.getScriptProperties();
  var calId = props.getProperty('CALENDAR_ID');
  if (!calId) return;

  var now = new Date();
  var horizon = new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000);
  var past = new Date(now.getTime() - 95 * 24 * 60 * 60 * 1000);
  var cal = CalendarApp.getCalendarById(calId);
  var events = cal.getEvents(past, horizon);

  var massISO = events
    .filter(function (ev) { return ev.getTitle().toLowerCase().indexOf(MASS_KEYWORD) !== -1; })
    .map(function (ev) { return ev.getStartTime().toISOString(); });

  var w = computeDigestWindow(now, massISO);
  if (!w.sendToday) return;

  var since = new Date(w.sinceISO).getTime();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return;
  var rows = sheet.getDataRange().getValues();

  var intentions = [];
  for (var i = 1; i < rows.length; i++) { // skip header
    var ts = new Date(rows[i][TIMESTAMP_COL]).getTime();
    if (!isNaN(ts) && ts >= since) {
      var text = String(rows[i][INTENTION_COL] || '').trim();
      if (text) intentions.push('• ' + text);
    }
  }

  if (intentions.length === 0) return; // skip empty digest

  var massDate = Utilities.formatDate(new Date(w.nextMassISO),
    Session.getScriptTimeZone(), 'EEEE, MMMM d, yyyy');

  MailApp.sendEmail({
    to: 'bctamilcatholicfamily@gmail.com',
    subject: 'Prayer Intentions for Holy Mass — ' + massDate,
    body: [
      'Prayer intentions submitted since the last Mass, for ' + massDate + ':',
      '',
      intentions.join('\n'),
      '',
      '(' + intentions.length + ' intention(s). Gmail rules forward this to coordinators and clergy.)',
    ].join('\n'),
  });
}
