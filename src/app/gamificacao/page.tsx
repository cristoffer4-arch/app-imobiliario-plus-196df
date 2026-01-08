'use client';

import { useState } from 'react';
import BackButton from '@/components/BackButton';
import { 
  Trophy, Target, Users, Crown, Star,
  TrendingUp, Award, Zap, Medal, Flame, Gift, Plus
} from 'lucide-react';
import { sistemaCentralIA } from '@/lib/ai-services';

export default function GamificacaoPage() {
  const [tipoRanking, setTipoRanking] = useState<'individual' | 'equipe'>('individual');
  const [mostrarCriarDesafio, setMostrarCriarDesafio] = useState(false);

  const ranking = [
    { posicao: 1, nome: 'Ana Costa', avatar: '👩', pontos: 2450, vendas: 8, nivel: 12, badge: '🏆' },
    { posicao: 2, nome: 'João Silva', avatar: '👨', pontos: 2100, vendas: 6, nivel: 10, badge: '🥈' },
    { posicao: 3, nome: 'Maria Santos', avatar: '👩', pontos: 1890, vendas: 5, nivel: 9, badge: '🥉' },
    { posicao: 4, nome: 'Pedro Costa', avatar: '👨', pontos: 1650, vendas: 4, nivel: 8, badge: '⭐' },
    { posicao: 5, nome: 'Sofia Alves', avatar: '👩', pontos: 1420, vendas: 3, nivel: 7, badge: '⭐' }
  ];

  const desafiosAtivos = [
    {
      id: 1,
      titulo: 'Mestre da Prospecção',
      descricao: 'Faça 50 ligações esta semana',
      progresso: 32,
      meta: 50,
      pontos: 500,
      tipo: 'individual',
      expira: '3 dias'
    },
    {
      id: 2,
      titulo: 'Equipe Campeã',
      descricao: 'Feche 10 vendas em equipe este mês',
      progresso: 6,
      meta: 10,
      pontos: 2000,
      tipo: 'equipe',
      expira: '15 dias'
    },
    {
      id: 3,
      titulo: 'Velocidade de Resposta',
      descricao: 'Responda 20 leads em menos de 1 hora',
      progresso: 14,
      meta: 20,
      pontos: 300,
      tipo: 'individual',
      expira: '7 dias'
    }
  ];

  const conquistas = [
    { nome: 'Primeira Venda', icon: '🎯', conquistado: true },
    { nome: 'Vendedor do Mês', icon: '👑', conquistado: true },
    { nome: 'Streak 7 dias', icon: '🔥', conquistado: true },
    { nome: 'Top 3 Ranking', icon: '🏆', conquistado: true },
    { nome: '10 Vendas', icon: '💎', conquistado: false },
    { nome: 'Mentor', icon: '🎓', conquistado: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      <div className="h-11 bg-white dark:bg-gray-900"></div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BackButton />
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Gamificação
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Competições e Rankings
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setMostrarCriarDesafio(true)}
              className="px-3 py-2 bg-purple-500 active:bg-purple-600 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-lg text-sm font-semibold"
            >
              <Plus className="w-4 h-4" />
              Criar
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Perfil do Usuário */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                👩
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">Ana Costa</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-yellow-300" />
                    <span className="text-white text-sm font-semibold">Nível 12</span>
                  </div>
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <span className="text-white text-sm font-semibold">#1</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-white">2.450</p>
                <p className="text-white/90 text-xs">Pontos</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-white/90 text-xs">Vendas</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-white/90 text-xs">Conquistas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Ranking */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-2 shadow-sm border border-gray-200 dark:border-gray-800 flex gap-2">
          <button
            onClick={() => setTipoRanking('individual')}
            className={`flex-1 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
              tipoRanking === 'individual'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Individual
          </button>
          <button
            onClick={() => setTipoRanking('equipe')}
            className={`flex-1 py-2.5 rounded-2xl font-semibold text-sm transition-all ${
              tipoRanking === 'equipe'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Equipes
          </button>
        </div>

        {/* Ranking */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Ranking {tipoRanking === 'individual' ? 'Individual' : 'de Equipes'}
            </h2>
          </div>

          <div className="space-y-2">
            {ranking.map((pessoa) => (
              <div
                key={pessoa.posicao}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  pessoa.posicao === 1
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
                    : pessoa.posicao === 2
                    ? 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border-gray-300 dark:border-gray-700'
                    : pessoa.posicao === 3
                    ? 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-300 dark:border-orange-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{pessoa.badge}</div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-xl">
                    {pessoa.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {pessoa.nome}
                      </h3>
                      <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">
                        Nv. {pessoa.nivel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {pessoa.pontos} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {pessoa.vendas} vendas
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      #{pessoa.posicao}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desafios Ativos */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Desafios Ativos
            </h2>
          </div>

          <div className="space-y-3">
            {desafiosAtivos.map((desafio) => (
              <div key={desafio.id} className="p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border border-orange-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {desafio.titulo}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        desafio.tipo === 'individual'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                      }`}>
                        {desafio.tipo === 'individual' ? 'Individual' : 'Equipe'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {desafio.descricao}
                    </p>
                  </div>
                  <div className="ml-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    +{desafio.pontos}
                  </div>
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
                    Expira em {desafio.expira}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conquistas */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Conquistas
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {conquistas.map((conquista, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border-2 text-center transition-all ${
                  conquista.conquistado
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-300 dark:border-purple-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50'
                }`}
              >
                <div className="text-3xl mb-2">{conquista.icon}</div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {conquista.nome}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recompensas */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-900 rounded-3xl p-5 border border-purple-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Loja de Recompensas
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { nome: 'Vale €50', custo: 1000, icon: '💰' },
              { nome: 'Dia de Folga', custo: 2000, icon: '🏖️' },
              { nome: 'Curso Premium', custo: 1500, icon: '🎓' },
              { nome: 'Jantar Equipe', custo: 3000, icon: '🍽️' }
            ].map((recompensa, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-purple-200 dark:border-gray-700">
                <div className="text-3xl mb-2 text-center">{recompensa.icon}</div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white text-center mb-1">
                  {recompensa.nome}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 text-center font-semibold">
                  {recompensa.custo} pontos
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
