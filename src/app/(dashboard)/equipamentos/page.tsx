import { createClient } from '@/lib/supabase/server'
import { EquipmentTable } from '@/components/profissionais/equipment-table'
import { EquipmentFilters } from '@/components/equipamentos/equipment-filters'
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
          <Suspense fallback={<div className="h-10 rounded-lg bg-gray-100 animate-pulse" />}>
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
