'use client'

import { useState } from 'react'
import { renewProfessional } from '@/actions/professionals'

interface RenovarModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (id: string, newDate: string) => void
  professionalId: string
  professionalName: string
  currentDeadline: string | null
}

export function RenovarModal({
  isOpen,
  onClose,
  onSuccess,
  professionalId,
  professionalName,
  currentDeadline,
}: RenovarModalProps) {
  const [newDate, setNewDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!newDate) {
      setError('Selecione uma nova data de renovação.')
      return
    }
    setIsLoading(true)
    try {
      const result = await renewProfessional(professionalId, newDate)
      if (result.error) {
        setError(result.error)
      } else {
        onSuccess(professionalId, newDate)
        setNewDate('')
        onClose()
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setNewDate('')
    setError(null)
    onClose()
  }

  // Minimum date: today
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} aria-hidden="true" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-white shadow-xl p-6 mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Renovar Contrato</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profissional */}
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Profissional</p>
            <p className="text-sm font-medium text-gray-900">{professionalName}</p>
          </div>

          {/* Data atual */}
          {currentDeadline && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Data atual de renovação</p>
              <p className="text-sm text-gray-700">
                {new Date(currentDeadline + 'T00:00:00').toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}

          {/* Nova data */}
          <div>
            <label
              htmlFor="newDate"
              className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1"
            >
              Nova data de renovação <span className="text-red-500">*</span>
            </label>
            <input
              id="newDate"
              type="date"
              value={newDate}
              min={today}
              onChange={(e) => setNewDate(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || !newDate}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Salvando...
                </span>
              ) : (
                'Confirmar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
