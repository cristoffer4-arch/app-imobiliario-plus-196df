// Supabase Configuration
// IMPORTANTE: Estas chaves são públicas e seguras para uso no frontend
// devido às RLS policies configuradas no Supabase

const SUPABASE_CONFIG = {
    url: 'https://ebuktnhikkttcmxrbbhk.supabase.co',
    anonKey: 'sb_publishable_bx06I2UQutZpV8zsb4S2yw_3KtKiKt8'
};

// Google Gemini Configuration
// NOTA: API Key deve ser configurada em variáveis de ambiente no Netlify
// Por segurança, vamos usar Edge Functions do Supabase para chamar o Gemini
const GEMINI_CONFIG = {
    // A chave será armazenada no Supabase Vault (secrets)
    // e acessada via Edge Functions
    model: 'gemini-pro',
    temperature: 0.7,
    maxTokens: 1024
};

// Supabase Client Service
class SupabaseService {
    constructor() {
        // Inicializar cliente Supabase
        // Nota: import { createClient } from '@supabase/supabase-js'
        // Por enquanto, usaremos fetch direto para o MVP
        this.baseURL = SUPABASE_CONFIG.url;
        this.anonKey = SUPABASE_CONFIG.anonKey;
        this.currentUser = null;
    }

    // Autenticação
    async signUp(email, password, fullName) {
        try {
            const response = await fetch(`${this.baseURL}/auth/v1/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.anonKey
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.user) {
                // Criar perfil do usuário
                await this.createUserProfile(data.user.id, fullName, email);
                this.currentUser = data.user;
            }
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Erro no signup:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': this.anonKey
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.access_token) {
                localStorage.setItem('supabase_token', data.access_token);
                localStorage.setItem('supabase_refresh_token', data.refresh_token);
                this.currentUser = data.user;
                return { success: true, user: data.user, token: data.access_token };
            }
            
            return { success: false, error: 'Credenciais inválidas' };
        } catch (error) {
            console.error('Erro no login:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        localStorage.removeItem('supabase_token');
        localStorage.removeItem('supabase_refresh_token');
        this.currentUser = null;
        return { success: true };
    }

    getToken() {
        return localStorage.getItem('supabase_token');
    }

    // CRUD Profiles
    async createUserProfile(userId, fullName, email) {
        const token = this.getToken();
        
        const response = await fetch(`${this.baseURL}/rest/v1/user_profiles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.anonKey,
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                full_name: fullName,
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}`,
                onboarding_completed: false
            })
        });
        
        return await response.json();
    }

    async getUserProfile(userId) {
        const token = this.getToken();
        
        const response = await fetch(`${this.baseURL}/rest/v1/user_profiles?user_id=eq.${userId}`, {
            headers: {
                'apikey': this.anonKey,
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        return data[0] || null;
    }

    // KPIs
    async getUserKPIs(userId, periodStart) {
        const token = this.getToken();
        
        const response = await fetch(
            `${this.baseURL}/rest/v1/user_kpis?user_id=eq.${userId}&period_start=eq.${periodStart}`,
            {
                headers: {
                    'apikey': this.anonKey,
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        
        return await response.json();
    }

        async saveUserProfile(profileData) {
        const token = this.getToken();
        
        if (!this.currentUser) {
            console.error('Nenhum usuário autenticado');
            return { success: false, error: 'Usuário não autenticado' };
        }
        
        try {
            const response = await fetch(
                `${this.baseURL}/rest/v1/user_profiles?user_id=eq.${this.currentUser.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': this.anonKey,
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(profileData)
                }
            );
            
            if (!response.ok) {
                throw new Error(`Erro ao salvar perfil: ${response.status}`);
            }
            
            return { success: true };
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            return { success: false, error: error.message };
        }
    }

    async updateKPIs(userId, periodStart, kpis) {
        const token = this.getToken();
        
        const response = await fetch(`${this.baseURL}/rest/v1/user_kpis`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': this.anonKey,
                'Authorization': `Bearer ${token}`,
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
                user_id: userId,
                period_start: periodStart,
                period_end: new Date().toISOString().split('T')[0],
                ...kpis
            })
        });
        
        return await response.json();
    }
}

// Gemini AI Service
class GeminiService {
    constructor() {
        this.model = GEMINI_CONFIG.model;
    }

    // Chamar Gemini via Edge Function do Supabase
    async generateCoachingResponse(userMessage, context) {
        const token = localStorage.getItem('supabase_token');
        
        try {
            const response = await fetch(
                `${SUPABASE_CONFIG.url}/functions/v1/ai-coaching`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        message: userMessage,
                        context: context // KPIs, DISC profile, etc.
                    })
                }
            );
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao chamar Gemini:', error);
            // Fallback: resposta simulada
            return this.getFallbackResponse(userMessage);
        }
    }

    getFallbackResponse(userMessage) {
        const responses = [
            'Entendo sua questão. Vamos analisar seus KPIs juntos.',
            'Baseado no seu perfil DISC, recomendo focar em...',
            'Excelente! Vejo que você está progredindo bem.',
            'Sugiro criar um plano de ação para aumentar suas visitas.',
            'Vamos trabalhar na sua proposta de valor para clientes.'
        ];
        return {
            response: responses[Math.floor(Math.random() * responses.length)],
            suggestions: [
                'Revisar KPIs da semana',
                'Agendar mais visitas',
                'Qualificar leads'
            ]
        };
    }
}

// Exportar instâncias
const supabaseService = new SupabaseService();
const geminiService = new GeminiService();

// Tornar disponível globalmente (para uso no app.js)
window.supabaseService = supabaseService;
window.geminiService = geminiService;
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.GEMINI_CONFIG = GEMINI_CONFIG;
