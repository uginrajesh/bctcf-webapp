import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { PriestsGrid, type Priest } from '@/components/sections/PriestsGrid'
import data from '@/data/priests.json'

export default async function OurPriestsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('priests')
  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />
      <Section>
        <p className="mx-auto mb-8 max-w-xl text-center text-slate-600">{t('intro')}</p>
        <PriestsGrid priests={data.priests as Priest[]} />
      </Section>
    </main>
  )
}
