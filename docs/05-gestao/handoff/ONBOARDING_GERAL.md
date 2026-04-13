---
documento: Onboarding Único — Elopar Webapp
atualizado: 2026-04-07
versão: 3.0
leia: OBRIGATÓRIO antes de qualquer trabalho neste projeto
revisado-por: Especialista 2 (gaps 1-8 incorporados)
---

# Onboarding — Elopar Webapp

> Leia do início ao fim antes de tocar em qualquer arquivo.
> Este documento consolida todo o conhecimento do projeto, de E1 e E2.

---

## 🧭 O que é o Elopar

Plataforma web de **gestão de profissionais técnicos**: alocação em clientes, controle de férias e equipamentos, renovações de contrato, sistema de permissões por perfil.

**Stack:** Next.js 14+ App Router · TypeScript · Supabase · Tailwind CSS · Vercel
**Repositório:** `tidecardoso1881/elopar-webapp`
**Branch principal:** `main`
**Deploy:** Vercel — push em `main` dispara deploy automático

---

## 👤 Quem é quem

| Papel | Ferramenta | Função |
|---|---|---|
| **Tide** | Humano | Dono do produto — aprova, faz merge, valida em staging |
| **Gerente** | Claude Cowork (Sonnet) | PM — escreve tickets, gerencia filas, opera Supabase MCP |
| **Especialista 1** | Claude Code (Haiku) | Dev — executa `FILA_ESPECIALISTA_1.md` |
| **Especialista 2** | Claude Code (Haiku) | Dev — executa `FILA_ESPECIALISTA_2.md` |

**Regra crítica:** nunca executar `git` pelo Cowork. O sandbox Linux corrompe repositórios NTFS. Todo git é feito pelo Code ou pelo Git Bash do Tide.

---

## 📍 Como iniciar qualquer sessão

1. Ler este arquivo completo
2. Ler `docs/05-gestao/KANBAN.md` — estado atual
3. Identificar seu papel (E1 ou E2) e ler a fila correspondente
4. Ler o ticket com ▶️ e executar

---

## 📁 Estrutura de Diretórios

```
elopar-webapp/
├── src/
│   ├── app/
│   │   ├── (auth)/                  # Login, reset-password, update-password
│   │   └── (dashboard)/             # Páginas protegidas (Server Components async)
│   │       ├── profissionais/        # Lista + detalhe (abas: Dados / Histórico / Notas)
│   │       ├── clientes/             # Lista de clientes
│   │       ├── ferias/               # Registro de férias
│   │       ├── equipamentos/         # Lista de equipamentos
│   │       ├── notificacoes/         # Centro de notificações + alertas de renovação
│   │       └── area-usuario/
│   │           ├── page.tsx          # Profile card + Meu Perfil + Permissões
│   │           ├── perfil/           # Editar dados + foto de perfil
│   │           ├── permissoes/       # Matriz de permissões (read-only)
│   │           ├── metricas/         # KPIs — admin/gerente only
│   │           ├── saude-testes/     # Cobertura de testes — admin/gerente only
│   │           ├── audit-log/        # Log de ações — admin/gerente only
│   │           └── gerenciar-usuarios/  # CRUD de usuários — admin only
│   ├── components/
│   │   ├── layout/
│   │   │   ├── sidebar.tsx           # Nav lateral desktop (seções: Analytics + Admin)
│   │   │   ├── mobile-menu.tsx       # Drawer mobile (mesma estrutura do sidebar)
│   │   │   ├── header.tsx            # Barra superior + trigger do command palette
│   │   │   └── notification-bell.tsx
│   │   ├── profissionais/
│   │   │   ├── professionals-filters.tsx  # Filtros combinados + salvar filtro (âmbar)
│   │   │   └── professional-tabs.tsx      # Abas: Dados / Histórico / Notas
│   │   ├── gerenciar-usuarios/
│   │   │   └── novo-usuario-modal.tsx     # Modal criar usuário (admin/gerente/consulta)
│   │   └── ui/
│   │       └── command-palette.tsx        # Ctrl+K — busca global
│   ├── types/
│   │   └── roles.ts             # UserRole, canWrite(), isAdminRole(), getRoleLabel()
│   ├── actions/
│   │   └── users.ts             # updateProfile, uploadAvatar (server actions)
│   ├── proxy.ts                 # Middleware Next.js — guarda rotas por role
│   └── lib/supabase/            # Clientes SSR e browser
├── docs/
│   ├── 00-projeto/              # Specs, backlog, mockups
│   ├── 05-gestao/
│   │   ├── KANBAN.md            # Estado atual ← sempre ler
│   │   ├── handoff/             # Filas, onboarding
│   │   └── comunicacao/         # Inbox/outbox de cada especialista
└── CLAUDE.md                    # Instruções raiz
```

