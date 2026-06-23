import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { NAV_ITEMS } from '@/config/site'
import { LanguageToggle } from './LanguageToggle'
import { MobileNav } from './MobileNav'

export function Header() {
  const t = useTranslations('nav')
  const tc = useTranslations('common')
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3 shadow-sm">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.svg" alt="BCTCF logo" width={52} height={52} priority />
        <span className="hidden text-sm font-bold leading-tight text-brand-blue sm:block">
          {tc('communityName')}
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <nav className="hidden items-center gap-4 text-sm text-slate-700 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.key} href={item.href} className="hover:text-brand-blue">
              {t(item.key)}
            </Link>
          ))}
        </nav>
        <LanguageToggle />
        <MobileNav />
      </div>
    </header>
  )
}
