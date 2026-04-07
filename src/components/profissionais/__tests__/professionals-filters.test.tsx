import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfessionalsFilters } from '../professionals-filters'

const mockPush = vi.fn()
const mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/profissionais',
  useSearchParams: () => mockSearchParams,
}))

const clients = [
  { id: 'c1', name: 'Acme Corp' },
  { id: 'c2', name: 'Beta Inc' },
]

describe('ProfessionalsFilters', () => {
  beforeEach(() => {
    mockPush.mockClear()
    // Reset search params
    Array.from(mockSearchParams.keys()).forEach(k => mockSearchParams.delete(k))
  })

  it('renders text search input', () => {
    render(<ProfessionalsFilters clients={clients} />)
    expect(screen.getByPlaceholderText('Buscar nome, CPF...')).toBeTruthy()
  })

  it('renders client dropdown with all options', () => {
    render(<ProfessionalsFilters clients={clients} />)
    expect(screen.getByText('Todos os clientes')).toBeTruthy()
    expect(screen.getByText('Acme Corp')).toBeTruthy()
    expect(screen.getByText('Beta Inc')).toBeTruthy()
  })

  it('renders status dropdown with all options', () => {
    render(<ProfessionalsFilters clients={clients} />)
    expect(screen.getByText('Todos os status')).toBeTruthy()
    expect(screen.getByText('Ativo')).toBeTruthy()
    expect(screen.getByText('Inativo')).toBeTruthy()
  })

  it('renders seniority dropdown with all options', () => {
    render(<ProfessionalsFilters clients={clients} />)
    expect(screen.getByText('Todas as senioridades')).toBeTruthy()
    expect(screen.getByText('Júnior')).toBeTruthy()
    expect(screen.getByText('Pleno')).toBeTruthy()
    expect(screen.getByText('Sênior')).toBeTruthy()
    expect(screen.getByText('Especialista')).toBeTruthy()
  })

  it('renders contract type dropdown with all options', () => {
    render(<ProfessionalsFilters clients={clients} />)
    expect(screen.getByText('Todos os contratos')).toBeTruthy()
    expect(screen.getByText('CLT Estratégico')).toBeTruthy()
    expect(screen.getByText('CLT ILAED')).toBeTruthy()
    expect(screen.getByText('PJ')).toBeTruthy()
  })

  it('renders renewal dropdown with all options', () => {
    render(<ProfessionalsFilters clients={clients} />)
    expect(screen.getByText('Todos os períodos')).toBeTruthy()
    expect(screen.getByText('Vencidos')).toBeTruthy()
    expect(screen.getByText(/Crítico/)).toBeTruthy()
    expect(screen.getByText(/Atenção/)).toBeTruthy()
    expect(screen.getByText(/OK/)).toBeTruthy()
  })

  it('does not show Limpar button when no filters active', () => {
    render(<ProfessionalsFilters clients={clients} />)
    expect(screen.queryByText('Limpar filtros')).toBeNull()
  })

  it('shows Limpar button when a filter is active', () => {
    mockSearchParams.set('status', 'ATIVO')
    render(<ProfessionalsFilters clients={clients} />)
    expect(screen.getByText('Limpar filtros')).toBeTruthy()
  })

  it('navigates to pathname on Limpar click', () => {
    mockSearchParams.set('seniority', 'PLENO')
    render(<ProfessionalsFilters clients={clients} />)
    fireEvent.click(screen.getByText('Limpar filtros'))
    expect(mockPush).toHaveBeenCalledWith('/profissionais')
  })

  it('navigates with selected client filter', () => {
    render(<ProfessionalsFilters clients={clients} />)
    const select = screen.getAllByRole('combobox')[0]
    fireEvent.change(select, { target: { value: 'c1' } })
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('cliente=c1'))
  })

  it('resets page param on filter change', () => {
    mockSearchParams.set('page', '3')
    render(<ProfessionalsFilters clients={clients} />)
    const selects = screen.getAllByRole('combobox')
    fireEvent.change(selects[1], { target: { value: 'ATIVO' } }) // status select
    const callArg = mockPush.mock.calls[0]?.[0] ?? ''
    expect(callArg).not.toContain('page=3')
  })
})
