// Constantes e dados mock para Imobiliário GO Plus
import { Lead, Imovel, Badge, Desafio, UserStats, Notificacao, RelatorioMercado, MetaCoaching, SessaoCoaching, KPICoaching, PlanoAcao, FeedbackCoaching, AnalisePerformance } from './types';

export const TAXA_IVA_RECIBOS_VERDES = 0.23; // 23% IVA em Portugal

export const LEAD_STATUS_CONFIG = {
  novo: { label: 'Novo', color: 'bg-blue-500', icon: 'UserPlus' },
  contactado: { label: 'Contactado', color: 'bg-purple-500', icon: 'Phone' },
  em_negociacao: { label: 'Em Negociação', color: 'bg-yellow-500', icon: 'MessageSquare' },
  visita_marcada: { label: 'Visita Marcada', color: 'bg-orange-500', icon: 'Calendar' },
  proposta: { label: 'Proposta', color: 'bg-indigo-500', icon: 'FileText' },
  fechado: { label: 'Fechado', color: 'bg-green-500', icon: 'CheckCircle' },
  perdido: { label: 'Perdido', color: 'bg-red-500', icon: 'XCircle' },
};

export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@email.pt',
    telefone: '+351 912 345 678',
    status: 'em_negociacao',
    origem: 'Website',
    valor_estimado: 250000,
    data_criacao: new Date('2024-01-15'),
    ultima_interacao: new Date('2024-01-20'),
    notas: [
      { id: 'n1', texto: 'Cliente interessado em apartamento T3 em Lisboa', data: new Date('2024-01-15'), tipo: 'texto', autor: 'Ana Costa' }
    ],
    pontuacao: 85,
    imovel_interesse: 'Apartamento T3 - Avenidas Novas'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@email.pt',
    telefone: '+351 913 456 789',
    status: 'visita_marcada',
    origem: 'Referência',
    valor_estimado: 180000,
    data_criacao: new Date('2024-01-18'),
    ultima_interacao: new Date('2024-01-22'),
    notas: [
      { id: 'n2', texto: 'Visita agendada para 25/01 às 15h', data: new Date('2024-01-22'), tipo: 'texto', autor: 'Pedro Alves' }
    ],
    pontuacao: 92,
    imovel_interesse: 'Moradia V3 - Cascais'
  },
  {
    id: '3',
    nome: 'Carlos Pereira',
    email: 'carlos.pereira@email.pt',
    telefone: '+351 914 567 890',
    status: 'novo',
    origem: 'Facebook Ads',
    valor_estimado: 320000,
    data_criacao: new Date('2024-01-23'),
    ultima_interacao: new Date('2024-01-23'),
    notas: [],
    pontuacao: 65,
  },
];

export const MOCK_IMOVEIS: Imovel[] = [
  {
    id: '1',
    titulo: 'Apartamento T3 - Avenidas Novas',
    tipo: 'apartamento',
    status: 'disponivel',
    preco: 285000,
    localizacao: 'Lisboa, Avenidas Novas',
    area: 120,
    quartos: 3,
    casas_banho: 2,
    descricao: 'Apartamento moderno com varanda, próximo ao metro',
    imagens: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
    data_adicao: new Date('2024-01-10'),
    proprietario: 'António Ferreira',
    imobiliaria: 'Imobiliária Prime Lisboa',
    data_ultima_atualizacao: new Date('2024-01-22'),
  },
  {
    id: '2',
    titulo: 'Moradia V3 - Cascais',
    tipo: 'moradia',
    status: 'disponivel',
    preco: 450000,
    localizacao: 'Cascais, Centro',
    area: 180,
    quartos: 3,
    casas_banho: 3,
    descricao: 'Moradia com jardim e garagem, perto da praia',
    imagens: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'],
    data_adicao: new Date('2024-01-12'),
    proprietario: 'Sofia Rodrigues',
    imobiliaria: 'Cascais Premium Properties',
    data_ultima_atualizacao: new Date('2024-01-20'),
  },
  {
    id: '3',
    titulo: 'Apartamento T2 - Porto',
    tipo: 'apartamento',
    status: 'reservado',
    preco: 195000,
    localizacao: 'Porto, Boavista',
    area: 85,
    quartos: 2,
    casas_banho: 1,
    descricao: 'Apartamento renovado em zona premium',
    imagens: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
    data_adicao: new Date('2024-01-14'),
    proprietario: 'Miguel Sousa',
    imobiliaria: 'Porto Real Estate',
    data_ultima_atualizacao: new Date('2024-01-23'),
  },
];

