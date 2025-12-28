'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ImoveisPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página inicial Lux.ai
    router.push('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white text-xl">Redirecionando...</div>
    </div>
  );
}
