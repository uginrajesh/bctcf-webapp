import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  const t = useTranslations('notFound')
  return (
    <main className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-serif text-6xl text-brand-gold">404</p>
      <h1 className="mt-2 text-2xl font-bold text-brand-blue">{t('title')}</h1>
      <p className="mb-6 mt-2 text-slate-500">{t('body')}</p>
      <Button href="/">{t('home')}</Button>
    </main>
  )
}
