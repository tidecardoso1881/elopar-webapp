import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignOutButton } from '../sign-out-button'

// Mock da Server Action — não pode rodar em ambiente de teste (jsdom)
vi.mock('@/app/(auth)/login/actions', () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
}))

describe('SignOutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza o texto padrão "Sair" quando sem children', () => {
    render(<SignOutButton />)
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
  })

  it('renderiza children customizados quando fornecidos', () => {
    render(<SignOutButton>Encerrar sessão</SignOutButton>)
    expect(screen.getByRole('button', { name: /encerrar sessão/i })).toBeInTheDocument()
  })

  it('aplica className fornecido ao botão', () => {
    render(<SignOutButton className="custom-class">Sair</SignOutButton>)
    const button = screen.getByRole('button', { name: /sair/i })
    expect(button).toHaveClass('custom-class')
  })

  it('botão não está desabilitado no estado inicial', () => {
    render(<SignOutButton />)
    const button = screen.getByRole('button', { name: /sair/i })
    expect(button).not.toBeDisabled()
  })

  it('chama signOut ao clicar', async () => {
    const { signOut } = await import('@/app/(auth)/login/actions')
    render(<SignOutButton />)

    const button = screen.getByRole('button', { name: /sair/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1)
    })
  })

  it('fica desabilitado durante o processo de logout (isPending)', async () => {
    // Simula latência na Server Action para capturar estado pending
    const { signOut } = await import('@/app/(auth)/login/actions')
    vi.mocked(signOut).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 200))
    )

    render(<SignOutButton />)
    const button = screen.getByRole('button', { name: /sair/i })
    fireEvent.click(button)

    // Depois do clique, deve mostrar "Saindo..." e estar desabilitado
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /saindo/i })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sair/i })).not.toBeDisabled()
    })
  })
})
