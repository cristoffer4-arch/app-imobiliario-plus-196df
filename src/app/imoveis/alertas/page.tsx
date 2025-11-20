'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, CheckCircle, XCircle, ChevronLeft, Building2,
  ExternalLink, TrendingUp, MapPin, DollarSign, Maximize, Eye,
  ThumbsUp, ThumbsDown, Clock, Sparkles
} from 'lucide-react';

// Dados mockados para demonstração
const ALERTAS_MOCK = [
  {
    id: 'a1',
    imovel_interno: {
      id: '1',
      titulo: 'Apartamento T3 no Centro',
      preco: 250000,
      area_m2: 120,
      endereco: 'Rua das Flores, 123, Lisboa',
      foto: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
    },
    imovel_externo: {
      titulo: 'T3 Centro Lisboa - Renovado',
      preco: 248000,
      area_m2: 118,
      endereco: 'R. das Flores, 123, Lisboa',
      fonte: 'idealista',
      url: 'https://idealista.pt/imovel/12345'
    },
    grau_confianca: 92,
    status: 'pendente',
    motivos: [
      'Título similar (95%)',
      'Endereço similar (98%)',
      'Preço similar (99%)',
      'Características similares (90%)'
    ],
    data_deteccao: '2024-01-29T10:30:00'
  },
  {
    id: 'a2',
    imovel_interno: {
      id: '2',
      titulo: 'Moradia V4 com Jardim',
      preco: 450000,
      area_m2: 250,
      endereco: 'Av. Principal, 456, Porto',
      foto: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop'
    },
    imovel_externo: {
      titulo: 'Moradia 4 Quartos Porto com Jardim',
      preco: 455000,
      area_m2: 245,
      endereco: 'Avenida Principal, 456, Porto',
      fonte: 'olx',
      url: 'https://olx.pt/anuncio/67890'
    },
    grau_confianca: 85,
    status: 'pendente',
    motivos: [
      'Título similar (88%)',
      'Endereço similar (92%)',
      'Preço similar (98%)',
      'Características similares (80%)'
    ],
    data_deteccao: '2024-01-29T14:15:00'
  },
  {
    id: 'a3',
    imovel_interno: {
      id: '3',
      titulo: 'Apartamento T2 Renovado',
      preco: 180000,
      area_m2: 85,
      endereco: 'Rua Nova, 789, Lisboa',
      foto: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'
    },
    imovel_externo: {
      titulo: 'T2 Remodelado Lisboa',
      preco: 175000,
      area_m2: 82,
      endereco: 'Rua Nova, 789, Lisboa',
      fonte: 'casafari',
      url: 'https://casafari.com/property/abc123'
    },
    grau_confianca: 78,
    status: 'pendente',
    motivos: [
      'Título similar (75%)',
      'Endereço similar (100%)',
      'Preço similar (97%)',
      'Características similares (85%)'
    ],
    data_deteccao: '2024-01-29T16:45:00'
  }
];

