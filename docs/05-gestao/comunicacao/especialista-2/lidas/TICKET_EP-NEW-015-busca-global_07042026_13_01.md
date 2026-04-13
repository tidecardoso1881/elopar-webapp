---
para: Especialista 2 (Haiku)
de: Gerente (Cowork)
data: 2026-04-07
branch: feat/command-palette
ep: EP-NEW-015
prioridade: Could Have
---

# TICKET EP-NEW-015 — Busca Global / Command Palette

## Contexto

Usuários navegam por múltiplos módulos (profissionais, clientes, equipamentos, férias). Um command palette com Ctrl+K permite chegar a qualquer registro ou página em 2 teclas.

---

## Arquivos a criar / modificar

| Ação | Arquivo |
|---|---|
| CRIAR | `src/components/ui/command-palette.tsx` |
| CRIAR | `src/hooks/useCommandPalette.ts` |
| CRIAR | `src/app/api/search/route.ts` |
| MODIFICAR | `src/components/layout/header.tsx` |

---

## 1. API de busca — `src/app/api/search/route.ts`

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

## 2. Hook — `src/hooks/useCommandPalette.ts`

```ts
'use client'
import { useEffect, useState } from 'react'

export function useCommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return { open, setOpen }
}
```

---

## 3. Componente — `src/components/ui/command-palette.tsx`

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

  // Focus input when open
  useEffect(() => {
    if (open) {
      setQuery('')
      setResults({ professionals: [], clients: [] })
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Debounced search
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

  // Flatten all items for keyboard nav
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
        {/* Input */}
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

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {allItems.length === 0 && query.length >= 2 && !loading && (
            <p className="px-4 py-3 text-sm text-gray-500">Nenhum resultado encontrado.</p>
          )}

          {/* Pages */}
          {filteredPages.length > 0 && (
            <div>
              <p className="px-4 py-1 text-xs font-medium text-gray-400 uppercase tracking-wide">Páginas</p>
              {filteredPages.map((page, i) => {
                const idx = i
                return (
                  <button
                    key={page.href}
                    onClick={() => navigate(page.href)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      activeIndex === idx ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-gray-400">📄</span>
                    {page.label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Professionals */}
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

          {/* Clients */}
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

          {/* Empty state for short queries */}
          {query.length === 0 && (
            <p className="px-4 py-3 text-sm text-gray-400">Digite para buscar profissionais, clientes ou páginas.</p>
          )}
        </div>

        {/* Footer */}
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

## 4. Modificar `src/components/layout/header.tsx`

Adicione ao header (Client Component ou convertê-lo para Client Component):

```tsx
// No topo do arquivo, adicionar:
'use client'
import { CommandPalette } from '@/components/ui/command-palette'
import { useCommandPalette } from '@/hooks/useCommandPalette'

// Dentro do componente Header, antes do return:
const { open, setOpen } = useCommandPalette()

// No JSX, antes do avatar/botão de usuário, adicionar botão de lupa:
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

{/* Logo após o botão no JSX: */}
<CommandPalette open={open} onClose={() => setOpen(false)} />
```

---

## DoD

- [ ] Ctrl+K abre o modal em qualquer página
- [ ] Botão de lupa no header abre o modal
- [ ] Busca por nome de profissional retorna resultados em tempo real
- [ ] Busca por nome de cliente retorna resultados
- [ ] Teclas ↑↓ navegam, Enter abre, Esc fecha
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run lint` sem erros
- [ ] `npm run build` sem erros

## Branch e PR

```bash
git checkout main && git pull origin main
git checkout -b feat/command-palette
# crie os arquivos e modifique o header
npx tsc --noEmit && npm run lint
git add src/components/ui/command-palette.tsx src/hooks/useCommandPalette.ts src/app/api/search/route.ts src/components/layout/header.tsx
git commit -m "feat(EP-015): busca global com command palette (Ctrl+K)"
git fetch origin && git merge origin/main
gh pr create --title "feat(EP-015): busca global / command palette (Ctrl+K)" --body "Implementa command palette com Ctrl+K para busca em tempo real de profissionais, clientes e páginas."
```
