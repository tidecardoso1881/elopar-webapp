'use client'

export interface WIPColumn {
  name: string
  count: number
  limit?: number
  color: string
}

export interface WIPVisualizationProps {
  columns: WIPColumn[]
}

export function WIPVisualization({ columns }: WIPVisualizationProps) {
  const total = columns.reduce((sum, col) => sum + col.count, 0)

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">WIP por Coluna</h3>

      {/* Barra segmentada */}
      <div className="flex rounded-full overflow-hidden h-5 mb-4 gap-px bg-gray-100">
        {columns.map((col) => {
          const pct = total > 0 ? (col.count / total) * 100 : 0
          if (pct === 0) return null
          return (
            <div
              key={col.name}
              style={{ width: `${pct}%`, backgroundColor: col.color }}
              title={`${col.name}: ${col.count}`}
              className="transition-all"
            />
          )
        })}
      </div>

      {/* Legenda */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {columns.map((col) => {
          const isOverLimit = col.limit !== undefined && col.count > col.limit
          return (
            <div key={col.name} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: col.color }}
              />
              <span className="text-xs text-gray-600 truncate">{col.name}</span>
              <span className={`text-xs font-semibold ml-auto ${isOverLimit ? 'text-red-600' : 'text-gray-700'}`}>
                {col.count}{col.limit !== undefined ? `/${col.limit}` : ''}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