---

## 🔐 RBAC — Sistema de Permissões

### Roles na tabela `profiles` (coluna `role`)

| Valor no DB | Significado | O que pode |
|---|---|---|
| `'admin'` | Administrador | Tudo, incluindo gerenciar usuários |
| `'gerente'` | Gerente | Métricas, audit log, editar dados — sem gerenciar usuários |
| `'manager'` | Gerente (valor legado) | Mesmo que `'gerente'` — DB pode ter um ou outro |
| `'consulta'` | Somente leitura | Visualiza tudo, não edita nada — botões ocultos |

> ⚠️ Sempre trate `'gerente'` e `'manager'` como equivalentes:
> ```ts
> const isAdminOrManager = role === 'admin' || role === 'gerente' || role === 'manager'
> ```

### Funções prontas (`src/types/roles.ts`)

```typescript
canWrite(role)      // true → admin ou gerente. false → consulta
isAdminRole(role)   // true → apenas admin
getRoleLabel(role)  // 'Administrador' | 'Gerente' | 'Consulta'
```

### Padrão de guard em Server Component

```typescript
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
const { data: profile } = await supabase
  .from('profiles').select('role').eq('id', user!.id).single()

const userCanWrite = canWrite(profile?.role)
const isAdmin = isAdminRole(profile?.role)
const isAdminOrManager = profile?.role === 'admin'
  || profile?.role === 'gerente'
  || profile?.role === 'manager'
```

### O que cada role vê

| Seção | admin | gerente/manager | consulta |
|---|---|---|---|
| Dashboard, Profissionais, Clientes, Férias, Equipamentos, Notificações | ✅ | ✅ | ✅ |
| Botões de criar/editar/deletar | ✅ | ✅ | ❌ ocultos |
| Analytics: Métricas + Saúde dos Testes | ✅ | ✅ | ❌ |
| Administração: Audit Log | ✅ | ✅ | ❌ |
| Administração: Gerenciar Usuários | ✅ | ❌ | ❌ |

---

## ⚠️ NTFS Truncation — Problema Crítico Resolvido

Arquivos escritos pelo sandbox Linux em NTFS (Windows) foram truncados. O arquivo parece válido mas o JSX está incompleto — causa erro de compilação.

**Todos os arquivos afetados já foram reconstruídos no `main`:**

| Arquivo | PR que reconstruiu |
|---|---|
| `sidebar.tsx` | #108 |
| `mobile-menu.tsx` | #108 |
| `professionals-filters.tsx` | #107 |
| `area-usuario/page.tsx` | #99 |
| `gerenciar-usuarios/page.tsx` | #102 + #104 |
| `actions/users.ts` | #103 |
| `proxy.ts` | #109 |

**Se encontrar um arquivo truncado novo:** não edite com diff parcial. Reescreva o arquivo completo.

---

## 🌿 Workflow Git

```bash
# 1. Sempre partir do main atualizado
git checkout main && git pull origin main
git checkout -b tipo/nome-do-ticket

# 2. Implementar. Antes de commitar:
npx tsc --noEmit   # ZERO erros — obrigatório
npm run lint       # ZERO warnings — obrigatório

# 3. Commitar (nunca git add -A sem revisar)
git add src/arquivo/especifico.tsx
git commit -m "$(cat <<'EOF'
tipo(TICKET): descrição clara

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"

# 4. Push e PR
git push origin tipo/nome-do-ticket
gh pr create --title "tipo(TICKET): título" --body "Descrição"
```

