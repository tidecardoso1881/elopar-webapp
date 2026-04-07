import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sidebar } from '../sidebar'

// Mock do hook usePathname do Next.js — não funciona fora do App Router
const mockUsePathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  // Link needs href mock
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

// ─── Testes ────────────────────────────────────────────────────────────────

describe('Sidebar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard')
    vi.clearAllMocks()
  })

  describe('renderização base', () => {
    it('renderiza o nome "Grupo Elopar"', () => {
      render(<Sidebar />)
      expect(screen.getByText('Grupo Elopar')).toBeInTheDocument()
    })

    it('renderiza todos os itens de navegação', () => {
      render(<Sidebar />)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Profissionais')).toBeInTheDocument()
      expect(screen.getByText('Clientes')).toBeInTheDocument()
      expect(screen.getByText('Renovações')).toBeInTheDocument()
      expect(screen.getByText('Equipamentos')).toBeInTheDocument()
      expect(screen.getByText('Férias')).toBeInTheDocument()
      expect(screen.getByText('Notificações')).toBeInTheDocument()
    })

    it('NÃO renderiza o botão de logout (movido para o header)', () => {
      render(<Sidebar />)
      expect(screen.queryByRole('button', { name: /sair/i })).toBeNull()
    })

    it('renderiza rodapé com © Elopar', () => {
      render(<Sidebar />)
      expect(screen.getByText(/© Elopar/)).toBeInTheDocument()
    })
  })

  describe('active state de navegação', () => {
    it('aplica classes de ativo no item Dashboard quando em /dashboard', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<Sidebar />)

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      expect(dashboardLink).toHaveClass('bg-blue-50')
      expect(dashboardLink).toHaveClass('text-blue-700')
    })

    it('NÃO aplica classes de ativo em itens inativos', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<Sidebar />)

      const profissionaisLink = screen.getByRole('link', { name: /profissionais/i })
      expect(profissionaisLink).not.toHaveClass('bg-blue-50')
    })

    it('aplica classes de ativo em Profissionais quando em /profissionais', () => {
      mockUsePathname.mockReturnValue('/profissionais')
      render(<Sidebar />)

      const profissionaisLink = screen.getByRole('link', { name: /profissionais/i })
      expect(profissionaisLink).toHaveClass('bg-blue-50')
    })
  })

  describe('hrefs de navegação', () => {
    it('cada item de menu aponta para o href correto', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Sidebar />)

      const links = [
        { name: /dashboard/i, href: '/dashboard' },
        { name: /profissionais/i, href: '/profissionais' },
        { name: /clientes/i, href: '/clientes' },
        { name: /renovações/i, href: '/renovacoes' },
        { name: /equipamentos/i, href: '/equipamentos' },
        { name: /férias/i, href: '/ferias' },
      ]

      links.forEach(({ name, href }) => {
        const link = screen.getByRole('link', { name })
        expect(link).toHaveAttribute('href', href)
      })
    })
  })
})
