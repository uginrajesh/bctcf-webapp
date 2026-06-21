import { useTranslations } from 'next-intl'
import { SITE } from '@/config/site'

export function Footer() {
  const t = useTranslations('common')
  return (
    <footer className="bg-brand-blueDark px-6 py-8 text-center text-sm text-slate-200">
      <p className="font-bold">{t('communityName')}</p>
      <p className="mt-1 font-tamil opacity-80">{t('tagline')}</p>
      <p className="mt-3 opacity-70">{SITE.email}</p>
      <p className="opacity-60">British Columbia, Canada</p>
    </footer>
  )
}
