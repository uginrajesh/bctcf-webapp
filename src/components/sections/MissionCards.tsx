import { useTranslations } from 'next-intl'
import { Church, Users, HeartHandshake } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Card } from '@/components/ui/Card'

export function MissionCards() {
  const t = useTranslations('home')
  const items = [
    { icon: <Church className="h-8 w-8" />, title: t('faith'), body: t('faithBody') },
    { icon: <Users className="h-8 w-8" />, title: t('family'), body: t('familyBody') },
    { icon: <HeartHandshake className="h-8 w-8" />, title: t('community'), body: t('communityBody') },
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
