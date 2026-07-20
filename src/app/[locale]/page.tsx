import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Hero } from '@/components/sections/Hero'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { MissionCards } from '@/components/sections/MissionCards'
import { NextMass } from '@/components/sections/NextMass'
import { UpcomingEvent } from '@/components/sections/UpcomingEvent'
import { QuickAccess } from '@/components/sections/QuickAccess'
import { Announcements } from '@/components/sections/Announcements'
import { getUpcomingEvents } from '@/lib/google-calendar'
import { getHeroImages } from '@/lib/hero-images'

export default async function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('home')
  const events = await getUpcomingEvents(10)
  const nextMass = events.find((e) => e.isMass) ?? null
  const nextOther = events.find((e) => e.id !== nextMass?.id) ?? null
  const heroImages = getHeroImages()
  return (
    <main>
      <Hero images={heroImages} />
      <Section className="bg-brand-cream text-center">
        <SectionHeading align="center" className="mb-4">{t('welcomeTitle')}</SectionHeading>
        <p className="mx-auto max-w-2xl leading-relaxed text-slate-600">{t('welcomeBody')}</p>
      </Section>
      <MissionCards />
      {nextMass && (
        <Section>
          <NextMass event={nextMass} />
        </Section>
      )}
      <UpcomingEvent event={nextOther} />
      <QuickAccess />
      <Announcements />
    </main>
  )
}
