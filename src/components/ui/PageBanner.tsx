export function PageBanner({
  title,
  tamilLabel,
}: {
  title: string
  tamilLabel?: string
}) {
  return (
    <div className="bg-brand-gradient px-6 py-10 text-center text-white">
      {tamilLabel && (
        <p className="font-tamil text-brand-yellow">{tamilLabel}</p>
      )}
      <h1 className="mt-1 text-3xl font-bold md:text-4xl">{title}</h1>
    </div>
  )
}
