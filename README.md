# BC Tamil Catholic Family — Website

A modern, warm, bilingual (English + Tamil) community website for **BC Tamil Catholic Family (BCTCF)**, a Tamil-speaking Catholic community in British Columbia, Canada.

- **Live:** https://bctcf-webapp.vercel.app
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · `next-intl` · Vitest
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Design spec:** `docs/superpowers/specs/2026-06-21-bctcf-website-design.md`
- **Implementation plan:** `docs/superpowers/plans/2026-06-21-bctcf-website.md`

No database. Events come from Google Calendar; New Members and Prayer Requests embed Google Forms; two Apps Scripts handle email automation — a calendar-driven prayer-intentions digest and an instant new-member notification.

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
| About — Story / Mission / Vision, and all UI text | Edit `src/messages/en.json` / `src/messages/ta.json` | Auto-deploys |
| Social / form / map links | Edit `src/config/site.ts` | Auto-deploys |
| Prayer Requests / New Members | The pages **embed Google Forms** (see `src/config/site.ts`) | Edit the Google Form directly; no redeploy needed |

> **Coordinators** are the volunteers who hold the shared community Google account (`bctamilcatholicfamily@gmail.com`) and run activities. The role is always "coordinator(s)", never "board member(s)".

## Forms (Google Forms)

Two community Google Forms are embedded directly in the site:

- **New Members** — `SITE.newMemberFormUrl` in `src/config/site.ts` → embedded on `/new-members`.
- **Prayer Requests + Mass availability + intentions** — `SITE.prayerFormUrl` → embedded on `/prayer-requests`.

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
3. Triggers → Add trigger → `sendPrayerDigestIfMassTomorrow` → Time-driven → Day timer → 8pm–9pm.
4. Mass events on the calendar must contain the keyword **"Holy Mass"** in their title.
5. Adjust `SHEET_NAME` and the **column indexes** (`TIMESTAMP_COL`, `FAMILY_NAME_COL`, `INTENTION_COL`) at the top of the file to match your Form's response columns. Rows with an empty intention are skipped; each kept line is emailed as `Family Name - "Intention"` with a blank line between intentions.
6. Test: temporarily add a "Holy Mass" event for tomorrow + a test form response, Run the function, confirm the digest email (and that with zero new intentions it sends a short "no new intentions" note rather than nothing).

> The window-calculation logic in `prayer-digest.gs` is copied verbatim from `src/lib/digest-window.ts` (which is unit-tested). If you change one, change both.

## New-member notification Apps Script (Google-side, deployed manually)

`apps-script/new-member-notify.gs` emails `bctamilcatholicfamily@gmail.com` the moment anyone submits the New Members form, listing every field so a coordinator can add the contact to the members group.

1. Open the **New Members Google Form** → ⋮ (top-right) → **Script editor**; paste the file.
2. Triggers → Add trigger → `onNewMemberSubmit` → Event source **From form** → **On form submit** → Save (authorize when prompted).
3. Test: submit a test response and confirm the notification email arrives.

It reads fields generically, so adding/renaming Form questions later needs no code change.

---

## Launch checklist

Functional code is complete; these items are real-world content/config the community supplies before going public:

- [ ] Real social media URLs (Facebook, Instagram, YouTube, WhatsApp) in `src/config/site.ts`
- [ ] Real Google Maps embed URL in `src/config/site.ts` (`mapEmbedUrl`)
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
  data/                # announcements.json
  config/              # site.ts (nav, email, socials, form URLs, map)
  messages/            # en.json, ta.json
apps-script/           # prayer-digest.gs + new-member-notify.gs (Google-side)
public/                # logo.svg, hero/ (carousel photos), images
docs/superpowers/      # design spec + implementation plan
```
