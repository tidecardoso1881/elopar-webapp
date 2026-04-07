'use client'

export interface SearchResultItem {
  id: string
  type: 'professional' | 'client' | 'equipment'
  name: string
  subtitle: string
}

interface SearchResultProps extends SearchResultItem {
  isActive: boolean
  onSelect: (id: string, type: SearchResultItem['type']) => void
}

const AVATAR_COLORS: Record<SearchResultItem['type'], { bg: string; text: string }> = {
  professional: { bg: 'bg-blue-100', text: 'text-blue-700' },
  client:       { bg: 'bg-purple-100', text: 'text-purple-700' },
  equipment:    { bg: 'bg-green-100', text: 'text-green-700' },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function SearchResult({ id, type, name, subtitle, isActive, onSelect }: SearchResultProps) {
  const colors = AVATAR_COLORS[type]
  const initials = getInitials(name)

  return (
    <li
      role="option"
      aria-selected={isActive}
      onClick={() => onSelect(id, type)}
      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-lg mx-1 transition-colors ${
        isActive
          ? 'bg-blue-50 border-l-2 border-blue-500 pl-2.5'
          : 'hover:bg-gray-50'
      }`}
    >
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${colors.bg} ${colors.text}`}
        aria-hidden="true"
      >
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 truncate">{subtitle}</p>
        )}
      </div>
      <svg
        className={`flex-shrink-0 h-4 w-4 text-gray-400 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </li>
  )
}
