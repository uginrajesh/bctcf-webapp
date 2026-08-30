import { findVenue } from './venues'

// Cache tag for everything fetched from the calendar. `revalidateTag` on this
// makes a calendar edit visible immediately -- see /api/revalidate. Without it
// an edit waits out the revalidate window below, because Vercel's data cache
// survives deployments and is not refreshed at build time, so redeploying does
// not pick up new events either.
export const CALENDAR_TAG = 'calendar'

export type Localized = { en: string; ta: string }

export type CalendarEvent = {
  id: string
  title: Localized
  description: Localized
  location: Localized
  // Tamil display name for a known parish, resolved from the address.
  venue: Localized | null
  start: string
  end: string
  isMass: boolean
}

type GoogleEventItem = {
  id: string
  summary?: string
  description?: string
  location?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
}

// Calendar entries carry both languages in a single field, split by a `--ta--`
// marker: everything before it is English, everything after is Tamil. Titles
// keep it inline ("Tamil Mass --ta-- Tamil text") since Google Calendar
// summaries cannot hold newlines; descriptions usually put it on its own line.
// Entries without the marker reuse the same text for both locales, so an
// untranslated event still renders instead of going blank on /ta.
const TA_MARKER = /--\s*ta\s*--/i

export function splitBilingual(text: string): Localized {
  const trimmed = text.trim()
  if (!trimmed) return { en: '', ta: '' }
  const m = TA_MARKER.exec(trimmed)
  if (!m) return { en: trimmed, ta: trimmed }
  const en = trimmed.slice(0, m.index).trim()
  const ta = trimmed.slice(m.index + m[0].length).trim()
  // A marker with nothing on one side falls back rather than rendering blank.
  return { en: en || ta, ta: ta || en }
}

export function mapItem(item: GoogleEventItem): CalendarEvent {
  const summary = item.summary ?? ''
  const location = splitBilingual(item.location ?? '')
  return {
    id: item.id,
    title: splitBilingual(summary),
    description: splitBilingual(item.description ?? ''),
    location,
    // An explicit `--ta--` in the calendar wins; the lookup only fills the gap.
    venue: location.en === location.ta ? findVenue(location.en) : null,
    start: item.start?.dateTime ?? item.start?.date ?? '',
    end: item.end?.dateTime ?? item.end?.date ?? '',
    // Match the raw summary so the flag works whichever half names the Mass.
    isMass: /holy mass/i.test(summary),
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
    const res = await fetch(url, { next: { revalidate: 3600, tags: [CALENDAR_TAG] } })
    if (!res.ok) return []
    const data = (await res.json()) as { items?: GoogleEventItem[] }
    return (data.items ?? []).map(mapItem)
  } catch {
    return []
  }
}
