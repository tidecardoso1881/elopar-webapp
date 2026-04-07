import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { canWrite } from '@/types/roles'
import { ClientForm } from '@/components/clientes/client-form'
import { updateClientAction, type ClientActionResult } from '@/actions/clients'

interface EditarClientePageProps {
  params: Promise<{ id: string }>
}

export default async function EditarClientePage({ params }: EditarClientePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!canWrite(profile?.role)) redirect('/clientes')

  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !client) {
    notFound()
  }

  async function updateWithId(
    prevState: ClientActionResult,
    formData: FormData
  ): Promise<ClientActionResult> {
    'use server'
    return updateClientAction(id, prevState, formData)
  }

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
          <span className="text-gray-600">Editar — {client.name}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Editar Cliente</h1>
            <p className="text-sm text-gray-500 mt-0.5">{client.name}</p>
          </div>
          <Link
            href="/clientes"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
        </div>
      </div>

      <ClientForm
        action={updateWithId}
        defaultName={client.name}
        submitLabel="Salvar Alterações"
        cancelHref="/clientes"
      />
    </div>
  )
}
