export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-yellow-500 text-lg font-semibold">lux.ai</p>
        <p className="text-gray-400 text-sm mt-2">Carregando...</p>
      </div>
    </div>
  );
}
