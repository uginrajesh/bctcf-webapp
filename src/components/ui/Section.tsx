export function Section({
  label,
  className = '',
  children,
}: {
  label?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={`px-6 py-11 ${className}`}>
      {label && (
        <p className="mb-6 text-center font-serif text-xs uppercase tracking-[2px] text-brand-gold">
          {label}
        </p>
      )}
      {children}
    </section>
  )
}
