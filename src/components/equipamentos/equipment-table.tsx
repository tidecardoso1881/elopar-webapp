'use client'

import { useState, useMemo } from 'react'
import type { Database } from '@/lib/types/database'

type Equipment = Database['public']['Tables']['equipment']['Row']

interface EquipmentTableProps {
  equipment: Equipment[]
}

const MACHINE_TYPE_STYLES: Record<string, { bg: string; label: string }> = {
  Notebook: { bg: 'bg-blue-100 text-blue-700', label: 'Notebook' },
  Desktop: { bg: 'bg-purple-100 text-purple-700', label: 'Desktop' },
  Tablet: { bg: 'bg-orange-100 text-orange-700', label: 'Tablet' },
}

export function EquipmentTable({ equipment }: EquipmentTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [machineTypeFilter, setMachineTypeFilter] = useState('Todos')

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.professional_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.machine_model?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)

      const matchesType =
        machineTypeFilter === 'Todos' || item.machine_type === machineTypeFilter

      return matchesSearch && matchesType
    })
  }, [equipment, searchTerm, machineTypeFilter])

  if (equipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg
          className="h-12 w-12 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17h6m0 0V7m0 10v-2m0 2v-4m0 4H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-500 font-medium">Nenhum equipamento encontrado</p>
        <p className="text-gray-400 text-sm mt-1">Comece adicionando equipamentos ao sistema.</p>
      </div>
    )
  }

  const getMachineTypeBadge = (type: string | null) => {
    if (!type || !MACHINE_TYPE_STYLES[type]) {
      return (
        <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600">
          —
        </span>
      )
    }

    const style = MACHINE_TYPE_STYLES[type]
    return (
      <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${style.bg}`}>
        {style.label}
      </span>
    )
  }

  const getOfficeBadge = (hasOffice: boolean | null) => {
    return (
      <span
        className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
          hasOffice ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {hasOffice ? 'Sim' : 'Não'}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <label htmlFor="equipment-search" className="block text-xs font-medium text-gray-700 mb-1.5">
            Buscar por profissional ou modelo
          </label>
          <input
            id="equipment-search"
            type="text"
            placeholder="Buscar por profissional ou modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-shadow"
            aria-label="Buscar equipamentos por profissional ou modelo"
          />
        </div>

        <div>
          <label htmlFor="machine-type-filter" className="block text-xs font-medium text-gray-700 mb-1.5">
            Tipo de equipamento
          </label>
          <select
            id="machine-type-filter"
            value={machineTypeFilter}
            onChange={(e) => setMachineTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-white transition-shadow"
            aria-label="Filtrar equipamentos por tipo"
          >
            <option value="Todos">Todos</option>
            <option value="Notebook">Notebook</option>
            <option value="Desktop">Desktop</option>
            <option value="Tablet">Tablet</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500">
        Mostrando {filteredEquipment.length} de {equipment.length} equipamento
        {equipment.length !== 1 ? 's' : ''}
      </div>

      {/* Empty state for filters */}
      {filteredEquipment.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-lg border border-gray-200 bg-gray-50">
          <svg
            className="h-10 w-10 text-gray-300 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500 font-medium">Nenhum resultado encontrado</p>
          <p className="text-gray-400 text-sm mt-1">Tente ajustar seus filtros.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" aria-label="Lista de equipamentos">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Profissional
                </th>
                <th scope="col" className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Empresa
                </th>
                <th scope="col" className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Modelo
                </th>
                <th scope="col" className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Office
                </th>
                <th scope="col" className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Software
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredEquipment.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2.5 text-sm font-medium text-gray-900">
                    {item.professional_name}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {item.company ?? '—'}
                  </td>
                  <td className="px-3 py-2.5">{getMachineTypeBadge(item.machine_type)}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-600">
                    {item.machine_model ?? '—'}
                  </td>
                  <td className="px-3 py-2.5">{getOfficeBadge(item.office_package)}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-600 max-w-xs truncate">
                    {item.software_details ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
