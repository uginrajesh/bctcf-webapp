import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PageBanner } from '../PageBanner'

describe('PageBanner', () => {
  it('renders the title as the page heading', () => {
    render(<PageBanner title="Contact Us" />)
    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument()
  })

  // It used to render a Tamil label above the title too, so a Tamil page showed
  // the same words twice. The title is now the only text in the banner.
  it('prints the title once, never twice', () => {
    const { container } = render(<PageBanner title="தொடர்பு கொள்ளுங்கள்" />)
    expect(screen.getAllByText('தொடர்பு கொள்ளுங்கள்')).toHaveLength(1)
    expect(container.querySelectorAll('h1, p')).toHaveLength(1)
  })
})
