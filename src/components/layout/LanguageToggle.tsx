'use client'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/routing'

export function LanguageToggle() {
  const t = useTranslations('common')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const other = locale === 'en' ? 'ta' : 'en'
  return (
    <button
      onClick={() => router.replace(pathname, { locale: other })}
      className="rounded-full border-[1.5px] border-brand-blue px-3 py-1 text-xs font-semibold text-brand-blue transition-colors hover:bg-brand-blue hover:text-white"
      aria-label={`Switch to ${t('languageName')}`}
    >
      {locale === 'en' ? 'EN | தமிழ்' : 'தமிழ் | EN'}
    </button>
  )
}
