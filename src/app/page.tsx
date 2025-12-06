'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página de assinatura/dashboard
    router.push('/assinatura');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 to-blue-500">
      <div className="text-white text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">🏠</div>
          <h1 className="text-4xl font-bold mb-2">Coach Imobiliário</h1>
          <p className="text-xl opacity-90">Acelere suas vendas com IA</p>
        </div>
        <div className="animate-pulse">
          <p className="text-lg">Carregando...</p>
        </div>
      </div>
    </div>
  );
}
