export default function ClientesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Grid of client cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
              <div className="h-6 w-32 bg-gray-100 rounded" />
            </div>

            {/* Card body */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="h-4 w-24 bg-gray-100 rounded" />
                <div className="h-8 w-16 bg-gray-100 rounded mt-2" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-100 rounded" />
                <div className="h-2 w-full bg-gray-100 rounded-full" />
              </div>
            </div>

            {/* Card footer */}
            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50">
              <div className="h-10 w-full bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
