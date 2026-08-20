import type { Localized } from './google-calendar'

// Google Calendar auto-populates an event's `location` with a geocoded English
// address, and editing that field would cost us the map pin and the Directions
// button inside Google Calendar itself. So the Tamil venue name lives here
// instead and is matched against the address. Unrecognised addresses simply
// render on their own, which is the right fallback -- a street address is what
// you need to actually navigate there.
//
// To add a venue: give it a pattern that appears in the geocoded address (check
// the real string in Google Calendar first, it usually leads with the place
// name) and the Tamil name to display above it.
type Venue = { match: RegExp; name: Localized }

const VENUES: Venue[] = [
  {
    match: /good counsel/i,
    name: {
      en: 'Our Lady of Good Counsel Parish, Surrey',
      ta: 'நல்லாலோசனை அன்னை பங்கு, சர்ரி',
    },
  },
  {
    match: /st\.?\s*paul|saint\s*paul/i,
    name: {
      en: "St. Paul's Parish, North Vancouver",
      ta: 'புனித சின்னப்பர் கத்தோலிக்க பங்கு, வட வான்கூவர்',
    },
  },
]

export function findVenue(address: string): Localized | null {
  if (!address.trim()) return null
  return VENUES.find((v) => v.match.test(address))?.name ?? null
}

// Geocoded addresses lead with the place name:
//   "Our Lady of Good Counsel, 10460 139 St, Surrey, BC V3T 4L5, Canada"
// Once we display our own venue name above it that prefix is redundant, so drop
// it -- but only when the leading segment is the part that matched, never
// blindly, so an unrecognised address keeps every segment it came with.
export function streetAddress(address: string): string {
  const [first, ...rest] = address.split(',')
  if (rest.length === 0) return address.trim()
  const venue = VENUES.find((v) => v.match.test(address))
  if (!venue || !venue.match.test(first)) return address.trim()
  // A leading segment with a digit is a street ("1200 St Paul Ave"), not a
  // place name -- stripping it would throw away the actual address.
  if (/\d/.test(first)) return address.trim()
  return rest.join(',').trim()
}
