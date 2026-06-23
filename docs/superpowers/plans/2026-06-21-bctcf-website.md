# BC Tamil Catholic Family Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a bilingual (English + Tamil) community website for BC Tamil Catholic Family, with events driven by Google Calendar, a custom new-member form, and an embedded prayer-request form, plus Google Apps Scripts for notifications and a calendar-driven prayer digest.

**Architecture:** A Next.js 14 App Router site with locale-prefixed routing (`/en`, `/ta`) via `next-intl`. Presentational pages render from translation files; the Events page fetches the community Google Calendar server-side (ISR); the New Members form posts to a Next.js API route that relays to a Google Apps Script Web App (which writes a Google Sheet row and emails the community account). Two Apps Scripts live in the community Google account: a new-member receiver and a daily prayer-digest job keyed off "Holy Mass" calendar events. No database, no Supabase. Hosted on Vercel, deployed from a GitHub remote.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS 3.4, next-intl 3, next/font (Inter + Noto Sans Tamil), Vitest + React Testing Library, Google Apps Script (Google-side), Vercel + GitHub.

## Global Constraints

- **Node.js:** v24.17.0, npm 11.13.0 (installed at `C:\Program Files\nodejs`). When the project `node`/`npm` are not on PATH in a fresh shell, prefix with that path.
- **Locales:** exactly `en` (default) and `ta`. Every page exists in both. Language toggle top-right on every page.
- **Role term:** always "Coordinator(s)" - never "board member(s)".
- **Community email / hub:** `bctamilcatholicfamily@gmail.com`.
- **Palette:** Royal Blue `#1e3a8a`, Gold `#b8860b`, Warm Orange `#f59e0b`, Soft Yellow `#ffe9a8`, Cream surfaces `#fbf7ed` / `#fffdf7`, White. No neon, no dark/black-dominant backgrounds.
- **Visual direction (locked):** gradient hero/banners (royal-blue → gold) + serif-heading, parchment, gold-bottom-underline cards.
- **Mass-event keyword:** calendar events representing Mass are titled with the keyword **"Holy Mass"** - both the site (tagging) and the digest script key on this.
- **Fonts:** Inter (English), Noto Sans Tamil (Tamil).
- **Secrets:** Google API key, Apps Script Web App URL, and shared secret token live only in environment variables (`.env.local` locally, Vercel env in prod). Never sent to the browser; never committed.
- **No public exposure of personal data:** prayer intentions and member submissions are never rendered on the site.
- **Pages:** Home, About Us, Events, Prayer Requests, New Members, Socials, Contact Us.

---

## File Structure

**Config / root**
- `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs` - project + build config
- `vitest.config.ts`, `vitest.setup.ts` - test config
- `.env.local` (gitignored), `.env.example` (committed) - environment variables
- `middleware.ts` - next-intl locale routing
- `README.md` - setup + Apps Script deployment notes

**i18n**
- `src/i18n/routing.ts` - locale list + routing config
- `src/i18n/request.ts` - per-request message loading
- `src/messages/en.json`, `src/messages/ta.json` - all UI strings

**App / routes**
- `src/app/[locale]/layout.tsx` - root locale layout (fonts, Header, Footer)
- `src/app/[locale]/page.tsx` - Home
- `src/app/[locale]/about/page.tsx`
- `src/app/[locale]/events/page.tsx`
- `src/app/[locale]/prayer-requests/page.tsx`
- `src/app/[locale]/new-members/page.tsx`
- `src/app/[locale]/socials/page.tsx`
- `src/app/[locale]/contact/page.tsx`
- `src/app/[locale]/not-found.tsx` - styled 404
- `src/app/api/new-member/route.ts` - form relay to Apps Script
- `src/app/globals.css` - Tailwind layers + base styles

**Components**
- `src/components/layout/Header.tsx`, `Footer.tsx`, `LanguageToggle.tsx`, `MobileNav.tsx`
- `src/components/ui/PageBanner.tsx`, `Card.tsx`, `Section.tsx`, `Button.tsx`
- `src/components/sections/Hero.tsx`, `MissionCards.tsx`, `UpcomingEvent.tsx`, `QuickAccess.tsx`, `Announcements.tsx`, `EventList.tsx`, `NewMemberForm.tsx`, `SocialCards.tsx`

**Lib / data**
- `src/lib/google-calendar.ts` - Calendar API client + event shaping
- `src/lib/rate-limit.ts` - in-memory rate limiter for the API route
- `src/data/announcements.json` - Home-page announcements
- `src/config/site.ts` - social URLs, email, map embed, nav definition

**Google-side (in repo for version control, deployed manually to Apps Script)**
- `apps-script/new-member-receiver.gs`
- `apps-script/prayer-digest.gs`
- `apps-script/digest-window.test.ts` - unit test for the pure date-window logic (mirrored in repo)
- `src/lib/digest-window.ts` - the pure window-calculation function, unit-tested here and copied into the `.gs` file

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `src/app/globals.css`, `src/app/layout.tsx` (temporary, replaced in Task 5), and the rest of the create-next-app output.

**Interfaces:**
- Produces: a runnable Next.js app with Tailwind available; `npm run dev`, `npm run build`, `npm run lint`.

- [ ] **Step 1: Scaffold with create-next-app**

The repo already exists (git initialized, contains `assets/`, `docs/`, requirements). Scaffold into the current directory. Run from `C:/Users/uginr/PersonalProjects/bctcf-webapp`:

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

When prompted that the directory is not empty, choose to continue (the existing `assets/`, `docs/`, `.git`, `.gitignore` must be preserved). If create-next-app refuses, scaffold in a temp dir and copy the generated files in, preserving existing files.

- [ ] **Step 2: Verify dev server boots**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run dev
```

Expected: server starts on `http://localhost:3000`; the default Next.js page renders. Stop the server (Ctrl-C) after confirming.

- [ ] **Step 3: Verify production build**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 4: Confirm .gitignore covers Next**

Open `.gitignore` and confirm it contains `node_modules/`, `.next/`, `.env*.local`, `.vercel`, `.superpowers/`. (It already does from project setup; add any missing.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with TypeScript and Tailwind"
```

---

## Task 2: Add testing framework (Vitest + RTL)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces: `npm test` runs Vitest in a jsdom environment with RTL matchers.

- [ ] **Step 1: Install dev dependencies**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 4: Add test scripts to `package.json`**

Add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write a smoke test**

Create `src/lib/__tests__/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'

describe('test harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Run tests**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test
```

Expected: 1 passing test.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: add Vitest + React Testing Library"
```

---

## Task 3: Push to GitHub remote

**Files:** none (git/remote operation).

**Interfaces:**
- Produces: a GitHub repo `bctcf-webapp` with `main` pushed. Required before Vercel connection (Task 4).

- [ ] **Step 1: Confirm gh CLI auth**

```bash
gh auth status
```

Expected: logged in. If not, the user runs `! gh auth login` in the session (interactive) and selects GitHub.com → HTTPS → browser.

- [ ] **Step 2: Create the remote repo and push**

Decide visibility with the user (default: private). Then:

```bash
cd "C:/Users/uginr/PersonalProjects/bctcf-webapp"
gh repo create bctcf-webapp --private --source=. --remote=origin --push
```

Expected: repo created; `main` pushed; `origin` set.

- [ ] **Step 3: Verify**

```bash
git remote -v
git branch --show-current
```

Expected: `origin` points to the new GitHub repo; current branch `main`.

> No commit step - this task only publishes existing commits.

---

## Task 4: Connect Vercel and first deploy

**Files:**
- Create: `vercel.json` (only if needed for overrides - default Next.js detection usually needs none).

**Interfaces:**
- Produces: a live `*.vercel.app` URL auto-deploying on push to `main`.

- [ ] **Step 1: Confirm Vercel CLI + auth**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npx vercel whoami
```

Expected: prints the user's Vercel username. If not authenticated, the user runs `! npx vercel login` in the session and completes email/GitHub auth.

- [ ] **Step 2: Link the project**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npx vercel link --yes
```

Expected: `.vercel/` created (gitignored). Accept the detected Next.js settings.

- [ ] **Step 3: Deploy a preview**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npx vercel
```

Expected: a preview URL is printed and loads the default app.

- [ ] **Step 4: Connect Git for auto-deploy**

In the Vercel dashboard (user action), import/link the `bctcf-webapp` GitHub repo so pushes to `main` auto-deploy to production. Confirm the production domain (`*.vercel.app`) loads.

> Custom domain `bctamilcatholicfamily.ca` is added later, after community feedback - out of scope for this plan.

> No commit step unless `vercel.json` was created; if so: `git add vercel.json && git commit -m "chore: add Vercel config"`.

---

## Task 5: Brand theme, fonts, and i18n routing

**Files:**
- Modify: `tailwind.config.ts`, `src/app/globals.css`
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `middleware.ts`, `next.config.mjs` (modify), `src/messages/en.json`, `src/messages/ta.json`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` (temporary placeholder)
- Delete: `src/app/layout.tsx`, `src/app/page.tsx` (replaced by `[locale]` versions)

**Interfaces:**
- Produces:
  - Tailwind tokens: colors `brand.blue`, `brand.gold`, `brand.orange`, `brand.yellow`, `brand.cream`, `brand.creamDark`; fonts `font-sans` (Inter), `font-tamil` (Noto Sans Tamil), `font-serif` (Georgia stack).
  - `routing` (from `src/i18n/routing.ts`): `{ locales: ['en','ta'], defaultLocale: 'en' }` and typed `Link`, `useRouter`, `usePathname`, `redirect`, `getPathname` via `createNavigation`.
  - `getMessages`/`useTranslations` working in pages.

- [ ] **Step 1: Install next-intl**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm install next-intl
```

- [ ] **Step 2: Configure Tailwind theme**

Replace the `theme.extend` block in `tailwind.config.ts` and ensure `content` covers `./src/**/*.{ts,tsx}`:

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1e3a8a',
          blueDark: '#16275e',
          gold: '#b8860b',
          orange: '#f59e0b',
          yellow: '#ffe9a8',
          cream: '#fffdf7',
          creamDark: '#fbf7ed',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        tamil: ['var(--font-tamil)', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #2a4ba0 60%, #b8860b 135%)',
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 3: Base styles in `globals.css`**

Ensure the file is exactly:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }

body {
  @apply bg-white text-slate-800 font-sans antialiased;
}
```

- [ ] **Step 4: Create `src/i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'ta'],
  defaultLocale: 'en',
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

- [ ] **Step 5: Create `src/i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'en' | 'ta')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 6: Create `middleware.ts`**

```ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './src/i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/', '/(en|ta)/:path*', '/((?!_next|_vercel|api|.*\\..*).*)'],
}
```

- [ ] **Step 7: Wire the plugin in `next.config.mjs`**

```js
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {}

export default withNextIntl(nextConfig)
```

- [ ] **Step 8: Seed message files**

Create `src/messages/en.json`:

```json
{
  "nav": {
    "home": "Home", "about": "About Us", "events": "Events",
    "prayer": "Prayer Requests", "members": "New Members",
    "socials": "Socials", "contact": "Contact Us"
  },
  "common": {
    "communityName": "BC Tamil Catholic Family",
    "tagline": "Connected by our Tamil language, keeping Jesus at the centre",
    "joinCta": "Join Our Family",
    "languageName": "தமிழ்"
  }
}
```

Create `src/messages/ta.json`:

```json
{
  "nav": {
    "home": "முகப்பு", "about": "எங்களைப் பற்றி", "events": "நிகழ்வுகள்",
    "prayer": "செப மன்றாட்டுகள்", "members": "புதிய உறுப்பினர்கள்",
    "socials": "சமூக வலைதளங்கள்", "contact": "தொடர்பு"
  },
  "common": {
    "communityName": "பிரிட்டிஷ் கொலம்பியா தமிழ் கத்தோலிக்க குடும்பம்",
    "tagline": "இனிய தமிழால் இணைவோம், இறை இயேசுவை முன்னிலைப்படுத்துவோம்",
    "joinCta": "எங்கள் குடும்பத்தில் இணையுங்கள்",
    "languageName": "English"
  }
}
```

- [ ] **Step 9: Delete the non-locale root files and create the locale layout**

Delete `src/app/layout.tsx` and `src/app/page.tsx`. Create `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter, Noto_Sans_Tamil } from 'next/font/google'
import { routing } from '@/i18n/routing'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const tamil = Noto_Sans_Tamil({ subsets: ['tamil'], variable: '--font-tamil' })

export const metadata: Metadata = {
  title: 'BC Tamil Catholic Family',
  description:
    'A warm spiritual home for Tamil Catholic families across British Columbia.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${tamil.variable}`}>
      <body className={locale === 'ta' ? 'font-tamil' : 'font-sans'}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 10: Temporary Home placeholder to verify routing**

