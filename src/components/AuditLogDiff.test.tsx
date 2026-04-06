import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AuditLogDiff } from './AuditLogDiff'

const BASE_PROPS = {
  entidadeId: 'a1b2c3d4-0000-0000-0000-000000000000',
  onClose: vi.fn(),
}

describe('AuditLogDiff', () => {
  it('renders changed fields between dados_antes and dados_depois', () => {
    render(
      <AuditLogDiff
        {...BASE_PROPS}
        dadosAntes={{ name: 'João Silva', status: 'ATIVO' }}
        dadosDepois={{ name: 'João S. Silva', status: 'INATIVO' }}
      />
    )

    expect(screen.getByText('Nome')).toBeTruthy()
    expect(screen.getByText('Status')).toBeTruthy()
    expect(screen.getByText('João Silva')).toBeTruthy()
    expect(screen.getByText('João S. Silva')).toBeTruthy()
    expect(screen.getByText('ATIVO')).toBeTruthy()
    expect(screen.getByText('INATIVO')).toBeTruthy()
  })

  it('hides fields that did not change', () => {
    render(
      <AuditLogDiff
        {...BASE_PROPS}
        dadosAntes={{ name: 'João', email: 'joao@example.com' }}
        dadosDepois={{ name: 'João Novo', email: 'joao@example.com' }}
      />
    )

    // email is the same — should not appear as a changed field
    expect(screen.getByText('Nome')).toBeTruthy()
    // email row should not render
    const emailRows = screen.queryAllByText('E-mail')
    expect(emailRows.length).toBe(0)
  })

  it('shows "Nenhuma alteração detectada" when nothing changed', () => {
    render(
      <AuditLogDiff
        {...BASE_PROPS}
        dadosAntes={{ name: 'João' }}
        dadosDepois={{ name: 'João' }}
      />
    )

    expect(screen.getByText(/nenhum campo foi alterado/i)).toBeTruthy()
  })

  it('handles CREATE (dados_antes = null)', () => {
    render(
      <AuditLogDiff
        {...BASE_PROPS}
        dadosAntes={null}
        dadosDepois={{ name: 'Novo Cliente' }}
      />
    )

    expect(screen.getByText('Nome')).toBeTruthy()
    expect(screen.getByText('Novo Cliente')).toBeTruthy()
  })

  it('handles DELETE (dados_depois = null)', () => {
    render(
      <AuditLogDiff
        {...BASE_PROPS}
        dadosAntes={{ name: 'Cliente Excluído' }}
        dadosDepois={null}
      />
    )

    expect(screen.getByText('Nome')).toBeTruthy()
    expect(screen.getByText('Cliente Excluído')).toBeTruthy()
  })

  it('calls onClose when Fechar button is clicked', () => {
    const onClose = vi.fn()
    render(
      <AuditLogDiff
        {...BASE_PROPS}
        onClose={onClose}
        dadosAntes={{ name: 'A' }}
        dadosDepois={{ name: 'B' }}
      />
    )

    fireEvent.click(screen.getByText('Fechar'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('truncates the entity id in the title', () => {
    render(
      <AuditLogDiff
        {...BASE_PROPS}
        entidadeId="abcd1234-ffff-ffff-ffff-ffffffffffff"
        dadosAntes={null}
        dadosDepois={null}
      />
    )

    expect(screen.getByText('abcd1234…')).toBeTruthy()
  })
})
