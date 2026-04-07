'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { updateUserPermissionsAction } from '@/app/(dashboard)/area-usuario/gerenciar-usuarios/actions'
import { getDefaultManagerPermissions } from '@/lib/permissions'
import type { UserPermissions } from '@/types/permissions'

interface UserRow {
  id: string
  email: string
  full_name: string | null
  role: string
  permissions: UserPermissions | null
}

const CRUD_MODULES = [
  { key: 'professionals', label: 'Profissionais' },
  { key: 'clients',       label: 'Clientes' },
  { key: 'vacations',     label: 'Férias' },
  { key: 'equipment',     label: 'Equipamentos' },
] as const

const CRUD_ACTIONS = [
  { key: 'view',   label: 'Ver' },
  { key: 'create', label: 'Criar' },
  { key: 'edit',   label: 'Editar' },
  { key: 'delete', label: 'Excluir' },
] as const

const ROLE_BADGE: Record<string, string> = {
  admin:    'bg-purple-100 text-purple-700',
  gerente:  'bg-blue-100 text-blue-700',
  consulta: 'bg-gray-100 text-gray-600',
}

const ROLE_LABEL: Record<string, string> = {
  admin:    'Administrador',
  gerente:  'Gerente',
  consulta: 'Consulta',
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function PermissionsMatrix({ users }: { users: UserRow[] }) {
  const [permsMap, setPermsMap] = useState<Record<string, UserPermissions>>(() => {
    const map: Record<string, UserPermissions> = {}
    for (const u of users) {
      if (u.role === 'gerente') {
        map[u.id] = u.permissions ?? getDefaultManagerPermissions()
      }
    }
    return map
  })

  const [saveState, setSaveState] = useState<Record<string, SaveState>>({})
  const debounceRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const permsRef = useRef(permsMap)

  useEffect(() => {
    permsRef.current = permsMap
  }, [permsMap])

  const scheduleSave = useCallback((userId: string) => {
    if (debounceRef.current[userId]) clearTimeout(debounceRef.current[userId])
    setSaveState(s => ({ ...s, [userId]: 'saving' }))
    debounceRef.current[userId] = setTimeout(async () => {
      const perms = permsRef.current[userId]
      const result = await updateUserPermissionsAction(userId, 'gerente', perms)
      setSaveState(s => ({ ...s, [userId]: result.success ? 'saved' : 'error' }))
      setTimeout(() => setSaveState(s => ({ ...s, [userId]: 'idle' })), 2000)
    }, 500)
  }, [])

  const handleToggle = useCallback((userId: string, mod: string, action: string, value: boolean) => {
    setPermsMap(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [mod]: {
          ...(prev[userId]?.[mod as keyof UserPermissions] as Record<string, boolean> ?? {}),
          [action]: value,
        },
      },
    }))
    scheduleSave(userId)
  }, [scheduleSave])

  const handleClone = useCallback(async (targetId: string, sourceId: string) => {
    const sourcePerms = permsRef.current[sourceId]
    if (!sourcePerms) return
    const cloned = { ...sourcePerms }
    setPermsMap(prev => ({ ...prev, [targetId]: cloned }))
    setSaveState(s => ({ ...s, [targetId]: 'saving' }))
    const result = await updateUserPermissionsAction(targetId, 'gerente', cloned)
    setSaveState(s => ({ ...s, [targetId]: result.success ? 'saved' : 'error' }))
    setTimeout(() => setSaveState(s => ({ ...s, [targetId]: 'idle' })), 2000)
  }, [])

  const gerenteUsers = users.filter(u => u.role === 'gerente')
  const otherUsers   = users.filter(u => u.role !== 'gerente')

  return (
    <div className="space-y-6">
      {/* Outros roles — badges resumo */}
      {otherUsers.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            Outros usuários (permissões fixas)
          </p>
          <div className="flex flex-wrap gap-2">
            {otherUsers.map(u => (
              <span
                key={u.id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${ROLE_BADGE[u.role] ?? 'bg-gray-100 text-gray-600'}`}
              >
                {u.full_name ?? u.email}
                <span className="opacity-60">· {ROLE_LABEL[u.role] ?? u.role}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Matriz de permissões — gerentes */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Permissões granulares — Gerentes
        </p>
        {gerenteUsers.length === 0 ? (
          <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4">
            Nenhum usuário com role Gerente cadastrado.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 min-w-[180px]">Usuário</th>
                  {CRUD_MODULES.map(mod => (
                    <th key={mod.key} colSpan={4} className="text-center px-2 py-3 font-semibold text-gray-700 border-l border-gray-200">
                      {mod.label}
                    </th>
                  ))}
                  <th colSpan={2} className="text-center px-2 py-3 font-semibold text-gray-700 border-l border-gray-200">
                    Outros
                  </th>
                  <th className="px-4 py-3 border-l border-gray-200 min-w-[120px]" />
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-normal">
                  <th className="px-4 py-1.5" />
                  {CRUD_MODULES.flatMap(mod =>
                    CRUD_ACTIONS.map((action, i) => (
                      <th key={`${mod.key}-${action.key}`} className={`text-center px-1 py-1.5 ${i === 0 ? 'border-l border-gray-200' : ''}`}>
                        {action.label}
                      </th>
                    ))
                  )}
                  <th className="text-center px-1 py-1.5 border-l border-gray-200">Notif.</th>
                  <th className="text-center px-1 py-1.5">Export.</th>
                  <th className="px-4 py-1.5 border-l border-gray-200" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {gerenteUsers.map(u => {
                  const perms = permsMap[u.id] ?? getDefaultManagerPermissions()
                  const state = saveState[u.id] ?? 'idle'
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 truncate max-w-[160px]">
                          {u.full_name ?? u.email}
                        </p>
                        {u.full_name && (
                          <p className="text-gray-400 truncate max-w-[160px]">{u.email}</p>
                        )}
                      </td>
                      {CRUD_MODULES.flatMap((mod, mi) =>
                        CRUD_ACTIONS.map((action, ai) => {
                          const modPerms = perms[mod.key as keyof UserPermissions] as Record<string, boolean> | undefined
                          return (
                            <td
                              key={`${u.id}-${mod.key}-${action.key}`}
                              className={`text-center px-1 py-3 ${ai === 0 && mi === 0 ? 'border-l border-gray-200' : ai === 0 ? 'border-l border-gray-200' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={!!(modPerms?.[action.key])}
                                onChange={e => handleToggle(u.id, mod.key, action.key, e.target.checked)}
                                disabled={state === 'saving'}
                                className="accent-indigo-600 w-3.5 h-3.5 cursor-pointer disabled:cursor-wait"
                              />
                            </td>
                          )
                        })
                      )}
                      {/* Notificações */}
                      <td className="text-center px-1 py-3 border-l border-gray-200">
                        <input
                          type="checkbox"
                          checked={!!(perms.notifications?.view)}
                          onChange={e => handleToggle(u.id, 'notifications', 'view', e.target.checked)}
                          disabled={state === 'saving'}
                          className="accent-indigo-600 w-3.5 h-3.5 cursor-pointer disabled:cursor-wait"
                        />
                      </td>
                      {/* Relatórios */}
                      <td className="text-center px-1 py-3">
                        <input
                          type="checkbox"
                          checked={!!(perms.reports?.export)}
                          onChange={e => handleToggle(u.id, 'reports', 'export', e.target.checked)}
                          disabled={state === 'saving'}
                          className="accent-indigo-600 w-3.5 h-3.5 cursor-pointer disabled:cursor-wait"
                        />
                      </td>
                      {/* Ações */}
                      <td className="px-4 py-3 border-l border-gray-200 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {state === 'saving' && (
                            <span className="text-gray-400 text-xs animate-pulse">Salvando…</span>
                          )}
                          {state === 'saved' && (
                            <span className="text-green-600 text-xs font-medium">✓ Salvo</span>
                          )}
                          {state === 'error' && (
                            <span className="text-red-600 text-xs font-medium">✗ Erro</span>
                          )}
                          {gerenteUsers.length > 1 && (
                            <select
                              className="text-xs border border-gray-200 rounded px-1.5 py-0.5 text-gray-600 hover:border-gray-300 transition-colors"
                              defaultValue=""
                              onChange={e => {
                                if (e.target.value) {
                                  void handleClone(u.id, e.target.value)
                                  e.target.value = ''
                                }
                              }}
                            >
                              <option value="" disabled>Clonar de…</option>
                              {gerenteUsers
                                .filter(g => g.id !== u.id)
                                .map(g => (
                                  <option key={g.id} value={g.id}>
                                    {g.full_name ?? g.email}
                                  </option>
                                ))
                              }
                            </select>
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
    </div>
  )
}
