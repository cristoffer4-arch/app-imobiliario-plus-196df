'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any cached data or refresh subscription status
    // This would be handled by your app's state management
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pagamento Confirmado!
        </h1>
        
        <p className="text-gray-600 mb-8">
          Sua assinatura foi ativada com sucesso. Agora você tem acesso a todos
          os recursos do seu plano.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Ir para Dashboard
          </Button>
          
          <Button
            onClick={() => router.push('/pricing')}
            variant="outline"
            className="w-full"
          >
            Ver Planos
          </Button>
        </div>
      </Card>
    </div>
  );
}
