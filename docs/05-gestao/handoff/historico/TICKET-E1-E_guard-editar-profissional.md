---
id: TICKET-E1-E
para: Especialista 1
branch: feat/ep-020-route-guards (mesma do E1-D)
arquivo: src/app/(dashboard)/profissionais/[id]/editar/page.tsx
status: pending
bloqueio: executar após E1-D (mesma branch)
---

# E1-E — Guard de rota: /profissionais/[id]/editar

> Continuar na branch `feat/ep-020-route-guards` criada no E1-D.

Abrir `src/app/(dashboard)/profissionais/[id]/editar/page.tsx`.

Adicionar import no topo (após os imports existentes):

```tsx
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
```

Dentro de `EditarProfissionalPage()`, **antes** do `Promise.all`, adicionar:

```tsx
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!canWrite(profile?.role)) redirect('/profissionais')
```

> ⚠️ `const supabase = await createClient()` já existe na linha ~24. Não duplicar — remover a declaração nova e usar a existente.

```bash
npx tsc --noEmit
git add src/app/\(dashboard\)/profissionais/novo/page.tsx
git add src/app/\(dashboard\)/profissionais/\[id\]/editar/page.tsx
git commit -m "feat(EP-020): guards de rota nas páginas de escrita de profissionais"
git push origin feat/ep-020-route-guards
# Abrir PR: "feat(EP-020): RBAC — proteção de rotas novo e editar profissional"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e1e_done.md` com número do PR
