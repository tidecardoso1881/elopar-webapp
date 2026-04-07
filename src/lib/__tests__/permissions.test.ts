import { describe, it, expect } from 'vitest'
import { hasPermission, getDefaultManagerPermissions } from '@/lib/permissions'
import type { PermissionProfile } from '@/types/permissions'

const admin: PermissionProfile = {
  id: '1',
  full_name: 'Admin',
  role: 'admin',
  permissions: {},
}

const gerente: PermissionProfile = {
  id: '2',
  full_name: 'Gerente',
  role: 'gerente',
  permissions: {
    professionals: { view: true, create: true, edit: false, delete: false },
    clients: { view: true, create: false, edit: false, delete: false },
    notifications: { view: true },
    reports: { export: true },
  },
}

const gerenteSemPermissoes: PermissionProfile = {
  id: '3',
  full_name: 'Gerente sem permissoes',
  role: 'gerente',
  permissions: {},
}

const consulta: PermissionProfile = {
  id: '4',
  full_name: 'Consulta',
  role: 'consulta',
  permissions: {},
}

describe('hasPermission', () => {
  it('admin sempre tem permissao', () => {
    expect(hasPermission(admin, 'professionals', 'delete')).toBe(true)
    expect(hasPermission(admin, 'reports', 'export')).toBe(true)
    expect(hasPermission(admin, 'clients', 'create')).toBe(true)
  })

  it('gerente com permissao retorna true', () => {
    expect(hasPermission(gerente, 'professionals', 'view')).toBe(true)
    expect(hasPermission(gerente, 'professionals', 'create')).toBe(true)
    expect(hasPermission(gerente, 'notifications', 'view')).toBe(true)
    expect(hasPermission(gerente, 'reports', 'export')).toBe(true)
  })

  it('gerente sem permissao retorna false', () => {
    expect(hasPermission(gerente, 'professionals', 'edit')).toBe(false)
    expect(hasPermission(gerente, 'professionals', 'delete')).toBe(false)
    expect(hasPermission(gerente, 'clients', 'create')).toBe(false)
  })

  it('gerente sem modulo retorna false', () => {
    expect(hasPermission(gerenteSemPermissoes, 'professionals', 'view')).toBe(false)
    expect(hasPermission(gerenteSemPermissoes, 'reports', 'export')).toBe(false)
  })

  it('role consulta sempre retorna false', () => {
    expect(hasPermission(consulta, 'professionals', 'view')).toBe(false)
    expect(hasPermission(consulta, 'clients', 'view')).toBe(false)
  })

  it('null profile retorna false', () => {
    expect(hasPermission(null, 'professionals', 'view')).toBe(false)
    expect(hasPermission(undefined, 'clients', 'create')).toBe(false)
  })
})

describe('getDefaultManagerPermissions', () => {
  it('retorna objeto com todos os modulos', () => {
    const perms = getDefaultManagerPermissions()
    expect(perms.professionals).toBeDefined()
    expect(perms.clients).toBeDefined()
    expect(perms.vacations).toBeDefined()
    expect(perms.equipment).toBeDefined()
    expect(perms.notifications).toBeDefined()
    expect(perms.reports).toBeDefined()
  })

  it('gerente padrao pode ver mas nao criar profissionais', () => {
    const perms = getDefaultManagerPermissions()
    expect(perms.professionals?.view).toBe(true)
    expect(perms.professionals?.create).toBe(false)
  })

  it('gerente padrao pode criar ferias', () => {
    const perms = getDefaultManagerPermissions()
    expect(perms.vacations?.create).toBe(true)
    expect(perms.vacations?.edit).toBe(true)
  })
})
