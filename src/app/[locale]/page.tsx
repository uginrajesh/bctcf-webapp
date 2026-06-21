import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Hero } from '@/components/sections/Hero'
import { Section } from '@/components/ui/Section'
import { MissionCards } from '@/components/sections/MissionCards'
import { UpcomingEvent } from '@/components/sections/UpcomingEvent'
import { QuickAccess } from '@/components/sections/QuickAccess'
import { Announcements } from '@/components/sections/Announcements'
import { getUpcomingEvents } from '@/lib/google-calendar'

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('home')
  const [next] = await getUpcomingEvents(1)
  return (
    <main>
      <Hero />
      <Section className="bg-brand-cream text-center">
        <h2 className="mb-3 font-serif text-2xl text-brand-blue">{t('welcomeTitle')}</h2>
        <p className="mx-auto max-w-2xl leading-relaxed text-slate-600">{t('welcomeBody')}</p>
      </Section>
      <MissionCards />
      <UpcomingEvent event={next ?? null} />
      <QuickAccess />
      <Announcements />
    </main>
  )
}
