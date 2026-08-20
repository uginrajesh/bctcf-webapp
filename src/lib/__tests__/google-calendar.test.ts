import { describe, it, expect } from 'vitest'
import { mapItem, splitBilingual } from '../google-calendar'

describe('splitBilingual', () => {
  it('splits English and Tamil around the marker', () => {
    expect(splitBilingual('Tamil Mass --ta-- தமிழ் திருப்பலி')).toEqual({
      en: 'Tamil Mass',
      ta: 'தமிழ் திருப்பலி',
    })
  })

  it('accepts the marker on its own line, as descriptions use it', () => {
    expect(splitBilingual('Tea to follow.\n--ta--\nதேநீர் தொடரும்.')).toEqual({
      en: 'Tea to follow.',
      ta: 'தேநீர் தொடரும்.',
    })
  })

  it('reuses the text for both locales when untranslated', () => {
    expect(splitBilingual('Family Picnic')).toEqual({ en: 'Family Picnic', ta: 'Family Picnic' })
  })

  it('falls back rather than going blank when one side is empty', () => {
    expect(splitBilingual('Family Picnic --ta--')).toEqual({
      en: 'Family Picnic',
      ta: 'Family Picnic',
    })
  })

  it('returns empty strings for empty input', () => {
    expect(splitBilingual('')).toEqual({ en: '', ta: '' })
  })
})

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
    expect(e.title.en).toBe('Tamil Holy Mass & Fellowship')
    expect(e.start).toBe('2026-07-12T10:30:00-07:00')
  })

  it('splits bilingual titles, descriptions and locations', () => {
    const e = mapItem({
      id: '3',
      summary: 'Holy Mass --ta-- திருப்பலி',
      description: 'All welcome.\n--ta--\nஅனைவரும் வருக.',
      location: 'Surrey, BC --ta-- சர்ரி',
      start: { dateTime: '2026-07-12T10:30:00-07:00' },
    })
    expect(e.isMass).toBe(true)
    expect(e.title).toEqual({ en: 'Holy Mass', ta: 'திருப்பலி' })
    expect(e.description).toEqual({ en: 'All welcome.', ta: 'அனைவரும் வருக.' })
    expect(e.location).toEqual({ en: 'Surrey, BC', ta: 'சர்ரி' })
  })

  it('flags the Mass even when only the Tamil half leads the title', () => {
    const e = mapItem({ id: '4', summary: 'திருப்பலி --ta-- Holy Mass', start: { date: '2026-07-26' } })
    expect(e.isMass).toBe(true)
  })

  it('does not flag non-mass events, and handles all-day + missing fields', () => {
    const e = mapItem({ id: '2', summary: 'Family Picnic', start: { date: '2026-07-26' } })
    expect(e.isMass).toBe(false)
    expect(e.description).toEqual({ en: '', ta: '' })
    expect(e.location).toEqual({ en: '', ta: '' })
    expect(e.start).toBe('2026-07-26')
  })
})
