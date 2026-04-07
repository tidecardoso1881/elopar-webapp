'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { useSavedFilters } from '@/hooks/useSavedFilters'
import { SavedFilters } from './saved-filters'

interface Client {
  id: string
  name: string
}

interface ProfessionalsFiltersProps {
  clients: Client[]
  positions?: string[]
}

const FILTER_KEYS = ['q', 'cliente', 'status', 'position', 'seniority', 'contract_type', 'renewal'] as const

export function ProfessionalsFilters({ clients, positions = [] }: ProfessionalsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Controlled state for text search (to support debounce)
  const [textSearch, setTextSearch] = useState(searchParams.get('q') ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Saved filters
  const { saveFilter } = useSavedFilters()
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [filterName, setFilterName] = useState('')

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      // Always reset pagination on any filter change
      params.delete('page')
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const handleChange = useCallback((key: string, value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ [key]: value || null })}`)
    })
  }, [router, pathname, createQueryString])

  // Debounce text search (300ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const current = searchParams.get('q') ?? ''
      if (textSearch !== current) {
        handleChange('q', textSearch)
      }
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textSearch])

  const hasActiveFilters = FILTER_KEYS.some(k => !!searchParams.get(k))

  const handleClear = () => {
    setTextSearch('')
    startTransition(() => {
      router.push(pathname)
    })
  }

  const handleSave = () => {
    const params: Record<string, string> = {}
    FILTER_KEYS.forEach(k => {
      const v = searchParams.get(k)
      if (v) params[k] = v
    })
    saveFilter(filterName, params)
    setFilterName('')
    setShowSaveModal(false)
  }

  return (
    <div className="space-y-3">
      {/* Primeira linha de filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Busca por nome/CPF */}
        <div className="relative flex-1 min-w-0">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="search"
            placeholder="Buscar nome, CPF..."
            value={textSearch}
            onChange={(e) => setTextSearch(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filtro por cliente */}
        <select
          value={searchParams.get('cliente') ?? ''}
          onChange={(e) => handleChange('cliente', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todos os clientes</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Filtro por status */}
        <select
          value={searchParams.get('status') ?? ''}
          onChange={(e) => handleChange('status', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>

        {/* Filtro por vencimento */}
        <select
          value={searchParams.get('renewal') ?? ''}
          onChange={(e) => handleChange('renewal', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todos os vencimentos</option>
          <option value="expired">⛔ Expirado</option>
          <option value="critical">🔴 Crítico (≤30d)</option>
          <option value="warning">🟠 Aviso (31–60d)</option>
          <option value="attention">🟡 Atenção (61–90d)</option>
          <option value="ok">🟢 OK (&gt;90d)</option>
        </select>

        {/* Botão Limpar */}
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Limpar filtros
          </button>
        )}
      </div>

      {/* Segunda linha de filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {/* Filtro por cargo */}
        <input
          type="text"
          placeholder="Filtrar por cargo..."
          value={searchParams.get('position') ?? ''}
          onChange={(e) => handleChange('position', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Filtro por senioridade */}
        <select
          value={searchParams.get('seniority') ?? ''}
          onChange={(e) => handleChange('seniority', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todas as senioridades</option>
          <option value="JUNIOR">Júnior</option>
          <option value="PLENO">Pleno</option>
          <option value="SENIOR">Sênior</option>
          <option value="ESPECIALISTA">Especialista</option>
        </select>

        {/* Filtro por tipo de contrato */}
        <select
          value={searchParams.get('contract_type') ?? ''}
          onChange={(e) => handleChange('contract_type', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todos os contratos</option>
          <option value="CLT_ESTRATEGICO">CLT Estratégico</option>
          <option value="CLT_ILAED">CLT ILAED</option>
          <option value="PJ">PJ</option>
        </select>

        {/* Loading indicator */}
        {isPending && (
          <div className="flex items-center text-sm text-gray-400 whitespace-nowrap">
            <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Carregando...
          </div>
        )}
      </div>

      {/* Filtros salvos */}
      <SavedFilters currentParams={searchParams.toString()} />

      {/* Botão salvar + modal */}
      {hasActiveFilters && (
        <div>
          <button
            onClick={() => setShowSaveModal(true)}
            title="Salve este filtro para usar rapidamente depois"
            className={`inline-flex items-center gap-1 text-xs font-medium transition-colors rounded px-2 py-1 ${
              hasActiveFilters
                ? 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={hasActiveFilters ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
            Salvar filtro
          </button>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl p-5 w-72">
            <p className="text-sm font-semibold text-gray-900 mb-3">Nomear filtro</p>
            <input
              autoFocus
              type="text"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && filterName.trim() && handleSave()}
              placeholder="Ex: Clientes Críticos"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >Cancelar</button>
              <button
                onClick={handleSave}
                disabled={!filterName.trim()}
                className="flex-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
              >Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}