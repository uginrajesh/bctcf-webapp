import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { NewMemberForm } from '../NewMemberForm'

const messages = {
  members: {
    name: 'Full Name', email: 'Email', phone: 'Phone', familySize: 'Family Size',
    heardFrom: 'How did you hear about us?', submit: 'Join Our Family',
    submitting: 'Sending…', success: 'Thank you!', error: 'Something went wrong.',
    nextTitle: 'What Happens Next', next1: 'a', next2: 'b', next3: 'c',
  },
}
const wrap = () =>
  render(<NextIntlClientProvider locale="en" messages={messages}><NewMemberForm /></NextIntlClientProvider>)

beforeEach(() => { vi.restoreAllMocks() })

describe('NewMemberForm', () => {
  it('submits and shows success', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }))
    wrap()
    await userEvent.type(screen.getByLabelText('Full Name'), 'Mary')
    await userEvent.type(screen.getByLabelText('Email'), 'mary@example.com')
    await userEvent.click(screen.getByRole('button', { name: /Join Our Family/ }))
    await waitFor(() => expect(screen.getByText('Thank you!')).toBeInTheDocument())
  })

  it('shows error when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    wrap()
    await userEvent.type(screen.getByLabelText('Full Name'), 'Mary')
    await userEvent.type(screen.getByLabelText('Email'), 'mary@example.com')
    await userEvent.click(screen.getByRole('button', { name: /Join Our Family/ }))
    await waitFor(() => expect(screen.getByText('Something went wrong.')).toBeInTheDocument())
  })
})
