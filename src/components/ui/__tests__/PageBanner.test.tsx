import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PageBanner } from '../PageBanner'

describe('PageBanner', () => {
  it('renders the title and tamil label', () => {
    render(<PageBanner title="Events" tamilLabel="நிகழ்வுகள்" />)
    expect(screen.getByRole('heading', { name: 'Events' })).toBeInTheDocument()
    expect(screen.getByText('நிகழ்வுகள்')).toBeInTheDocument()
  })
})
