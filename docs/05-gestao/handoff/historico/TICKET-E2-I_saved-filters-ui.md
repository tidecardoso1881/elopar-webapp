---
id: TICKET-E2-I
ep: EP-NEW-008
para: Especialista 2
branch: feat/ep-008-saved-filters-ui
arquivos:
  - src/components/profissionais/saved-filters.tsx (criar)
  - src/components/profissionais/professionals-filters.tsx
status: pending
bloqueio: iniciar após E2-H ter PR aberto E E1-H ter PR aberto
---

# E2-I — UI de filtros favoritos (chips + modal salvar)

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-008-saved-filters-ui
```

---

## Arquivo 1 — `src/components/profissionais/saved-filters.tsx` (CRIAR)

```tsx
'use client'

import { useSavedFilters } from '@/hooks/useSavedFilters'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface SavedFiltersProps {
  currentParams: string
}

export function SavedFilters({ currentParams }: SavedFiltersProps) {
  const { filters, deleteFilter } = useSavedFilters()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  if (filters.length === 0) return null

  function apply(params: Record<string, string>) {
    const p = new URLSearchParams(params)
    startTransition(() => {
      router.push(`${pathname}?${p.toString()}`)
    })
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs text-gray-400 font-medium">Salvos:</span>
      {filters.map((f) => (
        <span
          key={f.id}
          className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700"
        >
          <button
            onClick={() => apply(f.params)}
            disabled={isPending}
            className="hover:text-indigo-900 disabled:opacity-50"
          >
            {f.name}
          </button>
          <button
            onClick={() => deleteFilter(f.id)}
            className="ml-0.5 text-indigo-400 hover:text-red-500 transition-colors"
            aria-label={`Remover filtro ${f.name}`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  )
}
```

---

## Arquivo 2 — `src/components/profissionais/professionals-filters.tsx`

Adicionar imports no topo (após os existentes):

```tsx
import { useState } from 'react'  // já existe — não duplicar
import { useSavedFilters } from '@/hooks/useSavedFilters'
import { SavedFilters } from './saved-filters'
```

Dentro da função `ProfessionalsFilters`, adicionar estado e hook **após** os `useState` existentes:

```tsx
  const { saveFilter } = useSavedFilters()
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [filterName, setFilterName] = useState('')
```

Adicionar handler **após** `handleClear`:

```tsx
  function handleSave() {
    const params: Record<string, string> = {}
    FILTER_KEYS.forEach(k => {
      const v = searchParams.get(k)
      if (v) params[k] = v
    })
    saveFilter(filterName, params)
    setFilterName('')
    setShowSaveModal(false)
  }
```

No JSX, adicionar **antes** do `return`, depois do bloco da segunda linha de filtros, **antes** do `</div>` que fecha `space-y-3`:

```tsx
      {/* Filtros salvos */}
      <SavedFilters currentParams={searchParams.toString()} />

      {/* Botão salvar + modal */}
      {hasActiveFilters && (
        <div>
          <button
            onClick={() => setShowSaveModal(true)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            + Salvar filtro atual
          </button>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl p-5 w-72">
            <p className="text-sm font-semibold text-gray-900 mb-3">Nomear filtro</p>
            <input
              autoFocus
              type="text"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && filterName.trim() && handleSave()}
              placeholder="Ex: Clientes Críticos"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >Cancelar</button>
              <button
                onClick={handleSave}
                disabled={!filterName.trim()}
                className="flex-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700 disabled:opacity-50"
              >Salvar</button>
            </div>
          </div>
        </div>
      )}
```

> ⚠️ Certificar que `useState` não está sendo importado duas vezes.

---

```bash
npx tsc --noEmit
git add src/components/profissionais/saved-filters.tsx
git add src/components/profissionais/professionals-filters.tsx
git commit -m "feat(EP-008): filtros favoritos — chips + modal salvar"
git push origin feat/ep-008-saved-filters-ui
# Abrir PR: "feat(EP-008): filtros favoritos — salvar e aplicar com um clique"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e2i_done.md` com número do PR
