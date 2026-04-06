'use client'

import { useState, useMemo } from 'react'

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

interface FeriasViewProps {
  vacations: Vacation[]
}

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function getVacationStatus(vacationStart: string | null, vacationEnd: string | null): 'Em andamento' | 'Agendado' | 'Concluído' | 'Pendente' {
  if (!vacationStart) {
    return 'Pendente'
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const startDate = new Date(vacationStart)
  startDate.setHours(0, 0, 0, 0)

  const endDate = vacationEnd ? new Date(vacationEnd) : null
  if (endDate) {
    endDate.setHours(0, 0, 0, 0)
  }

  if (endDate && today > endDate) {
    return 'Concluído'
  }

  if (today >= startDate && endDate && today <= endDate) {
    return 'Em andamento'
  }

  if (today < startDate) {
    return 'Agendado'
  }

  return 'Pendente'
}

function getStatusBadgeColor(status: string): string {
  switch (status) {
    case 'Em andamento':
      return 'bg-green-100 text-green-700'
    case 'Agendado':
      return 'bg-blue-100 text-blue-700'
    case 'Concluído':
      return 'bg-gray-100 text-gray-600'
    case 'Pendente':
      return 'bg-yellow-100 text-yellow-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) {
    return '—'
  }
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

function formatDateRange(startString: string | null, endString: string | null): string {
  if (!startString) {
    return '—'
  }
  const start = formatDate(startString)
  if (!endString) {
    return `${start} → —`
  }
  const end = formatDate(endString)
  return `${start} → ${end}`
}

function getProfessionalsInMonth(vacations: Vacation[], monthIndex: number, year: number): Array<{ name: string; status: 'Em andamento' | 'Agendado' | 'Concluído' | 'Pendente' }> {
  const monthStart = new Date(year, monthIndex, 1)
  const monthEnd = new Date(year, monthIndex + 1, 0)

  return vacations
    .filter((v) => {
      if (!v.vacation_start) return false

      const vStart = new Date(v.vacation_start)
      const vEnd = v.vacation_end ? new Date(v.vacation_end) : new Date(v.vacation_start)

      // Período de férias se sobrepõe com o mês
      return vStart <= monthEnd && vEnd >= monthStart
    })
    .map((v) => ({
      name: v.professional_name,
      status: getVacationStatus(v.vacation_start, v.vacation_end),
    }))
}

export function FeriasView({ vacations }: FeriasViewProps) {
  const [view, setView] = useState<'calendar' | 'list'>('calendar')
  const [searchTerm, setSearchTerm] = useState('')

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const filteredVacations = useMemo(() => {
    if (!searchTerm) return vacations

    const lowerSearch = searchTerm.toLowerCase()
    return vacations.filter((v) => v.professional_name.toLowerCase().includes(lowerSearch))
  }, [vacations, searchTerm])

  const sortedVacations = useMemo(() => {
    const sorted = [...filteredVacations]
    sorted.sort((a, b) => {
      // Null values go to the end
      if (!a.vacation_start && !b.vacation_start) return 0
      if (!a.vacation_start) return 1
      if (!b.vacation_start) return -1

      // More recent first (descending)
      return new Date(b.vacation_start).getTime() - new Date(a.vacation_start).getTime()
    })
    return sorted
  }, [filteredVacations])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Férias</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {vacations.length > 0 ? `${vacations.length} registro${vacations.length !== 1 ? 's' : ''}` : 'Nenhum registro'}
          </p>
        </div>
      </div>

      {/* Toggle View */}
      <div className="flex gap-2" role="group" aria-label="Alternar visualização">
        <button
          onClick={() => setView('calendar')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 transition-all ${
            view === 'calendar'
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
          }`}
          aria-pressed={view === 'calendar'}
        >
          📅 Calendário
        </button>
        <button
          onClick={() => setView('list')}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 transition-all ${
            view === 'list'
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'
          }`}
          aria-pressed={view === 'list'}
        >
          📋 Lista
        </button>
      </div>

      {vacations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 font-medium">Nenhuma féria cadastrada</p>
          <p className="text-gray-400 text-sm mt-1">Comece adicionando registros de férias.</p>
        </div>
      ) : view === 'calendar' ? (
        // CALENDAR VIEW
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MONTHS.map((month, monthIndex) => {
            const profissionalsInMonth = getProfessionalsInMonth(vacations, monthIndex, currentYear)
            const isCurrentMonth = monthIndex === currentMonth

            return (
              <div
                key={monthIndex}
                className={`rounded-lg border p-4 ${
                  isCurrentMonth
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : profissionalsInMonth.length === 0
                      ? 'border-gray-200 bg-gray-50'
                      : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className={`font-semibold mb-3 ${isCurrentMonth ? 'text-blue-900' : 'text-gray-900'}`}>
                  {month}
                </h3>

                {profissionalsInMonth.length === 0 ? (
                  <p className="text-xs text-gray-400">Sem férias</p>
                ) : (
                  <div className="space-y-2">
                    {profissionalsInMonth.map((prof, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <span className="text-sm text-gray-700 truncate">{prof.name}</span>
                        <span
                          className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium whitespace-nowrap ${getStatusBadgeColor(prof.status)}`}
                        >
                          {prof.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        // LIST VIEW
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <label htmlFor="vacation-search" className="block text-xs font-medium text-gray-700 mb-1.5">
              Buscar por profissional
            </label>
            <svg className="absolute left-3 top-10 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="vacation-search"
              type="text"
              placeholder="Buscar profissional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-shadow"
              aria-label="Buscar por profissional"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Profissional</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Área</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Período</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Saldo</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Dias</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {sortedVacations.map((v) => {
                  const status = getVacationStatus(v.vacation_start, v.vacation_end)
                  return (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">{v.professional_name}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{v.client_area ?? '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDateRange(v.vacation_start, v.vacation_end)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{v.days_balance}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{v.total_days}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(status)}`} aria-label={`Status: ${status}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {sortedVacations.length === 0 && searchTerm && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-gray-500 font-medium">Nenhum profissional encontrado</p>
              <p className="text-gray-400 text-sm mt-1">Tente ajustar sua busca.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
