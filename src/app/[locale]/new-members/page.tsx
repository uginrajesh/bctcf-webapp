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
        <p className="mx-auto mb-6 max-w-lg text-center text-sm text-slate-600">{t('intro')}</p>
        <FormEmbed src={SITE.newMemberFormUrl} title={t('title')} />
        <div className="mx-auto mt-8 max-w-md rounded-lg bg-brand-creamDark p-4">
          <h4 className="mb-2 font-serif text-brand-blue">{t('nextTitle')}</h4>
          <ol className="list-decimal pl-5 text-sm leading-7 text-slate-600">
            <li>{t('next1')}</li>
            <li>{t('next2')}</li>
            <li>{t('next3')}</li>
          </ol>
        </div>
      </Section>
    </main>
  )
}
