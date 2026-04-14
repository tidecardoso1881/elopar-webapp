import { createClient } from '@/lib/supabase/server'
import { RenovacoesClient } from '@/components/renovacoes/renovacoes-client'
import { RenovacoesFilters } from '@/components/renovacoes/renovacoes-filters'

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
  invalid: {
    bg: 'bg-gray-100',
    textColor: 'text-gray-400',
    bgLight: 'bg-gray-50',
    label: 'Data não informada',
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
    <div className={`rounded-lg border ${config.bgLight} p-4 hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-3">
        {/* Indicador de urgência — cor sem número */}
        <div className={`rounded-full ${config.bg} w-11 h-11 flex-shrink-0`} />
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

  // BUG-02: Deduplicar por professional_id — cada profissional aparece exatamente 1x
  const seenIds = new Set<string>()
  alerts = alerts.filter((a) => {
    if (!a.id) return false
    if (seenIds.has(a.id)) return false
    seenIds.add(a.id)
    return true
  })

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Renovações</h1>
        <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
          Contratos vencendo nos próximos 90 dias
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

      {/* Filters — Client Component (usa onChange + window) */}
      <RenovacoesFilters
        filterStatus={filterStatus}
        filterClient={filterClient}
        uniqueClients={uniqueClients}
      />

      {/* Table — Client Component com busca + modal de renovar */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden p-4 space-y-4">
        {alerts.length === 0 ? (
          <EmptyState />
        ) : (
          <RenovacoesClient
            alerts={alerts}
            totalOriginal={alerts.length}
            renewalStatusConfig={RENEWAL_STATUS_CONFIG}
          />
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
