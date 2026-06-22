import { describe, it, expect } from 'vitest'
import { computeDigestWindow } from '../digest-window'

const now = new Date('2026-07-11T20:00:00-07:00') // evening before a Jul 12 Mass

describe('computeDigestWindow', () => {
  it('sends when a Mass falls within the next 24h, windowing from the previous Mass', () => {
    const masses = ['2026-06-14T10:30:00-07:00', '2026-07-12T10:30:00-07:00', '2026-08-09T10:30:00-07:00']
    const w = computeDigestWindow(now, masses)
    expect(w.sendToday).toBe(true)
    expect(w.sinceISO).toBe('2026-06-14T10:30:00-07:00')
    expect(w.nextMassISO).toBe('2026-07-12T10:30:00-07:00')
  })

  it('does not send when no Mass is within 24h', () => {
    const masses = ['2026-08-09T10:30:00-07:00']
    const w = computeDigestWindow(now, masses)
    expect(w.sendToday).toBe(false)
    expect(w.sinceISO).toBeNull()
  })

  it('uses epoch start when there is no previous Mass', () => {
    const masses = ['2026-07-12T10:30:00-07:00']
    const w = computeDigestWindow(now, masses)
    expect(w.sendToday).toBe(true)
    expect(w.sinceISO).toBe('1970-01-01T00:00:00.000Z')
  })
})
