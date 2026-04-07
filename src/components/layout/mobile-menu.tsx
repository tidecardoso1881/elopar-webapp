'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { SignOutButton } from '@/components/auth/sign-out-button'

interface MobileMenuProps {
  user: { email: string }
  profile: { full_name: string | null; role: string } | null
}

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'Profissionais',
    href: '/profissionais',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.038 9.038 0 0 0 5.754-1.676A9.038 9.038 0 0 0 21.75 10.5c0-5.042-4.708-9.135-10.5-9.135S.75 5.457.75 10.5c0 1.747.292 3.429.831 5m15 0a9.01 9.01 0 0 0-15.999-3.12M15 19.128v-.008" />
      </svg>
    ),
  },
  {
    label: 'Clientes',
    href: '/clientes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0A9.005 9.005 0 0 0 3.75 10.5M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    label: 'Renovações',
    href: '/renovacoes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: 'Equipamentos',
    href: '/equipamentos',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V5.25m13.5-3h-6a2.25 2.25 0 0 0-2.25 2.25v11.883a3 3 0 0 0 .879 2.122l.841.841H15a6 6 0 0 0 6-6V7.25A2.25 2.25 0 0 0 18.75 5z" />
      </svg>
    ),
  },
  {
    label: 'Férias',
    href: '/ferias',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432m0 0a2.25 2.25 0 1 0-3.182-3.182m3.182 3.182l6.94 6.939M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
      </svg>
    ),
  },
  {
    label: 'Notificações',
    href: '/notificacoes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
]

export function MobileMenu({ user, profile }: MobileMenuProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const displayName = profile?.full_name ?? user.email ?? 'Usuário'
  const roleDisplay = profile?.role === 'admin' ? 'Administrador' : 'Gerente'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <>
      {/* Hamburger Button - Visible only on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
        aria-label="Abrir menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu-drawer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay - Visible only when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer Menu - Visible only on mobile and when open */}
      <div
        id="mobile-menu-drawer"
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Grupo Elopar</h2>
              <p className="text-xs text-gray-500">Gestão</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Menu principal">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">Menu</p>

          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-gray-500'} aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User Info + Logout */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 mb-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-blue-700" aria-hidden="true">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500">{roleDisplay}</p>
            </div>
          </div>

          <SignOutButton className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer font-medium" aria-label="Sair da conta">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-1" />
            </svg>
            Sair
          </SignOutButton>
        </div>
      </div>
    </>
  )
}
