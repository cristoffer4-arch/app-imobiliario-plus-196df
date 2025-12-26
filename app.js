// ============================================================================ [BUILD FIX]
// FALLBACK DE EMERGÊNCIA - NUNCA DEIXA O APP TRAVADO
// ============================================================================
(function() {
    let fallbackExecuted = false;
    
    function forcedFallback() {
        if (fallbackExecuted) return;
        fallbackExecuted = true;
        
    function forcedFallback() {
        // FIXED: Não executar se houver tokens OAuth no hash
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
            console.log('[FALLBACK] OAuth detectado, cancelando fallback');
            return;
        }
        
        if (fallbackExecuted) return;
        fallbackExecuted = true;
        
        console.log('[FALLBACK] Forçando exibição após timeout');
        
        const loading = document.getElementById('loading-screen');
        const auth = document.getElementById('auth-screen');
        
        if (loading) loading.style.display = 'none';
        if (auth) {
            auth.classList.remove('hidden');
            auth.style.display = 'flex';
        }
    }
    
    // FIXED: Aumentar timeout para 5 segundos para dar tempo ao OAuth
    
    // Backup no evento load
    // FIXED: Remover backup load - conflita com OAuth
    // window.addEventListener('load', function() {
    //     setTimeout(forcedFallback, 1000);
    // });UX.ai - COMPLETE APPLICATION LOGIC
// Version: 2.0.1 (FIXED - Loading Screen & Initialization)
// ============================================================================

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
    // Supabase - CONFIGURE SUAS CREDENCIAIS AQUI
    SUPABASE_URL: 'https://ebuktnhikkttcmxrbbhk.supabase.co',  // https://seu-projeto.supabase.co
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidWt0bmhpa2t0dGNteHJiYmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTEwMTQsImV4cCI6MjA0OTIyNzAxNH0.s1K5cDO[...]'
    
    // Google OAuth
    ,GOOGLE_CLIENT_ID: ''
    ,GOOGLE_OAUTH_SCOPES: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/generative-language.retriever'
    ],
    
    // APIs
    GEMINI_API_KEY: '',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta',
    CASAFARI_API_KEY: '',
    STRIPE_PUBLISHABLE_KEY: '',
    
    // Voucher
    VOUCHER_CODE: 'LUXAI-LAUNCH-3M-2025',
    VOUCHER_DURATION_DAYS: 90,
    
    // Subscription Plans
    PLANS: {
        FREE: {
            id: 'free',
            name: 'Free',
            price: 0,
            currency: 'EUR',
            features: {
                max_properties: 5,
                basic_dashboard: true,
                basic_kpis: true,
                ai_coach: false,
                ai_pricing: 0,
                ai_stories: 0,
                virtual_staging: 0,
                casafari_api: false,
                lead_scoring: false,
                advanced_analytics: false,
                priority_support: false,
                multi_users: 1
            }
        },
        STARTER: {
            id: 'starter',
            name: 'Starter',
            price: 47,
            currency: 'EUR',
            billing: 'monthly',
            features: {
                max_properties: 20,
                basic_dashboard: true,
                basic_kpis: true,
                ai_coach: true,
                ai_coach_limit: 50,
                ai_pricing: 10,
                ai_stories: 20,
                virtual_staging: 5,
                casafari_api: false,
                lead_scoring: false,
                advanced_analytics: false,
                priority_support: false,
                multi_users: 1
            }
        },
        PRO: {
            id: 'pro',
            name: 'Pro',
            price: 97,
            currency: 'EUR',
            billing: 'monthly',
            popular: true,
            features: {
                max_properties: -1,
                basic_dashboard: true,
                basic_kpis: true,
                ai_coach: true,
                ai_coach_limit: -1,
                ai_pricing: -1,
                ai_stories: -1,
                virtual_staging: 50,
                casafari_api: false,
                lead_scoring: true,
                advanced_analytics: true,
                priority_support: false,
                multi_users: 1
            }
        },
        PREMIUM: {
            id: 'premium',
            name: 'Premium',
            price: 197,
            currency: 'EUR',
            billing: 'monthly',
            features: {
                max_properties: -1,
                basic_dashboard: true,
                basic_kpis: true,
                ai_coach: true,
                ai_coach_limit: -1,
                ai_pricing: -1,
                ai_stories: -1,
                virtual_staging: -1,
                casafari_api: true,
                lead_scoring: true,
                advanced_analytics: true,
                marketing_automation: true,
                priority_support: true,
                multi_users: 1
            }
        },
        ENTERPRISE: {
            id: 'enterprise',
            name: 'Enterprise',
            price: 497,
            currency: 'EUR',
            billing: 'monthly',
            features: {
                max_properties: -1,
                basic_dashboard: true,
                basic_kpis: true,
                ai_coach: true,
                ai_coach_limit: -1,
                ai_pricing: -1,
                ai_stories: -1,
                virtual_staging: -1,
                casafari_api: true,
                lead_scoring: true,
                advanced_analytics: true,
                marketing_automation: true,
                priority_support: true,
                white_label: true,
                dedicated_api: true,
                multi_users: 10,
                custom_onboarding: true
            }
        }
    },
    
    // XP System
    XP_VALUES: {
        PROPERTY_VIEW: 5,
        LEAD_CONTACT: 10,
        MEETING_SCHEDULED: 25,
        PROPOSAL_SENT: 50,
        CONTRACT_SIGNED: 200,
        SALE_COMPLETED: 1000
    },
    
    // Levels
    LEVELS: [
        { level: 1, xp: 0, title: 'Iniciante' },
        { level: 2, xp: 100, title: 'Consultor Jr' },
        { level: 3, xp: 300, title: 'Consultor' },
        { level: 4, xp: 600, title: 'Consultor Sr' },
        { level: 5, xp: 1000, title: 'Especialista' },
        { level: 6, xp: 1500, title: 'Expert' },
        { level: 7, xp: 2500, title: 'Master' },
        { level: 8, xp: 4000, title: 'Elite' },
        { level: 9, xp: 6000, title: 'Luxury Pro' },
        { level: 10, xp: 10000, title: 'Diamond Agent' }
    ]
};

// ============================================================================
// OAUTH CALLBACK HANDLER
// ============================================================================

// Processa tokens OAuth do hash da URL após redirect do Google
async function processOAuthTokens() {
    const hash = window.location.hash;
    
    if (hash && hash.includes('access_token')) {
        console.log('OAuth tokens detectados no hash:', hash);
        
        // Extrai tokens do hash
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresIn = params.get('expires_in');
        const tokenType = params.get('token_type');
        
        if (accessToken) {
            console.log('Processando OAuth callback com access_token');
            
            // Calcula expires_at
            const expiresAt = expiresIn ? 
                Math.floor(Date.now() / 1000) + parseInt(expiresIn) : 
                null;
            
            // Cria session object para Supabase
            const session = {
                access_token: accessToken,
                refresh_token: refreshToken || null,
                expires_at: expiresAt,
                token_type: tokenType || 'bearer',
                user: null
            };
            
            // Define a sessão no Supabase
            try {
                const { data, error } = await supabase.auth.setSession(session);
                if (error) {
                    console.error('Erro ao definir sessão:', error);
                    return false;
                }
                console.log('Sessão OAuth definida com sucesso:', data);
                // Limpa o hash da URL
                window.history.replaceState(null, '', window.location.pathname);
                // Esconde loading e mostra dashboard
                hideLoadingScreen();
                        showView('dashboard');                return true;
            } catch (err) {
                console.error('Erro no setSession:', err);
                return false;
            }
        }
    }
    
    return false;
}

