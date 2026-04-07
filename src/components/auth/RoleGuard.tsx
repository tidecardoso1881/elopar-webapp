import type { UserRole } from '@/types/roles'

interface RoleGuardProps {
  role: string | null | undefined
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Renders children only if the user's role is in allowedRoles.
 * Works in both Server and Client Components (pure conditional render, no hooks).
 */
export function RoleGuard({ role, allowedRoles, children, fallback = null }: RoleGuardProps) {
  if (!role || !allowedRoles.includes(role as UserRole)) {
    return <>{fallback}</>
  }
  return <>{children}</>
}
