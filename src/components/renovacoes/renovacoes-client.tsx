'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/formatting'
import { SortableHeader } from '@/components/ui/sortable-header'
import { RenovarModal } from './renovar-modal'

interface RenewalAlert {
  id: string | null
  name: string | null
  seniority: string | null
  status: string | null
  contract_end: string | null
  renewal_deadline?: string | null
  client_name: string | null
  client_id: string | null
  days_until_expiry: number | null
  renewal_status: string | null
}

interface RenovacoesClientProps {
  alerts: RenewalAlert[]
  totalOriginal: number
  renewalStatusConfig: Record<string, { bg: string; textColor: string; label: string; bgLight: string }>
}

export function RenovacoesClient({
  alerts,
  totalOriginal,
  renewalStatusConfig,
}: RenovacoesClientProps) {
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState<string>('days_until_expiry')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [activeModal, setActiveModal] = useState<{
    id: string
    name: string
    deadline: string | null
  } | null>(null)
  const [renewedMap, setRenewedMap] = useState<Record<string, string>>({})

  const handleSort = (col: string) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    let result = alerts
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = alerts.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.client_name?.toLowerCase().includes(q)
      )
    }

    // Apply sorting
    const sorted = [...result].sort((a, b) => {
      let aVal: any
      let bVal: any

      switch (sortCol) {
        case 'name':
          aVal = a.name ?? ''
          bVal = b.name ?? ''
          break
        case 'client_name':
          aVal = a.client_name ?? ''
          bVal = b.client_name ?? ''
          break
        case 'contract_end':
          aVal = a.contract_end ? new Date(a.contract_end).getTime() : 0
          bVal = b.contract_end ? new Date(b.contract_end).getTime() : 0
          break
        case 'days_until_expiry':
          aVal = a.days_until_expiry ?? 999999
          bVal = b.days_until_expiry ?? 999999
          break
        default:
          return 0
      }

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [alerts, search, sortCol, sortDir])

  const getRenewalConfig = (status: string | null) =>
    renewalStatusConfig[status ?? 'ok'] ?? renewalStatusConfig['ok']

  const handleRenewSuccess = (id: string, newDate: string) => {
    setRenewedMap((prev) => ({ ...prev, [id]: newDate }))
  }

  return (
    <>
      {/* Barra de busca */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou cliente..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {filtered.length} de {totalOriginal} profissionais
        </span>
      </div>

      {/* Tabela */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
          <p className="text-sm">Nenhum resultado para &quot;{search}&quot;</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50">
                <SortableHeader col="name" label="Profissional" sortBy={sortCol} sortDir={sortDir} onClick={handleSort} />
                <SortableHeader col="client_name" label="Cliente" sortBy={sortCol} sortDir={sortDir} onClick={handleSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Sênioridade</th>
                <SortableHeader col="contract_end" label="Vencimento" sortBy={sortCol} sortDir={sortDir} onClick={handleSort} />
                <SortableHeader col="days_until_expiry" label="Dias" sortBy={sortCol} sortDir={sortDir} onClick={handleSort} />
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((alert, idx) => {
                const config = getRenewalConfig(alert.renewal_status)
                const days = renewedMap[alert.id ?? ''] ? null : alert.days_until_expiry ?? 0
                const isRenewed = !!renewedMap[alert.id ?? '']

                return (
                  <tr
                    key={alert.id ?? idx}
                    className={`transition-colors hover:bg-gray-50 ${isRenewed ? 'bg-green-50/40' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-gray-900">{alert.name ?? '—'}</span>
                      {isRenewed && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Renovado ✓
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{alert.client_name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{alert.seniority ?? '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {isRenewed
                        ? formatDate(renewedMap[alert.id ?? ''])
                        : alert.contract_end
                          ? formatDate(alert.contract_end)
                          : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium tabular-nums text-gray-900">
                      {isRenewed ? '—' : days !== null && (days > 0 ? `+${days}` : days)}
                    </td>
                    <td className="px-4 py-3">
                      {!isRenewed && (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.textColor}`}
                        >
                          {config.label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {alert.id && (
                          <Link
                            href={`/profissionais/${alert.id}`}
                            title="Ver perfil"
                            className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                        )}
                        {alert.id && !isRenewed && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveModal({
                                id: alert.id!,
                                name: alert.name ?? '',
                                deadline: alert.contract_end ?? null,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Renovar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de renovação */}
      {activeModal && (
        <RenovarModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          onSuccess={handleRenewSuccess}
          professionalId={activeModal.id}
          professionalName={activeModal.name}
          currentDeadline={activeModal.deadline}
        />
      )}
    </>
  )
}
