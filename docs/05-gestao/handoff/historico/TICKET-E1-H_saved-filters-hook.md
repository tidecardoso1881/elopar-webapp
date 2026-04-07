---
id: TICKET-E1-H
ep: EP-NEW-008
para: Especialista 1
branch: feat/ep-008-saved-filters
arquivos:
  - src/hooks/useSavedFilters.ts (criar)
status: pending
bloqueio: iniciar após E1-G ter PR aberto
---

# E1-H — Hook useSavedFilters (localStorage)

```bash
git checkout main && git pull origin main
git checkout -b feat/ep-008-saved-filters
mkdir -p src/hooks
```

---

## Arquivo — `src/hooks/useSavedFilters.ts` (CRIAR)

```typescript
'use client'

import { useState, useEffect, useCallback } from 'react'

export interface SavedFilter {
  id: string
  name: string
  params: Record<string, string>
  createdAt: number
}

const STORAGE_KEY = 'elopar:saved-filters'

function load(): SavedFilter[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as SavedFilter[]
  } catch {
    return []
  }
}

function save(filters: SavedFilter[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
}

export function useSavedFilters() {
  const [filters, setFilters] = useState<SavedFilter[]>([])

  useEffect(() => {
    setFilters(load())
  }, [])

  const saveFilter = useCallback((name: string, params: Record<string, string>) => {
    if (!name.trim()) return
    const existing = load()
    if (existing.some(f => f.name.toLowerCase() === name.trim().toLowerCase())) return
    const updated = [...existing, {
      id: crypto.randomUUID(),
      name: name.trim(),
      params,
      createdAt: Date.now(),
    }]
    save(updated)
    setFilters(updated)
  }, [])

  const deleteFilter = useCallback((id: string) => {
    const updated = load().filter(f => f.id !== id)
    save(updated)
    setFilters(updated)
  }, [])

  return { filters, saveFilter, deleteFilter }
}
```

---

```bash
npx tsc --noEmit
git add src/hooks/useSavedFilters.ts
git commit -m "feat(EP-008): hook useSavedFilters com persistência em localStorage"
git push origin feat/ep-008-saved-filters
# Abrir PR: "feat(EP-008): hook useSavedFilters — filtros favoritos"
```

**DoD:** tsc ok + PR aberto
**Após concluir:** criar `NOTE_e1h_done.md` com número do PR
