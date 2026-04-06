import { createClient } from '@/lib/supabase/server'
import { FeriasView } from '@/components/ferias/ferias-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Férias',
}

type Vacation = {
  id: string
  client_area: string | null
  leadership: string | null
  professional_name: string
  admission_date: string | null
  acquisition_start: string | null
  acquisition_end: string | null
  concession_start: string | null
  concession_end: string | null
  days_balance: number
  vacation_start: string | null
  vacation_end: string | null
  bonus_days: number
  total_days: number
  created_at: string
}

export default async function FeriasPage() {
  const supabase = await createClient()

  const { data: vacations, error } = await supabase
    .from('vacations')
    .select('*')
    .order('professional_name')

  const vacationsData = (vacations ?? []) as Vacation[]

  return (
    <div className="space-y-6">
      {error && (
        <div className="px-4 sm:px-5 py-4 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          Erro ao carregar férias: {error.message}
        </div>
      )}
      <FeriasView vacations={vacationsData} />
    </div>
  )
}