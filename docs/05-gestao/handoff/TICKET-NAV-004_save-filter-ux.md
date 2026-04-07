TASK: EP-NAV-004 — Destaque visual do botão "Salvar filtro" em Profissionais
BRANCH: feat/nav-save-filter-ux
BASE: main
PRIORIDADE: MÉDIO · Wave 2 — só iniciar após feat/nav-sidebar-roles merged

---

ARQUIVOS:
- EDITAR: src/components/profissionais/professionals-filters.tsx

---

## CONTEXTO

O botão de salvar filtro favorito existe mas não é visualmente destacado.
Quando `hasActiveFilters === true`, o botão deve ficar azul (cor primária) com ícone de estrela.

## MUDANÇA

No arquivo `src/components/profissionais/professionals-filters.tsx`, localizar o botão que chama `setShowSaveModal(true)`.

Atualmente está algo como:
```tsx
<button
  onClick={() => setShowSaveModal(true)}
  className="text-xs text-gray-500 ..."
>
  Salvar filtro
</button>
```

Substituir por:
```tsx
<button
  onClick={() => setShowSaveModal(true)}
  title="Salve este filtro para usar rapidamente depois"
  className={`inline-flex items-center gap-1 text-xs font-medium transition-colors rounded px-2 py-1 ${
    hasActiveFilters
      ? 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100'
      : 'text-gray-400 hover:text-gray-600'
  }`}
>
  <svg className="w-3.5 h-3.5" fill={hasActiveFilters ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
  Salvar filtro
</button>
```

Verificar que `hasActiveFilters` já está declarado no componente (linha ~73):
```typescript
const hasActiveFilters = FILTER_KEYS.some(k => !!searchParams.get(k))
```
Se não estiver visível no escopo onde o botão é renderizado, movê-lo para um escopo acessível.

---

COMANDOS:
1. npx tsc --noEmit
2. npm run lint
3. npm run build

DOD:
1. Com filtros ativos o botão fica azul com ícone estrela preenchida · sem filtros fica cinza com estrela vazia
2. tsc + lint + build sem erros
