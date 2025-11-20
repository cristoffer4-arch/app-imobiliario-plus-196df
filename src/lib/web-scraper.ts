import { supabase, Imovel } from './supabase';

/**
 * Sistema de Web Scraping para Imóveis
 * 
 * IMPORTANTE: Este é um sistema simulado que demonstra a arquitetura.
 * Em produção, você precisará de:
 * 1. API externa de scraping (ScraperAPI, Bright Data, etc)
 * 2. Backend serverless (Vercel Functions, AWS Lambda)
 * 3. Cron jobs para execução automática
 */

interface ImovelExterno {
  titulo: string;
  descricao?: string;
  tipo: string;
  preco: number;
  area_m2?: number;
  quartos?: number;
  banheiros?: number;
  endereco: string;
  cidade: string;
  estado?: string;
  url_origem: string;
  imagens?: string[];
}

// Fontes de dados simuladas (em produção, seriam APIs reais)
const FONTES_IMOVEIS = [
  'https://www.idealista.pt',
  'https://www.imovirtual.com',
  'https://www.casasapo.pt',
];

/**
 * Busca imóveis de fontes externas
 * Em produção, isso seria uma chamada para API de scraping
 */
async function buscarImoveisExternos(fonte: string): Promise<ImovelExterno[]> {
  // SIMULAÇÃO: Em produção, aqui você faria:
  // const response = await fetch(`/api/scraper?fonte=${fonte}`);
  // return await response.json();
  
  console.log(`[Scraper] Buscando imóveis de: ${fonte}`);
  
  // Dados simulados para demonstração
  const imoveisSimulados: ImovelExterno[] = [
    {
      titulo: 'Apartamento T2 no Centro',
      descricao: 'Apartamento moderno com 2 quartos',
      tipo: 'apartamento',
      preco: 250000,
      area_m2: 85,
      quartos: 2,
      banheiros: 2,
      endereco: 'Rua das Flores, 123',
      cidade: 'Lisboa',
      estado: 'Lisboa',
      url_origem: `${fonte}/imovel-123`,
      imagens: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    },
    {
      titulo: 'Moradia T3 com Jardim',
      descricao: 'Casa espaçosa com jardim privado',
      tipo: 'casa',
      preco: 450000,
      area_m2: 180,
      quartos: 3,
      banheiros: 3,
      endereco: 'Avenida Principal, 456',
      cidade: 'Porto',
      estado: 'Porto',
      url_origem: `${fonte}/imovel-456`,
      imagens: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
    },
  ];
  
  return imoveisSimulados;
}

/**
 * Verifica se imóvel já existe no banco (por URL de origem)
 */
async function imovelJaExiste(url_origem: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('imoveis')
    .select('id')
    .eq('url_origem', url_origem)
    .single();
  
  return !!data && !error;
}

/**
 * Verifica se imóvel foi vendido (comparando com dados externos)
 */
