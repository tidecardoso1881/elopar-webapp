---
titulo: "Aprendizado do Projeto Elopar — Documentação Especialista 2"
autor: "Especialista 1 (Haiku)"
data: 2026-04-07
uso: "Leitura obrigatória para especialistas novos no projeto"
---

# 📚 Aprendizado do Projeto Elopar

Documento gerado por Especialista 1 com aprendizados acumulados trabalhando nos tickets E1-A até E1-G.

---

## 🏗️ Visão Geral da Arquitetura

**Stack:**
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Deploy**: Vercel (auto-deploy via push em main)
- **Auditing**: Tabela `audit_log` com trigger PL/pgSQL
- **Auth**: Supabase Auth SSR via `createClient()` no servidor

**Estrutura de Diretórios:**
```
src/
  app/                    # Next.js App Router
    (auth)/              # Auth pages (login, register)
    (dashboard)/         # Protected pages (após login)
      profissionais/     # CRUD de profissionais
      ferias/           # CRUD de férias
      clientes/         # CRUD de clientes
      equipamentos/     # CRUD de equipamentos
      area-usuario/     # Perfil, configurações
  components/           # React components reutilizáveis
    layout/            # Header, Footer, Layout
    profissionais/     # Componentes de profissionais
  lib/
    supabase/         # Cliente Supabase (server + client)
    auth-check.ts     # Helper requireWriteAccess()
    audit.ts          # logAudit()
    errors.ts         # handleActionError()
  types/
    roles.ts          # RBAC: canWrite(), canRead(), etc
    database.ts       # Tipos gerados do Supabase

docs/
  00-projeto/         # Specs, brainstorms
  01-arquitetura/     # ADRs, decisões arquiteturais
  04-sprints/         # Histórico de sprints
  05-gestao/
    KANBAN.md        # Estado atual do projeto
    handoff/         # Filas de trabalho (FILA_ESPECIALISTA_*.md)
```

---

## 🔐 RBAC — Roles e Permissões

**Três roles no sistema:**
1. **admin** — acesso total, inclui hard delete
2. **gerente** — CRUD completo de profissionais, férias, clientes, equipamentos
3. **consulta** — read-only, sem botões de ação

**Implementação:**

```typescript
// src/types/roles.ts
export function canWrite(role?: string): boolean {
  return role === 'admin' || role === 'gerente'
}

export function canRead(role?: string): boolean {
  return !!role  // qualquer role autenticado pode ler
}
```

