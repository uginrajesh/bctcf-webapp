'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { NAV_ITEMS } from '@/config/site'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const t = useTranslations('nav')
  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="text-2xl text-brand-blue"
      >
        ☰
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-full z-20 flex flex-col gap-1 border-t bg-white p-4 shadow-lg">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-slate-700 hover:bg-brand-creamDark"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
