'use client'

import { useState, useTransition } from 'react'
import { updateUserPermissionsAction } from '@/app/(dashboard)/area-usuario/gerenciar-usuarios/actions'
import { getDefaultManagerPermissions } from '@/lib/permissions'
import type { UserPermissions } from '@/types/permissions'

interface PermissionsModalProps {
  userId: string
  userName: string
  currentRole: string
  currentPermissions: UserPermissions | null
  onClose: () => void
}

const MODULE_LABELS: Record<string, string> = {
  professionals: 'Profissionais',
  clients:       'Clientes',
  vacations:     'Férias',
  equipment:     'Equipamentos',
  notifications: 'Notificações',
  reports:       'Relatórios',
}

const CRUD_MODULES = ['professionals', 'clients', 'vacations', 'equipment'] as const
const SPECIAL_MODULES = ['notifications', 'reports'] as const

export function PermissionsModal({ userId, userName, currentRole, currentPermissions, onClose }: PermissionsModalProps) {
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState(currentRole)
  const [permissions, setPermissions] = useState<UserPermissions>(
    currentPermissions ?? getDefaultManagerPermissions()
  )
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function togglePermission(module: string, action: string, value: boolean) {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...(prev[module as keyof UserPermissions] ?? {}),
        [action]: value,
      },
    }))
  }

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateUserPermissionsAction(userId, role, permissions)
      if (result.success) {
        setSuccess(true)
        setTimeout(onClose, 800)
      } else {
        setError(result.error ?? 'Erro ao salvar')
      }
    })
  }

  const isGerenteRole = role === 'gerente' || role === 'manager'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Editar Permissões</h2>
            <p className="text-sm text-gray-500 mt-0.5">{userName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Seção: Perfil de Acesso */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Perfil de Acesso</h3>
            <div className="space-y-2">
              {[
                { value: 'admin',   label: 'Administrador', desc: 'Acesso irrestrito a todos os dados e operações' },
                { value: 'gerente', label: 'Gerente',        desc: 'Acesso operacional com permissões granulares' },
                { value: 'consulta',label: 'Consulta',       desc: 'Somente leitura — sem permissões de escrita' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    role === opt.value ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => setRole(opt.value)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{opt.label}</p>
                    <p className="text-xs text-gray-500">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {role === 'admin' && (
              <p className="mt-2 text-xs text-amber-600 bg-amber-50 rounded px-3 py-2">
                ⚠️ Permissões do perfil Admin sobrescrevem configurações granulares.
              </p>
            )}
          </div>

          {/* Seção: Permissões Granulares (só para gerente) */}
          {isGerenteRole && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Permissões por Módulo</h3>

              {/* Módulos CRUD */}
              <div className="space-y-3">
                {CRUD_MODULES.map(mod => {
                  const perms = permissions[mod] ?? {}
                  return (
                    <div key={mod} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-700 mb-2">{MODULE_LABELS[mod]}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['view', 'create', 'edit', 'delete'] as const).map(action => (
                          <label key={action} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!!(perms as Record<string, boolean | undefined>)[action]}
                              onChange={e => togglePermission(mod, action, e.target.checked)}
                              className="accent-indigo-600 w-3.5 h-3.5"
                            />
                            <span className="text-xs text-gray-600 capitalize">
                              {action === 'view' ? 'Ver' : action === 'create' ? 'Criar' : action === 'edit' ? 'Editar' : 'Excluir'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )
                })}

                {/* Módulos especiais */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Outros</p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!(permissions.notifications?.view)}
                        onChange={e => togglePermission('notifications', 'view', e.target.checked)}
                        className="accent-indigo-600 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-gray-600">Notificações (ver)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!(permissions.reports?.export)}
                        onChange={e => togglePermission('reports', 'export', e.target.checked)}
                        className="accent-indigo-600 w-3.5 h-3.5"
                      />
                      <span className="text-xs text-gray-600">Relatórios (exportar)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error/success */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 bg-green-50 rounded px-3 py-2">Permissões salvas com sucesso!</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={isPending || success}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
          >
            {isPending ? 'Salvando...' : 'Salvar Permissões'}
          </button>
        </div>
      </div>
    </div>
  )
}