export default function AlertasPage() {
  const [alertas, setAlertas] = useState(ALERTAS_MOCK);
  const [filtroStatus, setFiltroStatus] = useState<string>('pendente');

  const alertasFiltrados = alertas.filter(alerta => 
    filtroStatus === 'todos' || alerta.status === filtroStatus
  );

  const stats = {
    pendentes: alertas.filter(a => a.status === 'pendente').length,
    confirmados: alertas.filter(a => a.status === 'confirmado').length,
    rejeitados: alertas.filter(a => a.status === 'rejeitado').length
  };

  const confirmarAlerta = (alertaId: string) => {
    setAlertas(alertas.map(a => 
      a.id === alertaId 
        ? { ...a, status: 'confirmado' as const }
        : a
    ));
  };

  const rejeitarAlerta = (alertaId: string) => {
    setAlertas(alertas.map(a => 
      a.id === alertaId 
        ? { ...a, status: 'rejeitado' as const }
        : a
    ));
  };

  const getConfiancaColor = (grau: number) => {
    if (grau >= 90) return 'text-green-600 dark:text-green-400';
    if (grau >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getFonteColor = (fonte: string) => {
    switch (fonte) {
      case 'casafari': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'olx': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'idealista': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* iOS Status Bar Spacer */}
      <div className="h-11 bg-white dark:bg-gray-900"></div>

      {/* Header iOS Style */}
      <header className="bg-white dark:bg-gray-900 sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/imoveis">
                <button className="w-9 h-9 flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-800 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Alertas
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Cruzamento via IA
                  </p>
                </div>
              </div>
            </div>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white text-sm font-medium"
            >
              <option value="pendente">Pendentes</option>
              <option value="confirmado">Confirmados</option>
              <option value="rejeitado">Rejeitados</option>
              <option value="todos">Todos</option>
            </select>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Stats Cards iOS Style */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-3 shadow-sm border border-gray-200 dark:border-gray-800">
            <Clock className="w-6 h-6 text-orange-500 mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Pendentes</p>
            <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
              {stats.pendentes}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-3 shadow-sm border border-gray-200 dark:border-gray-800">
            <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Confirmados</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              {stats.confirmados}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-3 shadow-sm border border-gray-200 dark:border-gray-800">
            <XCircle className="w-6 h-6 text-red-500 mb-2" />
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Rejeitados</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {stats.rejeitados}
            </p>
          </div>
        </div>

        {/* Lista de Alertas iOS Style */}
        <div className="space-y-4">
          {alertasFiltrados.map((alerta) => (
            <div key={alerta.id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Header do Alerta */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 px-4 py-3 border-b border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                        Correspondência Detectada
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(alerta.data_deteccao).toLocaleString('pt-PT', { 
                          day: '2-digit', 
                          month: 'short', 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Confiança</p>
                    <p className={`text-xl font-bold ${getConfiancaColor(alerta.grau_confianca)}`}>
                      {alerta.grau_confianca}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Comparação */}
              <div className="p-4 space-y-4">
                {/* Imóvel Interno */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Seu Imóvel</h4>
                  </div>

                  <div className="relative h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden">
                    <img 
                      src={alerta.imovel_interno.foto} 
                      alt={alerta.imovel_interno.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h5 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {alerta.imovel_interno.titulo}
                  </h5>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="font-semibold">€{(alerta.imovel_interno.preco / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Maximize className="w-3.5 h-3.5" />
                      <span>{alerta.imovel_interno.area_m2}m²</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">Lisboa</span>
                    </div>
                  </div>
                </div>

                {/* Divisor */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
                </div>

                {/* Imóvel Externo */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Anúncio Externo</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getFonteColor(alerta.imovel_externo.fonte)}`}>
                      {alerta.imovel_externo.fonte}
                    </span>
                  </div>

                  <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
                    <ExternalLink className="w-12 h-12 text-blue-400 dark:text-blue-600" />
                  </div>

                  <h5 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {alerta.imovel_externo.titulo}
                  </h5>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="font-semibold">€{(alerta.imovel_externo.preco / 1000).toFixed(0)}k</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Maximize className="w-3.5 h-3.5" />
                      <span>{alerta.imovel_externo.area_m2}m²</span>
                    </div>
                    <a 
                      href={alerta.imovel_externo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold"
                    >
                      Ver
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Motivos da Correspondência */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    Análise da IA
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {alerta.motivos.map((motivo, idx) => (
                      <div key={idx} className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-2 border border-purple-200 dark:border-purple-800">
                        <p className="text-xs text-purple-900 dark:text-purple-300 font-medium">
                          {motivo}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ações */}
              {alerta.status === 'pendente' && (
                <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center">
                    Esta correspondência está correta?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => rejeitarAlerta(alerta.id)}
                      className="px-4 py-2.5 bg-red-500 active:bg-red-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold text-sm shadow-lg"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      Rejeitar
                    </button>
                    <button
                      onClick={() => confirmarAlerta(alerta.id)}
                      className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 active:from-green-600 active:to-emerald-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-sm shadow-lg"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Confirmar
                    </button>
                  </div>
                </div>
              )}

              {alerta.status === 'confirmado' && (
                <div className="bg-green-50 dark:bg-green-900/20 px-4 py-3 border-t border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-semibold text-sm">Confirmado - Marcado como vendido</span>
                  </div>
                </div>
              )}

              {alerta.status === 'rejeitado' && (
                <div className="bg-red-50 dark:bg-red-900/20 px-4 py-3 border-t border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-center gap-2 text-red-700 dark:text-red-400">
                    <XCircle className="w-4 h-4" />
                    <span className="font-semibold text-sm">Rejeitado - Descartado</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {alertasFiltrados.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum alerta encontrado
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Não há alertas {filtroStatus !== 'todos' ? `${filtroStatus}s` : ''} no momento
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