export const MOCK_BADGES: Badge[] = [
  { id: '1', nome: 'Primeiro Lead', descricao: 'Registou o seu primeiro lead', icone: 'Award', conquistado: true, data_conquista: new Date('2024-01-15') },
  { id: '2', nome: 'Vendedor Estrela', descricao: 'Fechou 5 vendas', icone: 'Star', conquistado: true, data_conquista: new Date('2024-01-20') },
  { id: '3', nome: 'Mestre da Negociação', descricao: 'Converteu 10 leads', icone: 'Trophy', conquistado: false },
  { id: '4', nome: 'Velocidade Máxima', descricao: 'Fechou uma venda em menos de 7 dias', icone: 'Zap', conquistado: false },
];

export const MOCK_DESAFIOS: Desafio[] = [
  {
    id: '1',
    titulo: 'Contactar 10 Leads',
    descricao: 'Entre em contacto com 10 leads esta semana',
    tipo: 'semanal',
    meta: 10,
    progresso: 6,
    pontos_recompensa: 150,
    expira_em: new Date('2024-01-28'),
  },
  {
    id: '2',
    titulo: 'Marcar 3 Visitas',
    descricao: 'Agende 3 visitas a imóveis hoje',
    tipo: 'diario',
    meta: 3,
    progresso: 1,
    pontos_recompensa: 50,
    expira_em: new Date('2024-01-24'),
  },
];

export const MOCK_USER_STATS: UserStats = {
  pontos_totais: 2450,
  nivel: 8,
  leads_convertidos: 12,
  imoveis_vendidos: 8,
  comissao_total: 24500,
  ranking_posicao: 3,
  badges: MOCK_BADGES,
};

export const MOCK_NOTIFICACOES: Notificacao[] = [
  {
    id: '1',
    tipo: 'lead',
    titulo: 'Novo Lead',
    mensagem: 'Carlos Pereira demonstrou interesse num imóvel',
    data: new Date('2024-01-23T10:30:00'),
    lida: false,
    prioridade: 'alta',
  },
  {
    id: '2',
    tipo: 'imovel',
    titulo: 'Imóvel Vendido',
    mensagem: 'Apartamento T2 - Porto foi marcado como vendido',
    data: new Date('2024-01-22T15:45:00'),
    lida: false,
    prioridade: 'media',
  },
  {
    id: '3',
    tipo: 'desafio',
    titulo: 'Desafio Quase Completo',
    mensagem: 'Faltam apenas 4 contactos para completar o desafio semanal',
    data: new Date('2024-01-23T09:00:00'),
    lida: true,
    prioridade: 'baixa',
  },
];

export const MOCK_RELATORIOS: RelatorioMercado[] = [
  {
    regiao: 'Lisboa',
    tipo_imovel: 'apartamento',
    preco_medio: 285000,
    preco_minimo: 180000,
    preco_maximo: 450000,
    tendencia: 'subida',
    volume_vendas: 142,
    tempo_medio_venda: 45,
  },
  {
    regiao: 'Porto',
    tipo_imovel: 'apartamento',
    preco_medio: 195000,
    preco_minimo: 120000,
    preco_maximo: 320000,
    tendencia: 'estavel',
    volume_vendas: 98,
    tempo_medio_venda: 52,
  },
];

export const PROFILE_FEATURES = {
  novo: {
    tutoriais: true,
    automacao_basica: true,
    relatorios_simples: true,
    limite_leads: 50,
  },
  intermediario: {
    tutoriais: false,
    automacao_avancada: true,
    relatorios_detalhados: true,
    limite_leads: 200,
  },
  premium: {
    tutoriais: false,
    automacao_completa: true,
    relatorios_ia: true,
    limite_leads: -1, // ilimitado
  },
};

// Dados Mock para Coaching Comercial

