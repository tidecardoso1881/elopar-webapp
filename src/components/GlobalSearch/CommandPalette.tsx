'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchResult, type SearchResultItem } from './SearchResult'

interface SearchResults {
  professionals: SearchResultItem[]
  clients: SearchResultItem[]
  equipment: SearchResultItem[]
}

const EMPTY_RESULTS: SearchResults = {
  professionals: [],
  clients: [],
  equipment: [],
}

function buildNavPath(id: string, type: SearchResultItem['type']): string {
  switch (type) {
    case 'professional': return `/profissionais/${id}`
    case 'client':       return `/clientes/${id}`
    case 'equipment':    return `/equipamentos/${id}`
  }
}

function flattenResults(results: SearchResults): SearchResultItem[] {
  return [
    ...results.professionals.map((r) => ({ ...r, type: 'professional' as const })),
    ...results.clients.map((r) => ({ ...r, type: 'client' as const })),
    ...results.equipment.map((r) => ({ ...r, type: 'equipment' as const })),
  ]
}

export function CommandPalette() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const close = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setResults(EMPTY_RESULTS)
    setActiveIndex(0)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  // Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) close()
        else open()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, open, close])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const flat = flattenResults(results)
      if (e.key === 'Escape') {
        close()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, flat.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        const item = flat[activeIndex]
        if (item) {
          handleSelect(item.id, item.type)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, results, activeIndex, close])

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(EMPTY_RESULTS)
      return
    }

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setIsLoading(true)
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&limit=5`,
        { signal: abortRef.current.signal }
      )
      if (!res.ok) return
      const data: SearchResults = await res.json()
      setResults(data)
      setActiveIndex(0)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setQuery(val)

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => fetchResults(val), 300)
    },
    [fetchResults]
  )

  const handleSelect = useCallback(
    (id: string, type: SearchResultItem['type']) => {
      router.push(buildNavPath(id, type))
      close()
    },
    [router, close]
  )

  if (!isOpen) return null

  const flat = flattenResults(results)
  const hasResults = flat.length > 0
  const SECTIONS: { key: keyof SearchResults; label: string }[] = [
    { key: 'professionals', label: 'Profissionais' },
    { key: 'clients',       label: 'Clientes' },
    { key: 'equipment',     label: 'Equipamentos' },
  ]

  // Calculate absolute index offset for each section
  let sectionOffset = 0

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={close}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Busca global"
        className="fixed z-50 top-24 left-1/2 -translate-x-1/2 w-full max-w-lg sm:max-w-md px-4 animate-slideDown"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
            <svg
              className="flex-shrink-0 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Buscar profissionais, clientes, equipamentos..."
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
              aria-label="Termo de busca"
              aria-autocomplete="list"
              aria-controls="search-results"
            />
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 rounded border border-gray-200 font-mono">
              Ctrl K
            </kbd>
          </div>

          {/* Results */}
          {query.length >= 2 && (
            <ul
              id="search-results"
              role="listbox"
              aria-label="Resultados da busca"
              className="py-2 max-h-80 overflow-y-auto"
            >
              {!hasResults && !isLoading && (
                <li className="px-4 py-8 text-center text-sm text-gray-400">
                  Nenhum resultado para <span className="font-medium text-gray-600">&quot;{query}&quot;</span>
                </li>
              )}

              {SECTIONS.map(({ key, label }) => {
                const items = results[key]
                if (items.length === 0) {
                  sectionOffset += 0
                  return null
                }
                const startOffset = sectionOffset
                sectionOffset += items.length

                return (
                  <div key={key}>
                    <div className="px-4 pt-2 pb-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                    {items.map((item, i) => (
                      <SearchResult
                        key={item.id}
                        {...item}
                        type={key === 'professionals' ? 'professional' : key === 'clients' ? 'client' : 'equipment'}
                        isActive={activeIndex === startOffset + i}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )
              })}
            </ul>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-100 bg-gray-50">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">↑↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">Enter</kbd>
              abrir
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">Esc</kbd>
              fechar
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
