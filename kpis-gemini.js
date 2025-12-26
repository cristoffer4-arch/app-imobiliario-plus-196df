// ═══════════════════════════════════════════════════════════
// KPIS GEMINI - Cálculo Dinâmico de KPIs com IA (VERSÃO CORRIGIDA)
// ═══════════════════════════════════════════════════════════

class KPIsGemini {
  constructor() {
    // IMPORTANTE: Usar uma das suas API Keys do Gemini
    // Opção 1: recrutamento3 (AIzaSy...gQz8)
    // Opção 2: App recrutamento (AIzaSy...Fv0Q)
    this.geminiApiKey = process.env.GEMINI_API_KEY; // variável de ambiente do Netlify    this.geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
    this.maxRetries = 3;
  }

  // ═══════════════════════════════════════════════════════════
  // FUNÇÃO PRINCIPAL: CALCULAR KPIS COM GEMINI
  // ═══════════════════════════════════════════════════════════
  async calculateKPIsWithGemini(userId = null) {
    try {
      console.log('[KPIS-GEMINI] 🚀 Iniciando cálculo de KPIs...');

      // Verifica cache
      const cacheKey = `kpis_${userId || 'current'}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        console.log('[KPIS-GEMINI] ⚡ Retornando do cache');
        return cached.data;
      }

      // 1. Buscar atividades do Supabase
      const activities = await this.fetchUserActivities(userId);
      
      if (!activities || activities.length === 0) {
        console.log('[KPIS-GEMINI] ⚠️ Nenhuma atividade encontrada, usando KPIs padrão');
        return this.getDefaultKPIs();
      }

      console.log(`[KPIS-GEMINI] 📊 ${activities.length} atividades encontradas`);

      // 2. Preparar contexto para Gemini
      const context = this.prepareContextForGemini(activities);

      // 3. Enviar para Gemini e obter análise
      const kpis = await this.askGeminiForKPIs(context);

      // 4. Cache resultado
      this.cache.set(cacheKey, {
        data: kpis,
        timestamp: Date.now()
      });

      console.log('[KPIS-GEMINI] ✅ KPIs calculados com sucesso:', kpis);
      return kpis;

    } catch (error) {
      console.error('[KPIS-GEMINI] ❌ Erro ao calcular KPIs:', error);
      return this.getDefaultKPIs();
    }
  }

  // ═══════════════════════════════════════════════════════════
  // BUSCAR ATIVIDADES DO SUPABASE
  // ═══════════════════════════════════════════════════════════
  async fetchUserActivities(userId = null) {
    try {
      // Verificar se Supabase está disponível
      if (!window.supabase) {
        console.warn('[KPIS-GEMINI] Supabase não inicializado');
        return [];
      }

      const { data: { user } } = await window.supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) {
        console.warn('[KPIS-GEMINI] Usuário não autenticado');
        return [];
      }

      // Buscar últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await window.supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', targetUserId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[KPIS-GEMINI] Erro ao buscar atividades:', error);
        return [];
      }

      return data || [];

    } catch (error) {
      console.error('[KPIS-GEMINI] Erro ao buscar atividades:', error);
      return [];
    }
  }

  // ═══════════════════════════════════════════════════════════
  // PREPARAR CONTEXTO PARA GEMINI
  // ═══════════════════════════════════════════════════════════
  prepareContextForGemini(activities) {
    const stats = {
      total: activities.length,
      byType: {},
      propertiesViewed: new Set(),
      visitsScheduled: 0,
      searchesPerformed: 0,
      coachInteractions: 0,
      daysActive: new Set(),
      last7Days: 0,
      last30Days: activities.length
    };

    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    activities.forEach(activity => {
      // Conta por tipo
      const type = activity.activity_type;
      stats.byType[type] = (stats.byType[type] || 0) + 1;

      // Estatísticas específicas
      if (type === 'property_viewed' && activity.property_id) {
        stats.propertiesViewed.add(activity.property_id);
      }
      if (type === 'visit_scheduled') {
        stats.visitsScheduled++;
      }
      if (type === 'search_performed') {
        stats.searchesPerformed++;
      }
      if (type === 'coach_interaction') {
        stats.coachInteractions++;
      }

      // Dias ativos
      const activityDate = new Date(activity.created_at).toDateString();
      stats.daysActive.add(activityDate);

      // Última semana
      if (new Date(activity.created_at) > sevenDaysAgo) {
        stats.last7Days++;
      }
    });

    stats.propertiesViewedCount = stats.propertiesViewed.size;
    stats.daysActiveCount = stats.daysActive.size;

    return stats;
  }

  // ═══════════════════════════════════════════════════════════
  // ENVIAR PARA GEMINI E OBTER KPIS (VERSÃO CORRIGIDA)
  // ═══════════════════════════════════════════════════════════
  async askGeminiForKPIs(context, retryCount = 0) {
    const prompt = `Você é um analista de dados imobiliários especializado. Analise as estatísticas de uso abaixo e calcule KPIs relevantes.

DADOS DO USUÁRIO (últimos 30 dias):
- Total de atividades: ${context.total}
- Imóveis únicos visualizados: ${context.propertiesViewedCount}
- Visitas agendadas: ${context.visitsScheduled}
- Buscas realizadas: ${context.searchesPerformed}
- Interações com Coach IA: ${context.coachInteractions}
- Dias ativos na plataforma: ${context.daysActiveCount}
- Atividades última semana: ${context.last7Days}

Distribuição de atividades:
${JSON.stringify(context.byType, null, 2)}

INSTRUÇÕES CRÍTICAS:
1. Retorne APENAS um objeto JSON válido
2. Não inclua texto explicativo antes ou depois
3. Não use markdown ou code blocks
4. Use apenas números inteiros para scores

FORMATO OBRIGATÓRIO:
{
  "engagementScore": [número 0-100 baseado em frequência e diversidade],
  "buyerIntentScore": [número 0-100 baseado em visitas e visualizações],
  "activePropertiesCount": ${context.propertiesViewedCount},
  "scheduledVisitsCount": ${context.visitsScheduled},
  "averageDailyActivity": [número com 1 decimal],
  "coachUsageRate": [número 0-100 baseado em interações],
  "conversionProbability": [número 0-100 probabilidade de fechar negócio],
  "recommendedActions": ["ação 1", "ação 2", "ação 3"]
}`;

    try {
      console.log('[KPIS-GEMINI] 📤 Enviando requisição para Gemini...');

      // Requisição HTTP CORRIGIDA com todos os headers necessários
      const response = await fetch(`${this.geminiEndpoint}?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'  // HEADER OBRIGATÓRIO!
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.2,
            topK: 1,
            topP: 1,
            maxOutputTokens: 1024,
            stopSequences: []
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE"
            }
          ]
        })
      });

      console.log('[KPIS-GEMINI] 📥 Resposta recebida, status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[KPIS-GEMINI] Erro na resposta:', errorText);
        
        // Retry com backoff exponencial
        if (retryCount < this.maxRetries) {
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(`[KPIS-GEMINI] ⏳ Tentando novamente em ${delay}ms... (tentativa ${retryCount + 1}/${this.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.askGeminiForKPIs(context, retryCount + 1);
        }
        
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Verificar estrutura da resposta
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error('[KPIS-GEMINI] Resposta inválida:', data);
        throw new Error('Resposta do Gemini em formato inválido');
      }

      const text = data.candidates[0].content.parts[0].text;
      console.log('[KPIS-GEMINI] 📝 Texto recebido:', text.substring(0, 200) + '...');
      
      // Extrair JSON da resposta (remove markdown e texto extra)
      let jsonText = text.trim();
      
      // Remove code blocks markdown se houver
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Tenta encontrar o objeto JSON
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[KPIS-GEMINI] JSON não encontrado na resposta:', jsonText);
        throw new Error('JSON não encontrado na resposta do Gemini');
      }

      const kpis = JSON.parse(jsonMatch[0]);
      
      // Validar estrutura dos KPIs
      const requiredFields = ['engagementScore', 'buyerIntentScore', 'activePropertiesCount'];
      const hasRequiredFields = requiredFields.every(field => field in kpis);
      
      if (!hasRequiredFields) {
        console.error('[KPIS-GEMINI] KPIs incompletos:', kpis);
        throw new Error('KPIs retornados estão incompletos');
      }
      
      // Adicionar dados brutos para referência
      kpis.rawStats = {
        totalActivities: context.total,
        propertiesViewed: context.propertiesViewedCount,
        daysActive: context.daysActiveCount,
        lastCalculated: new Date().toISOString()
      };

      console.log('[KPIS-GEMINI] ✅ KPIs processados com sucesso');
      return kpis;

    } catch (error) {
      console.error('[KPIS-GEMINI] ❌ Erro ao consultar Gemini:', error.message);
      
      // Retry se for erro de rede
      if (retryCount < this.maxRetries && (error.message.includes('fetch') || error.message.includes('network'))) {
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`[KPIS-GEMINI] ⏳ Tentando novamente em ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.askGeminiForKPIs(context, retryCount + 1);
      }
      
      throw error;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // KPIS PADRÃO (FALLBACK)
  // ═══════════════════════════════════════════════════════════
  getDefaultKPIs() {
    return {
      engagementScore: 0,
      buyerIntentScore: 0,
      activePropertiesCount: 0,
      scheduledVisitsCount: 0,
      averageDailyActivity: 0.0,
      coachUsageRate: 0,
      conversionProbability: 0,
      recommendedActions: [
        "🏠 Explore mais imóveis disponíveis no catálogo",
        "📅 Agende visitas para conhecer propriedades presencialmente",
        "💬 Use o Coach IA para receber orientação personalizada"
      ],
      rawStats: {
        totalActivities: 0,
        propertiesViewed: 0,
        daysActive: 0,
        lastCalculated: new Date().toISOString()
      }
    };
  }

  // ═══════════════════════════════════════════════════════════
  // ATUALIZAR DASHBOARD COM KPIS
  // ═══════════════════════════════════════════════════════════
  async updateDashboardKPIs() {
    try {
      console.log('[KPIS-GEMINI] 🎨 Atualizando dashboard...');
      
      const kpis = await this.calculateKPIsWithGemini();

      // Atualizar elementos no DOM
      const updates = [
        { selector: '[data-kpi="engagement"]', value: `${kpis.engagementScore}%`, suffix: '' },
        { selector: '[data-kpi="intent"]', value: `${kpis.buyerIntentScore}%`, suffix: '' },
        { selector: '[data-kpi="properties"]', value: kpis.activePropertiesCount, suffix: '' },
        { selector: '[data-kpi="visits"]', value: kpis.scheduledVisitsCount, suffix: '' },
        { selector: '[data-kpi="conversion"]', value: `${kpis.conversionProbability}%`, suffix: '' },
        { selector: '[data-kpi="coach-usage"]', value: `${kpis.coachUsageRate}%`, suffix: '' }
      ];

      let updatedCount = 0;
      updates.forEach(({ selector, value, suffix }) => {
        const element = document.querySelector(selector);
        if (element) {
          element.textContent = value + suffix;
          element.classList.add('kpi-updated');
          updatedCount++;
          
          // Remove animação após 500ms
          setTimeout(() => {
            element.classList.remove('kpi-updated');
          }, 500);
        }
      });

      // Atualizar recomendações
      const recommendationsEl = document.querySelector('[data-kpi="recommendations"]');
      if (recommendationsEl && kpis.recommendedActions) {
        recommendationsEl.innerHTML = kpis.recommendedActions
          .map(action => `<li>${action}</li>`)
          .join('');
      }

      console.log(`[KPIS-GEMINI] ✅ Dashboard atualizado (${updatedCount} KPIs)`);
      
      return kpis;

    } catch (error) {
      console.error('[KPIS-GEMINI] ❌ Erro ao atualizar dashboard:', error);
      
      // Atualizar com valores padrão em caso de erro
      const defaultKpis = this.getDefaultKPIs();
      document.querySelectorAll('[data-kpi]').forEach(el => {
        el.classList.add('kpi-error');
      });
      
      return defaultKpis;
    }
  }

  // ═══════════════════════════════════════════════════════════
  // LIMPAR CACHE
  // ═══════════════════════════════════════════════════════════
  clearCache() {
    this.cache.clear();
    console.log('[KPIS-GEMINI] 🗑️ Cache limpo');
  }

  // ═══════════════════════════════════════════════════════════
  // VERIFICAR SAÚDE DA API
  // ═══════════════════════════════════════════════════════════
  async healthCheck() {
    try {
      const testContext = {
        total: 10,
        propertiesViewedCount: 5,
        visitsScheduled: 2,
        searchesPerformed: 3,
        coachInteractions: 1,
        daysActiveCount: 3,
        last7Days: 8,
        byType: {
          'property_viewed': 5,
          'visit_scheduled': 2,
          'search_performed': 3
        }
      };

      const result = await this.askGeminiForKPIs(testContext);
      console.log('[KPIS-GEMINI] ✅ Health check passou:', result);
      return true;
    } catch (error) {
      console.error('[KPIS-GEMINI] ❌ Health check falhou:', error);
      return false;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// INSTÂNCIA GLOBAL
// ═══════════════════════════════════════════════════════════
window.kpisGemini = new KPIsGemini();

// Log de inicialização
console.log('[KPIS-GEMINI] 🤖 Sistema de KPIs com Gemini AI carregado');

// Health check automático (opcional, pode comentar)
// setTimeout(() => {
//   window.kpisGemini.healthCheck();
// }, 2000);