async function verificarImoveisVendidos(): Promise<number> {
  // Busca imóveis disponíveis no banco
  const { data: imoveisDisponiveis, error } = await supabase
    .from('imoveis')
    .select('id, url_origem')
    .eq('status', 'disponivel')
    .not('url_origem', 'is', null);
  
  if (error || !imoveisDisponiveis) return 0;
  
  let vendidosCount = 0;
  
  // Para cada imóvel, verifica se ainda existe nas fontes externas
  for (const imovel of imoveisDisponiveis) {
    // SIMULAÇÃO: Em produção, verificaria se URL ainda está ativa
    const aindaDisponivel = Math.random() > 0.1; // 10% chance de ter sido vendido
    
    if (!aindaDisponivel) {
      // Marca como vendido
      await supabase
        .from('imoveis')
        .update({ 
          status: 'vendido',
          data_venda: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', imovel.id);
      
      vendidosCount++;
      
      // Cria notificação
      await supabase.from('notificacoes').insert({
        titulo: 'Imóvel Vendido',
        mensagem: `Um imóvel foi marcado como vendido automaticamente`,
        tipo: 'info',
        prioridade: 'media',
      });
    }
  }
  
  return vendidosCount;
}

/**
 * Sincroniza imóveis de todas as fontes
 */
export async function sincronizarImoveis(): Promise<{
  sucesso: boolean;
  novos: number;
  atualizados: number;
  vendidos: number;
  mensagem: string;
}> {
  try {
    let totalNovos = 0;
    let totalAtualizados = 0;
    
    // Busca imóveis de cada fonte
    for (const fonte of FONTES_IMOVEIS) {
      const imoveisExternos = await buscarImoveisExternos(fonte);
      
      for (const imovelExterno of imoveisExternos) {
        const existe = await imovelJaExiste(imovelExterno.url_origem);
        
        if (!existe) {
          // Insere novo imóvel
          const { error } = await supabase.from('imoveis').insert({
            ...imovelExterno,
            status: 'disponivel',
            fonte: 'web_scraping',
            imagens: imovelExterno.imagens || [],
            caracteristicas: {},
          });
          
          if (!error) {
            totalNovos++;
          }
        } else {
          // Atualiza imóvel existente
          const { error } = await supabase
            .from('imoveis')
            .update({
              preco: imovelExterno.preco,
              descricao: imovelExterno.descricao,
              updated_at: new Date().toISOString(),
            })
            .eq('url_origem', imovelExterno.url_origem);
          
          if (!error) {
            totalAtualizados++;
          }
        }
      }
      
      // Registra histórico de scraping
      await supabase.from('historico_scraping').insert({
        fonte,
        url: fonte,
        imoveis_encontrados: imoveisExternos.length,
        imoveis_novos: totalNovos,
        imoveis_atualizados: totalAtualizados,
        status: 'sucesso',
      });
    }
    
    // Verifica imóveis vendidos
    const vendidos = await verificarImoveisVendidos();
    
    // Cria notificação de sincronização
    if (totalNovos > 0 || vendidos > 0) {
      await supabase.from('notificacoes').insert({
        titulo: 'Sincronização Concluída',
        mensagem: `${totalNovos} novos imóveis adicionados, ${vendidos} marcados como vendidos`,
        tipo: 'sucesso',
        prioridade: 'media',
      });
    }
    
    return {
      sucesso: true,
      novos: totalNovos,
      atualizados: totalAtualizados,
      vendidos,
      mensagem: `Sincronização concluída: ${totalNovos} novos, ${totalAtualizados} atualizados, ${vendidos} vendidos`,
    };
  } catch (error) {
    console.error('[Scraper] Erro na sincronização:', error);
    
    await supabase.from('notificacoes').insert({
      titulo: 'Erro na Sincronização',
      mensagem: 'Ocorreu um erro ao sincronizar imóveis',
      tipo: 'erro',
      prioridade: 'alta',
    });
    
    return {
      sucesso: false,
      novos: 0,
      atualizados: 0,
      vendidos: 0,
      mensagem: 'Erro na sincronização',
    };
  }
}

/**
 * Busca imóveis disponíveis com filtros
 */
export async function buscarImoveisDisponiveis(filtros?: {
  cidade?: string;
  tipo?: string;
  precoMin?: number;
  precoMax?: number;
}) {
  let query = supabase
    .from('imoveis')
    .select('*')
    .eq('status', 'disponivel')
    .order('created_at', { ascending: false });
  
  if (filtros?.cidade) {
    query = query.ilike('cidade', `%${filtros.cidade}%`);
  }
  
  if (filtros?.tipo) {
    query = query.eq('tipo', filtros.tipo);
  }
  
  if (filtros?.precoMin) {
    query = query.gte('preco', filtros.precoMin);
  }
  
  if (filtros?.precoMax) {
    query = query.lte('preco', filtros.precoMax);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('[Scraper] Erro ao buscar imóveis:', error);
    return [];
  }
  
  return data || [];
}
