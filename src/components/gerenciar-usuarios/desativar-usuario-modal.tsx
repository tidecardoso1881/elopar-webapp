'use client'

import { useState, useTransition } from 'react'
import { deactivateUserAction } from '@/app/(dashboard)/area-usuario/gerenciar-usuarios/actions'

interface Props {
  userId: string
  userName: string
  onClose: () => void
}

export function DesativarUsuarioModal({ userId, userName, onClose }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await deactivateUserAction(userId)
      if (result.success) {
        onClose()
      } else {
        setError(result.error ?? 'Erro ao desativar usuário')
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-sm shadow-2xl p-6">
        <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center text-xl mb-4">🚫</div>
        <h2 className="text-base font-bold text-gray-900 mb-1.5">Desativar usuário?</h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          <strong className="text-gray-800">{userName}</strong> perderá o acesso imediatamente. Esta ação pode ser revertida reativando o usuário futuramente.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Desativando...' : 'Desativar'}
          </button>
        </div>
      </div>
    </div>
  )
}
