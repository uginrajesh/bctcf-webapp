import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Check } from 'lucide-react'
import { PageBanner } from '@/components/ui/PageBanner'
import { Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'

export default async function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale)
  const t = await getTranslations('about')
  const tc = await getTranslations('common')
  const storyParagraphs = t.raw('storyParagraphs') as string[]
  const visionParagraphs = t.raw('visionParagraphs') as string[]
  const missionItems = t.raw('missionItems') as string[]
  const values = t('values').split(',')

  return (
    <main>
      <PageBanner title={t('title')} />

      <Section className="bg-brand-cream">
        <blockquote className="mx-auto max-w-2xl text-center">
          <span aria-hidden className="mb-1 block font-serif text-5xl leading-none text-brand-gold/50">
            &ldquo;
          </span>
          <p className="font-serif text-xl leading-relaxed text-brand-blue md:text-2xl">
            {tc('tagline')}
          </p>
        </blockquote>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeading>{t('story')}</SectionHeading>
          <div className="mt-5 space-y-4 leading-relaxed text-slate-600">
            {storyParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-brand-creamDark">
        <div className="mx-auto max-w-3xl">
          <SectionHeading>{t('vision')}</SectionHeading>
          <div className="mt-5 space-y-4 leading-relaxed text-slate-600">
            {visionParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <SectionHeading>{t('mission')}</SectionHeading>
          <p className="mb-5 mt-5 leading-relaxed text-slate-600">{t('missionIntro')}</p>
          <ul className="space-y-3">
            {missionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-blue text-white">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section label={t('coreValues')} className="bg-brand-creamDark">
        <div className="flex flex-wrap justify-center gap-2.5">
          {values.map((v) => (
            <span
              key={v}
              className="rounded-full border border-brand-gold/40 bg-white px-5 py-2 font-serif text-sm font-medium text-brand-blue shadow-sm"
            >
              {v}
            </span>
          ))}
        </div>
      </Section>
    </main>
  )
}