Create `src/app/[locale]/page.tsx`:

```tsx
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = useTranslations('common')
  return <main className="p-10 text-brand-blue text-2xl">{t('communityName')}</main>
}
```

- [ ] **Step 11: Verify both locales render**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run dev
```

Visit `http://localhost:3000/en` (English name) and `http://localhost:3000/ta` (Tamil name in Tamil font). `http://localhost:3000/` should redirect to `/en`. Stop the server.

- [ ] **Step 12: Build check**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build
```

Expected: build succeeds; `/[locale]` routes listed for `en` and `ta`.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add brand theme, fonts, and bilingual routing"
```

---

## Task 6: Site config and nav definition

**Files:**
- Create: `src/config/site.ts`

**Interfaces:**
- Produces:
  - `NAV_ITEMS: { key: NavKey; href: string }[]` where `NavKey = 'home'|'about'|'events'|'prayer'|'members'|'socials'|'contact'` and `href` is the locale-relative path (e.g. `/about`, `/` for home).
  - `SITE = { email: string; socials: { facebook; instagram; youtube; whatsapp }; mapEmbedUrl: string }`.

- [ ] **Step 1: Create `src/config/site.ts`**

```ts
export type NavKey =
  | 'home' | 'about' | 'events' | 'prayer' | 'members' | 'socials' | 'contact'

export const NAV_ITEMS: { key: NavKey; href: string }[] = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'events', href: '/events' },
  { key: 'prayer', href: '/prayer-requests' },
  { key: 'members', href: '/new-members' },
  { key: 'socials', href: '/socials' },
  { key: 'contact', href: '/contact' },
]

export const SITE = {
  email: 'bctamilcatholicfamily@gmail.com',
  socials: {
    // TODO(content): replace with real URLs before launch (Open Item #3)
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    youtube: 'https://youtube.com/',
    whatsapp: 'https://chat.whatsapp.com/',
  },
  // TODO(content): replace with real Google Maps embed URL (Open Item #5)
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d83000!2d-123.1!3d49.25',
} as const
```

> The `TODO(content)` markers are real data the community supplies (spec Open Items #3, #5), not code placeholders. They are tracked in the README launch checklist (Task 19).

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add site config and nav definition"
```

---

## Task 7: UI primitives (PageBanner, Card, Section, Button)

**Files:**
- Create: `src/components/ui/PageBanner.tsx`, `Card.tsx`, `Section.tsx`, `Button.tsx`
- Test: `src/components/ui/__tests__/PageBanner.test.tsx`, `Card.test.tsx`

**Interfaces:**
- Produces:
  - `PageBanner({ title, tamilLabel }: { title: string; tamilLabel?: string })` - gradient banner with optional Tamil eyebrow line.
  - `Card({ title, children, icon }: { title?: string; children: React.ReactNode; icon?: React.ReactNode })` - parchment card, serif heading, gold bottom-underline.
  - `Section({ label, children, className }: { label?: string; children: React.ReactNode; className?: string })` - padded content block with optional gold eyebrow label.
  - `Button({ href, children, variant }: { href?: string; children: React.ReactNode; variant?: 'solid'|'outline' })` - renders an `<a>` when `href` given, else `<button>`.

- [ ] **Step 1: Write failing test for PageBanner**

Create `src/components/ui/__tests__/PageBanner.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PageBanner } from '../PageBanner'

describe('PageBanner', () => {
  it('renders the title and tamil label', () => {
    render(<PageBanner title="Events" tamilLabel="நிகழ்வுகள்" />)
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument()
    expect(screen.getByText('நிகழ்வுகள்')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- PageBanner
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement `PageBanner.tsx`**

```tsx
export function PageBanner({
  title,
  tamilLabel,
}: {
  title: string
  tamilLabel?: string
}) {
  return (
    <div className="bg-brand-gradient px-6 py-10 text-center text-white">
      {tamilLabel && (
        <p className="font-tamil text-brand-yellow">{tamilLabel}</p>
      )}
      <h1 className="mt-1 text-3xl font-bold md:text-4xl">{title}</h1>
    </div>
  )
}
```

- [ ] **Step 4: Implement `Card.tsx`**

```tsx
export function Card({
  title,
  icon,
  children,
}: {
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border-b-[3px] border-brand-gold bg-white p-6 shadow-sm">
      {icon && <div className="mb-2 text-3xl text-brand-gold">{icon}</div>}
      {title && (
        <h3 className="mb-1 font-serif text-lg font-semibold text-brand-blue">
          {title}
        </h3>
      )}
      <div className="text-sm text-slate-600">{children}</div>
    </div>
  )
}
```

- [ ] **Step 5: Implement `Section.tsx`**

```tsx
export function Section({
  label,
  className = '',
  children,
}: {
  label?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={`px-6 py-11 ${className}`}>
      {label && (
        <p className="mb-6 text-center font-serif text-xs uppercase tracking-[2px] text-brand-gold">
          {label}
        </p>
      )}
      {children}
    </section>
  )
}
```

- [ ] **Step 6: Implement `Button.tsx`**

```tsx
import { Link } from '@/i18n/routing'

export function Button({
  href,
  variant = 'solid',
  children,
}: {
  href?: string
  variant?: 'solid' | 'outline'
  children: React.ReactNode
}) {
  const base =
    'inline-block rounded-full px-7 py-3 font-bold transition focus:outline-none focus:ring-2 focus:ring-brand-orange'
  const styles =
    variant === 'solid'
      ? 'bg-brand-orange text-white shadow-md hover:brightness-105'
      : 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white'
  const cls = `${base} ${styles}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls}>{children}</button>
}
```

- [ ] **Step 7: Write Card test**

Create `src/components/ui/__tests__/Card.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from '../Card'

describe('Card', () => {
  it('renders title and children', () => {
    render(<Card title="Faith">Christ at the centre</Card>)
    expect(screen.getByRole('heading', { name: 'Faith' })).toBeInTheDocument()
    expect(screen.getByText('Christ at the centre')).toBeInTheDocument()
  })
})
```

- [ ] **Step 8: Run UI tests**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- ui
```

Expected: PASS for PageBanner and Card.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add UI primitives (PageBanner, Card, Section, Button)"
```

---

## Task 8: Header, Footer, LanguageToggle, MobileNav

**Files:**
- Create: `src/components/layout/Header.tsx`, `Footer.tsx`, `LanguageToggle.tsx`, `MobileNav.tsx`
- Modify: `src/app/[locale]/layout.tsx` (mount Header + Footer)
- Test: `src/components/layout/__tests__/LanguageToggle.test.tsx`

**Interfaces:**
- Consumes: `NAV_ITEMS`, `SITE` (Task 6); `Link`, `usePathname`, `useRouter` (Task 5); `useTranslations`.
- Produces: `Header`, `Footer` (server components); `LanguageToggle`, `MobileNav` (client components). Header shows logo + community name + nav + toggle; collapses to `MobileNav` under `md`.

- [ ] **Step 1: Copy logo into public**

```bash
cp "C:/Users/uginr/PersonalProjects/bctcf-webapp/assets/logo.svg" "C:/Users/uginr/PersonalProjects/bctcf-webapp/public/logo.svg"
```

- [ ] **Step 2: Implement `LanguageToggle.tsx` (client)**

```tsx
'use client'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'

export function LanguageToggle() {
  const t = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const other = locale === 'en' ? 'ta' : 'en'
  return (
    <button
      onClick={() => router.replace(pathname, { locale: other })}
      className="rounded-full border-[1.5px] border-brand-blue px-3 py-1 text-xs font-semibold text-brand-blue"
      aria-label={`Switch to ${t('languageName')}`}
    >
      {locale === 'en' ? 'EN | தமிழ்' : 'தமிழ் | EN'}
    </button>
  )
}
```

- [ ] **Step 3: Write LanguageToggle test**

Create `src/components/layout/__tests__/LanguageToggle.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { LanguageToggle } from '../LanguageToggle'

vi.mock('@/i18n/routing', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
}))

const messages = { common: { languageName: 'தமிழ்' } }

describe('LanguageToggle', () => {
  it('renders the toggle label for English locale', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <LanguageToggle />
      </NextIntlClientProvider>,
    )
    expect(screen.getByRole('button')).toHaveTextContent('EN | தமிழ்')
  })
})
```

- [ ] **Step 4: Run test, expect fail then pass**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- LanguageToggle
```

