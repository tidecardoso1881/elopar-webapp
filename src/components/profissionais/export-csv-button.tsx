'use client'

import { useSearchParams } from 'next/navigation'

export function ExportCsvButton() {
  const searchParams = useSearchParams()

  function handleExport() {
    // Monta URL com os filtros ativos da página
    const params = new URLSearchParams()
    const q = searchParams.get('q')
    const cliente = searchParams.get('cliente')
    const status = searchParams.get('status')

    if (q) params.set('q', q)
    if (cliente) params.set('cliente', cliente)
    if (status) params.set('status', status)

    const qs = params.toString()
    const url = `/api/exportar/profissionais${qs ? `?${qs}` : ''}`

    // Dispara download direto pelo browser
    window.location.href = url
  }

  return (
    <button
      onClick={handleExport}
      title="Exportar lista atual em CSV"
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Exportar CSV
    </button>
  )
}
