'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import BackButton from '@/components/BackButton';

export default function ImoveisPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Verificar sessão
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setLoading(false);
      
      // Se não tiver sessão, redirecionar para login
      if (!currentSession) {
        router.push('/auth/login');
      }
    };

    checkSession();
  }, [supabase.auth, router]);

  // Escutar mudanças na autenticação
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.push('/auth/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <BackButton />
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-yellow-500">Lux.ai</h1>
                <p className="text-xs text-gray-400">GESTÃO IMOBILIÁRIA</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{session.user.email}</span>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">Dashboard Lux.ai</h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Imóveis</p>
                <p className="text-2xl font-bold text-yellow-500">0</p>
              </div>
              <div className="bg-yellow-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Clientes Ativos</p>
                <p className="text-2xl font-bold text-green-500">0</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Transações Mês</p>
                <p className="text-2xl font-bold text-blue-500">0</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition">
              <div className="text-2xl mb-2">🏠</div>
              <div className="text-sm">Adicionar Imóvel</div>
            </button>
            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition">
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm">Novo Cliente</div>
            </button>
            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm">Relatórios</div>
            </button>
            <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition">
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm">Configurações</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
