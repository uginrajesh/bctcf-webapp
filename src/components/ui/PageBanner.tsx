// The banner shows the page title in the reader's own language and nothing
// else. It used to print a Tamil kicker above the title as well, which reads
// as a bilingual flourish on /en but rendered the same words twice on /ta,
// where the title and that label are the same Tamil string.
export function PageBanner({ title }: { title: string }) {
  return (
    <div className="bg-brand-gradient px-6 py-12 text-center text-white">
      <h1 className="font-serif text-3xl font-semibold md:text-4xl">{title}</h1>
      <div className="mx-auto mt-4 h-[3px] w-14 rounded-full bg-brand-goldSoft/80" />
    </div>
  )
}
