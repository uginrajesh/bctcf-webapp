import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { EventList } from '../EventList'

vi.mock('@/i18n/routing', () => ({ Link: (p: any) => <a {...p} /> }))
const messages = { events: { empty: 'Events coming soon - check back shortly.', upcomingLabel: 'Upcoming' } }
const wrap = (ui: React.ReactNode) =>
  render(<NextIntlClientProvider locale="en" messages={messages}>{ui}</NextIntlClientProvider>)

describe('EventList', () => {
  it('shows the empty state when there are no events', () => {
    wrap(<EventList events={[]} />)
    expect(screen.getByText(/Events coming soon/)).toBeInTheDocument()
  })

  const event = {
    id: '1',
    title: { en: 'Tamil Holy Mass', ta: 'தமிழ் திருப்பலி' },
    description: { en: '', ta: '' },
    location: { en: 'Vancouver', ta: 'Vancouver' },
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
    render(
      <NextIntlClientProvider locale="ta" messages={messages}>
        <EventList events={[event]} />
      </NextIntlClientProvider>,
    )
    expect(screen.getByText('தமிழ் திருப்பலி')).toBeInTheDocument()
    expect(screen.getByText(/நல்லாலோசனை அன்னை பங்கு/)).toBeInTheDocument()
  })
})
