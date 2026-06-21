# BC Tamil Catholic Family Website — Design Spec

**Date:** 2026-06-21
**Status:** Approved design, ready for implementation planning
**Source requirements:** `BC_Tamil_Catholic_Family_Website_Requirements.md`

---

## 1. Overview

A modern, warm, bilingual (English + Tamil) community website for **BC Tamil Catholic Family (BCTCF)**, a Tamil-speaking Catholic community in British Columbia, Canada.

The site is the community's primary online presence. It provides information about the community, displays upcoming events, accepts prayer requests and new-member registrations, and links to social channels. It must feel warm, family-oriented, and faith-centered — never corporate or institutional — and must be easy for a non-technical maintainer to keep current.

### Goals
- Bilingual from day one; every page available in English and Tamil.
- Mobile and desktop responsive.
- Low-maintenance content updates (events via Google Calendar; announcements via a single data file).
- Prominent Prayer Requests and New Member onboarding.
- Consistent use of the existing community logo and brand palette.

### Non-goals (Phase 1)
- Word-of-God email mailer (Phase 2).
- SMS notifications (Phase 2).
- Gallery, donations, event registration, volunteer signups, newsletters (future).
- Any database / CMS. Content lives in Google tools and repo files.

---

## 2. Roles & Terminology

- **Coordinators** — the ~9 volunteers who run community activities and approve new members. They share access to the community Google account. (This replaces the earlier term "board members".)
- **Clergy / Priests** — receive the monthly prayer-request digest.
- **Maintainer** — initially the project owner; later a tech-savvy volunteer or developer. Edits content files and redeploys.

### Community Google Account
A single shared account, `bctamilcatholicfamily@gmail.com`, is the hub for everything:
- Google Calendar (events source)
- Google Forms + Sheets (prayer requests, new-member records)
- Receiving email notifications (new-member alerts, prayer digest)
- Gmail forwarding rules fan notifications out to coordinators and clergy

The password is held by coordinators so the account survives any individual leaving.

---

## 3. Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS with a custom theme
- **Internationalization:** `next-intl` with locale-prefixed routing (`/en/…`, `/ta/…`)
- **Fonts:** A clean modern sans for English (e.g. Inter); **Noto Sans Tamil** for Tamil (strong mobile readability)
- **Hosting:** Vercel (free tier). Domain `bctamilcatholicfamily.ca` to be purchased and pointed at Vercel after community feedback; until then a `*.vercel.app` URL is used.
- **Runtime prerequisite:** Node.js LTS (installed: Node 24.17.0, npm 11.13.0).

---

## 4. Brand & Visual Direction

### Palette
- **Primary:** Royal Blue `#1e3a8a`, Gold `#b8860b`, White
- **Accent:** Warm Orange `#f59e0b`, Soft Yellow `#ffe9a8`
- **Surfaces:** White and a warm cream/parchment `#fbf7ed` / `#fffdf7`
- Avoid: neon, dark/black-dominant backgrounds, heavy animation.

### Chosen direction (locked)
A hybrid of two explored options:
- **Hero / page banners:** a vibrant royal-blue → gold **gradient** with the logo in a soft halo, a Tamil welcome line above an English headline, and a warm-orange rounded CTA button. Energetic, welcoming first impression.
- **Cards & content blocks:** **serif headings (Georgia-style), parchment/cream surfaces, and a gold bottom-underline.** Calm, reverent, grounded feel as the user scrolls.

This pairing gives warmth and welcome up top, faith-grounded steadiness below. Doodle-style hand-drawn illustrations (per requirements) may be added as occasional warm accents during build.

### Logo
The existing `assets/logo.svg` already contains the community name in both Tamil and English around its border. In the header it sits beside a text rendering of the name.
**Open visual decision (resolve at first render):** if the logo's own text is legible at header size, drop the separate header text; if too small to read, keep the adjacent text. Decide when the built header renders.

---

## 5. Information Architecture

Routing is locale-prefixed; default locale English, Tamil one click away via a top-right toggle (`EN | தமிழ்`).

