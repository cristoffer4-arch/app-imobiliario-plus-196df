'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, RefreshCw, CheckCircle2, AlertCircle, Clock, 
  Database, Users, Building2, Settings, Download, Upload,
  Zap, Activity, TrendingUp, ArrowRight, Key, Link2
} from 'lucide-react';

interface SyncStatus {
  tipo: 'imoveis' | 'leads' | 'contatos';
  status: 'sincronizado' | 'pendente' | 'erro' | 'sincronizando';
  ultima_sync: Date;
  total_registros: number;
  novos: number;
  atualizados: number;
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-green-400',
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
  },
  gray: {
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    text: 'text-gray-600 dark:text-gray-400',
  },
} as const;

export default function IntegracaoCasafariPage() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [conectado, setConectado] = useState(false);
  const [sincronizando, setSincronizando] = useState(false);
  const [modalConfig, setModalConfig] = useState(false);

  // Mock data - Status de sincronização
  const [syncStatus, setSyncStatus] = useState<SyncStatus[]>([
    {
      tipo: 'imoveis',
      status: 'sincronizado',
      ultima_sync: new Date('2024-12-20T10:30:00'),
      total_registros: 245,
      novos: 12,
      atualizados: 8
    },
    {
      tipo: 'leads',
      status: 'sincronizado',
      ultima_sync: new Date('2024-12-20T10:28:00'),
      total_registros: 156,
      novos: 23,
      atualizados: 15
    },
    {
      tipo: 'contatos',
      status: 'pendente',
      ultima_sync: new Date('2024-12-19T18:45:00'),
      total_registros: 89,
      novos: 0,
      atualizados: 0
    }
  ]);

  const handleConectar = () => {
    if (apiKey && apiSecret) {
      setConectado(true);
      setModalConfig(false);
    }
  };

  const handleSincronizar = async (tipo?: 'imoveis' | 'leads' | 'contatos') => {
    setSincronizando(true);
    
    // Simular sincronização
    setTimeout(() => {
      setSyncStatus(prev => prev.map(item => {
        if (!tipo || item.tipo === tipo) {
          return {
            ...item,
            status: 'sincronizado',
            ultima_sync: new Date(),
            novos: Math.floor(Math.random() * 10),
            atualizados: Math.floor(Math.random() * 20)
          };
        }
        return item;
      }));
      setSincronizando(false);
    }, 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sincronizado':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pendente':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'erro':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'sincronizando':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sincronizado':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'erro':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'sincronizando':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'imoveis':
        return <Building2 className="w-6 h-6" />;
      case 'leads':
        return <TrendingUp className="w-6 h-6" />;
      case 'contatos':
        return <Users className="w-6 h-6" />;
      default:
        return <Database className="w-6 h-6" />;
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'imoveis':
        return 'Imóveis';
      case 'leads':
        return 'Leads';
      case 'contatos':
        return 'Contatos';
      default:
        return tipo;
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
                  <Home className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-xl">
                  <Link2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Integração Casafari
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Sincronize dados do CRM Casafari automaticamente
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setModalConfig(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-5 h-5" />
              Configurar API
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status de Conexão */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                conectado 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}>
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {conectado ? 'Conectado ao Casafari' : 'Não Conectado'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {conectado 
                    ? 'Sincronização automática ativa' 
                    : 'Configure suas credenciais para começar'}
                </p>
              </div>
            </div>

            {conectado ? (
              <button
                onClick={() => handleSincronizar()}
                disabled={sincronizando}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 ${sincronizando ? 'animate-spin' : ''}`} />
                {sincronizando ? 'Sincronizando...' : 'Sincronizar Tudo'}
              </button>
            ) : (
              <button
                onClick={() => setModalConfig(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                <Key className="w-5 h-5" />
                Conectar Agora
              </button>
            )}
          </div>
        </div>

        {/* Cards de Sincronização */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {syncStatus.map((sync) => (
            <div
              key={sync.tipo}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-xl text-white">
                    {getTipoIcon(sync.tipo)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {getTipoLabel(sync.tipo)}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sync.total_registros} registros
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(sync.status)}
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(sync.status)}`}>
                      {sync.status === 'sincronizado' ? 'Sincronizado' :
                       sync.status === 'pendente' ? 'Pendente' :
                       sync.status === 'erro' ? 'Erro' : 'Sincronizando'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Última sync</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {sync.ultima_sync.toLocaleString('pt-PT', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        +{sync.novos}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Novos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {sync.atualizados}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Atualizados</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSincronizar(sync.tipo)}
                disabled={sincronizando || !conectado}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${sincronizando ? 'animate-spin' : ''}`} />
                Sincronizar
              </button>
            </div>
          ))}
        </div>

        {/* Estatísticas e Atividade */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Estatísticas Gerais */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-500" />
              Estatísticas de Sincronização
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">Total Importado</span>
                </div>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {syncStatus.reduce((acc, s) => acc + s.total_registros, 0)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">Novos Hoje</span>
                </div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {syncStatus.reduce((acc, s) => acc + s.novos, 0)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">Atualizados</span>
                </div>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {syncStatus.reduce((acc, s) => acc + s.atualizados, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Atividade Recente */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-500" />
              Atividade Recente
            </h3>

            <div className="space-y-3">
              {[
                { tipo: 'Imóveis', acao: '12 novos imóveis importados', tempo: '5 min atrás', icon: Building2, color: 'blue' },
                { tipo: 'Leads', acao: '23 leads atualizados', tempo: '10 min atrás', icon: TrendingUp, color: 'green' },
                { tipo: 'Contatos', acao: '8 contatos sincronizados', tempo: '1 hora atrás', icon: Users, color: 'purple' },
                { tipo: 'Sistema', acao: 'Sincronização automática ativada', tempo: '2 horas atrás', icon: CheckCircle2, color: 'gray' }
              ].map((atividade, idx) => {
                const style = colorStyles[atividade.color as keyof typeof colorStyles] ?? colorStyles.gray;

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${style.bg}`}>
                      <atividade.icon className={`w-4 h-4 ${style.text}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {atividade.tipo}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {atividade.acao}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {atividade.tempo}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Configuração */}
      {modalConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Configurar API Casafari
            </h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Sua chave de API do Casafari"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  API Secret
                </label>
                <input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="Seu secret do Casafari"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Onde encontrar:</strong> Acesse o painel do Casafari → Configurações → API → Gerar credenciais
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalConfig(false)}
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConectar}
                disabled={!apiKey || !apiSecret}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
