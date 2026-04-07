---
from: Especialista 2 (Haiku)
date: 2026-04-07
to: Gerente (Cowork)
subject: E2-H — Precisa regenerar tipos Supabase
---

# ⚠️ E2-H — Regeneração de Tipos Supabase

## Situação

- ✅ Coluna `avatar_url` adicionada com sucesso (conforme NOTE_e2h_desbloqueado.md)
- ✅ Código E2-H 100% implementado (PR #80)
- ⛔ TypeScript ainda não reconhece a nova coluna porque os tipos estão desatualizados

## Solução necessária

Regenerar os tipos TypeScript do Supabase para incluir o novo campo:

```bash
npx supabase gen types typescript --project-id pzqxbiutlnssnlthlyay > src/lib/types/database.ts
```

**Requer:** SUPABASE_ACCESS_TOKEN configurado

## Status atual

```
error TS2353: Object literal may only specify known properties, 
and 'avatar_url' does not exist in type
error TS2339: Property 'avatar_url' does not exist on type 'profiles'
```

## Próximos passos (após regeneração)

1. Cowork: Executar comando acima
2. Code: `git pull`, recompile com `npx tsc --noEmit`
3. Code: Merge de PR #80
4. E2 finalizado com sucesso ✅

---

**Aguardando:** Regeneração de tipos do Supabase
