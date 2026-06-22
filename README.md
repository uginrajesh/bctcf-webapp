# BC Tamil Catholic Family — Website

A modern, warm, bilingual (English + Tamil) community website for **BC Tamil Catholic Family (BCTCF)**, a Tamil-speaking Catholic community in British Columbia, Canada.

- **Live:** https://bctcf-webapp.vercel.app
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · `next-intl` · Vitest
- **Hosting:** Vercel (auto-deploys on push to `main`)
- **Design spec:** `docs/superpowers/specs/2026-06-21-bctcf-website-design.md`
- **Implementation plan:** `docs/superpowers/plans/2026-06-21-bctcf-website.md`

No database. Events come from Google Calendar; the New Members form relays to a Google Apps Script (Sheet + email); prayer requests use a Google Form with a calendar-driven digest Apps Script.

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
| Home announcements | Edit `src/data/announcements.json`, push | Auto-deploys (~30s) |
| UI text / translations | Edit `src/messages/en.json` / `src/messages/ta.json`, push | Auto-deploys |
| Social / form / map links | Edit `src/config/site.ts`, push | Auto-deploys |
| Images | Drop into `public/`, reference by filename | Auto-deploys |
| Prayer requests | Flow entirely through Google Form → Sheet → digest Apps Script | None |
| New-member records | Flow into Google Sheet + email | None |

> **Coordinators** are the volunteers who hold the shared community Google account (`bctamilcatholicfamily@gmail.com`) and run activities. The role is always "coordinator(s)", never "board member(s)".

## Environment variables

Copy `.env.example` to `.env.local` for local dev, and set the same keys in **Vercel → Settings → Environment Variables** for production. They are read server-side only and never exposed to the browser.

| Variable | Used by | Where it comes from |
|---|---|---|
| `GOOGLE_CALENDAR_API_KEY` | Events page | Google Cloud Console → APIs & Services → Credentials (restrict to Calendar API) |
| `GOOGLE_CALENDAR_ID` | Events page | The community Google Calendar's "Calendar ID" (Calendar settings → Integrate calendar) |
| `APPS_SCRIPT_URL` | New-member API route | The `/exec` Web App URL of the `new-member-receiver` Apps Script |
| `APPS_SCRIPT_SECRET` | New-member API route | A shared secret; must equal the `SHARED_SECRET` Script Property in the Apps Script |

With the calendar vars unset, the Events page simply shows a friendly empty state (no crash).

## Google Apps Scripts (Google-side, deployed manually)

Both scripts live in `apps-script/` for version control and are deployed by hand into the community Google account.

### `new-member-receiver.gs`
1. Create a Google Sheet "BCTCF New Members" → Extensions → Apps Script; paste the file.
2. Project Settings → Script Properties → add `SHARED_SECRET` (same value as Vercel's `APPS_SCRIPT_SECRET`).
3. Deploy → New deployment → **Web app**; Execute as **Me**, Who has access **Anyone**.
4. Copy the `/exec` URL into Vercel's `APPS_SCRIPT_URL`.
5. Test: submit the live New Members form once → confirm a Sheet row appears and an email arrives.

### `prayer-digest.gs`
1. Open the prayer-request Google Form's responses Sheet → Extensions → Apps Script; paste the file.
2. Script Properties → add `CALENDAR_ID` (the community calendar id).
3. Triggers → Add trigger → `sendPrayerDigestIfMassTomorrow` → Time-driven → Day timer → 8pm–9pm.
4. Mass events on the calendar must contain the keyword **"Holy Mass"** in their title.
5. Test: temporarily add a "Holy Mass" event for tomorrow + a test form response, Run the function, confirm the digest email (and that zero new intentions sends nothing).

> The window-calculation logic in `prayer-digest.gs` is copied verbatim from `src/lib/digest-window.ts` (which is unit-tested). If you change one, change both.

---

## Launch checklist

Functional code is complete; these items are real-world content/config the community supplies before going public:

- [ ] Real social media URLs (Facebook, Instagram, YouTube, WhatsApp) in `src/config/site.ts`
- [ ] Real Google Form URL (prayer requests) in `src/config/site.ts` (`prayerFormUrl`)
- [ ] Real Google Maps embed URL in `src/config/site.ts` (`mapEmbedUrl`)
- [ ] `GOOGLE_CALENDAR_API_KEY` + `GOOGLE_CALENDAR_ID` set in Vercel
- [ ] `APPS_SCRIPT_URL` + `APPS_SCRIPT_SECRET` set in Vercel and matching the Apps Script `SHARED_SECRET`
- [ ] Mass events titled with "Holy Mass" in the community calendar
- [ ] Header logo text decision confirmed (keep/drop the community-name text beside the logo)
- [ ] Real hero/community photographs added (authentic, family/faith-focused; no corporate stock)
- [ ] Welcome / Mission / Vision / Story copy finalized in both languages
- [ ] Custom domain `bctamilcatholicfamily.ca` pointed at Vercel (after community feedback)

## Project structure

```
src/
  app/[locale]/        # locale-prefixed pages (home, about, events,
                       #   prayer-requests, new-members, socials, contact, 404)
  app/api/new-member/  # form relay → Apps Script
  components/          # layout/, ui/ (primitives), sections/
  lib/                 # google-calendar, rate-limit, digest-window
  data/                # announcements.json
  config/              # site.ts (nav, email, socials, map)
  messages/            # en.json, ta.json
apps-script/           # Google-side scripts (deployed manually)
public/                # logo.svg and images
docs/superpowers/      # design spec + implementation plan
```
