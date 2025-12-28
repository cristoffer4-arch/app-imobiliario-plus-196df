/**
 * Sistema Central de IAs - Imobiliário GO
 * Usa exclusivamente Google Gemini AI
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// Tipos e interfaces
export interface IAResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface PropertyData {
  id: string;
  titulo: string;
  preco: number;
  localizacao: string;
  quartos?: number;
  banheiros?: number;
  garagem?: number;
  area_m2?: number;
  fonte: string;
  data_publicacao: string;
  disponivel: boolean;
}

export interface CoachingSession {
  objetivo: string;
  meta_anual: number;
  meta_atual: number;
  nivel_experiencia: string;
}

export interface GameChallenge {
  id: string;
  titulo: string;
  descricao: string;
  pontos: number;
  tipo: 'individual' | 'equipe';
}

/**
 * IA PRINCIPAL - Usa Google Gemini
 */
export class IAPrincipal {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }

  async processar(solicitacao: string, contexto?: any): Promise<IAResponse> {
    try {
      console.log('🤖 IA Principal: Processando com Gemini...');

      if (!this.genAI || !this.model) {
        return {
          success: false,
          error: 'Gemini não configurado. Adicione GEMINI_API_KEY nas variáveis de ambiente.',
          timestamp: new Date().toISOString()
        };
      }

      const prompt = `Você é a IA Principal de um sistema imobiliário avançado em Portugal.

Contexto: ${JSON.stringify(contexto || {})}

Solicitação: ${solicitacao}

Forneça uma resposta completa e contextualizada.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const resposta = response.text();

      return {
        success: true,
        data: {
          resposta_ia: resposta,
          modelo_usado: 'gemini-pro'
        },
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('❌ Erro na IA Principal:', error);
      return {
        success: false,
        error: error.message || 'Erro ao processar solicitação',
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Classes simplificadas das outras IAs
export class IABuscaImoveis {
  async buscarImoveis(filtros: any): Promise<IAResponse> {
    return {
      success: true,
      data: { imoveis: [], total: 0 },
      timestamp: new Date().toISOString()
    };
  }
}

export class IABancoDados {
  async verificarImovelVendido(imovelId: string): Promise<boolean> {
    return false;
  }
}

export class IACoaching {
  async criarPlanoDesenvolvimento(dados: CoachingSession): Promise<IAResponse> {
    return {
      success: true,
      data: { plano: 'Plano personalizado' },
      timestamp: new Date().toISOString()
    };
  }
}

export class IAAssistente {
  async responderDuvida(pergunta: string): Promise<IAResponse> {
    return {
      success: true,
      data: { resposta: 'Resposta baseada na legislação' },
      timestamp: new Date().toISOString()
    };
  }
}

export class IAGamificacao {
  async gerarRanking(tipo: string): Promise<IAResponse> {
    return {
      success: true,
      data: { ranking: [] },
      timestamp: new Date().toISOString()
    };
  }
}

export class IAComunicacao {
  private ias: Map<string, any> = new Map();
  
  registrarIA(nome: string, instancia: any) {
    this.ias.set(nome, instancia);
  }
}

export class IAAnuncioIdealista {
  async gerarTextoAnuncio(dados: PropertyData): Promise<IAResponse> {
    return {
      success: true,
      data: { texto: 'Anúncio otimizado' },
      timestamp: new Date().toISOString()
    };
  }
}

export class IALeadsComissoes {
  async calcularComissoes(usuarioId: string): Promise<IAResponse> {
    return {
      success: true,
      data: { comissoes: 0 },
      timestamp: new Date().toISOString()
    };
  }
}

// Instâncias globais
export const iaPrincipal = new IAPrincipal();
export const iaAnuncioIdealista = new IAAnuncioIdealista();
export const iaLeadsComissoes = new IALeadsComissoes();