Expected: PASS (component already implemented in Step 2).

- [ ] **Step 5: Implement `MobileNav.tsx` (client)**

```tsx
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { NAV_ITEMS } from '@/config/site'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('nav')
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="text-2xl text-brand-blue"
      >
        ☰
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-full z-20 flex flex-col gap-1 border-t bg-white p-4 shadow-lg">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-slate-700 hover:bg-brand-creamDark"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Implement `Header.tsx`**

```tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { NAV_ITEMS } from '@/config/site'
import { LanguageToggle } from './LanguageToggle'
import { MobileNav } from './MobileNav'

export function Header() {
  const t = useTranslations('nav')
  const tc = useTranslations('common')
  return (
    <header className="relative flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.svg" alt="BCTCF logo" width={52} height={52} priority />
        <span className="hidden text-sm font-bold leading-tight text-brand-blue sm:block">
          {tc('communityName')}
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <nav className="hidden items-center gap-4 text-sm text-slate-700 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} href={item.href} className="hover:text-brand-blue">
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <LanguageToggle />
        <MobileNav />
      </div>
    </header>
  )
}
```

> Header shows the community name beside the logo. Open Item #1 (drop the text if the logo is legible at this size) is decided visually in Step 9.

- [ ] **Step 7: Implement `Footer.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { SITE } from '@/config/site'

export function Footer() {
  const t = useTranslations('common')
  return (
    <footer className="bg-brand-blueDark px-6 py-8 text-center text-sm text-slate-200">
      <p className="font-bold">{t('communityName')}</p>
      <p className="mt-1 font-tamil opacity-80">{t('tagline')}</p>
      <p className="mt-3 opacity-70">{SITE.email}</p>
      <p className="opacity-60">British Columbia, Canada</p>
    </footer>
  )
}
```

- [ ] **Step 8: Mount Header + Footer in the locale layout**

In `src/app/[locale]/layout.tsx`, wrap children inside the provider:

```tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
// ...
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
```

- [ ] **Step 9: Visual check both locales**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run dev
```

Check `/en` and `/ta`: header logo + name + nav + toggle; footer renders; toggle swaps locale and preserves the path; mobile menu opens at narrow width. **Decide Open Item #1** (keep/drop header name text) and adjust Step 6 if needed. Stop the server.

- [ ] **Step 10: Run tests + build**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test && npm run build
```

Expected: tests pass; build succeeds.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add Header, Footer, language toggle, and mobile nav"
```

---

## Task 9: Home page

**Files:**
- Create: `src/components/sections/Hero.tsx`, `MissionCards.tsx`, `QuickAccess.tsx`, `Announcements.tsx`, `src/data/announcements.json`
- Modify: `src/app/[locale]/page.tsx` (replace placeholder), `src/messages/en.json`, `src/messages/ta.json`
- Note: `UpcomingEvent` is added in Task 11 after the calendar client exists; Home renders without it until then.

**Interfaces:**
- Consumes: `Section`, `Card`, `Button` (Task 7); `useTranslations`.
- Produces: `Hero`, `MissionCards`, `QuickAccess`, `Announcements` components; `announcements.json` shape `{ items: { date: string; titleKey?: string; title: { en: string; ta: string }; body: { en: string; ta: string } }[] }`.

- [ ] **Step 1: Add Home translation keys**

Add a `home` block to both message files. `en.json`:

```json
"home": {
  "heroWelcomeTa": "அன்புடன் வரவேற்கிறோம்",
  "heroHeading": "Welcome to Our Family",
  "heroBody": "A warm spiritual home for Tamil Catholic families across British Columbia - rooted in faith, family, and fellowship.",
  "welcomeTitle": "A Word of Welcome",
  "welcomeBody": "Whether you are a long-time member or a newcomer to British Columbia, you have a place with us. We gather in worship, support one another as families, and celebrate our Tamil Catholic heritage together.",
  "ourHeart": "Our Heart",
  "faith": "Faith", "faithBody": "Christ at the centre of all we do.",
  "family": "Family", "familyBody": "Every household belongs and is supported.",
  "community": "Community", "communityBody": "Tamil heritage, shared in unity and service.",
  "quickAccess": "Quick Access",
  "qaPrayer": "Prayer Requests", "qaPrayerSub": "Submit an intention",
  "qaMembers": "New Members", "qaMembersSub": "Join our family",
  "qaEvents": "Events", "qaEventsSub": "What's coming up",
  "qaSocials": "Socials", "qaSocialsSub": "Stay connected",
  "announcements": "Latest Announcements"
}
```

`ta.json` (same keys, Tamil values):

```json
"home": {
  "heroWelcomeTa": "அன்புடன் வரவேற்கிறோம்",
  "heroHeading": "எங்கள் குடும்பத்திற்கு வரவேற்கிறோம்",
  "heroBody": "பிரிட்டிஷ் கொலம்பியா முழுவதும் உள்ள தமிழ் கத்தோலிக்க குடும்பங்களுக்கு ஒரு அன்பான ஆன்மீக இல்லம் - விசுவாசம், குடும்பம், நட்புறவில் வேரூன்றியது.",
  "welcomeTitle": "வரவேற்பு வார்த்தை",
  "welcomeBody": "நீங்கள் நீண்டகால உறுப்பினராக இருந்தாலும் அல்லது பிரிட்டிஷ் கொலம்பியாவிற்கு புதியவராக இருந்தாலும், எங்களுடன் உங்களுக்கு இடம் உண்டு.",
  "ourHeart": "எங்கள் இதயம்",
  "faith": "விசுவாசம்", "faithBody": "நாம் செய்யும் அனைத்திலும் கிறிஸ்து மையமாக.",
  "family": "குடும்பம்", "familyBody": "ஒவ்வொரு குடும்பமும் சேர்ந்தது, ஆதரிக்கப்படுகிறது.",
  "community": "சமூகம்", "communityBody": "ஒற்றுமையிலும் சேவையிலும் பகிரப்படும் தமிழ் பாரம்பரியம்.",
  "quickAccess": "விரைவு அணுகல்",
  "qaPrayer": "செப மன்றாட்டுகள்", "qaPrayerSub": "ஒரு மன்றாட்டை சமர்ப்பியுங்கள்",
  "qaMembers": "புதிய உறுப்பினர்கள்", "qaMembersSub": "எங்கள் குடும்பத்தில் இணையுங்கள்",
  "qaEvents": "நிகழ்வுகள்", "qaEventsSub": "வரவிருப்பவை",
  "qaSocials": "சமூக வலைதளங்கள்", "qaSocialsSub": "தொடர்பில் இருங்கள்",
  "announcements": "சமீபத்திய அறிவிப்புகள்"
}
```

- [ ] **Step 2: Implement `Hero.tsx`**

```tsx
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export function Hero() {
  const t = useTranslations('home')
  const tc = useTranslations('common')
  return (
    <section className="bg-brand-gradient px-6 py-16 text-center text-white">
      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/15">
        <Image src="/logo.svg" alt="" width={60} height={60} />
      </div>
      <p className="font-tamil text-lg text-brand-yellow">{t('heroWelcomeTa')}</p>
      <h1 className="my-1 text-3xl font-bold md:text-4xl">{t('heroHeading')}</h1>
      <p className="mx-auto mt-3 max-w-xl opacity-90">{t('heroBody')}</p>
      <div className="mt-6">
        <Button href="/new-members">{tc('joinCta')} →</Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Implement `MissionCards.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'