**Padrão de Guard em Page Routes:**
```typescript
// src/app/(dashboard)/profissionais/novo/page.tsx
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

**Padrão de Permissão em Server Actions:**
```typescript
export async function createProfessional(...) {
  const authResult = await requireWriteAccess()
  if (authResult.error) return { error: authResult.error }
  // ... resto do código
}
```

**Padrão de Hard Delete (admin-only):**
```typescript
if (profile?.role !== 'admin') {
  return { error: 'Apenas administradores podem excluir permanentemente.' }
}
```

---

## 📝 Audit Log — Rastreamento de Alterações

**Como funciona:**
- Toda mudança (CREATE, UPDATE, DELETE) é registrada automaticamente
- Triggers no Supabase disparam a função `handle_audit_log()`
- Armazena: entidade, entidade_id, ação, dados_antes, dados_depois, timestamp, usuário

**Server Actions sempre fazem:**
```typescript
await logAudit({
  entidade: 'professional',
  entidade_id: id,
  acao: 'CREATE',  // ou UPDATE, DELETE
  dados_antes: null,  // ou objeto anterior
  dados_depois: created as Record<string, unknown>,
})
```

**Visualizar histórico:**
- Tabela `audit_log` em Supabase
- Página `/profissionais/[id]` mostra "Histórico de Alterações"

---

## 🔄 Server Actions — Padrão CRUD

**Estrutura sempre igual:**

1. **Autenticação** → `requireWriteAccess()`
2. **Coleta FormData** → tipo específico (ex: `ProfessionalFormData`)
3. **Validação** → `validateProfessionalData()`
4. **Parsing** → `buildProfessionalPayload()` (conversão de tipos)
5. **DB Query** → `supabase.from('tabela').insert/update/delete()`
6. **Audit Log** → `logAudit()` com dados_antes/depois
7. **Revalidação** → `revalidatePath()` para limpar cache
8. **Redirecionamento** → `redirect()` ou retorna `{ success: true }`

**Exemplo: updateProfessional()**
```typescript
export async function updateProfessional(
  id: string,
  _prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  // 1. Auth
  const authResult = await requireWriteAccess()
  if (authResult.error) return { error: authResult.error }

  // 2. Coleta
  const data: ProfessionalFormData = {
    name: formData.get('name') as string,
    // ... resto dos campos
  }

  // 3. Validação
  const validationError = validateProfessionalData(data)
  if (validationError) return { error: validationError }

  // 4. Parsing
  const payload = buildProfessionalPayload(data)

  // 5. Captura estado anterior para audit
  const { data: antes } = await supabase
    .from('professionals')
    .select()
    .eq('id', id)
    .single()

  // 6. Update
  const { error } = await supabase
    .from('professionals')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('[updateProfessional]', error)
    return { error: handleActionError(error) }
  }

  // 7. Audit
  await logAudit({
    entidade: 'professional',
    entidade_id: id,
    acao: 'UPDATE',
    dados_antes: antes as Record<string, unknown> | null,
    dados_depois: { ...payload, id } as Record<string, unknown>,
  })

  // 8. Revalidação
  revalidatePath('/profissionais')
  revalidatePath(`/profissionais/${id}`)
  redirect(`/profissionais/${id}`)
}
```

---

## 🎯 Padrão de Componentes — UI Condicional por Role

**Header sempre mostra:**
- Logo + busca à esquerda
- Dropdown de usuário à direita

**ProfessionalActions component:**
```typescript
interface ProfessionalActionsProps {
  id: string
  name: string
  status: string
  canEdit: boolean    // gerente ou admin
  isAdmin: boolean    // apenas admin
}

export function ProfessionalActions({ 
  id, name, status, canEdit, isAdmin 
}: ProfessionalActionsProps) {
  // Botão "Editar" apenas se canEdit
  // Botão "Desligar" apenas se canEdit (soft delete)
  // Botão "Excluir" apenas se isAdmin (hard delete) com modal vermelho
}
```

**Chamada:**
```typescript
<ProfessionalActions
  id={prof.id}
  name={prof.name}
  status={prof.status}
  canEdit={currentRole === 'admin' || currentRole === 'gerente'}
  isAdmin={currentRole === 'admin'}
/>
```

---

## 🚀 Fluxo de Desenvolvimento — GitFlow

**Regras:**
- Nunca commitar direto em `main`
- Criar branch: `git checkout -b feature/ep-new-XXX`
- Sempre fazer: `git fetch origin && git merge origin/main` antes de PR

**Antes de PR (checklist):**
- [ ] `npx tsc --noEmit` — sem erros de tipo
- [ ] `npm run lint` — sem warnings
- [ ] `npm run build` — build local ok
- [ ] Testado manualmente (ou E2E)

**Commit:**
```bash
git add <arquivos específicos>
git commit -m "feat(EP-XXX): descrição clara

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

**Push + PR:**
```bash
git push origin feature/ep-new-XXX
gh pr create --title "feat(EP-XXX): título" --body "..."
```

---

## 🐛 Armadilhas e Lições Aprendidas

### 1. **Server vs Client Components**
- ❌ Não use `'use client'` em pages (usa componentes client internos)
- ✅ Pages são server components por padrão
- ✅ Componentes com `onClick`, `useState`, `useTransition` precisam de `'use client'`

### 2. **Async Pages e Params**
- ✅ Pages podem ser async
- ✅ `params` vem como `Promise<{ id: string }>`
- ❌ Não desestruture direto: `async function Page({ params: { id } })`
- ✅ Desestruture no corpo: `const { id } = await params`

### 3. **FormData em Server Actions**
- ✅ Sempre use `formData.get('fieldName') as string`
- ✅ Números vazios ou undefined → parse como null
- Helper `parseOptionalNumber()` converte "," para "." e trata NaN

### 4. **Validação de Datas**
```typescript
const dateRegex = /^\d{4}-\d{2}-\d{2}$/
if (!dateRegex.test(renewal_deadline)) return { error: '...' }
const date = new Date(renewal_deadline)
if (isNaN(date.getTime())) return { error: '...' }
```

