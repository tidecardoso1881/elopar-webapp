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
          <summary className="flex items-center gap-2 cursor-pointer list-none select-none rounded-lg px-2 py-1.5 hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 leading-tight truncate max-w-[140px]">{displayName}</p>
              <p className="text-xs text-gray-400 truncate max-w-[140px]">{user.email}</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
            {/* User info */}
            <div className="px-4 py-2.5 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-1">
              <Link
                href="/area-usuario/perfil"
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Meu Perfil
              </Link>
            </div>

            {/* Sign out */}
            <div className="border-t border-gray-100 pt-1">
              <SignOutButton />
            </div>
          </div>
        </details>
      </div>

      {/* Command Palette */}
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </header>
  )
}
