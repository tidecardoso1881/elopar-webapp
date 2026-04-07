---
id: TICKET-URGENTE-003
status: pending
prioridade: 🚨 URGENTE — resolver antes de qualquer outro ticket
criado_em: 2026-04-07T15:00
team: TODOS (quem pegar primeiro)
---

# 🚨 Resolver conflitos dos PRs #66, #67 e #68

## Causa raiz

O arquivo `src/app/(dashboard)/profissionals/[id]/page.tsx` é tocado por múltiplos EPs.
A main já tem as imports de `ProfessionalHistorico` e `ProfessionalNotes` — as branches antigas não tinham.

---

## PR #66 — feat(EP-NEW-014): notas internas

**Arquivo:** `src/app/(dashboard)/profissionals/[id]/page.tsx`

```bash
git checkout feature/ep-new-014-notas-profissional
git fetch origin
git merge origin/main
```

Ao encontrar o conflito, **manter a versão da main** (que já tem as imports corretas) e **adicionar apenas o que é exclusivo desta branch** (o componente `<ProfessionalNotes />` no JSX, a section de notas, as server actions novas).

Após resolver:
```bash
git add src/app/(dashboard)/profissionals/[id]/page.tsx
git commit -m "fix: resolve conflito de merge com main no PR #66"
git push origin feature/ep-new-014-notas-profissional
```

---

## PR #67 — feat(EP-NEW-016): PWA mobile offline

**Arquivo:** `src/app/(dashboard)/profissionals/[id]/page.tsx`

```bash
git checkout feature/ep-new-016-pwa-offline
git fetch origin
git merge origin/main
```

O PWA provavelmente não deveria ter tocado neste arquivo. Ao resolver o conflito, **manter a versão da main** completamente para este arquivo. Só manter as mudanças do PWA nos arquivos exclusivos dele (`next.config.ts`, `public/manifest.json`, `public/sw.js`, `app/offline/`).

```bash
git add src/app/(dashboard)/profissionals/[id]/page.tsx
git commit -m "fix: resolve conflito de merge com main no PR #67"
git push origin feature/ep-new-016-pwa-offline
```

---

## PR #68 — fix(header): remove breadcrumb central

**Arquivo:** `src/components/layout/header.tsx`

```bash
git checkout fix/header-remove-breadcrumb
git fetch origin
git merge origin/main
```

O EP-NEW-011 também mexeu no `header.tsx` e foi mergeado antes. Ao resolver:
- Manter as mudanças do EP-NEW-011 (dropdown de usuário, sem bloco no sidebar)
- Manter o que esta branch fez: remover o bloco central de título/breadcrumb
- Se ambos removeram coisas diferentes, o resultado final deve ser: logo à esquerda + usuário à direita, sem centro

```bash
git add src/components/layout/header.tsx
git commit -m "fix: resolve conflito de merge com main no PR #68"
git push origin fix/header-remove-breadcrumb
```

---

## DoD desta tarefa

- [ ] PR #66 sem conflito no GitHub
- [ ] PR #67 sem conflito no GitHub
- [ ] PR #68 sem conflito no GitHub
- [ ] tsc + build ok em cada branch antes de pushar
