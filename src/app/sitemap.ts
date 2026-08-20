import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { NAV_ITEMS, SITE } from '@/config/site'

// next-intl prefixes every route with its locale, so the home page lives at
// /en and /ta rather than /. Each entry lists its translation via `alternates`
// so search engines treat the two locales as one page in two languages.
function pageUrl(locale: string, href: string) {
  return `${SITE.url}/${locale}${href === '/' ? '' : href}`
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return routing.locales.flatMap((locale) =>
    NAV_ITEMS.map(({ href }) => ({
      url: pageUrl(locale, href),
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, pageUrl(l, href)]),
        ),
      },
    })),
  )
}
