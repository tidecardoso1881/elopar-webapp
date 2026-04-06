import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatting'
import Link from 'next/link'

// Alinhado com v_renewal_alerts view — views não têm NOT NULL no Supabase
interface RenewalAlert {
  id: string | null
  name: string | null
  email: string | null
  profile: string | null
  seniority: string | null
  status: string | null
  contract_end: string | null
  renewal_deadline: string | null
  client_name: string | null
  client_id: string | null
  days_until_expiry: number | null
  renewal_status: string | null
}

const RENEWAL_STATUS_CONFIG: Record<string, { bg: string; textColor: string; label: string; bgLight: string }> = {
  expired: {
    bg: 'bg-red-100',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
    label: 'Vencido',
  },
  critical: {
    bg: 'bg-orange-100',
    textColor: 'text-orange-700',
    bgLight: 'bg-orange-50',
    label: 'Crítico',
  },
  warning: {
    bg: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    bgLight: 'bg-yellow-50',
    label: 'Atenção',
  },
  attention: {
    bg: 'bg-blue-100',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    label: 'Pendente',
  },
  ok: {
    bg: 'bg-green-100',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
    label: 'OK',
  },
}

function SummaryCard({
  label,
  count,
  statusKey,
}: {
  label: string
  count: number
  statusKey: 'expired' | 'critical' | 'warning' | 'attention'
}) {
  const config = RENEWAL_STATUS_CONFIG[statusKey]
  return (
    <div className={`rounded-lg border ${config.bgLight} p-4`}>
      <div className="flex items-center gap-3">
        <div className={`rounded-full ${config.bg} p-3`}>
          <span className={`text-lg font-bold ${config.textColor}`}>{count}</span>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <p className={`text-2xl font-semibold ${config.textColor}`}>{count}</p>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="mb-4 h-12 w-12 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="font-medium text-gray-500">Nenhuma renovação pendente</p>
      <p className="mt-1 text-sm text-gray-400">
        Todos os contratos estão dentro do prazo de renovação
      </p>
    </div>
  )
}

interface RenovacoesPageProps {
  searchParams?: Promise<Record<string, unknown>>
}

export default async function RenovacoesPage(props: RenovacoesPageProps) {
  const supabase = await createClient()
  const searchParams = await props.searchParams

  // Extrair parâmetros de filtro
  const filterStatus = (searchParams?.status as string) || 'all'
  const filterClient = (searchParams?.client as string) || 'all'

  // Buscar dados da view
  const { data: renewalAlerts, error } = await supabase
    .from('v_renewal_alerts')
    .select('*')

  let alerts: RenewalAlert[] = renewalAlerts ?? []

  // Filtrar apenas profissionais ATIVOS com days_until_expiry não nulo
  alerts = alerts.filter(
    (a) => a.status === 'ATIVO' && a.days_until_expiry !== null
  )

  // Aplicar filtro de status de renovação
  if (filterStatus !== 'all') {
    alerts = alerts.filter((a) => a.renewal_status === filterStatus)
  }

  // Aplicar filtro de cliente
  if (filterClient !== 'all') {
    alerts = alerts.filter((a) => a.client_id === filterClient)
  }

  // Ordenar por days_until_expiry ASC (mais urgentes primeiro)
  alerts.sort((a, b) => {
    const daysA = a.days_until_expiry ?? Infinity
    const daysB = b.days_until_expiry ?? Infinity
    return daysA - daysB
  })

  // Obter lista única de clientes para filtro
  const uniqueClients = Array.from(
    new Map(
      (renewalAlerts ?? [])
        .filter((a) => a.client_id && a.client_name)
        .map((a) => [a.client_id, { id: a.client_id, name: a.client_name }])
    ).values()
  ).sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))

  // Calculate summary counts
  const summary = {
    expired: alerts.filter((a) => a.renewal_status === 'expired').length,
    critical: alerts.filter((a) => a.renewal_status === 'critical').length,
    warning: alerts.filter((a) => a.renewal_status === 'warning').length,
    attention: alerts.filter((a) => a.renewal_status === 'attention').length,
  }

  const getRenewalConfig = (status: string | null) =>
    RENEWAL_STATUS_CONFIG[status ?? 'ok'] ?? RENEWAL_STATUS_CONFIG['ok']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Renovações</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Contratos vencendo nos próximos 90 dias
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Vencidos" count={summary.expired} statusKey="expired" />
        <SummaryCard label="Crítico ≤30d" count={summary.critical} statusKey="critical" />
        <SummaryCard label="Atenção ≤60d" count={summary.warning} statusKey="warning" />
        <SummaryCard label="Pendente ≤90d" count={summary.attention} statusKey="attention" />
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          Erro ao carregar renovações: {error.message}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          {/* Status Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </label>
            <select
              defaultValue={filterStatus || 'all'}
              onChange={(e) => {
                const newStatus = e.target.value
                const params = new URLSearchParams()
                if (newStatus !== 'all') params.set('status', newStatus)
                if (filterClient !== 'all') params.set('client', filterClient)
                window.location.href = `/renovacoes${params.size > 0 ? '?' + params : ''}`
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              <option value="expired">Vencidos</option>
              <option value="critical">Críticos (≤30d)</option>
              <option value="warning">Atenção (≤60d)</option>
              <option value="attention">Pendentes (≤90d)</option>
            </select>
          </div>

          {/* Client Filter */}
          {uniqueClients.length > 0 && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </label>
              <select
                defaultValue={filterClient || 'all'}
                onChange={(e) => {
                  const newClient = e.target.value
                  const params = new URLSearchParams()
                  if (filterStatus !== 'all') params.set('status', filterStatus)
                  if (newClient !== 'all') params.set('client', newClient)
                  window.location.href = `/renovacoes${params.size > 0 ? '?' + params : ''}`
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Todos</option>
                {uniqueClients.map((client) => (
                  <option key={client.id} value={client.id || ''}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {(filterStatus !== 'all' || filterClient !== 'all') && (
          <a
            href="/renovacoes"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium self-start md:self-auto"
          >
            Limpar filtros
          </a>
        )}
      </div>

      {/* Table or Empty State */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {alerts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Profissional
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Sênioridade
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Vencimento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Dias
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Ação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {alerts.map((alert, idx) => {
                  const config = getRenewalConfig(alert.renewal_status)
                  const days = alert.days_until_expiry ?? 0

                  return (
                    <tr key={alert.id ?? idx} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {alert.name ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {alert.client_name ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {alert.seniority ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {alert.contract_end ? formatDate(alert.contract_end) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium tabular-nums text-gray-900">
                        {days > 0 ? `+${days}` : days}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.textColor}`}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {alert.id && (
                          <Link
                            href={`/profissionais/${alert.id}`}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Ver
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Info */}
      {alerts.length > 0 && (
        <div className="text-sm text-gray-500 text-right">
          Exibindo {alerts.length} renovação{alerts.length !== 1 ? 'ões' : ''}
        </div>
      )}
    </div>
  )
}