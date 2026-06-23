import { useLocale, useTranslations } from 'next-intl'
import type { CalendarEvent } from '@/lib/google-calendar'

function formatFull(iso: string, locale: 'en' | 'ta') {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const loc = locale === 'ta' ? 'ta-IN' : 'en-CA'
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  if (!iso.includes('T')) return d.toLocaleDateString(loc, dateOpts)
  return d.toLocaleString(loc, { ...dateOpts, hour: 'numeric', minute: '2-digit' })
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
              title={`${t('nextMass')} — ${event.location}`}
              className="h-full min-h-[12rem] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}
      </div>
    </div>
  )
}
