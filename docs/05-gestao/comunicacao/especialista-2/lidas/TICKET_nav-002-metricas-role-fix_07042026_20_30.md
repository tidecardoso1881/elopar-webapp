---
de: Gerente (Cowork)
para: Especialista 2 (Haiku)
data: 2026-04-07
tipo: TICKET
prioridade: ALTA
---

# E2-M — NAV-002: Corrigir acesso a Métricas/Saúde/AuditLog por role (remover lógica por email)

## Contexto

`proxy.ts` está TRUNCADO no disco (corta em `const url = request.nextUrl.cl`). Precisa ser reconstruído completo.

Problema crítico: `/area-usuario/metricas` só é acessível para `user.email === process.env.METRICS_ALLOWED_EMAIL` — ou seja, somente 1 usuário específico. Todos os outros são redirecionados.

A rota `/area-usuario/audit-log` está em `adminOnlyRoutes` (só admin), mas deveria ser admin + gerente.

Solução: verificar role do perfil no banco, substituindo a lógica por email.

---

## Arquivo 1 — REESCREVER COMPLETO: `src/proxy.ts`

**Escrever exatamente este conteúdo:**

```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Não escreva nenhum código entre createServerClient e
  // supabase.auth.getUser(). Um erro simples pode dificultar muito a depuração
  // de problemas com usuários sendo desconectados aleatoriamente.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/login'
  const isAuthCallback = pathname.startsWith('/auth/')
  const isPasswordReset = pathname === '/reset-password'
  const isPasswordUpdate = pathname === '/update-password'

  // Usuário não autenticado tentando acessar página protegida → redirecionar para login
  if (!user && !isLoginPage && !isAuthCallback && !isPasswordReset && !isPasswordUpdate) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Usuário autenticado tentando acessar página de login → redirecionar para dashboard
  if (user && isLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Rotas que requerem role admin ou gerente (analytics + audit log)
  const adminOrManagerRoutes = [
    '/area-usuario/metricas',
    '/area-usuario/saude-testes',
    '/area-usuario/audit-log',
  ]

  // Rota que requer role admin exclusivamente
  const adminOnlyRoutes = [
    '/area-usuario/gerenciar-usuarios',
  ]

  const requiresAdminOrManager = adminOrManagerRoutes.some(r => pathname.startsWith(r))
  const requiresAdmin = adminOnlyRoutes.some(r => pathname.startsWith(r))

  if (user && (requiresAdminOrManager || requiresAdmin)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role ?? ''
    const isAdminOrManager = role === 'admin' || role === 'gerente' || role === 'manager'
    const isAdmin = role === 'admin'

    if (requiresAdmin && !isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    if (requiresAdminOrManager && !isAdminOrManager) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
```

---

## Arquivo 2 — EDITAR: `src/app/(dashboard)/area-usuario/metricas/page.tsx`

Localizar linhas 23-25 (dentro da função `MetricasPage`):

**DE:**
```ts
  if (!user || user.email !== process.env.METRICS_ALLOWED_EMAIL) {
    redirect('/area-usuario')
  }
```

**PARA:**
```ts
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id ?? '')
    .single()

  const isAdminOrManager =
    profile?.role === 'admin' || profile?.role === 'gerente' || profile?.role === 'manager'

  if (!user || !isAdminOrManager) {
    redirect('/area-usuario')
  }
```

---

## Comandos Git

```bash
cd elopar-webapp
git checkout main && git pull origin main
git checkout -b fix/nav-002-metricas-role-check
git add \
  src/proxy.ts \
  src/app/\(dashboard\)/area-usuario/metricas/page.tsx
git commit -m "$(cat <<'EOF'
fix(auth): substituir lógica de email por role no acesso a métricas/audit-log

- proxy.ts: RECONSTRUÍDO (arquivo estava truncado no disco)
  - Remove METRICS_ALLOWED_EMAIL: acesso a métricas agora por role
  - adminOrManagerRoutes: métricas + saúde-testes + audit-log → admin|gerente
  - adminOnlyRoutes: gerenciar-usuarios → apenas admin
- metricas/page.tsx: guard substituído para verificar role no perfil

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin fix/nav-002-metricas-role-check
gh pr create \
  --title "fix(auth): acesso a métricas e audit-log por role (remove lógica por email)" \
  --body "Remove a dependência de METRICS_ALLOWED_EMAIL. Qualquer admin ou gerente agora acessa Métricas, Saúde dos Testes e Audit Log. Gerenciar Usuários continua exclusivo para admin."
```

## DoD
- [ ] PR aberto com número
- [ ] Criar `DONE_nav-002-metricas-role_07042026_[hh_mm].md` no inbox do gerente com número do PR
