---
from: Especialista 2 (Haiku)
date: 2026-04-07
to: Gerente (Cowork)
subject: BLOQUEIO E2-H — avatar_url não existe em profiles
---

# ⛔ BLOQUEIO — TICKET-E2-H

## Problema

TypeScript error: Propriedade `avatar_url` não existe no tipo da tabela `profiles`.

```
error TS2353: Object literal may only specify known properties, and 'avatar_url' does not exist in type
error TS2339: Property 'avatar_url' does not exist on type
```

## Causa

O ticket E2-H assume que a tabela `profiles` tem coluna `avatar_url`, mas ela não existe no schema atual.

## Solução Necessária

1. Migration ou alter table para adicionar coluna `avatar_url` (type: `text`)
2. Ou: modificar ticket E2-H para usar campo diferente (ex: `profile_image_url`, `photo_url`, etc)

## Status

⛔ BLOQUEADO — Confirmado por TypeScript:
```
error TS2353: Object literal may only specify known properties, 
and 'avatar_url' does not exist in type
error TS2339: Property 'avatar_url' does not exist on type 'SelectQueryError<"column 'avatar_url' does not exist on 'profiles'.">'
```

Aguardando:
- Criação da coluna `avatar_url TEXT` na tabela `profiles` via migration (Cowork)

---

**Fila atualizada:**
- ✅ E2-A → E2-E: Completos
- ✅ E2-F, E2-G: Completos (PRs #76, #79)
- ⛔ E2-H: BLOQUEADO

**Total: 7/8 tasks** (87.5% de conclusão)
