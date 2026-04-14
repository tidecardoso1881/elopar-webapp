import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DiffButton } from './diff-button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logs de Auditoria',
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

const ENTIDADE_LABELS: Record<string, string> = {
  professional: 'Profissional',
  client: 'Cliente',
  equipment: 'Equipamento',
  vacation: 'Férias',
  user: 'Usuário',
}

const ACAO_LABELS: Record<string, { label: string; className: string }> = {
  CREATE: { label: 'Criado', className: 'bg-blue-100 text-blue-700' },
  UPDATE: { label: 'Editado', className: 'bg-yellow-100 text-yellow-700' },
  DELETE: { label: 'Deletado', className: 'bg-red-100 text-red-700' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface SearchParams {
  entidade?: string
  page?: string
  dias?: string
  userId?: string
}

interface AuditLogPageProps {
  searchParams: Promise<SearchParams>
}

export default async function AuditLogPage({ searchParams }: AuditLogPageProps) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Admin-only
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const params = await searchParams
  const page = Math.max(1, parseInt(params.page ?? '1', 10))
  const entidadeFilter = params.entidade ?? ''
  const dias = parseInt(params.dias ?? '90', 10)
  const userIdFilter = params.userId ?? ''
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  // Date cutoff
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - dias)
  const cutoffISO = cutoff.toISOString()

  // Buscar todos os perfis para o select de usuários
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .order('full_name', { ascending: true })

  // Query audit_log (admin client reads via RLS policy audit_log_read_admin)
  let query = supabase
    .from('audit_log')
    .select('*', { count: 'exact' })
    .gte('criado_em', cutoffISO)
    .order('criado_em', { ascending: false })
    .range(from, to)

  if (entidadeFilter) query = query.eq('entidade', entidadeFilter)
  if (userIdFilter) query = query.eq('user_id', userIdFilter)

  const { data: logs, count, error } = await query

  // Get user names for display
  const userIds = [...new Set((logs ?? []).map((l) => l.user_id))]
  const profileMap: Record<string, string> = {}
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', userIds)
    for (const p of profiles ?? []) {
      profileMap[p.id] = p.full_name ?? p.id
    }
  }

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  function buildUrl(newPage: number) {
    const p = new URLSearchParams()
    if (entidadeFilter) p.set('entidade', entidadeFilter)
    if (dias !== 90) p.set('dias', String(dias))
    if (userIdFilter) p.set('userId', userIdFilter)
    if (newPage > 1) p.set('page', String(newPage))
    const qs = p.toString()
    return `/area-usuario/audit-log${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Logs de Auditoria</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Histórico de criações, edições e exclusões no sistema
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <form method="get" className="flex flex-wrap gap-3 px-4 py-3 border-b border-gray-100">
          <select
            name="entidade"
            defaultValue={entidadeFilter}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as entidades</option>
            <option value="professional">Profissional</option>
            <option value="client">Cliente</option>
            <option value="equipment">Equipamento</option>
            <option value="vacation">Férias</option>
            <option value="user">Usuário</option>
          </select>

          <select
            name="userId"
            defaultValue={userIdFilter}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os usuários</option>
            {(allProfiles ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.full_name ?? p.id.slice(0, 8)}
              </option>
            ))}
          </select>

          <select
            name="dias"
            defaultValue={String(dias)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="90">Últimos 90 dias</option>
            <option value="365">Último ano</option>
          </select>

          <button
            type="submit"
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Filtrar
          </button>

          {(entidadeFilter || dias !== 90 || userIdFilter) && (
            <Link
              href="/area-usuario/audit-log"
              className="px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar
            </Link>
          )}
        </form>

        {/* Stats */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <p className="text-xs text-gray-500">
            {count ?? 0} registro{(count ?? 0) !== 1 ? 's' : ''} encontrado{(count ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 text-sm text-red-600 bg-red-50 border-b border-red-100">
            Erro ao carregar logs: {error.message}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Data/Hora</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Usuário</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Entidade</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Ação</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(logs ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">
                    Nenhum registro encontrado para o período selecionado.
                  </td>
                </tr>
              ) : (
                (logs ?? []).map((log) => {
                  const acaoInfo = ACAO_LABELS[log.acao] ?? { label: log.acao, className: 'bg-gray-100 text-gray-700' }
                  const entidadeLabel = ENTIDADE_LABELS[log.entidade] ?? log.entidade
                  const userName = profileMap[log.user_id] ?? log.user_id.slice(0, 8) + '…'
                  return (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {formatDateTime(log.criado_em)}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 max-w-[120px] truncate">
                        {userName}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {entidadeLabel}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {log.entidade_id.slice(0, 8)}…
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${acaoInfo.className}`}>
                          {acaoInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <DiffButton
                          entidadeId={log.entidade_id}
                          dadosAntes={log.dados_antes as Record<string, unknown> | null}
                          dadosDepois={log.dados_depois as Record<string, unknown> | null}
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">Página {page} de {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl(page - 1)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  ← Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={buildUrl(page + 1)}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                >
                  Próxima →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
