---
id: TICKET-E1-G
ep: EP-NEW-020
para: Especialista 1
branch: feat/ep-020-guard-ferias
arquivos:
  - src/app/(dashboard)/ferias/novo/page.tsx
  - src/app/(dashboard)/ferias/[id]/editar/page.tsx
status: pending
bloqueio: iniciar após E1-F ter PR aberto
---

# E1-G — Guards de rota: férias/novo e férias/[id]/editar

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-020-guard-ferias
```

---

## Arquivo 1 — `src/app/(dashboard)/ferias/novo/page.tsx`

Substituir o arquivo inteiro por:

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
import { VacationForm } from '@/components/profissionais/ferias/vacation-form'
import { createVacation } from '@/actions/vacations'

export default async function NovaFeriasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!canWrite(profile?.role)) redirect('/ferias')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Novo Registro de Férias</h1>
        <p className="text-sm text-gray-500 mt-0.5">Preencha os dados para registrar um novo período de férias.</p>
      </div>

      <VacationForm action={createVacation} submitLabel="Criar Registro" cancelHref="/ferias" />
    </div>
  )
}
```

---

## Arquivo 2 — `src/app/(dashboard)/ferias/[id]/editar/page.tsx`

Adicionar imports no topo (após os existentes):

```tsx
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
```

Dentro da função `EditFeriasPage`, **após** `const supabase = await createClient()` e **antes** da query de vacation, adicionar:

```tsx
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!canWrite(profile?.role)) redirect('/ferias')
```

> ⚠️ `createClient` já existe no arquivo — não duplicar. Inserir o guard logo após `const supabase = await createClient()`.

---

```bash
npx tsc --noEmit
git add src/app/\(dashboard\)/ferias/novo/page.tsx
git add src/app/\(dashboard\)/ferias/\[id\]/editar/page.tsx
git commit -m "feat(EP-020): guards de rota nas páginas de escrita de férias"
git push origin feat/ep-020-guard-ferias
# Abrir PR: "feat(EP-020): RBAC — proteção de rotas novo e editar férias"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e1g_done.md` com número do PR
