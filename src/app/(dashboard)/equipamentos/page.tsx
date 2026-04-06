import { createClient } from '@/lib/supabase/server'
import { EquipmentTable } from '@/components/equipamentos/equipment-table'
import type { Database } from '@/lib/types/database'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Equipamentos',
}

type Equipment = Database['public']['Tables']['equipment']['Row']

export default async function EquipamentosPage() {
  const supabase = await createClient()

  const { data: equipmentData, error } = await supabase
    .from('equipment')
    .select('*')

  const equipment = (equipmentData ?? []) as Equipment[]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Equipamentos</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          {equipment.length > 0
            ? `${equipment.length} equipamento${equipment.length !== 1 ? 's' : ''} cadastrado${equipment.length !== 1 ? 's' : ''}`
            : 'Nenhum equipamento cadastrado'}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="px-5 py-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          Erro ao carregar equipamentos: {error.message}
        </div>
      )}

      {/* Table */}
      <EquipmentTable equipment={equipment} />
    </div>
  )
}