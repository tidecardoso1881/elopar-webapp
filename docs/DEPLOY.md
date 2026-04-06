# Guia de Deploy — Gestão de Profissionais Elopar

Documentação técnica completa para configuração de ambiente, deploy em staging/produção e operação contínua do sistema.

---

## Índice

1. [Arquitetura de Deploy](#1-arquitetura-de-deploy)
2. [Setup Local (Desenvolvimento)](#2-setup-local-desenvolvimento)
3. [Variáveis de Ambiente](#3-variáveis-de-ambiente)
4. [Deploy em Staging](#4-deploy-em-staging)
5. [Deploy em Produção](#5-deploy-em-produção)
6. [CI/CD — GitHub Actions](#6-cicd--github-actions)
7. [Configuração do Supabase](#7-configuração-do-supabase)
8. [Runbook de Operações](#8-runbook-de-operações)
9. [Troubleshooting](#9-troubleshooting)
10. [Plano de Contingência](#10-plano-de-contingência)

---

## 1. Arquitetura de Deploy

```
GitHub (main) ──push──► Vercel (CI/CD automático)
                              │
                    ┌─────────┴─────────┐
                    │   Next.js App     │
                    │   (Edge/Node)     │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │   Supabase        │
                    │  (PostgreSQL +    │
                    │   Auth + Storage) │
                    └───────────────────┘
```

**Ambientes:**

| Ambiente | Branch | URL | Banco |
|----------|--------|-----|-------|
| Desenvolvimento | qualquer | localhost:3000 | Supabase (projeto compartilhado) |
| Preview (Staging) | feature/* / sprint-* | `*.vercel.app` auto-gerada | Supabase (projeto compartilhado) |
| Produção | main | URL customizada Vercel | Supabase (projeto compartilhado) |

---

## 2. Setup Local (Desenvolvimento)

### Pré-requisitos

- **Node.js** v20 ou superior — [download](https://nodejs.org)
- **npm** v10+ (incluído com Node.js)
- **Git** — [download](https://git-scm.com)
- Acesso ao projeto no Supabase (solicite ao responsável técnico)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/tidecardoso1881/elopar-webapp.git
cd elopar-webapp

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie o arquivo .env.local na raiz (veja seção 3)

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

O servidor inicia em [http://localhost:3000](http://localhost:3000).

### Verificação do ambiente

```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Rodar linter
npm run lint

# Rodar testes
npm run test
```

---

## 3. Variáveis de Ambiente

### Arquivo `.env.local` (desenvolvimento)

Crie na raiz do projeto baseado no arquivo `.env.example`:

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

Conteúdo do arquivo:

```env
# ─── Supabase ────────────────────────────────────────────────────────────────
# Encontre em: Supabase Dashboard > Project Settings > API

NEXT_PUBLIC_SUPABASE_URL=https://pzqxbiutlnssnlthlyay.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Guia completo de variáveis: veja `.env.example` no root do projeto.

> **Importante:** O arquivo `.env.local` está no `.gitignore` e **nunca** deve ser commitado.

### Variáveis no Vercel (staging e produção)

1. Acesse o painel do projeto em [vercel.com](https://vercel.com)
2. Vá em **Settings > Environment Variables**
3. Adicione as variáveis abaixo para os ambientes desejados:

| Variável | Ambiente | Descrição |
|----------|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview | Chave pública (anon key) |

> As variáveis prefixadas com `NEXT_PUBLIC_` são expostas ao browser — use **apenas** a anon key pública, nunca a service_role key.

---

## 4. Deploy em Staging (Preview)

O Vercel cria automaticamente um **Preview Deployment** para cada push em qualquer branch que não seja `main`.

### Como usar

```bash
# Faça push de qualquer branch
git push origin feature/minha-feature

# O Vercel irá:
# 1. Detectar o push automaticamente
# 2. Rodar: npm ci && npm run build
# 3. Publicar em uma URL como: elopar-webapp-abc123.vercel.app
# 4. Comentar a URL no PR do GitHub (se houver PR aberto)
```

### Acessando o Preview

- A URL aparece no painel do Vercel em **Deployments**
- Também aparece como comentário automático nos Pull Requests no GitHub
- Use para validar funcionalidades antes de mergear para `main`

---

## 5. Deploy em Produção

### Deploy automático (recomendado)

O deploy em produção ocorre automaticamente quando há push ou merge na branch `main`:

```
PR aprovado → Merge para main → Vercel detecta → Build → Deploy automático
```

### Deploy manual (emergência)

Caso precise forçar um novo deploy sem alterações de código:

1. Acesse [vercel.com](https://vercel.com) > seu projeto
2. Vá em **Deployments**
3. Clique nos `...` do deployment desejado
4. Selecione **Redeploy**

Ou via CLI Vercel:

```bash
# Instalar CLI (uma vez)
npm i -g vercel

# Login
vercel login

# Deploy de produção
vercel --prod
```

### Configuração de domínio customizado

1. Vercel Dashboard > seu projeto > **Settings > Domains**
2. Adicione o domínio desejado
3. Configure o DNS conforme instruções do Vercel (registro CNAME ou A)
4. O SSL/TLS é configurado automaticamente

---

## 6. CI/CD — GitHub Actions

O arquivo `.github/workflows/ci.yml` roda automaticamente em todo push e Pull Request:

```
Push / PR ──► typecheck ──► lint ──► test ──► build
```

| Etapa | Comando | O que verifica |
|-------|---------|----------------|
| typecheck | `tsc --noEmit` | Erros de tipos TypeScript |
| lint | `npm run lint` | Padrões de código (ESLint) |
| test | `npm run test` | Suítes Vitest (unit/integration) |
| build | `npm run build` | Build Next.js sem erros |

### Secrets necessários no GitHub

Configure em **Settings > Secrets and variables > Actions**:

| Secret | Valor |
|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key do Supabase |

---

## 7. Configuração do Supabase

### Projeto

- **Project ID:** `pzqxbiutlnssnlthlyay`
- **Dashboard:** [app.supabase.com](https://app.supabase.com)

### Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `clients` | 6 clientes do Grupo Elopar |
| `professionals` | Profissionais alocados (28 campos) |
| `equipment` | Equipamentos por profissional |
| `vacations` | Registros de férias |
| `profiles` | Usuários do sistema (role: admin/manager) |

### Views

| View | Descrição |
|------|-----------|
| `v_dashboard_kpis` | KPIs do dashboard (totais, alertas) |
| `v_client_summary` | Resumo por cliente (ativos, desligados, faturamento) |
| `v_renewal_alerts` | Profissionais com contrato próximo ao vencimento |

### Autenticação

O sistema usa **Supabase Auth** com email/senha. Para criar novos usuários administradores:

```sql
-- 1. Crie o usuário via Supabase Dashboard > Authentication > Users
-- 2. Após criar, atualize o perfil via SQL Editor:

UPDATE profiles
SET full_name = 'Nome Completo', role = 'admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'email@exemplo.com'
);
```

Papéis disponíveis:
- `admin` — acesso total (criar, editar, excluir)
- `manager` — acesso de leitura + edição limitada

### Row Level Security (RLS)

O RLS está habilitado em todas as tabelas. Usuários autenticados têm acesso conforme seu `role` definido na tabela `profiles`.

### Seed de dados

Para popular o banco com dados iniciais:

```bash
# Seed completo (profissionais + clientes)
npm run seed

# Apenas visualizar o que seria inserido (sem alterar banco)
npm run seed:dry

# Reset + repopulação completa (⚠️ apaga dados existentes)
npm run seed:reset
```

---

## 8. Runbook de Operações

### Checklist pré-deploy

- [ ] CI/CD passou (typecheck + lint + test + build)
- [ ] PR revisado e aprovado
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Testado no Preview Deployment
- [ ] Banco Supabase saudável (sem migrações pendentes)

### Monitoramento pós-deploy

Após cada deploy em produção, verifique:

1. **Status da build** — Vercel Dashboard > Deployments
2. **Login funcional** — acesse a URL de produção e faça login
3. **Dashboard carrega** — KPIs e tabelas renderizam corretamente
4. **Logs de erro** — Vercel Dashboard > Logs (filtrar por "error")

### Atualizações de banco (migrations)

Migrações são feitas diretamente pelo Supabase Dashboard (SQL Editor) ou via MCP Supabase. Não há migrations automatizadas via código neste projeto.

```sql
-- Exemplo: adicionar coluna
ALTER TABLE professionals ADD COLUMN nova_coluna TEXT;

-- Sempre documente em docs/04-sprints/sprintX/
```

### Rollback

**Rollback de deploy (Vercel):**
1. Vercel Dashboard > Deployments
2. Localize o deployment anterior (marcado como "Production")
3. Clique `...` > **Promote to Production**

**Rollback de banco de dados:**
- O Supabase (plano gratuito) tem Point-in-Time Recovery limitado
- Para rollback manual, use os backups diários em: Supabase Dashboard > Database > Backups
- Em caso de perda de dados: contate suporte Supabase ou restaure via seed

---

## 9. Troubleshooting

### Build falha com erro de TypeScript

```bash
# Rode localmente para identificar o erro
npx tsc --noEmit
```

Corrija os erros de tipo antes de fazer push.

### Build falha com erro de variável de ambiente

Sintoma: `Error: supabaseUrl is required`

Solução:
- Verifique se `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estão configuradas no Vercel
- No Vercel Dashboard > Settings > Environment Variables

### Erro de autenticação no login

Sintoma: Login retorna erro ou redireciona para `/login` em loop

Verificações:
1. Supabase URL e anon key corretos no `.env.local`
2. Email do usuário existe em Supabase > Authentication > Users
3. Usuário tem registro na tabela `profiles`
4. `SITE_URL` no Supabase Auth configurado para a URL correta (incluindo localhost para dev)

```sql
-- Verificar se o profile existe
SELECT * FROM profiles WHERE id = (
  SELECT id FROM auth.users WHERE email = 'seu@email.com'
);
```

### Dados não aparecem no dashboard

Sintoma: Dashboard carrega mas KPIs mostram zero

Verificações:
1. Rode o seed: `npm run seed`
2. Verifique as views no Supabase SQL Editor:
   ```sql
   SELECT * FROM v_dashboard_kpis;
   SELECT * FROM v_client_summary;
   ```
3. Verifique se o RLS está permitindo acesso (usuário logado com role correto)

### Preview Deployment não aparece no PR

Verificações:
1. O projeto Vercel está conectado ao repositório GitHub correto
2. A integração GitHub está ativa em Vercel > Settings > Git

### Erro 500 em produção

1. Acesse Vercel > seu projeto > **Logs**
   - **Runtime Logs:** erros durante execução da aplicação
   - **Build Logs:** erros durante o build (compile, types, etc.)
2. Filtre por "error" e identifique o stack trace
3. Verifique os logs comuns:
   - `supabaseUrl is required` → Falta `NEXT_PUBLIC_SUPABASE_URL` no Vercel
   - `supabaseKey is required` → Falta `NEXT_PUBLIC_SUPABASE_ANON_KEY` no Vercel
   - `Invalid JWT` → Anon key expirou ou está incorreta
   - `CORS error` → URL do Supabase não autorizada
4. Atualize variáveis se necessário e forçe um novo deploy
5. Se necessário, faça rollback (veja seção 8)

### Erro de CORS na página

Sintoma: Console do navegador mostra `Access-Control-Allow-Origin` header missing

Solução:
1. Supabase Dashboard > Authentication > URL Configuration
2. Verifique se a URL de produção (ou localhost:3000 para dev) está em **Allowed Redirect URLs**
3. Também adicione em **Site URL**
4. Aguarde ~5 minutos para propagação
5. Limpe cache do navegador (Ctrl+Shift+Delete) e teste novamente

### Logs de desenvolvimento local

Para ver logs detalhados durante `npm run dev`:

```bash
# Adicione variáveis de debug no .env.local
DEBUG=supabase:* npm run dev

# Ou em Windows (Git Bash):
DEBUG=supabase:* npm run dev
```

Isso exibirá logs detalhados de todas as chamadas ao Supabase.

### Acessar logs do Supabase

1. Supabase Dashboard > seu projeto > **Logs**
2. Selecione o tipo de log:
   - **Database** — queries SQL, erros de banco
   - **Auth** — eventos de autenticação, logins, resets de senha
   - **Storage** — uploads/downloads de arquivos
   - **API** — erros de API

Filtrar por timestamp ou erro específico ajuda a identificar problemas.

---

## 10. Plano de Contingência

### Cenário: Aplicação fora do ar

**Tempo alvo de restauração:** < 30 minutos

1. **Verificar status do Vercel:** [vercel-status.com](https://www.vercel-status.com)
2. **Verificar status do Supabase:** [status.supabase.com](https://status.supabase.com)
3. Se o problema for no deploy atual → **Rollback** (veja seção 8)
4. Se o problema for no Supabase → aguardar resolução ou abrir ticket
5. Comunicar equipe via canal interno

### Cenário: Dados corrompidos ou excluídos

1. Não faça mais alterações no banco
2. Acesse Supabase Dashboard > Database > Backups
3. Identifique o último backup válido
4. Restaure os dados afetados via SQL ou backup completo
5. Documente o incidente

### Cenário: Credenciais comprometidas

1. **Imediatamente:** Rotacione a anon key no Supabase (Settings > API > Regenerate)
2. Atualize `NEXT_PUBLIC_SUPABASE_ANON_KEY` no Vercel
3. Forçe um novo deploy: `vercel --prod`
4. Revogue sessões ativas no Supabase Auth (se necessário)
5. Audite logs de acesso

### Cenário: Build quebrado bloqueando deploys

1. Identifique o commit que quebrou o build via GitHub Actions
2. Reverta o commit: `git revert <hash>` e faça push
3. Ou crie um hotfix direto na branch `main` (apenas para emergências)

### Cenário: Usuários não conseguem fazer login

1. **Verificar Status do Supabase Auth:**
   - Supabase Dashboard > Authentication > Users
   - Verifique se o usuário existe
   - Se não existe, crie-o conforme seção 7 (Configuração do Supabase)

2. **Verificar SITE_URL no Supabase:**
   - Supabase Dashboard > Authentication > URL Configuration
   - `SITE_URL` deve apontar para a URL de produção (ex: `https://elopar.vercel.app`)
   - Para desenvolvimento local: adicione `http://localhost:3000` em **Allowed Redirect URLs**

3. **Verificar Variáveis de Ambiente:**
   - Vercel Dashboard > Settings > Environment Variables
   - `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` devem estar preenchidas

4. **Usuários criados via Supabase Dashboard:**
   - Após criar usuário no Supabase, sempre execute:
   ```sql
   UPDATE profiles
   SET full_name = 'Nome Completo', role = 'admin'
   WHERE id = (
     SELECT id FROM auth.users WHERE email = 'seu@email.com'
   );
   ```
   - Sem isso, o usuário não terá profile na tabela `profiles` e login falha

5. **Verificar RLS Policies:**
   - Supabase Dashboard > SQL Editor
   - Rode: `SELECT * FROM profiles WHERE id = auth.uid();`
   - Se retornar vazio, RLS está bloqueando. Verifique policies em Table Settings > RLS

---

## Contatos de Suporte

| Serviço | Documentação | Suporte |
|---------|-------------|---------|
| Vercel | [vercel.com/docs](https://vercel.com/docs) | [vercel.com/support](https://vercel.com/support) |
| Supabase | [supabase.com/docs](https://supabase.com/docs) | [supabase.com/support](https://supabase.com/support) |
| Next.js | [nextjs.org/docs](https://nextjs.org/docs) | [github.com/vercel/next.js](https://github.com/vercel/next.js) |

---

*Última atualização: Abril 2026 — Sprint 6*
