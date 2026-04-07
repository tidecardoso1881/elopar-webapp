---
para: Especialista 2 (Haiku)
atualizado: 2026-04-07
---

# Fila — Especialista 2

> Leia este arquivo PRIMEIRO em toda sessão.
> Execute na ordem. Um ticket por vez. Não pule.

---

## ⛔ REGRA CRÍTICA

**Você é Especialista 2. Só execute tickets desta fila.**
Nunca leia ou execute tickets da `FILA_ESPECIALISTA_1.md`.
Se sua fila estiver vazia: **pare e aguarde**. Não busque trabalho em outro lugar.

---

## 🎯 TAREFA ATUAL

### ▶️ E2-J — Perfil Completo (URGENTE — substitui PRs #81 e #82)
**Ticket:** `TICKET-E2-J_consolida-perfil.md`
**Branch:** `feat/ep-005-perfil-completo`
**Por quê:** PRs #81 e #82 têm conflitos. Este ticket entrega os 4 arquivos em uma branch limpa.
**Após concluir:** fechar PRs #81 e #82 manualmente + criar `NOTE_e2j_done.md` com número do PR

---

## ⏳ Próxima (não iniciar antes de E2-J estar mergeado)

### E2-I — Saved Filters UI
**Ticket:** `TICKET-E2-I_saved-filters-ui.md`
**Bloqueio:** aguarda E2-J mergeado no main

---

## ✅ Concluídas

| # | Ticket | PR |
|---|---|---|
| 1 | E2-A — Histórico integração | ✅ done |
| 2 | E2-B — Offline page | ✅ done |
| 3 | E2-C — Professional actions RBAC | ✅ PR #70 |
| 4 | E2-D — Guard clientes | ✅ PR #73 |
| 5 | E2-E — Guard equipamentos | ✅ PR #75 |
| 6 | E2-F — Perfil dropdown links (header) | ✅ PR #76 |
| 7 | E2-G — Perfil page + action updateProfile | ✅ PR #79 (substituído por E2-J) |
| 8 | E2-H — Avatar upload | ⚠️ PR #82 conflito — substituído por E2-J |

---

## 📏 Regras

1. `git checkout main && git pull origin main` antes de cada branch nova
2. `npx tsc --noEmit` antes de todo commit — zero erros
3. Nunca push direto em `main`
4. Bloqueio ou dúvida → criar `NOTE_e2_BLOQUEADO_[ticket].md` e parar
5. Concluído → criar `NOTE_e2_[ticket]_done.md` com número do PR

---

## 🗄️ Contexto técnico (E2-J)

- Tabela `profiles`: `id`, `full_name`, `role`, `avatar_url` ← coluna já existe no Supabase
- Storage bucket `avatars` já criado no Supabase
- `src/lib/supabase/server.ts` — padrão `createClient()` disponível
- TypeScript types atualizados em `src/lib/types/database.ts`
