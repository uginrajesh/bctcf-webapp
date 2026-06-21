import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { Button } from '@/components/ui/Button'
import { SITE } from '@/config/site'

export default async function PrayerPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('prayer')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section className="text-center">
        <p className="mx-auto max-w-xl text-slate-600">{t('intro')}</p>
        <div className="mx-auto mt-4 max-w-xl rounded-lg border border-dashed border-brand-gold bg-brand-cream p-4 text-sm text-brand-gold">
          🔒 {t('confidential')}
        </div>
        <div className="mt-6">
          <a href={SITE.prayerFormUrl} target="_blank" rel="noopener noreferrer">
            <Button>{t('cta')} →</Button>
          </a>
        </div>
      </Section>
    </main>
  )
}
