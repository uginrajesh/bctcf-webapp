import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from '../Card'

describe('Card', () => {
  it('renders title and children', () => {
    render(<Card title="Faith">Christ at the centre</Card>)
    expect(screen.getByRole('heading', { name: 'Faith' })).toBeInTheDocument()
    expect(screen.getByText('Christ at the centre')).toBeInTheDocument()
  })
})
