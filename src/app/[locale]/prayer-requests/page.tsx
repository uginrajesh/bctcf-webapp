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
        <p className="mx-auto max-w-xl text-center leading-relaxed text-slate-600">{t('intro')}</p>
        <div className="mx-auto mt-5 flex max-w-xl items-center gap-3 rounded-xl border border-brand-goldLine bg-white p-4 text-sm text-slate-600 shadow-sm">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
            <Lock className="h-4 w-4" aria-hidden />
          </span>
          <span>{t('confidential')}</span>
        </div>
        <div className="mt-6">
          <FormEmbed src={SITE.prayerFormUrl} title={t('title')} />
        </div>
      </Section>
    </main>
  )
}
