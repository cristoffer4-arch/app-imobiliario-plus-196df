// Serviço de Integração com API Casafari (Versão Demo - Dados Simulados)
import type { Imovel } from '@/lib/types/imoveis';

interface CasafariConfig {
  apiKey?: string;
  baseUrl?: string;
}

/**
 * VARIÁVEL 2: Sistema de Cache Inteligente para Otimização de Consultas
 * Reduz tráfego desnecessário e melhora performance para consultores iniciantes
 */
interface CacheEntry {
  data: any;
  timestamp: number;
  expiresIn: number; // em milissegundos
}

class CacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn: ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.expiresIn;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.expiresIn) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Dados simulados para demonstração (sem necessidade de API externa)
 */
const IMOVEIS_DEMO: Imovel[] = [
  {
    id: 'demo-1',
    titulo: 'Apartamento T3 Moderno no Centro',
    descricao: 'Apartamento renovado com acabamentos de luxo',
    tipo: 'apartamento',
    status: 'ativo',
    preco: 250000,
    area_m2: 120,
    quartos: 3,
    banheiros: 2,
    endereco: 'Rua das Flores, 123',
    cidade: 'Lisboa',
    estado: 'Lisboa',
    latitude: 38.7223,
    longitude: -9.1393,
    fotos: [],
    caracteristicas: {},
    data_cadastro: new Date().toISOString(),
    data_ultima_atualizacao: new Date().toISOString(),
    fonte: 'casafari',
    id_externo: 'demo-1'
  },
  {
    id: 'demo-2',
    titulo: 'Casa V4 com Jardim',
    descricao: 'Casa espaçosa com jardim privado',
    tipo: 'casa',
    status: 'ativo',
    preco: 450000,
    area_m2: 200,
    quartos: 4,
    banheiros: 3,
    endereco: 'Avenida da Liberdade, 456',
    cidade: 'Porto',
    estado: 'Porto',
    latitude: 41.1579,
    longitude: -8.6291,
    fotos: [],
    caracteristicas: {},
    data_cadastro: new Date().toISOString(),
    data_ultima_atualizacao: new Date().toISOString(),
    fonte: 'casafari',
    id_externo: 'demo-2'
  },
  {
    id: 'demo-3',
    titulo: 'Apartamento T2 Renovado',
    descricao: 'Apartamento completamente renovado',
    tipo: 'apartamento',
    status: 'ativo',
    preco: 180000,
    area_m2: 85,
    quartos: 2,
    banheiros: 1,
    endereco: 'Praça da República, 789',
    cidade: 'Braga',
    estado: 'Braga',
    latitude: 41.5454,
    longitude: -8.4265,
    fotos: [],
    caracteristicas: {},
    data_cadastro: new Date().toISOString(),
    data_ultima_atualizacao: new Date().toISOString(),
    fonte: 'casafari',
    id_externo: 'demo-3'
  },
  {
    id: 'demo-4',
    titulo: 'Casa T3 com Piscina',
    descricao: 'Casa moderna com piscina e garagem',
    tipo: 'casa',
    status: 'ativo',
    preco: 380000,
    area_m2: 180,
    quartos: 3,
    banheiros: 2,
    endereco: 'Rua do Sol, 321',
    cidade: 'Coimbra',
    estado: 'Coimbra',
    latitude: 40.2033,
    longitude: -8.4103,
    fotos: [],
    caracteristicas: {},
    data_cadastro: new Date().toISOString(),
    data_ultima_atualizacao: new Date().toISOString(),
    fonte: 'casafari',
    id_externo: 'demo-4'
  },
  {
    id: 'demo-5',
    titulo: 'Apartamento T1 Centro Histórico',
    descricao: 'Apartamento charmoso no centro histórico',
    tipo: 'apartamento',
    status: 'ativo',
    preco: 150000,
    area_m2: 60,
    quartos: 1,
    banheiros: 1,
    endereco: 'Rua Augusta, 100',
    cidade: 'Lisboa',
    estado: 'Lisboa',
    latitude: 38.7139,
    longitude: -9.1394,
    fotos: [],
    caracteristicas: {},
    data_cadastro: new Date().toISOString(),
    data_ultima_atualizacao: new Date().toISOString(),
    fonte: 'casafari',
    id_externo: 'demo-5'
  }
];

export class CasafariService {
  private config: CasafariConfig;
  private cache: CacheManager;
  private requestQueue: Promise<any>[] = [];
  private readonly MAX_CONCURRENT_REQUESTS = 3;

