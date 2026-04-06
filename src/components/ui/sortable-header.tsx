import Link from 'next/link'

interface SortableHeaderProps {
  col: string
  label: string
  sortBy?: string
  sortDir?: 'asc' | 'desc'
  buildSortUrl?: (col: string, dir: 'asc' | 'desc') => string
  onClick?: (col: string) => void
  className?: string
}

export function SortableHeader({
  col,
  label,
  sortBy,
  sortDir,
  buildSortUrl,
  onClick,
  className,
}: SortableHeaderProps) {
  const isActive = sortBy === col
  const nextDir = isActive && sortDir === 'asc' ? 'desc' : 'asc'

  // Mode 1: Server-side sort (with buildSortUrl)
  if (buildSortUrl) {
    return (
      <th scope="col" className={`px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider ${className ?? ''}`}>
        <Link
          href={buildSortUrl(col, nextDir)}
          className={`inline-flex items-center gap-1 transition-colors select-none ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          aria-label={`Ordenar por ${label} ${nextDir === 'asc' ? 'crescente' : 'decrescente'}`}
        >
          {label}
          <span className="text-xs leading-none" aria-hidden="true">
            {isActive ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
          </span>
        </Link>
      </th>
    )
  }

  // Mode 2: Client-side sort (with onClick)
  if (onClick) {
    return (
      <th scope="col" className={`px-2 sm:px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider ${className ?? ''}`}>
        <button
          onClick={() => onClick(col)}
          className={`inline-flex items-center gap-1 transition-colors select-none ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          aria-label={`Ordenar por ${label} ${nextDir === 'asc' ? 'crescente' : 'decrescente'}`}
        >
          {label}
          <span className="text-xs leading-none" aria-hidden="true">
            {isActive ? (sortDir === 'asc' ? '▲' : '▼') : '↕'}
          </span>
        </button>
      </th>
    )
  }

  // Mode 3: No sort (static header)
  return (
    <th scope="col" className={`px-2 sm:px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${className ?? ''}`}>
      {label}
    </th>
  )
}
