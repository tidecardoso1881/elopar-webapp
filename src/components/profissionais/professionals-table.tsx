import Link from 'next/link'
import { formatDate, getRenewalStatus } from '@/lib/utils/formatting'

interface Professional {
  id: string
  os: number | null
  name: string
  position: string | null
  seniority: string | null
  status: string
  contract_type: string | null
  renewal_deadline: string | null
  client: { name: string } | null
}

interface ProfessionalsTableProps {
  professionals: Professional[]
}

const STATUS_STYLES: Record<string, string> = {
  ATIVO: 'bg-green-100 text-green-700',
  INATIVO: 'bg-gray-100 text-gray-500',
}

const CONTRACT_TYPE_STYLES: Record<string, string> = {
  CLT_ESTRATEGICO: 'bg-purple-100 text-purple-700',
  CLT_ILAED: 'bg-blue-100 text-blue-700',
  PJ: 'bg-orange-100 text-orange-700',
}

const SENIORITY_LABELS: Record<string, string> = {
  JUNIOR: 'Júnior',
  PLENO: 'Pleno',
  SENIOR: 'Sênior',
  ESPECIALISTA: 'Especialista',
}

const RENEWAL_STYLES: Record<string, { bg: string; label: string }> = {
  expired:   { bg: 'bg-red-100 text-red-700',    label: 'Vencido' },
  critical:  { bg: 'bg-red-50 text-red-600',     label: '≤30d' },
  warning:   { bg: 'bg-orange-100 text-orange-700', label: '≤60d' },
  attention: { bg: 'bg-yellow-100 text-yellow-700', label: '≤90d' },
  ok:        { bg: 'bg-green-50 text-green-600',  label: 'OK' },
  none:      { bg: 'bg-gray-100 text-gray-400',   label: '—' },
}

export function ProfessionalsTable({ professionals }: ProfessionalsTableProps) {
  if (professionals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-gray-500 font-medium">Nenhum profissional encontrado</p>
        <p className="text-gray-400 text-sm mt-1">Tente ajustar os filtros ou verificar se o seed foi executado.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm" aria-label="Lista de profissionais">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">OS</th>
            <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
            <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Cargo / Senioridade</th>
            <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Cliente</th>
            <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Tipo</th>
            <th scope="col" className="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Renovação</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {professionals.map((p) => {
            const renewal = getRenewalStatus(p.renewal_deadline)
            const renewalStyle = RENEWAL_STYLES[renewal]
            return (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-400 tabular-nums">
                  {p.os ?? '—'}
                </td>
                <td className="px-2 sm:px-4 py-3">
                  <Link
                    href={`/profissionais/${p.id}`}
                    className="text-xs sm:text-sm font-medium text-gray-900 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-1 transition-colors"
                    aria-label={`${p.name} - ver detalhes`}
                  >
                    {p.name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-gray-700">{p.position ?? '—'}</span>
                    {p.seniority && (
                      <span className="text-xs text-gray-500">{SENIORITY_LABELS[p.seniority] ?? p.seniority}</span>
                    )}
                  </div>
                </td>
                <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                  {p.client?.name ?? '—'}
                </td>
                <td className="px-2 sm:px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[p.status] ?? 'bg-gray-100 text-gray-500'}`} aria-label={`Status: ${p.status}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {p.contract_type ? (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${CONTRACT_TYPE_STYLES[p.contract_type] ?? 'bg-gray-100 text-gray-500'}`}>
                      {p.contract_type === 'CLT_ESTRATEGICO' ? 'CLT Estratégico' : p.contract_type === 'CLT_ILAED' ? 'CLT ILAED' : p.contract_type}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>
                <td className="px-2 sm:px-4 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-gray-500">{formatDate(p.renewal_deadline)}</span>
                    <span className={`inline-flex w-fit items-center rounded px-1.5 py-0.5 text-xs font-medium ${renewalStyle.bg}`} aria-label={`Situação de renovação: ${renewalStyle.label}`}>
                      {renewalStyle.label}
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
