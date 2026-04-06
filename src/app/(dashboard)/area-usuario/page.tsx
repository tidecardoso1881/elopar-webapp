import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Área do Usuário',
}

export default async function AreaUsuarioPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-600 font-semibold">Acesso negado</p>
        <p className="text-gray-500 text-sm mt-2">Você precisa estar autenticado para acessar esta página.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Área do Usuário</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-2">Acesso a ferramentas e dashboards administrativos.</p>
      </div>

      {/* Admin Only Links */}
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
      </div>
    </div>
  )
}
