import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { SocialCards } from '../SocialCards'

const messages = { socials: { comingSoon: 'Coming Soon' } }
const wrap = (socials: Record<string, string>) =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <SocialCards socials={socials} />
    </NextIntlClientProvider>,
  )

const NONE = { facebook: '', instagram: '', youtube: '', whatsapp: '' }

describe('SocialCards', () => {
  it('renders no links at all while every account is unpublished', () => {
    wrap(NONE)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
    expect(screen.getAllByText('Coming Soon')).toHaveLength(4)
  })

  it('links only the platform that has a real community URL', () => {
    wrap({ ...NONE, facebook: 'https://facebook.com/bctamilcatholicfamily' })
    expect(screen.getByRole('link', { name: /Facebook/ })).toHaveAttribute(
      'href',
      'https://facebook.com/bctamilcatholicfamily',
    )
    expect(screen.getAllByText('Coming Soon')).toHaveLength(3)
  })

  it('still shows Coming Soon for a bare platform URL', () => {
    wrap({ ...NONE, facebook: 'https://facebook.com/' })
    expect(screen.queryAllByRole('link')).toHaveLength(0)
    expect(screen.getAllByText('Coming Soon')).toHaveLength(4)
  })
})
