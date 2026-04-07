import { createClient } from '@/lib/supabase/server'

interface ProfessionalHistoricoProps {
  profissionalId: string
}

type AcaoType = 'CREATE' | 'UPDATE' | 'DELETE'

const ACAO_CONFIG: Record<AcaoType, { label: string; icon: string; color: string; dotColor: string; borderColor: string }> = {
  CREATE: {
    label: 'Profissional criado',
    icon: '➕',
    color: 'text-green-700',
    dotColor: 'bg-green-500',
    borderColor: 'border-l-green-500',
  },
  UPDATE: {
    label: 'Dados alterados',
    icon: '✏️',
    color: 'text-indigo-700',
    dotColor: 'bg-indigo-500',
    borderColor: 'border-l-indigo-500',
  },
  DELETE: {
    label: 'Profissional removido',
    icon: '🗑️',
    color: 'text-red-700',
    dotColor: 'bg-red-500',
    borderColor: 'border-l-red-500',
  },
}

const FIELD_LABELS: Record<string, string> = {
  name: 'Nome',
  status: 'Status',
  position: 'Cargo',
  seniority: 'Senioridade',
  contract_type: 'Tipo de Contrato',
  date_start: 'Data Início',
  date_end: 'Data Fim',
  contract_start: 'Início Contrato',
  contract_end: 'Fim Contrato',
  renewal_deadline: 'Renovação',
  client_id: 'Cliente',
  email: 'E-mail',
  contact: 'Contato',
  manager: 'Gestor',
  hourly_rate: 'Taxa Hora',
  value_clt: 'Valor CLT',
  value_strategic: 'Valor Estratégico',
  hours_worked: 'Horas Trabalhadas',
  payment_value: 'Valor Pagamento',
  billing_rate: 'Taxa de Cobrança',
  total_billing: 'Total Faturamento',
  os: 'OS',
  profile: 'Perfil',
}

function formatRelativeTime(iso: string): string {
  const now = new Date()
  const date = new Date(iso)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffWeek = Math.floor(diffDay / 7)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffDay / 365)

  if (diffSec < 60) return 'agora mesmo'
  if (diffMin < 60) return `há ${diffMin} minuto${diffMin !== 1 ? 's' : ''}`
  if (diffHour < 24) return `há ${diffHour} hora${diffHour !== 1 ? 's' : ''}`
  if (diffDay < 7) return `há ${diffDay} dia${diffDay !== 1 ? 's' : ''}`
  if (diffWeek < 4) return `há ${diffWeek} semana${diffWeek !== 1 ? 's' : ''}`
  if (diffMonth < 12) return `há ${diffMonth} mês${diffMonth !== 1 ? 'es' : ''}`
  return `há ${diffYear} ano${diffYear !== 1 ? 's' : ''}`
}

function formatFullDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined) return '(não definido)'
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não'
  if (typeof value === 'number') return String(value)
  if (typeof value === 'string') {
    // Detect date-like strings
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      try {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(value))
      } catch {
        return value
      }
    }
    return value
  }
  return JSON.stringify(value)
}

function calculateDiff(
  before: Record<string, unknown> | null,
  after: Record<string, unknown> | null
): Array<{ field: string; before: unknown; after: unknown }> {
  const b = before ?? {}
  const a = after ?? {}
  const ignoredKeys = ['id', 'updated_at', 'created_at']
  const allKeys = new Set([...Object.keys(b), ...Object.keys(a)].filter(k => !ignoredKeys.includes(k)))
  const changes: Array<{ field: string; before: unknown; after: unknown }> = []
  allKeys.forEach(key => {
    const bVal = b[key]
    const aVal = a[key]
    if (JSON.stringify(bVal) !== JSON.stringify(aVal)) {
      changes.push({ field: key, before: bVal, after: aVal })
    }
  })
  return changes
}

