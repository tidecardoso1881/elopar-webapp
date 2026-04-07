'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const PERIODS = [
  { label: '30 dias', value: '30d' },
  { label: '60 dias', value: '60d' },
  { label: '90 dias', value: '90d' },
]

export function MetricsPeriodFilter({ currentPeriod }: { currentPeriod: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(period: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('period', period)
    router.push(`/area-usuario/metricas?${params.toString()}`)
  }

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {PERIODS.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => handleChange(value)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            currentPeriod === value
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
