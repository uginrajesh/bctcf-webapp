import { Fragment } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import data from '@/data/announcements.json'

// Renders text with **bold** segments. Wrap any part of an announcement body
// in double asterisks (e.g. **Our Lady of Good Counsel Parish, Surrey**) to bold it.
function renderRichText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-slate-700">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

export function Announcements() {
  const t = useTranslations('home')
  const locale = useLocale() as 'en' | 'ta'
  return (
    <Section className="bg-brand-creamDark">
      <SectionHeading align="center" className="mb-8">{t('announcements')}</SectionHeading>
      <div className="mx-auto max-w-2xl">
        {data.items.map((item, i) => (
          <div
            key={i}
            className="mb-3 rounded-xl border border-brand-goldLine border-l-4 border-l-brand-gold bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{item.date}</p>
            <h4 className="my-1 font-serif text-lg text-brand-blue">{item.title[locale]}</h4>
            <p className="text-sm leading-relaxed text-slate-500">{renderRichText(item.body[locale])}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}
