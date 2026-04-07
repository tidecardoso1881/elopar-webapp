---
id: TICKET-E1-J
ep: EP-NEW-009
para: Especialista 1
branch: feat/ep-009-permissoes-ui
arquivos:
  - src/app/(dashboard)/area-usuario/permissoes/page.tsx (criar)
  - src/components/permissoes/permissions-matrix.tsx (criar)
  - src/app/(dashboard)/area-usuario/gerenciar-usuarios/page.tsx (editar — adicionar link)
status: pending
---

# E1-J — Página Matriz de Permissões (EP-009)

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-009-permissoes-ui
mkdir -p src/app/\(dashboard\)/area-usuario/permissoes src/components/permissoes
```

---

## Arquivo 1 — `src/app/(dashboard)/area-usuario/permissoes/page.tsx` (CRIAR)

```tsx
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { PermissionsMatrix } from '@/components/permissoes/permissions-matrix'
import type { Metadata } from 'next'
import type { UserPermissions } from '@/types/permissions'

export const metadata: Metadata = { title: 'Gestão de Permissões' }

export default async function PermissoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/area-usuario')

  const admin = createAdminClient()
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 200 })

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, permissions')

  const profilesMap = new Map((profiles ?? []).map(p => [p.id, p]))

  const users = authUsers.map(u => {
    const p = profilesMap.get(u.id)
    return {
      id: u.id,
      email: u.email ?? '',
      full_name: p?.full_name ?? null,
      role: (p?.role ?? 'consulta') as string,
      permissions: (p?.permissions as UserPermissions | null) ?? null,
    }
  }).sort((a, b) => {
    const order: Record<string, number> = { admin: 0, gerente: 1, consulta: 2 }
    return (order[a.role] ?? 9) - (order[b.role] ?? 9)
  })

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        <a href="/area-usuario" className="hover:text-blue-600 transition-colors">Área do Usuário</a>
        <span className="mx-1.5 text-gray-300">/</span>
        <a href="/area-usuario/gerenciar-usuarios" className="hover:text-blue-600 transition-colors">Gerenciar Usuários</a>
        <span className="mx-1.5 text-gray-300">/</span>
        <span className="text-gray-700 font-medium">Permissões</span>
      </p>
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Gestão de Permissões</h1>
        <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
          Visualize e edite permissões granulares dos usuários com role Gerente.
        </p>
      </div>
      <PermissionsMatrix users={users} />
    </div>
  )
}
```

---

## Arquivo 2 — `src/components/permissoes/permissions-matrix.tsx` (CRIAR)

```tsx
'use client'

import { useState, useCallback, useRef } from 'react'
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
  permsRef.current = permsMap

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
```

---

## Arquivo 3 — `src/app/(dashboard)/area-usuario/gerenciar-usuarios/page.tsx` (EDITAR)

Localizar o bloco do header da página (logo após o `<h1>`) e adicionar o link:

```tsx
{/* Adicionar após o <p> de descrição existente: */}
<div className="mt-3">
  <a
    href="/area-usuario/permissoes"
    className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
  >
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
    Ver matriz de permissões →
  </a>
</div>
```

---

```bash
npx tsc --noEmit
npm run lint
git add src/app/\(dashboard\)/area-usuario/permissoes/ src/components/permissoes/ src/app/\(dashboard\)/area-usuario/gerenciar-usuarios/page.tsx
git commit -m "feat(EP-009): página matriz de permissões com checkboxes inline e clonar

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin feat/ep-009-permissoes-ui
```

Abrir PR: `feat(EP-009): gestão de permissões granular — matriz inline`

**DoD:**
1. Página `/area-usuario/permissoes/` acessível somente para admin, matriz renderiza gerentes com checkboxes funcionais, tsc + lint sem erros
2. `NOTE_e1j_done.md` criado com número do PR