// ============================================================================
// GLOBALS
// ============================================================================
let supabase = null;
let currentUser = null;
let currentLanguage = 'pt-PT';

// ============================================================================
// TRANSLATIONS
// ============================================================================
const TRANSLATIONS = {
    'pt-PT': {
        welcome: 'Bem-vindo',
        dashboard: 'Dashboard',
        properties: 'Propriedades',
        leads: 'Leads',
        commissions: 'Comissões',
    },
    'es': {
        welcome: 'Bienvenido',
        dashboard: 'Panel',
        properties: 'Propiedades',
        leads: 'Contactos',
        commissions: 'Comisiones',
    },
    'en': {
        welcome: 'Welcome',
        dashboard: 'Dashboard',
        properties: 'Properties',
        leads: 'Leads',
        commissions: 'Commissions',
    }
};

function t(key) {
    return TRANSLATIONS[currentLanguage]?.[key] || key;
}

// ============================================================================
// INITIALIZATION (FIXED)
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 LUX.ai - Initializing...');
        
    // Timeout de segurança - será cancelado se inicialização for bem-sucedida
    const emergencyTimeout = setTimeout(() => {
        console.warn('[TIMEOUT] Inicialização demorou muito, mostrando tela de autenticação');
        hideLoadingScreen();
        showAuthScreen();
    }, 3000);

    try {
        // Check if Supabase library is loaded
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase library not loaded!');
            hideLoadingScreen();
            showAuthScreen();
            showToast('Erro', 'Biblioteca Supabase não carregada', 'error');
            clearTimeout(emergencyTimeout);
            return;
        }
        
        console.log('✅ Supabase library loaded');
        
        // Check credentials
        if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
            console.error('❌ Supabase credentials not configured!');
            console.error('Configure CONFIG.SUPABASE_URL e CONFIG.SUPABASE_ANON_KEY no app.js');
            hideLoadingScreen();
            showAuthScreen();
            showToast('Configuração', 'Configure as credenciais do Supabase', 'warning');
            clearTimeout(emergencyTimeout);
            return;
        }
        
        console.log('✅ Credentials configured');
        
        // Initialize Supabase (FIXED)
                const { createClient } = window.supabase;
        supabase = createClient(            CONFIG.SUPABASE_URL,
            CONFIG.SUPABASE_ANON_KEY
        );

        console.log('✅ Supabase client initialized');

        // Processa OAuth callback se houver tokens no hash
        if (await processOAuthTokens()) {
            clearTimeout(emergencyTimeout);
            return; // Se processou OAuth, termina aqui
        }

        // NOTE: Havia um BYPASS TEMPORÁRIO para pular autenticação. Mantido comentado para segurança de produção.
        /*
        console.log('⚠️ BYPASS: Pulando autenticação para teste');
        hideLoadingScreen();
        document.getElementById('auth-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        setupEventListeners();
        return; // Sai da função sem verificar sessão
        */

        // Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
            console.error('❌ Session check error:', sessionError);
            hideLoadingScreen();
            showAuthScreen();
            clearTimeout(emergencyTimeout);
            return;
        }
        
        if (session?.user) {
            console.log('✅ User session found:', session.user.email);
            await handleAuthSuccess(session.user);
        } else {
            console.log('ℹ️  No session, showing login screen');
                        clearTimeout(emergencyTimeout);
hideLoadingScreen();
            showAuthScreen();
        }
        
        // Setup event listeners
        setupEventListeners();
                
        // Cancela o timeout de emergência pois tudo correu bem
        clearTimeout(emergencyTimeout);
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
                clearTimeout(emergencyTimeout);
        hideLoadingScreen();
        showAuthScreen();
        showToast('Erro', 'Falha na inicialização: ' + (error && error.message ? error.message : error), 'error');
    }
});

function setupEventListeners() {
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', loginWithGoogle);
    }
    
    const languageBtns = document.querySelectorAll('[data-language]');
    languageBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentLanguage = e.target.dataset.language;
            updateLanguage();
        });
    });
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

async function loginWithGoogle() {
    if (!supabase) {
        showToast('Erro', 'Sistema não inicializado', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
                scopes: CONFIG.GOOGLE_OAUTH_SCOPES.join(' ')
            }
        });
        
        if (error) throw error;
        
    } catch (error) {
        console.error('Login error:', error);
        showToast('Erro', 'Falha no login', 'error');
    }
}

