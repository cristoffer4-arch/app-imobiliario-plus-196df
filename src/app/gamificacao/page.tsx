'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, Users, Trophy, Target, Zap, TrendingUp, Award, 
  Plus, Edit, Trash2, Play, Pause, BarChart3, Medal,
  Crown, Star, Flame, Calendar, DollarSign, CheckCircle2,
  UserPlus, Settings, Eye, EyeOff, Key, RefreshCw, Wifi,
  WifiOff, Clock, Activity
} from 'lucide-react';

// Tipos
interface Consultor {
  id: string;
  nome: string;
  foto: string;
  pontos: number;
  nivel: number;
  vendas_mes: number;
  meta_mes: number;
  leads_convertidos: number;
  comissao_mes: number;
  posicao_ranking: number;
  badges: string[];
  desempenho_percentual: number;
  online: boolean;
  ultima_atualizacao: Date;
}

interface Competicao {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'vendas' | 'leads' | 'comissao' | 'pontos';
  data_inicio: Date;
  data_fim: Date;
  status: 'ativa' | 'pausada' | 'finalizada';
  meta: number;
  premio: string;
  participantes: string[];
  ranking: { consultor_id: string; valor: number }[];
}

interface DesafioEquipe {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'individual' | 'equipe';
  meta: number;
  progresso: number;
  pontos_recompensa: number;
  expira_em: Date;
  status: 'ativo' | 'concluido' | 'expirado';
}

interface JogoOnline {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'quiz' | 'simulacao' | 'desafio_tempo' | 'role_play';
  duracao: number;
  pontos_max: number;
  participantes: number;
  disponivel: boolean;
}

