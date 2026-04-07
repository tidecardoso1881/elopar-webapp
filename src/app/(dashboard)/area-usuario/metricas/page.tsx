import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getKanbanMetrics } from '@/lib/metrics'
import { KPICard } from '@/components/metrics/KPICard'
import { MetricsLineChart } from '@/components/metrics/MetricsLineChart'
import { MetricsBarChart } from '@/components/metrics/MetricsBarChart'
import { WIPVisualization } from '@/components/metrics/WIPVisualization'
import { MetricsPeriodFilter } from './period-filter'

export const metadata: Metadata = {
  title: 'Métricas Kanban',
}

interface PageProps {
  searchParams: Promise<{ period?: string }>
}

export default async function MetricasPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user?.id ?? '')
    .single()

  const isAdminOrManager =
    profile?.role === 'admin' || profile?.role === 'gerente' || profile?.role === 'manager'

  if (!user || !isAdminOrManager) {
    redirect('/area-usuario')
  }

  const params = await searchParams
  const period = (params.period === '30d' || params.period === '60d' || params.period === '90d')
    ? params.period
    : '90d'

  const metrics = await getKanbanMetrics(period)

  const leadTimeTrend = {
    direction: metrics.trends.leadTimeChange > 0 ? 'up' as const
      : metrics.trends.leadTimeChange < 0 ? 'down' as const
      : 'neutral' as const,
    change: Math.abs(metrics.trends.leadTimeChange),
    unit: 'd',
  }

  const cycleTimeTrend = {
    direction: metrics.trends.cycleTimeChange > 0 ? 'up' as const
      : metrics.trends.cycleTimeChange < 0 ? 'down' as const
      : 'neutral' as const,
    change: Math.abs(metrics.trends.cycleTimeChange),
    unit: 'd',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Métricas Kanban</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Dashboard operacional do processo de desenvolvimento — janela: {period}
          </p>
        </div>
        <Suspense>
          <MetricsPeriodFilter currentPeriod={period} />
        </Suspense>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard
          label="Lead Time"
          value={`${metrics.leadTimeAvg}d`}
          subtitle="média"
          trend={leadTimeTrend}
        />
        <KPICard
          label="Cycle Time"
          value={`${metrics.cycleTimeAvg}d`}
          subtitle="média"
          trend={cycleTimeTrend}
        />
        <KPICard
          label="Throughput"
          value={metrics.throughput}
          subtitle="/ semana"
        />
        <KPICard
          label="WIP Atual"
          value={metrics.wipTotal}
          subtitle="em andamento"
          variant={metrics.wipTotal > 10 ? 'warning' : 'default'}
        />
        <KPICard
          label="Retrabalho"
          value={`${metrics.reworkRate}%`}
          variant={metrics.reworkRate > 20 ? 'danger' : metrics.reworkRate > 10 ? 'warning' : 'default'}
        />
        <KPICard
          label="Eficiência"
          value={`${metrics.efficiencyRate}%`}
          variant={metrics.efficiencyRate < 50 ? 'warning' : 'default'}
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MetricsLineChart
          title="Lead Time — Últimas 8 semanas"
          data={metrics.historicalData.leadTime}
          unit="d"
          color="#3B82F6"
        />
        <MetricsBarChart
          title="Throughput Semanal"
          data={metrics.historicalData.throughput}
          color="#6366F1"
        />
      </div>

      {/* WIP por coluna */}
      <WIPVisualization columns={metrics.wipByColumn} />
    </div>
  )
}
