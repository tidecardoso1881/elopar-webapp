---
id: TICKET-E1-D
para: Especialista 1
branch: feat/ep-020-route-guards
arquivo: src/app/(dashboard)/profissionais/novo/page.tsx
status: pending
---

# E1-D — Guard de rota: /profissionais/novo

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-020-route-guards
```

Abrir `src/app/(dashboard)/profissionais/novo/page.tsx`.

Adicionar import no topo (após os imports existentes):

```tsx
import { redirect } from 'next/navigation'
import { canWrite } from '@/types/roles'
```

Dentro de `NovoProfissionalPage()`, **antes** da query de clients, adicionar:

```tsx
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!canWrite(profile?.role)) redirect('/profissionais')
```

```bash
npx tsc --noEmit
# NÃO abrir PR ainda — continuar para E1-E na mesma branch
```

**DoD:** tsc ok + arquivo salvo na branch `feat/ep-020-route-guards`
**Após concluir:** ir direto para TICKET-E1-E (mesma branch)