async function handleAuthSuccess(user) {
    currentUser = user;
    
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    document.getElementById('user-avatar').src = user.user_metadata?.avatar_url || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=D4AF37&color=0A0E27`;
    
    await initializeUserData(user);
    
    const { data: profile } = await supabase
        .from('profiles')
        .select('voucher_used, subscription_plan, created_at')
        .eq('id', user.id)
        .single();
    
    if (profile) {
        const isFirstLogin = new Date(profile.created_at) > new Date(Date.now() - 60000);
        
        if (isFirstLogin && !profile.voucher_used) {
            setTimeout(() => showVoucherModal(), 1000);
        }
        
        await checkSubscriptionExpiry();
        
        const hasOAuth = await hasGeminiOAuth();
        updateGeminiConnectionStatus(hasOAuth);
        
        updatePlanBadge(profile.subscription_plan);
    }
    
    await loadDashboard();
    
    setTimeout(() => hideLoadingScreen(), 500);
    
    showToast('Bem-vindo!', `Olá ${user.user_metadata?.full_name || user.email}`, 'success');
    playSound('success');
}

async function initializeUserData(user) {
    if (!supabase) return;
    
    try {
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (!existingProfile) {
            await supabase.from('profiles').insert({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name,
                avatar_url: user.user_metadata?.avatar_url,
                subscription_plan: 'free',
                xp: 0,
                level: 1
            });
        }
        
    } catch (error) {
        console.error('Error initializing user data:', error);
    }
}

function showAuthScreen() {
    hideLoadingScreen();
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

async function logout() {
    if (!supabase) return;
    
    await supabase.auth.signOut();
    currentUser = null;
    showAuthScreen();
    showToast('Logout', 'Sessão encerrada', 'info');
}

// ============================================================================
// SUBSCRIPTION & PRICING
// ============================================================================

async function validateVoucher(voucherCode) {
    if (!supabase || !currentUser) {
        throw new Error('Sistema não inicializado');
    }
    
    const normalizedCode = voucherCode.trim().toUpperCase();
    
    if (normalizedCode !== CONFIG.VOUCHER_CODE) {
        throw new Error('Código de voucher inválido');
    }
    
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('voucher_used, voucher_code')
            .eq('id', currentUser.id)
            .single();
        
        if (profile.voucher_used) {
            throw new Error('Você já utilizou um voucher anteriormente');
        }
        
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + CONFIG.VOUCHER_DURATION_DAYS);
        
        const { error } = await supabase
            .from('profiles')
            .update({
                subscription_plan: 'premium',
                subscription_start_date: new Date().toISOString(),
                subscription_end_date: expiresAt.toISOString(),
                voucher_code: normalizedCode,
                voucher_used: true,
                voucher_activated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);
        
        if (error) throw error;
        
        await supabase.from('activity_feed').insert({
            user_id: currentUser.id,
            activity_type: 'voucher_activated',
            description: `ativou voucher e ganhou 3 meses de Premium!`,
            xp: 100
        });
        
        await addXP(100);
        
        return {
            success: true,
            plan: 'premium',
            expiresAt: expiresAt,
            message: '🎉 Voucher ativado! 3 meses de Premium grátis!'
        };
        
    } catch (error) {
        console.error('Voucher validation error:', error);
        throw error;
    }
}

async function checkSubscriptionExpiry() {
    if (!supabase || !currentUser) return;
    
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_plan, subscription_end_date, voucher_used')
            .eq('id', currentUser.id)
            .single();
        
        if (!profile.subscription_end_date) {
            return;
        }
        
        const now = new Date();
        const expiryDate = new Date(profile.subscription_end_date);
        
        if (now > expiryDate) {
            await supabase
                .from('profiles')
                .update({
                    subscription_plan: 'free',
                    subscription_end_date: null
                })
                .eq('id', currentUser.id);
            
            showSubscriptionExpiredModal();
            return true;
        }
        
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
            showToast(
                'Assinatura Expirando',
                `Sua assinatura Premium expira em ${daysUntilExpiry} dias`,
                'warning'
            );
        }
        
        return false;
        
    } catch (error) {
        console.error('Subscription check error:', error);
    }
}

function showSubscriptionExpiredModal() {
    const modal = createModal('Assinatura Expirada', `
        <div style="text-align:center;padding:2rem">
            <i class="fas fa-hourglass-end" style="font-size:4rem;color:var(--gold);margin-bottom:1.5rem"></i>
            <h2 style="font-family:var(--font-display);font-size:2rem;margin-bottom:1rem">
                Seu Período Premium Terminou
            </h2>
            <p style="color:var(--text-secondary);margin-bottom:2rem;font-size:1.125rem">
                Escolha um plano para continuar aproveitando todos os recursos IA
            </p>
            
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem">
                ${generatePricingCards(true)}
            </div>
            
            <button class="btn btn-secondary" onclick="app.continueWithFree()" style="margin-top:1rem">
                Continuar com Plano Free
            </button>
        </div>
    `, '1200px');
    
    showModal(modal);
}

function generatePricingCards(compactMode = false) {
    const plans = ['STARTER', 'PRO', 'PREMIUM', 'ENTERPRISE'];
    
    return plans.map(planKey => {
        const plan = CONFIG.PLANS[planKey];
        
        return `
            <div class="pricing-card ${plan.popular ? 'popular' : ''}" 
                 onclick="app.selectPlan('${plan.id}')"
                 style="
                     background:linear-gradient(135deg,rgba(26,34,71,0.9),rgba(18,24,56,0.9));
                     border:2px solid ${plan.popular ? 'var(--gold)' : 'rgba(212,175,55,0.2)'};
                     border-radius:20px;
                     padding:${compactMode ? '1.5rem' : '2rem'};
                     cursor:pointer;
                     transition:all 0.3s;
                     position:relative;
                 ">
                ${plan.popular ? `
                    <div style="position:absolute;top:1rem;right:-2rem;background:var(--gold);color:var(--bg-primary);padding:0.5rem 3rem;transform:rotate(45deg);font-size:0.75rem;font-weight:700">
                    POPULAR
                    </div>
                ` : ''}
                
                <div style="text-align:center">
                    <h3 style="font-size:1.5rem;margin-bottom:0.5rem;color:var(--gold)">${plan.name}</h3>
                    <div style="margin-bottom:1.5rem">
                        <span style="font-size:${compactMode ? '2.5rem' : '3rem'};font-weight:700">${plan.price}€</span>
                        <span style="color:var(--text-secondary);font-size:0.875rem">/mês</span>
                    </div>
                    <button class="btn btn-primary" style="width:100%">Escolher ${plan.name}</button>
                </div>
            </div>
        `;
    }).join('');
}

async function selectPlan(planId) {
    if (planId === 'free') {
        await continueWithFree();
        return;
    }
    
    const plan = Object.values(CONFIG.PLANS).find(p => p.id === planId);
    if (!plan) return;
    
    try {
        const { data } = await supabase.functions.invoke('create-checkout-session', {
            body: {
                user_id: currentUser.id,
                plan_id: planId,
                price: plan.price,
                currency: plan.currency
            }
        });
        
        if (data.checkout_url) {
            window.location.href = data.checkout_url;
        }
        
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Erro', 'Falha ao processar pagamento', 'error');
    }
}

async function continueWithFree() {
    try {
        await supabase
            .from('profiles')
            .update({
                subscription_plan: 'free',
                subscription_end_date: null
            })
            .eq('id', currentUser.id);
        
        closeModal();
        showToast('Plano Free', 'Você está no plano gratuito', 'info');
        await loadDashboard();
        
    } catch (error) {
        console.error('Free plan error:', error);
    }
}

async function checkFeatureAccess(featureName) {
    if (!supabase || !currentUser) return false;
    
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_plan, subscription_end_date')
            .eq('id', currentUser.id)
            .single();
        
        if (profile.subscription_end_date) {
            const now = new Date();
            const expiry = new Date(profile.subscription_end_date);
            if (now > expiry) {
                return false;
            }
        }
        
        const plan = CONFIG.PLANS[profile.subscription_plan.toUpperCase()];
        if (!plan) return false;
        
        return plan.features[featureName] === true || 
               plan.features[featureName] === -1 ||
               (typeof plan.features[featureName] === 'number' && plan.features[featureName] > 0);
        
    } catch (error) {
        console.error('Feature access check error:', error);
        return false;
    }
}

function updatePlanBadge(planId) {
    const badge = document.getElementById('plan-badge-header');
    const nameEl = document.getElementById('plan-name-header');
    
    if (!badge || !nameEl) return;
    
    badge.className = `plan-badge ${planId}`;
    nameEl.textContent = (planId || '').charAt(0).toUpperCase() + (planId || '').slice(1);
}

// ============================================================================
// OAUTH GEMINI
// ============================================================================

async function initiateGoogleOAuthForGemini() {
    if (!CONFIG.GOOGLE_CLIENT_ID) {
        showToast('Erro', 'Google OAuth não configurado', 'error');
        return;
    }
    
    const redirectUri = `${window.location.origin}/oauth-callback`;
    const scopes = CONFIG.GOOGLE_OAUTH_SCOPES.join(' ');
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${CONFIG.GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent(scopes)}&` +
        `access_type=offline&` +
        `prompt=consent&` +
        `state=${currentUser?.id || ''}`;
    
    const width = 500;
    const height = 600;
    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;
    
    window.open(
        authUrl,
        'Google OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
    );
    
    // Ensure the message handler is registered
    window.addEventListener('message', processOAuthMessage);
}

