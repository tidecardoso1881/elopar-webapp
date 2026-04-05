import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ClientDeleteButton } from '@/components/clientes/client-delete-button'

interface ClientSummary {
  client_id: string
  client_name: string
  active_count: number
  terminated_count: number
  total_count: number
  total_billing: number
}

export default async function ClientesPage() {
  const supabase = await createClient()

  const { data: clients, error } = await supabase
    .from('v_client_summary')
    .select('*')

  const clientsSummary = (clients ?? []) as ClientSummary[]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {clientsSummary.length > 0
              ? `${clientsSummary.length} cliente${clientsSummary.length !== 1 ? 's' : ''}`
              : 'Nenhum cliente cadastrado'}
          </p>
        </div>
        <Link
          href="/clientes/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Novo Cliente
        </Link>
      </div>

      {/* Erro */}
      {error && (
        <div className="px-5 py-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
          Erro ao carregar clientes: {error.message}
        </div>
      )}

      {/* Grid de Cards */}
      {clientsSummary.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.581m0 0H9m5.581 0a2 2 0 100-4 2 2 0 000 4zM9 7h.01M9 17h.01M9 12h.01"
            />
          </svg>
          <p className="text-gray-500 font-medium">Nenhum cliente encontrado</p>
          <p className="text-gray-400 text-sm mt-1">
            Comece adicionando clientes ao sistema.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientsSummary.map((client) => {
            const activePercentage =
              client.total_count > 0
                ? Math.round((client.active_count / client.total_count) * 100)
                : 0

            return (
              <div
                key={client.client_id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
              >
                {/* Card Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-gray-900 truncate">
                    {client.client_name}
                  </h2>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link
                      href={`/clientes/${client.client_id}/editar`}
                      title="Editar cliente"
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                      </svg>
                    </Link>
                    <ClientDeleteButton id={client.client_id} name={client.client_name} />
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-5 py-4 flex-1 space-y-4">
                  {/* Badges */}
                  <div className="flex gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-700">
                      {client.active_count} ativo{client.active_count !== 1 ? 's' : ''}
                    </span>
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-600">
                      {client.terminated_count} desligado{client.terminated_count !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Total de Profissionais */}
                  <div className="bg-gray-50 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                      Total de Profissionais
                    </p>
                    <p className="text-2xl font-semibold text-gray-900 mt-1">
                      {client.total_count}
                    </p>
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

                  {/* Billing */}
                  {client.total_billing > 0 && (
                    <div className="bg-blue-50 rounded-lg px-4 py-3">
                      <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold">
                        Faturamento
                      </p>
                      <p className="text-lg font-semibold text-blue-900 mt-1">
                        R$ {client.total_billing.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer - Botão */}
                <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
                  <Link
                    href={`/profissionais?cliente=${client.client_id}`}
                    className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Ver profissionais
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}