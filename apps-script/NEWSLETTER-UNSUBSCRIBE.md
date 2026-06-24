# Automated newsletter unsubscribe - setup guide

This explains how the unsubscribe flow works and how to turn on the automated
version (`newsletter-unsubscribe.gs`) when you're ready. It ships **disabled**,
so today nothing runs until you follow the steps below.

---

## How unsubscribe works today (manual - no setup needed)

1. Every newsletter ends with a footer:
   *"To unsubscribe, reply to this email and we'll remove you from the list."*
2. Because newsletters are sent **from** `bctamilcatholicfamily@gmail.com`, a
   reply lands in **that Gmail inbox**.
3. A coordinator opens the **Subscribers** sheet, finds the person's row, and
   types `unsubscribed` in the **Status** column (column C).
4. Done. `newsletter-send.gs` reads `getSubscribers()`, which skips any row whose
   status is `unsubscribed`, so they get no further newsletters.

For a small list this manual step is perfectly fine. Automate it only if the
replies ever become frequent enough to be a chore.

---

## What the automated version does

`newsletter-unsubscribe.gs` runs on a timer and does the manual step for you:

- Searches the inbox for **unread** messages from the last 60 days that mention
  "unsubscribe" (`in:inbox is:unread newer_than:60d "unsubscribe"`).
- For each match, reads the sender's email, finds that address in the
  Subscribers sheet, and sets its **Status** to `unsubscribed`.
- Marks the reply **read** so it's never processed twice.
- If a reply's sender address isn't in the sheet (e.g. they replied from a
  different email), it leaves the message **unread** and logs it, so a
  coordinator can handle that one by hand.

It changes nothing else and never deletes rows - it only sets the status.

---

## Prerequisites

- The **Subscribers** Google Sheet, with columns:
  - **A** Timestamp · **B** Email · **C** Status
- The same Google account that sends the newsletter
  (`bctamilcatholicfamily@gmail.com`) - the script reads that account's inbox.

---

## Enable it - step by step

1. **Open the script project.** Easiest is to reuse the project that already has
   `newsletter-send.gs` (it already holds the `SHEET_ID` Script Property).
   - Apps Script editor → that project. If you instead want a brand-new project,
     create one and add a Script Property `SHEET_ID` = the Subscribers sheet id
     (the long string in the sheet's URL between `/d/` and `/edit`).

2. **Add the file.** Create a new script file named `newsletter-unsubscribe`
   and paste in the contents of `apps-script/newsletter-unsubscribe.gs`.

3. **Turn it on.** Near the top of the file, change:
   ```js
   var ENABLED = false;
   ```
   to
   ```js
   var ENABLED = true;
   ```
   Save (Ctrl/Cmd+S).

4. **Authorize Gmail access.** In the editor's function dropdown pick
   `processUnsubscribes` and click **Run**. The first run prompts for permission
   to read Gmail and edit the sheet - review and **Allow**. (You're granting the
   community account access to its own inbox.)

5. **Test it once.**
   - From a test address that **is** in your Subscribers sheet, send an email to
     `bctamilcatholicfamily@gmail.com` with the word *unsubscribe* in the body.
   - Run `processUnsubscribes` again.
   - Check **Executions** - the log should say `Unsubscribed 1 subscriber(s)`,
     the test address's Status in the sheet should now read `unsubscribed`, and
     the test email should be marked read.

6. **Schedule it.** Triggers (clock icon) → **Add Trigger**:
   - Function: `processUnsubscribes`
   - Event source: **Time-driven**
   - Type: **Hour timer → every hour** (or whatever cadence you like).
   - Save.

That's it - unsubscribe requests are now handled automatically, with anything it
can't match flagged in the logs for a human.

---

## Turn it back off

Set `var ENABLED = false;` (it becomes a no-op even if the trigger still fires),
or delete the `processUnsubscribes` trigger in the **Triggers** screen. Either
one stops it; doing both is cleanest.

---

## Good to know / limitations

- **Address must match.** It can only match a reply to a subscriber if the reply
  comes from the **same email** they subscribed with. Mismatches are left unread
  and logged - so glance at the inbox occasionally even with automation on.
- **Quoted footers help, not hurt.** A reply usually quotes the original email,
  which contains the word "unsubscribe" - that's fine, it just helps the search
  match the genuine reply.
- **No double-processing.** Once handled, a message is marked read and excluded
  by the `is:unread` search next time.
- **Sheet shape matters.** It assumes Email in column B and Status in column C.
  If you rearrange the sheet, update the column numbers in
  `markUnsubscribed()` / the `getRange(...)` calls.
