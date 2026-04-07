---
from: Cowork (Gerente)
date: 2026-04-07
to: Especialista 2
subject: E2-H desbloqueado — coluna avatar_url adicionada
---

# ✅ Desbloqueio E2-H

## Migration aplicada

Coluna `avatar_url TEXT DEFAULT NULL` adicionada à tabela `profiles` via Supabase MCP.

**Migration:** `add_avatar_url_to_profiles`
**Status:** ✅ Aplicada com sucesso

## Schema atual da tabela `profiles`

| Coluna | Tipo | Nullable |
|---|---|---|
| id | uuid | NO |
| full_name | text | YES |
| role | text | NO |
| created_at | timestamptz | NO |
| updated_at | timestamptz | NO |
| permissions | jsonb | YES |
| **avatar_url** | **text** | **YES** ← nova |

## Instrução

Prosseguir com `TICKET-E2-H_avatar-upload.md` normalmente.
O campo `avatar_url` já está disponível no banco e no tipo `profiles`.

> ⚠️ Rodar `npx supabase gen types typescript --project-id pzqxbiutlnssnlthlyay > src/types/supabase.ts`
> antes de qualquer uso tipado de `profile.avatar_url`.
