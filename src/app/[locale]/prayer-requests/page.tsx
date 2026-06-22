import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { FormEmbed } from '@/components/ui/FormEmbed'
import { SITE } from '@/config/site'
import { Lock } from 'lucide-react'

export default async function PrayerPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('prayer')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section>
        <p className="mx-auto max-w-xl text-center text-slate-600">{t('intro')}</p>
        <div className="mx-auto mt-4 flex max-w-xl items-center gap-2 rounded-lg border border-dashed border-brand-gold bg-brand-cream p-4 text-sm text-brand-gold">
          <Lock className="h-4 w-4 shrink-0" aria-hidden />
          <span>{t('confidential')}</span>
        </div>
        <div className="mt-6">
          <FormEmbed src={SITE.prayerFormUrl} title={t('title')} />
        </div>
      </Section>
    </main>
  )
}