**Prefixos:** `feat` · `fix` · `refactor` · `chore`
**Nunca:** push direto em `main` · `git add -A` sem revisar · pular `tsc --noEmit`

---

## 📬 Protocolo de Comunicação

```
docs/05-gestao/comunicacao/
  especialista-1/inbox/    ← gerente escreve tickets para E1
  especialista-1/done/     ← E1 escreve ao concluir
  especialista-2/inbox/    ← gerente escreve tickets para E2
  especialista-2/done/     ← E2 escreve ao concluir
  gerente/inbox/           ← especialistas escrevem ao gerente
```

| Situação | Ação |
|---|---|
| Concluiu | `DONE_[assunto]_[ddmmaaaa]_[hh_mm].md` em `especialista-X/done/` com número do PR |
| Bloqueado | `BLOCK_[assunto]_[ddmmaaaa]_[hh_mm].md` em `gerente/inbox/` e parar |
| Fila vazia | Mensagem em `gerente/inbox/` e aguardar |

---

## ✅ Histórico Completo de Entregas

### E1 — Especialista 1

| Ticket | Título | PR |
|---|---|---|
| E1-A | Conflito PR68 header.tsx | ✅ merged |
| E1-D | Guard novo profissional | ✅ done |
| E1-E | Guard editar profissional | PR #71 ✅ |
| E1-F | Hard delete profissional | PR #77 ✅ |
| E1-G | Guard férias (novo + editar) | PR #78 ✅ |
| E1-H | Hook useSavedFilters | PR #85 ✅ |
| E1-I | Remover logo duplicado | PR #87 ✅ |
| E1-J | Matriz de permissões | PR #89 ✅ |
| E1-K | BUG-002 — area-usuario/page.tsx truncado | PR #99 ✅ |
| E1-L | BUG-001 — /equipamentos Suspense fallback | PR #100 ✅ |
| E1-M | BUG-003 — /gerenciar-usuarios reconstruído | PR #102 + #104 ✅ |
| E1-N | BUG-004 — upload avatar (bucket + users.ts) | PR #103 ✅ |
| E1-P | Header — remover "Gerenciar Usuários" do dropdown | PR #105 ✅ |
| E1-Q | RBAC — perfil "Consulta" somente leitura | PR #106 ✅ |
| E1-R | NAV-003 — filtros reconstruídos + botão salvar âmbar | PR #107 ✅ |

### E2 — Especialista 2

| Ticket | Título | PR |
|---|---|---|
| E2-A | Histórico integração | ✅ done |
| E2-B | Offline page | ✅ done |
| E2-C | Professional actions RBAC | PR #70 ✅ |
| E2-D | Guard clientes | PR #73 ✅ |
| E2-E | Guard equipamentos | PR #75 ✅ |
| E2-F | Perfil dropdown links (header) | PR #76 ✅ |
| E2-G | Perfil page + action updateProfile | PR #79 ✅ |
| E2-H | Avatar upload | PR #82 ✅ |
| E2-J | Consolida Perfil Completo | PR #84 ✅ |
| E2-I | Saved Filters UI | ✅ merged |
| E2-K | EP-015 — command palette + header.tsx | PR #101 ✅ |
| E2-L | NAV-001 — sidebar + mobile-menu (seções Admin/Analytics) | PR #108 ✅ |
| E2-M | NAV-002 — proxy.ts reescrito + métricas por role | PR #109 ✅ |

---

## 📊 Estado das Funcionalidades (07/04/2026)

Todos os EPs do backlog foram entregues. Único item em andamento:

