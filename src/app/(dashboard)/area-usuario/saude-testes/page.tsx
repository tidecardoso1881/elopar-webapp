import { createClient } from '@/lib/supabase/server'
import { CoverageChart } from './coverage-chart'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Saúde dos Testes',
}

interface TestHealthLog {
  id: string
  recorded_at: string
  coverage_percent: number
  coverage_files_covered: number
  coverage_files_total: number
  integration_total: number
  integration_passed: number
  integration_failed: number
  integration_duration_ms: number | null
  e2e_total: number
  e2e_passed: number
  e2e_failed: number
  e2e_duration_ms: number | null
  branch: string | null
  commit_sha: string | null
  triggered_by: string | null
  notes: string | null
  created_at: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(ms: number | null): string {
  if (!ms) return '-'
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}

function getHealthBadge(percent: number): { label: string; color: string } {
  if (percent >= 70) return { label: 'Saudável', color: 'bg-green-100 text-green-800' }
  if (percent >= 50) return { label: 'Aviso', color: 'bg-yellow-100 text-yellow-800' }
  return { label: 'Crítico', color: 'bg-red-100 text-red-800' }
}

function getTestStatus(passed: number, total: number): { label: string; color: string } {
  if (total === 0) return { label: 'N/A', color: 'text-gray-600' }
  const passPercentage = (passed / total) * 100
  if (passPercentage === 100) return { label: '✅ Passou', color: 'text-green-600 font-semibold' }
  if (passPercentage >= 80) return { label: '⚠️ Aviso', color: 'text-yellow-600 font-semibold' }
  return { label: '❌ Falhou', color: 'text-red-600 font-semibold' }
}

export default async function SaudeTeste() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-600 font-semibold">Acesso negado</p>
        <p className="text-gray-500 text-sm mt-2">Você precisa estar autenticado para acessar esta página.</p>
      </div>
    )
  }

  // Fetch test health logs
  const { data: logs, error } = await supabase
    .from('test_health_logs')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(100)

  const testHealthLogs = (logs ?? []) as TestHealthLog[]

  if (error) {
    return (
      <div className="px-5 py-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
        Erro ao carregar dados de saúde dos testes: {error.message}
      </div>
    )
  }

  // Get latest log for status cards
  const latestLog = testHealthLogs[0]

  // Prepare chart data (last 8 entries, sorted by date ascending for chart)
  const chartData = testHealthLogs
    .slice()
    .reverse()
    .slice(0, 8)
    .map((log, idx) => ({
      week: new Date(log.recorded_at).toLocaleDateString('pt-BR', { month: '2-digit', day: '2-digit' }),
      coverage: Number(log.coverage_percent),
    }))

  // Get last 5 entries for table
  const lastFiveRuns = testHealthLogs.slice(0, 5)

  // Calculate health status
  const coverageHealth = latestLog ? getHealthBadge(Number(latestLog.coverage_percent)) : null
  const integrationStatus = latestLog ? getTestStatus(latestLog.integration_passed, latestLog.integration_total) : null
  const e2eStatus = latestLog ? getTestStatus(latestLog.e2e_passed, latestLog.e2e_total) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">🏥 Saúde dos Testes</h1>
            <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">Admin Only</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Acompanhe a saúde e cobertura dos testes da aplicação Elopar em tempo real.
          </p>
        </div>
      </div>

      {/* Status Cards */}
      {latestLog && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Coverage Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-2">Cobertura de Código</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">{Number(latestLog.coverage_percent).toFixed(1)}%</div>
              </div>
              <span style={{ fontSize: '2rem' }}>🔵</span>
            </div>
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${coverageHealth?.color}`}>
                {coverageHealth?.label}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {latestLog.coverage_files_covered} de {latestLog.coverage_files_total} arquivos cobertos | Última atualização: {formatDate(latestLog.recorded_at)}
            </div>
          </div>

          {/* Integration Tests Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-2">Testes de Integração</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {integrationStatus?.label}
                </div>
              </div>
              <span style={{ fontSize: '2rem' }}>🟠</span>
            </div>
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                {latestLog.integration_passed}/{latestLog.integration_total}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Último run: {formatDate(latestLog.recorded_at)} | {latestLog.integration_total} testes
            </div>
          </div>

          {/* E2E Tests Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-sm font-semibold text-gray-600 mb-2">Testes E2E (Playwright)</div>
                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {e2eStatus?.label}
                </div>
              </div>
              <span style={{ fontSize: '2rem' }}>🟢</span>
            </div>
            <div className="mb-3">
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                {latestLog.e2e_passed}/{latestLog.e2e_total}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Último run: {formatDate(latestLog.recorded_at)} | {latestLog.e2e_total} testes
            </div>
          </div>
        </div>
      )}

      {/* Coverage Chart */}
      {chartData.length > 0 && <CoverageChart data={chartData} />}

      {/* Recent Executions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Últimas Execuções</h3>
        </div>

        {lastFiveRuns.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">Nenhum dado de teste disponível</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Cobertura</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Integração</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">E2E</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Branch</th>
                </tr>
              </thead>
              <tbody>
                {lastFiveRuns.map((run, idx) => (
                  <tr key={run.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 text-sm text-gray-900">{formatDate(run.recorded_at)}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{Number(run.coverage_percent).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={getTestStatus(run.integration_passed, run.integration_total).color}>
                        {run.integration_passed}/{run.integration_total}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={getTestStatus(run.e2e_passed, run.e2e_total).color}>
                        {run.e2e_passed}/{run.e2e_total}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{run.branch || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
