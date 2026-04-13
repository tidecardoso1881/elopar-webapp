'use client'

import { useState, useCallback } from 'react'

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
  const [filters, setFilters] = useState<SavedFilter[]>(load)

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
