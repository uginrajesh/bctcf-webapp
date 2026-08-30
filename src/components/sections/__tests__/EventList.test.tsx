import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { EventList } from '../EventList'

vi.mock('@/i18n/routing', () => ({ Link: (p: any) => <a {...p} /> }))
const messages = {
  events: {
    empty: 'Events coming soon - check back shortly.',
    upcomingLabel: 'Upcoming',
    massBadge: 'Holy Mass',
    openInMaps: 'Open in Google Maps',
  },
}
const wrap = (ui: React.ReactNode, locale: 'en' | 'ta' = 'en') =>
  render(<NextIntlClientProvider locale={locale} messages={messages}>{ui}</NextIntlClientProvider>)

describe('EventList', () => {
  it('shows the empty state when there are no events', () => {
    wrap(<EventList events={[]} />)
    expect(screen.getByText(/Events coming soon/)).toBeInTheDocument()
  })

  const event = {
    id: '1',
    title: { en: 'Tamil Holy Mass', ta: 'தமிழ் திருப்பலி' },
    description: { en: '', ta: '' },
    location: {
      en: 'Our Lady of Good Counsel, 10460 139 St, Surrey, BC V3T 4L5, Canada',
      ta: 'Our Lady of Good Counsel, 10460 139 St, Surrey, BC V3T 4L5, Canada',
    },
    venue: { en: 'Good Counsel Parish', ta: 'நல்லாலோசனை அன்னை பங்கு, சர்ரி' },
    start: '2026-07-12T10:30:00-07:00',
    end: '2026-07-12T11:30:00-07:00',
    isMass: true,
  }

  it('renders an event title when present', () => {
    wrap(<EventList events={[event]} />)
    expect(screen.getByText('Tamil Holy Mass')).toBeInTheDocument()
  })

  it('renders the Tamil title and location on the ta locale', () => {
    wrap(<EventList events={[event]} />, 'ta')
    expect(screen.getByText('தமிழ் திருப்பலி')).toBeInTheDocument()
    expect(screen.getByText(/நல்லாலோசனை அன்னை பங்கு/)).toBeInTheDocument()
  })

  it('shows the street address alongside the venue name', () => {
    wrap(<EventList events={[event]} />)
    // The venue name is displayed above it, so the duplicated prefix is dropped.
    expect(screen.getByText('10460 139 St, Surrey, BC V3T 4L5, Canada')).toBeInTheDocument()
  })

  it('keeps an unrecognised address whole', () => {
    const elsewhere = { ...event, id: '2', venue: null, location: { en: '123 Main St, Burnaby, BC', ta: '123 Main St, Burnaby, BC' } }
    wrap(<EventList events={[elsewhere]} />)
    expect(screen.getByText('123 Main St, Burnaby, BC')).toBeInTheDocument()
  })

  it('links the map pin to the English address even on the ta locale', () => {
    wrap(<EventList events={[event]} />, 'ta')
    const link = screen.getByRole('link', { name: /நல்லாலோசனை அன்னை பங்கு/ })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(link.getAttribute('href')).toContain(encodeURIComponent('10460 139 St'))
  })

  it('omits the map pin when the event has no location', () => {
    const online = { ...event, id: '3', venue: null, location: { en: '', ta: '' } }
    wrap(<EventList events={[online]} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('translates the Holy Mass badge', () => {
    wrap(<EventList events={[event]} />)
    expect(screen.getByText('Holy Mass')).toBeInTheDocument()
  })
})
