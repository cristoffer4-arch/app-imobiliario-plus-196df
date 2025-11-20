// Types para Imobiliário GO Plus

export type UserProfile = 'novo' | 'intermediario' | 'premium';
export type Theme = 'light' | 'dark' | 'accessibility';

export type LeadStatus = 
  | 'novo' 
  | 'contactado' 
  | 'em_negociacao' 
  | 'visita_marcada' 
  | 'proposta' 
  | 'fechado' 
  | 'perdido';

export type ImovelStatus = 'disponivel' | 'vendido' | 'reservado';
export type ImovelTipo = 'apartamento' | 'moradia' | 'terreno' | 'comercial';

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: LeadStatus;
  origem: string;
  valor_estimado: number;
  data_criacao: Date;
  ultima_interacao: Date;
  notas: Nota[];
  pontuacao: number;
  imovel_interesse?: string;
}

export interface Nota {
  id: string;
  texto: string;
  data: Date;
  tipo: 'texto' | 'voz';
  autor: string;
}

export interface Imovel {
  id: string;
  titulo: string;
  tipo: ImovelTipo;
  status: ImovelStatus;
  preco: number;
  localizacao: string;
  area: number;
  quartos: number;
  casas_banho: number;
  descricao: string;
  imagens: string[];
  data_adicao: Date;
  proprietario: string;
  duplicado?: boolean;
  imobiliaria?: string; // Nome da imobiliária
  data_ultima_atualizacao?: Date; // Data da última atualização do anúncio
}

export interface Comissao {
  id: string;
  lead_id: string;
  imovel_id: string;
  valor_venda: number;
  percentual_comissao: number;
  valor_bruto: number;
  taxa_iva: number;
  valor_iva: number;
  valor_liquido: number;
  data_fechamento: Date;
  consultor: string;
  status: 'pendente' | 'pago' | 'cancelado';
}

export interface Badge {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  conquistado: boolean;
  data_conquista?: Date;
}

export interface Desafio {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'diario' | 'semanal' | 'mensal';
  meta: number;
  progresso: number;
  pontos_recompensa: number;
  expira_em: Date;
}

export interface UserStats {
  pontos_totais: number;
  nivel: number;
  leads_convertidos: number;
  imoveis_vendidos: number;
  comissao_total: number;
  ranking_posicao: number;
  badges: Badge[];
}

export interface Notificacao {
  id: string;
  tipo: 'lead' | 'imovel' | 'comissao' | 'desafio' | 'sistema';
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  prioridade: 'baixa' | 'media' | 'alta';
}

export interface RelatorioMercado {
  regiao: string;
  tipo_imovel: ImovelTipo;
  preco_medio: number;
  preco_minimo: number;
  preco_maximo: number;
  tendencia: 'subida' | 'descida' | 'estavel';
  volume_vendas: number;
  tempo_medio_venda: number;
}

// Tipos para Coaching Comercial

export type MetaPrazo = 'curto' | 'medio' | 'longo'; // curto: 1-3 meses, médio: 3-6 meses, longo: 6-12 meses
export type MetaStatus = 'em_progresso' | 'concluida' | 'atrasada' | 'cancelada';
export type SessaoStatus = 'agendada' | 'concluida' | 'cancelada';
export type AreaDesenvolvimento = 
  | 'prospeccao' 
  | 'negociacao' 
  | 'fechamento' 
  | 'relacionamento' 
  | 'organizacao' 
  | 'marketing_pessoal';

export interface MetaCoaching {
  id: string;
  titulo: string;
  descricao: string;
  prazo: MetaPrazo;
  data_inicio: Date;
  data_fim: Date;
  status: MetaStatus;
  valor_inicial: number;
  valor_atual: number;
  valor_meta: number;
  unidade: string; // 'vendas', 'leads', 'comissão', 'visitas'
  area: AreaDesenvolvimento;
  acoes: AcaoCoaching[];
}

export interface AcaoCoaching {
  id: string;
  meta_id: string;
  descricao: string;
  prazo: Date;
  concluida: boolean;
  data_conclusao?: Date;
  resultado?: string;
}

export interface SessaoCoaching {
  id: string;
  titulo: string;
  data: Date;
  duracao: number; // em minutos
  status: SessaoStatus;
  coach: string;
  consultor: string;
  topicos: string[];
  notas?: string;
  proximos_passos?: string[];
  gravacao_url?: string;
}

export interface KPICoaching {
  id: string;
  nome: string;
  valor_atual: number;
  valor_meta: number;
  unidade: string;
  periodo: 'semanal' | 'mensal' | 'trimestral';
  tendencia: 'subida' | 'descida' | 'estavel';
  historico: { data: Date; valor: number }[];
}

export interface PlanoAcao {
  id: string;
  semana: number;
  ano: number;
  objetivos: string[];
  acoes_diarias: { dia: string; acoes: string[] }[];
  resultado_esperado: string;
  resultado_real?: string;
  aprendizados?: string[];
}

export interface FeedbackCoaching {
  id: string;
  data: Date;
  tipo: 'semanal' | 'mensal' | 'trimestral';
  pontos_fortes: string[];
  areas_melhoria: string[];
  recomendacoes: string[];
  proximas_acoes: string[];
  nota_desempenho: number; // 1-10
}

export interface AnalisePerformance {
  periodo: string;
  leads_gerados: number;
  leads_convertidos: number;
  taxa_conversao: number;
  vendas_realizadas: number;
  comissao_gerada: number;
  tempo_medio_fechamento: number;
  satisfacao_cliente: number;
  areas_destaque: AreaDesenvolvimento[];
  areas_atencao: AreaDesenvolvimento[];
}
