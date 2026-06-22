'use client'
import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export function NewMemberForm() {
  const t = useTranslations('members')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      familySize: String(fd.get('familySize') ?? ''),
      heardFrom: String(fd.get('heardFrom') ?? ''),
      website: String(fd.get('website') ?? ''), // honeypot
    }
    try {
      const res = await fetch('/api/new-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="rounded-lg bg-brand-cream p-6 text-center text-brand-blue">{t('success')}</p>
  }

  const field = 'w-full rounded-md border border-slate-300 bg-brand-cream px-3 py-2 text-sm'
  const label = 'mb-1 mt-3 block text-xs font-semibold text-brand-blue'

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md">
      <label className={label} htmlFor="name">{t('name')}</label>
      <input id="name" name="name" required className={field} />
      <label className={label} htmlFor="email">{t('email')}</label>
      <input id="email" name="email" type="email" required className={field} />
      <label className={label} htmlFor="phone">{t('phone')}</label>
      <input id="phone" name="phone" className={field} />
      <label className={label} htmlFor="familySize">{t('familySize')}</label>
      <input id="familySize" name="familySize" type="number" min="1" className={field} />
      <label className={label} htmlFor="heardFrom">{t('heardFrom')}</label>
      <input id="heardFrom" name="heardFrom" className={field} />
      {/* honeypot: hidden from humans, bots fill it */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-5 w-full rounded-full bg-brand-orange py-3 font-bold text-white disabled:opacity-60"
      >
        {status === 'submitting' ? t('submitting') : `${t('submit')} →`}
      </button>
      {status === 'error' && <p className="mt-3 text-center text-sm text-red-600">{t('error')}</p>}
    </form>
  )
}
