---
id: TICKET-E2-G
ep: EP-NEW-005
para: Especialista 2
branch: feat/ep-005-perfil-page
arquivos:
  - src/actions/users.ts (criar)
  - src/app/(dashboard)/area-usuario/perfil/page.tsx (criar)
status: pending
bloqueio: iniciar após E2-F ter PR aberto
---

# E2-G — Página Meu Perfil + action updateProfile

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-005-perfil-page
```

---

## Arquivo 1 — `src/actions/users.ts` (CRIAR)

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ActionResult = { success?: true; error?: string }

export async function updateProfile(data: {
  full_name: string
}): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado.' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: data.full_name.trim() })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/area-usuario/perfil')
  revalidatePath('/', 'layout')
  return { success: true }
}
```

---

## Arquivo 2 — `src/app/(dashboard)/area-usuario/perfil/page.tsx` (CRIAR)

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/user/profile-form'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Atualize seus dados pessoais.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {/* Avatar placeholder */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-semibold text-indigo-700">
              {(profile?.full_name ?? user.email ?? 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{profile?.full_name ?? '—'}</p>
            <p className="text-xs text-gray-500 capitalize">{profile?.role ?? 'usuário'}</p>
          </div>
        </div>

        <ProfileForm
          initialName={profile?.full_name ?? ''}
          email={user.email ?? ''}
        />
      </div>
    </div>
  )
}
```

---

## Arquivo 3 — `src/components/user/profile-form.tsx` (CRIAR)

```tsx
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
```

> ℹ️ Criar pasta `src/components/user/` antes do arquivo.

---

```bash
npx tsc --noEmit
mkdir -p src/components/user
git add src/actions/users.ts
git add src/components/user/profile-form.tsx
git add "src/app/(dashboard)/area-usuario/perfil/page.tsx"
git commit -m "feat(EP-005): página Meu Perfil + action updateProfile"
git push origin feat/ep-005-perfil-page
# Abrir PR: "feat(EP-005): página Meu Perfil e action updateProfile"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e2g_done.md` com número do PR
