export function Card({
  title,
  icon,
  children,
}: {
  title?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg border-b-[3px] border-brand-gold bg-white p-6 shadow-sm">
      {icon && <div className="mb-2 text-3xl text-brand-gold">{icon}</div>}
      {title && (
        <h3 className="mb-1 font-serif text-lg font-semibold text-brand-blue">
          {title}
        </h3>
      )}
      <div className="text-sm text-slate-600">{children}</div>
    </div>
  )
}
