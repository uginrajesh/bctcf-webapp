import { describe, it, expect } from 'vitest'
import { isPublishedUrl } from '../site'

describe('isPublishedUrl', () => {
  it('rejects the platform front door, which is a valid URL reaching nobody', () => {
    expect(isPublishedUrl('https://facebook.com/')).toBe(false)
    expect(isPublishedUrl('https://facebook.com')).toBe(false)
    expect(isPublishedUrl('https://instagram.com/')).toBe(false)
    expect(isPublishedUrl('https://youtube.com/')).toBe(false)
    expect(isPublishedUrl('https://chat.whatsapp.com/')).toBe(false)
  })

  it('accepts a link that points at our own page or invite', () => {
    expect(isPublishedUrl('https://facebook.com/bctamilcatholicfamily')).toBe(true)
    expect(isPublishedUrl('https://instagram.com/bctcf/')).toBe(true)
    expect(isPublishedUrl('https://youtube.com/@bctamilcatholicfamily')).toBe(true)
    expect(isPublishedUrl('https://chat.whatsapp.com/ABCdef123XYZ')).toBe(true)
  })

  it('rejects empty and malformed values', () => {
    expect(isPublishedUrl('')).toBe(false)
    expect(isPublishedUrl('   ')).toBe(false)
    expect(isPublishedUrl('coming soon')).toBe(false)
  })
})
