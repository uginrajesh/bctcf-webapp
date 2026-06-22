'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

type Localized = { en: string; ta: string }
export type Priest = {
  id: string
  photo: string
  name: Localized
  role?: Localized
  brief: Localized
  full: Localized
}

export function PriestsGrid({ priests }: { priests: Priest[] }) {
  const t = useTranslations('priests')
  const locale = useLocale() as 'en' | 'ta'
  const [openId, setOpenId] = useState<string | null>(null)
  const open = priests.find((p) => p.id === openId) ?? null

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenId(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (priests.length === 0) {
    return <p className="py-10 text-center text-slate-500">{t('empty')}</p>
  }

  return (
    <>
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 md:grid-cols-3">
        {priests.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border-b-[3px] border-brand-gold bg-white p-5 text-center shadow-sm"
          >
            <div className="relative mx-auto mb-3 h-32 w-32 overflow-hidden rounded-full bg-brand-creamDark">
              <Image src={p.photo} alt={p.name[locale]} fill sizes="128px" className="object-cover" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-brand-blue">{p.name[locale]}</h3>
            {p.role && (
              <p className="text-xs uppercase tracking-wide text-brand-gold">{p.role[locale]}</p>
            )}
            <p className="mt-2 text-sm text-slate-600">{p.brief[locale]}</p>
            <button
              type="button"
              onClick={() => setOpenId(p.id)}
              className="mt-3 text-sm font-semibold text-brand-blue underline hover:text-brand-gold"
            >
              {t('knowMore')} →
            </button>
          </div>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={open.name[locale]}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenId(null)}
              aria-label={t('close')}
              className="absolute right-3 top-3 text-slate-400 hover:text-brand-blue"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative mx-auto mb-4 h-36 w-36 overflow-hidden rounded-full bg-brand-creamDark">
              <Image src={open.photo} alt={open.name[locale]} fill sizes="144px" className="object-cover" />
            </div>
            <h3 className="font-serif text-xl font-bold text-brand-blue">{open.name[locale]}</h3>
            {open.role && (
              <p className="text-xs uppercase tracking-wide text-brand-gold">{open.role[locale]}</p>
            )}
            <p className="mt-4 whitespace-pre-line text-left text-sm leading-relaxed text-slate-600">
              {open.full[locale]}
            </p>
            <button
              type="button"
              onClick={() => setOpenId(null)}
              className="mt-6 rounded-full bg-brand-orange px-6 py-2 font-bold text-white"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