export function MissionCards() {
  const t = useTranslations('home')
  const items = [
    { icon: '🙏', title: t('faith'), body: t('faithBody') },
    { icon: '👨‍👩‍👧‍👦', title: t('family'), body: t('familyBody') },
    { icon: '🤝', title: t('community'), body: t('communityBody') },
  ]
  return (
    <Section label={t('ourHeart')}>
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
        {items.map((i) => (
          <Card key={i.title} title={i.title} icon={i.icon}>
            {i.body}
          </Card>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Implement `QuickAccess.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Section } from '@/components/ui/Section'

export function QuickAccess() {
  const t = useTranslations('home')
  const cards = [
    { icon: '🕯️', title: t('qaPrayer'), sub: t('qaPrayerSub'), href: '/prayer-requests' },
    { icon: '✨', title: t('qaMembers'), sub: t('qaMembersSub'), href: '/new-members' },
    { icon: '📅', title: t('qaEvents'), sub: t('qaEventsSub'), href: '/events' },
    { icon: '💬', title: t('qaSocials'), sub: t('qaSocialsSub'), href: '/socials' },
  ]
  return (
    <Section label={t('quickAccess')} className="bg-brand-creamDark">
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-lg border-b-[3px] border-brand-gold bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="mb-2 block text-3xl text-brand-gold">{c.icon}</span>
            <span className="block font-serif font-semibold text-brand-blue">{c.title}</span>
            <span className="mt-1 block text-xs text-slate-400">{c.sub}</span>
          </Link>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 5: Create `announcements.json`**

```json
{
  "items": [
    {
      "date": "2026-06",
      "title": { "en": "Monthly Tamil Mass - second Saturday", "ta": "மாதாந்திர தமிழ் திருப்பலி - இரண்டாவது சனிக்கிழமை" },
      "body": { "en": "Join us this month for Holy Mass followed by community fellowship.", "ta": "இந்த மாதம் திருப்பலியிலும் அதைத் தொடர்ந்து சமூக நட்புறவிலும் எங்களுடன் இணையுங்கள்." }
    },
    {
      "date": "2026-06",
      "title": { "en": "New family welcome lunch", "ta": "புதிய குடும்ப வரவேற்பு மதிய உணவு" },
      "body": { "en": "Newcomers to BC are warmly invited to our welcome lunch after Mass.", "ta": "பிரிட்டிஷ் கொலம்பியாவிற்கு புதியவர்கள் திருப்பலிக்குப் பின் எங்கள் வரவேற்பு மதிய உணவிற்கு அன்புடன் அழைக்கப்படுகிறார்கள்." }
    }
  ]
}
```

- [ ] **Step 6: Implement `Announcements.tsx`**

```tsx
import { useLocale, useTranslations } from 'next-intl'
import { Section } from '@/components/ui/Section'
import data from '@/data/announcements.json'

export function Announcements() {
  const t = useTranslations('home')
  const locale = useLocale() as 'en' | 'ta'
  return (
    <Section className="bg-brand-creamDark">
      <h2 className="mb-6 text-center font-serif text-2xl text-brand-blue">
        {t('announcements')}
      </h2>
      <div className="mx-auto max-w-2xl">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="mb-3 rounded-lg border-l-4 border-brand-orange bg-white p-4"
          >
            <p className="text-xs uppercase tracking-wide text-brand-gold">{item.date}</p>
            <h4 className="my-1 font-serif text-brand-blue">{item.title[locale]}</h4>
            <p className="text-sm text-slate-500">{item.body[locale]}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 7: Assemble Home in `page.tsx`**

```tsx
import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Hero } from '@/components/sections/Hero'
import { Section } from '@/components/ui/Section'
import { MissionCards } from '@/components/sections/MissionCards'
import { QuickAccess } from '@/components/sections/QuickAccess'
import { Announcements } from '@/components/sections/Announcements'

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = useTranslations('home')
  return (
    <main>
      <Hero />
      <Section className="bg-brand-cream text-center">
        <h2 className="mb-3 font-serif text-2xl text-brand-blue">{t('welcomeTitle')}</h2>
        <p className="mx-auto max-w-2xl leading-relaxed text-slate-600">{t('welcomeBody')}</p>
      </Section>
      <MissionCards />
      {/* UpcomingEvent inserted here in Task 11 */}
      <QuickAccess />
      <Announcements />
    </main>
  )
}
```

- [ ] **Step 8: Visual check + build**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run dev
```

Verify `/en` and `/ta` render the full Home page in the locked style. Then:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: build Home page (hero, mission, quick access, announcements)"
```

---

## Task 10: Google Calendar client

**Files:**
- Create: `src/lib/google-calendar.ts`
- Test: `src/lib/__tests__/google-calendar.test.ts`
- Modify: `.env.example` (create), `.env.local` (create, gitignored)

**Interfaces:**
- Consumes: env `GOOGLE_CALENDAR_API_KEY`, `GOOGLE_CALENDAR_ID`.
- Produces:
  - `type CalendarEvent = { id: string; title: string; description: string; location: string; start: string; isMass: boolean }`
  - `async function getUpcomingEvents(max?: number): Promise<CalendarEvent[]>` - returns `[]` on any error (never throws).
  - `function mapItem(item: GoogleEventItem): CalendarEvent` - pure mapper; `isMass` true when the title contains "Holy Mass" (case-insensitive).

- [ ] **Step 1: Create env files**

`.env.example` (committed):

```
GOOGLE_CALENDAR_API_KEY=
GOOGLE_CALENDAR_ID=
APPS_SCRIPT_URL=
APPS_SCRIPT_SECRET=
```

`.env.local` (gitignored) - same keys, with the user's real values filled in. For local dev the calendar may be left blank (the client returns `[]`, exercising the empty state).

- [ ] **Step 2: Write failing test for `mapItem`**

Create `src/lib/__tests__/google-calendar.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mapItem } from '../google-calendar'

describe('mapItem', () => {
  it('flags Holy Mass events as isMass', () => {
    const e = mapItem({
      id: '1',
      summary: 'Tamil Holy Mass & Fellowship',
      description: 'Tea to follow',
      location: 'Vancouver',
      start: { dateTime: '2026-07-12T10:30:00-07:00' },
    })
    expect(e.isMass).toBe(true)
    expect(e.title).toBe('Tamil Holy Mass & Fellowship')
    expect(e.start).toBe('2026-07-12T10:30:00-07:00')
  })

  it('does not flag non-mass events, and handles all-day + missing fields', () => {
    const e = mapItem({ id: '2', summary: 'Family Picnic', start: { date: '2026-07-26' } })
    expect(e.isMass).toBe(false)
    expect(e.description).toBe('')
    expect(e.location).toBe('')
    expect(e.start).toBe('2026-07-26')
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- google-calendar
```

Expected: FAIL (module not found).

- [ ] **Step 4: Implement `google-calendar.ts`**

```ts
export type CalendarEvent = {
  id: string
  title: string
  description: string
  location: string
  start: string
  isMass: boolean
}

type GoogleEventItem = {
  id: string
  summary?: string
  description?: string
  location?: string
  start?: { dateTime?: string; date?: string }
}

export function mapItem(item: GoogleEventItem): CalendarEvent {
  const title = item.summary ?? ''
  return {
    id: item.id,
    title,
    description: item.description ?? '',
    location: item.location ?? '',
    start: item.start?.dateTime ?? item.start?.date ?? '',
    isMass: /holy mass/i.test(title),
  }
}

export async function getUpcomingEvents(max = 10): Promise<CalendarEvent[]> {
  const key = process.env.GOOGLE_CALENDAR_API_KEY
  const calId = process.env.GOOGLE_CALENDAR_ID
  if (!key || !calId) return []
  try {
    const params = new URLSearchParams({
      key,
      timeMin: new Date().toISOString(),
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: String(max),
    })
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calId,
    )}/events?${params.toString()}`
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = (await res.json()) as { items?: GoogleEventItem[] }
    return (data.items ?? []).map(mapItem)
  } catch {
    return []
  }
}
```

> `new Date()` here runs at request time in the Next.js server (allowed) - this is application runtime, not a Workflow script.

- [ ] **Step 5: Run test, verify pass**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- google-calendar
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Google Calendar client with Mass detection"
```

---

## Task 11: Events page + Home upcoming-event highlight

**Files:**
- Create: `src/components/sections/EventList.tsx`, `UpcomingEvent.tsx`, `src/app/[locale]/events/page.tsx`
- Modify: `src/app/[locale]/page.tsx` (insert `UpcomingEvent`), `src/messages/en.json`, `src/messages/ta.json`
- Test: `src/components/sections/__tests__/EventList.test.tsx`

**Interfaces:**
- Consumes: `getUpcomingEvents`, `CalendarEvent` (Task 10); `PageBanner`, `Section` (Task 7).
- Produces:
  - `EventList({ events }: { events: CalendarEvent[] })` - renders date-badge cards; shows the empty-state message when `events` is empty.
  - `UpcomingEvent({ event }: { event: CalendarEvent | null })` - featured card for Home; renders nothing if `null`.
  - `formatEventDate(iso: string, locale: 'en'|'ta'): { day: string; month: string; time: string }` exported from `EventList.tsx`.

- [ ] **Step 1: Add events translation keys**

`en.json`:

```json
"events": {
  "title": "Events", "tamilLabel": "நிகழ்வுகள்",
  "upcomingLabel": "Upcoming",
  "empty": "Events coming soon - check back shortly.",
  "homeDontMiss": "Don't Miss", "homeUpcoming": "Upcoming Event"
}
```

`ta.json`:

```json
"events": {
  "title": "நிகழ்வுகள்", "tamilLabel": "நிகழ்வுகள்",
  "upcomingLabel": "வரவிருப்பவை",
  "empty": "நிகழ்வுகள் விரைவில் வரும் - சிறிது நேரம் கழித்து பார்க்கவும்.",
  "homeDontMiss": "தவறவிடாதீர்கள்", "homeUpcoming": "வரவிருக்கும் நிகழ்வு"
}
```

- [ ] **Step 2: Write failing test for `EventList`**

Create `src/components/sections/__tests__/EventList.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { EventList } from '../EventList'

vi.mock('@/i18n/routing', () => ({ Link: (p: any) => <a {...p} /> }))
const messages = { events: { empty: 'Events coming soon - check back shortly.', upcomingLabel: 'Upcoming' } }
const wrap = (ui: React.ReactNode) =>
  render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>)

describe('EventList', () => {
  it('shows the empty state when there are no events', () => {
    wrap(<EventList events={[]} />)
    expect(screen.getByText(/Events coming soon/)).toBeInTheDocument()
  })

  it('renders an event title when present', () => {
    wrap(<EventList events={[{ id: '1', title: 'Tamil Holy Mass', description: '', location: 'Vancouver', start: '2026-07-12T10:30:00-07:00', isMass: true }]} />)
    expect(screen.getByText('Tamil Holy Mass')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- EventList
```

Expected: FAIL (module not found).

- [ ] **Step 4: Implement `EventList.tsx`**

```tsx
import { useLocale, useTranslations } from 'next-intl'
import type { CalendarEvent } from '@/lib/google-calendar'

export function formatEventDate(iso: string, locale: 'en' | 'ta') {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { day: '', month: '', time: '' }
  const loc = locale === 'ta' ? 'ta-IN' : 'en-CA'
  return {
    day: d.toLocaleDateString(loc, { day: '2-digit' }),
    month: d.toLocaleDateString(loc, { month: 'short' }),
    time: iso.includes('T') ? d.toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit' }) : '',
  }
}

export function EventList({ events }: { events: CalendarEvent[] }) {
  const t = useTranslations('events')
  const locale = useLocale() as 'en' | 'ta'
  if (events.length === 0) {
    return <p className="py-10 text-center text-slate-500">{t('empty')}</p>
  }
  return (
    <div className="mx-auto max-w-2xl">
      {events.map((e) => {
        const d = formatEventDate(e.start, locale)
        return (
          <div key={e.id} className="mb-3 flex gap-4 rounded-lg border border-brand-creamDark border-l-4 border-l-brand-orange bg-white p-4">
            <div className="min-w-16 rounded-lg bg-brand-blue px-4 py-2 text-center text-white">
              <div className="text-2xl font-extrabold leading-none">{d.day}</div>
              <div className="text-xs uppercase tracking-wide">{d.month}</div>
            </div>
            <div>
              {e.isMass && <div className="text-[10px] uppercase tracking-wide text-brand-gold">Holy Mass</div>}
              <h3 className="font-serif text-brand-blue">{e.title}</h3>
              <p className="text-xs text-slate-500">
                {[d.time, e.location].filter(Boolean).join(' · ')}
              </p>
              {e.description && <p className="mt-1 text-xs text-slate-500">{e.description}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 5: Run test, verify pass**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- EventList
```

Expected: PASS.

- [ ] **Step 6: Implement `UpcomingEvent.tsx`**

```tsx
import { useLocale, useTranslations } from 'next-intl'
import type { CalendarEvent } from '@/lib/google-calendar'
import { formatEventDate } from './EventList'
import { Section } from '@/components/ui/Section'

export function UpcomingEvent({ event }: { event: CalendarEvent | null }) {
  const t = useTranslations('events')
  const locale = useLocale() as 'en' | 'ta'
  if (!event) return null
  const d = formatEventDate(event.start, locale)
  return (
    <Section label={t('homeDontMiss')}>
      <div className="mx-auto flex max-w-3xl items-center gap-6 rounded-2xl bg-brand-blue p-7 text-white">
        <div className="min-w-20 rounded-xl bg-brand-orange px-5 py-4 text-center">
          <div className="text-3xl font-extrabold leading-none">{d.day}</div>
          <div className="text-sm uppercase tracking-wide">{d.month}</div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-brand-yellow">{t('homeUpcoming')}</p>
          <h3 className="my-1 text-xl font-bold">{event.title}</h3>
          <p className="text-sm opacity-85">{[d.time, event.location].filter(Boolean).join(' · ')}</p>
        </div>
      </div>
    </Section>
  )
}
```

- [ ] **Step 7: Implement Events page**

Create `src/app/[locale]/events/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { EventList } from '@/components/sections/EventList'
import { getUpcomingEvents } from '@/lib/google-calendar'

export default async function EventsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('events')
  const events = await getUpcomingEvents()
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section label={t('upcomingLabel')}>
        <EventList events={events} />
      </Section>
    </main>
  )
}
```

- [ ] **Step 8: Insert `UpcomingEvent` on Home**

Convert Home to fetch the next event. In `src/app/[locale]/page.tsx`, make the component `async`, replace the `useTranslations` call with `getTranslations`, fetch events, and render the highlight where the Task 9 comment was:

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Hero } from '@/components/sections/Hero'
import { Section } from '@/components/ui/Section'
import { MissionCards } from '@/components/sections/MissionCards'
import { UpcomingEvent } from '@/components/sections/UpcomingEvent'
import { QuickAccess } from '@/components/sections/QuickAccess'
import { Announcements } from '@/components/sections/Announcements'
import { getUpcomingEvents } from '@/lib/google-calendar'

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('home')
  const [next] = await getUpcomingEvents(1)
  return (
    <main>
      <Hero />
      <Section className="bg-brand-cream text-center">
        <h2 className="mb-3 font-serif text-2xl text-brand-blue">{t('welcomeTitle')}</h2>
        <p className="mx-auto max-w-2xl leading-relaxed text-slate-600">{t('welcomeBody')}</p>
      </Section>
      <MissionCards />
      <UpcomingEvent event={next ?? null} />
      <QuickAccess />
      <Announcements />
    </main>
  )
}
```

> `MissionCards`, `QuickAccess`, `Announcements`, `Hero` use the `useTranslations` hook, which works inside an async server component because they are child components rendered by Next, not hook calls in the async function body.

- [ ] **Step 9: Verify + build**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run dev
```

With no calendar configured locally, `/en/events` shows the empty state and Home omits the highlight - both correct. Then:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add Events page and Home upcoming-event highlight"
```

---

## Task 12: About, Prayer Requests, Socials, Contact pages

**Files:**
- Create: `src/app/[locale]/about/page.tsx`, `src/app/[locale]/prayer-requests/page.tsx`, `src/app/[locale]/socials/page.tsx`, `src/app/[locale]/contact/page.tsx`, `src/components/sections/SocialCards.tsx`
- Modify: `src/messages/en.json`, `src/messages/ta.json`, `src/config/site.ts` (add Google Form URL constant)

**Interfaces:**
- Consumes: `PageBanner`, `Section`, `Card`, `Button` (Task 7); `SITE` (Task 6).
- Produces: four pages + `SocialCards` component. Adds `SITE.prayerFormUrl: string`.

- [ ] **Step 1: Add translation keys for all four pages**

Add `about`, `prayer`, `socials`, `contact` blocks to both message files. `en.json`:

```json
"about": {
  "title": "About Us", "tamilLabel": "எங்களைப் பற்றி",
  "story": "Our Story", "storyBody": "How Tamil Catholic families across BC came together to worship and support one another.",
  "mission": "Our Mission", "missionBody": "To nurture faith, family, and Tamil Catholic heritage in a welcoming community.",
  "vision": "Our Vision", "visionBody": "A connected family where every household finds belonging and a spiritual home.",
  "coreValues": "Core Values",
  "values": "Faith,Family,Community,Service,Tamil Heritage"
},
"prayer": {
  "title": "Prayer Requests", "tamilLabel": "செப மன்றாட்டுகள்",
  "intro": "Share your intentions with our community. Our coordinators gather requests and our priests remember them at Holy Mass.",
  "confidential": "Confidential - requests are seen only by coordinators and clergy, never published on the website.",
  "cta": "Submit a Prayer Request"
},
"socials": {
  "title": "Socials", "tamilLabel": "சமூக வலைதளங்கள்",
  "intro": "Stay connected with our community."
},
"contact": {
  "title": "Contact Us", "tamilLabel": "தொடர்பு கொள்ளுங்கள்",
  "getInTouch": "Get in Touch",
  "location": "We gather across the Greater Vancouver area. See Events for the next Mass location."
}
```

`ta.json` (same keys, Tamil values):

```json
"about": {
  "title": "எங்களைப் பற்றி", "tamilLabel": "எங்களைப் பற்றி",
  "story": "எங்கள் கதை", "storyBody": "பிரிட்டிஷ் கொலம்பியா முழுவதும் உள்ள தமிழ் கத்தோலிக்க குடும்பங்கள் ஒன்றாக வழிபடவும் ஒருவரையொருவர் ஆதரிக்கவும் எவ்வாறு இணைந்தன.",
  "mission": "எங்கள் நோக்கம்", "missionBody": "வரவேற்கும் சமூகத்தில் விசுவாசம், குடும்பம், தமிழ் கத்தோலிக்க பாரம்பரியத்தை வளர்ப்பது.",
  "vision": "எங்கள் தொலைநோக்கு", "visionBody": "ஒவ்வொரு குடும்பமும் சேர்ந்திருப்பதையும் ஆன்மீக இல்லத்தையும் காணும் இணைந்த குடும்பம்.",
  "coreValues": "மைய மதிப்புகள்",
  "values": "விசுவாசம்,குடும்பம்,சமூகம்,சேவை,தமிழ் பாரம்பரியம்"
},
"prayer": {
  "title": "செப மன்றாட்டுகள்", "tamilLabel": "செப மன்றாட்டுகள்",
  "intro": "உங்கள் மன்றாட்டுகளை எங்கள் சமூகத்துடன் பகிருங்கள். எங்கள் ஒருங்கிணைப்பாளர்கள் மன்றாட்டுகளைச் சேகரித்து, எங்கள் அருட்தந்தையர்கள் திருப்பலியில் நினைவுகூருகிறார்கள்.",
  "confidential": "இரகசியமானது - மன்றாட்டுகள் ஒருங்கிணைப்பாளர்கள் மற்றும் மறைப்பணியாளர்களால் மட்டுமே பார்க்கப்படும், வலைத்தளத்தில் வெளியிடப்படாது.",
  "cta": "ஒரு செப மன்றாட்டை சமர்ப்பியுங்கள்"
},
"socials": {
  "title": "சமூக வலைதளங்கள்", "tamilLabel": "சமூக வலைதளங்கள்",
  "intro": "எங்கள் சமூகத்துடன் தொடர்பில் இருங்கள்."
},
"contact": {
  "title": "தொடர்பு கொள்ளுங்கள்", "tamilLabel": "தொடர்பு கொள்ளுங்கள்",
  "getInTouch": "தொடர்பு கொள்ளுங்கள்",
  "location": "நாங்கள் கிரேட்டர் வான்கூவர் பகுதி முழுவதும் கூடுகிறோம். அடுத்த திருப்பலி இடத்திற்கு நிகழ்வுகள் பக்கத்தைப் பார்க்கவும்."
}
```

- [ ] **Step 2: Add the prayer form URL to `site.ts`**

Add to the `SITE` object:

```ts
  // TODO(content): replace with the real Google Form URL (Open Item: prayer form)
  prayerFormUrl: 'https://docs.google.com/forms/d/e/EXAMPLE/viewform',
```

- [ ] **Step 3: Implement About page**

Create `src/app/[locale]/about/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('about')
  const values = t('values').split(',')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section>
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          <Card title={t('story')}>{t('storyBody')}</Card>
          <Card title={t('mission')}>{t('missionBody')}</Card>
          <Card title={t('vision')}>{t('visionBody')}</Card>
        </div>
      </Section>
      <Section label={t('coreValues')} className="bg-brand-creamDark">
        <div className="flex flex-wrap justify-center gap-2">
          {values.map((v) => (
            <span key={v} className="rounded-full border border-brand-gold/40 bg-brand-cream px-4 py-1.5 font-serif text-sm text-brand-blue">
              {v}
            </span>
          ))}
        </div>
      </Section>
    </main>
  )
}
```

- [ ] **Step 4: Implement Prayer Requests page**

Create `src/app/[locale]/prayer-requests/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { SITE } from '@/config/site'

export default async function PrayerPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('prayer')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section className="text-center">
        <p className="mx-auto max-w-xl text-slate-600">{t('intro')}</p>
        <div className="mx-auto mt-4 max-w-xl rounded-lg border border-dashed border-brand-gold bg-brand-cream p-4 text-sm text-brand-gold">
          🔒 {t('confidential')}
        </div>
        <div className="mt-6">
          <a href={SITE.prayerFormUrl} target="_blank" rel="noopener noreferrer">
            <Button>{t('cta')} →</Button>
          </a>
        </div>
      </Section>
    </main>
  )
}
```

> The prayer form opens in a new tab. Embedding the Google Form via `<iframe src={SITE.prayerFormUrl.replace('/viewform','/viewform?embedded=true')}>` is an acceptable alternative if the user prefers in-page; the link form is the default.

- [ ] **Step 5: Implement `SocialCards.tsx` and Socials page**

`src/components/sections/SocialCards.tsx`:

```tsx
import { SITE } from '@/config/site'

