import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { Hero } from '@/components/sections/Hero'
import { Section } from '@/components/ui/Section'
import { MissionCards } from '@/components/sections/MissionCards'
import { QuickAccess } from '@/components/sections/QuickAccess'
import { Announcements } from '@/components/sections/Announcements'

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = useTranslations('home')
  return (
    <main>
      <Hero />
      <Section className="bg-brand-cream text-center">
        <h2 className="mb-3 font-serif text-2xl text-brand-blue">{t('welcomeTitle')}</h2>
        <p className="mx-auto max-w-2xl leading-relaxed text-slate-600">{t('welcomeBody')}</p>
      </Section>
      <MissionCards />
      {/* UpcomingEvent inserted here in Task 11 */}
      <QuickAccess />
      <Announcements />
    </main>
  )
}
