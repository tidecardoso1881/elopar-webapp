'use client'

import { useRef, useState, useTransition } from 'react'
import { createUserAction } from '@/app/(dashboard)/area-usuario/gerenciar-usuarios/actions'

interface Props {
  onClose: () => void
}

export function NovoUsuarioModal({ onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formRef.current) return
    const formData = new FormData(formRef.current)
    setError(null)
    startTransition(async () => {
      const result = await createUserAction(formData)
      if (result.success) {
        setSuccess(true)
        setTimeout(onClose, 1500)
      } else {
        setError(result.error ?? 'Erro ao criar usuário')
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Novo Usuário</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">&times;</button>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {success ? (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 font-medium">
              ✅ Convite enviado com sucesso!
            </div>
          ) : (
            <>
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3 text-xs text-blue-700">
                ℹ️ O usuário receberá um e-mail de convite para definir sua senha. O acesso só é liberado após a confirmação.
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nome completo *</label>
                <input
                  name="full_name"
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">E-mail *</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="usuario@grupoelopar.com.br"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Perfil de acesso *</label>
                <select
                  name="role"
                  required
                  defaultValue=""
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" disabled>Selecione o perfil...</option>
                  <option value="admin">Admin — acesso total ao sistema</option>
                  <option value="manager">Manager — visualização e gestão operacional</option>
                  <option value="consulta">Consulta — somente leitura (sem edição)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Admin tem acesso à Área do Usuário e Gerenciar Usuários. Consulta só visualiza — sem criar, editar ou excluir.</p>
              </div>
            </>
          )}
        </form>

        {!success && (
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={() => formRef.current?.requestSubmit()}
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Enviando...' : 'Enviar convite'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
