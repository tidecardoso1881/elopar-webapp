'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'

interface Client {
  id: string
  name: string
}

interface ProfessionalsFiltersProps {
  clients: Client[]
  positions?: string[]
}

export function ProfessionalsFilters({ clients, positions = [] }: ProfessionalsFiltersProps) {
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
    <div className="space-y-3">
      {/* Primeira linha de filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
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
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filtro por cliente */}
        <select
          defaultValue={searchParams.get('cliente') ?? ''}
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
          defaultValue={searchParams.get('status') ?? ''}
          onChange={(e) => handleChange('status', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>
      </div>

      {/* Segunda linha de filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Filtro por cargo */}
        <input
          type="text"
          placeholder="Filtrar por cargo..."
          defaultValue={searchParams.get('position') ?? ''}
          onChange={(e) => handleChange('position', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Filtro por senioridade */}
        <select
          defaultValue={searchParams.get('seniority') ?? ''}
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
          defaultValue={searchParams.get('contract_type') ?? ''}
          onChange={(e) => handleChange('contract_type', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todos os contratos</option>
          <option value="CLT_ESTRATEGICO">CLT Estratégico</option>
          <option value="CLT_ILAED">CLT ILAED</option>
          <option value="PJ">PJ</option>
        </select>

        {/* Filtro por período de renovação */}
        <select
          defaultValue={searchParams.get('renewal') ?? ''}
          onChange={(e) => handleChange('renewal', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todos os períodos</option>
          <option value="expired">Vencidos</option>
          <option value="critical">Crítico (≤30 dias)</option>
          <option value="warning">Atenção (≤60 dias)</option>
          <option value="ok">OK ({'>'}90 dias)</option>
        </select>

        {/* Loading indicator */}
        {isPending && (
          <div className="flex items-center text-sm text-gray-400">
            <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Carregando...
          </div>
        )}
      </div>
    </div>
  )
}