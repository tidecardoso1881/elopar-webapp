---
para: Especialista 2 (Haiku)
de: Gerente (Cowork)
data: 2026-04-07
ticket: E2-K
ep: EP-NEW-015
branch: feat/ep-015-busca-global
prioridade: URGENT
---

# TICKET E2-K — EP-015: Busca Global — Reconstruir header.tsx + implementar command-palette.tsx

## Diagnóstico

Dois arquivos estão quebrados e causam falha de build:

| Arquivo | Problema |
|---|---|
| `src/components/layout/header.tsx` | Truncado em 58 linhas — user dropdown ausente, JSX sem fechar |
| `src/components/ui/command-palette.tsx` | 0 bytes — arquivo vazio, header importa mas não existe |

A implementação completa de busca já existe em `src/components/GlobalSearch/CommandPalette.tsx` (277 linhas) mas não está conectada ao header.

---

## Arquivo 1 — `src/components/layout/header.tsx` — SOBRESCREVER COMPLETAMENTE

```tsx
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
          <summary className="flex items-center gap-2 cursor-pointer list-none rounded-lg px-2 py-1.5 hover:bg-gray-100 transition-colors">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold select-none">
              {initials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">{displayName}</span>
            <svg className="h-4 w-4 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="absolute right-0 top-full mt-1 w-52 rounded-xl border border-gray-200 bg-white shadow-lg py-1 z-50">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="text-xs font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Link
              href="/area-usuario/perfil"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Meu Perfil
            </Link>
            <Link
              href="/area-usuario"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Área do Usuário
            </Link>
            <div className="border-t border-gray-100 mt-1 pt-1">
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
```

---

## Arquivo 2 — `src/components/ui/command-palette.tsx` — CRIAR DO ZERO

```tsx
'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  professionals: Array<{ id: string; name: string; position: string | null; status: string }>
  clients: Array<{ id: string; name: string }>
}

const STATIC_PAGES = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Profissionais', href: '/profissionais' },
  { label: 'Clientes', href: '/clientes' },
  { label: 'Equipamentos', href: '/equipamentos' },
  { label: 'Férias', href: '/ferias' },
]

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult>({ professionals: [], clients: [] })
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      setQuery('')
      setResults({ professionals: [], clients: [] })
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (query.length < 2) {
      setResults({ professionals: [], clients: [] })
      return
    }
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setActiveIndex(0)
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const filteredPages = STATIC_PAGES.filter((p) =>
    query.length === 0 || p.label.toLowerCase().includes(query.toLowerCase())
  )

  const allItems: Array<{ type: string; label: string; href: string }> = [
    ...filteredPages.map((p) => ({ type: 'page', label: p.label, href: p.href })),
    ...results.professionals.map((p) => ({
      type: 'professional',
      label: p.name,
      href: `/profissionais/${p.id}`,
    })),
    ...results.clients.map((c) => ({
      type: 'client',
      label: c.name,
      href: `/clientes/${c.id}`,
    })),
  ]

  const navigate = useCallback(
    (href: string) => {
      router.push(href)
      onClose()
    },
    [router, onClose]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, allItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && allItems[activeIndex]) {
      navigate(allItems[activeIndex].href)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar profissional, cliente ou página..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
          />
          {loading && (
            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
          )}
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs font-mono text-gray-500 bg-gray-100 rounded border border-gray-300">
            Esc
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {allItems.length === 0 && query.length >= 2 && !loading && (
            <p className="px-4 py-3 text-sm text-gray-500">Nenhum resultado encontrado.</p>
          )}
          {filteredPages.length > 0 && (
            <div>
              <p className="px-4 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">Páginas</p>
              {filteredPages.map((page, i) => (
                <button
                  key={page.href}
                  onClick={() => navigate(page.href)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    activeIndex === i ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-gray-400">📄</span>
                  {page.label}
                </button>
              ))}
            </div>
          )}
          {results.professionals.length > 0 && (
            <div>
              <p className="px-4 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">Profissionais</p>
              {results.professionals.map((p, i) => {
                const idx = filteredPages.length + i
                return (
                  <button
                    key={p.id}
                    onClick={() => navigate(`/profissionais/${p.id}`)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      activeIndex === idx ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-gray-400">👤</span>
                    <span className="flex-1 truncate">{p.name}</span>
                    {p.position && (
                      <span className="text-xs text-gray-400 truncate max-w-[120px]">{p.position}</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
          {results.clients.length > 0 && (
            <div>
              <p className="px-4 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">Clientes</p>
              {results.clients.map((c, i) => {
                const idx = filteredPages.length + results.professionals.length + i
                return (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/clientes/${c.id}`)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      activeIndex === idx ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-gray-400">🏢</span>
                    {c.name}
                  </button>
                )
              })}
            </div>
          )}
          {query.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">Digite para buscar profissionais, clientes ou páginas.</p>
          )}
        </div>
        <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 bg-gray-50 text-xs text-gray-400">
          <span><kbd className="font-mono">↑↓</kbd> navegar</span>
          <span><kbd className="font-mono">Enter</kbd> abrir</span>
          <span><kbd className="font-mono">Esc</kbd> fechar</span>
        </div>
      </div>
    </div>
  )
}
```

---

## Arquivo 3 — `src/app/api/search/route.ts` — CRIAR (se não existir)

```ts
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 2) return NextResponse.json({ professionals: [], clients: [] })

  const supabase = await createClient()

  const [{ data: professionals }, { data: clients }] = await Promise.all([
    supabase
      .from('professionals')
      .select('id, name, position, status')
      .ilike('name', `%${q}%`)
      .eq('status', 'ATIVO')
      .limit(5),
    supabase
      .from('clients')
      .select('id, name')
      .ilike('name', `%${q}%`)
      .limit(5),
  ])

  return NextResponse.json({
    professionals: professionals ?? [],
    clients: clients ?? [],
  })
}
```

---

## Comandos

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-015-busca-global
# sobrescrever header.tsx com conteúdo do Arquivo 1
# criar command-palette.tsx com conteúdo do Arquivo 2
# criar src/app/api/search/route.ts se não existir (verificar primeiro)
npx tsc --noEmit
npm run lint
npm run build
git add src/components/layout/header.tsx src/components/ui/command-palette.tsx
git add src/app/api/search/route.ts
git commit -m "feat(EP-015): busca global command palette + reconstruir header.tsx"
gh pr create --title "feat(EP-015): busca global / command palette (Ctrl+K)" --body "Reconstrói header.tsx (estava truncado), implementa command-palette.tsx e API /api/search. Ctrl+K abre busca em tempo real de profissionais, clientes e páginas."
```

## DoD

- [ ] `npx tsc --noEmit` zero erros
- [ ] `npm run build` sem erros
- [ ] Header renderiza corretamente com user dropdown + botão busca
- [ ] Ctrl+K abre modal de busca
- [ ] Busca retorna resultados em tempo real
