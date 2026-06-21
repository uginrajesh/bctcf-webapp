import { useLocale, useTranslations } from 'next-intl'
import { Section } from '@/components/ui/Section'
import data from '@/data/announcements.json'

export function Announcements() {
  const t = useTranslations('home')
  const locale = useLocale() as 'en' | 'ta'
  return (
    <Section className="bg-brand-creamDark">
      <h2 className="mb-6 text-center font-serif text-2xl text-brand-blue">
        {t('announcements')}
      </h2>
      <div className="mx-auto max-w-2xl">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="mb-3 rounded-lg border-l-4 border-brand-orange bg-white p-4"
          >
            <p className="text-xs uppercase tracking-wide text-brand-gold">{item.date}</p>
            <h4 className="my-1 font-serif text-brand-blue">{item.title[locale]}</h4>
            <p className="text-sm text-slate-500">{item.body[locale]}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
