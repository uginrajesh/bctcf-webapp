import { useTranslations } from 'next-intl'
import { Flame, UserPlus, CalendarDays, MessageCircle } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Section } from '@/components/ui/Section'

export function QuickAccess() {
  const t = useTranslations('home')
  const cards = [
    { icon: Flame, title: t('qaPrayer'), sub: t('qaPrayerSub'), href: '/prayer-requests' },
    { icon: UserPlus, title: t('qaMembers'), sub: t('qaMembersSub'), href: '/new-members' },
    { icon: CalendarDays, title: t('qaEvents'), sub: t('qaEventsSub'), href: '/events' },
    { icon: MessageCircle, title: t('qaSocials'), sub: t('qaSocialsSub'), href: '/socials' },
  ]
  return (
    <Section label={t('quickAccess')} className="bg-brand-creamDark">
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 md:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-lg border-b-[3px] border-brand-gold bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon className="mx-auto mb-2 h-8 w-8 text-brand-gold" />
              <span className="block font-serif font-semibold text-brand-blue">{c.title}</span>
              <span className="mt-1 block text-xs text-slate-400">{c.sub}</span>
            </Link>
          )
        })}
      </div>
    </Section>
  )
}