export async function ProfessionalHistorico({ profissionalId }: ProfessionalHistoricoProps) {
  const supabase = await createClient()

  const { data: logs } = await supabase
    .from('audit_log')
    .select('id, acao, dados_antes, dados_depois, criado_em, user_id')
    .eq('entidade', 'professional')
    .eq('entidade_id', profissionalId)
    .order('criado_em', { ascending: false })
    .limit(20)

  // Fetch user names
  const userIds = [...new Set((logs ?? []).map(l => l.user_id))]
  const profileMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds)
    for (const p of profiles ?? []) {
      profileMap[p.id] = p.full_name ?? '(usuário)'
    }
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        Nenhum histórico de alterações registrado para este profissional.
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Linha vertical da timeline */}
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" aria-hidden="true" />

      <ol className="space-y-4">
        {logs.map((log) => {
          const acao = (log.acao as AcaoType) in ACAO_CONFIG ? (log.acao as AcaoType) : 'UPDATE'
          const config = ACAO_CONFIG[acao]
          const before = log.dados_antes as Record<string, unknown> | null
          const after = log.dados_depois as Record<string, unknown> | null
          const diff = calculateDiff(before, after)
          const userName = profileMap[log.user_id] ?? '(usuário)'
          const relTime = formatRelativeTime(log.criado_em)
          const fullTime = formatFullDateTime(log.criado_em)

          let summary: string
          if (acao === 'CREATE') summary = `Registro inicial com ${Object.keys(after ?? {}).length} campos`
          else if (acao === 'DELETE') summary = 'Profissional removido do sistema'
          else summary = `Alterou ${diff.length} campo${diff.length !== 1 ? 's' : ''}`

          return (
            <li key={log.id} className="relative pl-10">
              {/* Dot na linha */}
              <div className={`absolute left-2.5 top-3 w-3 h-3 rounded-full ${config.dotColor} ring-2 ring-white -translate-x-1/2`} />

              {/* Card */}
              <div className={`bg-white rounded-lg border border-l-4 border-gray-200 ${config.borderColor} shadow-sm`}>
                <details>
                  <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-t-lg select-none list-none">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-base flex-shrink-0" role="img" aria-label={config.label}>{config.icon}</span>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
                        <p className="text-xs text-gray-500 truncate">
                          por <span className="font-medium text-gray-700">{userName}</span>
                          {' · '}{summary}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-500" title={fullTime}>{relTime}</p>
                      <p className="text-xs text-gray-400">{fullTime}</p>
                    </div>
                  </summary>

                  {/* Diff expandível */}
                  <div className="border-t border-gray-100 px-4 py-3">
                    {acao === 'CREATE' && after && (
                      <div className="space-y-1.5">
                        {Object.entries(after)
                          .filter(([k]) => !['id', 'created_at', 'updated_at'].includes(k))
                          .slice(0, 10)
                          .map(([key, val]) => (
                            <div key={key} className="flex gap-2 text-xs">
                              <span className="font-medium text-gray-500 w-36 flex-shrink-0">
                                {FIELD_LABELS[key] ?? key}
                              </span>
                              <span className="text-green-700">{formatFieldValue(val)}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    {acao === 'DELETE' && before && (
                      <div className="space-y-1.5">
                        {Object.entries(before)
                          .filter(([k]) => !['id', 'created_at', 'updated_at'].includes(k))
                          .slice(0, 10)
                          .map(([key, val]) => (
                            <div key={key} className="flex gap-2 text-xs">
                              <span className="font-medium text-gray-500 w-36 flex-shrink-0">
                                {FIELD_LABELS[key] ?? key}
                              </span>
                              <span className="text-red-600 line-through">{formatFieldValue(val)}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    {acao === 'UPDATE' && (
                      diff.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">Nenhuma diferença detectada.</p>
                      ) : (
                        <div className="space-y-2">
                          {diff.map(({ field, before: bVal, after: aVal }) => (
                            <div key={field} className="text-xs">
                              <span className="font-medium text-gray-600 block mb-0.5">
                                {FIELD_LABELS[field] ?? field}
                              </span>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded line-through">
                                  {formatFieldValue(bVal)}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className="px-1.5 py-0.5 bg-green-50 text-green-700 rounded">
                                  {formatFieldValue(aVal)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </details>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
