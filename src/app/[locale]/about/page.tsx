import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Check } from 'lucide-react'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('about')
  const storyParagraphs = t.raw('storyParagraphs') as string[]
  const visionParagraphs = t.raw('visionParagraphs') as string[]
  const missionItems = t.raw('missionItems') as string[]
  const values = t('values').split(',')

  return (
    <main>
      <PageBanner title={t('title')} tamilLabel={t('tamilLabel')} />

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-serif text-2xl text-brand-blue">{t('story')}</h2>
          <div className="space-y-4 leading-relaxed text-slate-600">
            {storyParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-brand-creamDark">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-serif text-2xl text-brand-blue">{t('vision')}</h2>
          <div className="space-y-4 leading-relaxed text-slate-600">
            {visionParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 font-serif text-2xl text-brand-blue">{t('mission')}</h2>
          <p className="mb-4 leading-relaxed text-slate-600">{t('missionIntro')}</p>
          <ul className="space-y-3">
            {missionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <Check className="mt-1 h-5 w-5 shrink-0 text-brand-gold" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section label={t('coreValues')} className="bg-brand-creamDark">
        <div className="flex flex-wrap justify-center gap-2">
          {values.map((v) => (
            <span
              key={v}
              className="rounded-full border border-brand-gold/40 bg-brand-cream px-4 py-1.5 font-serif text-sm text-brand-blue"
            >
              {v}
            </span>
          ))}
        </div>
      </Section>
    </main>
  )
}
