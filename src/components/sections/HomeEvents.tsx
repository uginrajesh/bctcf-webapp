import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { EventList } from './EventList'
import type { CalendarEvent } from '@/lib/google-calendar'

// The home page already features the next Mass and the next other event above
// this block, so `events` arrives with those filtered out. Renders nothing when
// there is nothing left to show rather than an empty-state the visitor cannot
// act on -- the full list always lives on /events.
export function HomeEvents({ events }: { events: CalendarEvent[] }) {
  const t = useTranslations('home')
  const te = useTranslations('events')
  if (events.length === 0) return null
  return (
    <Section className="bg-brand-creamDark">
      <SectionHeading align="center" className="mb-8">
        {t('announcements')}
      </SectionHeading>
      <EventList events={events} />
      <div className="mt-6 text-center">
        <Link
          href="/events"
          className="inline-block rounded-full border-2 border-brand-blue px-6 py-2.5 text-sm font-bold text-brand-blue transition hover:bg-brand-blue hover:text-white"
        >
          {te('viewAll')} →
        </Link>
      </div>
    </Section>
  )
}
