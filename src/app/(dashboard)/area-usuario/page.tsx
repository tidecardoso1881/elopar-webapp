import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Área do Usuário',
}

export default async function AreaUsuarioPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'
  const showMetrics = user.email === process.env.METRICS_ALLOWED_EMAIL

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Área do Usuário</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">Acesso a ferramentas e dashboards administrativos.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/area-usuario/saude-testes"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">🏥 Saúde dos Testes</h3>
              <p className="text-sm text-gray-600 mt-2">
                Acompanhe a cobertura de código, testes de integração e E2E em tempo real.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">Admin</span>
            <span className="text-blue-600 font-semibold text-sm">Acessar →</span>
          </div>
        </Link>

        {isAdmin && (
          <Link
            href="/area-usuario/gerenciar-usuarios"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">👤 Gerenciar Usuários</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Crie novos usuários, gerencie acessos e perfis do sistema.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">Admin</span>
              <span className="text-blue-600 font-semibold text-sm">Acessar →</span>
            </div>
          </Link>
        )}

        {isAdmin && (
          <Link
            href="/area-usuario/audit-log"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">🔍 Logs de Auditoria</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Histórico de todas as operações de criação, edição e exclusão no sistema.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">Admin</span>
              <span className="text-blue-600 font-semibold text-sm">Acessar →</span>
            </div>
          </Link>
        )}
        {showMetrics && (
          <Link
            href="/area-usuario/metricas"
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">📊 Métricas Kanban</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Dashboard operacional do processo de desenvolvimento — Lead Time, Cycle Time, WIP e Throughput.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">Owner</span>
              <span className="text-blue-600 font-semibold text-sm">Acessar →</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