  constructor(config: CasafariConfig = {}) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl || 'https://api.casafari.com/v1'
    };
    this.cache = new CacheManager();
    
    // Limpar cache expirado a cada 10 minutos
    setInterval(() => this.cache.clearExpired(), 10 * 60 * 1000);
  }

  /**
   * VARIÁVEL 2: Controle de requisições para evitar sobrecarga
   * Gerencia fila de requisições para otimizar tráfego
   */
  private async gerenciarRequisicao<T>(fn: () => Promise<T>): Promise<T> {
    // Aguardar se houver muitas requisições simultâneas
    while (this.requestQueue.length >= this.MAX_CONCURRENT_REQUESTS) {
      await Promise.race(this.requestQueue);
    }

    const promise = fn();
    this.requestQueue.push(promise);

    try {
      const result = await promise;
      return result;
    } finally {
      const index = this.requestQueue.indexOf(promise);
      if (index > -1) {
        this.requestQueue.splice(index, 1);
      }
    }
  }

  /**
   * VARIÁVEL 2: Buscar imóveis com cache e otimização para geolocalização
   * Específico para consultores iniciantes com busca assertiva
   * VERSÃO DEMO: Usa dados simulados localmente
   */
  async buscarImoveis(filtros?: {
    cidade?: string;
    tipo?: string;
    precoMin?: number;
    precoMax?: number;
    limite?: number;
    latitude?: number;
    longitude?: number;
    raio?: number; // em km
  }): Promise<Imovel[]> {
    // Gerar chave de cache baseada nos filtros
    const cacheKey = `imoveis_${JSON.stringify(filtros)}`;
    
    // Verificar cache primeiro
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      console.log('✅ Dados retornados do cache (economia de requisição)');
      return cachedData;
    }

    return this.gerenciarRequisicao(async () => {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 300));

      let imoveis = [...IMOVEIS_DEMO];

      // Aplicar filtros
      if (filtros?.cidade) {
        imoveis = imoveis.filter(i => 
          i.cidade?.toLowerCase().includes(filtros.cidade!.toLowerCase())
        );
      }

      if (filtros?.tipo) {
        imoveis = imoveis.filter(i => i.tipo === filtros.tipo);
      }

      if (filtros?.precoMin) {
        imoveis = imoveis.filter(i => (i.preco || 0) >= filtros.precoMin!);
      }

      if (filtros?.precoMax) {
        imoveis = imoveis.filter(i => (i.preco || 0) <= filtros.precoMax!);
      }

      // VARIÁVEL 2: Filtro de geolocalização
      if (filtros?.latitude && filtros?.longitude && filtros?.raio) {
        imoveis = imoveis.filter(i => {
          if (!i.latitude || !i.longitude) return false;
          
          const distancia = this.calcularDistancia(
            filtros.latitude!,
            filtros.longitude!,
            i.latitude,
            i.longitude
          );
          
          return distancia <= filtros.raio!;
        });
      }

      if (filtros?.limite) {
        imoveis = imoveis.slice(0, filtros.limite);
      }

      // Armazenar no cache
      this.cache.set(cacheKey, imoveis);
      console.log('✅ Dados armazenados no cache');
      
      return imoveis;
    });
  }

  /**
   * Calcular distância entre dois pontos (fórmula de Haversine)
   */
  private calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * VARIÁVEL 2: Busca otimizada por proximidade (geolocalização)
   * Ideal para consultores iniciantes encontrarem imóveis próximos
   */
  async buscarImoveisPorProximidade(
    latitude: number,
    longitude: number,
    raioKm: number = 5,
    limite: number = 20
  ): Promise<Imovel[]> {
    return this.buscarImoveis({
      latitude,
      longitude,
      raio: raioKm,
      limite
    });
  }

  /**
   * Buscar imóvel específico por ID
   */
  async buscarImovelPorId(id: string): Promise<Imovel | null> {
    const cacheKey = `imovel_${id}`;
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) return cachedData;

    return this.gerenciarRequisicao(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const imovel = IMOVEIS_DEMO.find(i => i.id === id) || null;
      
      if (imovel) {
        this.cache.set(cacheKey, imovel, 10 * 60 * 1000);
      }
      
      return imovel;
    });
  }

  /**
   * Sincronizar imóveis (buscar atualizações)
   */
  async sincronizarImoveis(ultimaSincronizacao?: Date): Promise<Imovel[]> {
    return this.gerenciarRequisicao(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Limpar cache após sincronização
      this.cache.clear();
      
      return IMOVEIS_DEMO;
    });
  }

  /**
   * Testar conexão (sempre retorna true na versão demo)
   */
  async testarConexao(): Promise<boolean> {
    return true;
  }

  /**
   * Limpar cache manualmente
   */
  limparCache(): void {
    this.cache.clear();
  }
}

/**
 * Criar instância do serviço Casafari
 */
export function criarCasafariService(apiKey?: string): CasafariService {
  return new CasafariService({ apiKey });
}
