'use client'

import { useActionState } from 'react'
import { type ClientActionResult } from '@/actions/clients'

interface ClientFormProps {
  action: (prevState: ClientActionResult, formData: FormData) => Promise<ClientActionResult>
  defaultName?: string
  submitLabel?: string
  cancelHref?: string
}

export function ClientForm({
  action,
  defaultName = '',
  submitLabel = 'Salvar',
  cancelHref = '/clientes',
}: ClientFormProps) {
  const [state, formAction, isPending] = useActionState(action, {})

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-5">Dados do Cliente</h2>

        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-xs font-medium text-gray-600">
            Nome do Cliente <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={defaultName}
            placeholder="Ex: Alelo, Livelo, Veloe..."
            className="w-full max-w-md rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-colors"
          />
          <p className="text-xs text-gray-400">
            Nome deve ser único. Será usado como identificador em contratos e relatórios.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <a
          href={cancelHref}
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </a>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Salvando...
            </>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  )
}
