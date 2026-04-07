'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { MobileMenu } from './mobile-menu'
import { SignOutButton } from '@/components/auth/sign-out-button'

interface HeaderProps {
  user: { email: string }
  profile: { full_name: string | null; role: string } | null
  notificationBell?: React.ReactNode
}

export function Header({ user, profile, notificationBell }: HeaderProps) {
  const displayName = profile?.full_name ?? user.email ?? 'Usuário'
  const initials = displayName.charAt(0).toUpperCase()
  const detailsRef = useRef<HTMLDetailsElement>(null)

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

      {/* Left: Logo + Elopar (desktop only) */}
      <div className="hidden md:flex items-center gap-3 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm" aria-hidden="true">E</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm leading-tight">Grupo Elopar</p>
          <p className="text-xs text-gray-500 leading-tight">Gestão de Profissionais</p>
        </div>
      </div>

      {/* Right: Notifications + User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
        {notificationBell}

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
            <Link
              href="/area-usuario"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              role="menuitem"
              onClick={() => { if (detailsRef.current) detailsRef.current.open = false }}
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Área do Usuário
            </Link>
            <div className="border-t border-gray-100 my-1" />
            <SignOutButton className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </SignOutButton>
          </div>
        </details>
      </div>
    </header>
  )
}
