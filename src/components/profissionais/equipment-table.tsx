import Link from 'next/link'
import { SortableHeader } from '@/components/ui/sortable-header'

interface Equipment {
  id: string
  professional_name: string
  company: string | null
  machine_type: string | null
  machine_model: string | null
  office_package: boolean | null
}

interface EquipmentTableProps {
  equipments: Equipment[]
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  buildSortUrl?: (col: string, dir: 'asc' | 'desc') => string
}

export function EquipmentTable({ equipments, sortBy, sortDir, buildSortUrl }: EquipmentTableProps) {
  if (equipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
        </svg>
        <p className="text-gray-500 font-medium">Nenhum equipamento encontrado</p>
        <p className="text-gray-400 text-sm mt-1">Tente ajustar os filtros ou cadastre um novo equipamento.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <SortableHeader col="professional_name" label="Profissional" sortBy={sortBy} sortDir={sortDir} buildSortUrl={buildSortUrl} />
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Empresa</th>
            <SortableHeader col="machine_type" label="Tipo" sortBy={sortBy} sortDir={sortDir} buildSortUrl={buildSortUrl} />
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modelo</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Office</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {equipments.map((e) => (
            <tr key={e.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <Link
                  href={`/equipamentos/${e.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                >
                  {e.professional_name}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {e.company ?? '—'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {e.machine_type ?? '—'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {e.machine_model ?? '—'}
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${e.office_package ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {e.office_package ? 'Sim' : 'Não'}
                </span>
              </td>
              <td className="px-4 py-3 text-sm">
                <Link
                  href={`/equipamentos/${e.id}`}
                  className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
