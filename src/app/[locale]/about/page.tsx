import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('about')
  const values = t('values').split(',')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section>
        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
          <Card title={t('story')}>{t('storyBody')}</Card>
          <Card title={t('mission')}>{t('missionBody')}</Card>
          <Card title={t('vision')}>{t('visionBody')}</Card>
        </div>
      </Section>
      <Section label={t('coreValues')} className="bg-brand-creamDark">
        <div className="flex flex-wrap justify-center gap-2">
          {values.map((v) => (
            <span key={v} className="rounded-full border border-brand-gold/40 bg-brand-cream px-4 py-1.5 font-serif text-sm text-brand-blue">
              {v}
            </span>
          ))}
        </div>
      </Section>
    </main>
  )
}
