import { createClient } from '@/lib/supabase/server'
import { VacationActions } from '@/components/profissionais/ferias/vacation-actions'
import { formatDate } from '@/lib/utils/formatting'
import { notFound } from 'next/navigation'

interface VacationDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VacationDetailPage({ params }: VacationDetailPageProps) {
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
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{vacation.professional_name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Detalhes do registro de férias</p>
        </div>
        <div className="flex gap-2">
          <VacationActions id={vacation.id} name={vacation.professional_name} />
        </div>
      </div>

      {/* Informações Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Identificação</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Nome</p>
              <p className="text-sm text-gray-900 font-medium mt-1">{vacation.professional_name}</p>
            </div>
            {vacation.admission_date && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Data de Admissão</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(vacation.admission_date)}</p>
              </div>
            )}
            {vacation.leadership && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Liderança</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{vacation.leadership}</p>
              </div>
            )}
            {vacation.client_area && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Área / Cliente</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{vacation.client_area}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Período Aquisitivo</h2>
          <div className="space-y-4">
            {vacation.acquisition_start ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Início</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(vacation.acquisition_start)}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Início</p>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>
            )}
            {vacation.acquisition_end ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Fim</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(vacation.acquisition_end)}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Fim</p>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Período de Gozo</h2>
          <div className="space-y-4">
            {vacation.concession_start ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Concessão Início</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(vacation.concession_start)}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Concessão Início</p>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>
            )}
            {vacation.concession_end ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Concessão Fim</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(vacation.concession_end)}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Concessão Fim</p>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>
            )}
            {vacation.vacation_start ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Férias Início</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(vacation.vacation_start)}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Férias Início</p>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>
            )}
            {vacation.vacation_end ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Férias Fim</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(vacation.vacation_end)}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Férias Fim</p>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-5">Dados Complementares</h2>
          <div className="space-y-4">
            {vacation.total_days !== null ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Total de Dias</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{vacation.total_days}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Total de Dias</p>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>
            )}
            {vacation.bonus_days !== null ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Dias Bônus</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{vacation.bonus_days}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Dias Bônus</p>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>
            )}
            {vacation.days_balance !== null ? (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Saldo de Dias</p>
                <p className="text-sm text-gray-900 font-medium mt-1">{vacation.days_balance}</p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Saldo de Dias</p>
                <p className="text-sm text-gray-400 mt-1">—</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
