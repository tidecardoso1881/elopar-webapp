import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Área do Usuário',
}

function getRoleLabel(role: string | null): string {
  switch (role) {
    case 'admin':   return 'Administrador'
    case 'manager': return 'Gerente'
    default:        return role ?? 'Usuário'
  }
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('')
  }
  return (email[0] ?? 'U').toUpperCase()
}

export default async function AreaUsuarioPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const initials = getInitials(profile?.full_name ?? null, user.email ?? '')
  const displayName = profile?.full_name ?? user.email ?? 'Usuário'

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Área do Usuário</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Gerencie seu perfil e configurações pessoais</p>
      </div>

      {/* Profile card */}
      <div className="rounded-xl p-6 text-white shadow-lg bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold truncate">{displayName}</h2>
            <p className="text-indigo-200 text-sm mt-0.5 truncate">{user.email}</p>
            <div className="mt-3">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold text-white">
                {getRoleLabel(profile?.role ?? null)}
              </span>
            </div>
          </div>
          <div
            className="flex-shrink-0 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white select-none"
            aria-hidden="true"
          >
            {initials}
          </div>
        </div>
      </div>


      {/* Config placeholder */}
      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Configurações
        </h2>
        <p className="text-sm text-gray-400 italic">
          Edição de perfil e preferências — disponível em breve.
        </p>
      </div>
    </div>
  )
}
