import { describe, it, expect } from 'vitest'
import { findVenue } from '../venues'

describe('findVenue', () => {
  it('matches a parish inside a full geocoded address', () => {
    const v = findVenue('Our Lady of Good Counsel Parish, 5900 128 St, Surrey, BC V3X 1V1, Canada')
    expect(v?.ta).toBe('நல்லாலோசனை அன்னை பங்கு, சர்ரி')
  })

  it("matches St. Paul's with or without the period", () => {
    expect(findVenue('St Pauls Parish, North Vancouver, BC')?.ta).toBe(
      'புனித சின்னப்பர் கத்தோலிக்க பங்கு, வட வான்கூவர்',
    )
    expect(findVenue("St. Paul's Parish, North Vancouver, BC")?.ta).toBe(
      'புனித சின்னப்பர் கத்தோலிக்க பங்கு, வட வான்கூவர்',
    )
  })

  it('returns null for an unknown or empty address', () => {
    expect(findVenue('123 Main St, Burnaby, BC')).toBeNull()
    expect(findVenue('   ')).toBeNull()
  })
})
