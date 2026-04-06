'use client'

import { usePathname } from 'next/navigation'
import { MobileMenu } from './mobile-menu'

interface HeaderProps {
  user: { email: string }
  profile: { full_name: string | null; role: string } | null
}

const pageLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/profissionais': 'Profissionais',
  '/clientes': 'Clientes',
  '/renovacoes': 'Renovações',
  '/equipamentos': 'Equipamentos',
  '/ferias': 'Férias',
}

export function Header({ user, profile }: HeaderProps) {
  const pathname = usePathname()
  const pageTitle = pageLabels[pathname] || 'Página'
  const displayName = profile?.full_name ?? user.email ?? 'Usuário'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 gap-4" role="banner">
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <MobileMenu user={user} profile={profile} />
      </div>

      {/* Page Title - Responsive */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{pageTitle}</h1>
        <nav className="hidden sm:flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-600" aria-label="Breadcrumb">
          <span>Início</span>
          <span className="text-gray-400" aria-hidden="true">/</span>
          <span className="font-medium text-gray-700 truncate">{pageTitle}</span>
        </nav>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden sm:flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-blue-700" aria-hidden="true">{initials}</span>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        {/* Mobile only: Show avatar only */}
        <div className="sm:hidden w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-semibold text-blue-700" aria-hidden="true">{initials}</span>
        </div>
      </div>
    </header>
  )
}
