// VARIÁVEL 3: Hub de Comunicação entre IAs (Versão Demo - Sem APIs Externas)
// Sistema centralizado para comunicação entre IA de Coaching, IA Assistente e IA de Dados

import type { Imovel } from '@/lib/types/imoveis';
import { CasafariService } from './casafari-api';

/**
 * Tipos de IA no sistema
 */
export type TipoIA = 'coaching' | 'assistente' | 'dados';

/**
 * Mensagem entre IAs
 */
interface MensagemIA {
  de: TipoIA;
  para: TipoIA;
  tipo: 'consulta' | 'resposta' | 'notificacao';
  conteudo: any;
  timestamp: string;
  contexto?: any;
}

/**
 * Contexto compartilhado entre IAs
 */
interface ContextoCompartilhado {
  consultor_id?: string;
  imoveis_recentes?: Imovel[];
  preferencias_busca?: any;
  historico_interacoes?: any[];
  metricas_performance?: any;
}

/**
 * VARIÁVEL 3: Hub Central de Comunicação entre IAs
 * VERSÃO DEMO: Funciona sem APIs externas, usando lógica local
 */
export class IAHub {
  private contextoGlobal: ContextoCompartilhado = {};
  private historicoMensagens: MensagemIA[] = [];
  private casafariService: CasafariService;

  constructor(casafariApiKey?: string) {
    this.casafariService = new CasafariService({ apiKey: casafariApiKey });
  }

  /**
   * Enviar mensagem entre IAs
   */
  private async enviarMensagem(mensagem: MensagemIA): Promise<void> {
    this.historicoMensagens.push(mensagem);
    
    // Manter apenas últimas 50 mensagens
    if (this.historicoMensagens.length > 50) {
      this.historicoMensagens = this.historicoMensagens.slice(-50);
    }
  }

  /**
   * Atualizar contexto compartilhado
   */
  atualizarContexto(novoContexto: Partial<ContextoCompartilhado>): void {
    this.contextoGlobal = {
      ...this.contextoGlobal,
      ...novoContexto
    };
  }

  /**
   * IA DE DADOS: Buscar informações de imóveis
   */
  async iaDados_buscarImoveis(filtros: any): Promise<Imovel[]> {
    const mensagem: MensagemIA = {
      de: 'dados',
      para: 'assistente',
      tipo: 'notificacao',
      conteudo: { acao: 'busca_iniciada', filtros },
      timestamp: new Date().toISOString()
    };
    await this.enviarMensagem(mensagem);

    const imoveis = await this.casafariService.buscarImoveis(filtros);
    
    // Atualizar contexto global
    this.atualizarContexto({ imoveis_recentes: imoveis });

    const resposta: MensagemIA = {
      de: 'dados',
      para: 'assistente',
      tipo: 'resposta',
      conteudo: { imoveis, total: imoveis.length },
      timestamp: new Date().toISOString()
    };
    await this.enviarMensagem(resposta);

    return imoveis;
  }

