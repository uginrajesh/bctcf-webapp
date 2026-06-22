import { describe, it, expect } from 'vitest'
import { rateLimit } from '../rate-limit'

describe('rateLimit', () => {
  it('allows up to the limit then blocks within the window', () => {
    const key = 'test-ip-1'
    expect(rateLimit(key, 2, 60_000)).toBe(true)
    expect(rateLimit(key, 2, 60_000)).toBe(true)
    expect(rateLimit(key, 2, 60_000)).toBe(false)
  })
})
