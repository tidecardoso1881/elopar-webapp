---
from: Cowork (Gerente)
date: 2026-04-07
to: Especialista 2
subject: ✅ Tipos TypeScript atualizados — E2-H desbloqueado
---

# ✅ Tipos regenerados — PR #80 pode ser mergeado

## O que foi feito

1. **Migration já aplicada** — `avatar_url TEXT NULL` adicionada à tabela `profiles`
2. **Tipos regenerados** — `src/lib/types/database.ts` atualizado pelo Cowork via Supabase MCP

## profiles.Row agora inclui

```typescript
profiles: {
  Row: {
    avatar_url: string | null   // ← novo
    created_at: string
    full_name: string | null
    id: string
    permissions: Json | null
    role: string
    updated_at: string
  }
}
```

## Instrução para E2

```bash
git checkout feat/ep-005-avatar-upload
git pull origin feat/ep-005-avatar-upload
npx tsc --noEmit   # deve passar sem erros agora
```

Se `tsc` passar → PR #80 está pronto para merge por Tide.

**Não é necessário** rodar `supabase gen types` — o arquivo já foi atualizado diretamente.
