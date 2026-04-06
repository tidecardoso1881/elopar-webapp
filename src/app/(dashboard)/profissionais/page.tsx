import { createClient } from '@/lib/supabase/server'
import { ProfessionalsFilters } from '@/components/profissionais/professionals-filters'
import { ProfessionalsTable } from '@/components/profissionais/professionals-table'
import { ExportButton } from '@/components/profissionais/export-button'
import { getRenewalStatus } from '@/lib/utils/formatting'
import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profissionais',
}

const PAGE_SIZE = 20

interface SearchParams {
  q?: string
  cliente?: string
  status?: string
  position?: string
  seniority?: string
  contract_type?: string
  renewal?: string
  page?: string
  sortBy?: string
  sortDir?: string
}

interface ProfissionaisPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ProfissionaisPage({ searchParams }: ProfissionaisPageProps) {
  const params = await searchParams
  const search = params.q?.trim() ?? ''
  const clienteId = params.cliente ?? ''
  const status = params.status ?? ''
  const position = params.position?.trim() ?? ''
  const seniority = params.seniority ?? ''
  const contractType = params.contract_type ?? ''
  const renewalFilter = params.renewal ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const validSortCols = ['name', 'renewal_deadline', 'status'] as const
  type SortCol = typeof validSortCols[number]
  const sortBy: SortCol = (validSortCols as readonly string[]).includes(params.sortBy ?? '')
    ? (params.sortBy as SortCol)
    : 'name'
  const sortDir = params.sortDir === 'desc' ? 'desc' : 'asc'
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  // Busca clientes para o filtro
  const { data: clients } = await supabase
    .from('clients')
    .select('id, name')
    .order('name')

  // Query base com join no cliente
  let query = supabase
    .from('professionals')
    .select('id, os, name, position, seniority, status, contract_type, renewal_deadline, client:clients(name)', { count: 'exact' })
    .order(sortBy, { ascending: sortDir === 'asc' })
    .range(from, to)

  if (search) {
    query = query.ilike('name', `%${search}%`)
  }
  if (clienteId) {
    query = query.eq('client_id', clienteId)
  }
  if (status) {
    query = query.eq('status', status)
  }
  if (position) {
    query = query.ilike('position', `%${position}%`)
  }
  if (seniority) {
    query = query.eq('seniority', seniority)
  }
  if (contractType) {
    query = query.eq('contract_type', contractType)
  }

  let { data: professionals, count, error } = await query

  // Filtro de renovação é aplicado em memória se necessário
  if (renewalFilter && professionals) {
    professionals = professionals.filter((p) => {
      const status = getRenewalStatus(p.renewal_deadline)
      return status === renewalFilter
    })
    count = professionals.length
  }

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const totalCount = count ?? 0

  const buildUrl = (newPage: number) => {
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (clienteId) p.set('cliente', clienteId)
    if (status) p.set('status', status)
    if (position) p.set('position', position)
    if (seniority) p.set('seniority', seniority)
    if (contractType) p.set('contract_type', contractType)
    if (renewalFilter) p.set('renewal', renewalFilter)
    if (sortBy !== 'name') p.set('sortBy', sortBy)
    if (sortDir !== 'asc') p.set('sortDir', sortDir)
    if (newPage > 1) p.set('page', String(newPage))
    const qs = p.toString()
    return `/profissionais${qs ? `?${qs}` : ''}`
  }

  const buildSortUrl = (col: string, dir: 'asc' | 'desc') => {
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (clienteId) p.set('cliente', clienteId)
    if (status) p.set('status', status)
    if (position) p.set('position', position)
    if (seniority) p.set('seniority', seniority)
    if (contractType) p.set('contract_type', contractType)
    if (renewalFilter) p.set('renewal', renewalFilter)
    p.set('sortBy', col)
    if (dir !== 'asc') p.set('sortDir', dir)
    const qs = p.toString()
    return `/profissionais${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">Profissionais</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
            {totalCount > 0
              ? `${totalCount} profissional${totalCount !== 1 ? 'is' : ''} encontrado${totalCount !== 1 ? 's' : ''}`
              : 'Nenhum profissional cadastrado'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Suspense>
            <ExportButton />
          </Suspense>
          <Link
            href="/profissionais/novo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all min-h-10"
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Novo</span>
          </Link>
        </div>
      </div>

      {/* Card com filtros + tabela */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Filtros */}
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100 overflow-x-auto">
          <Suspense>
            <ProfessionalsFilters clients={clients ?? []} />
          </Suspense>
        </div>

        {/* Erro */}
        {error && (
          <div className="px-4 sm:px-5 py-4 text-xs sm:text-sm text-red-600 bg-red-50 border-b border-red-100">
            Erro ao carregar profissionais: {error.message}
          </div>
        )}

        {/* Tabela */}
        <div className="overflow-x-auto">
          <ProfessionalsTable
            professionals={professionals ?? []}
            sortBy={sortBy}
            sortDir={sortDir}
            buildSortUrl={buildSortUrl}
          />
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-t border-gray-100 bg-gray-50 gap-4">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2 justify-center sm:justify-end">
              {page > 1 && (
                <Link
                  href={buildUrl(page - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all min-h-10"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Anterior</span>
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl(page + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all min-h-10"
                >
                  <span>Próxima</span>
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