'use client';

import { useRouter } from 'next/navigation';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center">
        <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Pagamento Cancelado
        </h1>
        
        <p className="text-gray-600 mb-8">
          Você cancelou o processo de pagamento. Nenhuma cobrança foi realizada.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => router.push('/pricing')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Voltar aos Planos
          </Button>
          
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="w-full"
          >
            Ir para Dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
