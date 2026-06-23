// Deploy: bound to the New Members Google Form (NOT the Sheet).
//   Open the Form → ⋮ (top-right) → Script editor → paste this file.
//   Triggers → Add trigger → onNewMemberSubmit →
//     Event source: From form → On form submit.
// Emails bctamilcatholicfamily@gmail.com with every field of each new
// submission, so a coordinator can manually add the contact to the group.
// Field names follow whatever questions the Form has - no edits needed
// if you add/remove/rename questions later.

var NOTIFY_TO = 'bctamilcatholicfamily@gmail.com';

function onNewMemberSubmit(e) {
  var lines = [];
  var nameForSubject = '';

  function add(question, answer) {
    answer = String(answer == null ? '' : answer).trim();
    if (!answer) return;
    lines.push(question + ': ' + answer);
    if (!nameForSubject && /name/i.test(question)) nameForSubject = answer;
  }

  if (e && e.response && e.response.getItemResponses) {
    // Form-bound "On form submit" trigger
    var items = e.response.getItemResponses();
    for (var i = 0; i < items.length; i++) {
      var ans = items[i].getResponse();
      add(items[i].getItem().getTitle(), Array.isArray(ans) ? ans.join(', ') : ans);
    }
  } else if (e && e.namedValues) {
    // Sheet-bound "On form submit" trigger (fallback)
    for (var q in e.namedValues) add(q, e.namedValues[q].join(', '));
  } else {
    return; // not a form-submit event
  }

  if (lines.length === 0) return; // nothing submitted

  var subject = 'New Member Registration' + (nameForSubject ? ' - ' + nameForSubject : '');

  MailApp.sendEmail({
    to: NOTIFY_TO,
    subject: subject,
    body: [
      'A new member just registered through the website form:',
      '',
      lines.join('\n'),
      '',
      '(Add this contact to the general members group. Gmail rules can forward this to coordinators.)',
    ].join('\n'),
  });
}
