---
de: Gerente (Cowork)
para: Especialista 2 (Haiku)
data: 2026-04-07
tipo: TICKET
prioridade: NORMAL
dependência: E2-L (NAV-001) deve estar merged antes deste ticket
---

# E2-N — NAV-004: Simplificar Área do Usuário (remover cards admin já na sidebar)

## Contexto
`area-usuario/page.tsx` está TRUNCADO no disco (60 linhas, corta no meio do profile card JSX).

Após E2-L adicionar Métricas, Saúde dos Testes, Audit Log e Gerenciar Usuários na sidebar, os cards de atalho na Área do Usuário ficam redundantes. A página deve virar somente hub de perfil pessoal.

**⚠️ Só executar após PR de E2-L estar merged no main.**

---

## O que mudar

**Remover da página:**
- Cards admin: Gerenciar Usuários, Audit Log, Saúde dos Testes, Métricas
- Variável `isAdmin` (não será mais usada)

**Manter / adicionar:**
- Profile card (gradiente indigo → purple) com nome, email, role badge, iniciais
- Card "Meu Perfil" → link para `/area-usuario/perfil` (editar nome + foto)
- Card "Permissões" → link para `/area-usuario/permissoes` (visível para todos)
- Subtítulo da página atualizado: "Gerencie seu perfil e acesso"

---

## Arquivo — REESCREVER COMPLETO: `src/app/(dashboard)/area-usuario/page.tsx`

**Escrever exatamente este conteúdo:**

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Área do Usuário',
}

function getRoleLabel(role: string | null): string {
  switch (role) {
    case 'admin':    return 'Administrador'
    case 'manager':  return 'Gerente'
    case 'consulta': return 'Consulta'
    default:         return role ?? 'Usuário'
  }
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('')
  }
  return (email[0] ?? 'U').toUpperCase()
}

export default async function AreaUsuarioPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  const initials  = getInitials(profile?.full_name ?? null, user.email ?? '')
  const displayName = profile?.full_name ?? user.email ?? 'Usuário'
  const role      = profile?.role ?? null

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Área do Usuário</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Gerencie seu perfil e acesso</p>
      </div>

      {/* Profile card */}
      <div className="rounded-xl p-6 text-white shadow-lg bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">{displayName}</h2>
            <p className="text-indigo-200 text-sm mt-0.5 truncate">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
              {getRoleLabel(role)}
            </span>
          </div>
        </div>
      </div>

      {/* Ações de perfil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Meu Perfil */}
        <Link
          href="/area-usuario/perfil"
          className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Meu Perfil</p>
            <p className="text-xs text-gray-500 mt-0.5">Editar nome, foto e dados pessoais</p>
          </div>
        </Link>

        {/* Permissões */}
        <Link
          href="/area-usuario/permissoes"
          className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Permissões</p>
            <p className="text-xs text-gray-500 mt-0.5">Visualizar seu nível de acesso</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
```

---

## Comandos Git

```bash
cd elopar-webapp
git checkout main && git pull origin main
git checkout -b fix/nav-004-area-usuario-simplificada
git add src/app/\(dashboard\)/area-usuario/page.tsx
git commit -m "$(cat <<'EOF'
fix(nav): simplificar Área do Usuário — remover cards admin já na sidebar

- page.tsx: REESCRITO (arquivo estava truncado no disco)
- Remove cards: Gerenciar Usuários, Audit Log, Saúde dos Testes, Métricas
  (agora acessíveis diretamente via sidebar — dependência: E2-L)
- Mantém: profile card, Meu Perfil, Permissões
- Adiciona role 'consulta' no getRoleLabel

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin fix/nav-004-area-usuario-simplificada
gh pr create \
  --title "fix(nav): simplificar Área do Usuário após sidebar com links admin" \
  --body "Remove os cards de atalho para Gerenciar Usuários, Audit Log, Métricas e Saúde dos Testes da Área do Usuário. Esses itens agora aparecem diretamente na sidebar (E2-L). A página fica focada em perfil pessoal + permissões."
```

## DoD
- [ ] PR aberto com número
- [ ] Criar `DONE_nav-004-area-usuario_07042026_[hh_mm].md` no inbox do gerente com número do PR
