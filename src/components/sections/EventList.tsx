import { MapPin } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { CalendarEvent } from '@/lib/google-calendar'
import { streetAddress } from '@/lib/venues'

// Always display events in BC local time, regardless of the server's timezone
// (Vercel runs in UTC, which otherwise shifted 4pm PDT to 11pm).
export const EVENT_TZ = 'America/Vancouver'

export function formatEventDate(iso: string, locale: 'en' | 'ta') {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { day: '', month: '', time: '' }
  const loc = locale === 'ta' ? 'ta-IN' : 'en-CA'
  const timed = iso.includes('T')
  // Date-only (all-day) events have no offset → render in UTC so the calendar
  // date doesn't slip a day; timed events render in BC time.
  const tz = timed ? EVENT_TZ : 'UTC'
  return {
    day: d.toLocaleDateString(loc, { day: '2-digit', timeZone: tz }),
    month: d.toLocaleDateString(loc, { month: 'short', timeZone: tz }),
    time: timed ? d.toLocaleTimeString(loc, { hour: 'numeric', minute: '2-digit', timeZone: EVENT_TZ }) : '',
  }
}

// Google's documented "open a search" URL. Feed it the English address: Maps
// geocodes that far more reliably than a translated parish name.
function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function EventList({ events }: { events: CalendarEvent[] }) {
  const t = useTranslations('events')
  const locale = useLocale() as 'en' | 'ta'
  if (events.length === 0) {
    return <p className="py-10 text-center text-slate-500">{t('empty')}</p>
  }
  return (
    <div className="mx-auto max-w-3xl">
      {events.map((e) => {
        const d = formatEventDate(e.start, locale)
        // With the venue name on its own line the address only needs its street
        // part; an unrecognised location keeps every segment it came with.
        const address = e.venue ? streetAddress(e.location[locale]) : e.location[locale]
        const mapQuery = e.location.en || e.location.ta
        return (
          <div
            key={e.id}
            className="mb-4 flex items-start gap-4 rounded-xl border border-brand-goldLine bg-white p-5 shadow-sm transition hover:shadow-md sm:gap-5"
          >
            <div className="min-w-[4.5rem] rounded-lg bg-brand-blue px-4 py-3 text-center text-white">
              <div className="text-3xl font-extrabold leading-none">{d.day}</div>
              <div className="mt-1 text-xs uppercase tracking-wide">{d.month}</div>
            </div>

            <div className="min-w-0 flex-1">
              {e.isMass && (
                <span className="mb-1 inline-block rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold">
                  {t('massBadge')}
                </span>
              )}
              <h3 className="font-serif text-lg text-brand-blue">{e.title[locale]}</h3>
              {d.time && <p className="mt-0.5 text-sm font-medium text-slate-600">{d.time}</p>}
              {(e.venue || address) && (
                <div className="mt-1.5 text-sm text-slate-500">
                  {e.venue && <div className="font-semibold text-brand-blue">{e.venue[locale]}</div>}
                  {address && <div>{address}</div>}
                </div>
              )}
              {e.description[locale] && (
                <p className="mt-2 text-sm text-slate-500">{e.description[locale]}</p>
              )}
            </div>

            {mapQuery && (
              <a
                href={mapsUrl(mapQuery)}
                target="_blank"
                rel="noopener noreferrer"
                // The pin alone would announce as "link"; name it with the place
                // so it is distinguishable when there are several on the page.
                aria-label={`${t('openInMaps')}: ${(e.venue ?? e.location)[locale]}`}
                title={t('openInMaps')}
                className="shrink-0 rounded-full border border-brand-goldLine p-2.5 text-brand-blue transition hover:bg-brand-blue hover:text-white"
              >
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </a>
            )}
          </div>
        )
      })}
    </div>
  )
}
