'use client'

import { usePathname } from 'next/navigation'

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
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
        <nav className="flex items-center gap-2 mt-1 text-sm text-gray-600">
          <span>Início</span>
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-700">{pageTitle}</span>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-blue-700">{initials}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
    