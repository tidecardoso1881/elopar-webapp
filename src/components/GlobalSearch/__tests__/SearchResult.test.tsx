import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchResult } from '../SearchResult'

const BASE_PROPS = {
  id: 'abc-123',
  type: 'professional' as const,
  name: 'Ana Silva',
  subtitle: 'Desenvolvedora · Alelo',
  isActive: false,
  onSelect: vi.fn(),
}

describe('SearchResult', () => {
  it('renders name and subtitle', () => {
    render(<SearchResult {...BASE_PROPS} />)
    expect(screen.getByText('Ana Silva')).toBeTruthy()
    expect(screen.getByText('Desenvolvedora · Alelo')).toBeTruthy()
  })

  it('renders initials from name', () => {
    render(<SearchResult {...BASE_PROPS} />)
    expect(screen.getByText('AS')).toBeTruthy()
  })

  it('applies active styling when isActive=true', () => {
    const { container } = render(<SearchResult {...BASE_PROPS} isActive={true} />)
    const li = container.querySelector('li')
    expect(li?.className).toContain('border-blue-500')
  })

  it('does not apply active styling when isActive=false', () => {
    const { container } = render(<SearchResult {...BASE_PROPS} isActive={false} />)
    const li = container.querySelector('li')
    expect(li?.className).not.toContain('border-blue-500')
  })

  it('calls onSelect with id and type on click', () => {
    const onSelect = vi.fn()
    render(<SearchResult {...BASE_PROPS} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('option'))
    expect(onSelect).toHaveBeenCalledWith('abc-123', 'professional')
  })
})
