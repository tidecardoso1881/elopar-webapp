---
id: TICKET-E1-C
para: Especialista 1
branch: feat/ep-009-permissions-action
arquivo: src/app/(dashboard)/area-usuario/gerenciar-usuarios/actions.ts
status: pending
bloqueio: iniciar após E1-B ter PR aberto (não precisa estar mergeado)
---

# E1-C — Criar updateUserPermissionsAction

A função está sendo importada pelo `permissions-modal.tsx` mas não existe em `actions.ts`.

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-009-permissions-action
```

Abrir `src/app/(dashboard)/area-usuario/gerenciar-usuarios/actions.ts`.
Adicionar ao **final do arquivo** (após a última função):

```typescript
export async function updateUserPermissionsAction(
  userId: string,
  role: string,
  permissions: UserPermissions | null
): Promise<ActionResult> {
  const adminId = await requireAdmin()
  if (!adminId) return { success: false, error: 'Acesso negado' }
  if (adminId === userId) return { success: false, error: 'Não é possível alterar o próprio role' }

  const supabase = createAdminClient()

  const updateData: Record<string, unknown> = { role, updated_at: new Date().toISOString() }
  if (role === 'gerente') {
    updateData.permissions = permissions
  } else {
    updateData.permissions = null
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', userId)

  if (error) return { success: false, error: error.message }

  revalidatePath('/area-usuario/gerenciar-usuarios')
  return { success: true }
}
```

> ℹ️ `UserPermissions`, `requireAdmin`, `createAdminClient`, `revalidatePath` e `ActionResult`
> já estão importados no topo do arquivo. Não adicionar imports duplicados.

```bash
npx tsc --noEmit
git add src/app/\(dashboard\)/area-usuario/gerenciar-usuarios/actions.ts
git commit -m "feat(EP-009): server action updateUserPermissionsAction"
git push origin feat/ep-009-permissions-action
# Abrir PR: "feat(EP-009): ação de atualização de permissões granulares"
```

**DoD:** tsc ok + push + PR aberto
**Após concluir:** criar `NOTE_e1c_done.md` com número do PR
