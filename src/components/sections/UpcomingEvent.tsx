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
      <div className="mx-auto flex max-w-3xl items-center gap-6 rounded-2xl bg-brand-blue p-7 text-white shadow-lg shadow-brand-blue/20 ring-1 ring-brand-goldSoft/30">
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
