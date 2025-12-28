import ChatInterface from '@/components/ChatInterface'

export const metadata = {
  title: 'Chat com IA | Imobiliária Luxo',
  description: 'Converse com nosso assistente de IA sobre imóveis de luxo',
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Assistente IA de Imóveis</h1>
            <p className="text-gray-600 mt-2">
              Tire suas dúvidas sobre imóveis de luxo com nosso assistente inteligente.
              Pergunte sobre preços, localizações, características e muito mais!
            </p>
          </div>
          
          <div className="h-[calc(100vh-250px)]">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  )
}
