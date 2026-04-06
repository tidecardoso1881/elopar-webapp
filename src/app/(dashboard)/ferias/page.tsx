import { createClient } from '@/lib/supabase/server'
import { VacationTable } from '@/components/profissionais/ferias/vacation-table'
import { Suspense } from 'react'
import Link from 'next/link'
import { VacationFilters } from './filters'

const PAGE_SIZE = 20

interface SearchParams {
  q?: string
  client_area?: string
  page?: string
  sortBy?: string
  sortDir?: string
}

interface FeriasPageProps {
  searchParams: Promise<SearchParams>
}

export default async function FeriasPage({ searchParams }: FeriasPageProps) {
  const params = await searchParams
  const search = params.q?.trim() ?? ''
  const clientArea = params.client_area ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const validSortCols = ['professional_name', 'vacation_start', 'vacation_end', 'created_at'] as const
  type SortCol = typeof validSortCols[number]
  const sortBy: SortCol = (validSortCols as readonly string[]).includes(params.sortBy ?? '')
    ? (params.sortBy as SortCol)
    : 'professional_name'
  const sortDir = params.sortDir === 'desc' ? 'desc' : 'asc'
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  // Query base para férias
  let query = supabase
    .from('vacations')
    .select('id, professional_name, acquisition_start, acquisition_end, vacation_start, vacation_end, total_days, days_balance, leadership, client_area, created_at', { count: 'exact' })
    .order(sortBy, { ascending: sortDir === 'asc' })
    .range(from, to)

  if (search) {
    query = query.ilike('professional_name', `%${search}%`)
  }
  if (clientArea) {
    query = query.eq('client_area', clientArea)
  }

  const { data: vacations, count, error } = await query

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const totalCount = count ?? 0

  const buildUrl = (newPage: number) => {
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (clientArea) p.set('client_area', clientArea)
    if (sortBy !== 'professional_name') p.set('sortBy', sortBy)
    if (sortDir !== 'asc') p.set('sortDir', sortDir)
    if (newPage > 1) p.set('page', String(newPage))
    const qs = p.toString()
    return `/ferias${qs ? `?${qs}` : ''}`
  }

  const buildSortUrl = (col: string, dir: 'asc' | 'desc') => {
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (clientArea) p.set('client_area', clientArea)
    p.set('sortBy', col)
    if (dir !== 'asc') p.set('sortDir', dir)
    const qs = p.toString()
    return `/ferias${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Férias</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCount > 0
              ? `${totalCount} registro${totalCount !== 1 ? 's' : ''} encontrado${totalCount !== 1 ? 's' : ''}`
              : 'Nenhuma férias cadastrada'}
          </p>
        </div>
        <Link
          href="/ferias/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Registro
        </Link>
      </div>

      {/* Card com filtros + tabela */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Filtros */}
        <div className="px-5 py-4 border-b border-gray-100">
          <Suspense>
            <VacationFilters />
          </Suspense>
        </div>

        {/* Erro */}
        {error && (
          <div className="px-5 py-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
            Erro ao carregar férias: {error.message}
          </div>
        )}

        {/* Tabela */}
        <VacationTable
          vacations={vacations ?? []}
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
