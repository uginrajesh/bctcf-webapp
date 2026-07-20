// Serif section heading with a short gold rule underneath — the recurring
// "Sanctuary" heading treatment used across content pages.
export function SectionHeading({
  children,
  align = 'left',
  className = '',
}: {
  children: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  const isCenter = align === 'center'
  return (
    <div className={`${isCenter ? 'text-center' : ''} ${className}`}>
      <h2 className="font-serif text-2xl font-semibold text-brand-blue">{children}</h2>
      <div
        className={`mt-3 h-[3px] w-12 rounded-full bg-gradient-to-r from-brand-gold to-brand-goldSoft ${
          isCenter ? 'mx-auto' : ''
        }`}
      />
    </div>
  )
}
