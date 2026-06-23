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

  it('renders an event title when present', () => {
    wrap(<EventList events={[{ id: '1', title: 'Tamil Holy Mass', description: '', location: 'Vancouver', start: '2026-07-12T10:30:00-07:00', isMass: true }]} />)
    expect(screen.getByText('Tamil Holy Mass')).toBeInTheDocument()
  })
})
