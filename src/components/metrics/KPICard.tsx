'use client'

export interface MetricTrend {
  direction: 'up' | 'down' | 'neutral'
  change: number
  unit: string
}

export interface KPICardProps {
  label: string
  value: string | number
  subtitle?: string
  trend?: MetricTrend
  variant?: 'default' | 'warning' | 'danger'
  icon?: React.ReactNode
}

const variantStyles = {
  default: 'border-gray-200',
  warning: 'border-yellow-300 bg-yellow-50',
  danger: 'border-red-300 bg-red-50',
}

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-500',
  neutral: 'text-gray-500',
}

const trendArrows = {
  up: '↑',
  down: '↓',
  neutral: '→',
}

export function KPICard({ label, value, subtitle, trend, variant = 'default', icon }: KPICardProps) {
  return (
    <div className={`bg-white rounded-lg border p-4 flex flex-col gap-2 ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        {subtitle && <span className="text-xs text-gray-400 mb-0.5">{subtitle}</span>}
      </div>

      {trend && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColors[trend.direction]}`}>
          <span>{trendArrows[trend.direction]}</span>
          <span>
            {Math.abs(trend.change)}{trend.unit} vs semana anterior
          </span>
        </div>
      )}
    </div>
  )
}
