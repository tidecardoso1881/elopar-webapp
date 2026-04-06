'use client'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuditLogDiffProps {
  entidadeId: string
  dadosAntes: Record<string, unknown> | null
  dadosDepois: Record<string, unknown> | null
  onClose: () => void
}

// ─── Field label mapping (snake_case → PT-BR) ─────────────────────────────────

const FIELD_LABELS: Record<string, string> = {
  id: 'ID',
  name: 'Nome',
  email: 'E-mail',
  status: 'Status',
  position: 'Cargo',
  seniority: 'Senioridade',
  profile: 'Perfil',
  manager: 'Gestor',
  contact: 'Contato',
  os: 'OS',
  contract_type: 'Tipo de Contrato',
  client_id: 'Cliente (ID)',
  date_start: 'Data Início',
  date_end: 'Data Fim',
  contract_start: 'Início Contrato',
  contract_end: 'Fim Contrato',
  renewal_deadline: 'Prazo de Renovação',
  hourly_rate: 'Taxa Hora',
  value_clt: 'Valor CLT',
  value_strategic: 'Valor Estratégico',
  hours_worked: 'Horas Trabalhadas',
  payment_value: 'Valor Pagamento',
  other_values: 'Outros Valores',
  billing_rate: 'Taxa Cobrança',
  renewal_billing: 'Cobrança Renovação',
  total_billing: 'Total Faturamento',
  updated_at: 'Atualizado em',
  created_at: 'Criado em',
  professional_name: 'Nome do Profissional',
  company: 'Empresa',
  machine_type: 'Tipo de Máquina',
  machine_model: 'Modelo da Máquina',
  office_package: 'Pacote Office',
  software_details: 'Softwares',
  admission_date: 'Data de Admissão',
  acquisition_start: 'Início Aquisição',
  acquisition_end: 'Fim Aquisição',
  concession_start: 'Início Concessão',
  concession_end: 'Fim Concessão',
  vacation_start: 'Início Férias',
  vacation_end: 'Fim Férias',
  total_days: 'Total de Dias',
  bonus_days: 'Dias Bônus',
  days_balance: 'Saldo de Dias',
  leadership: 'Liderança',
  client_area: 'Área do Cliente',
}

function getLabel(key: string): string {
  return FIELD_LABELS[key] ?? key.replace(/_/g, ' ')
}

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return '—'
  const s = String(v)
  return s.length > 100 ? s.slice(0, 97) + '...' : s
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AuditLogDiff({ entidadeId, dadosAntes, dadosDepois, onClose }: AuditLogDiffProps) {
  // Collect all keys from both objects
  const allKeys = new Set([
    ...Object.keys(dadosAntes ?? {}),
    ...Object.keys(dadosDepois ?? {}),
  ])

  // Find changed fields only
  const changedFields: { key: string; antes: unknown; depois: unknown }[] = []
  for (const key of allKeys) {
    const antes = dadosAntes?.[key] ?? null
    const depois = dadosDepois?.[key] ?? null
    // Skip if both null/undefined or identical
    if (antes === depois) continue
    if (JSON.stringify(antes) === JSON.stringify(depois)) continue
    changedFields.push({ key, antes, depois })
  }

  const shortId = entidadeId.slice(0, 8)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Diff — <span className="font-mono text-sm text-gray-500">{shortId}…</span>
            </h2>
            {changedFields.length === 0 ? (
              <p className="text-xs text-gray-400 mt-0.5">Nenhuma alteração detectada</p>
            ) : (
              <p className="text-xs text-gray-400 mt-0.5">
                {changedFields.length} campo{changedFields.length !== 1 ? 's' : ''} alterado{changedFields.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[60vh]">
          {changedFields.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">
              {dadosAntes === null && dadosDepois === null
                ? 'Sem dados disponíveis para comparação.'
                : 'Nenhum campo foi alterado.'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 w-1/4">Campo</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-red-500 w-[37.5%]">Antes</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-green-600 w-[37.5%]">Depois</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {changedFields.map(({ key, antes, depois }) => {
                  const isAdded = antes === null
                  const isRemoved = depois === null
                  return (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-700 font-medium text-xs">
                        {getLabel(key)}
                      </td>
                      <td className="px-4 py-2.5">
                        {!isAdded ? (
                          <span className="inline-block rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-700 font-mono break-all">
                            {formatValue(antes)}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        {!isRemoved ? (
                          <span className="inline-block rounded bg-green-50 px-1.5 py-0.5 text-xs text-green-700 font-mono break-all">
                            {formatValue(depois)}
                          </span>
                        ) : (
                          <span className="text-gray-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
