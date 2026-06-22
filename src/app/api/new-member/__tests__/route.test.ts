import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../route'

function req(body: unknown, ip = '1.2.3.4') {
  return new Request('http://localhost/api/new-member', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.restoreAllMocks()
  process.env.APPS_SCRIPT_URL = 'https://script.example/exec'
  process.env.APPS_SCRIPT_SECRET = 'secret'
})

const valid = { name: 'Mary', email: 'mary@example.com', phone: '', familySize: '3', heardFrom: 'Friend', website: '' }

describe('POST /api/new-member', () => {
  it('rejects missing name/email with 400', async () => {
    const res = await POST(req({ name: '', email: '' }, '9.9.9.1'))
    expect(res.status).toBe(400)
  })

  it('silently accepts but does not relay when honeypot is filled', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const res = await POST(req({ ...valid, website: 'bot' }, '9.9.9.2'))
    expect(res.status).toBe(200)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('relays a valid submission and returns 200', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)
    const res = await POST(req(valid, '9.9.9.3'))
    expect(res.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledOnce()
    const [, opts] = fetchMock.mock.calls[0]
    expect(JSON.parse(opts.body).secret).toBe('secret')
    expect(JSON.parse(opts.body).name).toBe('Mary')
  })

  it('returns 502 when the upstream relay fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const res = await POST(req(valid, '9.9.9.4'))
    expect(res.status).toBe(502)
  })
})