const CARDS = [
  { key: 'facebook', label: 'Facebook', icon: '📘', cls: 'bg-[#1877f2]', href: SITE.socials.facebook },
  { key: 'instagram', label: 'Instagram', icon: '📷', cls: 'bg-gradient-to-br from-[#f09433] to-[#bc1888]', href: SITE.socials.instagram },
  { key: 'youtube', label: 'YouTube', icon: '▶️', cls: 'bg-[#ff0000]', href: SITE.socials.youtube },
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬', cls: 'bg-[#25d366]', href: SITE.socials.whatsapp },
]

export function SocialCards() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 md:grid-cols-4">
      {CARDS.map((c) => (
        <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer"
          className={`${c.cls} rounded-xl px-3 py-7 text-center font-bold text-white transition hover:brightness-105`}>
          <span className="mb-2 block text-4xl">{c.icon}</span>
          {c.label}
        </a>
      ))}
    </div>
  )
}
```

`src/app/[locale]/socials/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { SocialCards } from '@/components/sections/SocialCards'

export default async function SocialsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('socials')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section>
        <p className="mb-6 text-center text-slate-600">{t('intro')}</p>
        <SocialCards />
      </Section>
    </main>
  )
}
```

- [ ] **Step 6: Implement Contact page**

Create `src/app/[locale]/contact/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { SITE } from '@/config/site'

