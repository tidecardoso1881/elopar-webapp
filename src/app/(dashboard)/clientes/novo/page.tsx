import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
import { ClientForm } from '@/components/clientes/client-form'
import { createClientAction } from '@/actions/clients'

export default async function NovoClientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!canWrite(profile?.role)) redirect('/clientes')
  return (
    <div className="space-y-6 max-w-xl">
      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Link href="/clientes" className="hover:text-gray-600 transition-colors">
            Clientes
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600">Novo Cliente</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">Novo Cliente</h1>
        <p className="text-sm text-gray-500 mt-0.5">Cadastre um novo cliente no sistema.</p>
      </div>

      <ClientForm
        action={createClientAction}
        submitLabel="Criar Cliente"
        cancelHref="/clientes"
      />
    </div>
  )
}
