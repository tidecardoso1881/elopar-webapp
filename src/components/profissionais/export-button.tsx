'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ExportModal } from './export-modal'

type StatusFilter = 'all' | 'active' | 'inactive'

export function ExportButton() {
  const searchParams = useSearchParams()
  const [modalOpen, setModalOpen] = useState(false)

  const rawStatus = searchParams.get('status') ?? ''
  const currentStatus: StatusFilter =
    rawStatus === 'active' || rawStatus === 'inactive' ? rawStatus : 'all'

  const currentFilters = {
    status: currentStatus,
    q: searchParams.get('q') ?? undefined,
    cliente: searchParams.get('cliente') ?? undefined,
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        title="Exportar lista de profissionais"
        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Exportar
      </button>

      <ExportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        currentFilters={currentFilters}
      />
    </>
  )
}