```
/[locale]/                 Home
/[locale]/about            About Us
/[locale]/events           Events
/[locale]/prayer-requests  Prayer Requests
/[locale]/new-members      New Members
/[locale]/socials          Socials
/[locale]/contact          Contact Us
```

### Global chrome
- **Header (all pages):** logo + community name, primary nav (Home · About · Events · Prayer Requests · New Members · Socials · Contact), language toggle top-right. Mobile: hamburger menu.
- **Footer (all pages):** community name + bilingual tagline, quick links, social icons, community email.

---

## 6. Pages

### Home
1. **Hero** — gradient banner, logo halo, Tamil welcome + English headline, short tagline, one CTA ("Join Our Family").
2. **Welcome** — short bilingual message from the community.
3. **Mission snapshot** — three cards: Faith · Family · Community.
4. **Upcoming event highlight** — the next event from Google Calendar as a featured card.
5. **Quick access** — four parchment cards: Prayer Requests · New Members · Events · Socials.
6. **Latest announcements** — 2–3 pinned text updates from a data file.

### About Us
Our Story · Our Mission · Our Vision · Core Values (Faith, Family, Community, Service, Tamil Heritage). Leadership/coordinators section optional.

### Events
- Upcoming events pulled live from Google Calendar, rendered as branded date-badge cards (date, title, location, description).
- Graceful empty state ("Events coming soon — check back shortly").
- Mass events use a consistent title convention (e.g. "Holy Mass") so the prayer-digest script can identify them.

### Prayer Requests
- Short intro + confidentiality note (requests seen only by coordinators and clergy, never published).
- Embedded Google Form (or prominent button opening it). Responses land in a Google Sheet.

### New Members
- Welcome message.
- **Custom branded form:** Full Name, Email, Phone (WhatsApp), Family Size, How did you hear about us? (plus a hidden honeypot field for spam protection).
- "What Happens Next": (1) a coordinator reviews your details, (2) we reach out personally, (3) you're added to the community WhatsApp group.
- On submit: data appended to a Google Sheet **and** an email notification sent to the community account. Coordinators approve and add the contact to the WhatsApp group manually.

### Socials
Large brand-colored icon cards linking to Facebook, Instagram, YouTube, WhatsApp.

### Contact Us
Community email (clickable `mailto:`), Google Maps embed placeholder for meeting location, general info.

---

## 7. Integrations & Data Flow

### 7.1 Events — Google Calendar → site
```
Community Google Calendar
   → Google Calendar API (read-only, server-side)
   → Next.js fetches events (ISR, revalidate ~60 min)
   → rendered as branded cards
```
The API key is stored in Vercel environment variables and used only server-side; it is never exposed to the browser.

### 7.2 New Member Registration
```
User submits custom form
   → Next.js API route (/api/new-member): validates, checks honeypot, rate-limits
   → POST (with shared secret token) to Google Apps Script Web App
        → appends row to Google Sheet
        → sends email to bctamilcatholicfamily@gmail.com
   → Gmail rule forwards to coordinators
```
Coordinators review the email, approve, and add the new family to the WhatsApp group manually.

### 7.3 Prayer Requests + Monthly Digest
```
Member submits Google Form → responses stored in Google Sheet (automatic)

Google Apps Script, time-driven trigger (daily, ~8pm):
   Look FORWARD in Google Calendar: is there a "Holy Mass" event tomorrow?
      No  → exit silently
      Yes → look BACKWARD for the most recent past "Holy Mass" date
          → collect all prayer requests submitted after that date
          → format a digest email
          → send to bctamilcatholicfamily@gmail.com
              → Gmail rule forwards to coordinators + clergy
```
Mass dates are never hardcoded — both the next and previous Mass come from Google Calendar. If there are zero new requests, no email is sent. This logic lives entirely in Google Apps Script, independent of the website and Vercel.

### 7.4 Bilingual content
- All UI strings live in `src/messages/en.json` and `src/messages/ta.json`.
- Calendar event titles/descriptions are entered bilingually by coordinators in the calendar.
- The language toggle swaps between the `/en/` and `/ta/` version of the current page.

---

## 8. Project Structure