export default function GamificacaoPage() {
  const [abaSelecionada, setAbaSelecionada] = useState<'equipe' | 'competicoes' | 'desafios' | 'jogos'>('equipe');
  const [modalCriarCompeticao, setModalCriarCompeticao] = useState(false);
  const [modalCriarDesafio, setModalCriarDesafio] = useState(false);
  const [modalAdicionarConsultor, setModalAdicionarConsultor] = useState(false);
  const [modalCodigoAcesso, setModalCodigoAcesso] = useState(false);
  const [codigoAcessoDiretor, setCodigoAcessoDiretor] = useState('');
  const [codigoGerado, setCodigoGerado] = useState('');
  const [mostrarCodigo, setMostrarCodigo] = useState(false);
  const [atualizacaoAutomatica, setAtualizacaoAutomatica] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());

  // Simular atualizações automáticas em tempo real
  useEffect(() => {
    if (!atualizacaoAutomatica) return;

    const interval = setInterval(() => {
      setUltimaAtualizacao(new Date());
      // Aqui você faria a chamada real à API para buscar dados atualizados
      console.log('🔄 Dados atualizados automaticamente em tempo real');
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, [atualizacaoAutomatica]);

  // Gerar código de acesso para diretor comercial
  const gerarCodigoAcesso = () => {
    const codigo = Math.random().toString(36).substring(2, 10).toUpperCase();
    setCodigoGerado(codigo);
    setCodigoAcessoDiretor(codigo);
    // Aqui você salvaria o código no banco de dados
    console.log('🔑 Código de acesso gerado:', codigo);
  };

  // Mock data - Consultores da equipe (com status online)
  const consultores: Consultor[] = [
    {
      id: '1',
      nome: 'Ana Costa',
      foto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      pontos: 8500,
      nivel: 12,
      vendas_mes: 8,
      meta_mes: 10,
      leads_convertidos: 15,
      comissao_mes: 12500,
      posicao_ranking: 1,
      badges: ['top_vendedor', 'streak_30', 'mentor'],
      desempenho_percentual: 95,
      online: true,
      ultima_atualizacao: new Date()
    },
    {
      id: '2',
      nome: 'João Silva',
      foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      pontos: 7200,
      nivel: 10,
      vendas_mes: 6,
      meta_mes: 10,
      leads_convertidos: 12,
      comissao_mes: 9800,
      posicao_ranking: 2,
      badges: ['negociador', 'rapido'],
      desempenho_percentual: 78,
      online: true,
      ultima_atualizacao: new Date()
    },
    {
      id: '3',
      nome: 'Maria Santos',
      foto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      pontos: 6800,
      nivel: 9,
      vendas_mes: 5,
      meta_mes: 10,
      leads_convertidos: 10,
      comissao_mes: 8200,
      posicao_ranking: 3,
      badges: ['prospector', 'consistente'],
      desempenho_percentual: 72,
      online: false,
      ultima_atualizacao: new Date(Date.now() - 1800000) // 30 min atrás
    },
    {
      id: '4',
      nome: 'Pedro Oliveira',
      foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      pontos: 5900,
      nivel: 8,
      vendas_mes: 4,
      meta_mes: 10,
      leads_convertidos: 8,
      comissao_mes: 6500,
      posicao_ranking: 4,
      badges: ['iniciante'],
      desempenho_percentual: 58,
      online: true,
      ultima_atualizacao: new Date()
    },
    {
      id: '5',
      nome: 'Sofia Rodrigues',
      foto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
      pontos: 5200,
      nivel: 7,
      vendas_mes: 3,
      meta_mes: 10,
      leads_convertidos: 7,
      comissao_mes: 5800,
      posicao_ranking: 5,
      badges: ['promessa'],
      desempenho_percentual: 52,
      online: false,
      ultima_atualizacao: new Date(Date.now() - 3600000) // 1h atrás
    }
  ];

  // Mock data - Competições
  const competicoes: Competicao[] = [
    {
      id: '1',
      nome: 'Desafio Vendas Dezembro',
      descricao: 'Quem vender mais imóveis em dezembro ganha viagem para o Algarve!',
      tipo: 'vendas',
      data_inicio: new Date('2024-12-01'),
      data_fim: new Date('2024-12-31'),
      status: 'ativa',
      meta: 15,
      premio: 'Viagem ao Algarve + €500',
      participantes: ['1', '2', '3', '4', '5'],
      ranking: [
        { consultor_id: '1', valor: 8 },
        { consultor_id: '2', valor: 6 },
        { consultor_id: '3', valor: 5 },
        { consultor_id: '4', valor: 4 },
        { consultor_id: '5', valor: 3 }
      ]
    },
    {
      id: '2',
      nome: 'Maratona de Leads',
      descricao: 'Gere o máximo de leads qualificados esta semana',
      tipo: 'leads',
      data_inicio: new Date('2024-12-16'),
      data_fim: new Date('2024-12-22'),
      status: 'ativa',
      meta: 50,
      premio: 'Bônus €300',
      participantes: ['1', '2', '3', '4', '5'],
      ranking: [
        { consultor_id: '1', valor: 15 },
        { consultor_id: '2', valor: 12 },
        { consultor_id: '3', valor: 10 },
        { consultor_id: '4', valor: 8 },
        { consultor_id: '5', valor: 7 }
      ]
    }
  ];

  // Mock data - Desafios
  const desafios: DesafioEquipe[] = [
    {
      id: '1',
      titulo: 'Meta Coletiva: 30 Vendas',
      descricao: 'Equipe deve atingir 30 vendas até fim do mês',
      tipo: 'equipe',
      meta: 30,
      progresso: 26,
      pontos_recompensa: 5000,
      expira_em: new Date('2024-12-31'),
      status: 'ativo'
    },
    {
      id: '2',
      titulo: 'Feche 3 Vendas Esta Semana',
      descricao: 'Desafio individual: feche 3 vendas até domingo',
      tipo: 'individual',
      meta: 3,
      progresso: 1,
      pontos_recompensa: 1000,
      expira_em: new Date('2024-12-22'),
      status: 'ativo'
    },
    {
      id: '3',
      titulo: 'Converta 10 Leads',
      descricao: 'Converta 10 leads em visitas agendadas',
      tipo: 'individual',
      meta: 10,
      progresso: 7,
      pontos_recompensa: 800,
      expira_em: new Date('2024-12-25'),
      status: 'ativo'
    }
  ];

  // Mock data - Jogos Online
  const jogos: JogoOnline[] = [
    {
      id: '1',
      nome: 'Quiz Imobiliário',
      descricao: 'Teste seus conhecimentos sobre mercado imobiliário',
      tipo: 'quiz',
      duracao: 15,
      pontos_max: 500,
      participantes: 45,
      disponivel: true
    },
    {
      id: '2',
      nome: 'Simulador de Negociação',
      descricao: 'Pratique técnicas de negociação em cenários reais',
      tipo: 'simulacao',
      duracao: 30,
      pontos_max: 1000,
      participantes: 28,
      disponivel: true
    },
    {
      id: '3',
      nome: 'Desafio Rápido: Objeções',
      descricao: 'Responda objeções de clientes no menor tempo possível',
      tipo: 'desafio_tempo',
      duracao: 10,
      pontos_max: 300,
      participantes: 67,
      disponivel: true
    },
    {
      id: '4',
      nome: 'Role-Play: Primeira Visita',
      descricao: 'Simule uma primeira visita com cliente exigente',
      tipo: 'role_play',
      duracao: 20,
      pontos_max: 750,
      participantes: 34,
      disponivel: true
    }
  ];

  const getRankingIcon = (posicao: number) => {
    if (posicao === 1) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (posicao === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (posicao === 3) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-lg font-bold text-gray-500">#{posicao}</span>;
  };

  const getDesempenhoColor = (percentual: number) => {
    if (percentual >= 90) return 'from-green-500 to-emerald-600';
    if (percentual >= 70) return 'from-blue-500 to-cyan-600';
    if (percentual >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-600';
  };

  const getTempoDecorrido = (data: Date) => {
    const diff = Date.now() - data.getTime();
    const minutos = Math.floor(diff / 60000);
    if (minutos < 1) return 'agora mesmo';
    if (minutos < 60) return `${minutos} min atrás`;
    const horas = Math.floor(minutos / 60);
    return `${horas}h atrás`;
  };

  const consultoresOnline = consultores.filter(c => c.online).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Home className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-xl">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gamificação & Equipe
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Gestão de equipe, competições e desafios
                  </p>
                </div>
              </div>
            </div>

            {/* Status de Sincronização e Código de Acesso */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                {atualizacaoAutomatica ? (
                  <Wifi className="w-5 h-5 text-green-500 animate-pulse" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {atualizacaoAutomatica ? 'Online' : 'Offline'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {getTempoDecorrido(ultimaAtualizacao)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAtualizacaoAutomatica(!atualizacaoAutomatica)}
                className={`p-2 rounded-lg transition-all ${
                  atualizacaoAutomatica
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
                title={atualizacaoAutomatica ? 'Desativar sincronização' : 'Ativar sincronização'}
              >
                <RefreshCw className={`w-5 h-5 ${atualizacaoAutomatica ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setModalCodigoAcesso(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Key className="w-5 h-5" />
                Código Diretor
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de Status Online */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-white animate-pulse" />
              <div>
                <h3 className="text-white font-bold text-lg">
                  Sistema de Atualizações em Tempo Real Ativo
                </h3>
                <p className="text-white/90 text-sm">
                  {consultoresOnline} de {consultores.length} consultores online • Dados sincronizados automaticamente
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">
                Atualizado {getTempoDecorrido(ultimaAtualizacao)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs de Navegação */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setAbaSelecionada('equipe')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                abaSelecionada === 'equipe'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Minha Equipe
            </button>
            <button
              onClick={() => setAbaSelecionada('competicoes')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                abaSelecionada === 'competicoes'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Trophy className="w-5 h-5 inline mr-2" />
              Competições
            </button>
            <button
              onClick={() => setAbaSelecionada('desafios')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                abaSelecionada === 'desafios'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Target className="w-5 h-5 inline mr-2" />
              Desafios
            </button>
            <button
              onClick={() => setAbaSelecionada('jogos')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                abaSelecionada === 'jogos'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Jogos Online
            </button>
          </div>
        </div>

        {/* Conteúdo: Minha Equipe */}
        {abaSelecionada === 'equipe' && (
          <div className="space-y-6">
            {/* Stats da Equipe */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Consultores</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{consultores.length}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {consultoresOnline} online agora
                    </p>
                  </div>
                  <Users className="w-10 h-10 text-purple-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Vendas do Mês</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {consultores.reduce((acc, c) => acc + c.vendas_mes, 0)}
                    </p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comissão Total</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      €{(consultores.reduce((acc, c) => acc + c.comissao_mes, 0) / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <DollarSign className="w-10 h-10 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Leads Convertidos</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {consultores.reduce((acc, c) => acc + c.leads_convertidos, 0)}
                    </p>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Ranking da Equipe com Status Online */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-7 h-7 text-purple-500" />
                  Ranking de Desempenho (Tempo Real)
                </h2>
                <button 
                  onClick={() => setModalAdicionarConsultor(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Adicionar Consultor
                </button>
              </div>

              <div className="space-y-4">
                {consultores.map((consultor) => (
                  <div
                    key={consultor.id}
                    className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      {/* Posição no Ranking */}
                      <div className="flex-shrink-0 w-16 flex items-center justify-center">
                        {getRankingIcon(consultor.posicao_ranking)}
                      </div>

                      {/* Foto do Consultor com Status Online */}
                      <div className="flex-shrink-0 relative">
                        <img
                          src={consultor.foto}
                          alt={consultor.nome}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                        />
                        <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-white dark:border-gray-700 ${
                          consultor.online ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>

                      {/* Informações do Consultor */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {consultor.nome}
                              </h3>
                              {consultor.online ? (
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
                                  <Wifi className="w-3 h-3" />
                                  Online
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs font-bold rounded-full">
                                  Offline • {getTempoDecorrido(consultor.ultima_atualizacao)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                Nível {consultor.nivel}
                              </span>
                              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                {consultor.pontos.toLocaleString('pt-PT')} pontos
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                              {consultor.desempenho_percentual}%
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Desempenho</p>
                          </div>
                        </div>

                        {/* Barra de Desempenho */}
                        <div className="mb-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                            <div
                              className={`bg-gradient-to-r ${getDesempenhoColor(consultor.desempenho_percentual)} h-3 rounded-full transition-all duration-500`}
                              style={{ width: `${consultor.desempenho_percentual}%` }}
                            />
                          </div>
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-4 gap-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {consultor.vendas_mes}/{consultor.meta_mes}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Vendas</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {consultor.leads_convertidos}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Leads</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              €{(consultor.comissao_mes / 1000).toFixed(1)}k
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Comissão</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              {consultor.badges.length}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Badges</p>
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex-shrink-0 flex flex-col gap-2">
                        <button className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
                          <Settings className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all">
                          <BarChart3 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Adicionar Consultor */}
            {modalAdicionarConsultor && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Adicionar Novo Consultor
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Carlos Mendes"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="carlos@exemplo.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Meta Mensal (vendas)
                      </label>
                      <input
                        type="number"
                        placeholder="10"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Foto (URL)
                      </label>
                      <input
                        type="url"
                        placeholder="https://exemplo.com/foto.jpg"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setModalAdicionarConsultor(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancelar
                    </button>
                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Adicionar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Conteúdo: Competições */}
        {abaSelecionada === 'competicoes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Competições Internas</h2>
              <button
                onClick={() => setModalCriarCompeticao(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Criar Competição
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {competicoes.map((comp) => (
                <div
                  key={comp.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {comp.nome}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{comp.descricao}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      comp.status === 'ativa' ? 'bg-green-100 text-green-700' :
                      comp.status === 'pausada' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {comp.status === 'ativa' ? 'Ativa' : comp.status === 'pausada' ? 'Pausada' : 'Finalizada'}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900 dark:text-white">Prêmio:</span>
                    </div>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{comp.premio}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                      <span className="font-semibold text-gray-900 dark:text-white capitalize">{comp.tipo}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Meta:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{comp.meta}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Participantes:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{comp.participantes.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Termina em:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comp.data_fim.toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Ranking Atual:</h4>
                    <div className="space-y-2">
                      {comp.ranking.slice(0, 3).map((rank, idx) => {
                        const consultor = consultores.find(c => c.id === rank.consultor_id);
                        return (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                            <div className="flex items-center gap-3">
                              {getRankingIcon(idx + 1)}
                              <span className="font-medium text-gray-900 dark:text-white">{consultor?.nome}</span>
                            </div>
                            <span className="font-bold text-purple-600 dark:text-purple-400">{rank.valor}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 py-2 rounded-lg font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
                      <Edit className="w-4 h-4 inline mr-1" />
                      Editar
                    </button>
                    <button className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 py-2 rounded-lg font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all">
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Criar Competição */}
            {modalCriarCompeticao && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Criar Nova Competição
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nome da Competição
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Desafio Vendas Janeiro"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Descrição
                      </label>
                      <textarea
                        placeholder="Descreva os objetivos e regras da competição"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Tipo
                        </label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none">
                          <option value="vendas">Vendas</option>
                          <option value="leads">Leads</option>
                          <option value="comissao">Comissão</option>
                          <option value="pontos">Pontos</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Meta
                        </label>
                        <input
                          type="number"
                          placeholder="Ex: 20"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Data Início
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Data Fim
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Prêmio
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Viagem ao Algarve + €500"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setModalCriarCompeticao(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancelar
                    </button>
                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Criar Competição
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Conteúdo: Desafios */}
        {abaSelecionada === 'desafios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Desafios Ativos</h2>
              <button
                onClick={() => setModalCriarDesafio(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Criar Desafio
              </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {desafios.map((desafio) => (
                <div
                  key={desafio.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        desafio.tipo === 'equipe' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {desafio.tipo === 'equipe' ? 'Equipe' : 'Individual'}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-3 mb-2">
                        {desafio.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{desafio.descricao}</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Recompensa</span>
                      <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                        +{desafio.pontos_recompensa} pts
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {desafio.progresso}/{desafio.meta}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(desafio.progresso / desafio.meta) * 100}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Expira em:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {desafio.expira_em.toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 py-2 rounded-lg font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all">
                      <Edit className="w-4 h-4 inline mr-1" />
                      Editar
                    </button>
                    <button className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 py-2 rounded-lg font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all">
                      <Trash2 className="w-4 h-4 inline mr-1" />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Criar Desafio */}
            {modalCriarDesafio && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Criar Novo Desafio
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Título do Desafio
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Feche 5 Vendas Esta Semana"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Descrição
                      </label>
                      <textarea
                        placeholder="Descreva o desafio"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tipo
                      </label>
                      <select className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none">
                        <option value="individual">Individual</option>
                        <option value="equipe">Equipe</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Meta
                        </label>
                        <input
                          type="number"
                          placeholder="5"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Pontos
                        </label>
                        <input
                          type="number"
                          placeholder="1000"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Data de Expiração
                      </label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setModalCriarDesafio(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancelar
                    </button>
                    <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      Criar Desafio
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Conteúdo: Jogos Online */}
        {abaSelecionada === 'jogos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Jogos de Desenvolvimento</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {jogos.map((jogo) => (
                <div
                  key={jogo.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {jogo.nome}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{jogo.descricao}</p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-500" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{jogo.duracao}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">minutos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{jogo.pontos_max}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">pontos máx</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{jogo.participantes}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">jogaram</p>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    Jogar Agora
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal Código de Acesso para Diretor Comercial */}
      {modalCodigoAcesso && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Código de Acesso
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Para Diretor Comercial
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Gere um código único para permitir que o diretor comercial acesse todos os resultados e acompanhe a equipe em tempo real.
              </p>
              
              {codigoGerado ? (
                <div className="space-y-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-blue-500">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Código Gerado:
                      </span>
                      <button
                        onClick={() => setMostrarCodigo(!mostrarCodigo)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        {mostrarCodigo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-mono tracking-wider">
                      {mostrarCodigo ? codigoGerado : '••••••••'}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(codigoGerado);
                        alert('Código copiado para a área de transferência!');
                      }}
                      className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 py-2 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                    >
                      Copiar Código
                    </button>
                    <button
                      onClick={gerarCodigoAcesso}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      Gerar Novo
                    </button>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                      ⚠️ Compartilhe este código apenas com o diretor comercial. Ele terá acesso total aos resultados da equipe.
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={gerarCodigoAcesso}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Key className="w-5 h-5" />
                  Gerar Código de Acesso
                </button>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Acesso completo aos resultados em tempo real
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Visualização de rankings e desempenho da equipe
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Acompanhamento de competições e desafios
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalCodigoAcesso(false)}
              className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
