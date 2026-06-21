import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NextIntlClientProvider } from 'next-intl'
import { LanguageToggle } from '../LanguageToggle'

vi.mock('@/i18n/routing', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
}))

const messages = { common: { languageName: 'தமிழ்' } }

describe('LanguageToggle', () => {
  it('renders the toggle label for English locale', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <LanguageToggle />
      </NextIntlClientProvider>,
    )
    expect(screen.getByRole('button')).toHaveTextContent('EN | தமிழ்')
  })
})
