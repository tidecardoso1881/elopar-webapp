---
de: Gerente (Cowork)
para: Especialista 1 (Haiku)
data: 2026-04-07
tipo: TICKET
prioridade: NORMAL
---

# TICKET — Perfil "Consulta": adicionar ao modal + ocultar botões de edição

## Contexto
Novo perfil de acesso `consulta`: leitura em Dashboard/Profissionais/Clientes/Renovações/Férias/Notificações, sem permissão de criar/editar/excluir nada.

`src/types/roles.ts` já existe com `canWrite()` — profissionais/page.tsx já usa corretamente.
Faltam: adicionar opção no modal de criação, validar no action, e guards nas páginas de clientes e férias.

---

## Arquivo 1 — `src/components/gerenciar-usuarios/novo-usuario-modal.tsx`

Localizar o bloco do `<select name="role">` (linhas 84–93 aprox) e substituir:

**DE:**
```tsx
                  <option value="" disabled>Selecione o perfil...</option>
                  <option value="admin">Admin — acesso total ao sistema</option>
                  <option value="manager">Manager — visualização e gestão operacional</option>
```

**PARA:**
```tsx
                  <option value="" disabled>Selecione o perfil...</option>
                  <option value="admin">Admin — acesso total ao sistema</option>
                  <option value="manager">Manager — visualização e gestão operacional</option>
                  <option value="consulta">Consulta — somente leitura (sem edição)</option>
```

Também atualizar o `<p>` de dica logo abaixo:

**DE:**
```tsx
                <p className="text-xs text-gray-400 mt-1">Admin tem acesso à Área do Usuário e Gerenciar Usuários.</p>
```

**PARA:**
```tsx
                <p className="text-xs text-gray-400 mt-1">Admin tem acesso à Área do Usuário e Gerenciar Usuários. Consulta só visualiza — sem criar, editar ou excluir.</p>
```

---

## Arquivo 2 — `src/app/(dashboard)/area-usuario/gerenciar-usuarios/actions.ts`

Localizar linha:
```ts
  if (!['admin', 'manager'].includes(role)) return { success: false, error: 'Perfil inválido' }
```

Substituir por:
```ts
  if (!['admin', 'manager', 'consulta'].includes(role)) return { success: false, error: 'Perfil inválido' }
```

---

## Arquivo 3 — `src/app/(dashboard)/ferias/page.tsx`

**Passo 1** — adicionar import no topo (junto aos outros imports):
```ts
import { canWrite } from '@/types/roles'
```

**Passo 2** — dentro de `FeriasPage`, após `const supabase = await createClient()`, adicionar:
```ts
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id ?? '')
    .single()
  const userCanWrite = canWrite(userProfile?.role)
```

**Passo 3** — envolver o `<Link href="/ferias/novo" ...>` com condicional:

**DE:**
```tsx
        <Link
          href="/ferias/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Registro
        </Link>
```

**PARA:**
```tsx
        {userCanWrite && (
          <Link
            href="/ferias/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Novo Registro
          </Link>
        )}
```

---

## Arquivo 4 — `src/app/(dashboard)/clientes/page.tsx`

**Passo 1** — adicionar imports no topo:
```ts
import { canWrite } from '@/types/roles'
```

**Passo 2** — dentro de `ClientesPage()`, após `const supabase = await createClient()`, adicionar:
```ts
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id ?? '')
    .single()
  const userCanWrite = canWrite(userProfile?.role)
```

**Passo 3** — envolver o botão "Novo" (Link href="/clientes/novo") com condicional:

**DE:**
```tsx
        <Link
          href="/clientes/novo"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all min-h-10"
        >
          <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Novo</span>
        </Link>
```

**PARA:**
```tsx
        {userCanWrite && (
          <Link
            href="/clientes/novo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all min-h-10"
          >
            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Novo</span>
          </Link>
        )}
```

**Passo 4** — passar `userCanWrite` para os botões de editar/excluir por cliente.

Localizar o bloco dos action buttons (dentro do `.map()` de cada cliente):
```tsx
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link
                      href={`/clientes/${client.client_id}/editar`}
                      title="Editar cliente"
                      className="inline-flex items-center justify-center h-8 w-8 sm:h-8 sm:w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors min-h-10"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                    </Link>
                    <ClientDeleteButton id={client.client_id} name={client.client_name} />
                  </div>
```

Substituir por:
```tsx
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {userCanWrite && (
                      <>
                        <Link
                          href={`/clientes/${client.client_id}/editar`}
                          title="Editar cliente"
                          className="inline-flex items-center justify-center h-8 w-8 sm:h-8 sm:w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors min-h-10"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                          </svg>
                        </Link>
                        <ClientDeleteButton id={client.client_id} name={client.client_name} />
                      </>
                    )}
                  </div>
```

---

## Comandos Git

```bash
cd elopar-webapp
git checkout main && git pull origin main
git checkout -b feat/perfil-consulta-rbac
git add \
  src/components/gerenciar-usuarios/novo-usuario-modal.tsx \
  src/app/\(dashboard\)/area-usuario/gerenciar-usuarios/actions.ts \
  src/app/\(dashboard\)/ferias/page.tsx \
  src/app/\(dashboard\)/clientes/page.tsx
git commit -m "$(cat <<'EOF'
feat(rbac): adicionar perfil consulta com acesso somente leitura

- Novo Usuário modal: opção Consulta no dropdown de perfil
- actions.ts: valida role consulta como permitido
- ferias/page.tsx: oculta botão Novo Registro para consulta
- clientes/page.tsx: oculta Novo + Editar + Excluir para consulta

roles.ts e profissionais/page.tsx já tinham canWrite() implementado.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
git push origin feat/perfil-consulta-rbac
gh pr create \
  --title "feat(rbac): perfil consulta — somente leitura" \
  --body "Adiciona perfil 'Consulta' ao sistema de acesso. Usuários consulta enxergam todas as páginas mas não vêem botões de criar/editar/excluir em clientes e férias. Profissionais já estava protegido."
```

## DoD
- [ ] PR aberto com número
- [ ] Criar `DONE_perfil-consulta-rbac_07042026_[hh_mm].md` no inbox do gerente com número do PR
