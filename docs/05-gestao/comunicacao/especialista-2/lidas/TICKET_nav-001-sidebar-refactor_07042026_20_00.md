---
de: Gerente (Cowork)
para: Especialista 2 (Haiku)
data: 2026-04-07
tipo: TICKET
prioridade: ALTA
---

# E2-L — NAV-001: Sidebar + MobileMenu — expor funcionalidades admin/gerente

## Contexto
`sidebar.tsx` (150 linhas) e `mobile-menu.tsx` (184 linhas) estão TRUNCADOS no disco — NTFS cortou. Escrever o arquivo COMPLETO com o conteúdo abaixo.

Problema atual: seção Analytics só aparece para `isAdmin`. Gerente não vê Métricas nem Saúde dos Testes. Gerenciar Usuários e Audit Log não aparecem na sidebar de ninguém.

Solução: seção Analytics para admin+gerente, seção Administração nova com Audit Log (admin+gerente) + Gerenciar Usuários (só admin).

---

## Arquivo 1 — REESCREVER COMPLETO: `src/components/layout/sidebar.tsx`

**Escrever exatamente este conteúdo:**

```tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface SidebarProps {
  renewalBadge?: React.ReactNode
  userRole?: string
}

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    label: 'Profissionais',
    href: '/profissionais',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.038 9.038 0 0 0 5.754-1.676A9.038 9.038 0 0 0 21.75 10.5c0-5.042-4.708-9.135-10.5-9.135S.75 5.457.75 10.5c0 1.747.292 3.429.831 5m15 0a9.01 9.01 0 0 0-15.999-3.12M15 19.128v-.008" />
      </svg>
    ),
  },
  {
    label: 'Clientes',
    href: '/clientes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0A9.005 9.005 0 0 0 3.75 10.5M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    label: 'Renovações',
    href: '/renovacoes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: 'Equipamentos',
    href: '/equipamentos',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6V5.25m13.5-3h-6a2.25 2.25 0 0 0-2.25 2.25v11.883a3 3 0 0 0 .879 2.122l.841.841H15a6 6 0 0 0 6-6V7.25A2.25 2.25 0 0 0 18.75 5z" />
      </svg>
    ),
  },
  {
    label: 'Férias',
    href: '/ferias',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432m0 0a2.25 2.25 0 1 0-3.182-3.182m3.182 3.182l6.94 6.939M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
      </svg>
    ),
  },
  {
    label: 'Notificações',
    href: '/notificacoes',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
    ),
  },
]

export function Sidebar({ renewalBadge, userRole = 'consulta' }: SidebarProps) {
  const pathname = usePathname()
  const isAdminOrManager = userRole === 'admin' || userRole === 'gerente' || userRole === 'manager'
  const isAdmin = userRole === 'admin'

  const navLinkClass = (href: string) =>
    `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
      pathname === href ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
    }`
  const iconClass = (href: string) => pathname === href ? 'text-blue-600' : 'text-gray-500'

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col" aria-label="Navegação principal">
      {/* Logo */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">Grupo Elopar</h2>
            <p className="text-xs text-gray-500">Gestão de Profissionais</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Menu principal">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">Menu</p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <div key={item.href} className="relative">
              <Link href={item.href} className={navLinkClass(item.href)}>
                <span className={iconClass(item.href)}>{item.icon}</span>
                <span className="flex items-center gap-1">
                  {item.label}
                  {item.label === 'Renovações' && renewalBadge}
                </span>
              </Link>
            </div>
          )
        })}

        {/* Seções admin/gerente */}
        {isAdminOrManager && (
          <>
            {/* Analytics */}
            <div className="my-2 border-t border-gray-100" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">Analytics</p>

            <Link href="/area-usuario/metricas" className={navLinkClass('/area-usuario/metricas')}>
              <span className={iconClass('/area-usuario/metricas')}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </span>
              <span>Métricas</span>
            </Link>

            <Link href="/area-usuario/saude-testes" className={navLinkClass('/area-usuario/saude-testes')}>
              <span className={iconClass('/area-usuario/saude-testes')}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </span>
              <span>Saúde dos Testes</span>
            </Link>

            {/* Administração */}
            <div className="my-2 border-t border-gray-100" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-3 py-2">Administração</p>

            <Link href="/area-usuario/audit-log" className={navLinkClass('/area-usuario/audit-log')}>
              <span className={iconClass('/area-usuario/audit-log')}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
              </span>
              <span>Audit Log</span>
            </Link>

            {isAdmin && (
              <Link href="/area-usuario/gerenciar-usuarios" className={navLinkClass('/area-usuario/gerenciar-usuarios')}>
                <span className={iconClass('/area-usuario/gerenciar-usuarios')}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.038 9.038 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                </span>
                <span>Usuários</span>
              </Link>
            )}
          </>
        )}
      </nav>

      {/* Área do Usuário — rodapé da sidebar */}
      <div className="p-3 border-t border-gray-200">
        <Link
          href="/area-usuario"
          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
            pathname === '/area-usuario' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className={pathname === '/area-usuario' ? 'text-blue-600' : 'text-gray-500'}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </span>
          <span>Meu Perfil</span>
        </Link>
      </div>
    </aside>
  )
}
```

---

## Arquivo 2 — REESCREVER COMPLETO: `src/components/layout/mobile-menu.tsx`

`mobile-menu.tsx` também está truncado (184 linhas, corta no meio da seção Analytics).

**Ler o arquivo atual** com Read tool, identificar onde o conteúdo foi cortado, e completar o arquivo adicionando:

1. Mudar `{isAdmin && (` para `{isAdminOrManager && (` no bloco da seção Analytics
2. Atualizar `isAdminOrManager` para incluir `'manager'`:
   ```ts
   const isAdminOrManager = userRole === 'admin' || userRole === 'gerente' || userRole === 'manager'
   ```
3. Após o link de Métricas, adicionar link para Saúde dos Testes (mesmo padrão visual)
4. Adicionar nova seção "Administração" com Audit Log (isAdminOrManager) e Gerenciar Usuários (isAdmin)
5. Fechar todos os `<>` e `</nav>` pendentes corretamente

Os SVGs e classes são idênticos aos do sidebar.tsx acima.

---

## Comandos Git

```bash
cd elopar-webapp
git checkout main && git pull origin main
git checkout -b feat/nav-001-sidebar-admin-sections
git add \
  src/components/layout/sidebar.tsx \
  src/components/layout/mobile-menu.tsx
git commit -m "$(cat <<'EOF'
feat(nav): expor Métricas/Audit Log/Usuários na sidebar para admin+gerente

- sidebar.tsx: REESCRITO (arquivo estava truncado no disco)
  - Seção Analytics: Métricas + Saúde dos Testes → admin + gerente
  - Seção Administração: Audit Log (admin+gerente) + Usuários (admin)
  - isAdminOrManager inclui 'manager' além de 'admin'/'gerente'
- mobile-menu.tsx: mesmas alterações aplicadas

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin feat/nav-001-sidebar-admin-sections
gh pr create \
  --title "feat(nav): expor seções Admin/Analytics na sidebar" \
  --body "Funcionalidades implementadas (Métricas, Saúde dos Testes, Audit Log, Gerenciar Usuários) agora aparecem na sidebar lateral para usuários com role admin ou gerente. Antes estavam enterradas em Área do Usuário."
```

## DoD
- [ ] PR aberto com número
- [ ] Criar `DONE_nav-001-sidebar_07042026_[hh_mm].md` no inbox do gerente com número do PR
