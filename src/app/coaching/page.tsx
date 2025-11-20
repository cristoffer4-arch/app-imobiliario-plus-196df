'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Target, TrendingUp, Calendar, CheckCircle, 
  AlertCircle, Award, BarChart3, Users, Lightbulb,
  Clock, Trophy, Star, ChevronRight, Plus, Brain,
  LineChart, Activity, Zap, BookOpen, MessageSquare
} from 'lucide-react';
import { 
  MOCK_METAS_COACHING, 
  MOCK_SESSOES_COACHING, 
  MOCK_KPIS_COACHING,
  MOCK_PLANO_ACAO,
  MOCK_FEEDBACK_COACHING,
  MOCK_ANALISE_PERFORMANCE
} from '@/lib/constants';

export default function CoachingPage() {
  const [abaSelecionada, setAbaSelecionada] = useState<'visao-geral' | 'metas' | 'sessoes' | 'kpis' | 'plano-acao' | 'feedback'>('visao-geral');
  const [modalNovaMeta, setModalNovaMeta] = useState(false);

  const metas = MOCK_METAS_COACHING;
  const sessoes = MOCK_SESSOES_COACHING;
  const kpis = MOCK_KPIS_COACHING;
  const planoAcao = MOCK_PLANO_ACAO;
  const feedbacks = MOCK_FEEDBACK_COACHING;
  const analise = MOCK_ANALISE_PERFORMANCE;

  const metasAtivas = metas.filter(m => m.status === 'em_progresso');
  const metasConcluidas = metas.filter(m => m.status === 'concluida');
  const proximaSessao = sessoes.find(s => s.status === 'agendada');

  const abas = [
    { id: 'visao-geral', label: 'Visão Geral', icon: BarChart3 },
    { id: 'metas', label: 'Metas', icon: Target },
    { id: 'sessoes', label: 'Sessões', icon: Calendar },
    { id: 'kpis', label: 'KPIs', icon: TrendingUp },
    { id: 'plano-acao', label: 'Plano de Ação', icon: CheckCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_progresso': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'concluida': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'atrasada': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'agendada': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subida': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'descida': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Coaching Comercial
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Programa Business & Executive Coaching
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/coaching/chat">
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                  <Brain className="w-5 h-5" />
                  <span className="hidden sm:inline">Sessão com IA</span>
                </button>
              </Link>
              <button 
                onClick={() => setModalNovaMeta(true)}
                className="flex items-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Nova Meta</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          <div className="flex">
            {abas.map(aba => (
              <button
                key={aba.id}
                onClick={() => setAbaSelecionada(aba.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                  abaSelecionada === aba.id
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <aba.icon className="w-5 h-5" />
                {aba.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        {abaSelecionada === 'visao-geral' && (
          <div className="space-y-6">
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Target className="w-8 h-8 text-purple-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{metasAtivas.length}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Metas Ativas</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{metasConcluidas.length} concluídas</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{analise.taxa_conversao.toFixed(1)}%</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Conversão</h3>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">+2.1% vs mês anterior</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{feedbacks[0]?.nota_desempenho || 0}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Nota de Desempenho</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Última avaliação</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-blue-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{sessoes.filter(s => s.status === 'concluida').length}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Sessões Realizadas</h3>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Este trimestre</p>
              </div>
            </div>

            {/* Botão Destaque - Sessão com IA */}
            <Link href="/coaching/chat">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-purple-400">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">
                        Iniciar Sessão de Coaching com IA
                      </h3>
                      <p className="text-purple-100 text-sm">
                        Converse com seu coach pessoal disponível 24/7 para estratégias e orientações
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-8 h-8 text-white" />
                </div>
              </div>
            </Link>

            {/* Análise de Performance */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Análise de Performance - {analise.periodo}</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Métricas Principais</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Leads Gerados</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{analise.leads_gerados}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Leads Convertidos</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{analise.leads_convertidos}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Vendas Realizadas</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{analise.vendas_realizadas}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Comissão Gerada</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">€{analise.comissao_gerada.toLocaleString('pt-PT')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio Fechamento</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{analise.tempo_medio_fechamento} dias</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Áreas de Desenvolvimento</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Pontos Fortes</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analise.areas_destaque.map((area, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Áreas de Atenção</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analise.areas_atencao.map((area, idx) => (
                          <span key={idx} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs rounded-full">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Próxima Sessão */}
            {proximaSessao && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Próxima Sessão</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proximaSessao.status)}`}>
                    {proximaSessao.status === 'agendada' ? 'Agendada' : proximaSessao.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{proximaSessao.titulo}</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(proximaSessao.data).toLocaleDateString('pt-PT', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(proximaSessao.data).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} - {proximaSessao.duracao} minutos
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Coach: {proximaSessao.coach}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tópicos da Sessão</h4>
                    <ul className="space-y-1">
                      {proximaSessao.topicos.map((topico, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <ChevronRight className="w-4 h-4 mt-0.5 text-purple-500" />
                          {topico}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Metas em Destaque */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-purple-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Metas em Progresso</h2>
                </div>
                <button 
                  onClick={() => setAbaSelecionada('metas')}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Ver todas
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {metasAtivas.slice(0, 2).map(meta => (
                  <div key={meta.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{meta.titulo}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{meta.descricao}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meta.status)}`}>
                        {meta.prazo}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {meta.valor_atual}/{meta.valor_meta} {meta.unidade}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(meta.valor_atual / meta.valor_meta) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{((meta.valor_atual / meta.valor_meta) * 100).toFixed(0)}% completo</span>
                        <span>Até {new Date(meta.data_fim).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'metas' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Todas as Metas</h2>
              
              <div className="space-y-4">
                {metas.map(meta => (
                  <div key={meta.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{meta.titulo}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(meta.status)}`}>
                            {meta.status === 'em_progresso' ? 'Em Progresso' : meta.status}
                          </span>
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-medium">
                            {meta.prazo === 'curto' ? 'Curto Prazo' : meta.prazo === 'medio' ? 'Médio Prazo' : 'Longo Prazo'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{meta.descricao}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(meta.data_inicio).toLocaleDateString('pt-PT')} - {new Date(meta.data_fim).toLocaleDateString('pt-PT')}
                          </div>
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Área: {meta.area}
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {meta.valor_atual}/{meta.valor_meta} {meta.unidade}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${(meta.valor_atual / meta.valor_meta) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {((meta.valor_atual / meta.valor_meta) * 100).toFixed(1)}% completo
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Ações Definidas ({meta.acoes.filter(a => a.concluida).length}/{meta.acoes.length})</h4>
                          <div className="space-y-2">
                            {meta.acoes.map(acao => (
                              <div key={acao.id} className="flex items-start gap-3 text-sm">
                                {acao.concluida ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full mt-0.5 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                  <p className={`${acao.concluida ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {acao.descricao}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    Prazo: {new Date(acao.prazo).toLocaleDateString('pt-PT')}
                                    {acao.concluida && acao.data_conclusao && ` - Concluída em ${new Date(acao.data_conclusao).toLocaleDateString('pt-PT')}`}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'sessoes' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Histórico de Sessões</h2>
              
              <div className="space-y-4">
                {sessoes.map(sessao => (
                  <div key={sessao.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{sessao.titulo}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sessao.status)}`}>
                            {sessao.status === 'agendada' ? 'Agendada' : sessao.status === 'concluida' ? 'Concluída' : 'Cancelada'}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(sessao.data).toLocaleDateString('pt-PT', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {new Date(sessao.data).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} - {sessao.duracao} minutos
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Coach: {sessao.coach}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Tópicos Abordados</h4>
                            <ul className="space-y-1">
                              {sessao.topicos.map((topico, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <ChevronRight className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                                  {topico}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {sessao.notas && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Notas da Sessão</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-3 rounded-lg">
                              {sessao.notas}
                            </p>
                          </div>
                        )}

                        {sessao.proximos_passos && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Próximos Passos</h4>
                            <ul className="space-y-1">
                              {sessao.proximos_passos.map((passo, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                  <Zap className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                                  {passo}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'kpis' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Indicadores de Performance</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {kpis.map(kpi => (
                  <div key={kpi.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{kpi.nome}</h3>
                          {getTendenciaIcon(kpi.tendencia)}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Período: {kpi.periodo}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.valor_atual}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">/ {kpi.valor_meta} {kpi.unidade}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            (kpi.valor_atual / kpi.valor_meta) >= 0.8 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                              : (kpi.valor_atual / kpi.valor_meta) >= 0.5
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'bg-gradient-to-r from-red-500 to-pink-500'
                          }`}
                          style={{ width: `${Math.min((kpi.valor_atual / kpi.valor_meta) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {((kpi.valor_atual / kpi.valor_meta) * 100).toFixed(1)}% da meta
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm flex items-center gap-2">
                        <LineChart className="w-4 h-4" />
                        Evolução
                      </h4>
                      <div className="flex items-end justify-between gap-1 h-24">
                        {kpi.historico.map((ponto, idx) => {
                          const altura = (ponto.valor / kpi.valor_meta) * 100;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all hover:opacity-80" 
                                style={{ height: `${Math.min(altura, 100)}%` }}
                                title={`${ponto.valor} ${kpi.unidade}`}
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(ponto.data).getDate()}/{new Date(ponto.data).getMonth() + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'plano-acao' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Plano de Ação - Semana {planoAcao.semana}/{planoAcao.ano}
                </h2>
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all text-sm">
                  <Plus className="w-4 h-4" />
                  Nova Ação
                </button>
              </div>

              {/* Objetivos da Semana */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Objetivos da Semana
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {planoAcao.objetivos.map((objetivo, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                      <Star className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">{objetivo}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ações Diárias */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Ações Diárias
                </h3>
                <div className="space-y-4">
                  {planoAcao.acoes_diarias.map((dia, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">{dia.dia}</h4>
                      <ul className="space-y-2">
                        {dia.acoes.map((acao, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-3 text-sm">
                            <div className="w-5 h-5 border-2 border-purple-500 rounded-full flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{acao}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resultados e Aprendizados */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Resultado Esperado
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{planoAcao.resultado_esperado}</p>
                  
                  {planoAcao.resultado_real && (
                    <>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Resultado Real</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{planoAcao.resultado_real}</p>
                    </>
                  )}
                </div>

                {planoAcao.aprendizados && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      Aprendizados
                    </h3>
                    <ul className="space-y-2">
                      {planoAcao.aprendizados.map((aprendizado, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                          {aprendizado}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {abaSelecionada === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Feedback e Avaliações</h2>
              
              <div className="space-y-6">
                {feedbacks.map(feedback => (
                  <div key={feedback.id} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          Avaliação {feedback.tipo === 'mensal' ? 'Mensal' : feedback.tipo === 'semanal' ? 'Semanal' : 'Trimestral'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(feedback.data).toLocaleDateString('pt-PT', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {feedback.nota_desempenho}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">/ 10</div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <Trophy className="w-5 h-5 text-green-500" />
                          Pontos Fortes
                        </h4>
                        <ul className="space-y-2">
                          {feedback.pontos_fortes.map((ponto, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              {ponto}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                          Áreas de Melhoria
                        </h4>
                        <ul className="space-y-2">
                          {feedback.areas_melhoria.map((area, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        Recomendações
                      </h4>
                      <ul className="space-y-2">
                        {feedback.recomendacoes.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <ChevronRight className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-500" />
                        Próximas Ações
                      </h4>
                      <ul className="space-y-2">
                        {feedback.proximas_acoes.map((acao, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <div className="w-4 h-4 border-2 border-purple-500 rounded-full flex-shrink-0 mt-0.5" />
                            {acao}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Nova Meta (placeholder) */}
      {modalNovaMeta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Nova Meta SMART</h2>
              <button 
                onClick={() => setModalNovaMeta(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="text-2xl text-gray-500">×</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título da Meta
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Aumentar vendas mensais"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea 
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                  placeholder="Descreva sua meta de forma clara e específica"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prazo
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="curto">Curto Prazo (1-3 meses)</option>
                    <option value="medio">Médio Prazo (3-6 meses)</option>
                    <option value="longo">Longo Prazo (6-12 meses)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Área de Desenvolvimento
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="prospeccao">Prospecção</option>
                    <option value="negociacao">Negociação</option>
                    <option value="fechamento">Fechamento</option>
                    <option value="relacionamento">Relacionamento</option>
                    <option value="organizacao">Organização</option>
                    <option value="marketing_pessoal">Marketing Pessoal</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor Atual
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor Meta
                  </label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unidade
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="vendas, leads, €"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setModalNovaMeta(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setModalNovaMeta(false)}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Criar Meta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
