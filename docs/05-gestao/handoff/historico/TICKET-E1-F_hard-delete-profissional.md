---
id: TICKET-E1-F
ep: EP-NEW-022
para: Especialista 1
branch: feat/ep-022-hard-delete-profissional
arquivos:
  - src/actions/professionals.ts
  - src/components/profissionais/professional-actions.tsx
status: pending
bloqueio: iniciar após E1-E ter PR aberto
---

# E1-F — Exclusão permanente de profissional (admin only)

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-022-hard-delete-profissional
```

---

## Arquivo 1 — `src/actions/professionals.ts`

Adicionar ao **final do arquivo**:

```typescript
export async function hardDeleteProfessional(id: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Apenas administradores podem excluir permanentemente.' }

  // Captura dados antes de excluir (para audit log)
  const { data: antes } = await supabase
    .from('professionals')
    .select()
    .eq('id', id)
    .single()

  if (!antes) return { error: 'Profissional não encontrado.' }

  // Excluir notas internas primeiro (FK)
  await supabase
    .from('professional_notes')
    .delete()
    .eq('professional_id', id)

  // Excluir profissional
  const { error } = await supabase
    .from('professionals')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  // Registrar no audit log
  await logAudit({
    entidade: 'professional',
    entidade_id: id,
    acao: 'DELETE',
    dados_antes: antes as Record<string, unknown>,
    dados_depois: null,
  })

  revalidatePath('/profissionais')
  return { success: true }
}
```

> ℹ️ `logAudit`, `createClient`, `revalidatePath` e `ActionResult` já importados no topo do arquivo.

---

## Arquivo 2 — `src/components/profissionais/professional-actions.tsx`

Adicionar import no topo:

```tsx
import { hardDeleteProfessional } from '@/actions/professionals'
```

Adicionar prop `isAdmin: boolean` na interface:

```tsx
interface ProfessionalActionsProps {
  id: string
  name: string
  status: string
  canEdit: boolean
  isAdmin: boolean   // ← adicionar
}
```

Adicionar na assinatura da função:

```tsx
export function ProfessionalActions({ id, name, status, canEdit, isAdmin }: ProfessionalActionsProps) {
```

Adicionar estado para o modal de exclusão permanente (após os `useState` existentes):

```tsx
  const [showHardDelete, setShowHardDelete] = useState(false)
```

Adicionar handler (após `handleDelete` existente):

```tsx
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
```

Adicionar modal de confirmação (após o modal de `showConfirm` existente):

```tsx
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
```

Adicionar botão "Excluir" no bloco de ações (dentro do `{canEdit && ...}`, após o botão Desligar):

```tsx
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
```

---

## Arquivo 2 (continuação) — `src/app/(dashboard)/profissionais/[id]/page.tsx`

Atualizar a chamada de `<ProfessionalActions` passando `isAdmin`:

```tsx
<ProfessionalActions
  id={professional.id}
  name={professional.name}
  status={professional.status}
  canEdit={currentRole === 'admin' || currentRole === 'gerente'}
  isAdmin={currentRole === 'admin'}
/>
```

---

```bash
npx tsc --noEmit
git add src/actions/professionals.ts
git add src/components/profissionais/professional-actions.tsx
git add src/app/\(dashboard\)/profissionais/\[id\]/page.tsx
git commit -m "feat(EP-022): exclusão permanente de profissional — admin only + audit log"
git push origin feat/ep-022-hard-delete-profissional
# Abrir PR: "feat(EP-022): exclusão permanente de profissional (admin only)"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e1f_done.md` com número do PR
