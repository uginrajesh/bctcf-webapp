import { useTranslations } from 'next-intl'
import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa6'
import { SITE, isPublishedUrl } from '@/config/site'

const CARDS = [
  { key: 'facebook', label: 'Facebook', Icon: FaFacebookF, cls: 'bg-[#1877f2]' },
  {
    key: 'instagram',
    label: 'Instagram',
    Icon: FaInstagram,
    cls: 'bg-gradient-to-br from-[#f09433] to-[#bc1888]',
  },
  { key: 'youtube', label: 'YouTube', Icon: FaYoutube, cls: 'bg-[#ff0000]' },
  { key: 'whatsapp', label: 'WhatsApp', Icon: FaWhatsapp, cls: 'bg-[#25d366]' },
] as const

const CARD = 'rounded-2xl px-3 py-8 text-center font-semibold text-white shadow-sm'

// A platform without a published URL in site.ts renders as a muted,
// non-clickable card marked "Coming Soon" rather than a link to the platform's
// front door. Setting a real URL turns it straight back into a working link.
export function SocialCards({
  socials = SITE.socials,
}: {
  socials?: Record<string, string>
}) {
  const t = useTranslations('socials')
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 md:grid-cols-4">
      {CARDS.map((c) => {
        const href = socials[c.key]
        if (!isPublishedUrl(href)) {
          return (
            <div key={c.key} className={`${c.cls} ${CARD} opacity-60 grayscale`}>
              <c.Icon className="mx-auto mb-2 h-9 w-9" aria-hidden />
              {c.label}
              <span className="mx-auto mt-2 block w-fit rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                {t('comingSoon')}
              </span>
            </div>
          )
        }
        return (
          <a
            key={c.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${c.cls} ${CARD} transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <c.Icon className="mx-auto mb-2 h-9 w-9" aria-hidden />
            {c.label}
          </a>
        )
      })}
    </div>
  )
}
