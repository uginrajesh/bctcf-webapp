import { SITE } from '@/config/site'

const CARDS = [
  { key: 'facebook', label: 'Facebook', icon: '📘', cls: 'bg-[#1877f2]', href: SITE.socials.facebook },
  { key: 'instagram', label: 'Instagram', icon: '📷', cls: 'bg-gradient-to-br from-[#f09433] to-[#bc1888]', href: SITE.socials.instagram },
  { key: 'youtube', label: 'YouTube', icon: '▶️', cls: 'bg-[#ff0000]', href: SITE.socials.youtube },
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬', cls: 'bg-[#25d366]', href: SITE.socials.whatsapp },
]

export function SocialCards() {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 md:grid-cols-4">
      {CARDS.map((c) => (
        <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer"
          className={`${c.cls} rounded-xl px-3 py-7 text-center font-bold text-white transition hover:brightness-105`}>
          <span className="mb-2 block text-4xl">{c.icon}</span>
          {c.label}
        </a>
      ))}
    </div>
  )
}