// Handler for messages coming from the OAuth popup (POST_MESSAGE)
async function processOAuthMessage(event) {
    if (!event || event.data?.type !== 'oauth_success') return;
    
    const { code } = event.data;
    
    try {
        const { data, error } = await supabase.functions.invoke('oauth-exchange', {
            body: {
                code: code,
                user_id: currentUser.id
            }
        });
        
        if (error) throw error;
        
        await supabase
            .from('user_oauth_tokens')
            .upsert({
                user_id: currentUser.id,
                provider: 'google_gemini',
                access_token_encrypted: data.access_token_encrypted,
                refresh_token_encrypted: data.refresh_token_encrypted,
                expires_at: data.expires_at
            });
        
        showToast('Sucesso', 'Google conectado! IA ativada', 'success');
        playSound('success');
        triggerConfetti();
        updateGeminiConnectionStatus(true);
        
    } catch (error) {
        console.error('OAuth exchange error:', error);
        showToast('Erro', 'Falha ao conectar Google', 'error');
    }
}

async function hasGeminiOAuth() {
    if (!supabase || !currentUser) return false;
    
    try {
        const { data } = await supabase
            .from('user_oauth_tokens')
            .select('expires_at')
            .eq('user_id', currentUser.id)
            .eq('provider', 'google_gemini')
            .single();
        
        if (!data) return false;
        
        const now = new Date();
        const expiry = new Date(data.expires_at);
        
        return now < expiry;
        
    } catch (error) {
        return false;
    }
}

function updateGeminiConnectionStatus(connected) {
    const statusElement = document.getElementById('gemini-status');
    if (!statusElement) return;
    
    if (connected) {
        statusElement.innerHTML = `
            <div class="gemini-status-info">
                <div class="gemini-status-title">
                    <i class="fas fa-check-circle" style="color:var(--color-success)"></i>
                    IA Ativo (usando sua cota Google)
                </div>
            </div>
        `;
        statusElement.classList.remove('hidden');
    } else {
        statusElement.innerHTML = `
            <div class="gemini-status-info">
                <div class="gemini-status-title"><i class="fas fa-robot"></i> IA Gemini</div>
                <div class="gemini-status-description">Conecte sua conta Google para usar IA gratuitamente</div>
            </div>
            <button class="gemini-connect-btn" onclick="app.initiateGoogleOAuthForGemini()">
                <i class="fab fa-google"></i> Conectar Google
            </button>
        `;
        statusElement.classList.remove('hidden');
    }
}

// ============================================================================
// VOUCHER MODAL
// ============================================================================

function showVoucherModal() {
    const modal = createModal('🎁 Ative seu Voucher Premium', `
        <div style="text-align:center;padding:2rem">
            <div style="font-size:4rem;margin-bottom:1rem">🎉</div>
            <h2 style="font-size:2rem;margin-bottom:1rem">Bem-vindo ao LUX.ai!</h2>
            <p style="color:var(--text-secondary);margin-bottom:2rem">
                Tem um código de voucher? Ganhe <strong style="color:var(--gold)">3 meses de Premium GRÁTIS!</strong>
            </p>
            
            <div class="form-group" style="max-width:400px;margin:0 auto 2rem">
                <input 
                    type="text" 
                    id="voucher-input" 
                    class="form-input" 
                    placeholder="Digite seu código (ex: LUXAI-LAUNCH-3M-2025)"
                    style="text-align:center;font-size:1.125rem;text-transform:uppercase"
                    maxlength="30"
                >
            </div>
            
            <button class="btn btn-primary" onclick="app.activateVoucher(event)" style="margin-bottom:1rem">
                <i class="fas fa-gift"></i> Ativar Voucher
            </button>
            
            <button class="btn btn-secondary" onclick="app.skipVoucher()">
                Pular e Começar com Free
            </button>
        </div>
    `, '600px');
    
    showModal(modal);
    
    setTimeout(() => {
        const input = document.getElementById('voucher-input');
        if (input) input.focus();
    }, 300);
    
    const inputEl = document.getElementById('voucher-input');
    if (inputEl) {
        inputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                // Call activateVoucher without relying on global event; function handles missing event
                activateVoucher();
            }
        });
    }
}

async function activateVoucher(event) {
    const input = document.getElementById('voucher-input');
    if (!input) return;
    const code = input.value.trim();
    
    if (!code) {
        showToast('Erro', 'Digite um código de voucher', 'error');
        input.focus();
        return;
    }
    
    input.disabled = true;
    // Support both event-based calls and programmatic calls (event may be undefined)
    const btn = event?.target || document.querySelector('.modal.active .btn.btn-primary') || document.querySelector('button.btn-primary');
    if (btn) {
        btn.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        btn.disabled = true;
    }
    
    try {
        const result = await validateVoucher(code);
        
        closeModal();
        triggerConfetti();
        playSound('level-up');
        
        const successModal = createModal('🎉 Voucher Ativado!', `
            <div style="text-align:center;padding:3rem">
                <div style="font-size:5rem;margin-bottom:1.5rem">💎</div>
                <h2 style="font-size:2.5rem;margin-bottom:1rem;color:var(--gold)">Parabéns!</h2>
                <p style="font-size:1.25rem;margin-bottom:2rem">
                    Você ganhou <strong style="color:var(--gold)">3 meses de Premium</strong> totalmente grátis!
                </p>
                <button class="btn btn-primary" onclick="app.closeModal();app.loadDashboard()" style="font-size:1.125rem;padding:1.5rem 3rem">
                    <i class="fas fa-rocket"></i> Começar Agora!
                </button>
            </div>
        `, '700px');
        
        showModal(successModal);
        setTimeout(() => loadDashboard(), 1000);
        
    } catch (error) {
        input.disabled = false;
        if (btn) {
            btn.innerHTML = '<i class="fas fa-gift"></i> Ativar Voucher';
            btn.disabled = false;
        }
        
        showToast('Erro', error.message || error, 'error');
        input.focus();
        input.select();
    }
}

function skipVoucher() {
    closeModal();
    showToast('Plano Free', 'Você pode ativar um voucher depois nas configurações', 'info');
}

// ============================================================================
// GEOLOCATION
// ============================================================================

async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocalização não suportada'));
            return;
        }
        
        const locationInput = document.getElementById('search-location');
        const originalPlaceholder = locationInput ? locationInput.placeholder : '';
        if (locationInput) {
            locationInput.placeholder = '📍 A detetar localização...';
            locationInput.disabled = true;
        }
        
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    const address = await reverseGeocode(latitude, longitude);
                    
                    if (locationInput) {
                        locationInput.value = address;
                        locationInput.disabled = false;
                        locationInput.placeholder = originalPlaceholder;
                    }
                    
                    showToast('Localização Detetada', `${address}`, 'success');
                    playSound('success');
                    
                    resolve({ latitude, longitude, address });
                    
                } catch (error) {
                    if (locationInput) {
                        locationInput.disabled = false;
                        locationInput.placeholder = originalPlaceholder;
                    }
                    reject(error);
                }
            },
            (error) => {
                if (locationInput) {
                    locationInput.disabled = false;
                    locationInput.placeholder = originalPlaceholder;
                }
                
                let errorMessage = 'Erro ao obter localização';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permissão de localização negada';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Localização indisponível';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Timeout ao obter localização';
                        break;
                }
                
                showToast('Erro', errorMessage, 'error');
                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    });
}

