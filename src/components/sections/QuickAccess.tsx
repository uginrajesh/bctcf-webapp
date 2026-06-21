import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Section } from '@/components/ui/Section'

export function QuickAccess() {
  const t = useTranslations('home')
  const cards = [
    { icon: '🕯️', title: t('qaPrayer'), sub: t('qaPrayerSub'), href: '/prayer-requests' },
    { icon: '✨', title: t('qaMembers'), sub: t('qaMembersSub'), href: '/new-members' },
    { icon: '📅', title: t('qaEvents'), sub: t('qaEventsSub'), href: '/events' },
    { icon: '💬', title: t('qaSocials'), sub: t('qaSocialsSub'), href: '/socials' },
  ]
  return (
    <Section label={t('quickAccess')} className="bg-brand-creamDark">
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-lg border-b-[3px] border-brand-gold bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="mb-2 block text-3xl text-brand-gold">{c.icon}</span>
            <span className="block font-serif font-semibold text-brand-blue">{c.title}</span>
            <span className="mt-1 block text-xs text-slate-400">{c.sub}</span>
          </Link>
        ))}
      </div>
    </Section>
  )
}
