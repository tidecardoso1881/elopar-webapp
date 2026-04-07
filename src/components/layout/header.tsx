'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { MobileMenu } from './mobile-menu'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { CommandPalette } from '@/components/ui/command-palette'
import { useCommandPalette } from '@/hooks/useCommandPalette'

interface HeaderProps {
  user: { email: string }
  profile: { full_name: string | null; role: string } | null
  notificationBell?: React.ReactNode
}

export function Header({ user, profile, notificationBell }: HeaderProps) {
  const displayName = profile?.full_name ?? user.email ?? 'Usuário'
  const initials = displayName.charAt(0).toUpperCase()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const { open, setOpen } = useCommandPalette()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        detailsRef.current.open = false
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 gap-4" role="banner">
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <MobileMenu user={user} profile={profile} />
      </div>

      {/* Right: Notifications + Search + User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
        {notificationBell}

        {/* Search Button */}
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
          title="Busca global (Ctrl+K)"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Buscar</span>
          <kbd className="hidden sm:inline-flex items-center px-1 py-0.5 text-xs font-mono text-gray-400 bg-gray-100 rounded border border-gray-200">Ctrl K</kbd>
        </button>

        {/* User Dropdown */}
        <details ref={detailsRef} className="relative">
          <summary
            className="flex items-center gap-2 cursor-pointer list-none rounded-lg p-1.5 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Menu do usuário"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-indigo-700" aria-hidden="true">{initials}</span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-32">{displayName}</p>
              <p className="text-xs text-gray-500 truncate max-w-32">{user.email}</p>
            </div>
            <svg className="hidden sm:block w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <div
            className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
            role="menu"
          >
            <div className="py-1">
              <Link
                href="/area-usuario/perfil"
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => { if (detailsRef.current) detailsRef.current.open = false }}
              >
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                Meu Perfil
              </Link>
              {profile?.role === 'admin' && (
                <Link
                  href="/gerenciar-usuarios"
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => { if (detailsRef.current) detailsRef.current.open = false }}
                >
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.038 9.038 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  Gerenciar Usuários
                </Link>
              )}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <SignOutButton className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sair
                </SignOutButton>
              </div>
            </div>
          </div>
        </details>

        {/* Command Palette */}
        <CommandPalette open={open} onClose={() => setOpen(false)} />
      </div>
    </header>
  )
}