```
bctcf-webapp/
├── src/
│   ├── app/[locale]/
│   │   ├── page.tsx                 # Home
│   │   ├── about/page.tsx
│   │   ├── events/page.tsx
│   │   ├── prayer-requests/page.tsx
│   │   ├── new-members/page.tsx
│   │   ├── socials/page.tsx
│   │   ├── contact/page.tsx
│   │   └── api/new-member/route.ts  # form handler → Apps Script
│   ├── components/
│   │   ├── layout/                  # Header, Footer, LanguageToggle, MobileNav
│   │   ├── ui/                      # Button, Card, Section, PageBanner
│   │   └── sections/                # Hero, MissionCards, EventCard, QuickAccess, Announcements
│   ├── lib/
│   │   └── google-calendar.ts       # Calendar API client
│   ├── data/
│   │   └── announcements.json       # editable Home-page announcements
│   └── messages/
│       ├── en.json
│       └── ta.json
├── public/assets/logo.svg
├── docs/superpowers/specs/
└── (Apps Script lives in the Google account, documented in README)
```

---

## 9. Content Maintenance Model

| Content | How it's updated | Effort |
|---|---|---|
| Events | Add/edit in Google Calendar | No deploy; site refreshes within ~60 min |
| Home announcements | Edit `src/data/announcements.json`, push | Redeploy ~30s on Vercel |
| UI wording / translations | Edit `messages/en.json` / `messages/ta.json` | Redeploy |
| Prayer requests | Flow entirely through Google Form/Sheet/Apps Script | None |
| New-member records | Flow into Google Sheet + email | None |
| Images | Drop into `public/assets/`, reference by filename | Redeploy |

---

## 10. Error Handling

| Scenario | Behaviour |
|---|---|
| Calendar API down / quota exceeded | Events page shows friendly "Events coming soon" empty state; no crash |
| New-member submission fails | Clear retry message to the user; no silent data loss |
| Apps Script email fails | Error logged to an "Error Log" tab in the Sheet for manual retry |
| Prayer digest has zero new requests | Email skipped entirely |
| Unknown route / locale | Styled 404 with "Go Home" link |

---

## 11. Security

- Google API key and Apps Script shared secret stored only in Vercel environment variables; never sent to the browser.
- Apps Script Web App rejects any request lacking the correct secret token.
- New-member form: server-side validation, honeypot field, and rate limiting to deter bots/spam.
- HTTPS enforced everywhere (Vercel default).
- Google Sheet access restricted to the community Google account.
- No passwords or financial data are collected anywhere, keeping the risk surface small.
- Personal data submitted (names, emails, phone, prayer intentions) must not be exposed publicly; prayer requests in particular are never rendered on the site.

---

## 12. Testing Approach

- Manual responsive testing on mobile (iOS Safari, Android Chrome) and desktop.
- Bilingual check: every page renders correctly in both English and Tamil, including Tamil font rendering.
- New-member form end-to-end: Sheet row appears and notification email arrives.
- Calendar: events display correctly; "no events" empty state works.
- Prayer digest: Apps Script tested manually with a mocked "Mass tomorrow" date, including the zero-requests skip case.
- Accessibility: sufficient color contrast, readable heading sizes, keyboard-navigable nav and forms.

---

## 13. Future Expansion (not in Phase 1)

1. **Word of God mailer** — opt-in email sign-up stored in Google Sheets; periodic scripture content sent via Apps Script or a mail service (e.g. Mailchimp free tier).
2. **SMS notifications** — coordinator-triggered broadcasts to opted-in members via a service such as Twilio.
3. Gallery, parish resources, newsletters, event registration, volunteer signups, donations.

These do not affect the Phase 1 architecture.

---

## 14. Open Items to Resolve During Build

1. **Header logo text** — keep or drop the adjacent community-name text depending on logo legibility at header size (decide at first render).
2. Real hero/community photographs to replace gradient/emoji placeholders (authentic, family- and faith-focused; no corporate stock).
3. Final social media URLs (Facebook, Instagram, YouTube, WhatsApp).
4. Confirmed Mass-event naming convention in Google Calendar (proposed: "Holy Mass").
5. Exact meeting-location map coordinates for the Contact page.
6. Welcome / Mission / Vision / Story copy in both languages.
