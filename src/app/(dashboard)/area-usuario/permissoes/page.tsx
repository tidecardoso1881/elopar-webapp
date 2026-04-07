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
