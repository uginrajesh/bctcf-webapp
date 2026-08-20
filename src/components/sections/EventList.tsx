import { useLocale, useTranslations } from 'next-intl'
import type { CalendarEvent } from '@/lib/google-calendar'

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
          <div key={e.id} className="mb-3 flex gap-4 rounded-xl border border-brand-goldLine bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="min-w-16 rounded-lg bg-brand-blue px-4 py-2 text-center text-white">
              <div className="text-2xl font-extrabold leading-none">{d.day}</div>
              <div className="text-xs uppercase tracking-wide">{d.month}</div>
            </div>
            <div>
              {e.isMass && (
                <span className="mb-1 inline-block rounded-full bg-brand-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-gold">
                  Holy Mass
                </span>
              )}
              <h3 className="font-serif text-brand-blue">{e.title[locale]}</h3>
              <p className="text-xs text-slate-500">
                {[d.time, (e.venue ?? e.location)[locale]].filter(Boolean).join(' · ')}
              </p>
              {e.description[locale] && <p className="mt-1 text-xs text-slate-500">{e.description[locale]}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
