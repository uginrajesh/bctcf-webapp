import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Mail, MapPin } from 'lucide-react'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { SITE } from '@/config/site'

export default async function ContactPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('contact')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section>
        <div className="mx-auto max-w-md">
          <div className="rounded-lg border border-brand-creamDark bg-brand-cream p-5 text-sm text-slate-600">
            <h4 className="mb-2 font-serif text-brand-blue">{t('getInTouch')}</h4>
            <p className="mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
              <a className="text-brand-blue underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
              <span>{t('location')}</span>
            </p>
          </div>
        </div>
      </Section>
    </main>
  )
}
