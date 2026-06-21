import { setRequestLocale } from 'next-intl/server'
import { useTranslations } from 'next-intl'

export default function Home({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = useTranslations('common')
  return <main className="p-10 text-brand-blue text-2xl">{t('communityName')}</main>
}
