import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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
  total_billing: number | string
}

interface RenewalAlert {
  id: string
  name: string
  email: string
  client_name: string
  client_id: string
  contract_end: string
  days_until_expiry: number
  renewal_status: string
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

  // Fetch renewal alerts (próximos 5)
  let renewals: RenewalAlert[] = []

  const { data: renewalData, error: renewalError } = await supabase
    .from('v_renewal_alerts')
    .select('*')
    .order('days_until_expiry', { ascending: true })
    .limit(5)

  if (!renewalError && renewalData) {
    renewals = (renewalData as RenewalAlert[]).filter(r => r.days_until_expiry > -90)
  }

  // Calculate totals
  const maxCount = clients.length > 0 ? Math.max(...clients.map(c => c.total_count)) : 1
  const totalBilling = clients.reduce((sum, client) => {
    const billing = typeof client.total_billing === 'string'
      ? parseFloat(client.total_billing)
      : client.total_billing
    return sum + (isNaN(billing) ? 0 : billing)
  }, 0)

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

  // Format date helpers
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return dateString
    }
  }

  const getRenewalBadge = (daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
          Expirado
        </span>
      )
    }
    if (daysUntilExpiry <= 30) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
          Crítico
        </span>
      )
    }
    if (daysUntilExpiry <= 90) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
          Pendente
        </span>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Visão geral da operação de profissionais</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Card 1: Total Profissionais */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Profissionais</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{kpis.total_all}</p>
            </div>
            <div className="ml-3">
              <svg className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 2: Ativos */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Ativos</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{kpis.total_active}</p>
            </div>
            <div className="ml-3">
              <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m7.5-1.75a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 3: Desligados */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Desligados</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{kpis.total_terminated}</p>
            </div>
            <div className="ml-3">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 4: Renovações Críticas */}
        <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Renovações Críticas</p>
              <p className="text-4xl font-bold text-red-600 mt-2">{kpis.renewals_critical}</p>
            </div>
            <div className="ml-3">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4v2m0 4v2M12 3a9 9 0 110 18 9 9 0 010-18z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 5: Renovações Pendentes */}
        <div className="bg-white rounded-lg border border-amber-200 shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Renovações Pendentes</p>
              <p className="text-4xl font-bold text-amber-600 mt-2">{kpis.renewals_pending}</p>
            </div>
            <div className="ml-3">
              <svg className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Renovações Urgentes */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Renovações Urgentes</h2>

        {renewals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Profissional</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Cliente</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Data Renovação</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Dias Restantes</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {renewals.map((renewal) => (
                  <tr key={renewal.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">{renewal.name}</p>
                      <p className="text-xs text-gray-500">{renewal.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700">{renewal.client_name}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-700">{formatDate(renewal.contract_end)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className={`text-sm font-semibold ${
                        renewal.days_until_expiry <= 0 ? 'text-red-600' :
                        renewal.days_until_expiry <= 30 ? 'text-red-600' :
                        'text-amber-600'
                      }`}>
                        {renewal.days_until_expiry <= 0 ? 'Expirado' : `${renewal.days_until_expiry} dias`}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      {getRenewalBadge(renewal.days_until_expiry)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        href={`/profissionais?q=${encodeURIComponent(renewal.name)}`}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <p className="text-sm">Nenhuma renovação urgente encontrada.</p>
          </div>
        )}
      </div>

      {/* Headcount por Cliente */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Distribuição por Cliente</h2>

        {clients.length > 0 ? (
          <div className="space-y-4">
            {clients.map((client, index) => {
              const percentage = (client.total_count / maxCount) * 100
              const color = getColorForIndex(index)
              const percentualClientes = ((client.total_count / kpis.total_all) * 100).toFixed(1)

              return (
                <div key={client.client_id} className="flex items-center gap-4">
                  {/* Client Name and Percentage */}
                  <div className="w-48 flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{client.client_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{percentualClientes}% da equipe</p>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Count */}
                  <div className="w-20 flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-gray-900">{client.total_count}</p>
                    <p className="text-xs text-gray-500">profissionais</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <p className="text-sm">Nenhum dado de cliente encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}