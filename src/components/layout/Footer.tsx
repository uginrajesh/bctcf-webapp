import { useTranslations } from 'next-intl'
import { SITE } from '@/config/site'
import resources from '@/data/resources.json'
import { NewsletterSignup } from './NewsletterSignup'

export function Footer() {
  const tc = useTranslations('common')
  const tf = useTranslations('footer')
  const tn = useTranslations('newsletter')
  return (
    <footer className="bg-brand-blueDark px-6 py-10 text-sm text-slate-200">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        <div>
          <p className="font-bold text-white">{tc('communityName')}</p>
          <p className="mt-1 font-tamil opacity-80">{tc('tagline')}</p>
          <p className="mt-3 opacity-70">{SITE.email}</p>
          <p className="opacity-60">British Columbia, Canada</p>
        </div>

        {resources.items.length > 0 && (
          <div>
            <h3 className="mb-3 font-serif text-white">{tf('resources')}</h3>
            <ul className="space-y-2">
              {resources.items.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="opacity-80 underline-offset-2 hover:text-brand-yellow hover:underline hover:opacity-100"
                  >
                    {r.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="mb-2 font-serif text-white">{tn('title')}</h3>
          <p className="mb-3 opacity-80">{tn('desc')}</p>
          <NewsletterSignup />
        </div>
      </div>

      <p className="mt-8 text-center text-xs opacity-60">
        © {new Date().getFullYear()} {tc('communityName')}
      </p>
    </footer>
  )
}
