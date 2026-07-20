export function PageBanner({
  title,
  tamilLabel,
}: {
  title: string
  tamilLabel?: string
}) {
  return (
    <div className="bg-brand-gradient px-6 py-12 text-center text-white">
      {tamilLabel && (
        <p className="font-serif text-brand-yellow">{tamilLabel}</p>
      )}
      <h1 className="mt-1 font-serif text-3xl font-semibold md:text-4xl">{title}</h1>
      <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-brand-goldSoft/80" />
    </div>
  )
}
