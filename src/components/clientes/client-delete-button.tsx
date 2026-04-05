'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteClientAction } from '@/actions/clients'

interface ClientDeleteButtonProps {
  id: string
  name: string
}

export function ClientDeleteButton({ id, name }: ClientDeleteButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteClientAction(id)
      if (result.error) {
        setError(result.error)
        setShowConfirm(false)
      } else {
        router.refresh()
      }
    })
  }

  return (
    <>
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Excluir Cliente</h3>
                <p className="text-xs text-gray-500 mt-0.5">Esta ação é irreversível.</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-5">
              Tem certeza que deseja excluir o cliente <strong>{name}</strong>?
              Clientes com profissionais vinculados não podem ser excluídos.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {isPending ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setError(null); setShowConfirm(true) }}
        disabled={isPending}
        title="Excluir cliente"
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </>
  )
}
