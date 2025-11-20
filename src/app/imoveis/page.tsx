'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, Plus, Search, Filter, AlertCircle, CheckCircle, 
  XCircle, Clock, Home, MapPin, DollarSign, Maximize, Bed, 
  Bath, Car, ExternalLink, Eye, Edit, Trash2, RefreshCw,
  TrendingUp, AlertTriangle, ChevronLeft
} from 'lucide-react';

// Dados mockados para demonstração
const IMOVEIS_MOCK = [
  {
    id: '1',
    titulo: 'Apartamento T3 no Centro',
    tipo: 'apartamento',
    status: 'ativo',
    preco: 250000,
    area_m2: 120,
    quartos: 3,
    banheiros: 2,
    vagas_garagem: 1,
    endereco: 'Rua das Flores, 123',
    cidade: 'Lisboa',
    fonte: 'interno',
    data_cadastro: '2024-01-15',
    fotos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop']
  },
  {
    id: '2',
    titulo: 'Moradia V4 com Jardim',
    tipo: 'casa',
    status: 'ativo',
    preco: 450000,
    area_m2: 250,
    quartos: 4,
    banheiros: 3,
    vagas_garagem: 2,
    endereco: 'Av. Principal, 456',
    cidade: 'Porto',
    fonte: 'casafari',
    data_cadastro: '2024-01-20',
    fotos: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop']
  },
  {
    id: '3',
    titulo: 'Apartamento T2 Renovado',
    tipo: 'apartamento',
    status: 'em_analise',
    preco: 180000,
    area_m2: 85,
    quartos: 2,
    banheiros: 1,
    vagas_garagem: 1,
    endereco: 'Rua Nova, 789',
    cidade: 'Lisboa',
    fonte: 'interno',
    data_cadastro: '2024-01-25',
    fotos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop']
  },
  {
    id: '4',
    titulo: 'Loja Comercial Centro',
    tipo: 'comercial',
    status: 'vendido',
    preco: 320000,
    area_m2: 150,
    endereco: 'Praça do Comércio, 12',
    cidade: 'Lisboa',
    fonte: 'interno',
    data_cadastro: '2024-01-10',
    data_venda: '2024-01-28',
    fotos: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop']
  }
];

const ALERTAS_MOCK = [
  {
    id: 'a1',
    imovel_interno_id: '1',
    grau_confianca: 92,
    status: 'pendente',
    imovel_externo: {
      titulo: 'T3 Centro Lisboa',
      fonte: 'idealista',
      preco: 248000
    }
  },
  {
    id: 'a2',
    imovel_interno_id: '2',
    grau_confianca: 85,
    status: 'pendente',
    imovel_externo: {
      titulo: 'Moradia 4 Quartos Porto',
      fonte: 'olx',
      preco: 455000
    }
  }
];

export default function ImoveisPage() {
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroFonte, setFiltroFonte] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const imoveis = IMOVEIS_MOCK.filter(imovel => {
    const matchStatus = filtroStatus === 'todos' || imovel.status === filtroStatus;
    const matchFonte = filtroFonte === 'todos' || imovel.fonte === filtroFonte;
    const matchBusca = busca === '' || 
      imovel.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      imovel.cidade.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchFonte && matchBusca;
  });

  const stats = {
    total: IMOVEIS_MOCK.length,
    ativos: IMOVEIS_MOCK.filter(i => i.status === 'ativo').length,
    vendidos: IMOVEIS_MOCK.filter(i => i.status === 'vendido').length,
    alertas: ALERTAS_MOCK.filter(a => a.status === 'pendente').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'vendido': return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'suspenso': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'em_analise': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFonteColor = (fonte: string) => {
    switch (fonte) {
      case 'interno': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
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
              <Link href="/">
                <button className="w-9 h-9 flex items-center justify-center active:bg-gray-100 dark:active:bg-gray-800 rounded-full transition-colors">
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Imóveis
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sistema com IA
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/imoveis/alertas">
                <button className="relative px-3 py-2 bg-orange-500 active:bg-orange-600 text-white rounded-xl transition-colors flex items-center gap-1.5 shadow-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Alertas</span>
                  {stats.alertas > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {stats.alertas}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>

          {/* Search Bar iOS Style */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar imóveis..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500"
            />
            <button 
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg active:scale-95 transition-transform"
            >
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          {/* Filtros Expansíveis */}
          {mostrarFiltros && (
            <div className="mt-3 space-y-2 animate-in slide-in-from-top">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white text-sm"
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="vendido">Vendido</option>
                <option value="suspenso">Suspenso</option>
                <option value="em_analise">Em Análise</option>
              </select>

              <select
                value={filtroFonte}
                onChange={(e) => setFiltroFonte(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-gray-900 dark:text-white text-sm"
              >
                <option value="todos">Todas as Fontes</option>
                <option value="interno">Interno</option>
                <option value="casafari">Casafari</option>
                <option value="olx">OLX</option>
                <option value="idealista">Idealista</option>
              </select>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 py-4 space-y-4">
        {/* Stats Cards iOS Style */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.total}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Ativos</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  {stats.ativos}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Vendidos</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                  {stats.vendidos}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-gray-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Alertas</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                  {stats.alertas}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Lista de Imóveis iOS Style */}
        <div className="space-y-3">
          {imoveis.map((imovel) => (
            <div key={imovel.id} className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden active:scale-98 transition-transform">
              {/* Imagem */}
              <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
                {imovel.fotos[0] && (
                  <img 
                    src={imovel.fotos[0]} 
                    alt={imovel.titulo}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(imovel.status)}`}>
                    {imovel.status}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getFonteColor(imovel.fonte)}`}>
                    {imovel.fonte}
                  </span>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                  {imovel.titulo}
                </h3>

                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-xs">{imovel.endereco}, {imovel.cidade}</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    €{imovel.preco?.toLocaleString('pt-PT')}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-3 text-xs">
                  {imovel.area_m2 && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Maximize className="w-3.5 h-3.5" />
                      <span>{imovel.area_m2}m²</span>
                    </div>
                  )}
                  {imovel.quartos && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Bed className="w-3.5 h-3.5" />
                      <span>{imovel.quartos}</span>
                    </div>
                  )}
                  {imovel.banheiros && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Bath className="w-3.5 h-3.5" />
                      <span>{imovel.banheiros}</span>
                    </div>
                  )}
                  {imovel.vagas_garagem && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Car className="w-3.5 h-3.5" />
                      <span>{imovel.vagas_garagem}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2.5 bg-purple-500 active:bg-purple-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-semibold shadow-lg">
                    <Eye className="w-4 h-4" />
                    Ver Detalhes
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 active:bg-gray-100 dark:active:bg-gray-800 rounded-xl transition-colors">
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {imoveis.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tente ajustar os filtros
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Button iOS Style */}
      <Link href="/imoveis/novo">
        <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-50">
          <Plus className="w-7 h-7 text-white" />
        </button>
      </Link>
    </div>
  );
}
