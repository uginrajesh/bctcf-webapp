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
          <div className="rounded-2xl border border-brand-goldLine bg-white p-6 text-sm text-slate-600 shadow-sm">
            <h4 className="mb-4 font-serif text-lg font-semibold text-brand-blue">{t('getInTouch')}</h4>
            <p className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                <Mail className="h-4 w-4" aria-hidden />
              </span>
              <a className="text-brand-blue underline underline-offset-2 hover:text-brand-gold" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
            <p className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                <MapPin className="h-4 w-4" aria-hidden />
              </span>
              <span className="pt-1.5">{t('location')}</span>
            </p>
          </div>
        </div>
      </Section>
    </main>
  )
}
