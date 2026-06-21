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