export default async function ContactPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('contact')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section>
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-brand-creamDark bg-brand-cream p-5 text-sm text-slate-600">
            <h4 className="mb-2 font-serif text-brand-blue">{t('getInTouch')}</h4>
            <p className="mb-2">✉️ <a className="text-brand-blue underline" href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            <p>📍 {t('location')}</p>
          </div>
          <div className="overflow-hidden rounded-lg">
            <iframe
              src={SITE.mapEmbedUrl}
              title="Meeting location map"
              className="h-48 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>
    </main>
  )
}
```

- [ ] **Step 7: Visual check + build**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run dev
```

Verify `/en` and `/ta` for `/about`, `/prayer-requests`, `/socials`, `/contact`. Then:

```bash
npm run build
```

Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add About, Prayer Requests, Socials, and Contact pages"
```

---

## Task 13: New Members form (client component + UI)

**Files:**
- Create: `src/components/sections/NewMemberForm.tsx`, `src/app/[locale]/new-members/page.tsx`
- Modify: `src/messages/en.json`, `src/messages/ta.json`
- Test: `src/components/sections/__tests__/NewMemberForm.test.tsx`

**Interfaces:**
- Consumes: `Button` (Task 7); the API route `/api/new-member` (Task 14) - posts JSON `{ name, email, phone, familySize, heardFrom, website }` (`website` is the honeypot).
- Produces: `NewMemberForm` (client) with states idle → submitting → success/error; renders "What Happens Next" steps.

- [ ] **Step 1: Add members translation keys**

`en.json`:

```json
"members": {
  "title": "New Members", "tamilLabel": "புதிய உறுப்பினர்கள்",
  "intro": "New to British Columbia or just discovering us? We'd love to welcome your family. Fill in the form and a coordinator will reach out.",
  "name": "Full Name", "email": "Email", "phone": "Phone (WhatsApp)",
  "familySize": "Family Size", "heardFrom": "How did you hear about us?",
  "submit": "Join Our Family", "submitting": "Sending…",
  "success": "Thank you! A coordinator will reach out to welcome you soon.",
  "error": "Something went wrong. Please try again.",
  "nextTitle": "What Happens Next",
  "next1": "A coordinator reviews your details.",
  "next2": "We reach out to welcome you personally.",
  "next3": "You're added to our community WhatsApp group."
}
```

`ta.json`:

```json
"members": {
  "title": "புதிய உறுப்பினர்கள்", "tamilLabel": "புதிய உறுப்பினர்கள்",
  "intro": "பிரிட்டிஷ் கொலம்பியாவிற்கு புதியவரா அல்லது எங்களைக் கண்டறிகிறீர்களா? உங்கள் குடும்பத்தை வரவேற்க விரும்புகிறோம். படிவத்தை நிரப்புங்கள், ஒரு ஒருங்கிணைப்பாளர் தொடர்பு கொள்வார்.",
  "name": "முழு பெயர்", "email": "மின்னஞ்சல்", "phone": "தொலைபேசி (WhatsApp)",
  "familySize": "குடும்ப அளவு", "heardFrom": "எங்களைப் பற்றி எப்படி அறிந்தீர்கள்?",
  "submit": "எங்கள் குடும்பத்தில் இணையுங்கள்", "submitting": "அனுப்புகிறது…",
  "success": "நன்றி! ஒரு ஒருங்கிணைப்பாளர் விரைவில் உங்களை வரவேற்க தொடர்பு கொள்வார்.",
  "error": "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.",
  "nextTitle": "அடுத்து என்ன நடக்கும்",
  "next1": "ஒரு ஒருங்கிணைப்பாளர் உங்கள் விவரங்களை சரிபார்க்கிறார்.",
  "next2": "உங்களை நேரில் வரவேற்க தொடர்பு கொள்கிறோம்.",
  "next3": "எங்கள் சமூக WhatsApp குழுவில் சேர்க்கப்படுகிறீர்கள்."
}
```

- [ ] **Step 2: Write failing test for `NewMemberForm`**

Create `src/components/sections/__tests__/NewMemberForm.test.tsx`:

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { NewMemberForm } from '../NewMemberForm'

const messages = {
  members: {
    name: 'Full Name', email: 'Email', phone: 'Phone', familySize: 'Family Size',
    heardFrom: 'How did you hear about us?', submit: 'Join Our Family',
    submitting: 'Sending…', success: 'Thank you!', error: 'Something went wrong.',
    nextTitle: 'What Happens Next', next1: 'a', next2: 'b', next3: 'c',
  },
}
const wrap = () =>
  render(<NextIntlClientProvider locale="en" messages={messages}><NewMemberForm /></NextIntlClientProvider>)

beforeEach(() => { vi.restoreAllMocks() })

describe('NewMemberForm', () => {
  it('submits and shows success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    wrap()
    await userEvent.type(screen.getByLabelText('Full Name'), 'Mary')
    await userEvent.type(screen.getByLabelText('Email'), 'mary@example.com')
    await userEvent.click(screen.getByRole('button', { name: /Join Our Family/ }))
    await waitFor(() => expect(screen.getByText('Thank you!')).toBeInTheDocument())
  })

  it('shows error when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    wrap()
    await userEvent.type(screen.getByLabelText('Full Name'), 'Mary')
    await userEvent.type(screen.getByLabelText('Email'), 'mary@example.com')
    await userEvent.click(screen.getByRole('button', { name: /Join Our Family/ }))
    await waitFor(() => expect(screen.getByText('Something went wrong.')).toBeInTheDocument())
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- NewMemberForm
```

