import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatting'
import { markAsRead, markAllAsRead } from './actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notificações',
}

const URGENCY_CONFIG: Record<string, { label: string; icon: string; bg: string; border: string; text: string }> = {
  expired: { label: 'Vencido',      icon: '🔴', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700'    },
  critical: { label: '≤30 dias',    icon: '🔴', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700'    },
  warning:  { label: '≤60 dias',    icon: '🟡', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  attention:{ label: '≤90 dias',    icon: '🔵', bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700'   },
}

export default async function NotificacoesPage() {
  const supabase = await createClient()

  const { data: notifications } = await supabase
    .from('contract_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  const all = notifications ?? []
  const unread = all.filter((n) => !n.read_at)
  const read = all.filter((n) => n.read_at)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Notificações</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Alertas de renovação de contrato
          </p>
        </div>
        {unread.length > 0 && (
          <form action={markAllAsRead}>
            <button
              type="submit"
              className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
            >
              Marcar todas como lidas
            </button>
          </form>
        )}
      </div>

      {all.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
          <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="text-gray-500 font-medium">Nenhuma notificação</p>
          <p className="text-gray-400 text-sm mt-1">O job diário cria alertas para contratos vencendo em ≤90 dias.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Não lidas */}
          {unread.length > 0 && (
            <div>
              <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Não lidas ({unread.length})
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {unread.map((n) => {
                  const cfg = URGENCY_CONFIG[n.urgency]
                  return (
                    <li key={n.id} className={`flex items-center justify-between px-4 sm:px-5 py-4 ${cfg.bg}`}>
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-lg mt-0.5 flex-shrink-0">{cfg.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {n.professional_name}
                            {n.client_name && (
                              <span className="font-normal text-gray-500"> — {n.client_name}</span>
                            )}
                          </p>
                          <p className={`text-xs mt-0.5 ${cfg.text}`}>
                            Vence em {n.days_until_expiry} dias
                            {n.renewal_deadline && ` (${formatDate(n.renewal_deadline)})`}
                          </p>
                        </div>
                      </div>
                      <form action={markAsRead.bind(null, n.id)} className="ml-4 flex-shrink-0">
                        <button
                          type="submit"
                          className="text-xs text-gray-500 hover:text-gray-900 border border-gray-300 rounded px-2.5 py-1 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          Marcar como lida
                        </button>
                      </form>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {/* Lidas */}
          {read.length > 0 && (
            <div>
              <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Lidas ({read.length})
                </span>
              </div>
              <ul className="divide-y divide-gray-100">
                {read.map((n) => {
                  const cfg = URGENCY_CONFIG[n.urgency]
                  return (
                    <li key={n.id} className="flex items-center gap-3 px-4 sm:px-5 py-4 opacity-50">
                      <span className="text-base flex-shrink-0">{cfg.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-700">
                          {n.professional_name}
                          {n.client_name && (
                            <span className="text-gray-400"> — {n.client_name}</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Lida em {formatDate(n.read_at)}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
