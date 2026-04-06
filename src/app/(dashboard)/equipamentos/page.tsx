import { createClient } from '@/lib/supabase/server'
import { EquipmentTable } from '@/components/profissionais/equipment-table'
import { Suspense } from 'react'
import Link from 'next/link'

const PAGE_SIZE = 20

interface SearchParams {
  q?: string
  machine_type?: string
  page?: string
  sortBy?: string
  sortDir?: string
}

interface EquipamentosPageProps {
  searchParams: Promise<SearchParams>
}

export default async function EquipamentosPage({ searchParams }: EquipamentosPageProps) {
  const params = await searchParams
  const search = params.q?.trim() ?? ''
  const machineType = params.machine_type ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const validSortCols = ['professional_name', 'machine_type', 'created_at'] as const
  type SortCol = typeof validSortCols[number]
  const sortBy: SortCol = (validSortCols as readonly string[]).includes(params.sortBy ?? '')
    ? (params.sortBy as SortCol)
    : 'professional_name'
  const sortDir = params.sortDir === 'desc' ? 'desc' : 'asc'
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  // Query base para equipamentos
  let query = supabase
    .from('equipment')
    .select('id, professional_name, company, machine_type, machine_model, office_package, created_at', { count: 'exact' })
    .order(sortBy, { ascending: sortDir === 'asc' })
    .range(from, to)

  if (search) {
    query = query.ilike('professional_name', `%${search}%`)
  }
  if (machineType) {
    query = query.eq('machine_type', machineType)
  }

  const { data: equipments, count, error } = await query

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const totalCount = count ?? 0

  const buildUrl = (newPage: number) => {
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (machineType) p.set('machine_type', machineType)
    if (sortBy !== 'professional_name') p.set('sortBy', sortBy)
    if (sortDir !== 'asc') p.set('sortDir', sortDir)
    if (newPage > 1) p.set('page', String(newPage))
    const qs = p.toString()
    return `/equipamentos${qs ? `?${qs}` : ''}`
  }

  const buildSortUrl = (col: string, dir: 'asc' | 'desc') => {
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (machineType) p.set('machine_type', machineType)
    p.set('sortBy', col)
    if (dir !== 'asc') p.set('sortDir', dir)
    const qs = p.toString()
    return `/equipamentos${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Equipamentos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCount > 0
              ? `${totalCount} equipamento${totalCount !== 1 ? 's' : ''} encontrado${totalCount !== 1 ? 's' : ''}`
              : 'Nenhum equipamento cadastrado'}
          </p>
        </div>
        <Link
          href="/equipamentos/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Equipamento
        </Link>
      </div>

      {/* Card com filtros + tabela */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Filtros */}
        <div className="px-5 py-4 border-b border-gray-100">
          <Suspense>
            <EquipmentFilters />
          </Suspense>
        </div>

        {/* Erro */}
        {error && (
          <div className="px-5 py-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
            Erro ao carregar equipamentos: {error.message}
          </div>
        )}

        {/* Tabela */}
        <EquipmentTable
          equipments={equipments ?? []}
          sortBy={sortBy}
          sortDir={sortDir}
          buildSortUrl={buildSortUrl}
        />

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl(page - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl(page + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Próxima
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EquipmentFilters() {
  'use client'
  const { useRouter, usePathname, useSearchParams } = require('next/navigation')
  const { useCallback, useTransition } = require('react')

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
          params.delete('page')
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
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1 min-w-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          placeholder="Buscar por nome do profissional..."
          defaultValue={searchParams.get('q') ?? ''}
          onChange={(e) => handleChange('q', e.target.value)}
          className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <select
        defaultValue={searchParams.get('machine_type') ?? ''}
        onChange={(e) => handleChange('machine_type', e.target.value)}
        className="rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Todos os tipos</option>
        <option value="Notebook">Notebook</option>
        <option value="Desktop">Desktop</option>
        <option value="Tablet">Tablet</option>
        <option value="Celular">Celular</option>
        <option value="Outro">Outro</option>
      </select>

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
  )
}