Expected: FAIL (module not found).

- [ ] **Step 4: Implement `NewMemberForm.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function NewMemberForm() {
  const t = useTranslations('members')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      familySize: String(fd.get('familySize') ?? ''),
      heardFrom: String(fd.get('heardFrom') ?? ''),
      website: String(fd.get('website') ?? ''), // honeypot
    }
    try {
      const res = await fetch('/api/new-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="rounded-lg bg-brand-cream p-6 text-center text-brand-blue">{t('success')}</p>
  }

  const field = 'w-full rounded-md border border-slate-300 bg-brand-cream px-3 py-2 text-sm'
  const label = 'mb-1 mt-3 block text-xs font-semibold text-brand-blue'

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md">
      <label className={label} htmlFor="name">{t('name')}</label>
      <input id="name" name="name" required className={field} />
      <label className={label} htmlFor="email">{t('email')}</label>
      <input id="email" name="email" type="email" required className={field} />
      <label className={label} htmlFor="phone">{t('phone')}</label>
      <input id="phone" name="phone" className={field} />
      <label className={label} htmlFor="familySize">{t('familySize')}</label>
      <input id="familySize" name="familySize" type="number" min="1" className={field} />
      <label className={label} htmlFor="heardFrom">{t('heardFrom')}</label>
      <input id="heardFrom" name="heardFrom" className={field} />
      {/* honeypot: hidden from humans, bots fill it */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-5 w-full rounded-full bg-brand-orange py-3 font-bold text-white disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : `${t('submit')} →`}
      </button>
      {status === 'error' && <p className="mt-3 text-center text-sm text-red-600">{t('error')}</p>}
    </form>
  )
}
```

- [ ] **Step 5: Run test, verify pass**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- NewMemberForm
```

Expected: PASS (both cases).

- [ ] **Step 6: Implement New Members page**

Create `src/app/[locale]/new-members/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { NewMemberForm } from '@/components/sections/NewMemberForm'

export default async function NewMembersPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('members')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section>
        <p className="mx-auto mb-2 max-w-lg text-center text-sm text-slate-600">{t('intro')}</p>
        <NewMemberForm />
        <div className="mx-auto mt-5 max-w-md rounded-lg bg-brand-creamDark p-4">
          <h4 className="mb-2 font-serif text-brand-blue">{t('nextTitle')}</h4>
          <ol className="list-decimal pl-5 text-sm leading-7 text-slate-600">
            <li>{t('next1')}</li>
            <li>{t('next2')}</li>
            <li>{t('next3')}</li>
          </ol>
        </div>
      </Section>
    </main>
  )
}
```

- [ ] **Step 7: Build**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build
```

Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add New Members page with submission form"
```

---

## Task 14: New-member API route (relay + spam protection)

**Files:**
- Create: `src/app/api/new-member/route.ts`, `src/lib/rate-limit.ts`
- Test: `src/lib/__tests__/rate-limit.test.ts`, `src/app/api/new-member/__tests__/route.test.ts`

**Interfaces:**
- Consumes: env `APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET`; honeypot field `website`.
- Produces:
  - `rateLimit(key: string, limit: number, windowMs: number): boolean` - returns `true` if allowed, `false` if over limit (in-memory).
  - `POST(req: Request): Promise<Response>` - validates, honeypot-checks, rate-limits, relays to Apps Script. Returns `200 {ok:true}` on success; `400` invalid; `429` rate-limited; `502` upstream failure. Honeypot hit returns `200` (silently drop, don't tip off bots).

- [ ] **Step 1: Write failing test for `rateLimit`**

Create `src/lib/__tests__/rate-limit.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { rateLimit } from '../rate-limit'

