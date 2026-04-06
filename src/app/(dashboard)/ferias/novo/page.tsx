import { VacationForm } from '@/components/profissionais/ferias/vacation-form'
import { createVacation } from '@/actions/vacations'

export default function NovaFeriasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Novo Registro de Férias</h1>
        <p className="text-sm text-gray-500 mt-0.5">Preencha os dados para registrar um novo período de férias.</p>
      </div>

      <VacationForm action={createVacation} submitLabel="Criar Registro" cancelHref="/ferias" />
    </div>
  )
}
