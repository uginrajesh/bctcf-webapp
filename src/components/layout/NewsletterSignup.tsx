'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SITE } from '@/config/site'

type Status = 'idle' | 'sending' | 'done' | 'error'

export function NewsletterSignup() {
  const t = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = email.trim()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      setStatus('error')
      return
    }
    if (!SITE.newsletterEndpoint) {
      // No endpoint configured yet — acknowledge without losing the address.
      setStatus('done')
      return
    }
    setStatus('sending')
    try {
      // Apps Script Web Apps don't return CORS headers, so we fire-and-forget
      // with no-cors and optimistically confirm.
      await fetch(SITE.newsletterEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ email: value }),
      })
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return <p className="text-sm text-brand-yellow">{t('success')}</p>
  }

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          {t('placeholder')}
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder={t('placeholder')}
          className="w-full rounded-full px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="shrink-0 rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white transition hover:brightness-105 disabled:opacity-60"
        >
          {t('button')}
        </button>
      </form>
      {status === 'error' && <p className="mt-2 text-xs text-brand-yellow">{t('error')}</p>}
    </div>
  )
}
