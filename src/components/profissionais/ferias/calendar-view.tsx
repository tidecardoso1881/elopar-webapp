'use client'

import { useState } from 'react'
import Link from 'next/link'
import { VacationShelf, type VacationShelfData } from './vacation-shelf'

const MONTH_NAMES = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ']

interface CalendarVacation extends VacationShelfData {
  vacation_start: string | null
  vacation_end: string | null
}

interface CalendarViewProps {
  vacations: CalendarVacation[]
  year: number
  buildYearUrl: (year: number) => string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function isRealizado(vacationStart: string | null): boolean {
  if (!vacationStart) return false
  return new Date(vacationStart) < new Date()
}

/** Calcula quantos dias da férias caem no mês especificado (0-indexed). */
function daysInMonthForVacation(
  vacationStart: string,
  vacationEnd: string,
  year: number,
  month: number
): number {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month, daysInMonth(year, month))
  const ini = new Date(vacationStart) > firstDay ? new Date(vacationStart) : firstDay
  const fim = new Date(vacationEnd) < lastDay ? new Date(vacationEnd) : lastDay
  if (ini > fim) return 0
  return Math.round((fim.getTime() - ini.getTime()) / 86400000) + 1
}

/** Retorna os chips que devem aparecer em cada mês. */
function buildMonthData(
  vacations: CalendarVacation[],
  year: number
): Array<Array<{ vacation: CalendarVacation; days: number }>> {
  return Array.from({ length: 12 }, (_, month) => {
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month, daysInMonth(year, month))

    return vacations
      .filter(v => {
        if (!v.vacation_start) return false
        const start = new Date(v.vacation_start)
        const end = v.vacation_end ? new Date(v.vacation_end) : start
        return start <= lastDay && end >= firstDay
      })
      .map(v => ({
        vacation: v,
        days: daysInMonthForVacation(
          v.vacation_start!,
          v.vacation_end ?? v.vacation_start!,
          year,
          month
        ),
      }))
  })
}

export function CalendarView({ vacations, year, buildYearUrl }: CalendarViewProps) {
  const [selectedVacation, setSelectedVacation] = useState<CalendarVacation | null>(null)
  const monthData = buildMonthData(vacations, year)

  return (
    <>
      {/* Navegação de ano */}
      <div className="flex items-center justify-center gap-5 py-4">
        <Link
          href={buildYearUrl(year - 1)}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label={`Ano ${year - 1}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-2xl font-bold text-gray-900 min-w-[80px] text-center">{year}</span>
        <Link
          href={buildYearUrl(year + 1)}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          aria-label={`Ano ${year + 1}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Grade 4×3 de meses */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MONTH_NAMES.map((monthName, month) => {
          const chips = monthData[month]
          return (
            <div
              key={month}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Header roxo */}
              <div className="bg-indigo-600 px-3.5 py-2">
                <span className="text-xs font-bold tracking-widest text-white">{monthName}</span>
              </div>

              {/* Body com chips */}
              <div className="px-3 py-2.5 min-h-[80px] flex flex-col gap-1.5">
                {chips.length === 0 ? (
                  <p className="text-xs text-gray-300 italic py-1">Nenhuma férias</p>
                ) : (
                  chips.map(({ vacation, days }) => {
                    const realizado = isRealizado(vacation.vacation_start)
                    return (
                      <button
                        key={`${vacation.id}-${month}`}
                        onClick={() => setSelectedVacation(vacation)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium w-full text-left transition-all ${
                          realizado
                            ? 'bg-green-50 border border-green-200 text-green-800 hover:bg-green-100'
                            : 'bg-indigo-50 border border-indigo-200 text-indigo-800 hover:bg-indigo-100'
                        }`}
                      >
                        {/* Avatar */}
                        <span className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full text-white text-[9px] font-bold ${realizado ? 'bg-green-600' : 'bg-indigo-600'}`}>
                          {getInitials(vacation.professional_name)}
                        </span>
                        {/* Nome truncado */}
                        <span className="flex-1 truncate min-w-0">
                          {vacation.professional_name.split(' ')[0]}
                        </span>
                        {/* Dias badge */}
                        <span className={`flex-shrink-0 rounded-full px-1.5 py-px text-white text-[10px] font-semibold ${realizado ? 'bg-green-600' : 'bg-indigo-600'}`}>
                          {days}
                        </span>
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Shelf lateral */}
      <VacationShelf
        vacation={selectedVacation}
        onClose={() => setSelectedVacation(null)}
      />
    </>
  )
}
