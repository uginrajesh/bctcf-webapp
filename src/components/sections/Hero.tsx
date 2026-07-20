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
      className={`relative flex min-h-[34rem] flex-col items-center justify-center overflow-hidden px-6 py-20 text-center ${
        hasPhotos ? 'text-white' : 'text-brand-blue'
      }`}
    >
      {hasPhotos ? (
        <HeroCarousel images={images} />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-10%,#ffffff_0%,#fbf7ed_55%)]"
        />
      )}
      <div className="relative z-10 mx-auto max-w-2xl">
        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
            hasPhotos
              ? 'bg-white/15 ring-1 ring-white/30'
              : 'bg-white shadow-md ring-1 ring-brand-goldLine'
          }`}
        >
          <Image src="/logo.svg" alt="" width={62} height={62} />
        </div>
        <p
          className={`font-serif text-lg ${
            hasPhotos ? 'text-brand-yellow' : 'text-brand-gold'
          }`}
        >
          {t('heroWelcomeTa')}
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight md:text-5xl">
          {t('heroHeading')}
        </h1>
        <div
          className={`mx-auto my-5 h-[3px] w-16 rounded-full ${
            hasPhotos ? 'bg-brand-goldSoft' : 'bg-gradient-to-r from-brand-gold to-brand-goldSoft'
          }`}
        />
        <p
          className={`mx-auto max-w-xl text-lg leading-relaxed ${
            hasPhotos ? 'text-white/90' : 'text-slate-600'
          }`}
        >
          {t('heroBody')}
        </p>
        <div className="mt-8">
          <Button href="/new-members">{tc('joinCta')} →</Button>
        </div>
      </div>
    </section>
  )
}