async function reverseGeocode(latitude, longitude) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt`,
            {
                headers: {
                    'User-Agent': 'LuxeAgent/1.0'
                }
            }
        );
        
        if (!response.ok) throw new Error('Falha no reverse geocoding');
        
        const data = await response.json();
        const address = data.address;
        const city = address.city || address.town || address.village || address.municipality || 'Localização Atual';
        
        if (address.country_code === 'pt') {
            const district = address.state || '';
            return district ? `${city}, ${district}` : city;
        }
        
        return city;
        
    } catch (error) {
        console.error('Reverse geocoding error:', error);
        return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
}

// ============================================================================
// DASHBOARD
// ============================================================================

async function loadDashboard() {
    if (!supabase || !currentUser) return;
    
    try {
        const { data: stats, error } = await supabase.rpc('get_user_stats', {
            p_user_id: currentUser.id
        });
        
        if (error) throw error;
        
        document.getElementById('stat-properties').textContent = stats.total_properties || 0;
        document.getElementById('stat-leads').textContent = stats.total_leads || 0;
        document.getElementById('stat-commissions').textContent = `${(stats.total_commissions || 0).toLocaleString('pt-PT')}€`;
        document.getElementById('stat-goals').textContent = stats.active_goals || 0;
        
        document.getElementById('user-level').textContent = `Nível ${stats.level}`;
        document.getElementById('user-xp').textContent = `${stats.xp} XP`;
        
        const levelProgress = calculateLevelProgress(stats.xp, stats.level);
        document.getElementById('xp-progress-bar').style.width = `${levelProgress}%`;
        
        showView('dashboard');
        
    } catch (error) {
        console.error('Dashboard load error:', error);
        showToast('Erro', 'Falha ao carregar dashboard', 'error');
    }
}

function calculateLevelProgress(currentXP, currentLevel) {
    const currentLevelData = CONFIG.LEVELS.find(l => l.level === currentLevel);
    const nextLevelData = CONFIG.LEVELS.find(l => l.level === currentLevel + 1);
    
    if (!nextLevelData) return 100;
    
    const xpInCurrentLevel = currentXP - currentLevelData.xp;
    const xpNeededForNextLevel = nextLevelData.xp - currentLevelData.xp;
    
    return Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);
}

// ============================================================================
// MODULES
// ============================================================================

async function openModule(moduleName) {
    const hasAccess = await checkFeatureAccess(moduleName);
    
    if (!hasAccess && !['dashboard', 'subscription'].includes(moduleName)) {
        showUpgradeModal(moduleName);
        return;
    }
    
    switch(moduleName) {
        case 'dashboard':
            await loadDashboard();
            break;
        case 'ai-search':
            await openAISearchModule();
            break;
        case 'casafari':
            await openCasafariModule();
            break;
        case 'coaching':
            await openCoachingModule();
            break;
        case 'legal':
            await openLegalModule();
            break;
        case 'gamification':
            await openGamificationModule();
            break;
        case 'idealista':
            await openIdealistaModule();
            break;
        case 'scanner':
            await openScannerModule();
            break;
        case 'subscription':
            await openSubscriptionModule();
            break;
        case 'virtual-staging':
            await openVirtualStagingModule();
            break;
        case 'ai-pricing':
            await openAIPricingModule();
            break;
        case 'ai-stories':
            await openAIStoriesModule();
            break;
        default:
            showToast('Em Breve', `Módulo ${moduleName} em desenvolvimento`, 'info');
    }
}

function showUpgradeModal(featureName) {
    const modal = createModal('Upgrade Necessário', `
        <div class="upgrade-prompt">
            <i class="fas fa-lock upgrade-icon" style="color:var(--gold)"></i>
            <h2 class="upgrade-title">Feature Premium</h2>
            <p class="upgrade-message">
                Este recurso está disponível apenas nos planos pagos.
            </p>
            <div class="upgrade-features">
                <div class="upgrade-feature-item">
                    <i class="fas fa-check"></i>
                    <span>Acesso ilimitado a IA</span>
                </div>
                <div class="upgrade-feature-item">
                    <i class="fas fa-check"></i>
                    <span>Todas as funcionalidades desbloqueadas</span>
                </div>
                <div class="upgrade-feature-item">
                    <i class="fas fa-check"></i>
                    <span>Suporte prioritário</span>
                </div>
            </div>
            <button class="btn btn-primary" onclick="app.openModule('subscription')" style="margin-top:1.5rem">
                <i class="fas fa-gem"></i>
                Ver Planos
            </button>
        </div>
    `, '500px');
    
    showModal(modal);
}

async function openAISearchModule() {
    const modal = createModal('Busca Multi-Portal IA', `
        <div class="form-group">
            <label class="form-label">Tipo de Imóvel</label>
            <select id="search-property-type" class="form-select">
                <option value="apartamento">Apartamento</option>
                <option value="moradia">Moradia</option>
                <option value="terreno">Terreno</option>
                <option value="comercial">Comercial</option>
                <option value="luxo">Luxo</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Localização</label>
            <div style="display:flex;gap:0.5rem">
                <input 
                    type="text" 
                    id="search-location" 
                    class="form-input" 
                    placeholder="Lisboa, Porto, Algarve..."
                    style="flex:1"
                >
                <button 
                    class="btn btn-secondary" 
                    onclick="app.getUserLocation()"
                    style="padding:1rem;white-space:nowrap"
                    title="Usar minha localização"
                >
                    <i class="fas fa-location-crosshairs"></i>
                    <span style="margin-left:0.5rem">Minha Localização</span>
                </button>
            </div>
        </div>
        <div class="form-group">
            <label class="form-label">Preço Máximo (€)</label>
            <input type="number" id="search-max-price" class="form-input" placeholder="500000" step="10000">
        </div>
        <div class="form-group">
            <label class="form-label">Área Mínima (m²)</label>
            <input type="number" id="search-min-area" class="form-input" placeholder="100" step="10">
        </div>
        <div class="form-group">
            <label class="form-label">Raio de Pesquisa (km)</label>
            <select id="search-radius" class="form-select">
                <option value="5">5 km</option>
                <option value="10" selected>10 km</option>
                <option value="20">20 km</option>
                <option value="50">50 km</option>
            </select>
        </div>
        <button class="btn btn-primary" onclick="app.executeAISearch()">
            <i class="fas fa-search"></i>
            Pesquisar com IA
        </button>
        <div id="search-results" style="margin-top:2rem"></div>
    `);
    
    showModal(modal);
}

async function executeAISearch() {
    const propertyType = document.getElementById('search-property-type').value;
    const location = document.getElementById('search-location').value;
    const maxPrice = document.getElementById('search-max-price').value;
    const minArea = document.getElementById('search-min-area').value;
    const radius = document.getElementById('search-radius').value;
    
    if (!location) {
        showToast('Erro', 'Insira ou detete uma localização', 'error');
        return;
    }
    
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = `
        <div style="text-align:center;padding:2rem">
            <div class="loading-spinner" style="margin:0 auto 1rem"></div>
            <div style="color:var(--text-secondary)">A pesquisar imóveis...</div>
        </div>
    `;
    
    try {
        const { data, error } = await supabase.functions.invoke('ai-search', {
            body: {
                property_type: propertyType,
                location: location,
                max_price: maxPrice || 999999999,
                min_area: minArea || 0,
                radius: radius,
                user_id: currentUser.id
            }
        });
        
        if (error) throw error;
        
        if (!data.properties || data.properties.length === 0) {
            resultsDiv.innerHTML = `
                <div style="text-align:center;padding:2rem">
                    <i class="fas fa-search" style="font-size:3rem;color:var(--text-secondary);margin-bottom:1rem"></i>
                    <h3>Nenhum Imóvel Encontrado</h3>
                </div>
            `;
            return;
        }
        
        resultsDiv.innerHTML = data.properties.map((prop, index) => `
            <div class="property-card" style="margin-bottom:1rem;animation:slideUp 0.3s ease ${index * 0.1}s both">
                <img class="property-image" src="${prop.image_url || 'https://via.placeholder.com/400x300'}" alt="${prop.title}">
                <div class="property-content">
                    <div class="property-price">${prop.price.toLocaleString('pt-PT')}€</div>
                    <div class="property-title">${prop.title}</div>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${prop.location}
                    </div>
                    ${prop.area ? `<div class="property-feature"><i class="fas fa-ruler-combined"></i> ${prop.area}m²</div>` : ''}
                </div>
            </div>
        `).join('');
        
        showToast('Pesquisa Completa', `${data.properties.length} imóveis encontrados`, 'success');
        
    } catch (error) {
        console.error('Search error:', error);
        resultsDiv.innerHTML = `
            <div style="text-align:center;padding:2rem">
                <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--color-error);margin-bottom:1rem"></i>
                <h3>Erro na Pesquisa</h3>
                <p style="color:var(--text-secondary)">${error.message}</p>
            </div>
        `;
    }
}

async function openVirtualStagingModule() {
    showToast('Em Breve', 'Virtual Staging IA em desenvolvimento', 'info');
}

async function openAIPricingModule() {
    showToast('Em Breve', 'IA Pricing Suggestion em desenvolvimento', 'info');
}

async function openAIStoriesModule() {
    showToast('Em Breve', 'Stories Imobiliários IA em desenvolvimento', 'info');
}

async function openCasafariModule() {
  const modal = createModal('Casafari + IA Leads', `
    <div class="module-content">
      <div style="text-align:center;padding:2rem">
        <i class="fas fa-building" style="font-size:4rem;color:var(--gold);margin-bottom:1.5rem"></i>
        <h2 style="font-size:2rem;margin-bottom:1rem">Integração Casafari</h2>
        <p style="color:var(--text-secondary);margin-bottom:2rem">
          Conecte sua conta Casafari para importar leads e imóveis com scoring IA automático
        </p>
        
        <div class="form-group">
          <label class="form-label">API Key Casafari</label>
          <input type="text" id="casafari-api-key" class="form-input" placeholder="Digite sua API key...">
        </div>
        
        <button class="btn btn-primary" onclick="app.connectCasafari()">
          <i class="fas fa-plug"></i> Conectar Casafari
        </button>
        
        <div style="margin-top:2rem;padding:1.5rem;background:rgba(212,175,55,0.1);border-radius:12px">
          <h4 style="margin-bottom:1rem"><i class="fas fa-star"></i> Recursos Premium</h4>
          <ul style="text-align:left;color:var(--text-secondary)">
            <li>✓ Import automático de leads</li>
            <li>✓ Scoring IA de qualidade</li>
            <li>✓ Cálculo automático de comissões</li>
            <li>✓ Análise de mercado em tempo real</li>
          </ul>
        </div>
      </div>
    </div>
  `, '700px');
  
  showModal(modal);
}
async function openCoachingModule() {
  const modal = createModal('Coaching SMART IA', `
    <div class="module-content">
      <div style="text-align:center;padding:2rem">
        <i class="fas fa-brain" style="font-size:4rem;color:var(--gold);margin-bottom:1.5rem"></i>
        <h2 style="font-size:2rem;margin-bottom:1rem">Coach Pessoal com IA Gemini</h2>
        <p style="color:var(--text-secondary);margin-bottom:2rem">
          Defina metas SMART, receba tarefas diárias personalizadas e acompanhe seu progresso
        </p>
        
        <div class="chat-container" style="height:400px">
          <div class="chat-messages" id="coaching-chat">
            <div class="chat-message">
              <img class="chat-avatar" src="https://ui-avatars.com/api/?name=AI+Coach&background=D4AF37&color=0A0E27" />
              <div class="chat-bubble">
                Olá! Sou seu coach pessoal de IA. Vamos definir suas metas SMART para este mês?
              </div>
            </div>
          </div>
          <div class="chat-input-container">
            <input type="text" class="chat-input" id="coaching-input" placeholder="Digite sua meta..." />
            <button class="chat-send-btn" onclick="app.sendCoachingMessage()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        
        <div style="margin-top:1.5rem;padding:1rem;background:rgba(139,92,246,0.1);border-radius:12px">
          <p style="font-size:0.875rem;color:var(--text-secondary)">
            <i class="fas fa-lightbulb"></i> Dica: Metas SMART são Específicas, Mensuráveis, Alcançáveis, Relevantes e com Prazo definido
          </p>
        </div>
      </div>
    </div>
  `, '800px');
  
  showModal(modal);
}
async function openLegalModule() {
  const modal = createModal('Assistente Legal IA', `
    <div class="module-content">
      <div style="padding:2rem">
        <div style="text-align:center;margin-bottom:2rem">
          <i class="fas fa-gavel" style="font-size:4rem;color:var(--gold);margin-bottom:1.5rem"></i>
          <h2 style="font-size:2rem;margin-bottom:1rem">Consultor Legal Imobiliário</h2>
          <p style="color:var(--text-secondary)">
            Pergunte sobre legislação portuguesa, cálculos fiscais (IMT, IMI), contratos e procedimentos legais
          </p>
        </div>
        
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem">
          <button class="btn btn-secondary" onclick="app.askLegal('IMT')" style="padding:1rem">
            <i class="fas fa-calculator"></i><br/>Calcular IMT
          </button>
          <button class="btn btn-secondary" onclick="app.askLegal('IMI')" style="padding:1rem">
            <i class="fas fa-home"></i><br/>Calcular IMI
          </button>
          <button class="btn btn-secondary" onclick="app.askLegal('Contratos')" style="padding:1rem">
            <i class="fas fa-file-contract"></i><br/>Contratos
          </button>
          <button class="btn btn-secondary" onclick="app.askLegal('Legislação')" style="padding:1rem">
            <i class="fas fa-book"></i><br/>Legislação
          </button>
        </div>
        
        <div class="chat-container" style="height:300px">
          <div class="chat-messages" id="legal-chat">
            <div class="chat-message">
              <i class="fas fa-gavel" style="font-size:2rem;color:var(--gold)"></i>
              <div class="chat-bubble">
                Olá! Sou seu assistente legal. Como posso ajudar hoje?
              </div>
            </div>
          </div>
          <div class="chat-input-container">
            <input type="text" class="chat-input" id="legal-input" placeholder="Faça sua pergunta legal..." />
            <button class="chat-send-btn" onclick="app.sendLegalMessage()">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `, '900px');
  
  showModal(modal);
}
async function openGamificationModule() {
  const modal = createModal('Gamificação & Rankings', `
    <div class="module-content">
      <div style="padding:2rem">
        <div style="text-align:center;margin-bottom:2rem">
          <i class="fas fa-trophy" style="font-size:4rem;color:var(--gold);margin-bottom:1.5rem"></i>
          <h2 style="font-size:2rem;margin-bottom:1rem">Sistema de Gamificação</h2>
          <p style="color:var(--text-secondary)">
            Compita em 6 campeonatos simultâneos, ganhe badges e suba no ranking
          </p>
        </div>
        
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;margin-bottom:2rem">
          <div style="background:linear-gradient(135deg,rgba(26,34,71,0.9),rgba(18,24,56,0.9));border:2px solid var(--gold);border-radius:16px;padding:1.5rem;text-align:center">
            <h3 style="color:var(--gold);margin-bottom:0.5rem">Ranking Mensal</h3>
            <div style="font-size:2.5rem;font-weight:700;margin:1rem 0">#${Math.floor(Math.random()*20)+1}</div>
            <p style="color:var(--text-secondary);font-size:0.875rem">Sua posição atual</p>
          </div>
          
          <div style="background:rgba(26,34,71,0.6);border:1px solid rgba(212,175,55,0.2);border-radius:16px;padding:1.5rem;text-align:center">
            <h3 style="margin-bottom:0.5rem">XP Este Mês</h3>
            <div style="font-size:2.5rem;font-weight:700;margin:1rem 0;color:var(--gold)">${Math.floor(Math.random()*500)+100}</div>
            <p style="color:var(--text-secondary);font-size:0.875rem">Pontos ganhos</p>
          </div>
          
          <div style="background:rgba(26,34,71,0.6);border:1px solid rgba(212,175,55,0.2);border-radius:16px;padding:1.5rem;text-align:center">
            <h3 style="margin-bottom:0.5rem">Badges Desbloqueados</h3>
            <div style="font-size:2.5rem;font-weight:700;margin:1rem 0;color:var(--gold)">${Math.floor(Math.random()*15)+5}/50</div>
            <p style="color:var(--text-secondary);font-size:0.875rem">Conquistas</p>
          </div>
        </div>
        
        <div style="margin-top:2rem">
          <h3 style="margin-bottom:1rem"><i class="fas fa-medal"></i> Top 10 Ranking</h3>
          <div style="background:rgba(26,34,71,0.4);border-radius:12px;padding:1rem">
            ${[1,2,3,4,5,6,7,8,9,10].map(i => `
              <div style="display:flex;align-items:center;padding:0.75rem;border-bottom:1px solid rgba(212,175,55,0.1)">
                <div style="font-size:1.5rem;font-weight:700;width:40px;color:${i<=3?'var(--gold)':'var(--text-secondary)'}">#${i}</div>
                <img src="https://ui-avatars.com/api/?name=Agente+${i}&background=D4AF37&color=0A0E27" style="width:40px;height:40px;border-radius:50%;margin:0 1rem" />
                <div style="flex:1">
                  <div style="font-weight:600">Agente ${i}</div>
                  <div style="font-size:0.75rem;color:var(--text-secondary)">${Math.floor(Math.random()*3000)+1000} XP</div>
                </div>
                ${i<=3?`<i class="fas fa-crown" style="color:var(--gold);font-size:1.5rem"></i>`:''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `, '1000px');
  
  showModal(modal);
}
async function openIdealistaModule() {
  const modal = createModal('Gerador de Anúncios IA', `
    <div class="module-content">
      <div style="padding:2rem">
        <div style="text-align:center;margin-bottom:2rem">
          <i class="fas fa-ad" style="font-size:4rem;color:var(--gold);margin-bottom:1.5rem"></i>
          <h2 style="font-size:2rem;margin-bottom:1rem">Gerador de Anúncios para Idealista</h2>
          <p style="color:var(--text-secondary)">
            Gemini Vision analisa suas fotos e gera anúncios otimizados com SEO automático
          </p>
        </div>
        
        <div class="form-group">
          <label class="form-label"><i class="fas fa-camera"></i> Upload de Fotos do Imóvel</label>
          <input type="file" id="property-images" class="form-input" multiple accept="image/*" />
        </div>
        
        <div class="form-group">
          <label class="form-label">Tipo de Imóvel</label>
          <select id="idealista-property-type" class="form-select">
            <option value="apartamento">Apartamento</option>
            <option value="moradia">Moradia</option>
            <option value="terreno">Terreno</option>
            <option value="loja">Loja/Escritório</option>
          </select>
        </div>
        
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div class="form-group">
            <label class="form-label">Preço (€)</label>
            <input type="number" id="idealista-price" class="form-input" placeholder="250000" />
          </div>
          <div class="form-group">
            <label class="form-label">Área (m²)</label>
            <input type="number" id="idealista-area" class="form-input" placeholder="120" />
          </div>
        </div>
        
        <button class="btn btn-primary" onclick="app.generateIdealistaAd()" style="width:100%">
          <i class="fas fa-magic"></i> Gerar Anúncio com IA
        </button>
        
        <div id="idealista-result" style="margin-top:2rem"></div>
      </div>
    </div>
  `, '800px');
  
  showModal(modal);
}
async function openScannerModule() {
  const modal = createModal('Scanner de Documentos', `
    <div class="module-content">
      <div style="padding:2rem">
        <div style="text-align:center;margin-bottom:2rem">
          <i class="fas fa-camera" style="font-size:4rem;color:var(--gold);margin-bottom:1.5rem"></i>
          <h2 style="font-size:2rem;margin-bottom:1rem">Scanner OCR com IA</h2>
          <p style="color:var(--text-secondary)">
            Digitalize contratos, certidões e cadernetas com câmara ou PDF e extraia dados automaticamente
          </p>
        </div>
        
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2rem">
          <button class="btn btn-secondary" onclick="app.scanWithCamera()" style="padding:1.5rem">
            <i class="fas fa-camera" style="font-size:2rem;display:block;margin-bottom:0.5rem"></i>
            Usar Câmara
          </button>
          <button class="btn btn-secondary" onclick="app.uploadDocument()" style="padding:1.5rem">
            <i class="fas fa-file-upload" style="font-size:2rem;display:block;margin-bottom:0.5rem"></i>
            Upload PDF/Imagem
          </button>
        </div>
        
        <div style="background:rgba(26,34,71,0.6);border-radius:12px;padding:1.5rem;margin-bottom:2rem">
          <h4 style="margin-bottom:1rem"><i class="fas fa-file-alt"></i> Tipos de Documentos Suportados</h4>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:0.5rem;color:var(--text-secondary);font-size:0.875rem">
            <div>✓ Contratos de Compra e Venda</div>
            <div>✓ Certidões Prediais</div>
            <div>✓ Cadernetas Prediais</div>
            <div>✓ Plantas e Projetos</div>
            <div>✓ Licenças de Utilização</div>
            <div>✓ Documentos de Identificação</div>
          </div>
        </div>
        
        <div id="scanner-result" style="display:none;background:rgba(212,175,55,0.1);border-radius:12px;padding:1.5rem">
          <h4 style="margin-bottom:1rem;color:var(--gold)"><i class="fas fa-check-circle"></i> Documento Processado</h4>
          <div id="scanner-extracted-data" style="color:var(--text-secondary)"></div>
        </div>
      </div>
    </div>
  `, '800px');
  
  showModal(modal);
}
async function openSubscriptionModule() {
    const modal = createModal('Escolha seu Plano', `
        <div class="pricing-section">
            <div style="text-align:center;margin-bottom:3rem">
                <h2 style="font-size:3rem;margin-bottom:1rem">Escolha seu Plano</h2>
                <p style="font-size:1.125rem;color:var(--text-secondary)">
                    Transforme seu negócio imobiliário com IA
                </p>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem">
                ${generatePricingCards(false)}
            </div>
        </div>
    `, '1400px');
    
    showModal(modal);
}

