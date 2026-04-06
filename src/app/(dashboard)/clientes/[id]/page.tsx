import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/formatting'
import { ClientDeleteButton } from '@/components/clientes/client-delete-button'

interface ClientDetailPageProps {
  params: Promise<{ id: string }>
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-gray-900">{value || <span className="text-gray-400">—</span>}</p>
    </div>
  )
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
        <span className="text-gray-400">{icon}</span>
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

interface Professional {
  id: string
  name: string
  seniority: string | null
  position: string | null
  status: string
  created_at: string
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Buscar cliente
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !client) {
    notFound()
  }

  // Buscar profissionais do cliente
  const { data: professionalsData, error: profError } = await supabase
    .from('professionals')
    .select('id, name, seniority, position, status, created_at')
    .eq('client_id', id)
    .order('created_at', { ascending: false })

  const professionals = (professionalsData ?? []) as Professional[]
  const activeProfessionals = professionals.filter((p) => p.status === 'ATIVO')
  const terminatedProfessionals = professionals.filter((p) => p.status === 'DESLIGADO')

  const activePercentage =
    professionals.length > 0
      ? Math.round((activeProfessionals.length / professionals.length) * 100)
      : 0

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Breadcrumb + Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <Link href="/clientes" className="hover:text-gray-600 transition-colors">
            Clientes
          </Link>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-600">{client.name}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{client.name}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {professionals.length} profissional{professionals.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/clientes/${id}/editar`}
              title="Editar cliente"
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </Link>
            <ClientDeleteButton id={id} name={client.name} />
            <Link
              href="/clientes"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Coluna principal (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Estatísticas de Profissionais */}
          <SectionCard
            title="Profissionais"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292m0 0H7.46m4.54 0H16.54m-11.08-2.647a9 9 0 1118.16 0M9 9H5m4 0h4m4 0h4" />
              </svg>
            }
          >
            <div className="space-y-4">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                  {activeProfessionals.length} ativo{activeProfessionals.length !== 1 ? 's' : ''}
                </span>
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600">
                  {terminatedProfessionals.length} desligado{terminatedProfessionals.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Barra de Progresso */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500 font-semibold">
                    Proporção Ativo/Total
                  </p>
                  <p className="text-xs font-semibold text-green-700">
                    {activePercentage}%
                  </p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all"
                    style={{ width: `${activePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Lista de Profissionais Ativos */}
          {activeProfessionals.length > 0 && (
            <SectionCard
              title={`Profissionais Ativos (${activeProfessionals.length})`}
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div className="space-y-3">
                {activeProfessionals.map((professional) => (
                  <Link
                    key={professional.id}
                    href={`/profissionais/${professional.id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {professional.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {professional.seniority && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
                              {professional.seniority}
                            </span>
                          )}
                          {professional.position && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">
                              {professional.position}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Lista de Profissionais Desligados */}
          {terminatedProfessionals.length > 0 && (
            <SectionCard
              title={`Profissionais Desligados (${terminatedProfessionals.length})`}
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            >
              <div className="space-y-3">
                {terminatedProfessionals.map((professional) => (
                  <Link
                    key={professional.id}
                    href={`/profissionais/${professional.id}`}
                    className="block p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors opacity-75"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate line-through">
                          {professional.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {professional.seniority && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
                              {professional.seniority}
                            </span>
                          )}
                          {professional.position && (
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">
                              {professional.position}
                            </span>
                          )}
                        </div>
                      </div>
                      <svg className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Sem Profissionais */}
          {professionals.length === 0 && (
            <SectionCard
              title="Profissionais"
              icon={
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <svg
                  className="h-12 w-12 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <p className="text-gray-500 font-medium">Nenhum profissional cadastrado</p>
                <p className="text-gray-400 text-sm mt-1">
                  Adicione profissionais para este cliente.
                </p>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Coluna lateral (1/3) */}
        <div className="space-y-6">

          {/* Registro */}
          <SectionCard
            title="Informações"
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <div className="space-y-4">
              <InfoField label="ID" value={<span className="font-mono text-xs text-gray-500">{client.id}</span>} />
              <InfoField label="Total de Profissionais" value={<span className="text-lg font-semibold">{professionals.length}</span>} />
              {client.created_at && (
                <InfoField label="Criado em" value={formatDate(client.created_at)} />
              )}
              {client.updated_at && (
                <InfoField label="Atualizado em" value={formatDate(client.updated_at)} />
              )}
            </div>
          </SectionCard>

          {/* Ações */}
          <div className="space-y-2">
            <Link
              href={`/clientes/${id}/editar`}
              className="block w-full text-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Editar Cliente
            </Link>
            <Link
              href={`/profissionais?cliente=${id}`}
              className="block w-full text-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Ver Profissionais
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
