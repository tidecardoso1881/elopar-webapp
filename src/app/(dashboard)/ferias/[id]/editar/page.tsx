import { createClient } from '@/lib/supabase/server'
import { VacationForm } from '@/components/profissionais/ferias/vacation-form'
import { updateVacation } from '@/actions/vacations'
import { notFound } from 'next/navigation'

interface EditFeriasPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditFeriasPage({ params }: EditFeriasPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: vacation, error } = await supabase
    .from('vacations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !vacation) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Editar Férias</h1>
        <p className="text-sm text-gray-500 mt-0.5">Atualize os dados do registro de férias de {vacation.professional_name}.</p>
      </div>

      <VacationForm
        action={updateVacation(id)}
        defaultValues={vacation}
        submitLabel="Atualizar Registro"
        cancelHref={`/ferias/${id}`}
      />
    </div>
  )
}