describe('rateLimit', () => {
  it('allows up to the limit then blocks within the window', () => {
    const key = 'test-ip-1'
    expect(rateLimit(key, 2, 60_000)).toBe(true)
    expect(rateLimit(key, 2, 60_000)).toBe(true)
    expect(rateLimit(key, 2, 60_000)).toBe(false)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- rate-limit
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement `rate-limit.ts`**

```ts
type Entry = { count: number; resetAt: number }
const store = new Map<string, Entry>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count += 1
  return true
}
```

> In-memory limiting is per-server-instance - adequate spam friction for a low-traffic community site. If abuse becomes a problem, swap for a durable store later.

- [ ] **Step 4: Run test, verify pass**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- rate-limit
```

Expected: PASS.

- [ ] **Step 5: Write failing test for the route**

Create `src/app/api/new-member/__tests__/route.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'

function req(body: unknown, ip = '1.2.3.4') {
  return new Request('http://localhost/api/new-member', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.restoreAllMocks()
  process.env.APPS_SCRIPT_URL = 'https://script.example/exec'
  process.env.APPS_SCRIPT_SECRET = 'secret'
})

const valid = { name: 'Mary', email: 'mary@example.com', phone: '', familySize: '3', heardFrom: 'Friend', website: '' }

describe('POST /api/new-member', () => {
  it('rejects missing name/email with 400', async () => {
    const res = await POST(req({ name: '', email: '' }, '9.9.9.1'))
    expect(res.status).toBe(400)
  })

  it('silently accepts but does not relay when honeypot is filled', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const res = await POST(req({ ...valid, website: 'bot' }, '9.9.9.2'))
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('relays a valid submission and returns 200', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    const res = await POST(req(valid, '9.9.9.3'))
    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledOnce()
    const [, opts] = fetchMock.mock.calls[0]
    expect(JSON.parse(opts.body).secret).toBe('secret')
    expect(JSON.parse(opts.body).name).toBe('Mary')
  })

  it('returns 502 when the upstream relay fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const res = await POST(req(valid, '9.9.9.4'))
    expect(res.status).toBe(502)
  })
})
```

- [ ] **Step 6: Run test, verify it fails**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- new-member
```

Expected: FAIL (module not found).

- [ ] **Step 7: Implement `route.ts`**

```ts
import { rateLimit } from '@/lib/rate-limit'

type Payload = {
  name?: string
  email?: string
  phone?: string
  familySize?: string
  heardFrom?: string
  website?: string
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request): Promise<Response> {
  let data: Payload
  try {
    data = (await req.json()) as Payload
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400)
  }

  // Honeypot: a filled "website" field means a bot. Accept silently, don't relay.
  if (data.website && data.website.trim() !== '') {
    return json({ ok: true }, 200)
  }

  const name = (data.name ?? '').trim()
  const email = (data.email ?? '').trim()
  if (!name || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'invalid_input' }, 400)
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`new-member:${ip}`, 5, 60 * 60 * 1000)) {
    return json({ ok: false, error: 'rate_limited' }, 429)
  }

  const url = process.env.APPS_SCRIPT_URL
  const secret = process.env.APPS_SCRIPT_SECRET
  if (!url || !secret) {
    return json({ ok: false, error: 'not_configured' }, 502)
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        name,
        email,
        phone: (data.phone ?? '').trim(),
        familySize: (data.familySize ?? '').trim(),
        heardFrom: (data.heardFrom ?? '').trim(),
      }),
    })
    if (!res.ok) return json({ ok: false, error: 'upstream' }, 502)
    return json({ ok: true }, 200)
  } catch {
    return json({ ok: false, error: 'upstream' }, 502)
  }
}
```

- [ ] **Step 8: Run all route + lib tests, verify pass**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- new-member rate-limit
```

Expected: PASS (all cases).

- [ ] **Step 9: Build**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build
```

Expected: build succeeds.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add new-member API route with honeypot and rate limiting"
```

---

## Task 15: Styled 404 page

**Files:**
- Create: `src/app/[locale]/not-found.tsx`, `src/app/not-found.tsx` (top-level fallback)
- Modify: `src/messages/en.json`, `src/messages/ta.json`

**Interfaces:**
- Consumes: `Button` (Task 7); translations.
- Produces: a branded 404 with a "Go Home" link.

- [ ] **Step 1: Add notFound keys**

`en.json`: `"notFound": { "title": "Page not found", "body": "The page you're looking for isn't here.", "home": "Go Home" }`
`ta.json`: `"notFound": { "title": "பக்கம் கிடைக்கவில்லை", "body": "நீங்கள் தேடும் பக்கம் இங்கு இல்லை.", "home": "முகப்புக்கு செல்லுங்கள்" }`

- [ ] **Step 2: Implement locale `not-found.tsx`**

```tsx
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  const t = useTranslations('notFound')
  return (
    <main className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-serif text-6xl text-brand-gold">404</p>
      <h1 className="mt-2 text-2xl font-bold text-brand-blue">{t('title')}</h1>
      <p className="mb-6 mt-2 text-slate-500">{t('body')}</p>
      <Button href="/">{t('home')}</Button>
    </main>
  )
}
```

- [ ] **Step 3: Implement top-level `src/app/not-found.tsx`**

```tsx
export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', textAlign: 'center', padding: '6rem' }}>
        <h1>404 - Page not found</h1>
        <a href="/en">Go Home</a>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Build + verify**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build && npm run dev
```

Visit `/en/nonexistent` → branded 404. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add styled 404 pages"
```

---

## Task 16: Apps Script - new-member receiver

**Files:**
- Create: `apps-script/new-member-receiver.gs`
- Modify: `README.md` (deployment notes - created in Task 19; if not yet present, add a stub now)

**Interfaces:**
- Consumes: POST JSON `{ secret, name, email, phone, familySize, heardFrom }` from Task 14.
- Produces: appends a row to the bound Google Sheet and emails `bctamilcatholicfamily@gmail.com`. Rejects when `secret` mismatches.

> This is Google-side code. It is version-controlled here but deployed manually by the user into the community account's Apps Script editor (steps documented inline).

- [ ] **Step 1: Write `new-member-receiver.gs`**

```js
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
```

- [ ] **Step 2: Manual deploy + smoke test (user action, documented)**

Document in commit message and README: deploy the Web App, set `SHARED_SECRET`, copy the `/exec` URL into Vercel env `APPS_SCRIPT_URL` and the same secret into `APPS_SCRIPT_SECRET`. Test by submitting the live New Members form once and confirming a Sheet row + email arrive.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Apps Script new-member receiver"
```

---

## Task 17: Prayer-digest window logic (unit-tested pure function)

**Files:**
- Create: `src/lib/digest-window.ts`
- Test: `src/lib/__tests__/digest-window.test.ts`

**Interfaces:**
- Produces:
  - `type MassWindow = { sendToday: boolean; sinceISO: string | null; nextMassISO: string | null }`
  - `computeDigestWindow(now: Date, massDatesISO: string[]): MassWindow` - given the current time and a sorted list of "Holy Mass" event start times, decide whether a Mass occurs within the next 24h (`sendToday`), and if so the window start = the most recent past Mass (`sinceISO`).

This pure function is unit-tested here and then copied verbatim into the Apps Script in Task 18 (Apps Script can't import from the repo).

- [ ] **Step 1: Write failing test**

Create `src/lib/__tests__/digest-window.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { computeDigestWindow } from '../digest-window'

const now = new Date('2026-07-11T20:00:00-07:00') // evening before a Jul 12 Mass

describe('computeDigestWindow', () => {
  it('sends when a Mass falls within the next 24h, windowing from the previous Mass', () => {
    const masses = ['2026-06-14T10:30:00-07:00', '2026-07-12T10:30:00-07:00', '2026-08-09T10:30:00-07:00']
    const w = computeDigestWindow(now, masses)
    expect(w.sendToday).toBe(true)
    expect(w.sinceISO).toBe('2026-06-14T10:30:00-07:00')
    expect(w.nextMassISO).toBe('2026-07-12T10:30:00-07:00')
  })

  it('does not send when no Mass is within 24h', () => {
    const masses = ['2026-08-09T10:30:00-07:00']
    const w = computeDigestWindow(now, masses)
    expect(w.sendToday).toBe(false)
    expect(w.sinceISO).toBeNull()
  })

  it('uses epoch start when there is no previous Mass', () => {
    const masses = ['2026-07-12T10:30:00-07:00']
    const w = computeDigestWindow(now, masses)
    expect(w.sendToday).toBe(true)
    expect(w.sinceISO).toBe('1970-01-01T00:00:00.000Z')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- digest-window
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement `digest-window.ts`**

```ts
export type MassWindow = {
  sendToday: boolean
  sinceISO: string | null
  nextMassISO: string | null
}

export function computeDigestWindow(now: Date, massDatesISO: string[]): MassWindow {
  const nowMs = now.getTime()
  const in24h = nowMs + 24 * 60 * 60 * 1000
  const sorted = [...massDatesISO]
    .map((s) => ({ s, t: new Date(s).getTime() }))
    .filter((x) => !Number.isNaN(x.t))
    .sort((a, b) => a.t - b.t)

  const next = sorted.find((x) => x.t >= nowMs && x.t <= in24h)
  if (!next) return { sendToday: false, sinceISO: null, nextMassISO: null }

  const prev = [...sorted].reverse().find((x) => x.t < next.t && x.t < nowMs)
  return {
    sendToday: true,
    sinceISO: prev ? prev.s : new Date(0).toISOString(),
    nextMassISO: next.s,
  }
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test -- digest-window
```

Expected: PASS (all three cases).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add prayer-digest window logic with tests"
```

---

## Task 18: Apps Script - prayer digest job

**Files:**
- Create: `apps-script/prayer-digest.gs`

**Interfaces:**
- Consumes: the community Google Calendar (Mass events titled "Holy Mass") and the prayer-request responses Sheet.
- Produces: a daily time-driven function `sendPrayerDigestIfMassTomorrow()` that emails the digest to `bctamilcatholicfamily@gmail.com` when a Mass is within 24h, using the window logic from Task 17 (copied in).

- [ ] **Step 1: Write `prayer-digest.gs`**

```js
// Deploy: bound to the prayer-requests responses Sheet.
// Set Script Property CALENDAR_ID to the community calendar id.
// Triggers → Add trigger → sendPrayerDigestIfMassTomorrow →
//   Time-driven → Day timer → 8pm-9pm.
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
    subject: 'Prayer Intentions for Holy Mass - ' + massDate,
    body: [
      'Prayer intentions submitted since the last Mass, for ' + massDate + ':',
      '',
      intentions.join('\n'),
      '',
      '(' + intentions.length + ' intention(s). Gmail rules forward this to coordinators and clergy.)',
    ].join('\n'),
  });
}
```

- [ ] **Step 2: Manual deploy + dry run (user action, documented)**

Document: set `CALENDAR_ID`, create the daily trigger, and test by temporarily adding a "Holy Mass" calendar event for tomorrow + a test form response, then Run the function and confirm the email. Note the zero-intentions skip.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Apps Script calendar-driven prayer digest"
```

---

## Task 19: README, env docs, launch checklist, and final QA

**Files:**
- Create/Modify: `README.md`
- Verify: full build, all tests, both locales.

**Interfaces:** none (documentation + verification).

- [ ] **Step 1: Write `README.md`**

Include: project summary; prerequisites (Node 24, `export PATH="/c/Program Files/nodejs:$PATH"` note for this machine); `npm install`, `npm run dev`, `npm test`, `npm run build`; the env vars from `.env.example` and where each comes from; Apps Script deployment steps for both `.gs` files; and a **Launch Checklist** capturing every `TODO(content)` and spec Open Item:
  1. Real social URLs in `src/config/site.ts`
  2. Real Google Form URL (prayer) in `src/config/site.ts`
  3. Real Google Maps embed URL in `src/config/site.ts`
  4. `GOOGLE_CALENDAR_API_KEY` + `GOOGLE_CALENDAR_ID` set in Vercel
  5. `APPS_SCRIPT_URL` + `APPS_SCRIPT_SECRET` set in Vercel and matching the Apps Script property
  6. Mass events titled with "Holy Mass" in the calendar
  7. Header logo text decision (Open Item #1) confirmed
  8. Real hero/community photos added
  9. Welcome/Mission/Vision/Story copy finalized in both languages
  10. Custom domain `bctamilcatholicfamily.ca` pointed at Vercel (post-feedback)

- [ ] **Step 2: Full test run**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm test
```

Expected: all tests pass.

- [ ] **Step 3: Full production build**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run build
```

Expected: build succeeds; all 7 pages × 2 locales generate.

- [ ] **Step 4: Manual bilingual + responsive pass**

```bash
export PATH="/c/Program Files/nodejs:$PATH"
npm run dev
```

For each page (Home, About, Events, Prayer, New Members, Socials, Contact): verify `/en` and `/ta` render, Tamil uses the Tamil font, the language toggle preserves the path, and layouts hold at mobile width (DevTools ~375px). Confirm the New Members form shows success against a configured Apps Script (or the error state otherwise). Stop the server.

- [ ] **Step 5: Commit + push (triggers Vercel deploy)**

```bash
git add -A
git commit -m "docs: add README, env docs, and launch checklist"
git push origin main
```

Expected: Vercel auto-deploys; the production `*.vercel.app` URL reflects the finished site (pending the content TODOs in the launch checklist).

---

## Self-Review Notes

- **Spec coverage:** Home, About, Events, Prayer, New Members, Socials, Contact → Tasks 9, 11, 12, 13. Bilingual routing/toggle → Tasks 5, 8. Brand/visual direction → Tasks 5, 7. Google Calendar events + empty state → Tasks 10, 11. New-member form → Sheet + email with honeypot/rate-limit/secret → Tasks 13, 14, 16. Prayer form + calendar-driven digest (next & previous Mass from calendar, zero-skip) → Tasks 12, 17, 18. Error handling (empty calendar, form fail, Apps Script error log, 404) → Tasks 10, 11, 13, 14, 16, 15. Security (env secrets, honeypot, rate limit, shared token, no public PII) → Tasks 10, 14, 16. Coordinators terminology → Tasks 12, 13, 16. GitHub + Vercel setup, no Supabase → Tasks 3, 4. Maintenance (announcements.json, messages files) → Tasks 9, 5. Open Items tracked → Tasks 6, 8, 19.
- **Type consistency:** `CalendarEvent` shape and `getUpcomingEvents`/`mapItem` signatures consistent across Tasks 10-11. `computeDigestWindow`/`MassWindow` consistent across Tasks 17-18. API payload `{name,email,phone,familySize,heardFrom,website}` consistent across Tasks 13-14. `NavKey`/`NAV_ITEMS`/`SITE` consistent across Tasks 6, 8, 12.
- **Placeholders:** the only `TODO(content)` markers are genuine community-supplied data (URLs, copy, photos), each tracked in the Task 19 launch checklist - not unfinished code.
