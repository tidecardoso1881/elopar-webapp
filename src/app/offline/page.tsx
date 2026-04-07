export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6">
        <span className="text-white font-bold text-2xl">E</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Você está offline</h1>
      <p className="text-gray-500 mb-6 max-w-sm">
        Sem conexão com a internet. Os dados em cache ainda estão disponíveis.
      </p>
      <a
        href="/dashboard"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
      >
        Tentar novamente
      </a>
    </div>
  )
}
