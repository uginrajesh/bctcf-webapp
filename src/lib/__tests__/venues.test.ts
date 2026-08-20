import { describe, it, expect } from 'vitest'
import { findVenue, streetAddress } from '../venues'

// The exact strings Google Calendar stores for our two venues. Pinned here so a
// change to the match patterns cannot silently stop resolving real events.
const GOOD_COUNSEL = 'Our Lady of Good Counsel, 10460 139 St, Surrey, BC V3T 4L5, Canada'
const ST_PAULS = "St. Paul's Parish, 424 Esplanade W, North Vancouver, BC V7M 1J1, Canada"

describe('findVenue', () => {
  it('resolves the real Good Counsel address', () => {
    expect(findVenue(GOOD_COUNSEL)?.ta).toBe('நல்லாலோசனை அன்னை பங்கு, சர்ரி')
  })

  it("resolves the real St. Paul's address", () => {
    expect(findVenue(ST_PAULS)?.ta).toBe('புனித சின்னப்பர் கத்தோலிக்க பங்கு, வட வான்கூவர்')
  })

  it('does not confuse the two venues', () => {
    expect(findVenue(GOOD_COUNSEL)?.en).toBe('Our Lady of Good Counsel Parish, Surrey')
    expect(findVenue(ST_PAULS)?.en).toBe("St. Paul's Parish, North Vancouver")
  })

  it("matches St Pauls without the period or apostrophe", () => {
    expect(findVenue('St Pauls Parish, North Vancouver, BC')?.ta).toBe(
      'புனித சின்னப்பர் கத்தோலிக்க பங்கு, வட வான்கூவர்',
    )
  })

  it('returns null for an unknown or empty address', () => {
    expect(findVenue('123 Main St, Burnaby, BC')).toBeNull()
    expect(findVenue('   ')).toBeNull()
  })
})

describe('streetAddress', () => {
  it('drops the place-name prefix once the venue name is shown separately', () => {
    expect(streetAddress(GOOD_COUNSEL)).toBe('10460 139 St, Surrey, BC V3T 4L5, Canada')
    expect(streetAddress(ST_PAULS)).toBe('424 Esplanade W, North Vancouver, BC V7M 1J1, Canada')
  })

  it('leaves an unrecognised address completely intact', () => {
    const other = 'Holy Cross Parish, 1450 Delta Ave, Burnaby, BC'
    expect(streetAddress(other)).toBe(other)
  })

  it('keeps every segment when the match is in the street, not the place name', () => {
    // "St Paul" here is the street, so nothing should be stripped as a prefix.
    const street = '1200 St Paul Ave, Vancouver, BC'
    expect(streetAddress(street)).toBe(street)
  })

  it('returns a single-segment address unchanged', () => {
    expect(streetAddress('Surrey')).toBe('Surrey')
  })
})
