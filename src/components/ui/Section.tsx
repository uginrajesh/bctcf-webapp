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
        <div className="mb-8 flex flex-col items-center">
          <p className="font-serif text-xs uppercase tracking-[3px] text-brand-gold">
            {label}
          </p>
          <div className="mt-2 h-[2px] w-10 rounded-full bg-brand-goldSoft" />
        </div>
      )}
      {children}
    </section>
  )
}
