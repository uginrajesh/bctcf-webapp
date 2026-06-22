// Deploy: bound to a Google Sheet "BCTCF New Members".
// Extensions → Apps Script. Set Script Property SHARED_SECRET to match
// APPS_SCRIPT_SECRET in Vercel. Deploy → New deployment → Web app,
// Execute as: Me, Who has access: Anyone. Copy the /exec URL into Vercel's
// APPS_SCRIPT_URL.

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var expected = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!expected || body.secret !== expected) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Members')
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Members');
    sheet.appendRow([
      new Date(), body.name || '', body.email || '', body.phone || '',
      body.familySize || '', body.heardFrom || '',
    ]);

    MailApp.sendEmail({
      to: 'bctamilcatholicfamily@gmail.com',
      subject: 'New Member Registration: ' + (body.name || 'Unknown'),
      body: [
        'A new family has registered on the website:',
        '',
        'Name: ' + (body.name || ''),
        'Email: ' + (body.email || ''),
        'Phone (WhatsApp): ' + (body.phone || ''),
        'Family size: ' + (body.familySize || ''),
        'Heard from: ' + (body.heardFrom || ''),
        '',
        'A coordinator should review and add them to the WhatsApp group.',
      ].join('\n'),
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // Log to an "Error Log" sheet for manual retry.
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var log = ss.getSheetByName('Error Log') || ss.insertSheet('Error Log');
    log.appendRow([new Date(), 'new-member', String(err)]);
    return ContentService.createTextOutput(JSON.stringify({ ok: false }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
