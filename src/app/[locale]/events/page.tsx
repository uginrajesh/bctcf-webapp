import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { EventList } from '@/components/sections/EventList'
import { NextMass } from '@/components/sections/NextMass'
import { getUpcomingEvents } from '@/lib/google-calendar'

export default async function EventsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('events')
  const events = await getUpcomingEvents()
  const nextMass = events.find((e) => e.isMass)
  const upcoming = nextMass ? events.filter((e) => e.id !== nextMass.id) : events
  return (
    <main>
      <PageBanner title={t('title')} />
      {nextMass && (
        <Section className="pb-0">
          <NextMass event={nextMass} />
        </Section>
      )}
      <Section label={t('upcomingLabel')}>
        <EventList events={upcoming} />
      </Section>
    </main>
  )
}
