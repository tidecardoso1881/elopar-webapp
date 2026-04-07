export type UserRole = 'admin' | 'gerente' | 'consulta'

export const ROLE_LABELS: Record<UserRole, string> = {
  admin:    'Administrador',
  gerente:  'Gerente',
  consulta: 'Consulta',
}

export function canWrite(role: UserRole | string | null | undefined): boolean {
  return role === 'admin' || role === 'gerente'
}

export function isAdminRole(role: UserRole | string | null | undefined): boolean {
  return role === 'admin'
}

export function getRoleLabel(role: string | null | undefined): string {
  if (role === 'admin') return 'Administrador'
  if (role === 'gerente' || role === 'manager') return 'Gerente'
  if (role === 'consulta') return 'Consulta'
  return role ?? 'Usuário'
}
