'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/formatting'

export interface VacationShelfData {
  id: string
  professional_name: string
  vacation_start: string | null
  vacation_end: string | null
  acquisition_start: string | null
  acquisition_end: string | null
  total_days: number | null
  days_balance: number | null
  leadership: string | null
  client_area: string | null
}

interface VacationShelfProps {
  vacation: VacationShelfData | null
  onClose: () => void
}

function deriveStatus(vacationStart: string | null): { label: string; color: string } {
  if (!vacationStart) return { label: '—', color: 'bg-gray-100 text-gray-600' }
  return new Date(vacationStart) < new Date()
    ? { label: 'Realizado', color: 'bg-green-100 text-green-700' }
    : { label: 'Agendado', color: 'bg-blue-100 text-blue-700' }
}

export function VacationShelf({ vacation, onClose }: VacationShelfProps) {
  const open = vacation !== null

  // Fechar com Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const status = vacation ? deriveStatus(vacation.vacation_start) : null
  const progressPct = vacation && vacation.total_days && vacation.days_balance != null
    ? Math.min(100, Math.round(((vacation.total_days - vacation.days_balance) / vacation.total_days) * 100))
    : null

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/35 z-40 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Shelf */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-[250ms] ease-[cubic-bezier(.4,0,.2,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Detalhes do registro de férias"
      >
        {vacation && (
          <>
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{vacation.professional_name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">Detalhes do registro de férias</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/ferias/${vacation.id}/editar`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                  </svg>
                  Editar
                </Link>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50 transition-colors"
                  aria-label="Fechar painel"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Identificação */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Identificação</h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-xs text-gray-500">Nome</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-0.5">{vacation.professional_name}</dd>
                  </div>
                  {vacation.leadership && (
                    <div>
                      <dt className="text-xs text-gray-500">Liderança</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-0.5">{vacation.leadership}</dd>
                    </div>
                  )}
                  {vacation.client_area && (
                    <div className="col-span-2">
                      <dt className="text-xs text-gray-500">Área / Cliente</dt>
                      <dd className="text-sm font-medium text-gray-900 mt-0.5">{vacation.client_area}</dd>
                    </div>
                  )}
                </dl>
              </section>

              <hr className="border-gray-100" />

              {/* Período Aquisitivo */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Período Aquisitivo</h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-xs text-gray-500">Início</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-0.5">
                      {vacation.acquisition_start ? formatDate(vacation.acquisition_start) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Fim</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-0.5">
                      {vacation.acquisition_end ? formatDate(vacation.acquisition_end) : '—'}
                    </dd>
                  </div>
                </dl>
              </section>

              <hr className="border-gray-100" />

              {/* Período de Gozo */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Período de Gozo</h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <dt className="text-xs text-gray-500">Início das Férias</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-0.5">
                      {vacation.vacation_start ? formatDate(vacation.vacation_start) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Fim das Férias</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-0.5">
                      {vacation.vacation_end ? formatDate(vacation.vacation_end) : '—'}
                    </dd>
                  </div>
                  {status && (
                    <div>
                      <dt className="text-xs text-gray-500">Status</dt>
                      <dd className="mt-0.5">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>
              </section>

              <hr className="border-gray-100" />

              {/* Dados Complementares */}
              <section>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Dados Complementares</h3>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
                  <div>
                    <dt className="text-xs text-gray-500">Total de Dias</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-0.5">
                      {vacation.total_days != null ? `${vacation.total_days} dias` : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Saldo de Dias</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-0.5">
                      {vacation.days_balance != null ? `${vacation.days_balance} dias` : '—'}
                    </dd>
                  </div>
                </dl>

                {/* Barra de progresso */}
                {progressPct !== null && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Dias utilizados</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </>
  )
}
