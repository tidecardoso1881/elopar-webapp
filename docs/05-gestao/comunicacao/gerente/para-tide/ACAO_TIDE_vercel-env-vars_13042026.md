---
para: Tide
de: Gerente
data: 2026-04-13
tipo: AÇÃO MANUAL NECESSÁRIA
---

# Verificar Env Vars no Painel Vercel

> Isso não pode ser feito pelos agentes — precisa de login no dashboard Vercel.

## O que verificar

Acessar: https://vercel.com → projeto `elopar-webapp` → Settings → Environment Variables

Confirmar que as seguintes estão configuradas para **Production** (e opcionalmente Preview):

| Variável | Obrigatória | Observação |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Sim | URL pública do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Sim | Chave anon (pública) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Sim | Chave service role (secreta) |
| `NEXTAUTH_URL` | Verificar | URL de produção do app |
| `NEXTAUTH_SECRET` | Verificar | Secret de sessão |

## O que remover (limpeza)

- `METRICS_ALLOWED_EMAIL` — já foi migrado para role-based em PR #109. Pode remover do Vercel se ainda estiver lá.

## Depois de confirmar

Avisar o Gerente (Cowork) para liberar o deploy final.
