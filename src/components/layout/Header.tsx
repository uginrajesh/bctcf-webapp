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
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-brand-goldLine bg-brand-cream/90 px-6 py-3 backdrop-blur supports-[backdrop-filter]:bg-brand-cream/75">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.svg" alt="BCTCF logo" width={52} height={52} priority />
        <span className="hidden font-serif text-[15px] font-semibold leading-tight text-brand-blue sm:block">
          {tc('communityName')}
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <nav className="hidden items-center gap-5 text-sm font-medium text-brand-ink md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="relative transition-colors hover:text-brand-gold after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-brand-gold after:transition-all hover:after:w-full"
            >
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
