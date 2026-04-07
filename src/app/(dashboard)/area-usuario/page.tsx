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

interface ToolCardProps {
  href: string
  icon: string
  title: string
  description: string
  badge: string
  badgeColor: string
}

function ToolCard({ href, icon, title, description, badge, badgeColor }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-5 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${badgeColor}`}>
          {badge}
        </span>
        <span className="text-blue-600 text-sm font-medium group-hover:underline">Acessar →</span>
      </div>
    </Link>
  )
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

  const isAdmin = profile?.role === 'admin'
  const showMetrics = user.email === process.env.METRICS_ALLOWED_EMAIL
  const initials = getInitials(profile?.full_name ?? null, user.email ?? '')
  const displayName = profile?.full_name ?? user.email ?? 'Usuário'

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Área do Usuário</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Hub de ferramentas administrativas</p>
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

      {/* Tool cards */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Ferramentas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToolCard
            href="/area-usuario/saude-testes"
            icon="🏥"
            title="Saúde dos Testes"
            description="Acompanhe cobertura de código, testes de integração e E2E em tempo real."
            badge="Visível a todos"
            badgeColor="bg-green-100 text-green-800"
          />

          {isAdmin && (
            <ToolCard
              href="/area-usuario/gerenciar-usuarios"
              icon="👤"
              title="Gerenciar Usuários"
              description="Convide novos usuários, gerencie acessos e perfis do sistema."
              badge="Admin"
              badgeColor="bg-blue-100 text-blue-800"
            />
          )}

          {isAdmin && (
            <ToolCard
              href="/area-usuario/audit-log"
              icon="🔍"
              title="Logs de Auditoria"
              description="Histórico de todas as operações de criação, edição e exclusão no sistema."
              badge="Admin"
              badgeColor="bg-blue-100 text-blue-800"
            />
          )}

          {showMetrics && (
            <ToolCard
              href="/area-usuario/metricas"
              icon="📊"
              title="Métricas Kanban"
              description="Dashboard operacional — Lead Time, Cycle Time, WIP e Throughput do processo de dev."
              badge="Owner"
              badgeColor="bg-purple-100 text-purple-800"
            />
          )}
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
