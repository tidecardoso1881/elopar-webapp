import type { PermissionProfile, PermissionModule, PermissionAction } from '@/types/permissions'

/**
 * Verifica se um usuário tem permissão para uma ação em um módulo.
 *
 * Regras de precedência:
 * 1. role === 'admin' → sempre true
 * 2. role === 'gerente' → verifica campo permissions (granular)
 * 3. Outros roles (consulta, etc.) → false para qualquer ação além de visualização implícita
 */
export function hasPermission(
  profile: PermissionProfile | null | undefined,
  module: PermissionModule,
  action: PermissionAction
): boolean {
  if (!profile) return false

  if (profile.role === 'admin') return true

  if (profile.role === 'gerente' || profile.role === 'manager') {
    const modulePerms = profile.permissions?.[module]
    if (!modulePerms) return false

    if (module === 'notifications') {
      return (modulePerms as { view?: boolean }).view === true
    }
    if (module === 'reports') {
      return (modulePerms as { export?: boolean }).export === true
    }

    const perms = modulePerms as { view?: boolean; create?: boolean; edit?: boolean; delete?: boolean }
    if (action === 'view')   return perms.view === true
    if (action === 'create') return perms.create === true
    if (action === 'edit')   return perms.edit === true
    if (action === 'delete') return perms.delete === true
  }

  return false
}

/**
 * Permissões padrão para um novo Gerente.
 */
export function getDefaultManagerPermissions(): NonNullable<PermissionProfile['permissions']> {
  return {
    professionals: { view: true, create: false, edit: false, delete: false },
    clients:       { view: true, create: false, edit: false, delete: false },
    vacations:     { view: true, create: true,  edit: true,  delete: false },
    equipment:     { view: true, create: false, edit: false, delete: false },
    notifications: { view: true },
    reports:       { export: true },
  }
}
