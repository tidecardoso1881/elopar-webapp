import { createClient } from '@/lib/supabase/server'
import { ProfessionalsFilters } from '@/components/profissionais/professionals-filters'
import { ProfessionalsTable } from '@/components/profissionais/professionals-table'
import { ExportCsvButton } from '@/components/profissionais/export-csv-button'
import { Suspense } from 'react'
import Link from 'next/link'

const PAGE_SIZE = 20

interface SearchParams {
  q?: string
  cliente?: string
  status?: string
  page?: string
}

interface ProfissionaisPageProps {
  searchParams: Promise<SearchParams>
}

export default async function ProfissionaisPage({ searchParams }: ProfissionaisPageProps) {
  const params = await searchParams
  const search = params.q?.trim() ?? ''
  const clienteId = params.cliente ?? ''
  const status = params.status ?? ''
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
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
    .order('name')
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

  const { data: professionals, count, error } = await query

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const totalCount = count ?? 0

  const buildUrl = (newPage: number) => {
    const p = new URLSearchParams()
    if (search) p.set('q', search)
    if (clienteId) p.set('cliente', clienteId)
    if (status) p.set('status', status)
    if (newPage > 1) p.set('page', String(newPage))
    const qs = p.toString()
    return `/profissionais${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Profissionais</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCount > 0
              ? `${totalCount} profissional${totalCount !== 1 ? 'is' : ''} encontrado${totalCount !== 1 ? 's' : ''}`
              : 'Nenhum profissional cadastrado'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Suspense>
            <ExportCsvButton />
          </Suspense>
          <Link
            href="/profissionais/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo Profissional
          </Link>
        </div>
      </div>

      {/* Card com filtros + tabela */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Filtros */}
        <div className="px-5 py-4 border-b border-gray-100">
          <Suspense>
            <ProfessionalsFilters clients={clients ?? []} />
          </Suspense>
        </div>

        {/* Erro */}
        {error && (
          <div className="px-5 py-4 text-sm text-red-600 bg-red-50 border-b border-red-100">
            Erro ao carregar profissionais: {error.message}
          </div>
        )}

        {/* Tabela */}
        <ProfessionalsTable professionals={professionals ?? []} />

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