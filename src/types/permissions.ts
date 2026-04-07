export type PermissionModule =
  | 'professionals'
  | 'clients'
  | 'vacations'
  | 'equipment'
  | 'notifications'
  | 'reports'

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'export'

export interface ModulePermissions {
  professionals?: { view?: boolean; create?: boolean; edit?: boolean; delete?: boolean }
  clients?: { view?: boolean; create?: boolean; edit?: boolean; delete?: boolean }
  vacations?: { view?: boolean; create?: boolean; edit?: boolean; delete?: boolean }
  equipment?: { view?: boolean; create?: boolean; edit?: boolean; delete?: boolean }
  notifications?: { view?: boolean }
  reports?: { export?: boolean }
}

export interface UserPermissions extends ModulePermissions {}

export interface PermissionProfile {
  id: string
  full_name: string | null
  role: string
  permissions?: UserPermissions | null
}
