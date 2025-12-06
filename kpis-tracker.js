// ═══════════════════════════════════════════════════════════
// KPIS TRACKER - Sistema de Tracking de Atividades
// ═══════════════════════════════════════════════════════════

class KPIsTracker {
  constructor() {
    this.supabaseUrl = 'https://ebuktnhikkttcmxrbbhk.supabase.co';
    this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidWt0bmhpa2t0dGNteHJiYmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1MTA4MjgsImV4cCI6MjA0OTA4NjgyOH0.sb_publishable_bx06I2UQutZpV8zsb452yw_3KtKiKt8';
    this.pendingActivities = [];
    this.initialized = false;
  }

  // ═══════════════════════════════════════════════════════════
  // INICIALIZAÇÃO
  // ═══════════════════════════════════════════════════════════
  async init() {
    if (this.initialized) return;
    
    try {
      // Verifica se Supabase client está disponível
      if (typeof window.supabase === 'undefined') {
        console.warn('[TRACKER] Supabase não carregado ainda, aguardando...');
        setTimeout(() => this.init(), 1000);
        return;
      }

      this.initialized = true;
      console.log('[TRACKER] ✅ Sistema de tracking inicializado');

      // Processa atividades pendentes
      if (this.pendingActivities.length > 0) {
        console.log(`[TRACKER] Processando ${this.pendingActivities.length} atividades pendentes`);
        for (const activity of this.pendingActivities) {
          await this.trackActivity(activity.type, activity.data, activity.propertyId);
        }
        this.pendingActivities = [];
      }

      // Track acesso ao dashboard
      this.trackActivity('dashboard_accessed', {
        url: window.location.href,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('[TRACKER] Erro ao inicializar:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // FUNÇÃO PRINCIPAL: REGISTRAR ATIVIDADE
  // ═══════════════════════════════════════════════════════════
  async trackActivity(activityType, data = {}, propertyId = null) {
    try {
      // Se não inicializado, adiciona à fila
      if (!this.initialized) {
        this.pendingActivities.push({ type: activityType, data, propertyId });
        console.log('[TRACKER] Atividade adicionada à fila:', activityType);
        return;
      }

      // Verifica autenticação
      const { data: { user }, error: authError } = await window.supabase.auth.getUser();
      
      if (authError || !user) {
        console.warn('[TRACKER] Usuário não autenticado, atividade não registrada');
        return;
      }

      // Prepara payload
      const payload = {
        user_id: user.id,
        activity_type: activityType,
        property_id: propertyId,
        metadata: {
          ...data,
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          timestamp: new Date().toISOString()
        }
      };

      // Insere no Supabase
      const { data: result, error } = await window.supabase
        .from('user_activities')
        .insert([payload])
        .select();

      if (error) {
        console.error('[TRACKER] Erro ao registrar atividade:', error);
        return;
      }

      console.log(`[TRACKER] ✅ Atividade registrada: ${activityType}`, result);

    } catch (error) {
      console.error('[TRACKER] Erro ao processar tracking:', error);
    }
  }

  // ═══════════════════════════════════════════════════════════
  // HELPERS: TRACKING DE EVENTOS ESPECÍFICOS
  // ═══════════════════════════════════════════════════════════
  
  trackPropertyView(propertyId, propertyData = {}) {
    this.trackActivity('property_viewed', {
      property_title: propertyData.title || 'N/A',
      property_price: propertyData.price || 0,
      property_location: propertyData.location || 'N/A'
    }, propertyId);
  }

  trackVisitSchedule(propertyId, visitData = {}) {
    this.trackActivity('visit_scheduled', {
      visit_date: visitData.date || new Date().toISOString(),
      visit_time: visitData.time || 'N/A',
      property_title: visitData.propertyTitle || 'N/A'
    }, propertyId);
  }

  trackSearch(query, filters = {}) {
    this.trackActivity('search_performed', {
      search_query: query,
      filters_applied: filters,
      results_count: filters.resultsCount || 0
    });
  }

  trackFilterApplied(filterType, filterValue) {
    this.trackActivity('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue
    });
  }

  trackCoachInteraction(messageType, messageContent = '') {
    this.trackActivity('coach_interaction', {
      message_type: messageType,
      message_preview: messageContent.substring(0, 100),
      interaction_time: new Date().toISOString()
    });
  }

  // ═══════════════════════════════════════════════════════════
  // OBTER ESTATÍSTICAS DO USUÁRIO
  // ═══════════════════════════════════════════════════════════
  async getUserStats(userId = null) {
    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      const targetUserId = userId || user?.id;

      if (!targetUserId) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await window.supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Agrupa por tipo
      const stats = {
        total: data.length,
        byType: {},
        last7Days: 0,
        last30Days: 0
      };

      const now = new Date();
      const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

      data.forEach(activity => {
        // Conta por tipo
        stats.byType[activity.activity_type] = (stats.byType[activity.activity_type] || 0) + 1;

        // Conta por período
        const activityDate = new Date(activity.created_at);
        if (activityDate > sevenDaysAgo) stats.last7Days++;
        if (activityDate > thirtyDaysAgo) stats.last30Days++;
      });

      return stats;

    } catch (error) {
      console.error('[TRACKER] Erro ao obter estatísticas:', error);
      return null;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// INSTÂNCIA GLOBAL
// ═══════════════════════════════════════════════════════════
window.kpisTracker = new KPIsTracker();

// Auto-inicialização quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.kpisTracker.init();
  });
} else {
  window.kpisTracker.init();
}
