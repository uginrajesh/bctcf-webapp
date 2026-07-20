import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { FormEmbed } from '@/components/ui/FormEmbed'
import { SITE } from '@/config/site'

export default async function NewMembersPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('members')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section>
        <p className="mx-auto mb-6 max-w-lg text-center leading-relaxed text-slate-600">{t('intro')}</p>
        <FormEmbed src={SITE.newMemberFormUrl} title={t('title')} />
        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-brand-goldLine bg-white p-6 shadow-sm">
          <h4 className="mb-4 font-serif text-lg font-semibold text-brand-blue">{t('nextTitle')}</h4>
          <ol className="space-y-3">
            {[t('next1'), t('next2'), t('next3')].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>
    </main>
  )
}
