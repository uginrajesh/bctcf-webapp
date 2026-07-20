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
    'inline-block cursor-pointer rounded-full px-7 py-3 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2'
  const styles =
    variant === 'solid'
      ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/25 hover:bg-brand-blueDark'
      : 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white'
  const cls = `${base} ${styles}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button className={cls}>{children}</button>
}
