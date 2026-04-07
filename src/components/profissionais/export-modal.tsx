'use client'

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ExportFormat = 'csv' | 'xlsx' | 'pdf'
type StatusFilter = 'all' | 'active' | 'inactive'

interface ExportModalProps {
  open: boolean
  onClose: () => void
  currentFilters?: {
    status?: StatusFilter
    q?: string
    cliente?: string
  }
}

// ─── Field definitions ────────────────────────────────────────────────────────

const AVAILABLE_FIELDS = [
  { key: 'nome', label: 'Nome' },
  { key: 'cpf', label: 'CPF' },
  { key: 'email', label: 'E-mail' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'posicao', label: 'Posição' },
  { key: 'senioridade', label: 'Senioridade' },
  { key: 'status', label: 'Status' },
  { key: 'contrato_inicio', label: 'Contrato — Data Início' },
  { key: 'contrato_fim', label: 'Contrato — Data Fim' },
  { key: 'renovacao', label: 'Data de Renovação' },
]

const DEFAULT_FIELDS = new Set(['nome', 'email', 'cliente', 'posicao', 'status'])

// ─── Format options ───────────────────────────────────────────────────────────

const FORMAT_OPTIONS: { value: ExportFormat; label: string; description: string }[] = [
  { value: 'csv', label: 'CSV', description: 'Compatível com Excel' },
  { value: 'xlsx', label: 'Excel (.xlsx)', description: 'Planilha formatada' },
  { value: 'pdf', label: 'PDF', description: 'Relatório de apresentação' },
]

const EXT: Record<ExportFormat, string> = { csv: 'csv', xlsx: 'xlsx', pdf: 'pdf' }

// ─── Component ────────────────────────────────────────────────────────────────

export function ExportModal({ open, onClose, currentFilters }: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv')
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set(DEFAULT_FIELDS))
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    currentFilters?.status ?? 'all'
  )
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  if (!open) return null

  const today = new Date().toISOString().slice(0, 10)
  const previewFilename = `profissionais_elopar_${today}.${EXT[format]}`

  function toggleField(key: string) {
    setSelectedFields((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  function handleClose() {
    setLoading(false)
    setSuccessMsg('')
    setErrorMsg('')
    onClose()
  }

  async function handleExport() {
    if (selectedFields.size === 0) return
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      const params = new URLSearchParams({
        format,
        fields: [...selectedFields].join(','),
        status: statusFilter,
      })
      if (currentFilters?.q) params.set('q', currentFilters.q)
      if (currentFilters?.cliente) params.set('cliente', currentFilters.cliente)

      const response = await fetch(`/api/exportar/profissionais?${params}`)

      if (!response.ok) {
        const json = await response.json().catch(() => ({}))
        throw new Error(json.error ?? 'Erro ao gerar arquivo')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = previewFilename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)

      setSuccessMsg('Arquivo baixado com sucesso!')
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Exportar Profissionais</h2>
              <p className="text-xs text-gray-500">Selecione o formato e os campos</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Format selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Formato</p>
            <div className="space-y-2">
              {FORMAT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${
                    format === opt.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={opt.value}
                    checked={format === opt.value}
                    onChange={() => setFormat(opt.value)}
                    className="accent-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                    <span className="ml-2 text-xs text-gray-500">{opt.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Field selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Campos</p>
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={() =>
                  setSelectedFields(
                    selectedFields.size === AVAILABLE_FIELDS.length
                      ? new Set()
                      : new Set(AVAILABLE_FIELDS.map((f) => f.key))
                  )
                }
              >
                {selectedFields.size === AVAILABLE_FIELDS.length ? 'Desmarcar todos' : 'Selecionar todos'}
              </button>
            </div>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {AVAILABLE_FIELDS.map((field) => (
                <label
                  key={field.key}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedFields.has(field.key)}
                    onChange={() => toggleField(field.key)}
                    className="h-4 w-4 rounded accent-blue-600"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{field.label}</span>
                </label>
              ))}
            </div>
            {selectedFields.size === 0 && (
              <p className="mt-1 text-xs text-red-500">Selecione pelo menos um campo.</p>
            )}
          </div>

          {/* Status filter */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
            <div className="flex gap-2 flex-wrap">
              {(
                [
                  { value: 'all', label: 'Todos' },
                  { value: 'active', label: 'Apenas Ativos' },
                  { value: 'inactive', label: 'Apenas Inativos' },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 cursor-pointer text-sm transition-colors ${
                    statusFilter === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={statusFilter === opt.value}
                    onChange={() => setStatusFilter(opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* File preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1.5">Nome do arquivo</p>
            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
              <code className="text-xs text-gray-600 font-mono">{previewFilename}</code>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              {successMsg}
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            disabled={loading || selectedFields.size === 0}
            title={loading ? 'Gerando arquivo...' : undefined}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Gerando...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Exportar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
