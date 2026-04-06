# EP-NEW-001 — Fix: Esqueci Minha Senha (Prod)

> Data: 06/04/2026 | Análise E2E completa confirmou bugs. Fixes já aplicados nos arquivos.

---

## Resumo do Problema

O fluxo de recuperação de senha **nunca funcionou em produção**. Análise dos logs Supabase confirmou zero chamadas ao endpoint `/auth/v1/recover`.

Foram encontrados **2 bugs no código** + **1 configuração faltante no Supabase Dashboard**.

---

## Fixes Já Aplicados (commit pendente)

### Fix 1 — `src/middleware.ts` criado
O arquivo `src/proxy.ts` existia com a lógica de proteção de rotas, mas nunca foi conectado ao Next.js. O Next.js só reconhece middleware via arquivo `middleware.ts` na raiz ou em `src/`.

**Arquivo criado:** `src/middleware.ts`
```typescript
export { proxy as middleware, config } from './proxy'
```

### Fix 2 — `src/app/(auth)/reset-password/actions.ts` corrigido
O `origin` header pode ser `null` em Server Actions no Vercel, fazendo o `redirectTo` apontar para `http://localhost:3000` em produção.

**Antes:**
```typescript
const origin = headersList.get('origin') ?? 'http://localhost:3000'
```

**Depois:**
```typescript
const appUrl = process.env.NEXT_PUBLIC_APP_URL
const forwardedHost = headersList.get('x-forwarded-host')
const host = headersList.get('host')
const derivedOrigin = forwardedHost
  ? `https://${forwardedHost}`
  : host?.includes('localhost')
    ? `http://${host}`
    : host
      ? `https://${host}`
      : 'http://localhost:3000'
const origin = appUrl ?? derivedOrigin
```

---

## Ação Manual Necessária (Tide faz)

### 1. Vercel — Adicionar variável de ambiente

No painel Vercel → Settings → Environment Variables:
```
NEXT_PUBLIC_APP_URL=https://elopar-webapp.vercel.app
```
Aplicar em: **Production**, **Preview**, e **Development**.

### 2. Supabase Dashboard — Whitelist de Redirect URL

Em: **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**

Adicionar:
```
https://elopar-webapp.vercel.app/**
```

Isso permite que Supabase aceite o `redirectTo` com `/auth/callback?next=/update-password`.

> **Sem isso**, o Supabase rejeita o `redirectTo` e o email não é enviado (silent fail).

---

## Checklist para Tide

- [ ] Commit e push dos 2 arquivos modificados:
  - `src/middleware.ts` (novo)
  - `src/app/(auth)/reset-password/actions.ts` (corrigido)
- [ ] Adicionar `NEXT_PUBLIC_APP_URL` no Vercel
- [ ] Adicionar `https://elopar-webapp.vercel.app/**` no Supabase Redirect URLs
- [ ] Fazer deploy (push para main)
- [ ] Testar fluxo completo: `/reset-password` → receber email → clicar link → `/update-password` → login com nova senha

---

## Fluxo Correto (após fixes)

```
1. Usuário em /reset-password → digita email → submit
2. Server Action chama supabase.auth.resetPasswordForEmail()
   redirectTo = https://elopar-webapp.vercel.app/auth/callback?next=/update-password
3. Supabase envia email com link contendo ?code=XXXX
4. Usuário clica no link → /auth/callback?code=XXXX&next=/update-password
5. Route Handler troca code por sessão (exchangeCodeForSession)
6. Redirect para /update-password
7. Usuário digita nova senha → updateUser({ password })
8. Redirect para /login
```