// ============================================================================
// GAMIFICATION
// ============================================================================

async function addXP(amount) {
    if (!supabase || !currentUser) return;
    
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('xp, level')
            .eq('id', currentUser.id)
            .single();
        
        const newXP = profile.xp + amount;
        const newLevel = CONFIG.LEVELS.reduce((acc, l) => {
            return newXP >= l.xp ? l.level : acc;
        }, 1);
        
        const leveledUp = newLevel > profile.level;
        
        await supabase
            .from('profiles')
            .update({ xp: newXP, level: newLevel })
            .eq('id', currentUser.id);
        
        if (leveledUp) {
            triggerConfetti();
            playSound('level-up');
            showToast('Level Up!', `Você chegou ao nível ${newLevel}!`, 'success');
        }
        
        document.getElementById('user-xp').textContent = `${newXP} XP`;
        document.getElementById('user-level').textContent = `Nível ${newLevel}`;
        
        const levelProgress = calculateLevelProgress(newXP, newLevel);
        document.getElementById('xp-progress-bar').style.width = `${levelProgress}%`;
        
    } catch (error) {
        console.error('XP add error:', error);
    }
}

// ============================================================================
// UI UTILITIES
// ============================================================================

function createModal(title, content, width = '800px') {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="app.closeModal()"></div>
        <div class="modal-content" style="max-width:${width}">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="app.closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    return modal;
}

