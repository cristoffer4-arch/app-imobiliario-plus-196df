'use client';

import { useState } from 'react';
import { Search, MapPin, MessageSquare, TrendingUp, Building2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DemoVariaveisIA() {
  const [pergunta, setPergunta] = useState('');
  const [respostaAssistente, setRespostaAssistente] = useState('');
  const [loading, setLoading] = useState(false);

  // Dados de exemplo para demonstração
  const imoveisConsolidados = [
    {
      id: '1',
      titulo: 'Apartamento T3 no Centro',
      tipo: 'apartamento',
      preco: 250000,
      quartos: 3,
      banheiros: 2,
      area_m2: 120,
      cidade: 'Lisboa',
      total_sites: 3,
      duplicatas: [
        { site: 'Idealista', preco: 248000, fonte: 'idealista' },
        { site: 'OLX', preco: 252000, fonte: 'olx' },
      ]
    },
    {
      id: '2',
      titulo: 'Casa V4 com Jardim',
      tipo: 'casa',
      preco: 450000,
      quartos: 4,
      banheiros: 3,
      area_m2: 200,
      cidade: 'Porto',
      total_sites: 2,
      duplicatas: [
        { site: 'Casafari', preco: 445000, fonte: 'casafari' },
      ]
    },
    {
      id: '3',
      titulo: 'Apartamento T2 Renovado',
      tipo: 'apartamento',
      preco: 180000,
      quartos: 2,
      banheiros: 1,
      area_m2: 85,
      cidade: 'Braga',
      total_sites: 1,
      duplicatas: []
    }
  ];

  const metricas = {
    total_consultas: 47,
    cache_hits: 32,
    economia_requisicoes: '68%',
    tempo_medio_resposta: '1.2s'
  };

  const handlePergunta = async () => {
    if (!pergunta.trim()) return;
    
    setLoading(true);
    
    // Simulação de resposta da IA Assistente
    setTimeout(() => {
      const respostas = [
        'Com base nos dados disponíveis, encontrei 3 imóveis que correspondem aos seus critérios. O apartamento T3 no Centro está disponível em 3 sites diferentes, com preços variando entre €248.000 e €252.000.',
        'A busca foi otimizada usando cache inteligente, economizando 68% das requisições à API. Os imóveis foram consolidados para evitar duplicatas.',
        'Recomendo focar no apartamento T3 no Centro, pois está listado em múltiplos sites, o que indica alta demanda. A variação de preço é mínima (1,6%), sugerindo um valor de mercado estável.'
      ];
      
      const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
      setRespostaAssistente(respostaAleatoria);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema Inteligente de Gestão Imobiliária
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Demonstração das 3 variáveis de IA: Deduplicação, Otimização de Consultas e Comunicação entre IAs
          </p>
        </div>

        {/* Métricas de Performance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Search className="w-4 h-4" />
                Total Consultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metricas.total_consultas}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Cache Hits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metricas.cache_hits}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Economia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metricas.economia_requisicoes}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Tempo Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metricas.tempo_medio_resposta}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* VARIÁVEL 1: Imóveis Consolidados (Sem Duplicatas) */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Variável 1: Imóveis Consolidados
              </CardTitle>
              <CardDescription className="text-blue-50">
                Sistema elimina duplicatas e mostra em quantos sites cada imóvel está
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {imoveisConsolidados.map((imovel) => (
                  <div key={imovel.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{imovel.titulo}</h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {imovel.total_sites} {imovel.total_sites === 1 ? 'site' : 'sites'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {imovel.cidade}
                      </span>
                      <span>T{imovel.quartos}</span>
                      <span>{imovel.area_m2}m²</span>
                      <span className="font-semibold text-green-600">
                        €{imovel.preco.toLocaleString()}
                      </span>
                    </div>

                    {imovel.duplicatas && imovel.duplicatas.length > 0 && (
                      <div className="bg-gray-50 rounded p-3 mt-3">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Também disponível em:
                        </p>
                        <div className="space-y-1">
                          {imovel.duplicatas.map((dup, idx) => (
                            <div key={idx} className="flex justify-between text-xs text-gray-600">
                              <span className="font-medium">{dup.site}</span>
                              <span className="text-green-600">€{dup.preco?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* VARIÁVEL 3: Comunicação entre IAs */}
          <div className="space-y-6">
            {/* IA Assistente */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Variável 3: IA Assistente Integrada
                </CardTitle>
                <CardDescription className="text-green-50">
                  Comunicação entre IA de Coaching, Assistente e Dados
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Faça uma pergunta ao assistente:
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ex: Quais os melhores imóveis em Lisboa?"
                        value={pergunta}
                        onChange={(e) => setPergunta(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handlePergunta()}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handlePergunta}
                        disabled={loading}
                        className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                      >
                        {loading ? 'Processando...' : 'Perguntar'}
                      </Button>
                    </div>
                  </div>

                  {respostaAssistente && (
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
                      <p className="text-sm font-medium text-green-800 mb-2">
                        Resposta da IA Assistente:
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {respostaAssistente}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-medium text-blue-800 mb-2">
                      💡 Como funciona a comunicação entre IAs:
                    </p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>• <strong>IA Assistente</strong> processa sua pergunta</li>
                      <li>• <strong>IA de Dados</strong> busca informações relevantes (com cache)</li>
                      <li>• <strong>IA de Coaching</strong> analisa e sugere melhorias</li>
                      <li>• Todas compartilham contexto em tempo real</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VARIÁVEL 2: Otimização de Consultas */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Variável 2: Otimização de Consultas
                </CardTitle>
                <CardDescription className="text-purple-50">
                  Cache inteligente e geolocalização para consultores iniciantes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-xs font-medium text-purple-800 mb-1">Cache Ativo</p>
                      <p className="text-2xl font-bold text-purple-600">5 min</p>
                      <p className="text-xs text-gray-600 mt-1">Tempo de vida</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-xs font-medium text-purple-800 mb-1">Requisições</p>
                      <p className="text-2xl font-bold text-purple-600">3 máx</p>
                      <p className="text-xs text-gray-600 mt-1">Simultâneas</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-xs font-medium text-orange-800 mb-2">
                      🎯 Busca por Geolocalização
                    </p>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      Sistema otimizado para consultores iniciantes encontrarem imóveis próximos 
                      usando latitude, longitude e raio de busca. Cache inteligente reduz 
                      tráfego em <strong>68%</strong>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Benefícios:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Respostas 3x mais rápidas</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Economia de custos de API</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Busca assertiva por proximidade</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resumo das Variáveis */}
        <Card className="mt-8 shadow-lg border-2 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle>📋 Resumo das 3 Variáveis Implementadas</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Deduplicação</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Imóveis duplicados são consolidados automaticamente. Mostra em quantos sites 
                  está disponível e os diferentes preços em cada plataforma.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Otimização</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Cache inteligente e controle de requisições. Busca por geolocalização 
                  otimizada para consultores iniciantes com experiência assertiva.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Comunicação IA</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Hub central conecta IA de Coaching, Assistente e Dados. Compartilham 
                  contexto em tempo real para respostas rápidas e confiáveis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
