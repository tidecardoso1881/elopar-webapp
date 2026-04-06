'use client'

interface RenovacoesFiltersProps {
  filterStatus: string
  filterClient: string
  uniqueClients: { id: string | null; name: string | null }[]
}

export function RenovacoesFilters({
  filterStatus,
  filterClient,
  uniqueClients,
}: RenovacoesFiltersProps) {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    const params = new URLSearchParams()
    if (newStatus !== 'all') params.set('status', newStatus)
    if (filterClient !== 'all') params.set('client', filterClient)
    window.location.href = `/renovacoes${params.size > 0 ? '?' + params : ''}`
  }

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newClient = e.target.value
    const params = new URLSearchParams()
    if (filterStatus !== 'all') params.set('status', filterStatus)
    if (newClient !== 'all') params.set('client', newClient)
    window.location.href = `/renovacoes${params.size > 0 ? '?' + params : ''}`
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:gap-4">
        {/* Status Filter */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </label>
          <select
            defaultValue={filterStatus}
            onChange={handleStatusChange}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="expired">Vencidos</option>
            <option value="critical">Críticos (≤30d)</option>
            <option value="warning">Atenção (≤60d)</option>
            <option value="attention">Pendentes (≤90d)</option>
          </select>
        </div>

        {/* Client Filter */}
        {uniqueClients.length > 0 && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </label>
            <select
              defaultValue={filterClient}
              onChange={handleClientChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Todos</option>
              {uniqueClients.map((client) => (
                <option key={client.id} value={client.id || ''}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {(filterStatus !== 'all' || filterClient !== 'all') && (
        <a
          href="/renovacoes"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium self-start md:self-auto"
        >
          Limpar filtros
        </a>
      )}
    </div>
  )
}
