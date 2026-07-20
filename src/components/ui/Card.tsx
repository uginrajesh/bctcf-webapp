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
    <div className="rounded-2xl border border-brand-goldLine bg-white p-6 shadow-sm transition hover:shadow-md">
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-blue text-white">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="mb-1 font-serif text-lg font-semibold text-brand-blue">
          {title}
        </h3>
      )}
      <div className="text-sm leading-relaxed text-slate-600">{children}</div>
    </div>
  )
}
