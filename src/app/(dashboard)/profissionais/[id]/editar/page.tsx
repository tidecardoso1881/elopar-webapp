import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ProfessionalForm } from '@/components/profissionais/professional-form'
import { updateProfessional } from '@/actions/professionals'
import { ActionResult } from '@/actions/professionals'

interface EditarProfissionalPageProps {
  params: Promise<{ id: string }>
}

export default async function EditarProfissionalPage({ params }: EditarProfissionalPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: professional, error }, { data: clients }] = await Promise.all([
    supabase.from('professionals').select('*').eq('id', id).single(),
    supabase.from('clients').select('id, name').order('name'),
  ])

  if (error || !professional) {
    notFound()
  }

  // Bind the id to the server action using a bound function
  async function updateProfessionalWithId(
    prevState: ActionResult,
    formData: FormData
  ): Promise<ActionResult> {
    'use server'
    return updateProfessional(id, prevState, formData)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Link href="/profissionais" className="hover:text-gray-600 transition-colors">
            Profissionais
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/profissionais/${id}`} className="hover:text-gray-600 transition-colors">
            {professional.name}
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600">Editar</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Editar Profissional</h1>
            <p className="text-sm text-gray-500 mt-0.5">{professional.name}</p>
          </div>
          <Link
            href={`/profissionais/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>
        </div>
      </div>

      <ProfessionalForm
        action={updateProfessionalWithId}
        clients={clients ?? []}
        defaultValues={professional}
        submitLabel="Salvar Alterações"
        cancelHref={`/profissionais/${id}`}
      />
    </div>
  )
}
