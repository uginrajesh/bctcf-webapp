# BC Tamil Catholic Family - Website

A modern, warm, bilingual (English + Tamil) community website for **BC Tamil Catholic Family (BCTCF)**, a Tamil-speaking Catholic community in British Columbia, Canada.

- **Live:** https://bctcf-webapp.vercel.app
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · `next-intl` · Vitest
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Design spec:** `docs/superpowers/specs/2026-06-21-bctcf-website-design.md`
- **Implementation plan:** `docs/superpowers/plans/2026-06-21-bctcf-website.md`

No database. Events come from Google Calendar; New Members and Prayer Requests embed Google Forms; two Apps Scripts handle email automation - a calendar-driven prayer-intentions digest and an instant new-member notification.

---

## Prerequisites

- **Node.js** v24.x (project built/tested on v24.17.0, npm 11.x).
  - On the original Windows dev machine Node is installed at `C:\Program Files\nodejs` and is **not** on the default PATH; in a POSIX shell prefix commands with:
    ```bash
    export PATH="/c/Program Files/nodejs:$PATH"
    ```

## Local development

```bash
npm install
npm run dev      # http://localhost:3000  (redirects to /en)
npm test         # Vitest unit tests
npm run build    # production build
```

Routes are locale-prefixed: `/en/...` and `/ta/...`. The language toggle (top-right) switches between them while preserving the current path.

## Editing content

| Content | How to update | Effect |
|---|---|---|
| Events | Add/edit in the community **Google Calendar** | Site refreshes within ~60 min (ISR) |
| Hero photos | Drop image files into `public/hero/` | Auto-included in the hero carousel on next push |
| Home announcements | Edit `src/data/announcements.json` | Auto-deploys (~30s) |
| Footer resource links | Edit `src/data/resources.json` (`label` + `url`) | Auto-deploys |
| About - Story / Mission / Vision, and all UI text | Edit `src/messages/en.json` / `src/messages/ta.json` | Auto-deploys |
| Social / form / newsletter links | Edit `src/config/site.ts` | Auto-deploys |
| Prayer Requests / New Members | The pages **embed Google Forms** (see `src/config/site.ts`) | Edit the Google Form directly; no redeploy needed |

> **Coordinators** are the volunteers who hold the shared community Google account (`bctamilcatholicfamily@gmail.com`) and run activities. The role is always "coordinator(s)", never "board member(s)".

## Forms (Google Forms)

Two community Google Forms are embedded directly in the site:

- **New Members** - `SITE.newMemberFormUrl` in `src/config/site.ts` → embedded on `/new-members`.
- **Prayer Requests + Mass availability + intentions** - `SITE.prayerFormUrl` → embedded on `/prayer-requests`.

Responses land in each Form's linked Google Sheet. To change a form, edit it in Google Forms (no code change); to point the site at a different form, update the URL in `src/config/site.ts`.

## Environment variables

Copy `.env.example` to `.env.local` for local dev, and set the same keys in **Vercel → Settings → Environment Variables** for production. They are read server-side only and never exposed to the browser.

| Variable | Used by | Where it comes from |
|---|---|---|
| `GOOGLE_CALENDAR_API_KEY` | Events page | Google Cloud Console → APIs & Services → Credentials (restrict to Calendar API) |
| `GOOGLE_CALENDAR_ID` | Events page | The community Google Calendar's "Calendar ID" (Calendar settings → Integrate calendar) |

With the calendar vars unset, the Events page simply shows a friendly empty state (no crash).

## Prayer-digest Apps Script (Google-side, deployed manually)

`apps-script/prayer-digest.gs` emails a digest of prayer intentions to `bctamilcatholicfamily@gmail.com` the day before each Mass, reading Mass dates from the community Google Calendar.

1. Open the Prayer Requests Google Form's responses Sheet → Extensions → Apps Script; paste the file.
2. Script Properties → add `CALENDAR_ID` (the community calendar id).
3. Triggers → Add trigger → `sendPrayerDigestIfMassTomorrow` → Time-driven → Day timer → 8pm-9pm.
4. Mass events on the calendar must contain the keyword **"Holy Mass"** in their title.
5. Adjust `SHEET_NAME` and the **column indexes** (`TIMESTAMP_COL`, `FAMILY_NAME_COL`, `INTENTION_COL`) at the top of the file to match your Form's response columns. Rows with an empty intention are skipped; each kept line is emailed as `Family Name - "Intention"` with a blank line between intentions.
6. Test: temporarily add a "Holy Mass" event for tomorrow + a test form response, Run the function, confirm the digest email (and that with zero new intentions it sends a short "no new intentions" note rather than nothing).

> The window-calculation logic in `prayer-digest.gs` is copied verbatim from `src/lib/digest-window.ts` (which is unit-tested). If you change one, change both.

