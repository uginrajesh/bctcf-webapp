import { Link } from '@/i18n/routing'

export function Button({
  href,
  variant = 'solid',
  children,
}: {
  href?: string
  variant?: 'solid' | 'outline'
  children: React.ReactNode
}) {
  const base =
    'inline-block rounded-full px-7 py-3 font-bold transition focus:outline-none focus:ring-2 focus:ring-brand-orange'
  const styles =
    variant === 'solid'
      ? 'bg-brand-orange text-white shadow-md hover:brightness-105'
      : 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white'
  const cls = `${base} ${styles}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls}>{children}</button>
}
