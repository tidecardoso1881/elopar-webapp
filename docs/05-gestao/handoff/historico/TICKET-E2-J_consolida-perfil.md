---
id: TICKET-E2-J
ep: EP-NEW-005
para: Especialista 2
branch: feat/ep-005-perfil-completo
prioridade: URGENTE — fechar PRs conflitantes #81 e #82
---

# E2-J — Consolidar Perfil Completo (substitui PRs #81 e #82)

> PRs #81 e #82 têm conflitos não-resolvíveis via rebase.
> Solução: nova branch com código final completo. Fechar #81 e #82 após este PR aberto.

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-005-perfil-completo
```

---

## Arquivo 1 — `src/actions/users.ts` (CRIAR do zero)

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

export async function uploadAvatar(formData: FormData): Promise<ActionResult & { avatarUrl?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado.' }

  const file = formData.get('avatar') as File | null
  if (!file || file.size === 0) return { error: 'Nenhum arquivo selecionado.' }
  if (!file.type.startsWith('image/')) return { error: 'Apenas imagens são permitidas.' }
  if (file.size > 2 * 1024 * 1024) return { error: 'Imagem deve ter no máximo 2MB.' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) return { error: uploadError.message }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', user.id)

  if (updateError) return { error: updateError.message }

  revalidatePath('/area-usuario/perfil')
  revalidatePath('/', 'layout')
  return { success: true, avatarUrl: publicUrl }
}
```

---

## Arquivo 2 — `src/components/user/profile-form.tsx` (CRIAR)

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

---

## Arquivo 3 — `src/components/user/avatar-upload.tsx` (CRIAR)

```tsx
'use client'

import { useRef, useState, useTransition } from 'react'
import { uploadAvatar } from '@/actions/users'

interface AvatarUploadProps {
  currentUrl: string | null
  initials: string
}

export function AvatarUpload({ currentUrl, initials }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setError(null)

    const formData = new FormData()
    formData.append('avatar', file)
    startTransition(async () => {
      const result = await uploadAvatar(formData)
      if (result.error) {
        setError(result.error)
        setPreview(currentUrl)
      }
    })
  }

  return (
    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className="relative group flex-shrink-0"
        aria-label="Trocar foto de perfil"
      >
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-semibold text-indigo-700">{initials}</span>
          )}
        </div>
        <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
        </div>
        {isPending && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
        >
          {isPending ? 'Enviando...' : 'Trocar foto'}
        </button>
        <p className="text-xs text-gray-400 mt-0.5">JPG, PNG ou WebP. Máx 2MB.</p>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  )
}
```

---

## Arquivo 4 — `src/app/(dashboard)/area-usuario/perfil/page.tsx` (CRIAR)

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from '@/components/user/profile-form'
import { AvatarUpload } from '@/components/user/avatar-upload'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, avatar_url')
    .eq('id', user.id)
    .single()

  const initials = (profile?.full_name ?? user.email ?? 'U').charAt(0).toUpperCase()

  return (
    <div className="max-w-lg mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Meu Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">Atualize seus dados pessoais.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AvatarUpload
          currentUrl={profile?.avatar_url ?? null}
          initials={initials}
        />

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

```bash
npx tsc --noEmit
mkdir -p src/components/user
git add src/actions/users.ts
git add src/components/user/profile-form.tsx
git add src/components/user/avatar-upload.tsx
git add "src/app/(dashboard)/area-usuario/perfil/page.tsx"
git commit -m "feat(EP-005): Meu Perfil completo — updateProfile + avatar upload"
git push origin feat/ep-005-perfil-completo
# Abrir PR: "feat(EP-005): Meu Perfil completo (consolida PRs #81 e #82)"
# Fechar PR #81 e PR #82 manualmente (comentar: "Substituído por este PR")
```

**DoD:** tsc ok + PR aberto + PRs #81 e #82 fechados
**Após concluir:** criar `NOTE_e2j_done.md` com número do PR