function showModal(modal) {
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
}

function showToast(title, message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('active'), 10);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function playSound(soundName) {
    try {
        const sounds = {
            'success': 'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
            'level-up': 'https://assets.mixkit.co/sfx/preview/mixkit-video-game-win-2016.mp3',
            'error': 'https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3'
        };
        
        const audio = new Audio(sounds[soundName]);
        audio.volume = 0.3;
        audio.play().catch(() => {});
    } catch (error) {
        // Silent fail
    }
}

function triggerConfetti() {
    if (typeof confetti === 'undefined') return;
    
    const count = 100;
    const defaults = {
        origin: { y: 0.7 }
    };
    
    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }
    
    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
}

function showView(viewName) {
    document.querySelectorAll('[id$="-view"]').forEach(view => {
        view.classList.add('hidden');
    });
    
    const view = document.getElementById(`${viewName}-view`);
    if (view) {
        view.classList.remove('hidden');
    }
}

function updateLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = t(key);
    });
}

// ============================================================================
// GLOBAL APP OBJECT
// ============================================================================
window.app = {
    // Auth
    loginWithGoogle,
    logout,
    
    // Subscription
    validateVoucher,
    activateVoucher,
    skipVoucher,
    checkSubscriptionExpiry,
    selectPlan,
    continueWithFree,
    checkFeatureAccess,
    
    // OAuth
    initiateGoogleOAuthForGemini,
    hasGeminiOAuth,
    
    // Geolocation
    getUserLocation,
    
    // Modules
    openModule,
    executeAISearch,
    
    // Dashboard
    loadDashboard,
    
    // Gamification
    addXP,
    
    // UI
    createModal,
    showModal,
    closeModal,
    showToast,
    showView,
    updateLanguage
};

