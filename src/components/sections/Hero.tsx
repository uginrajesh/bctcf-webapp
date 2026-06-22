import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'
import { HeroCarousel } from './HeroCarousel'

export function Hero({ images = [] }: { images?: string[] }) {
  const t = useTranslations('home')
  const tc = useTranslations('common')
  const hasPhotos = images.length > 0
  return (
    <section
      className={`relative overflow-hidden px-6 py-16 text-center text-white ${
        hasPhotos ? 'bg-brand-blue' : 'bg-brand-gradient'
      }`}
    >
      {hasPhotos && <HeroCarousel images={images} />}
      <div className="relative z-10">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/15">
          <Image src="/logo.svg" alt="" width={60} height={60} />
        </div>
        <p className="font-tamil text-lg text-brand-yellow">{t('heroWelcomeTa')}</p>
        <h1 className="my-1 text-3xl font-bold md:text-4xl">{t('heroHeading')}</h1>
        <p className="mx-auto mt-3 max-w-xl opacity-90">{t('heroBody')}</p>
        <div className="mt-6">
          <Button href="/new-members">{tc('joinCta')} →</Button>
        </div>
      </div>
    </section>
  )
}
