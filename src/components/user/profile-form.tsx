'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/actions/users'

interface ProfileFormProps {
  initialName: string
  email: string
}

export function ProfileForm({ initialName, email }: ProfileFormProps) {
  const [name, setName] = useState(initialName)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await updateProfile({ full_name: name })
      if (result.error) setError(result.error)
      else setSuccess(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400 mt-1">O e-mail não pode ser alterado.</p>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">Perfil atualizado com sucesso.</p>
      )}

      <button
        type="submit"
        disabled={isPending || name.trim() === initialName}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {isPending ? 'Salvando...' : 'Salvar'}
      </button>
    </form>
  )
}
