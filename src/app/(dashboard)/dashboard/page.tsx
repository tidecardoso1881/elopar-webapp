import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

interface DashboardKPIs {
  total_active: number
  total_terminated: number
  total_all: number
  renewals_critical: number
  renewals_pending: number
}

interface ClientSummary {
  client_id: string
  client_name: string
  active_count: number
  terminated_count: number
  total_count: number
  total_billing: number
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch KPIs
  let kpis: DashboardKPIs = {
    total_active: 0,
    total_terminated: 0,
    total_all: 0,
    renewals_critical: 0,
    renewals_pending: 0,
  }

  const { data: kpisData, error: kpisError } = await supabase
    .from('v_dashboard_kpis')
    .select('*')
    .single()

  if (!kpisError && kpisData) {
    kpis = kpisData as DashboardKPIs
  }

  // Fetch client summary
  let clients: ClientSummary[] = []

  const { data: clientsData, error: clientsError } = await supabase
    .from('v_client_summary')
    .select('*')

  if (!clientsError && clientsData) {
    clients = (clientsData as ClientSummary[]).sort((a, b) => b.total_count - a.total_count)
  }

  // Calculate max total_count for bar width percentage
  const maxCount = clients.length > 0 ? Math.max(...clients.map(c => c.total_count)) : 1

  // Color palette for clients (6 colors repeating)
  const colorPalette = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-cyan-500',
  ]

  const getColorForIndex = (index: number) => colorPalette[index % colorPalette.length]

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Visão geral da operação de profissionais</p>
      </div>

      {/* EP-013: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Profissionais */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Total Profissionais</p>
              <p className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">{kpis.total_all}</p>
            </div>
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Ativos */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Ativos</p>
              <p className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">{kpis.total_active}</p>
            </div>
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 sm:h-10 sm:w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7.5-1.75a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3: Desligados */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Desligados</p>
              <p className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">{kpis.total_terminated}</p>
            </div>
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 sm:h-10 sm:w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 4: Renovações Críticas */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">Renovações Críticas</p>
              <p className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">{kpis.renewals_critical}</p>
            </div>
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 sm:h-10 sm:w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4v2m0 4v2M12 3a9 9 0 110 18 9 9 0 010-18z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* EP-014: Headcount por Cliente */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Headcount por Cliente</h2>

        {clients.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {clients.map((client, index) => {
              const percentage = (client.total_count / maxCount) * 100
              const color = getColorForIndex(index)

              return (
                <div key={client.client_id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  {/* Client Name */}
                  <div className="sm:w-40 flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{client.client_name}</p>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-6 sm:h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Count */}
                  <div className="w-10 sm:w-12 flex-shrink-0 text-right">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900">{client.total_count}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <p className="text-xs sm:text-sm">Nenhum dado de cliente encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}