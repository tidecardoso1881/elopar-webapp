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
