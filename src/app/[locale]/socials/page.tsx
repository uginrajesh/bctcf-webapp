import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { SocialCards } from '@/components/sections/SocialCards'

export default async function SocialsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('socials')
  return (
    <main>
      <PageBanner title={t('title')} />
      <Section>
        <p className="mb-6 text-center text-slate-600">{t('intro')}</p>
        <SocialCards />
      </Section>
    </main>
  )
}
