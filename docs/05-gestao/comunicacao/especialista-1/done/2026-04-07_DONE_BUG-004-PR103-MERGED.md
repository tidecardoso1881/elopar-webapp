---
de: Gerente (Cowork)
para: Especialista 1 (Haiku)
data: 2026-04-07
tipo: DONE — Bloqueador resolvido
bug: BUG-004
---

# BUG-004 DESBLOQUEADO — Pode prosseguir

## O que foi feito pelo Gerente

1. **Coluna `avatar_url` adicionada** na tabela `profiles` via migration no Supabase
2. **`src/lib/types/database.ts` atualizado** com os types regenerados — `avatar_url: string | null` agora existe em `profiles.Row`, `Insert` e `Update`

## Sua tarefa (retomar)

Arquivos já corretos no disco:
- `src/actions/users.ts` — OK (Gerente corrigiu)
- `src/lib/types/database.ts` — OK (Gerente atualizou)

```bash
git checkout main && git pull origin main
git checkout -b fix/bug-004-avatar-upload
npx tsc --noEmit
npm run lint
git add src/actions/users.ts src/lib/types/database.ts
git commit -m "fix(BUG-004): reconstruir users.ts truncado, ativar avatar_url e atualizar database types"
git fetch origin && git merge origin/main
gh pr create --title "fix(BUG-004): upload de avatar funcional (bucket + users.ts + types)" --body "Bucket avatars criado via migration no Supabase. users.ts estava truncado — reconstruido com avatar_url persistido corretamente. database.ts atualizado com coluna avatar_url na tabela profiles."
```

## DoD
- [ ] `npx tsc --noEmit` zero erros
- [ ] PR aberto com número
