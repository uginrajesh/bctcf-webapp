import { describe, it, expect } from 'vitest'
import { mapItem } from '../google-calendar'

describe('mapItem', () => {
  it('flags Holy Mass events as isMass', () => {
    const e = mapItem({
      id: '1',
      summary: 'Tamil Holy Mass & Fellowship',
      description: 'Tea to follow',
      location: 'Vancouver',
      start: { dateTime: '2026-07-12T10:30:00-07:00' },
    })
    expect(e.isMass).toBe(true)
    expect(e.title).toBe('Tamil Holy Mass & Fellowship')
    expect(e.start).toBe('2026-07-12T10:30:00-07:00')
  })

  it('does not flag non-mass events, and handles all-day + missing fields', () => {
    const e = mapItem({ id: '2', summary: 'Family Picnic', start: { date: '2026-07-26' } })
    expect(e.isMass).toBe(false)
    expect(e.description).toBe('')
    expect(e.location).toBe('')
    expect(e.start).toBe('2026-07-26')
  })
})