  /**
   * IA ASSISTENTE: Processar pergunta do consultor
   * VERSÃO DEMO: Usa lógica local em vez de OpenAI
   */
  async iaAssistente_responderConsulta(pergunta: string): Promise<string> {
    const mensagem: MensagemIA = {
      de: 'assistente',
      para: 'dados',
      tipo: 'consulta',
      conteudo: { pergunta },
      timestamp: new Date().toISOString(),
      contexto: this.contextoGlobal
    };
    await this.enviarMensagem(mensagem);

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 500));

    // Gerar resposta baseada em palavras-chave (versão demo)
    let resposta = '';
    const perguntaLower = pergunta.toLowerCase();
    const totalImoveis = this.contextoGlobal.imoveis_recentes?.length || 0;

    if (perguntaLower.includes('imóvel') || perguntaLower.includes('imoveis')) {
      resposta = `Com base nos dados disponíveis, encontrei ${totalImoveis} imóveis que podem corresponder aos seus critérios. `;
      
      if (totalImoveis > 0) {
        const imovel = this.contextoGlobal.imoveis_recentes![0];
        resposta += `O primeiro é um ${imovel.tipo} em ${imovel.cidade} por €${imovel.preco?.toLocaleString()}.`;
      }
    } else if (perguntaLower.includes('preço') || perguntaLower.includes('preco') || perguntaLower.includes('valor')) {
      resposta = 'Os preços variam de acordo com a localização, tipo e características do imóvel. Posso ajudá-lo a encontrar imóveis dentro do seu orçamento.';
    } else if (perguntaLower.includes('lisboa')) {
      resposta = 'Lisboa tem uma grande variedade de imóveis disponíveis. A busca foi otimizada usando cache inteligente, economizando requisições à API.';
    } else if (perguntaLower.includes('melhor') || perguntaLower.includes('recomend')) {
      resposta = 'Recomendo focar em imóveis que estejam listados em múltiplos sites, pois isso indica alta demanda e preço de mercado estável.';
    } else {
      resposta = `Entendi sua pergunta sobre "${pergunta}". Com base nos ${totalImoveis} imóveis disponíveis no sistema, posso ajudá-lo a encontrar a melhor opção. A busca foi otimizada com cache inteligente para respostas mais rápidas.`;
    }

    const mensagemResposta: MensagemIA = {
      de: 'assistente',
      para: 'coaching',
      tipo: 'resposta',
      conteudo: { pergunta, resposta },
      timestamp: new Date().toISOString()
    };
    await this.enviarMensagem(mensagemResposta);

    return resposta;
  }

  /**
   * IA DE COACHING: Analisar performance e dar feedback
   * VERSÃO DEMO: Usa lógica local em vez de OpenAI
   */
  async iaCoaching_analisarPerformance(consultorId: string): Promise<{
    analise: string;
    recomendacoes: string[];
    metricas: any;
  }> {
    const mensagem: MensagemIA = {
      de: 'coaching',
      para: 'dados',
      tipo: 'consulta',
      conteudo: { acao: 'analise_performance', consultor_id: consultorId },
      timestamp: new Date().toISOString()
    };
    await this.enviarMensagem(mensagem);

    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 400));

    // Analisar histórico de interações
    const totalInteracoes = this.historicoMensagens.length;
    const consultasAssistente = this.historicoMensagens.filter(m => m.de === 'assistente').length;
    const buscasDados = this.historicoMensagens.filter(m => m.de === 'dados').length;
    const imoveisVisualizados = this.contextoGlobal.imoveis_recentes?.length || 0;

    // Gerar análise baseada em métricas (versão demo)
    let analise = '';
    if (totalInteracoes < 5) {
      analise = 'Você está começando a explorar o sistema. Continue fazendo perguntas para melhorar sua experiência.';
    } else if (totalInteracoes < 15) {
      analise = 'Boa performance! Você está utilizando bem as ferramentas disponíveis. Continue explorando diferentes filtros de busca.';
    } else {
      analise = 'Excelente! Você está dominando o sistema. Suas buscas estão cada vez mais assertivas e eficientes.';
    }

    const recomendacoes = [
      'Continue explorando diferentes filtros de busca para encontrar imóveis mais específicos',
      'Utilize a geolocalização para encontrar imóveis próximos aos seus clientes',
      'Revise os imóveis duplicados para otimizar suas ofertas e identificar oportunidades'
    ];

    // Adicionar recomendação específica baseada em uso
    if (buscasDados < 3) {
      recomendacoes.push('Experimente fazer mais buscas de dados para explorar o inventário completo');
    }

    if (imoveisVisualizados > 10) {
      recomendacoes.push('Você já visualizou muitos imóveis! Considere usar filtros mais específicos para economizar tempo');
    }

    const resultado = {
      analise,
      recomendacoes: recomendacoes.slice(0, 3),
      metricas: {
        total_interacoes: totalInteracoes,
        consultas_assistente: consultasAssistente,
        buscas_dados: buscasDados,
        imoveis_visualizados: imoveisVisualizados
      }
    };

    const mensagemResposta: MensagemIA = {
      de: 'coaching',
      para: 'assistente',
      tipo: 'resposta',
      conteudo: resultado,
      timestamp: new Date().toISOString()
    };
    await this.enviarMensagem(mensagemResposta);

    return resultado;
  }

  /**
   * VARIÁVEL 3: Consulta integrada - todas as IAs trabalham juntas
   */
  async consultaIntegrada(
    pergunta: string,
    consultorId: string,
    incluirCoaching: boolean = false
  ): Promise<{
    resposta_assistente: string;
    dados_relevantes?: Imovel[];
    feedback_coaching?: any;
  }> {
    // 1. IA Assistente processa a pergunta
    const respostaAssistente = await this.iaAssistente_responderConsulta(pergunta);

    // 2. IA de Dados busca informações relevantes (se necessário)
    let dadosRelevantes: Imovel[] | undefined;
    if (pergunta.toLowerCase().includes('imóvel') || pergunta.toLowerCase().includes('casa') || pergunta.toLowerCase().includes('apartamento')) {
      dadosRelevantes = this.contextoGlobal.imoveis_recentes;
    }

    // 3. IA de Coaching analisa (se solicitado)
    let feedbackCoaching;
    if (incluirCoaching) {
      feedbackCoaching = await this.iaCoaching_analisarPerformance(consultorId);
    }

    return {
      resposta_assistente: respostaAssistente,
      dados_relevantes: dadosRelevantes,
      feedback_coaching: feedbackCoaching
    };
  }

  /**
   * Obter histórico de comunicação entre IAs
   */
  obterHistorico(limite: number = 10): MensagemIA[] {
    return this.historicoMensagens.slice(-limite);
  }

  /**
   * Obter contexto atual
   */
  obterContexto(): ContextoCompartilhado {
    return this.contextoGlobal;
  }

  /**
   * Limpar histórico e contexto
   */
  limpar(): void {
    this.historicoMensagens = [];
    this.contextoGlobal = {};
  }
}

/**
 * Instância global do Hub (singleton)
 */
let hubGlobal: IAHub | null = null;

export function obterIAHub(casafariApiKey?: string): IAHub {
  if (!hubGlobal) {
    hubGlobal = new IAHub(casafariApiKey);
  }
  return hubGlobal;
}

export function resetarIAHub(): void {
  hubGlobal = null;
}
