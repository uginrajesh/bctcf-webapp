// Deploy: bound to the New Members Google Form (NOT the Sheet).
//   Open the Form → ⋮ (top-right) → Script editor → paste this file.
//   Triggers → Add trigger → onNewMemberSubmit →
//     Event source: From form → On form submit.
// Emails bctamilcatholicfamily@gmail.com with every field of each new
// submission, so a coordinator can manually add the contact to the group.
// Field names follow whatever questions the Form has — no edits needed
// if you add/remove/rename questions later.

var NOTIFY_TO = 'bctamilcatholicfamily@gmail.com';

function onNewMemberSubmit(e) {
  if (!e || !e.namedValues) return;

  var lines = [];
  var nameForSubject = '';
  for (var question in e.namedValues) {
    var answer = e.namedValues[question].join(', ').trim();
    if (!answer) continue;
    lines.push(question + ': ' + answer);
    if (!nameForSubject && /name/i.test(question)) nameForSubject = answer;
  }

  if (lines.length === 0) return; // nothing submitted

  var subject = 'New Member Registration' + (nameForSubject ? ' — ' + nameForSubject : '');

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
