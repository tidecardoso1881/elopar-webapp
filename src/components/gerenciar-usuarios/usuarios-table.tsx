'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils/formatting'
import { NovoUsuarioModal } from './novo-usuario-modal'
import { DesativarUsuarioModal } from './desativar-usuario-modal'
import { reactivateUserAction, resendInviteAction } from '@/app/(dashboard)/area-usuario/gerenciar-usuarios/actions'

export type UserStatus = 'ativo' | 'pendente' | 'desativado'

export interface UserRow {
  id: string
  email: string
  full_name: string | null
  role: string
  status: UserStatus
  created_at: string
  last_sign_in_at: string | null
}

interface Props {
  users: UserRow[]
  currentUserId: string
}

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-blue-100 text-blue-800',
  manager: 'bg-green-100 text-green-700',
}

const STATUS_DOT: Record<UserStatus, string> = {
  ativo: 'bg-green-400',
  pendente: 'bg-amber-400',
  desativado: 'bg-gray-300',
}

const STATUS_LABEL: Record<UserStatus, string> = {
  ativo: 'Ativo',
  pendente: 'Convite enviado',
  desativado: 'Desativado',
}

type TabFilter = 'todos' | UserStatus

function initials(name: string | null, email: string) {
  const src = name ?? email
  return src.substring(0, 2).toUpperCase()
}

export function UsuariosTable({ users, currentUserId }: Props) {
  const [tab, setTab] = useState<TabFilter>('todos')
  const [search, setSearch] = useState('')
  const [showNovo, setShowNovo] = useState(false)
  const [deactivating, setDeactivating] = useState<UserRow | null>(null)
  const [pendingAction, setPendingAction] = useState<string | null>(null)

  const counts = {
    todos: users.length,
    ativo: users.filter(u => u.status === 'ativo').length,
    pendente: users.filter(u => u.status === 'pendente').length,
    desativado: users.filter(u => u.status === 'desativado').length,
  }

  const filtered = users.filter(u => {
    if (tab !== 'todos' && u.status !== tab) return false
    if (search) {
      const q = search.toLowerCase()
      return (u.full_name ?? '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    }
    return true
  })

  async function handleReactivate(userId: string) {
    setPendingAction(userId)
    await reactivateUserAction(userId)
    setPendingAction(null)
  }

  async function handleResendInvite(email: string, userId: string) {
    setPendingAction(userId)
    await resendInviteAction(email)
    setPendingAction(null)
  }

  const tabs: { key: TabFilter; label: string }[] = [
    { key: 'todos', label: `Todos (${counts.todos})` },
    { key: 'ativo', label: `Ativos (${counts.ativo})` },
    { key: 'pendente', label: `Pendentes (${counts.pendente})` },
    { key: 'desativado', label: `Desativados (${counts.desativado})` },
  ]

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[
          { label: 'Total de Usuários', value: counts.todos, color: 'text-blue-600' },
          { label: 'Ativos', value: counts.ativo, color: 'text-green-600' },
          { label: 'Convite Pendente', value: counts.pendente, color: 'text-amber-500' },
          { label: 'Desativados', value: counts.desativado, color: 'text-red-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 px-4 py-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowNovo(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
        >
          <span>+</span> Novo Usuário
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-900">Usuários do sistema</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 w-52 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">Nenhum usuário encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  {['Usuário', 'Perfil', 'Status', 'Criado em', 'Último acesso', 'Ações'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(u => {
                  const isSelf = u.id === currentUserId
                  const isLoading = pendingAction === u.id
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {initials(u.full_name, u.email)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{u.full_name ?? '—'}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-500'}`}>
                          {u.role === 'admin' ? 'Admin' : 'Manager'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-sm text-gray-600">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[u.status]}`} />
                          {STATUS_LABEL[u.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(u.created_at)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {u.last_sign_in_at ? formatDate(u.last_sign_in_at) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {u.status === 'pendente' && (
                            <button
                              onClick={() => handleResendInvite(u.email, u.id)}
                              disabled={isLoading}
                              title="Reenviar convite"
                              className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 transition-colors"
                            >
                              {isLoading ? '...' : '📧'}
                            </button>
                          )}
                          {u.status === 'desativado' && (
                            <button
                              onClick={() => handleReactivate(u.id)}
                              disabled={isLoading}
                              title="Reativar usuário"
                              className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-500 hover:border-green-400 hover:text-green-600 disabled:opacity-40 transition-colors"
                            >
                              {isLoading ? '...' : '✅'}
                            </button>
                          )}
                          {u.status !== 'desativado' && (
                            <button
                              onClick={() => !isSelf && setDeactivating(u)}
                              disabled={isSelf || isLoading}
                              title={isSelf ? 'Não é possível desativar o próprio usuário' : 'Desativar usuário'}
                              className="border border-gray-200 rounded-md px-2 py-1 text-xs text-gray-500 hover:border-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                              🚫
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
      </div>

      {showNovo && <NovoUsuarioModal onClose={() => setShowNovo(false)} />}
      {deactivating && (
        <DesativarUsuarioModal
          userId={deactivating.id}
          userName={deactivating.full_name ?? deactivating.email}
          onClose={() => setDeactivating(null)}
        />
      )}
    </>
  )
}
