import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import type { CalendarEvent } from '@/lib/google-calendar'
import { EVENT_TZ } from './EventList'

function formatFull(iso: string, locale: 'en' | 'ta') {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const loc = locale === 'ta' ? 'ta-IN' : 'en-CA'
  const timed = iso.includes('T')
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timed ? EVENT_TZ : 'UTC',
  }
  if (!timed) return d.toLocaleDateString(loc, dateOpts)
  return d.toLocaleString(loc, { ...dateOpts, hour: 'numeric', minute: '2-digit' })
}

// Google Calendar "Add to Calendar" template URL needs compact UTC timestamps:
// timed -> YYYYMMDDTHHmmssZ, all-day -> YYYYMMDD.
function gcalDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  if (!iso.includes('T')) return iso.replace(/-/g, '')
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function googleCalendarUrl(event: CalendarEvent) {
  const start = gcalDate(event.start)
  let end = gcalDate(event.end)
  if (!end) {
    end = event.start.includes('T')
      ? gcalDate(new Date(new Date(event.start).getTime() + 60 * 60 * 1000).toISOString())
      : start
  }
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title || 'Holy Mass',
    dates: `${start}/${end}`,
  })
  if (event.location) params.set('location', event.location)
  if (event.description) params.set('details', event.description)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function NextMass({ event }: { event: CalendarEvent }) {
  const t = useTranslations('events')
  const locale = useLocale() as 'en' | 'ta'

  return (
    <div className="mx-auto mb-10 max-w-3xl overflow-hidden rounded-xl border border-brand-creamDark bg-white shadow-sm">
      <div className="bg-brand-blue px-6 py-3 text-center">
        <h2 className="font-serif text-xl text-white">{t('nextMass')}</h2>
      </div>
      <div className="grid md:grid-cols-2">
        <div className="space-y-4 p-6 text-sm text-slate-600">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-brand-gold">
              {t('dateTimeLabel')}
            </div>
            <div className="font-semibold text-brand-blue">{formatFull(event.start, locale)}</div>
          </div>
          {event.location && (
            <div>
              <div className="text-[11px] uppercase tracking-wide text-brand-gold">
                {t('locationLabel')}
              </div>
              <div>{event.location}</div>
            </div>
          )}
          {event.title && <div className="text-xs text-slate-400">{event.title}</div>}
        </div>
        {event.location && (
          <div className="min-h-[12rem] overflow-hidden md:border-l md:border-brand-creamDark">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
              title={`${t('nextMass')} - ${event.location}`}
              className="h-full min-h-[12rem] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-3 border-t border-brand-creamDark px-6 py-5">
        <Link
          href="/prayer-requests"
          className="rounded-full bg-brand-orange px-6 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105"
        >
          {t('registerForMass')}
        </Link>
        <a
          href={googleCalendarUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border-2 border-brand-blue px-6 py-2.5 text-sm font-bold text-brand-blue transition hover:bg-brand-blue hover:text-white"
        >
          {t('setReminder')}
        </a>
      </div>
    </div>
  )
}