export const MOCK_METAS_COACHING: MetaCoaching[] = [
  {
    id: '1',
    titulo: 'Aumentar Vendas Mensais',
    descricao: 'Atingir 5 vendas por mês de forma consistente',
    prazo: 'curto',
    data_inicio: new Date('2024-01-01'),
    data_fim: new Date('2024-03-31'),
    status: 'em_progresso',
    valor_inicial: 2,
    valor_atual: 3,
    valor_meta: 5,
    unidade: 'vendas',
    area: 'fechamento',
    acoes: [
      { id: 'a1', meta_id: '1', descricao: 'Fazer follow-up diário com leads quentes', prazo: new Date('2024-01-31'), concluida: true, data_conclusao: new Date('2024-01-25') },
      { id: 'a2', meta_id: '1', descricao: 'Implementar técnica de fechamento consultivo', prazo: new Date('2024-02-15'), concluida: false },
      { id: 'a3', meta_id: '1', descricao: 'Criar urgência com ofertas limitadas', prazo: new Date('2024-02-28'), concluida: false },
    ]
  },
  {
    id: '2',
    titulo: 'Melhorar Taxa de Conversão',
    descricao: 'Aumentar conversão de leads para 25%',
    prazo: 'medio',
    data_inicio: new Date('2024-01-01'),
    data_fim: new Date('2024-06-30'),
    status: 'em_progresso',
    valor_inicial: 15,
    valor_atual: 18,
    valor_meta: 25,
    unidade: 'percentual',
    area: 'negociacao',
    acoes: [
      { id: 'a4', meta_id: '2', descricao: 'Qualificar melhor os leads antes do contacto', prazo: new Date('2024-02-15'), concluida: false },
      { id: 'a5', meta_id: '2', descricao: 'Desenvolver script de apresentação personalizado', prazo: new Date('2024-03-01'), concluida: false },
    ]
  },
  {
    id: '3',
    titulo: 'Gerar 50 Leads Qualificados/Mês',
    descricao: 'Construir pipeline robusto de leads qualificados',
    prazo: 'medio',
    data_inicio: new Date('2024-01-01'),
    data_fim: new Date('2024-06-30'),
    status: 'em_progresso',
    valor_inicial: 25,
    valor_atual: 35,
    valor_meta: 50,
    unidade: 'leads',
    area: 'prospeccao',
    acoes: [
      { id: 'a6', meta_id: '3', descricao: 'Criar conteúdo de valor nas redes sociais', prazo: new Date('2024-02-01'), concluida: true, data_conclusao: new Date('2024-01-28') },
      { id: 'a7', meta_id: '3', descricao: 'Participar em 2 eventos de networking por mês', prazo: new Date('2024-03-31'), concluida: false },
    ]
  },
];

export const MOCK_SESSOES_COACHING: SessaoCoaching[] = [
  {
    id: '1',
    titulo: 'Sessão Inicial - Definição de Objetivos',
    data: new Date('2024-01-05T10:00:00'),
    duracao: 90,
    status: 'concluida',
    coach: 'Dr. Ricardo Mendes',
    consultor: 'Ana Costa',
    topicos: ['Análise situação atual', 'Definição de metas SMART', 'Plano de ação trimestral'],
    notas: 'Consultor demonstra forte motivação. Principais desafios: gestão de tempo e follow-up consistente.',
    proximos_passos: ['Implementar sistema CRM', 'Definir rotina matinal de prospecção', 'Agendar próxima sessão'],
  },
  {
    id: '2',
    titulo: 'Revisão Mensal - Janeiro',
    data: new Date('2024-02-02T14:00:00'),
    duracao: 60,
    status: 'concluida',
    coach: 'Dr. Ricardo Mendes',
    consultor: 'Ana Costa',
    topicos: ['Análise de resultados', 'Ajuste de estratégias', 'Feedback sobre técnicas de negociação'],
    notas: 'Progresso positivo. Taxa de conversão aumentou 3%. Necessário trabalhar objeções comuns.',
    proximos_passos: ['Praticar role-play de objeções', 'Implementar técnica de espelhamento', 'Aumentar frequência de follow-up'],
  },
  {
    id: '3',
    titulo: 'Sessão Estratégica - Fevereiro',
    data: new Date('2024-02-28T10:00:00'),
    duracao: 90,
    status: 'agendada',
    coach: 'Dr. Ricardo Mendes',
    consultor: 'Ana Costa',
    topicos: ['Revisão trimestral', 'Estratégias de marketing pessoal', 'Planeamento Q2'],
  },
];

