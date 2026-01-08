'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, DollarSign, TrendingUp, Target, Users,
  Plus, CheckCircle2, AlertCircle, BarChart3, Calendar,
  Zap, Award, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { iaLeadsComissoes } from '@/lib/ai-services';

export default function LeadsComissoesPage() {
  const [metaAnual, setMetaAnual] = useState(100000);
  const [comissaoAtual, setComissaoAtual] = useState(45000);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const resultado = await iaLeadsComissoes.calcularComissoes('user_1');
    if (resultado.success) {
      setComissaoAtual(resultado.data.comissao_atual);
      setMetaAnual(resultado.data.meta_anual);
    }

    // Leads mockados
    setLeads([
      { id: 1, nome: 'João Silva', status: 'quente', valor: 15000, origem: 'casafari', data: '2024-01-15' },
      { id: 2, nome: 'Maria Santos', status: 'morno', valor: 8000, origem: 'manual', data: '2024-01-14' },
      { id: 3, nome: 'Pedro Costa', status: 'frio', valor: 12000, origem: 'casafari', data: '2024-01-13' },
      { id: 4, nome: 'Ana Oliveira', status: 'quente', valor: 20000, origem: 'manual', data: '2024-01-12' }
    ]);
  };

  const percentualMeta = (comissaoAtual / metaAnual) * 100;
  const faltaParaMeta = metaAnual - comissaoAtual;
  const projecaoAnual = comissaoAtual * 2.5;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quente': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'morno': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'frio': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getOrigemIcon = (origem: string) => {
    return origem === 'casafari' ? '🔗' : '✍️';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      <div className="h-11 bg-white dark:bg-gray-900"></div>

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <button className="w-9 h-9 flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-800 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Leads & Comissões
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Gestão Automática
                  </p>
                </div>
              </div>
            </div>

            <button className="px-3 py-2 bg-green-500 active:bg-green-600 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-lg text-sm font-semibold">
              <Plus className="w-4 h-4" />
              Lead
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Meta de Comissões */}
        <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Meta Anual de Comissões</h2>
                <p className="text-white/90 text-sm">€{metaAnual.toLocaleString('pt-PT')}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-white text-sm">
                <span>Progresso</span>
                <span className="font-bold">€{comissaoAtual.toLocaleString('pt-PT')}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${percentualMeta}%` }}
                />
              </div>
              <div className="flex justify-between text-white/90 text-xs">
                <span>{percentualMeta.toFixed(1)}% concluído</span>
                <span>Falta: €{faltaParaMeta.toLocaleString('pt-PT')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-white/90 text-xs mb-1">Projeção Anual</p>
                <p className="text-xl font-bold text-white">
                  €{projecaoAnual.toLocaleString('pt-PT')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3 text-white" />
                  <span className="text-white/90 text-xs">+{((projecaoAnual / metaAnual - 1) * 100).toFixed(0)}%</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-white/90 text-xs mb-1">Média Mensal</p>
                <p className="text-xl font-bold text-white">
                  €{(comissaoAtual / new Date().getMonth() || 1).toLocaleString('pt-PT', { maximumFractionDigits: 0 })}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-white" />
                  <span className="text-white/90 text-xs">No ritmo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold">
                +3
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{leads.length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Leads Ativos</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-red-500" />
              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
                Hot
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {leads.filter(l => l.status === 'quente').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Quentes</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-green-500" />
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">
                +2
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Fechados</p>
          </div>
        </div>

        {/* Integração Casafari */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-900 rounded-2xl p-4 border border-blue-200 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Integração Casafari Ativa
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                Leads são alimentados automaticamente via API do Casafari
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Sincronizado há 5 min
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Leads */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Leads Recentes
              </h2>
            </div>
            <button className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Ver todos
            </button>
          </div>

          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 active:scale-98 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {lead.nome}
                      </h3>
                      <span className="text-lg">{getOrigemIcon(lead.origem)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getStatusColor(lead.status)}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(lead.data).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      €{lead.valor.toLocaleString('pt-PT')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Comissão est.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all">
                    Contatar
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-semibold transition-all">
                    Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Performance */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Performance Mensal
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { mes: 'Janeiro', valor: 15000, percentual: 75 },
              { mes: 'Fevereiro', valor: 18000, percentual: 90 },
              { mes: 'Março', valor: 12000, percentual: 60 }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.mes}
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    €{item.valor.toLocaleString('pt-PT')}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentual}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sincronização com IA Central */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-900 rounded-3xl p-5 border border-purple-200 dark:border-gray-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Sincronização com IA Central
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Suas métricas de comissão são compartilhadas com a IA de Coaching para direcionar seu foco e estratégias de vendas.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