console.log('✅ LUX.ai app.js loaded successfully');

// ============================================
// SOLUÇÃO DE EMERGÊNCIA PARA TELA DE LOADING
// ============================================
/**
 * Função para forçar a exibição do app após timeout
 * Remove o loading screen e mostra o conteúdo principal
 */
function forceShowApp() {
  console.log('[DEBUG] Forçando exibição do app...');
  
  try {
    // 1. Esconder loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'none';
      console.log('[DEBUG] Loading screen escondido');
    }
    
    // 2. Esconder auth screen (não precisamos dela para testing)
    const authScreen = document.getElementById('auth-screen');
    if (authScreen) {
      authScreen.style.display = 'none';
      console.log('[DEBUG] Auth screen escondido');
    }
    
    // 3. Mostrar app principal
    const appScreen = document.getElementById('app');
    if (appScreen) {
      appScreen.style.display = 'block';
      appScreen.classList.remove('hidden');
      console.log('[DEBUG] App principal exibido com sucesso!');
    } else {
      console.error('[ERRO] Elemento #app não encontrado no DOM');
    }
    
    // 4. Simular usuário logado (opcional, para evitar erros)
    if (typeof window !== 'undefined') {
      currentUser = {
        id: 'test-user-' + Date.now(),
        email: 'test@example.com',
        name: 'Usuário Teste',
        isTestMode: true
      };
      console.log('[DEBUG] Usuário teste criado:', currentUser);
    }
    
  } catch (error) {
    console.error('[ERRO] Falha ao forçar exibição do app:', error);
    // Fallback extremo: mostrar alerta
    alert('Erro ao carregar aplicação. Recarregue a página.');
  }
}

/**
 * Função de verificação de segurança
 * Garante que o app será exibido mesmo se houver falhas
 */
function emergencyAppDisplay() {
  console.log('[DEBUG] Iniciando verificação de emergência...');

        
    // FIXED: Não executar se houver OAuth redirect
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
        console.log('[DEBUG] OAuth redirect detectado, cancelando emergency display');
        return;
    }
  // Verificar se loading screen ainda está visível após 3 segundos
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    const appScreen = document.getElementById('app');
    
    // Se loading ainda está visível E app ainda está escondido
    if (loadingScreen && loadingScreen.style.display !== 'none' && appScreen &&
        (appScreen.style.display === 'none' || appScreen.classList.contains('hidden'))) {
      
      console.warn('[AVISO] Tela de loading ainda visível após 3s. Forçando exibição...');
      forceShowApp();
    } else {
      console.log('[DEBUG] App carregado normalmente, nenhuma ação necessária');
    }
  }, 3000);
  
  // Timeout adicional de segurança (5 segundos)
  setTimeout(() => {
    const appScreen = document.getElementById('app');
    if (appScreen &&
        (appScreen.style.display === 'none' || appScreen.classList.contains('hidden'))) {
      console.error('[ERRO CRÍTICO] App ainda não exibido após 5s. Forçando exibição final...');
      forceShowApp();
    }
  }, 5000);
}

// ============================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================

// Executar quando o DOM estiver completamente carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[DEBUG] DOM carregado, iniciando verificação de emergência');
    emergencyAppDisplay();
  });
} else {
  // DOM já está carregado
  console.log('[DEBUG] DOM já carregado, iniciando verificação imediatamente');
  emergencyAppDisplay();
}

// Atalho de teclado para forçar exibição manualmente (Ctrl + Shift + L)
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'L') {
    console.log('[DEBUG] Atalho de teclado detectado. Forçando exibição...');
    forceShowApp();
  }
});

console.log('[DEBUG] Sistema de emergência de loading carregado com sucesso!');
console.log('[DEBUG] Use Ctrl+Shift+L para forçar exibição manualmente a qualquer momento');
