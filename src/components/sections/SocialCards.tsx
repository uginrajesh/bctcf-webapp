import { FaFacebookF, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa6'
import { SITE } from '@/config/site'

const CARDS = [
  { key: 'facebook', label: 'Facebook', Icon: FaFacebookF, cls: 'bg-[#1877f2]', href: SITE.socials.facebook },
  { key: 'instagram', label: 'Instagram', Icon: FaInstagram, cls: 'bg-gradient-to-br from-[#f09433] to-[#bc1888]', href: SITE.socials.instagram },
  { key: 'youtube', label: 'YouTube', Icon: FaYoutube, cls: 'bg-[#ff0000]', href: SITE.socials.youtube },
  { key: 'whatsapp', label: 'WhatsApp', Icon: FaWhatsapp, cls: 'bg-[#25d366]', href: SITE.socials.whatsapp },
]

export function SocialCards() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 md:grid-cols-4">
      {CARDS.map((c) => (
        <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer"
          className={`${c.cls} rounded-2xl px-3 py-8 text-center font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}>
          <c.Icon className="mx-auto mb-2 h-9 w-9" aria-hidden />
          {c.label}
        </a>
      ))}
    </div>
  )
}
