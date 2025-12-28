'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';

export default function ImoveisPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Verificar sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      // Se não estiver logado, redirecionar para home
      if (!session) {
        router.push('/');
      }
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-light tracking-wide">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Navbar */}
      <nav className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20">
                <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  Lux.ai
                </h1>
                <p className="text-xs text-slate-500">Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-300">{session.user.email}</p>
                <p className="text-xs text-slate-500">Autenticado</p>
              </div>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">
            Bem-vindo ao Dashboard
          </h2>
          <p className="text-slate-400">
            Gerencie seus imóveis e propriedades de forma inteligente
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total de Imóveis', value: '0', icon: '🏠', color: 'from-blue-500 to-blue-600' },
            { label: 'Imóveis Ativos', value: '0', icon: '✅', color: 'from-green-500 to-green-600' },
            { label: 'Visitas Agendadas', value: '0', icon: '📅', color: 'from-amber-500 to-amber-600' },
            { label: 'Propostas Pendentes', value: '0', icon: '📝', color: 'from-purple-500 to-purple-600' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} opacity-20`} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Adicionar Imóvel', icon: '➕', description: 'Cadastre um novo imóvel' },
              { label: 'Ver Relatórios', icon: '📊', description: 'Análise e estatísticas' },
              { label: 'Gerenciar Clientes', icon: '👥', description: 'CRM integrado' },
            ].map((action, index) => (
              <button
                key={index}
                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/30 rounded-xl p-6 text-left transition-all duration-300 group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <h4 className="text-lg font-semibold text-white mb-1">{action.label}</h4>
                <p className="text-sm text-slate-400">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Atividades Recentes</h3>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏡</div>
            <p className="text-slate-400 mb-2">Nenhuma atividade ainda</p>
            <p className="text-sm text-slate-500">
              Suas atividades e atualizações aparecerão aqui
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
