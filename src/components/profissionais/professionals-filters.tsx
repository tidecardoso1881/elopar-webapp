'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

interface Client {
  id: string
  name: string
}

interface ProfessionalsFiltersProps {
  clients: Client[]
}

export function ProfessionalsFilters({ clients }: ProfessionalsFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
          params.delete('page') // reset pagination on filter change
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const handleChange = (key: string, value: string) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ [key]: value || null })}`)
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      {/* Busca por nome */}
      <div className="relative flex-1 min-w-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Buscar por nome..."
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => handleChange('q', e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-10"
        />
      </div>

      {/* Filtro por cliente */}
      <select
        defaultValue={searchParams.get('cliente') ?? ''}
        onChange={(e) => handleChange('cliente', e.target.value)}
        className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-xs sm:text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-10"
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
        defaultValue={searchParams.get('status') ?? ''}
        onChange={(e) => handleChange('status', e.target.value)}
        className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-xs sm:text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-10"
      >
        <option value="">Todos os status</option>
        <option value="ATIVO">Ativo</option>
        <option value="INATIVO">Inativo</option>
      </select>

      {/* Loading indicator */}
      {isPending && (
        <div className="flex items-center text-xs sm:text-sm text-gray-400 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50">
          <svg className="animate-spin h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="hidden sm:inline">Carregando...</span>
        </div>
      )}
    </div>
  )
}