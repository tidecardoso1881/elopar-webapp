import Link from 'next/link'
import { formatDate } from '@/lib/utils/formatting'
import { SortableHeader } from '@/components/ui/sortable-header'
import { VacationActions } from './vacation-actions'

interface Vacation {
  id: string
  professional_name: string
  acquisition_start: string | null
  acquisition_end: string | null
  vacation_start: string | null
  vacation_end: string | null
  total_days: number | null
  days_balance: number | null
  leadership: string | null
  client_area: string | null
}

interface VacationTableProps {
  vacations: Vacation[]
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  buildSortUrl?: (col: string, dir: 'asc' | 'desc') => string
}

function getVacationStatus(vacationStart: string | null) {
  if (!vacationStart) return { label: '—', color: 'bg-gray-100 text-gray-600' }

  const startDate = new Date(vacationStart)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (startDate < today) {
    return { label: 'Realizado', color: 'bg-green-100 text-green-700' }
  } else {
    return { label: 'Agendado', color: 'bg-blue-100 text-blue-700' }
  }
}

export function VacationTable({ vacations, sortBy, sortDir, buildSortUrl }: VacationTableProps) {
  if (vacations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 font-medium">Nenhuma férias encontrada</p>
        <p className="text-gray-400 text-sm mt-1">Tente ajustar os filtros ou cadastre um novo registro.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <SortableHeader col="professional_name" label="Profissional" sortBy={sortBy} sortDir={sortDir} buildSortUrl={buildSortUrl} />
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Período Aquisitivo</th>
            <SortableHeader col="vacation_start" label="Férias" sortBy={sortBy} sortDir={sortDir} buildSortUrl={buildSortUrl} />
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Dias</th>
            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Saldo</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {vacations.map((v) => {
            const status = getVacationStatus(v.vacation_start)
            return (
              <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/ferias/${v.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    {v.professional_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {v.acquisition_start && v.acquisition_end
                    ? `${formatDate(v.acquisition_start)} a ${formatDate(v.acquisition_end)}`
                    : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {v.vacation_start && v.vacation_end
                    ? `${formatDate(v.vacation_start)} a ${formatDate(v.vacation_end)}`
                    : '—'}
                </td>
                <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  {v.total_days ?? '—'}
                </td>
                <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                  {v.days_balance ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <VacationActions id={v.id} name={v.professional_name} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
