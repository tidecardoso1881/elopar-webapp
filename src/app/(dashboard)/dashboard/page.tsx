export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Dashboard
      </h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {['Total', 'Ativos', 'Desligados', 'Renovações'].map((label) => (
          <div key={label} className="bg-white rounded-lg border p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-400">
        Dashboard em implementação (EP-009 a EP-011) — Sprint 2
      </p>
    </div>
  )
}
