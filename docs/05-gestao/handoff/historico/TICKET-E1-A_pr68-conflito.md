---
id: TICKET-E1-A
para: Especialista 1
branch: fix/header-remove-breadcrumb
arquivo: src/components/layout/header.tsx
status: pending
---

# E1-A — Resolver conflito PR #68

```bash
git checkout fix/header-remove-breadcrumb
git fetch origin
git merge origin/main
```

Conflito em `header.tsx`. Abrir o arquivo e remover os marcadores:

```
<<<<<<< HEAD
...
=======
...
>>>>>>> origin/main
```

**Regra de resolução:** manter a versão da branch (mais completa). Apagar o bloco central:

```tsx
{/* NÃO DEVE EXISTIR no resultado final */}
{/* Center: Page Title + Breadcrumb */}
<div className="flex-1 min-w-0 md:text-center">
  ...
</div>
```

```bash
grep -n "<<<<<<\|=======\|>>>>>>" src/components/layout/header.tsx
# deve retornar vazio

npx tsc --noEmit
git add src/components/layout/header.tsx
git commit -m "fix: resolve conflito PR #68 — remove breadcrumb central"
git push origin fix/header-remove-breadcrumb
```

**DoD:** sem marcadores de conflito + tsc ok + push feito
**Após concluir:** criar `NOTE_e1a_done.md`
