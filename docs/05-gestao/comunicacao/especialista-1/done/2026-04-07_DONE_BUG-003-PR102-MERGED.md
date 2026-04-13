---
para: Especialista 1 (Haiku)
de: Gerente (Cowork)
data: 2026-04-07
tipo: URGENT
bug: BUG-003
branch: fix/bug-003-gerenciar-usuarios-page
---

# URGENT — BUG-003: /gerenciar-usuarios quebrando em produção

## Problema

`src/app/(dashboard)/area-usuario/gerenciar-usuarios/page.tsx` está truncado em 76 linhas — a JSX termina no meio de uma frase, sem fechar tags, sem renderizar o componente `<UsuariosTable>`.

A página https://elopar-webapp.vercel.app/gerenciar-usuarios retorna erro.

## Arquivo a substituir

**`src/app/(dashboard)/area-usuario/gerenciar-usuarios/page.tsx`** — sobrescrever completamente:

```tsx
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { UsuariosTable, type UserRow, type UserStatus } from '@/components/gerenciar-usuarios/usuarios-table'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gerenciar Usuários',
}

function resolveStatus(confirmedAt: string | null, bannedUntil: string | null): UserStatus {
  if (bannedUntil) {
    const until = new Date(bannedUntil)
    if (until > new Date()) return 'desativado'
  }
  if (!confirmedAt) return 'pendente'
  return 'ativo'
}

export default async function GerenciarUsuariosPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/area-usuario')

  const admin = createAdminClient()
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 200 })

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, role, permissions')

  const profilesMap = new Map((profiles ?? []).map(p => [p.id, p]))

  const rows: UserRow[] = authUsers.map(u => {
    const p = profilesMap.get(u.id)
    return {
      id: u.id,
      email: u.email ?? '',
      full_name: p?.full_name ?? null,
      role: p?.role ?? 'consulta',
      status: resolveStatus(u.confirmed_at ?? null, u.banned_until ?? null),
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      permissions: (p?.permissions as import('@/types/permissions').UserPermissions | null) ?? null,
    }
  })

  const ORDER: Record<UserStatus, number> = { ativo: 0, pendente: 1, desativado: 2 }
  rows.sort((a, b) => ORDER[a.status] - ORDER[b.status])

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500">
        <a href="/area-usuario" className="hover:text-blue-600 transition-colors">Área do Usuário</a>
        <span className="mx-1.5 text-gray-300">/</span>
        <span className="text-gray-700 font-medium">Gerenciar Usuários</span>
      </p>

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Gerenciar Usuários</h1>
        <p className="mt-0.5 text-xs sm:text-sm text-gray-500">
          Crie e gerencie os acessos ao sistema. Apenas administradores podem acessar esta página.
        </p>
      </div>

      <UsuariosTable users={rows} currentUserId={user.id} />
    </div>
  )
}
```

## Comandos

```bash
git checkout main && git pull origin main
git checkout -b fix/bug-003-gerenciar-usuarios-page
# sobrescrever o arquivo com o conteúdo acima
npx tsc --noEmit && npm run build
git add src/app/\(dashboard\)/area-usuario/gerenciar-usuarios/page.tsx
git commit -m "fix(BUG-003): reconstruir gerenciar-usuarios/page.tsx truncado"
git fetch origin && git merge origin/main
gh pr create --title "fix(BUG-003): reconstruir gerenciar-usuarios/page.tsx truncado" --body "Pagina estava truncada em 76 linhas sem fechar JSX e sem renderizar UsuariosTable. Reconstruida completamente."
```

## DoD

- [ ] `npx tsc --noEmit` zero erros
- [ ] `npm run build` sem erros
- [ ] PR aberto com número
