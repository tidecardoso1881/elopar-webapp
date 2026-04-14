import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/formatting'
import { markAsRead, markAllAsRead, markSistemaAsRead } from './actions'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notificações',
}

interface SistemaNotif {
  id: string
  user_id: string
  tipo: string
  mensagem: string
  link: string | null
  lida: boolean
  criado_em: string
}

const URGENCY_CONFIG: Record<string, { label: string; icon: string; bg: string; border: string; text: string }> = {
  expired: { label: 'Vencido',      icon: '🔴', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700'    },
  critical: { label: '≤30 dias',    icon: '🔴', bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-700'    },
  warning:  { label: '≤60 dias',    icon: '🟡', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  attention:{ label: '≤90 dias',    icon: '🔵', bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700'   },
}

const TIPO_LABELS: Record<string, { label: string; icon: string }> = {
  mention:          { label: 'Menção',          icon: '💬' },
  user_invited:     { label: 'Novo usuário',    icon: '👤' },
  user_deactivated: { label: 'Desativação',     icon: '⛔' },
}

interface SearchParams {
  tipo?: string
}

interface NotificacoesPageProps {
  searchParams: Promise<SearchParams>
}

export default async function NotificacoesPage({ searchParams }: NotificacoesPageProps) {
  const supabase = await createClient()
  const params = await searchParams
  const tipoFilter = params.tipo ?? ''

  // Renovações de contrato
  const { data: contractNotifs } = await supabase
    .from('contract_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  // Notificações do sistema (tabela não está nos tipos gerados ainda — cast necessário)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabaseAny = supabase as any
  let sistemaQuery = supabaseAny
    .from('notifications')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(100)

  if (tipoFilter) sistemaQuery = sistemaQuery.eq('tipo', tipoFilter)

  const { data: sistemaNotifs } = await sistemaQuery as { data: SistemaNotif[] | null }

  const allContracts = contractNotifs ?? []
  const unreadContracts = allContracts.filter((n) => !n.read_at)
  const readContracts = allContracts.filter((n) => n.read_at)

  const allSistema = sistemaNotifs ?? []
  const unreadSistema = allSistema.filter((n) => !n.lida)

  const totalUnread = unreadContracts.length + unreadSistema.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Notificações</h1>
          <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
            Alertas do sistema e renovações de contrato
          </p>
        </div>
        {totalUnread > 0 && (
          <div className="flex gap-2">
            {unreadSistema.length > 0 && (
              <form action={markSistemaAsRead}>
                <button
                  type="submit"
                  className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
                >
                  Marcar sistema como lidas
                </button>
              </form>
            )}
            {unreadContracts.length > 0 && (
              <form action={markAllAsRead}>
                <button
                  type="submit"
                  className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1"
                >
                  Marcar renovações como lidas
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Seção: Notificações do Sistema */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sistema {unreadSistema.length > 0 && `(${unreadSistema.length} não lidas)`}
          </span>
          {/* Filtro por tipo */}
          <form method="get" className="flex items-center gap-2">
            <select
              name="tipo"
              defaultValue={tipoFilter}
              className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os tipos</option>
              <option value="mention">Menções</option>
              <option value="user_invited">Novos usuários</option>
              <option value="user_deactivated">Desativações</option>
            </select>
            <button type="submit" className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              Filtrar
            </button>
            {tipoFilter && (
              <a href="/notificacoes" className="px-2 py-1 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Limpar
              </a>
            )}
          </form>
        </div>

        {allSistema.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400">
            Nenhuma notificação do sistema.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {allSistema.map((n) => {
              const tipoInfo = TIPO_LABELS[n.tipo] ?? { label: n.tipo, icon: '🔔' }
              return (
                <li key={n.id} className={`flex items-start justify-between px-4 sm:px-5 py-3 ${n.lida ? 'opacity-60' : 'bg-indigo-50/40'}`}>
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-base mt-0.5 flex-shrink-0">{tipoInfo.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-indigo-700 mb-0.5">{tipoInfo.label}</p>
                      <p className="text-sm text-gray-800">{n.mensagem}</p>
                      {n.link && (
                        <a href={n.link} className="text-xs text-blue-600 hover:underline mt-0.5 inline-block">
                          Ver →
                        </a>
                      )}
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(n.criado_em)}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Seção: Renovações de Contrato */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Renovações de contrato {unreadContracts.length > 0 && `(${unreadContracts.length} não lidas)`}
          </span>
        </div>

        {allContracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg className="h-10 w-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-gray-500 font-medium text-sm">Nenhuma renovação pendente</p>
            <p className="text-gray-400 text-xs mt-1">O job diário cria alertas para contratos vencendo em ≤90 dias.</p>
          </div>
        ) : (
          <>
            {unreadContracts.length > 0 && (
              <div>
                <div className="px-4 sm:px-5 py-2 bg-gray-50/50 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-400">Não lidas ({unreadContracts.length})</span>
                </div>
                <ul className="divide-y divide-gray-100">
                  {unreadContracts.map((n) => {
                    const cfg = URGENCY_CONFIG[n.urgency]
                    return (
                      <li key={n.id} className={`flex items-center justify-between px-4 sm:px-5 py-4 ${cfg.bg}`}>
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="text-lg mt-0.5 flex-shrink-0">{cfg.icon}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {n.professional_name}
                              {n.client_name && <span className="font-normal text-gray-500"> — {n.client_name}</span>}
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
            {readContracts.length > 0 && (
              <div>
                <div className="px-4 sm:px-5 py-2 bg-gray-50/50 border-b border-gray-100">
                  <span className="text-xs font-medium text-gray-400">Lidas ({readContracts.length})</span>
                </div>
                <ul className="divide-y divide-gray-100">
                  {readContracts.map((n) => {
                    const cfg = URGENCY_CONFIG[n.urgency]
                    return (
                      <li key={n.id} className="flex items-center gap-3 px-4 sm:px-5 py-4 opacity-50">
                        <span className="text-base flex-shrink-0">{cfg.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm text-gray-700">
                            {n.professional_name}
                            {n.client_name && <span className="text-gray-400"> — {n.client_name}</span>}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">Lida em {formatDate(n.read_at)}</p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