| Ticket | Especialista | Status |
|---|---|---|
| E2-N | E2 | NAV-004 — simplificar area-usuario/page.tsx (aguarda merge PR #108) |

---

## 🔧 Setup Local (primeiro acesso)

```bash
# 1. Clonar
git clone https://github.com/tidecardoso1881/elopar-webapp.git
cd elopar-webapp

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env.local
# Preencher .env.local com as credenciais do Supabase (pedir ao Tide)

# 4. Rodar em desenvolvimento
npm run dev   # http://localhost:3000
```

---

## 🔑 Variáveis de Ambiente

| Variável | Onde usar | Observação |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Chave pública (pode expor) |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Não usar | Eliminada — substituída por RPC SECURITY DEFINER |

> ⚠️ **NUNCA commitar `.env.local`**. Está no `.gitignore`.
> Em produção: Vercel → Settings → Environment Variables.
> `SUPABASE_SERVICE_ROLE_KEY` foi **eliminada do código** — a página `/gerenciar-usuarios` usa RPC `get_users_for_admin` com SECURITY DEFINER, sem precisar da service role key.

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas principais

| Tabela | Descrição | RLS |
|---|---|---|
| `profiles` | Dados do usuário logado (role, nome, avatar_url) | Usuário lê próprio registro; admin lê todos via RPC |
| `professionals` | Profissionais cadastrados | Autenticado lê; write via server actions |
| `clients` | Clientes da empresa | Autenticado lê; write via server actions |
| `equipments` | Equipamentos alocados | Autenticado lê; write via server actions |
| `vacation_requests` | Registros de férias | Autenticado lê; write via server actions |
| `audit_logs` | Log de ações (quem fez o quê) | Apenas admin/gerente lê |
| `test_health_logs` | Histórico de saúde dos testes | Apenas admin/gerente lê |

### RPC crítico

```sql
-- Usado por /gerenciar-usuarios para listar todos os usuários
-- SECURITY DEFINER = roda com permissão do owner, bypassa RLS
get_users_for_admin()
```

### Como acessar o console
Supabase project: ver `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`
Dashboard: [app.supabase.com](https://app.supabase.com)

---

## 🚀 Deploy e Branches

| Branch | Comportamento |
|---|---|
| `main` | Deploy automático no Vercel → produção |
| `feat/*`, `fix/*` | Preview URL gerada automaticamente pelo Vercel |
| Qualquer outra | Preview URL gerada |

**Quem pode mergear:** apenas Tide (via Git Bash ou GitHub UI).
**Requer review?** Não formalmente — mas sempre abrir PR, nunca push direto em `main`.

---

## ✅ Estratégia de Testes

| Tipo | Ferramenta | Quando escrever |
|---|---|---|
| Unit | Vitest (`npm run test`) | Funções puras, server actions, utilitários |
| E2E | Playwright (`npm run test:e2e`) | Fluxos críticos: login, criar profissional, permissões |

Coverage mínimo esperado: monitorado no Dashboard de Saúde dos Testes (`/area-usuario/saude-testes`).
CI/CD: GitHub Actions configurado — roda `tsc + lint + test` a cada PR.

---

## 🆘 Troubleshooting

| Problema | Solução |
|---|---|
| Arquivo JSX termina no meio / erro de compilação | NTFS truncation — reescrever o arquivo completo (ver seção NTFS acima) |
| `tsc --noEmit` com erro de tipo | Corrigir o erro — nunca ignorar com `@ts-ignore` sem aprovação |
| Build falha com cache sujo | `rm -rf .next && npm run build` |
| Next.js não reflete mudança | Reiniciar dev server: `Ctrl+C` → `npm run dev` |
| Supabase retorna 401 | Verificar `.env.local` — chaves podem ter expirado |
| `/gerenciar-usuarios` dá erro | Verificar se RPC `get_users_for_admin` existe no Supabase com SECURITY DEFINER |

---

## ⚙️ Comandos Úteis

```bash
npm run dev          # Dev server (porta 3000)
npm run build        # Build de produção
npm run test         # Vitest (unit)
npm run test:e2e     # Playwright (E2E)
npx tsc --noEmit     # Type check sem build — rodar antes de todo commit
npm run lint         # ESLint
rm -rf .next         # Limpar cache Next.js
```
