# 🎯 ROADMAP 100% - ADAPTAÇÃO COMPLETA PT/BR
# Guia de Implementação Detalhado

> **Data de criação:** 29 Dezembro 2024  
> **Versão:** 1.0  
> **Status:** Aguardando revisão e aprovação  

---

## 📝 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitectura da Solução](#arquitectura)
3. [Módulos Detalhados](#módulos)
   - [Módulo 2: Dados PT/BR Específicos](#módulo-2)
   - [Módulo 3: Filtros PT/BR](#módulo-3)
   - [Módulo 4: IA Consultores PT](#módulo-4)
   - [Módulo 5: Dashboard Investidor PT](#módulo-5)
   - [Módulo 6: Mapas Calibrados PT](#módulo-6)
   - [Módulo 7: Fluxo Consultor PT](#módulo-7)
   - [Módulo 8: Integrações CRM](#módulo-8)
   - [Módulo 9: UX/Terminologia PT](#módulo-9)
   - [Módulo 10: Casos de Uso](#módulo-10)
   - [Módulo 11: Analytics PT](#módulo-11)
   - [Módulo 12: Formação e Suporte](#módulo-12)
4. [Cronograma de Implementação](#cronograma)
5. [Dependências e Requisitos](#dependências)
6. [Validação e Testes](#validação)

---

## <a name="visão-geral"></a>🎯 VISÃO GERAL

### Objetivo
Adaptar completamente o sistema MVP imobiliário para o mercado português (Portugal), incorporando:
- Terminologia e práticas imobiliárias portuguesas
- Legislação e impostos específicos (IMI, IMT, Imposto do Selo)
- Sistema de tipologias (T0, T1, T2, T3, etc.)
- Integração com dados CASAFARI
- Workflows específicos para consultores portugueses

### Princípios de Design
1. **Compatibilidade retroativa**: Não quebrar funcionalidades existentes
2. **Modularidade**: Cada módulo pode ser implementado independentemente
3. **Escalabilidade**: Pronto para expansão futura
4. **User-centric**: Focado nas necessidades reais de consultores PT

### Métricas de Sucesso
- ✅ 100% da terminologia portuguesa adoptada
- ✅ Todos os filtros PT implementados
- ✅ IA a gerar conteúdo em PT correcto
- ✅ Calculadoras fiscais PT funcionais
- ✅ 100% dos consultores satisfeitos em testes beta

---

## <a name="arquitectura"></a>🏗️ ARQUITECTURA DA SOLUÇÃO

### Stack Tecnológico
```
Frontend: Next.js 14 + TypeScript + Tailwind CSS
Backend: Next.js API Routes + Supabase
Database: PostgreSQL (Supabase) + PostGIS
IA: OpenAI GPT-4 + Anthropic Claude
Mapas: Mapbox GL JS
Integrações: CASAFARI API, Google Places API
```

### Estrutura de Ficheiros Proposta
```
app-imobiliario-plus-196df/
├── app/
│   ├── api/
│   │   ├── properties/         # Já existente
│   │   ├── properties-pt/      # NOVO: Endpoints PT-specíficos
│   │   ├── ai/
│   │   │   ├── relatorio-pt/     # NOVO: Relatórios PT
│   │   │   └── argumentario/     # NOVO: Argumentação de preço
│   │   ├── casafari/           # NOVO: Integração CASAFARI
│   │   └── calculations/       # NOVO: ROI, IMI, IMT
│   └── pt/                  # NOVO: Páginas específicas PT
├── components/
│   ├── properties/
│   ├── filters-pt/          # NOVO: Filtros PT
│   ├── consultant/          # NOVO: Fluxo consultor
│   ├── investor/            # NOVO: Dashboard investidor
│   └── maps/                # Atualizar: Mapas contextuais
├── lib/
│   ├── ai/
│   │   ├── prompts-pt.ts      # NOVO
│   │   └── template-generator.ts # NOVO
│   ├── calculators/
│   │   ├── roi-pt.ts          # NOVO
│   │   ├── tax-pt.ts          # NOVO
│   │   └── al-projection.ts   # NOVO: Alojamento Local
│   ├── maps/
│   │   └── contextual-layers-pt.ts # NOVO
│   └── integrations/
│       └── casafari.ts        # NOVO
├── types/
│   ├── property.ts           # Já existente
│   └── property-pt.ts        # NOVO: Tipos PT-específicos
├── supabase/
│   └── migrations/
│       ├── add_pt_fields.sql     # NOVO
│       └── seed_pt_data.sql      # NOVO
└── i18n/
    └── pt-PT.json            # NOVO: Traduções PT
```

---

## <a name="módulos"></a>📦 MÓDULOS DETALHADOS

### <a name="módulo-2"></a>🏡 MÓDULO 2: DADOS PT/BR ESPECÍFICOS

#### 2.1 Database - Campos PT

**Ficheiro:** `supabase/migrations/20241229_add_pt_fields.sql`

```sql
-- Adição de campos específicos PT à tabela properties
ALTER TABLE properties ADD COLUMN IF NOT EXISTS
  -- Tipologia Portuguesa
  tipologia TEXT CHECK (tipologia IN ('T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6+', 'Loft', 'Duplex', 'Fração')),
  
  -- Licenças e Certificações
  licenca_habitacao TEXT,
  certificado_energetico TEXT CHECK (certificado_energetico IN ('A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F')),
  al_license TEXT, -- Licença Alojamento Local
  al_numero_registo TEXT, -- Número de registo AL
  
  -- Condomínio
  condominio_mensal DECIMAL(10,2),
  condominio_inclui TEXT[], -- Ex: ARRAY['água', 'gás', 'limpeza'],
  
  -- IMI/Impostos
  imi_anual DECIMAL(10,2),
  imt_estimado DECIMAL(10,2),
  imposto_selo DECIMAL(10,2),
  
  -- Características PT
  orientacao TEXT CHECK (orientacao IN ('Norte', 'Sul', 'Este', 'Oeste', 'Nascente', 'Poente')),
  vista TEXT[], -- Ex: ARRAY['mar', 'cidade', 'serra', 'rio']
  elevador BOOLEAN DEFAULT false,
  lugar_garagem INTEGER DEFAULT 0,
  arrecadacao BOOLEAN DEFAULT false,
  varanda BOOLEAN DEFAULT false,
  varanda_area DECIMAL(6,2),
  
  -- Zonamento PT
  freguesia TEXT,
  distrito TEXT,
  concelho TEXT;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_properties_tipologia ON properties(tipologia);
CREATE INDEX IF NOT EXISTS idx_properties_distrito ON properties(distrito);
CREATE INDEX IF NOT EXISTS idx_properties_concelho ON properties(concelho);
CREATE INDEX IF NOT EXISTS idx_properties_certificado ON properties(certificado_energetico);
```

#### 2.2 TypeScript Types

**Ficheiro:** `types/property-pt.ts`

```typescript
import { Property } from './property';

export type TipologiaPT = 'T0' | 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6+' | 'Loft' | 'Duplex' | 'Fração';
export type CertificadoEnergetico = 'A+' | 'A' | 'B' | 'B-' | 'C' | 'D' | 'E' | 'F';
export type OrientacaoPT = 'Norte' | 'Sul' | 'Este' | 'Oeste' | 'Nascente' | 'Poente';
export type VistaPT = 'mar' | 'cidade' | 'serra' | 'rio' | 'campo' | 'parque';

export interface PropertyPT extends Property {
  // Tipologia
  tipologia: TipologiaPT;
  
  // Licenças
  licenca_habitacao?: string;
  certificado_energetico?: CertificadoEnergetico;
  al_license?: string;
  al_numero_registo?: string;
  
  // Condomínio
  condominio_mensal?: number;
  condominio_inclui?: string[];
  
  // Impostos
  imi_anual?: number;
  imt_estimado?: number;
  imposto_selo?: number;
  
  // Características
  orientacao?: OrientacaoPT;
  vista?: VistaPT[];
  elevador?: boolean;
  lugar_garagem?: number;
  arrecadacao?: boolean;
  varanda?: boolean;
  varanda_area?: number;
  
  // Localização PT
  freguesia?: string;
  distrito?: string;
  concelho?: string;
}

export const DISTRITOS_PT = [
  'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco',
  'Coimbra', 'Évora', 'Faro', 'Guarda', 'Leiria',
  'Lisboa', 'Portalegre', 'Porto', 'Santarém', 'Setúbal',
  'Viana do Castelo', 'Vila Real', 'Viseu',
  'Açores', 'Madeira'
] as const;

export type DistritosPT = typeof DISTRITOS_PT[number];
```

#### 2.3 Seed Data PT

**Ficheiro:** `supabase/seed/properties_pt_examples.sql`

```sql
-- Exemplos reais para demonstração
INSERT INTO properties (
  tipologia, title, description, price, area,
  distrito, concelho, freguesia, address,
  certificado_energetico, orientacao,
  bedrooms, bathrooms, elevador, lugar_garagem,
  condominio_mensal, imi_anual,
  status, type
) VALUES
-- Lisboa - Chiado
('T2', 'Apartamento de Luxo no Chiado',
  'Apartamento totalmente remodelado no coração do Chiado, com vista privilegiada.',
  450000, 85, 'Lisboa', 'Lisboa', 'Santa Maria Maior',
  'Rua Garrett, 120', 'B', 'Sul',
  2, 2, true, 1, 120.00, 580.00,
  'active', 'apartment'),

-- Porto - Foz
('T3', 'Moradia na Foz do Douro',
  'Moradia com jardim e vista mar, próxima à praia.',
  680000, 180, 'Porto', 'Porto', 'Foz do Douro',
  'Avenida do Brasil, 450', 'A', 'Oeste',
  3, 3, false, 2, 0, 1250.00,
  'active', 'house'),

-- Algarve - Albufeira
('T1', 'Apartamento Touristíco em Albufeira',
  'T1 com licença AL, próximo da praia, excelente rentabilidade.',
  195000, 55, 'Faro', 'Albufeira', 'Albufeira e Olhos de Água',
  'Rua da Oura, 28', 'C', 'Sul',
  1, 1, true, 1, 85.00, 320.00,
  'active', 'apartment');
```

**Tarefas de Implementação:**
- [ ] Criar migration SQL com campos PT
- [ ] Executar migration em ambiente de desenvolvimento
- [ ] Criar types TypeScript PT-específicos
- [ ] Atualizar API routes para aceitar novos campos
- [ ] Criar seed data com exemplos PT reais
- [ ] Testar queries com novos campos

**Tempo Estimado:** 4-6 horas

---

### <a name="módulo-3"></a>🔍 MÓDULO 3: FILTROS PT/BR

**Objetivo:** Implementar filtros específicos para mercado português

**Componentes:**
1. `FiltersTipologia.tsx` - Dropdown T0-T6+
2. `FiltersCertificadoEnergetico.tsx` - Filtro A+ até F
3. `FiltersDistrito.tsx` - Autocomplete distritos
4. `FiltersCondominio.tsx` - Range slider condomínio
5. `FiltersALLicense.tsx` - Filtro Alojamento Local

**API Endpoint:** `app/api/properties-pt/search/route.ts`

**Tempo Estimado:** 6-8 horas

---

### <a name="módulo-4"></a>🤖 MÓDULO 4: IA CONSULTORES PT

**Objetivo:** Prompts de IA otimizados para consultores portugueses

**Funcionalidades:**
1. **Relatório de Proprietário** - Análise de mercado + comparáveis CASAFARI
2. **Argumentário de Preço** - Justificação baseada em dados
3. **Resumo de Zona** - Contexto local (transportes, escolas, serviços)

**Ficheiros:**
- `lib/ai/prompts-pt.ts` - Prompts em PT
- `lib/ai/template-generator.ts` - Gerador de PDFs com branding
- `app/api/ai/relatorio-pt/route.ts` - API endpoint

**Tempo Estimado:** 10-12 horas

---

### <a name="módulo-5"></a>📊 MÓDULO 5: DASHBOARD INVESTIDOR PT

**Objetivo:** Calculadoras fiscais e ROI para investidores

**Componentes:**
1. Calculadora IMI/IMT/Imposto do Selo
2. Simulador ROI (Arrendamento vs Alojamento Local)
3. Projeção de receitas AL
4. Comparação de rentabilidade

**Ficheiros:**
- `lib/calculators/roi-pt.ts`
- `lib/calculators/tax-pt.ts`
- `lib/calculators/al-projection.ts`
- `components/investor/InvestorDashboardPT.tsx`

**Tempo Estimado:** 8-10 horas

---

### <a name="módulo-6"></a>🗺️ MÓDULO 6: MAPAS CALIBRADOS PT

**Objetivo:** Mapas com camadas contextuais portuguesas

**Camadas:**
- Metro/Comboio/Autocarros
- Escolas públicas/privadas
- Hospitais/Farmácias
- Supermercados/Serviços
- Heatmap calibrado por densidade real

**Ficheiros:**
- `lib/maps/contextual-layers-pt.ts`
- `components/maps/PropertyMapAdvancedPT.tsx`

**Tempo Estimado:** 12-15 horas

---

### <a name="módulo-7"></a>👔 MÓDULO 7: FLUXO CONSULTOR PT

**Objetivo:** Workflow otimizado para consultores

**Features:**
1. Modo Apresentação Cliente (fullscreen)
2. Ficha "Defender Preço" (argumentário automático)
3. Templates prontos (CPCV, Avaliação, Proposta)
4. Gerador de propostas com branding

**Componentes:**
- `components/consultant/PresentationMode.tsx`
- `components/consultant/DefenderPreco.tsx`
- `components/consultant/ProposalGenerator.tsx`

**Tempo Estimado:** 10-12 horas

---

### <a name="módulo-8"></a>🔗 MÓDULO 8: INTEGRAÇÕES CRM

**Objetivo:** Export e integrações com CRMs externos

**Funcionalidades:**
1. Export CSV/PDF de propriedades
2. Webhooks para atualizações
3. API keys management
4. OpenAPI documentation

**Tempo Estimado:** 6-8 horas

---

### <a name="módulo-9"></a>🌍 MÓDULO 9: UX/TERMINOLOGIA PT

**Objetivo:** 100% adaptação terminológica

**Alterações:**
- "listing" → "angariação"
- "deed" → "escritura"
- "property_tax" → "IMI"
- "transfer_tax" → "IMT"
- "energy_certificate" → "Certificado Energético"
- "condominium" → "Condomínio"

**Ficheiro:** `i18n/pt-PT.json` + Onboarding PT

**Tempo Estimado:** 4-6 horas

---

### <a name="módulo-10"></a>📚 MÓDULO 10: CASOS DE USO "RECEITA PRONTA"

**Receitas Interativas:**
1. **Proposta em 10 Minutos**
2. **Investidor Brasileiro em Lisboa**
3. **Defender Preço ao Proprietário**

**Componente:** `components/recipes/RecipesGallery.tsx`

**Tempo Estimado:** 6-8 horas

---

### <a name="módulo-11"></a>📊 MÓDULO 11: ANALYTICS & INSIGHTS PT

**Market Insights Dashboard:**
- Preço médio/m² por concelho
- Variação 12 meses
- Tempo médio de venda
- Tipologia mais procurada
- Top bairros valorização

**Componente:** `components/insights/MarketInsightsPT.tsx`

**Tempo Estimado:** 8-10 horas

---

### <a name="módulo-12"></a>🎓 MÓDULO 12: FORMAÇÃO E SUPORTE

**Centro de Ajuda PT:**
- Tutoriais em vídeo PT
- FAQ sobre impostos PT
- Suporte multicanal (Chat, Email, WhatsApp)
- Base de conhecimento PT

**Tempo Estimado:** 4-6 horas

---

## <a name="cronograma"></a>📅 CRONOGRAMA DE IMPLEMENTAÇÃO

### Fase 1: Fundações (Semana 1-2)
**Duração:** 10-15 dias  
**Prioridade:** ALTA

- ✅ Módulo 2: Dados PT/BR (4-6h)
- ✅ Módulo 3: Filtros PT/BR (6-8h)
- ✅ Módulo 9: Terminologia PT (4-6h)

**Entrega:** Base de dados + Filtros + UI em PT

### Fase 2: Inteligência & Automação (Semana 3-4)
**Duração:** 10-15 dias  
**Prioridade:** ALTA

- ✅ Módulo 4: IA Consultores PT (10-12h)
- ✅ Módulo 5: Dashboard Investidor PT (8-10h)
- ✅ Módulo 7: Fluxo Consultor PT (10-12h)

**Entrega:** Relatórios IA + Calculadoras + Fluxo Consultor

### Fase 3: Mapas & Insights (Semana 5)
**Duração:** 7-10 dias  
**Prioridade:** MÉDIA

- ✅ Módulo 6: Mapas Calibrados PT (12-15h)
- ✅ Módulo 11: Analytics PT (8-10h)

**Entrega:** Mapas contextuais + Dashboard insights

### Fase 4: Integrações & UX (Semana 6)
**Duração:** 5-7 dias  
**Prioridade:** MÉDIA

- ✅ Módulo 8: Integrações CRM (6-8h)
- ✅ Módulo 10: Casos de Uso (6-8h)
- ✅ Módulo 12: Formação (4-6h)

**Entrega:** APIs + Receitas + Suporte

### TOTAL ESTIMADO

**Horas Totais:** 90-120 horas (aprox. 12-15 dias de trabalho a tempo inteiro)
**Calendário:** 6 semanas (incluindo testes e revisões)

---

## <a name="dependências"></a>📍 DEPENDÊNCIAS E REQUISITOS

### Dependências Técnicas

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "@mapbox/mapbox-gl-js": "^3.0.0",
    "openai": "^4.20.0",
    "pdf-lib": "^1.17.1",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0"
  }
}
```

### Serviços Externos

1. **CASAFARI API**
   - API Key necessária
   - Endpoints: `/comparables`, `/market-trends`
   - Custo: Consultar plano comercial

2. **OpenAI/Anthropic**
   - GPT-4 para relatórios
   - Claude para prompts longos
   - Custo estimado: $50-100/mês

3. **Mapbox**
   - Conta gratuita até 50k requests/mês
   - Upgrade para $5/mês se necessário

4. **Google Places API** (opcional)
   - Para dados de escolas, transportes
   - $200 crédito mensal gratuito

### Requisitos de Base de Dados

```sql
-- Espaço adicional estimado
ADD COLUMNS: +15 campos PT → +500KB por 10k propriedades
INDEXES: +3 índices → +200KB
TOTAL: <1MB adicional para 10k propriedades
```

---

## <a name="validação"></a>✅ VALIDAÇÃO E TESTES

### Checklist de Validação

#### Módulo 2: Dados PT
- [ ] Migração SQL executada sem erros
- [ ] Tipos TypeScript compilam corretamente
- [ ] Seed data inserido com sucesso
- [ ] Query performance <100ms para filtros PT

#### Módulo 3: Filtros PT
- [ ] Dropdown tipologia funcional (T0-T6+)
- [ ] Filtro certificado energético funcional (A+-F)
- [ ] Autocomplete distritos com >95% precisão
- [ ] Range slider condomínio responde fluido
- [ ] Filtro AL retorna apenas licenciados

#### Módulo 4: IA PT
- [ ] Relatório gerado em <10s
- [ ] Texto em português correto (sem anglicismos)
- [ ] Comparáveis CASAFARI integrados
- [ ] PDF exportado com branding correcto

#### Módulo 5: Dashboard Investidor
- [ ] Cálculo IMI correcto (±0.5%)
- [ ] Cálculo IMT correcto (±0.5%)
- [ ] ROI AL vs Arrendamento comparado
- [ ] Gráficos renderizam correctamente

#### Módulo 6: Mapas PT
- [ ] Camadas contextuais carregam <2s
- [ ] Marcadores metro/comboio corretos
- [ ] Heatmap calibrado por densidade
- [ ] Clique em POI abre info correcta

#### Módulo 7: Fluxo Consultor
- [ ] Modo apresentação fullscreen funcional
- [ ] Argumentário gerado em <5s
- [ ] Templates CPCV/Avaliação corretos
- [ ] Export PDF com logo agência

### Testes de Usabilidade

**Teste Beta com 5 Consultores PT:**

1. **Tarefa 1:** Pesquisar T2 em Lisboa com certificado A+ e condomínio <€150/mês
   - Tempo objetivo: <30s
   - Taxa de sucesso: 100%

2. **Tarefa 2:** Gerar relatório de proprietário com argumentário de preço
   - Tempo objetivo: <2min
   - Taxa de sucesso: 100%

3. **Tarefa 3:** Comparar ROI de 3 imóveis para investidor
   - Tempo objetivo: <5min
   - Taxa de sucesso: 100%

### Métricas de Qualidade

```
COBERTURA DE TESTES: >80%
PERFORMANCE (LCP): <2.5s
ACESSIBILIDADE (WCAG): AA
SEO SCORE: >90
BUGS CRÍTICOS: 0
BUGS MÉDIOS: <5
```

---

## 📝 NOTAS FINAIS

### Próximos Passos Sugeridos

1. **Revisão deste Roadmap**
   - Analisar cada módulo
   - Aprovar/ajustar prioridades
   - Confirmar cronograma

2. **Setup Inicial**
   - Configurar API keys (CASAFARI, OpenAI, Mapbox)
   - Criar branches Git por módulo
   - Preparar ambiente de testes

3. **Kick-off Fase 1**
   - Iniciar com Módulo 2 (Dados PT)
   - Daily standups para alinhamento
   - Revisões ao fim de cada módulo

### Questões para Discussão

1. Prefere implementação faseada ou completa?
2. Algum módulo deve ter prioridade diferente?
3. Quer adicionar/remover funcionalidades?
4. Timeline de 6 semanas é viável?
5. Orçamento disponível para APIs externas?

### Contacto e Suporte

Para dúvidas e esclarecimentos sobre este roadmap, contacte o desenvolvedor responsável pelo projeto.

---

## 🏆 RESUMO EXECUTIVO

**Este roadmap apresenta:**
- ✅ 12 módulos de adaptação PT/BR
- ✅ 4 fases de implementação (6 semanas)
- ✅ 90-120 horas de desenvolvimento
- ✅ Checklist completo de validação
- ✅ Estimativas de custo e dependências

**Benefícios esperados:**
1. Sistema 100% adaptado ao mercado português
2. Workflow otimizado para consultores PT
3. Calculadoras fiscais PT precisas
4. IA a gerar conteúdo nativo PT
5. Integração CASAFARI para comparáveis
6. ROI claro para investidores

**Próxima ação:**  
➡️ Revisar, aprovar e iniciar Fase 1 (Módulo 2 + 3 + 9)

---

*Documento criado em 29/12/2024 para o projeto app-imobiliario-plus-196df*  
*Versão 1.0 - Aguardando aprovação e feedback*

**🚀 Pronto para começar a implementação!**
