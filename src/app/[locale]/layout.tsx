import type { Metadata } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Inter, Fraunces, Noto_Serif_Tamil, Catamaran } from 'next/font/google'
import { routing } from '@/i18n/routing'
import { SITE } from '@/config/site'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '../globals.css'

// "Sanctuary" type system: Fraunces (English display) + Noto Serif Tamil
// (Tamil display), Inter (English body) + Catamaran (Tamil body). Self-hosted
// via next/font so the Tamil faces load reliably in dev and production.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
})
const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ['tamil'],
  weight: ['500', '600', '700'],
  variable: '--font-noto-serif-tamil',
  display: 'swap',
})
const catamaran = Catamaran({
  subsets: ['latin', 'tamil'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-catamaran',
  display: 'swap',
})

// Metadata is per-locale so a link shared in Tamil previews in Tamil. Paths are
// relative -- Next resolves them against metadataBase.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale })
  const title = t('common.communityName')
  const description = t('home.heroBody')
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}`]),
  )
  languages['x-default'] = `/${routing.defaultLocale}`

  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    alternates: { canonical: `/${locale}`, languages },
    openGraph: {
      type: 'website',
      siteName: title,
      title,
      description,
      url: `/${locale}`,
      locale: locale === 'ta' ? 'ta_IN' : 'en_CA',
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${fraunces.variable} ${notoSerifTamil.variable} ${catamaran.variable}`}
    >
      <body className="font-sans">
        <NextIntlClientProvider messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
