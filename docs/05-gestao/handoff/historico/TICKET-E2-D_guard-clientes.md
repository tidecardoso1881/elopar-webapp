---
id: TICKET-E2-D
para: Especialista 2
branch: feat/ep-020-guard-clientes
arquivos:
  - src/app/(dashboard)/clientes/novo/page.tsx
  - src/app/(dashboard)/clientes/[id]/editar/page.tsx
status: pending
---

# E2-D — Guards de rota: clientes/novo e clientes/[id]/editar

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-020-guard-clientes
```

---

## Arquivo 1 — `src/app/(dashboard)/clientes/novo/page.tsx`

Adicionar imports no topo:

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
```

Converter função para `async` e adicionar guard no início:

```tsx
// ANTES:
export default function NovoClientePage() {

// DEPOIS:
export default async function NovoClientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!canWrite(profile?.role)) redirect('/clientes')
```

---

## Arquivo 2 — `src/app/(dashboard)/clientes/[id]/editar/page.tsx`

Adicionar imports no topo (após os existentes):

```tsx
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
```

Dentro da função `EditarClientePage`, **antes** de qualquer query, adicionar:

```tsx
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!canWrite(profile?.role)) redirect('/clientes')
```

> ⚠️ `createClient` já existe na página de editar — não duplicar.

---

```bash
npx tsc --noEmit
git add src/app/\(dashboard\)/clientes/novo/page.tsx
git add src/app/\(dashboard\)/clientes/\[id\]/editar/page.tsx
git commit -m "feat(EP-020): guards de rota nas páginas de escrita de clientes"
git push origin feat/ep-020-guard-clientes
# Abrir PR: "feat(EP-020): RBAC — proteção de rotas novo e editar clientes"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e2d_done.md` com número do PR, depois iniciar TICKET-E2-E
