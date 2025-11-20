// Tipos para o Sistema de Gestão Imobiliária

export type StatusImovel = 'ativo' | 'vendido' | 'suspenso' | 'em_analise';
export type TipoImovel = 'apartamento' | 'casa' | 'terreno' | 'comercial';
export type FonteImovel = 'interno' | 'casafari' | 'olx' | 'idealista';

export interface Imovel {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoImovel;
  status: StatusImovel;
  preco?: number;
  area_m2?: number;
  quartos?: number;
  banheiros?: number;
  vagas_garagem?: number;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  url_anuncio?: string;
  url_portal_externo?: string;
  fotos: string[];
  caracteristicas: Record<string, any>;
  data_cadastro: string;
  data_venda?: string;
  data_ultima_atualizacao: string;
  consultor_id?: string;
  fonte: FonteImovel;
  id_externo?: string;
}

/**
 * VARIÁVEL 1: Tipo estendido para imóveis consolidados (sem duplicatas)
 */
export interface ImovelConsolidado extends Imovel {
  duplicatas?: {
    site: string;
    preco?: number;
    url?: string;
    fonte: string;
  }[];
  total_sites?: number;
}

export interface AlertaCorrespondencia {
  id: string;
  imovel_interno_id: string;
  imovel_externo_id: string;
  grau_confianca: number; // 0-100
  status: 'pendente' | 'confirmado' | 'rejeitado';
  motivo_correspondencia: {
    similaridade_titulo?: number;
    similaridade_endereco?: number;
    similaridade_preco?: number;
    similaridade_caracteristicas?: number;
    detalhes?: string;
  };
  data_deteccao: string;
  data_resolucao?: string;
  resolvido_por?: string;
}

export interface SincronizacaoCasafari {
  id: string;
  usuario_id?: string;
  api_key_configurada: boolean;
  ultima_sincronizacao?: string;
  proxima_sincronizacao?: string;
  status: 'inativo' | 'ativo' | 'erro';
  total_imoveis_sincronizados: number;
  erro_mensagem?: string;
  configuracoes: {
    intervalo_minutos?: number;
    auto_sync?: boolean;
    filtros?: Record<string, any>;
  };
}

export interface HistoricoAcao {
  id: string;
  tipo_acao: 'cadastro' | 'edicao' | 'venda' | 'exclusao' | 'sincronizacao';
  imovel_id?: string;
  usuario_id?: string;
  detalhes: Record<string, any>;
  created_at: string;
}

export interface ResultadoCruzamento {
  imovel_interno: Imovel;
  correspondencias: {
    imovel_externo: Imovel;
    grau_confianca: number;
    motivos: string[];
  }[];
}
