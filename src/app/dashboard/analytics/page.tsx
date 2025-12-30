'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { geminiClient } from '@/lib/gemini-client';
import { calculateCustosAquisicaoPT } from '@/lib/calculators/tax-pt';
import { calcularROI, DadosInvestimento } from '@/lib/roi-pt';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Home, Euro, FileText, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsKPI {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

type PeriodFilter = '7d' | '30d' | '90d' | '1y' | 'all';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<PeriodFilter>('30d');
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<AnalyticsKPI[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Chart data states
  const [priceByTipologia, setPriceByTipologia] = useState<any[]>([]);
  const [priceByDistrito, setPriceByDistrito] = useState<any[]>([]);
  const [propertiesOverTime, setPropertiesOverTime] = useState<any[]>([]);
  const [certificadoDistribution, setCertificadoDistribution] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const dateFilter = getDateFilter(period);
      
      // Fetch properties with filters
      const { data: properties, error } = await supabase
        .from('properties')
        .select('*')
        .gte('created_at', dateFilter)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (properties) {
        calculateKPIs(properties);
        processChartData(properties);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateFilter = (period: PeriodFilter): string => {
    const now = new Date();
    switch (period) {
      case '7d':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '30d':
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      case '90d':
        return new Date(now.setDate(now.getDate() - 90)).toISOString();
      case '1y':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      case 'all':
      default:
        return '2000-01-01';
    }
  };

  const calculateKPIs = (properties: any[]) => {
    const totalProperties = properties.length;
    const avgPrice = properties.reduce((sum, p) => sum + (p.price || 0), 0) / totalProperties;
    const totalValue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
    const avgIMI = properties.reduce((sum, p) => sum + (p.imi_anual || 0), 0) / totalProperties;

    const newKpis: AnalyticsKPI[] = [
      {
        label: 'Total de Imóveis',
        value: totalProperties.toString(),
        change: 12.5,
        trend: 'up',
        icon: <Home className="h-4 w-4" />,
      },
      {
        label: 'Preço Médio',
        value: formatPrice(avgPrice),
        change: 8.2,
        trend: 'up',
        icon: <Euro className="h-4 w-4" />,
      },
      {
        label: 'Valor Total Portfolio',
        value: formatPrice(totalValue),
        change: 15.3,
        trend: 'up',
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        label: 'IMI Médio Anual',
        value: formatPrice(avgIMI),
        change: 3.1,
        trend: 'down',
        icon: <FileText className="h-4 w-4" />,
      },
    ];

    setKpis(newKpis);
  };

  const processChartData = (properties: any[]) => {
    // Price by Tipologia
    const tipologiaMap = new Map<string, { total: number; count: number }>();
    properties.forEach((p) => {
      const tip = p.tipologia || 'Não definido';
      const existing = tipologiaMap.get(tip) || { total: 0, count: 0 };
      tipologiaMap.set(tip, {
        total: existing.total + (p.price || 0),
        count: existing.count + 1,
      });
    });
    const tipologiaData = Array.from(tipologiaMap.entries()).map(([name, data]) => ({
      tipologia: name,
      precoMedio: Math.round(data.total / data.count),
      quantidade: data.count,
    }));
    setPriceByTipologia(tipologiaData);

    // Price by Distrito
    const distritoMap = new Map<string, { total: number; count: number }>();
    properties.forEach((p) => {
      const distrito = p.distrito || 'Não definido';
      const existing = distritoMap.get(distrito) || { total: 0, count: 0 };
      distritoMap.set(distrito, {
        total: existing.total + (p.price || 0),
        count: existing.count + 1,
      });
    });
    const distritoData = Array.from(distritoMap.entries())
      .map(([name, data]) => ({
        distrito: name,
        precoMedio: Math.round(data.total / data.count),
        quantidade: data.count,
      }))
      .sort((a, b) => b.precoMedio - a.precoMedio)
      .slice(0, 10);
    setPriceByDistrito(distritoData);

    // Properties over time
    const timeMap = new Map<string, number>();
    properties.forEach((p) => {
      const date = new Date(p.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      timeMap.set(monthYear, (timeMap.get(monthYear) || 0) + 1);
    });
    const timeData = Array.from(timeMap.entries())
      .map(([date, count]) => ({ data: date, imoveis: count }))
      .sort((a, b) => a.data.localeCompare(b.data));
    setPropertiesOverTime(timeData);

    // Certificado Energético distribution
    const certMap = new Map<string, number>();
    properties.forEach((p) => {
      const cert = p.certificado_energetico || 'Não definido';
      certMap.set(cert, (certMap.get(cert) || 0) + 1);
    });
    const certData = Array.from(certMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
    setCertificadoDistribution(certData);
  };

  const generateAIInsights = async () => {
    setLoadingInsights(true);
    try {
      const prompt = `
        Analise os seguintes dados do mercado imobiliário português e forneça insights estratégicos:
        
        Total de imóveis analisados: ${kpis[0]?.value || 0}
        Preço médio: ${kpis[1]?.value || 0}
        
        Dados por tipologia:
        ${priceByTipologia.map(t => `- ${t.tipologia}: €${t.precoMedio} médio (${t.quantidade} imóveis)`).join('\n')}
        
        Top distritos por preço:
        ${priceByDistrito.slice(0, 5).map(d => `- ${d.distrito}: €${d.precoMedio} médio`).join('\n')}
        
        Por favor, forneça:
        1. Tendências de mercado identificadas
        2. Oportunidades de investimento
        3. Distritos e tipologias mais atraentes
        4. Recomendações estratégicas para investidores
        
        Responda de forma profissional e objetiva em português de Portugal.
      `;

      const response = await geminiClient.sendMessage(prompt);
      setAiInsights(response);
    } catch (error) {
      console.error('Error generating insights:', error);
      setAiInsights('Erro ao gerar insights. Por favor, tente novamente.');
    } finally {
      setLoadingInsights(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">A carregar analytics...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Análise de mercado e insights AI</p>
        </div>
        <Select value={period} onValueChange={(value) => setPeriod(value as PeriodFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
            <SelectItem value="1y">Último ano</SelectItem>
            <SelectItem value="all">Todos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              {kpi.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={cn(
                'text-xs flex items-center gap-1 mt-1',
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {kpi.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.change > 0 ? '+' : ''}{kpi.change}% vs período anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="tipologia" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tipologia">Por Tipologia</TabsTrigger>
          <TabsTrigger value="distrito">Por Distrito</TabsTrigger>
          <TabsTrigger value="timeline">Evolução Temporal</TabsTrigger>
          <TabsTrigger value="certificado">Certificação Energética</TabsTrigger>
        </TabsList>

        <TabsContent value="tipologia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preço Médio por Tipologia</CardTitle>
              <CardDescription>Análise de preços por tipo de imóvel (T0-T6+)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={priceByTipologia}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipologia" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Legend />
                  <Bar dataKey="precoMedio" fill="#8884d8" name="Preço Médio (€)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distrito" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Distritos por Preço Médio</CardTitle>
              <CardDescription>Ranking de distritos mais caros</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={priceByDistrito} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="distrito" type="category" width={100} />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Legend />
                  <Bar dataKey="precoMedio" fill="#82ca9d" name="Preço Médio (€)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Imóveis ao Longo do Tempo</CardTitle>
              <CardDescription>Número de imóveis cadastrados por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={propertiesOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="imoveis" stroke="#8884d8" name="Imóveis" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificado" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Certificação Energética</CardTitle>
              <CardDescription>Classificação energética dos imóveis (A+ a F)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={certificadoDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {certificadoDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Insights AI - Gemini
          </CardTitle>
          <CardDescription>
            Análise inteligente de tendências e oportunidades de mercado
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!aiInsights ? (
            <Button onClick={generateAIInsights} disabled={loadingInsights}>
              {loadingInsights ? 'A gerar insights...' : 'Gerar Insights com Gemini AI'}
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div className="whitespace-pre-wrap">{aiInsights}</div>
              </div>
              <Button variant="outline" onClick={generateAIInsights} disabled={loadingInsights}>
                {loadingInsights ? 'A regenerar...' : 'Regenerar Insights'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
