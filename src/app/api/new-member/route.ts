import { rateLimit } from '@/lib/rate-limit'

type Payload = {
  name?: string
  email?: string
  phone?: string
  familySize?: string
  heardFrom?: string
  website?: string
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request): Promise<Response> {
  let data: Payload
  try {
    data = (await req.json()) as Payload
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400)
  }

  // Honeypot: a filled "website" field means a bot. Accept silently, don't relay.
  if (data.website && data.website.trim() !== '') {
    return json({ ok: true }, 200)
  }

  const name = (data.name ?? '').trim()
  const email = (data.email ?? '').trim()
  if (!name || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'invalid_input' }, 400)
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`new-member:${ip}`, 5, 60 * 60 * 1000)) {
    return json({ ok: false, error: 'rate_limited' }, 429)
  }

  const url = process.env.APPS_SCRIPT_URL
  const secret = process.env.APPS_SCRIPT_SECRET
  if (!url || !secret) {
    return json({ ok: false, error: 'not_configured' }, 502)
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        name,
        email,
        phone: (data.phone ?? '').trim(),
        familySize: (data.familySize ?? '').trim(),
        heardFrom: (data.heardFrom ?? '').trim(),
      }),
    })
    if (!res.ok) return json({ ok: false, error: 'upstream' }, 502)
    return json({ ok: true }, 200)
  } catch {
    return json({ ok: false, error: 'upstream' }, 502)
  }
}
