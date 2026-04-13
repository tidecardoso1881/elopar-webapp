---
para: Especialista 1 (Haiku)
de: Gerente (Cowork)
data: 2026-04-07
ticket: E1-L
bug: BUG-001
branch: fix/bug-001-equipamentos-suspense
prioridade: HIGH
---

# TICKET E1-L — BUG-001: /equipamentos quebrando em produção

## Problema

`src/app/(dashboard)/equipamentos/page.tsx` usa o componente `EquipmentFilters` que internamente chama `useSearchParams()`. Em Next.js 14+, componentes com `useSearchParams()` precisam de um `<Suspense>` pai com fallback explícito para não causar erro de hidratação/build em produção.

A página já tem `import { Suspense }` e um wrapper `<Suspense>` mas **sem fallback** (`<Suspense>` vazio), o que causa warning ou falha em produção.

## Arquivo a corrigir

**`src/app/(dashboard)/equipamentos/page.tsx`**

## O que fazer

1. Localizar o wrapper `<Suspense>` em torno de `<EquipmentFilters ... />`
2. Adicionar `fallback` explícito:

```tsx
<Suspense fallback={
  <div className="h-10 rounded-lg bg-gray-100 animate-pulse" />
}>
  <EquipmentFilters ... />
</Suspense>
```

3. Verificar que `<EquipmentFilters>` está **dentro** do Suspense (não fora)
4. Rodar `npx tsc --noEmit` e `npm run build` para confirmar

## Comandos

```bash
git checkout main && git pull origin main
git checkout -b fix/bug-001-equipamentos-suspense
# editar src/app/(dashboard)/equipamentos/page.tsx
npx tsc --noEmit && npm run build
git add src/app/\(dashboard\)/equipamentos/page.tsx
git commit -m "fix(BUG-001): adicionar fallback ao Suspense do EquipmentFilters"
gh pr create --title "fix(BUG-001): Suspense fallback em /equipamentos" --body "EquipmentFilters usa useSearchParams() e precisava de Suspense com fallback explícito para não quebrar em produção."
```

## DoD

- [ ] `npm run build` sem erros
- [ ] Página /equipamentos carrega sem erro em dev e staging
