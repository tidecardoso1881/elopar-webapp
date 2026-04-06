export default function ProfissionaisLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>
      </div>

      {/* Card with filters and table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Filters skeleton */}
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100 space-y-3">
          <div className="h-10 w-full bg-gray-100 rounded" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-10 bg-gray-100 rounded" />
            <div className="h-10 bg-gray-100 rounded" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {[...Array(6)].map((_, i) => (
                  <th key={i} className="px-4 sm:px-5 py-3">
                    <div className="h-4 bg-gray-100 rounded" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 sm:px-5 py-3">
                      <div className="h-4 bg-gray-100 rounded" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 border-t border-gray-100 bg-gray-50 gap-4">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-100 rounded" />
            <div className="h-10 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
