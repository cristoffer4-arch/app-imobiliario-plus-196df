'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, Users, Building2, TrendingUp, Award, MessageSquare, 
  Bell, Settings, ChevronRight, Target, Zap, Trophy, Star,
  Calendar, DollarSign, BarChart3, FileText, Brain, Link2, Sparkles, Crown, Camera
} from 'lucide-react';
import ThemeSwitcher from '@/components/custom/theme-switcher';
import { MOCK_USER_STATS, MOCK_NOTIFICACOES, MOCK_DESAFIOS } from '@/lib/constants';

export default function Dashboard() {
  const [notificacoesVisiveis, setNotificacoesVisiveis] = useState(false);
  const stats = MOCK_USER_STATS;
  const notificacoes = MOCK_NOTIFICACOES.filter(n => !n.lida);
  const desafios = MOCK_DESAFIOS;

  const menuItems = [
    { icon: Building2, label: 'Imóveis', href: '/imoveis', color: 'from-purple-500 to-pink-500', count: 8, destaque: true },
    { icon: Users, label: 'Leads', href: '/leads', color: 'from-blue-500 to-cyan-500', count: 12 },
    { icon: DollarSign, label: 'Comissões', href: '/comissoes', color: 'from-green-500 to-emerald-500', count: 5 },
    { icon: Brain, label: 'Coaching', href: '/coaching', color: 'from-orange-500 to-red-500', count: 3 },
    { icon: Trophy, label: 'Gamificação', href: '/gamificacao', color: 'from-purple-500 to-pink-600', count: 8 },
    { icon: Link2, label: 'Casafari CRM', href: '/integracao-casafari', color: 'from-blue-500 to-cyan-600', count: 245 },
    { icon: Sparkles, label: 'Anúncio Idealista', href: '/anuncio-idealista', color: 'from-orange-500 to-red-600', count: 0 },
    { icon: MessageSquare, label: 'Assistente IA', href: '/assistente-ia', color: 'from-indigo-500 to-purple-600', count: 0 },
    { icon: Camera, label: 'Scanner Documentos', href: '/scanner-documentos', color: 'from-blue-600 to-cyan-700', count: 0 },
  ];

  const quickStats = [
    { label: 'Pontos', value: stats.pontos_totais.toLocaleString('pt-PT'), icon: Star, color: 'text-yellow-500' },
    { label: 'Nível', value: stats.nivel, icon: Trophy, color: 'text-purple-500' },
    { label: 'Ranking', value: `#${stats.ranking_posicao}`, icon: Target, color: 'text-blue-500' },
    { label: 'Vendas', value: stats.imoveis_vendidos, icon: Zap, color: 'text-green-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* iOS Status Bar Spacer */}
      <div className="h-11 bg-white dark:bg-gray-900"></div>

      {/* Header iOS Style */}
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Imobiliário GO
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Ana Costa
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              
              <button 
                onClick={() => setNotificacoesVisiveis(!notificacoesVisiveis)}
                className="relative w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-800 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notificacoes.length > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notificacoes.length}
                  </span>
                )}
              </button>

              <button className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-800 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notificações Dropdown iOS Style */}
      {notificacoesVisiveis && (
        <div className="fixed inset-x-4 top-20 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white">Notificações</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {notificacoes.map(notif => (
              <div key={notif.id} className="p-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl ${
                    notif.prioridade === 'alta' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                    notif.prioridade === 'media' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">{notif.titulo}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notif.mensagem}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.data).toLocaleString('pt-PT')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <main className="px-4 py-4 space-y-6">
        {/* Banner Destaque iOS Style */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-white">Sistema de Imóveis</h2>
                <p className="text-white/90 text-xs">IA + Casafari</p>
              </div>
            </div>
            <p className="text-white/90 text-sm mb-4 leading-relaxed">
              Detecte automaticamente imóveis duplicados e mantenha sua base atualizada.
            </p>
            <Link href="/imoveis">
              <button className="w-full bg-white hover:bg-gray-100 active:bg-gray-200 text-purple-600 font-bold py-3 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
                <Building2 className="w-5 h-5" />
                Acessar Sistema
                <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Stats iOS Style */}
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 active:scale-95 transition-transform">
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Menu Grid iOS Style */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white px-2">Funcionalidades</h3>
          <div className="space-y-3">
            {menuItems.map((item, idx) => (
              <Link key={idx} href={item.href}>
                <div className={`bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 active:scale-98 transition-all ${
                  item.destaque ? 'ring-2 ring-purple-300 dark:ring-purple-700' : ''
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {item.label}
                        {item.destaque && (
                          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">
                            NOVO
                          </span>
                        )}
                      </h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {item.count > 0 ? `${item.count} ativos` : 'Novo'}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desafios iOS Style */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" />
              Desafios Ativos
            </h3>
            <Link href="/gamificacao">
              <button className="text-sm text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                Ver todos
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            {desafios.slice(0, 2).map(desafio => (
              <div key={desafio.id} className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-900 rounded-3xl p-4 border border-orange-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {desafio.titulo}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {desafio.descricao}
                    </p>
                  </div>
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                    +{desafio.pontos_recompensa}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {desafio.progresso}/{desafio.meta}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(desafio.progresso / desafio.meta) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Expira em {new Date(desafio.expira_em).toLocaleDateString('pt-PT')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges iOS Style */}
        <div className="space-y-3 pb-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Conquistas
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {stats.badges.filter(b => b.conquistado).length}/{stats.badges.length}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {stats.badges.map(badge => (
              <div 
                key={badge.id} 
                className={`rounded-3xl p-4 border-2 transition-all ${
                  badge.conquistado 
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700' 
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-50'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
                    badge.conquistado 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}>
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-xs text-gray-900 dark:text-white">
                    {badge.nome}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {badge.descricao}
                  </p>
                  {badge.conquistado && badge.data_conquista && (
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                      {new Date(badge.data_conquista).toLocaleDateString('pt-PT')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
