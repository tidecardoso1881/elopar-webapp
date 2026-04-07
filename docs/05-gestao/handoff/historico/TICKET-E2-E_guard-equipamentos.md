---
id: TICKET-E2-E
para: Especialista 2
branch: feat/ep-020-guard-equipamentos
arquivos:
  - src/app/(dashboard)/equipamentos/novo/page.tsx
  - src/app/(dashboard)/equipamentos/[id]/editar/page.tsx
status: pending
bloqueio: iniciar após E2-D ter PR aberto
---

# E2-E — Guards de rota: equipamentos/novo e equipamentos/[id]/editar

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-020-guard-equipamentos
```

---

## Arquivo 1 — `src/app/(dashboard)/equipamentos/novo/page.tsx`

Adicionar imports no topo:

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
```

Converter função para `async` e adicionar guard:

```tsx
// ANTES:
export default async function NovoEquipamentoPage() {

// DEPOIS (já é async — só adicionar guard no início do corpo):
export default async function NovoEquipamentoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!canWrite(profile?.role)) redirect('/equipamentos')
```

---

## Arquivo 2 — `src/app/(dashboard)/equipamentos/[id]/editar/page.tsx`

Adicionar imports no topo (após os existentes):

```tsx
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
```

Dentro da função, **antes** de qualquer query, adicionar:

```tsx
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!canWrite(profile?.role)) redirect('/equipamentos')
```

> ⚠️ `createClient` já existe na página de editar — não duplicar.

---

```bash
npx tsc --noEmit
git add src/app/\(dashboard\)/equipamentos/novo/page.tsx
git add src/app/\(dashboard\)/equipamentos/\[id\]/editar/page.tsx
git commit -m "feat(EP-020): guards de rota nas páginas de escrita de equipamentos"
git push origin feat/ep-020-guard-equipamentos
# Abrir PR: "feat(EP-020): RBAC — proteção de rotas novo e editar equipamentos"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e2e_done.md` com número do PR
