export function FormEmbed({ src, title }: { src: string; title: string }) {
  const url = src.includes('?') ? `${src}&embedded=true` : `${src}?embedded=true`
  return (
    <iframe
      src={url}
      title={title}
      loading="lazy"
      className="mx-auto block h-[1500px] w-full max-w-2xl rounded-2xl border border-brand-goldLine bg-white shadow-sm"
    >
      Loading…
    </iframe>
  )
}
