'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteProfessional, hardDeleteProfessional } from '@/actions/professionals'

interface ProfessionalActionsProps {
  id: string
  name: string
  status: string
  canEdit: boolean
  isAdmin: boolean
}

export function ProfessionalActions({ id, name, status, canEdit, isAdmin }: ProfessionalActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const [showHardDelete, setShowHardDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isActive = status === 'ATIVO'

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteProfessional(id)
      if (result.error) {
        setError(result.error)
        setShowConfirm(false)
      } else {
        router.push('/profissionais')
        router.refresh()
      }
    })
  }

  function handleHardDelete() {
    startTransition(async () => {
      const result = await hardDeleteProfessional(id)
      if (result.error) {
        setError(result.error)
        setShowHardDelete(false)
      } else {
        router.push('/profissionais')
        router.refresh()
      }
    })
  }

  return (
    <>
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Modal de confirmação */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Desligar Profissional</h3>
                <p className="text-xs text-gray-500 mt-0.5">Esta ação pode ser revertida alterando o status.</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-5">
              Tem certeza que deseja desligar <strong>{name}</strong>? O status será alterado para <span className="font-medium text-gray-600">DESLIGADO</span>.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isPending}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {isPending ? 'Desligando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de exclusão permanente */}
      {showHardDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Excluir Permanentemente</h3>
                <p className="text-xs text-red-500 font-medium mt-0.5">Esta ação é irreversível.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-5">
              O profissional <strong>{name}</strong> e todas as suas notas internas serão removidos permanentemente do sistema.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHardDelete(false)}
                disabled={isPending}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleHardDelete}
                disabled={isPending}
                className="flex-1 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60 transition-colors"
              >
                {isPending ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Botões de ação */}
      {canEdit && (
        <div className="flex items-center gap-2">
          <a
            href={`/profissionais/${id}/editar`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
            Editar
          </a>

          {isActive && (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Desligar
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setShowHardDelete(true)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Excluir
            </button>
          )}
        </div>
      )}
    </>
  )
}
