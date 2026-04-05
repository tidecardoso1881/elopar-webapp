import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatting'

interface RenewalAlert {
  id: string
  name: string
  email: string | null
  profile: string | null
  seniority: string | null
  status: string
  contract_end: string
  renewal_deadline: string | null
  client_name: string
  client_id: string
  days_until_expiry: number
  renewal_status: 'expired' | 'critical' | 'warning' | 'attention' | 'ok'
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

export default async function RenovacoesPage(_props: RenovacoesPageProps) {
  const supabase = await createClient()

  const { data: renewalAlerts, error } = await supabase
    .from('v_renewal_alerts')
    .select('*')

  const alerts: RenewalAlert[] = renewalAlerts ?? []

  // Calculate summary counts
  const summary = {
    expired: alerts.filter((a) => a.renewal_status === 'expired').length,
    critical: alerts.filter((a) => a.renewal_status === 'critical').length,
    warning: alerts.filter((a) => a.renewal_status === 'warning').length,
    attention: alerts.filter((a) => a.renewal_status === 'attention').length,
  }

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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {alerts.map((alert) => {
                  const config = RENEWAL_STATUS_CONFIG[alert.renewal_status]
                  const daysDisplay = alert.days_until_expiry < 0
                    ? alert.days_until_expiry
                    : alert.days_until_expiry

                  return (
                    <tr key={alert.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          {alert.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {alert.client_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {alert.seniority ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(alert.contract_end)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium tabular-nums text-gray-900">
                        {daysDisplay > 0 ? `+${daysDisplay}` : daysDisplay}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.textColor}`}
                        >
                          {config.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}