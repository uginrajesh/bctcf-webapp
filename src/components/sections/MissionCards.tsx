import { useTranslations } from 'next-intl'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'

export function MissionCards() {
  const t = useTranslations('home')
  const items = [
    { icon: '🙏', title: t('faith'), body: t('faithBody') },
    { icon: '👨‍👩‍👧‍👦', title: t('family'), body: t('familyBody') },
    { icon: '🤝', title: t('community'), body: t('communityBody') },
  ]
  return (
    <Section label={t('ourHeart')}>
      <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-3">
        {items.map((i) => (
          <Card key={i.title} title={i.title} icon={i.icon}>
            {i.body}
          </Card>
        ))}
      </div>
    </Section>
  )
}
