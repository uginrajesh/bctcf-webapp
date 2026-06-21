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