export const MOCK_KPIS_COACHING: KPICoaching[] = [
  {
    id: '1',
    nome: 'Leads Gerados',
    valor_atual: 35,
    valor_meta: 50,
    unidade: 'leads/mês',
    periodo: 'mensal',
    tendencia: 'subida',
    historico: [
      { data: new Date('2024-01-01'), valor: 25 },
      { data: new Date('2024-01-08'), valor: 28 },
      { data: new Date('2024-01-15'), valor: 32 },
      { data: new Date('2024-01-22'), valor: 35 },
    ]
  },
  {
    id: '2',
    nome: 'Taxa de Conversão',
    valor_atual: 18,
    valor_meta: 25,
    unidade: '%',
    periodo: 'mensal',
    tendencia: 'subida',
    historico: [
      { data: new Date('2024-01-01'), valor: 15 },
      { data: new Date('2024-01-08'), valor: 16 },
      { data: new Date('2024-01-15'), valor: 17 },
      { data: new Date('2024-01-22'), valor: 18 },
    ]
  },
  {
    id: '3',
    nome: 'Vendas Realizadas',
    valor_atual: 3,
    valor_meta: 5,
    unidade: 'vendas/mês',
    periodo: 'mensal',
    tendencia: 'estavel',
    historico: [
      { data: new Date('2024-01-01'), valor: 2 },
      { data: new Date('2024-01-08'), valor: 2 },
      { data: new Date('2024-01-15'), valor: 3 },
      { data: new Date('2024-01-22'), valor: 3 },
    ]
  },
  {
    id: '4',
    nome: 'Comissão Gerada',
    valor_atual: 8500,
    valor_meta: 15000,
    unidade: '€/mês',
    periodo: 'mensal',
    tendencia: 'subida',
    historico: [
      { data: new Date('2024-01-01'), valor: 5000 },
      { data: new Date('2024-01-08'), valor: 6200 },
      { data: new Date('2024-01-15'), valor: 7800 },
      { data: new Date('2024-01-22'), valor: 8500 },
    ]
  },
];

export const MOCK_PLANO_ACAO: PlanoAcao = {
  id: '1',
  semana: 4,
  ano: 2024,
  objetivos: [
    'Contactar 15 novos leads',
    'Marcar 5 visitas',
    'Fechar 2 vendas',
    'Publicar 3 posts nas redes sociais'
  ],
  acoes_diarias: [
    {
      dia: 'Segunda',
      acoes: ['Revisar pipeline de leads', 'Fazer 5 chamadas de prospecção', 'Preparar apresentações para visitas da semana']
    },
    {
      dia: 'Terça',
      acoes: ['Follow-up com leads quentes', 'Realizar 2 visitas agendadas', 'Atualizar CRM']
    },
    {
      dia: 'Quarta',
      acoes: ['Networking - evento imobiliário', 'Preparar propostas comerciais', 'Publicar conteúdo redes sociais']
    },
    {
      dia: 'Quinta',
      acoes: ['Fazer 5 chamadas de prospecção', 'Realizar 1 visita', 'Negociar com leads em proposta']
    },
    {
      dia: 'Sexta',
      acoes: ['Follow-up semanal com todos os leads', 'Fechar negociações pendentes', 'Planeamento próxima semana']
    },
  ],
  resultado_esperado: 'Aumentar pipeline em 30% e fechar 2 vendas',
  resultado_real: 'Pipeline aumentou 25%, fechadas 1 venda (50% da meta)',
  aprendizados: [
    'Necessário melhorar qualificação de leads antes do contacto',
    'Técnica de urgência funcionou bem em 2 casos',
    'Networking gerou 3 leads qualificados'
  ]
};

export const MOCK_FEEDBACK_COACHING: FeedbackCoaching[] = [
  {
    id: '1',
    data: new Date('2024-01-31'),
    tipo: 'mensal',
    pontos_fortes: [
      'Excelente capacidade de relacionamento com clientes',
      'Proatividade na prospecção de novos leads',
      'Boa organização do pipeline de vendas'
    ],
    areas_melhoria: [
      'Gestão de objeções - necessita de mais prática',
      'Follow-up poderia ser mais consistente',
      'Técnicas de fechamento precisam ser aprimoradas'
    ],
    recomendacoes: [
      'Estudar e praticar 5 técnicas de tratamento de objeções',
      'Implementar sistema de lembretes automáticos para follow-up',
      'Participar em workshop de técnicas de fechamento',
      'Fazer role-play semanal com coach'
    ],
    proximas_acoes: [
      'Agendar workshop de objeções para próxima semana',
      'Configurar automações de follow-up no CRM',
      'Praticar script de fechamento diariamente'
    ],
    nota_desempenho: 7.5
  },
];

export const MOCK_ANALISE_PERFORMANCE: AnalisePerformance = {
  periodo: 'Janeiro 2024',
  leads_gerados: 35,
  leads_convertidos: 6,
  taxa_conversao: 17.1,
  vendas_realizadas: 3,
  comissao_gerada: 8500,
  tempo_medio_fechamento: 28,
  satisfacao_cliente: 8.5,
  areas_destaque: ['prospeccao', 'relacionamento'],
  areas_atencao: ['negociacao', 'fechamento']
};
