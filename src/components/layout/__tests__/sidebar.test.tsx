import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Sidebar } from '../sidebar'

// Mock do hook usePathname do Next.js — não funciona fora do App Router
const mockUsePathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// Mock da Server Action usada pelo SignOutButton dentro do Sidebar
vi.mock('@/app/(auth)/login/actions', () => ({
  signOut: vi.fn().mockResolvedValue(undefined),
}))

// ─── Fixtures ──────────────────────────────────────────────────────────────

const defaultUser = { email: 'tide@elopar.com' }
const adminProfile = { full_name: 'Tide Cardoso', role: 'admin' }
const managerProfile = { full_name: 'Gerente Silva', role: 'manager' }

// ─── Testes ────────────────────────────────────────────────────────────────

describe('Sidebar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard')
    vi.clearAllMocks()
  })

  describe('renderização base', () => {
    it('renderiza o nome "Grupo Elopar"', () => {
      render(<Sidebar user={defaultUser} profile={adminProfile} />)
      expect(screen.getByText('Grupo Elopar')).toBeInTheDocument()
    })

    it('renderiza todos os 6 itens de navegação', () => {
      render(<Sidebar user={defaultUser} profile={adminProfile} />)
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Profissionais')).toBeInTheDocument()
      expect(screen.getByText('Clientes')).toBeInTheDocument()
      expect(screen.getByText('Renovações')).toBeInTheDocument()
      expect(screen.getByText('Equipamentos')).toBeInTheDocument()
      expect(screen.getByText('Férias')).toBeInTheDocument()
    })

    it('renderiza o botão de logout', () => {
      render(<Sidebar user={defaultUser} profile={adminProfile} />)
      expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument()
    })
  })

  describe('informações do usuário', () => {
    it('exibe o nome completo do perfil quando disponível', () => {
      render(<Sidebar user={defaultUser} profile={adminProfile} />)
      expect(screen.getByText('Tide Cardoso')).toBeInTheDocument()
    })

    it('exibe o email quando profile.full_name é null', () => {
      render(<Sidebar user={defaultUser} profile={{ full_name: null, role: 'admin' }} />)
      expect(screen.getByText('tide@elopar.com')).toBeInTheDocument()
    })

    it('exibe "Administrador" para role admin', () => {
      render(<Sidebar user={defaultUser} profile={adminProfile} />)
      expect(screen.getByText('Administrador')).toBeInTheDocument()
    })

    it('exibe "Gerente" para role manager', () => {
      render(<Sidebar user={defaultUser} profile={managerProfile} />)
      expect(screen.getByText('Gerente')).toBeInTheDocument()
    })

    it('exibe a inicial do nome como avatar', () => {
      render(<Sidebar user={defaultUser} profile={adminProfile} />)
      // "Tide Cardoso" → inicial "T"
      expect(screen.getByText('T')).toBeInTheDocument()
    })

    it('exibe a inicial do email quando profile é null', () => {
      render(<Sidebar user={defaultUser} profile={null} />)
      // "tide@elopar.com" → inicial "T"
      expect(screen.getByText('T')).toBeInTheDocument()
    })
  })

  describe('active state de navegação', () => {
    it('aplica classes de ativo no item Dashboard quando em /dashboard', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<Sidebar user={defaultUser} profile={adminProfile} />)

      const dashboardLink = screen.getByRole('link', { name: /dashboard/i })
      expect(dashboardLink).toHaveClass('bg-blue-50')
      expect(dashboardLink).toHaveClass('text-blue-700')
    })

    it('NÃO aplica classes de ativo em itens inativos', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      render(<Sidebar user={defaultUser} profile={adminProfile} />)

      const profissionaisLink = screen.getByRole('link', { name: /profissionais/i })
      expect(profissionaisLink).not.toHaveClass('bg-blue-50')
    })

    it('aplica classes de ativo em Profissionais quando em /profissionais', () => {
      mockUsePathname.mockReturnValue('/profissionais')
      render(<Sidebar user={defaultUser} profile={adminProfile} />)

      const profissionaisLink = screen.getByRole('link', { name: /profissionais/i })
      expect(profissionaisLink).toHaveClass('bg-blue-50')
    })
  })

  describe('hrefs de navegação', () => {
    it('cada item de menu aponta para o href correto', () => {
      mockUsePathname.mockReturnValue('/')
      render(<Sidebar user={defaultUser} profile={adminProfile} />)

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