**Optional auto-print:** the digest can also print itself. It's **off by default** (`PRINTER_EMAIL = ''`). To enable, set `PRINTER_EMAIL` to your printer's email-to-print address (HP ePrint / Epson Email Print, etc.); the script attaches the intentions as a PDF and emails it there. Add that address to the printer's **allowed-senders** list so only this account can print. ePrint queues the job in the cloud, so it prints once the printer is on - it does not need to be on 24/7. (Enabling triggers a one-time Drive/Docs authorization prompt.)

## New-member notification Apps Script (Google-side, deployed manually)

`apps-script/new-member-notify.gs` emails `bctamilcatholicfamily@gmail.com` the moment anyone submits the New Members form, listing every field so a coordinator can add the contact to the members group.

1. Open the **New Members Google Form** → ⋮ (top-right) → **Script editor**; paste the file.
2. Triggers → Add trigger → `onNewMemberSubmit` → Event source **From form** → **On form submit** → Save (authorize when prompted).
3. Test: submit a test response and confirm the notification email arrives.

It reads fields generically, so adding/renaming Form questions later needs no code change.

## Newsletter (subscribe + send)

The footer (every page) has a **monthly newsletter** signup. Subscribers are saved to a Google Sheet via an Apps Script Web App; sending is a separate, guarded script for later.

**Capture subscribers — `apps-script/newsletter-subscribe.gs`:**
1. Create a Google Sheet (e.g. "Newsletter Subscribers"); copy its id from the URL.
2. New Apps Script → paste the file → Script Properties → add `SHEET_ID`.
3. Deploy → New deployment → **Web app** → Execute as **Me**, access **Anyone**.
4. Paste the Web app URL into `SITE.newsletterEndpoint` in `src/config/site.ts`.

Until `newsletterEndpoint` is set, the form still renders and thanks the user, but nothing is saved. The site posts `{ email }`; the script appends `[timestamp, email, status]` and skips duplicates.

**Send a newsletter — `apps-script/newsletter-send.gs` (automatic, Drive-folder driven):**
Each month, upload **two same-named files** to a dedicated Drive folder — a Google Doc (e.g. `June 2026 Newsletter`, used as the email subject + body) and a PDF (`June 2026 Newsletter.pdf`, attached to the email). A time-driven trigger picks up the newest Doc, attaches the matching PDF, emails every subscriber, then records it so it's never sent twice. Setup: Script Properties `SHEET_ID` (subscribers sheet) + `NEWSLETTER_FOLDER_ID` (the Drive folder), and a time-driven trigger on `checkAndSendNewsletter` (Hour/Day timer). The body source must be a **Google Doc** (when uploading a `.docx`, let Drive convert it / open with Google Docs). Guardrails so an accidental run can't blast email: never sends the same Doc twice (`LAST_SENT_DOC_ID`), at least `MIN_DAYS_BETWEEN` (24) days between sends, and the Doc must be unedited for `MIN_SETTLE_MINUTES` (30) so a draft you're still writing won't go out. Unsubscribe is a footer line in each email (recipients can also unsubscribe from their mail client).

---

## Launch checklist

Functional code is complete; these items are real-world content/config the community supplies before going public:

- [ ] Real social media URLs (Facebook, Instagram, YouTube, WhatsApp) in `src/config/site.ts`
- [ ] Newsletter subscribe endpoint (`newsletter-subscribe.gs` deployed; URL in `SITE.newsletterEndpoint`)
- [ ] Footer resource links curated in `src/data/resources.json`
- [ ] `GOOGLE_CALENDAR_API_KEY` + `GOOGLE_CALENDAR_ID` set in Vercel
- [ ] Mass events titled with "Holy Mass" in the community calendar
- [ ] `prayer-digest.gs` deployed with `CALENDAR_ID` + the daily trigger, and column indexes verified
- [ ] `new-member-notify.gs` deployed on the New Members form with an on-form-submit trigger
- [ ] Hero photos added to `public/hero/`
- [ ] Header logo text decision confirmed (keep/drop the community-name text beside the logo)
- [ ] Welcome / Mission / Vision / Story copy finalized in both languages
- [ ] Custom domain `bctamilcatholicfamily.ca` pointed at Vercel (after community feedback)

> Done: New Members + Prayer Requests Google Forms are wired up (`src/config/site.ts`).

## Project structure

```
src/
  app/[locale]/        # locale-prefixed pages (home, about, events,
                       #   prayer-requests, new-members, socials, contact, 404)
  components/          # layout/, ui/ (primitives + FormEmbed), sections/
  lib/                 # google-calendar, digest-window, hero-images
  data/                # announcements.json, resources.json
  config/              # site.ts (nav, email, socials, form URLs, newsletter)
  messages/            # en.json, ta.json
apps-script/           # prayer-digest, new-member-notify, newsletter-* (Google-side)
public/                # logo.svg, hero/ (carousel photos), images
docs/superpowers/      # design spec + implementation plan
```
