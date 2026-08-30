import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { revalidateTag } from 'next/cache'
import { GET } from '../route'

vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }))

const call = (query: string) =>
  GET(new Request(`https://bctamilcatholicfamily.ca/api/revalidate${query}`))

describe('GET /api/revalidate', () => {
  const original = process.env.REVALIDATE_SECRET

  beforeEach(() => {
    vi.mocked(revalidateTag).mockClear()
    process.env.REVALIDATE_SECRET = 'correct-horse'
  })

  afterEach(() => {
    if (original === undefined) delete process.env.REVALIDATE_SECRET
    else process.env.REVALIDATE_SECRET = original
  })

  it('refreshes the calendar when the secret matches', async () => {
    const res = await call('?secret=correct-horse')
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toMatchObject({ revalidated: true, tag: 'calendar' })
    expect(revalidateTag).toHaveBeenCalledWith('calendar')
  })

  it('refuses a wrong, empty or missing secret without touching the cache', async () => {
    for (const query of ['?secret=guess', '?secret=', '']) {
      const res = await call(query)
      expect(res.status).toBe(401)
      await expect(res.json()).resolves.toMatchObject({ revalidated: false })
    }
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  // An unset secret must not degrade into "anyone may refresh".
  it('refuses everything when no secret is configured', async () => {
    delete process.env.REVALIDATE_SECRET
    const res = await call('?secret=correct-horse')
    expect(res.status).toBe(500)
    expect(revalidateTag).not.toHaveBeenCalled()
  })
})