### 5. **Revalidação de Cache**
- ✅ Sempre chamar `revalidatePath()` após mutações
- ✅ Revalidar o index (`/profissionais`) E a página específica (`/profissionais/123`)
- ❌ Não esquecer ou dados ficam stale

### 6. **Conflitos em PRs Paralelas**
- Quando múltiplos PRs tocam o mesmo arquivo (ex: `profissionais/[id]/page.tsx`):
  - Merge main localmente: `git merge origin/main`
  - Resolva conflicts manualmente
  - Push de novo para a branch
  - PR vai refletir resolução

### 7. **Hard Delete vs Soft Delete**
- **Soft Delete** (deleteProfessional): `status: 'DESLIGADO'` — reversível
- **Hard Delete** (hardDeleteProfessional): remove linhas + FK cascade — irreversível
- Hard delete requer `admin` role
- Sempre registre dados_antes no audit log antes de hard delete

### 8. **Modal de Confirmação**
- Botão principal em vermelho com bg-red-600
- Mensagem clara: "esta ação é irreversível"
- Sempre mostrar o que vai ser deletado: "O profissional {name}..."
- Modal com `fixed inset-0 z-50` para sobrepor conteúdo

---

## 📊 Tipos Comuns

**Professional:**
```typescript
{
  id: string
  name: string
  status: 'ATIVO' | 'DESLIGADO'
  email?: string
  manager?: string
  contact?: string
  client_id: string
  hourly_rate?: number
  date_start?: string
  date_end?: string
  renewal_deadline?: string
  // ... 20+ campos
  created_at: string
  updated_at: string
}
```

**Vacation:**
```typescript
{
  id: string
  professional_id: string
  professional_name: string
  start_date: string
  end_date: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}
```

**Profile (user):**
```typescript
{
  id: string  // user.id do Supabase Auth
  role: 'admin' | 'gerente' | 'consulta'
  avatar_url?: string
  // ... outros campos
}
```

---

## 🔍 Debug Tips

**Log em Server Action:**
```typescript
console.error('[functionName]', error)  // aparece em `npm run dev` ou Vercel logs
```

**Verificar user autenticado:**
```bash
// No Supabase console
SELECT * FROM auth.users WHERE email = 'seu@email.com';
SELECT * FROM profiles WHERE id = 'user-id';
```

**Limpar cache local:**
```bash
rm -rf .next/
npm run build  # rebuilda tudo
```

**Testar FormData:**
```typescript
const data = {
  name: formData.get('name'),
  os: formData.get('os'),
  // ... todos os campos
}
console.log(JSON.stringify(data, null, 2))
```

---

## 📚 Referências Rápidas

| Documento | Uso |
|---|---|
| `CLAUDE.md` | Instruções do projeto + workflow git |
| `KANBAN.md` | Estado atual, WIP limits, prioridades |
| `FILA_ESPECIALISTA_1.md` / `2.md` | Filas de trabalho (ordem de execução) |
| `.env.local` | Credenciais Supabase (não commitar) |
| `docs/01-arquitetura/` | Decisões arquiteturais (ADRs) |
| `src/lib/auth-check.ts` | Helpers de autenticação |
| `src/lib/audit.ts` | Função logAudit() |

---

## ✅ Checklist para Próximo Ticket

Ao receber um novo ticket, siga:

- [ ] Ler ticket completo em `FILA_ESPECIALISTA_2.md`
- [ ] `git fetch origin && git merge origin/main`
- [ ] `git checkout -b feature/ep-new-XXX`
- [ ] Implementar código
- [ ] `npx tsc --noEmit` → sem erros
- [ ] `npm run lint` → sem warnings
- [ ] `npm run build` → ok
- [ ] Testar manualmente
- [ ] Adicionar imports, types, audit log se necessário
- [ ] Commit com co-author
- [ ] Push para branch
- [ ] `gh pr create` com descrição clara
- [ ] Atualizar FILA_ESPECIALISTA_2.md

---

**Bom trabalho! Qualquer dúvida, consulte este arquivo ou leia o código já implementado nos commits recentes.**

Especialista 1
2026-04-07
