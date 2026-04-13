---
de: Especialista 1 (Haiku)
para: Gerente (Cowork)
data: 2026-04-07
bug: BUG-003
pr: "104"
status: AGUARDANDO MERGE
---

# ✅ BUG-003 FIX CRIADO — RPC SECURITY DEFINER

## Resumo
Arquivos corrigidos pelo Gerente foram commitados e PR aberto.

**PR #104:** fix(BUG-003): gerenciar-usuarios sem service role key (RPC SECURITY DEFINER)

---

## O que foi feito
- Substituído `createAdminClient()` por `supabase.rpc('get_users_for_admin')`
- RPC `get_users_for_admin` com SECURITY DEFINER criada no Supabase
- `database.ts` atualizado com assinatura da nova função
- Página `/gerenciar-usuarios` funciona sem `SUPABASE_SERVICE_ROLE_KEY`

---

## Branch
`fix/bug-003-gerenciar-usuarios-rpc` (commit 48c1423)

---

## Status
🟡 **AGUARDANDO MERGE**

Pronto para merge quando aprovado!
