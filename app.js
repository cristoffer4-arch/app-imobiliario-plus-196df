// lux.ai Pro - Complete AI-Powered Real Estate Platform
// Portuguese Luxury Real Estate Consultants MVP

// ============================================================================
// CONFIGURATION & INITIALIZATION
// ============================================================================

const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'https://ebuktnhikkttcmxrbbhk.supabase.co',  // SET IN .env
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVidWt0bmhpa2t0dGNteHJiYmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NTEwMTQsImV4cCI6MjA0OTIyNzAxNH0.s1K5cDOF8dP9X1jHZO6EXtWQ7S8YpE_8T0mBaQwkN8M', // SET IN .env
    
    // API Keys
    CASAFARI_API_KEY: '', // SET IN .env
    GOOGLE_GEMINI_KEY: '', // SET IN .env
    STRIPE_PUBLISHABLE_KEY: '', // SET IN .env
    
    // Google OAuth
    GOOGLE_CLIENT_ID: '', // SET IN .env
    
    // Edge Function URLs (Supabase)
    EDGE_FUNCTIONS: {
        AI_SEARCH: '/functions/v1/ai-search',
        AI_COACHING: '/functions/v1/ai-coaching',
        AI_ASSISTANT: '/functions/v1/ai-assistant',
        AI_GAMIFICATION: '/functions/v1/ai-gamification',
        AI_IDEALISTA: '/functions/v1/ai-idealista',
        SYNC_CASAFARI: '/functions/v1/sync-casafari',
        DIRECTOR_KPIS: '/functions/v1/director-kpis'
    },
    
    // Feature Flags
    PREMIUM_FEATURES: ['casafari', 'unlimited_ai'],
    FREE_AI_LIMIT: 50,
    
    // Gamification
    XP_VALUES: {
        PROPERTY_VIEW: 5,
        LEAD_CONTACT: 10,
        MEETING_SCHEDULED: 25,
        PROPOSAL_SENT: 50,
        CONTRACT_SIGNED: 200,
        SALE_COMPLETED: 1000
    },
    
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
    ],
    
    // Championship Types
    CHAMPIONSHIPS: {
        MONTHLY_SALES: 'Vendas do Mês',
        QUARTERLY_REVENUE: 'Faturamento Trimestral',
        LEADS_CONVERSION: 'Conversão de Leads',
        TEAM_PERFORMANCE: 'Performance Equipa',
        LUXURY_SPECIALIST: 'Especialista Luxo',
        ROOKIE_OF_MONTH: 'Revelação do Mês'
    }
};

// Load configuration from .env or localStorage
function loadConfig() {
    const stored = localStorage.getItem('lux.ai_config');
    if (stored) {
        const config = JSON.parse(stored);
        Object.assign(CONFIG, config);
    }
}

// ============================================================================
// SUPABASE CLIENT & DATABASE OPERATIONS
// ============================================================================

let supabase = null;
let currentUser = null;

function initSupabase() {
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_ANON_KEY) {
        console.error('Supabase configuration missing');
        return null;
    }
    
    // Import Supabase client from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
    script.onload = () => {
        supabase = window.supabase.createClient(
            CONFIG.SUPABASE_URL,
            CONFIG.SUPABASE_ANON_KEY
        );
        
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                handleAuthSuccess(session.user);
            } else {
                showAuthScreen();
            }
        });
        
        // Listen for auth changes
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                handleAuthSuccess(session.user);
            } else if (event === 'SIGNED_OUT') {
                handleSignOut();
            }
        });
    };
    document.head.appendChild(script);
}

// ============================================================================
// GOOGLE OAUTH AUTHENTICATION
// ============================================================================

function initGoogleAuth() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

async function signInWithGoogle() {
    if (!supabase) {
        showToast('Erro', 'Sistema não inicializado', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
    } catch (error) {
        console.error('Google auth error:', error);
        showToast('Erro', 'Falha na autenticação', 'error');
    }
}

async function handleAuthSuccess(user) {
    currentUser = user;
    
    // Hide auth screen
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    // Set user avatar
    document.getElementById('user-avatar').src = user.user_metadata?.avatar_url || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=D4AF37&color=0A0E27`;
    
    // Initialize user data in database
    await initializeUserData(user);
    
    // Load dashboard
    await loadDashboard();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 500);
    
    // Show welcome toast
    showToast('Bem-vindo!', `Olá ${user.user_metadata?.full_name || user.email}`, 'success');
    playSound('success');
}

async function initializeUserData(user) {
    if (!supabase) return;
    
    try {
        // Check if user profile exists
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (!profile) {
            // Create new profile
            await supabase.from('profiles').insert({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name,
                avatar_url: user.user_metadata?.avatar_url,
                subscription_tier: 'free',
                xp: 0,
                level: 1,
                ai_requests_used: 0,
                created_at: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Error initializing user data:', error);
    }
}

function handleSignOut() {
    currentUser = null;
    document.getElementById('app').classList.add('hidden');
    showAuthScreen();
}

function showAuthScreen() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('auth-screen').classList.remove('hidden');
}

// ============================================================================
// DASHBOARD & STATISTICS
// ============================================================================

async function loadDashboard() {
    if (!supabase || !currentUser) return;
    
    try {
        // Load user stats
        const { data: stats } = await supabase.rpc('get_user_stats', {
            user_id: currentUser.id
        });
        
        if (stats) {
            document.getElementById('stat-properties').textContent = stats.total_properties || 0;
            document.getElementById('stat-leads').textContent = stats.total_leads || 0;
            document.getElementById('stat-commission').textContent = 
                `${(stats.total_commission || 0).toLocaleString('pt-PT')}€`;
            document.getElementById('stat-xp').textContent = stats.xp || 0;
        }
        
        // Load user level
        const { data: profile } = await supabase
            .from('profiles')
            .select('xp, level')
            .eq('id', currentUser.id)
            .single();
        
        if (profile) {
            updateUserLevel(profile.xp, profile.level);
        }
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateUserLevel(xp, currentLevel) {
    const levelConfig = CONFIG.LEVELS.find(l => l.level === currentLevel);
    if (levelConfig) {
        document.getElementById('user-level').textContent = 
            `${levelConfig.title} (${currentLevel})`;
    }
}

// ============================================================================
// MODULE 1: AI MULTI-PORTAL PROPERTY SEARCH
// ============================================================================

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
            <input type="text" id="search-location" class="form-input" placeholder="Lisboa, Porto, Algarve...">
        </div>
        <div class="form-group">
            <label class="form-label">Preço Máximo</label>
            <input type="number" id="search-max-price" class="form-input" placeholder="500000">
        </div>
        <div class="form-group">
            <label class="form-label">Portais</label>
            <div style="display:grid;gap:0.5rem">
                <label><input type="checkbox" checked id="portal-idealista"> Idealista</label>
                <label><input type="checkbox" checked id="portal-imovirtual"> Imovirtual</label>
                <label><input type="checkbox" checked id="portal-olx"> OLX</label>
            </div>
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
    
    const portals = [];
    if (document.getElementById('portal-idealista').checked) portals.push('idealista');
    if (document.getElementById('portal-imovirtual').checked) portals.push('imovirtual');
    if (document.getElementById('portal-olx').checked) portals.push('olx');
    
    if (!location) {
        showToast('Erro', 'Insira uma localização', 'error');
        return;
    }
    
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> A pesquisar...';
    
    try {
        // Call Supabase Edge Function for AI Search
        const { data, error } = await supabase.functions.invoke('ai-search', {
            body: {
                property_type: propertyType,
                location: location,
                max_price: maxPrice,
                portals: portals
            }
        });
        
        if (error) throw error;
        
        // Deduplicate results using AI
        const deduplicated = data.properties.filter((prop, index, self) =>
            index === self.findIndex((p) => 
                Math.abs(p.price - prop.price) < 5000 && 
                p.location.toLowerCase().includes(prop.location.toLowerCase())
            )
        );
        
        // Display results
        resultsDiv.innerHTML = deduplicated.map(prop => `
            <div class="property-card" style="margin-bottom:1rem">
                <img class="property-image" src="${prop.image_url}" alt="${prop.title}">
                <div class="property-content">
                    <div class="property-price">${prop.price.toLocaleString('pt-PT')}€</div>
                    <div class="property-title">${prop.title}</div>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${prop.location}
                    </div>
                    <div class="property-features">
                        <div class="property-feature">
                            <i class="fas fa-bed"></i>
                            ${prop.bedrooms} quartos
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-bath"></i>
                            ${prop.bathrooms} WC
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-ruler-combined"></i>
                            ${prop.area}m²
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add XP
        await addXP(CONFIG.XP_VALUES.PROPERTY_VIEW * deduplicated.length);
        
        showToast('Sucesso', `${deduplicated.length} imóveis encontrados`, 'success');
        playSound('success');
        
    } catch (error) {
        console.error('Search error:', error);
        resultsDiv.innerHTML = '<p style="color:var(--color-error)">Erro na pesquisa. Tente novamente.</p>';
        showToast('Erro', 'Falha na pesquisa', 'error');
    }
}

// ============================================================================
// MODULE 2: CASAFARI INTEGRATION + AI LEADS + COMMISSIONS
// ============================================================================

async function openCasafariModule() {
    // Check if user has premium
    const hasPremium = await checkPremium();
    if (!hasPremium) {
        showPremiumRequired();
        return;
    }
    
    const modal = createModal('Casafari + IA Leads', `
        <div class="tabs">
            <button class="tab active" onclick="app.switchCasafariTab('properties')">Imóveis</button>
            <button class="tab" onclick="app.switchCasafariTab('leads')">Leads IA</button>
            <button class="tab" onclick="app.switchCasafariTab('commissions')">Comissões</button>
        </div>
        <div id="casafari-content"></div>
    `);
    
    showModal(modal);
    switchCasafariTab('properties');
}

async function switchCasafariTab(tab) {
    const content = document.getElementById('casafari-content');
    
    // Update active tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    if (tab === 'properties') {
        content.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> A carregar...';
        await loadCasafariProperties(content);
    } else if (tab === 'leads') {
        await loadAILeads(content);
    } else if (tab === 'commissions') {
        await loadCommissions(content);
    }
}

async function loadCasafariProperties(container) {
    try {
        const { data, error } = await supabase.functions.invoke('sync-casafari', {
            body: { action: 'get_properties' }
        });
        
        if (error) throw error;
        
        container.innerHTML = data.properties.map(prop => `
            <div class="property-card" onclick="app.viewCasafariProperty('${prop.id}')">
                <img class="property-image" src="${prop.main_image}">
                <div class="property-content">
                    <div class="property-price">${prop.price.toLocaleString('pt-PT')}€</div>
                    <div class="property-title">${prop.title}</div>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${prop.address}
                    </div>
                    <div class="property-features">
                        <div class="property-feature">
                            <i class="fas fa-bed"></i>
                            ${prop.bedrooms}
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-ruler-combined"></i>
                            ${prop.gross_area}m²
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Casafari error:', error);
        container.innerHTML = '<p>Erro ao carregar imóveis Casafari</p>';
    }
}

async function loadAILeads(container) {
    container.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> A analisar leads...';
    
    try {
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('ai_score', { ascending: false });
        
        if (error) throw error;
        
        container.innerHTML = `
            <div style="margin-bottom:1rem">
                <button class="btn btn-primary" onclick="app.scoreLeadsWithAI()">
                    <i class="fas fa-brain"></i>
                    Recalcular Scores IA
                </button>
            </div>
            ${data.map(lead => `
                <div class="property-card" style="margin-bottom:1rem">
                    <div class="property-content">
                        <div style="display:flex;justify-content:space-between;align-items:start">
                            <div>
                                <div class="property-title">${lead.name}</div>
                                <div class="property-location">
                                    <i class="fas fa-envelope"></i>
                                    ${lead.email}
                                </div>
                                <div class="property-location">
                                    <i class="fas fa-phone"></i>
                                    ${lead.phone || 'N/A'}
                                </div>
                            </div>
                            <div style="text-align:right">
                                <div class="property-price">${lead.ai_score}/100</div>
                                <div style="font-size:0.75rem;color:var(--text-secondary)">Score IA</div>
                            </div>
                        </div>
                        <div style="margin-top:1rem">
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width:${lead.ai_score}%"></div>
                                </div>
                            </div>
                        </div>
                        <div style="margin-top:1rem;font-size:0.875rem;color:var(--text-secondary)">
                            ${lead.ai_analysis || 'Análise IA não disponível'}
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
        
    } catch (error) {
        console.error('Leads error:', error);
        container.innerHTML = '<p>Erro ao carregar leads</p>';
    }
}

async function scoreLeadsWithAI() {
    const { data: leads } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', currentUser.id);
    
    for (const lead of leads) {
        try {
            const { data: score } = await supabase.functions.invoke('ai-gamification', {
                body: {
                    action: 'score_lead',
                    lead: lead
                }
            });
            
            await supabase
                .from('leads')
                .update({
                    ai_score: score.score,
                    ai_analysis: score.analysis
                })
                .eq('id', lead.id);
                
        } catch (error) {
            console.error('Error scoring lead:', error);
        }
    }
    
    showToast('Sucesso', 'Leads analisados com IA', 'success');
    await loadAILeads(document.getElementById('casafari-content'));
}

async function loadCommissions(container) {
    try {
        const { data, error } = await supabase
            .from('commissions')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const total = data.reduce((sum, c) => sum + c.amount, 0);
        
        container.innerHTML = `
            <div class="stat-card" style="margin-bottom:1.5rem">
                <div class="stat-value">${total.toLocaleString('pt-PT')}€</div>
                <div class="stat-label">Total Comissões</div>
            </div>
            ${data.map(comm => `
                <div class="property-card" style="margin-bottom:1rem">
                    <div class="property-content">
                        <div style="display:flex;justify-content:space-between">
                            <div>
                                <div class="property-title">${comm.property_address}</div>
                                <div class="property-location">
                                    <i class="fas fa-calendar"></i>
                                    ${new Date(comm.created_at).toLocaleDateString('pt-PT')}
                                </div>
                            </div>
                            <div style="text-align:right">
                                <div class="property-price">${comm.amount.toLocaleString('pt-PT')}€</div>
                                <div style="font-size:0.75rem;color:${comm.status === 'paid' ? 'var(--color-success)' : 'var(--color-warning)'}">
                                    ${comm.status === 'paid' ? 'Pago' : 'Pendente'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
        
    } catch (error) {
        console.error('Commissions error:', error);
        container.innerHTML = '<p>Erro ao carregar comissões</p>';
    }
}

// ============================================================================
// MODULE 3: AI COACHING (SMART GOALS + GEMINI)
// ============================================================================

async function openCoachingModule() {
    const modal = createModal('Coaching SMART IA', `
        <div class="tabs">
            <button class="tab active" onclick="app.switchCoachingTab('goals')">Metas SMART</button>
            <button class="tab" onclick="app.switchCoachingTab('tasks')">Tarefas Diárias</button>
            <button class="tab" onclick="app.switchCoachingTab('analysis')">Análise IA</button>
        </div>
        <div id="coaching-content"></div>
    `);
    
    showModal(modal);
    switchCoachingTab('goals');
}

async function switchCoachingTab(tab) {
    const content = document.getElementById('coaching-content');
    
    if (tab === 'goals') {
        await loadSMARTGoals(content);
    } else if (tab === 'tasks') {
        await loadDailyTasks(content);
    } else if (tab === 'analysis') {
        await loadPerformanceAnalysis(content);
    }
}

async function loadSMARTGoals(container) {
    try {
        const { data: goals } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        container.innerHTML = `
            <button class="btn btn-primary" onclick="app.createSMARTGoal()" style="margin-bottom:1.5rem">
                <i class="fas fa-plus"></i>
                Nova Meta SMART
            </button>
            ${goals?.map(goal => `
                <div class="property-card" style="margin-bottom:1rem">
                    <div class="property-content">
                        <div class="property-title">${goal.title}</div>
                        <div style="margin:1rem 0;font-size:0.875rem;color:var(--text-secondary)">
                            ${goal.description}
                        </div>
                        <div class="progress-container">
                            <div class="progress-label">
                                <span>Progresso</span>
                                <span>${goal.progress}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width:${goal.progress}%"></div>
                            </div>
                        </div>
                        <div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap">
                            <span style="font-size:0.75rem;background:rgba(212,175,55,0.2);padding:0.25rem 0.75rem;border-radius:50px">
                                <i class="fas fa-calendar"></i>
                                ${new Date(goal.deadline).toLocaleDateString('pt-PT')}
                            </span>
                            <span style="font-size:0.75rem;background:rgba(212,175,55,0.2);padding:0.25rem 0.75rem;border-radius:50px">
                                <i class="fas fa-bullseye"></i>
                                ${goal.metric}
                            </span>
                        </div>
                    </div>
                </div>
            `).join('') || '<p>Nenhuma meta definida</p>'}
        `;
        
    } catch (error) {
        console.error('Goals error:', error);
    }
}

async function createSMARTGoal() {
    const modal = createModal('Nova Meta SMART', `
        <div class="form-group">
            <label class="form-label">Título da Meta</label>
            <input type="text" id="goal-title" class="form-input" placeholder="Ex: Vender 5 imóveis de luxo">
        </div>
        <div class="form-group">
            <label class="form-label">Descrição (Específica e Mensurável)</label>
            <textarea id="goal-description" class="form-textarea" placeholder="Descreva sua meta de forma SMART..."></textarea>
        </div>
        <div class="form-group">
            <label class="form-label">Métrica</label>
            <input type="text" id="goal-metric" class="form-input" placeholder="Ex: 5 vendas, 100.000€ comissão">
        </div>
        <div class="form-group">
            <label class="form-label">Prazo</label>
            <input type="date" id="goal-deadline" class="form-input">
        </div>
        <button class="btn btn-primary" onclick="app.saveSMARTGoal()">
            <i class="fas fa-save"></i>
            Criar Meta
        </button>
    `);
    
    showModal(modal);
}

async function saveSMARTGoal() {
    const title = document.getElementById('goal-title').value;
    const description = document.getElementById('goal-description').value;
    const metric = document.getElementById('goal-metric').value;
    const deadline = document.getElementById('goal-deadline').value;
    
    if (!title || !description || !metric || !deadline) {
        showToast('Erro', 'Preencha todos os campos', 'error');
        return;
    }
    
    try {
        const { error } = await supabase.from('goals').insert({
            user_id: currentUser.id,
            title,
            description,
            metric,
            deadline,
            progress: 0
        });
        
        if (error) throw error;
        
        showToast('Sucesso', 'Meta SMART criada!', 'success');
        playSound('success');
        await addXP(CONFIG.XP_VALUES.MEETING_SCHEDULED);
        closeModal();
        
        // Generate daily tasks with AI
        await generateDailyTasksForGoal(title, description);
        
    } catch (error) {
        console.error('Error saving goal:', error);
        showToast('Erro', 'Falha ao criar meta', 'error');
    }
}

async function generateDailyTasksForGoal(goalTitle, goalDescription) {
    try {
        const { data } = await supabase.functions.invoke('ai-coaching', {
            body: {
                action: 'generate_tasks',
                goal_title: goalTitle,
                goal_description: goalDescription
            }
        });
        
        // Save tasks to database
        for (const task of data.tasks) {
            await supabase.from('tasks').insert({
                user_id: currentUser.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                due_date: task.due_date
            });
        }
        
    } catch (error) {
        console.error('Error generating tasks:', error);
    }
}

async function loadDailyTasks(container) {
    try {
        const { data: tasks } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('completed', false)
            .order('priority', { ascending: false });
        
        container.innerHTML = `
            <button class="btn btn-primary" onclick="app.generateAITasks()" style="margin-bottom:1.5rem">
                <i class="fas fa-robot"></i>
                Gerar Tarefas com IA
            </button>
            ${tasks?.map(task => `
                <div class="property-card" style="margin-bottom:1rem;cursor:pointer" onclick="app.completeTask('${task.id}')">
                    <div class="property-content">
                        <div style="display:flex;gap:1rem;align-items:start">
                            <input type="checkbox" style="margin-top:0.25rem">
                            <div style="flex:1">
                                <div class="property-title">${task.title}</div>
                                <div style="font-size:0.875rem;color:var(--text-secondary);margin-top:0.5rem">
                                    ${task.description}
                                </div>
                                <div style="margin-top:0.5rem;font-size:0.75rem">
                                    <span style="color:${task.priority === 'high' ? 'var(--color-error)' : task.priority === 'medium' ? 'var(--color-warning)' : 'var(--text-secondary)'}">
                                        <i class="fas fa-flag"></i>
                                        ${task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('') || '<p>Nenhuma tarefa pendente</p>'}
        `;
        
    } catch (error) {
        console.error('Tasks error:', error);
    }
}

async function completeTask(taskId) {
    try {
        await supabase
            .from('tasks')
            .update({ completed: true })
            .eq('id', taskId);
        
        await addXP(CONFIG.XP_VALUES.LEAD_CONTACT);
        showToast('Tarefa Concluída!', '+10 XP', 'success');
        playSound('success');
        
        // Reload tasks
        await loadDailyTasks(document.getElementById('coaching-content'));
        
    } catch (error) {
        console.error('Error completing task:', error);
    }
}

async function loadPerformanceAnalysis(container) {
    container.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> A analisar performance...';
    
    try {
        const { data } = await supabase.functions.invoke('ai-coaching', {
            body: {
                action: 'analyze_performance',
                user_id: currentUser.id
            }
        });
        
        container.innerHTML = `
            <div class="chat-container">
                <div class="chat-messages">
                    <div class="chat-message">
                        <img class="chat-avatar" src="https://ui-avatars.com/api/?name=AI+Coach&background=D4AF37&color=0A0E27">
                        <div class="chat-bubble">
                            ${data.analysis}
                        </div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <input type="text" class="chat-input" id="coach-question" placeholder="Faça uma pergunta ao coach...">
                    <button class="chat-send-btn" onclick="app.askCoach()">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Analysis error:', error);
        container.innerHTML = '<p>Erro na análise de performance</p>';
    }
}

// ============================================================================
// MODULE 4: AI LEGAL ASSISTANT (RAG)
// ============================================================================

async function openLegalModule() {
    const modal = createModal('Assistente Legal IA', `
        <div class="chat-container">
            <div class="chat-messages" id="legal-chat-messages">
                <div class="chat-message">
                    <img class="chat-avatar" src="https://ui-avatars.com/api/?name=Legal+AI&background=D4AF37&color=0A0E27">
                    <div class="chat-bubble">
                        Olá! Sou o seu assistente legal especializado em imobiliário português. 
                        Posso ajudar com IMT, IMI, contratos, fiscalidade e legislação. Como posso ajudar?
                    </div>
                </div>
            </div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="legal-question" placeholder="Ex: Como calcular IMT para imóvel de 500k?">
                <button class="chat-send-btn" onclick="app.askLegalQuestion()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
        <div style="margin-top:1.5rem">
            <h4 style="margin-bottom:1rem">Perguntas Frequentes:</h4>
            <button class="btn btn-secondary" onclick="app.askLegalQuestion('Como calcular IMT?')" style="margin:0.5rem;font-size:0.75rem">
                Cálculo IMT
            </button>
            <button class="btn btn-secondary" onclick="app.askLegalQuestion('Que documentos são necessários para venda?')" style="margin:0.5rem;font-size:0.75rem">
                Documentos Venda
            </button>
            <button class="btn btn-secondary" onclick="app.askLegalQuestion('Impostos sobre ganhos de capital?')" style="margin:0.5rem;font-size:0.75rem">
                Mais-Valias
            </button>
        </div>
    `);
    
    showModal(modal);
}

async function askLegalQuestion(predefinedQuestion) {
    const input = document.getElementById('legal-question');
    const question = predefinedQuestion || input.value;
    
    if (!question) return;
    
    const messagesContainer = document.getElementById('legal-chat-messages');
    
    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML = `
        <img class="chat-avatar" src="${document.getElementById('user-avatar').src}">
        <div class="chat-bubble">${question}</div>
    `;
    messagesContainer.appendChild(userMsg);
    
    // Add loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'chat-message';
    loadingMsg.innerHTML = `
        <img class="chat-avatar" src="https://ui-avatars.com/api/?name=Legal+AI&background=D4AF37&color=0A0E27">
        <div class="chat-bubble">
            <div class="loading-dots"><span></span><span></span><span></span></div>
        </div>
    `;
    messagesContainer.appendChild(loadingMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    try {
        const { data } = await supabase.functions.invoke('ai-assistant', {
            body: {
                action: 'legal_query',
                question: question
            }
        });
        
        // Remove loading, add AI response
        loadingMsg.remove();
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-message';
        aiMsg.innerHTML = `
            <img class="chat-avatar" src="https://ui-avatars.com/api/?name=Legal+AI&background=D4AF37&color=0A0E27">
            <div class="chat-bubble">${data.answer}</div>
        `;
        messagesContainer.appendChild(aiMsg);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        input.value = '';
        await addXP(CONFIG.XP_VALUES.PROPERTY_VIEW);
        
    } catch (error) {
        console.error('Legal query error:', error);
        loadingMsg.remove();
    }
}

// ============================================================================
// MODULE 5: GAMIFICATION & TEAMS
// ============================================================================

async function openGamificationModule() {
    const modal = createModal('Gamificação & Equipas', `
        <div class="tabs">
            <button class="tab active" onclick="app.switchGamificationTab('rankings')">Rankings</button>
            <button class="tab" onclick="app.switchGamificationTab('championships')">Campeonatos</button>
            <button class="tab" onclick="app.switchGamificationTab('badges')">Badges</button>
            <button class="tab" onclick="app.switchGamificationTab('feed')">Feed Social</button>
        </div>
        <div id="gamification-content"></div>
    `, '1200px');
    
    showModal(modal);
    switchGamificationTab('rankings');
}

async function switchGamificationTab(tab) {
    const content = document.getElementById('gamification-content');
    
    if (tab === 'rankings') {
        await loadRankings(content);
    } else if (tab === 'championships') {
        await loadChampionships(content);
    } else if (tab === 'badges') {
        await loadBadges(content);
    } else if (tab === 'feed') {
        await loadSocialFeed(content);
    }
}

async function loadRankings(container) {
    try {
        const { data: rankings } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, xp, level')
            .order('xp', { ascending: false })
            .limit(50);
        
        const userRank = rankings.findIndex(r => r.id === currentUser.id) + 1;
        
        container.innerHTML = `
            <div class="stat-card" style="margin-bottom:1.5rem">
                <div class="stat-value">#${userRank}</div>
                <div class="stat-label">Sua Posição Global</div>
            </div>
            ${rankings.map((user, index) => `
                <div class="leaderboard-item ${user.id === currentUser.id ? 'style="background:rgba(212,175,55,0.2)"' : ''}">
                    <div class="leaderboard-rank ${index === 0 ? 'top-1' : index === 1 ? 'top-2' : index === 2 ? 'top-3' : ''}">
                        ${index + 1}
                    </div>
                    <img class="leaderboard-avatar" src="${user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}`}">
                    <div class="leaderboard-info">
                        <div class="leaderboard-name">${user.full_name}</div>
                        <div class="leaderboard-stats">Nível ${user.level}</div>
                    </div>
                    <div class="leaderboard-score">${user.xp.toLocaleString('pt-PT')} XP</div>
                </div>
            `).join('')}
        `;
        
    } catch (error) {
        console.error('Rankings error:', error);
    }
}

async function loadChampionships(container) {
    const championships = Object.entries(CONFIG.CHAMPIONSHIPS);
    
    container.innerHTML = championships.map(([key, name]) => `
        <div class="property-card" style="margin-bottom:1rem;cursor:pointer" onclick="app.viewChampionship('${key}')">
            <div class="property-content">
                <div class="property-title">${name}</div>
                <div class="property-location">
                    <i class="fas fa-users"></i>
                    Ver classificação completa
                </div>
            </div>
        </div>
    `).join('');
}

async function loadBadges(container) {
    try {
        const { data: userBadges } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', currentUser.id);
        
        const unlockedIds = userBadges.map(b => b.badge_id);
        
        const { data: allBadges } = await supabase
            .from('badges')
            .select('*')
            .order('rarity', { ascending: false });
        
        container.innerHTML = `
            <div style="margin-bottom:1.5rem">
                <div class="stat-value">${unlockedIds.length}/${allBadges.length}</div>
                <div class="stat-label">Badges Desbloqueados</div>
            </div>
            <div class="badge-grid">
                ${allBadges.map(badge => `
                    <div class="badge-item ${!unlockedIds.includes(badge.id) ? 'locked' : ''}">
                        <div class="badge-icon">${badge.icon}</div>
                        <div class="badge-name">${badge.name}</div>
                    </div>
                `).join('')}
            </div>
        `;
        
    } catch (error) {
        console.error('Badges error:', error);
    }
}

async function loadSocialFeed(container) {
    try {
        const { data: activities } = await supabase
            .from('activity_feed')
            .select(`
                *,
                profiles:user_id (full_name, avatar_url)
            `)
            .order('created_at', { ascending: false })
            .limit(50);
        
        container.innerHTML = activities.map(activity => `
            <div class="property-card" style="margin-bottom:1rem">
                <div class="property-content">
                    <div style="display:flex;gap:1rem;align-items:start">
                        <img style="width:48px;height:48px;border-radius:50%" src="${activity.profiles.avatar_url}">
                        <div style="flex:1">
                            <div style="font-weight:600">${activity.profiles.full_name}</div>
                            <div style="font-size:0.875rem;color:var(--text-secondary);margin-top:0.25rem">
                                ${activity.description}
                            </div>
                            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.5rem">
                                ${new Date(activity.created_at).toLocaleString('pt-PT')}
                            </div>
                        </div>
                        ${activity.xp ? `
                            <div style="font-size:0.875rem;color:var(--gold)">
                                +${activity.xp} XP
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Feed error:', error);
    }
}

// ============================================================================
// MODULE 6: IDEALISTA AD GENERATOR (GEMINI VISION)
// ============================================================================

async function openIdealistaModule() {
    const modal = createModal('Gerador Anúncios Idealista IA', `
        <div class="form-group">
            <label class="form-label">Carregar Fotos do Imóvel</label>
            <div class="file-upload" onclick="document.getElementById('property-images').click()">
                <i class="fas fa-images"></i>
                <div class="file-upload-text">Clique para selecionar fotos (máx 10)</div>
                <input type="file" id="property-images" multiple accept="image/*" style="display:none" onchange="app.previewPropertyImages(event)">
            </div>
            <div id="image-previews" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:1rem;margin-top:1rem"></div>
        </div>
        <div class="form-group">
            <label class="form-label">Tipo de Imóvel</label>
            <select id="idealista-property-type" class="form-select">
                <option value="apartamento">Apartamento</option>
                <option value="moradia">Moradia</option>
                <option value="penthouse">Penthouse</option>
                <option value="villa">Villa de Luxo</option>
            </select>
        </div>
        <div class="form-group">
            <label class="form-label">Características Especiais</label>
            <textarea id="idealista-features" class="form-textarea" placeholder="Ex: Vista mar, piscina infinity, acabamentos premium..."></textarea>
        </div>
        <button class="btn btn-primary" onclick="app.generateIdealistaAd()">
            <i class="fas fa-magic"></i>
            Gerar Anúncio com IA Vision
        </button>
        <div id="generated-ad" style="margin-top:2rem"></div>
    `);
    
    showModal(modal);
}

function previewPropertyImages(event) {
    const files = Array.from(event.target.files);
    const container = document.getElementById('image-previews');
    
    container.innerHTML = files.map((file, index) => {
        const url = URL.createObjectURL(file);
        return `
            <div style="position:relative">
                <img src="${url}" style="width:100%;height:100px;object-fit:cover;border-radius:8px">
                <div style="position:absolute;top:4px;right:4px;background:var(--color-error);width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer" onclick="this.parentElement.remove()">
                    <i class="fas fa-times" style="font-size:0.75rem"></i>
                </div>
            </div>
        `;
    }).join('');
}

async function generateIdealistaAd() {
    const images = document.getElementById('property-images').files;
    const propertyType = document.getElementById('idealista-property-type').value;
    const features = document.getElementById('idealista-features').value;
    
    if (images.length === 0) {
        showToast('Erro', 'Selecione pelo menos uma foto', 'error');
        return;
    }
    
    const resultDiv = document.getElementById('generated-ad');
    resultDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> A analisar imagens e gerar anúncio...';
    
    try {
        // Convert images to base64
        const imageData = [];
        for (const image of images) {
            const base64 = await fileToBase64(image);
            imageData.push(base64);
        }
        
        // Call Gemini Vision via Edge Function
        const { data } = await supabase.functions.invoke('ai-idealista', {
            body: {
                images: imageData,
                property_type: propertyType,
                features: features
            }
        });
        
        resultDiv.innerHTML = `
            <div class="property-card">
                <div class="property-content">
                    <h3 style="margin-bottom:1rem">Anúncio Gerado:</h3>
                    <div class="form-group">
                        <label class="form-label">Título</label>
                        <input type="text" class="form-input" value="${data.title}" readonly>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Descrição</label>
                        <textarea class="form-textarea" style="min-height:200px" readonly>${data.description}</textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Destaques</label>
                        <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
                            ${data.highlights.map(h => `
                                <span style="background:rgba(212,175,55,0.2);padding:0.5rem 1rem;border-radius:50px;font-size:0.75rem">
                                    ${h}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="app.copyToClipboard('${data.description.replace(/'/g, "\\'")}')">
                        <i class="fas fa-copy"></i>
                        Copiar Anúncio
                    </button>
                </div>
            </div>
        `;
        
        await addXP(CONFIG.XP_VALUES.PROPOSAL_SENT);
        showToast('Sucesso', 'Anúncio gerado com IA!', 'success');
        
    } catch (error) {
        console.error('Idealista generation error:', error);
        resultDiv.innerHTML = '<p style="color:var(--color-error)">Erro ao gerar anúncio</p>';
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// ============================================================================
// MODULE 7: DOCUMENT SCANNER (PDF + CAMERA)
// ============================================================================

async function openScannerModule() {
    const modal = createModal('Scanner de Documentos', `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
            <button class="btn btn-primary" onclick="app.startCameraCapture()">
                <i class="fas fa-camera"></i>
                Usar Câmara
            </button>
            <button class="btn btn-secondary" onclick="document.getElementById('pdf-upload').click()">
                <i class="fas fa-file-pdf"></i>
                Upload PDF
            </button>
        </div>
        <input type="file" id="pdf-upload" accept="application/pdf,image/*" style="display:none" onchange="app.processScan nedDocument(event)">
        <div id="scanner-preview"></div>
        <div id="scanner-results"></div>
    `);
    
    showModal(modal);
}

async function startCameraCapture() {
    const preview = document.getElementById('scanner-preview');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        
        preview.innerHTML = `
            <video id="camera-stream" autoplay playsinline style="width:100%;border-radius:12px"></video>
            <button class="btn btn-primary" onclick="app.capturePhoto()" style="margin-top:1rem">
                <i class="fas fa-camera"></i>
                Capturar
            </button>
            <button class="btn btn-secondary" onclick="app.stopCamera()" style="margin-top:1rem">
                <i class="fas fa-times"></i>
                Cancelar
            </button>
        `;
        
        document.getElementById('camera-stream').srcObject = stream;
        
    } catch (error) {
        console.error('Camera error:', error);
        showToast('Erro', 'Não foi possível aceder à câmara', 'error');
    }
}

async function capturePhoto() {
    const video = document.getElementById('camera-stream');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    stopCamera();
    
    await processScannedImage(imageData);
}

function stopCamera() {
    const video = document.getElementById('camera-stream');
    if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    document.getElementById('scanner-preview').innerHTML = '';
}

async function processScannedDocument(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const resultsDiv = document.getElementById('scanner-results');
    resultsDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> A processar documento...';
    
    try {
        const base64 = await fileToBase64(file);
        
        // Process with Gemini Vision OCR
        const { data } = await supabase.functions.invoke('ai-assistant', {
            body: {
                action: 'ocr_document',
                image: base64,
                document_type: 'contract' // Auto-detect
            }
        });
        
        resultsDiv.innerHTML = `
            <div class="property-card">
                <div class="property-content">
                    <h4 style="margin-bottom:1rem">Dados Extraídos:</h4>
                    <div style="background:rgba(26,34,71,0.6);padding:1rem;border-radius:8px;font-family:monospace;font-size:0.875rem;white-space:pre-wrap">
${JSON.stringify(data.extracted_data, null, 2)}
                    </div>
                    <button class="btn btn-primary" onclick="app.saveDocumentData(${JSON.stringify(data.extracted_data)})" style="margin-top:1rem">
                        <i class="fas fa-save"></i>
                        Guardar Dados
                    </button>
                </div>
            </div>
        `;
        
        await addXP(CONFIG.XP_VALUES.LEAD_CONTACT);
        
    } catch (error) {
        console.error('OCR error:', error);
        resultsDiv.innerHTML = '<p style="color:var(--color-error)">Erro ao processar documento</p>';
    }
}

async function processScannedImage(imageData) {
    const resultsDiv = document.getElementById('scanner-results');
    resultsDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> A processar imagem...';
    
    try {
        const { data } = await supabase.functions.invoke('ai-assistant', {
            body: {
                action: 'ocr_document',
                image: imageData.split(',')[1],
                document_type: 'auto'
            }
        });
        
        resultsDiv.innerHTML = `
            <div class="property-card">
                <div class="property-content">
                    <img src="${imageData}" style="width:100%;border-radius:8px;margin-bottom:1rem">
                    <h4 style="margin-bottom:1rem">Texto Extraído:</h4>
                    <div style="background:rgba(26,34,71,0.6);padding:1rem;border-radius:8px;font-size:0.875rem">
                        ${data.text}
                    </div>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('OCR error:', error);
    }
}

// ============================================================================
// MODULE 8: STRIPE SUBSCRIPTION
// ============================================================================

async function openSubscriptionModule() {
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_end_date')
        .eq('id', currentUser.id)
        .single();
    
    const isPremium = profile?.subscription_tier === 'premium';
    
    const modal = createModal('Assinatura Premium', `
        <div style="text-align:center;margin-bottom:2rem">
            ${isPremium ? `
                <div class="premium-badge" style="font-size:1rem;padding:1rem 2rem">
                    <i class="fas fa-gem"></i>
                    PREMIUM ATIVO
                </div>
                <p style="margin-top:1rem;color:var(--text-secondary)">
                    Válido até: ${new Date(profile.subscription_end_date).toLocaleDateString('pt-PT')}
                </p>
            ` : `
                <div class="property-price" style="font-size:3rem">3,99€</div>
                <div style="color:var(--text-secondary)">por mês</div>
            `}
        </div>
        
        <div class="property-card" style="margin-bottom:1rem">
            <div class="property-content">
                <h4 style="margin-bottom:1rem">Premium Inclui:</h4>
                <div style="display:grid;gap:0.75rem">
                    <div style="display:flex;align-items:center;gap:0.75rem">
                        <i class="fas fa-check" style="color:var(--gold)"></i>
                        <span>Acesso completo API Casafari</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                        <i class="fas fa-check" style="color:var(--gold)"></i>
                        <span>Requests IA ilimitados (Gemini)</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                        <i class="fas fa-check" style="color:var(--gold)"></i>
                        <span>Análise avançada de leads</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                        <i class="fas fa-check" style="color:var(--gold)"></i>
                        <span>Coaching personalizado diário</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                        <i class="fas fa-check" style="color:var(--gold)"></i>
                        <span>Geração ilimitada de anúncios</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                        <i class="fas fa-check" style="color:var(--gold)"></i>
                        <span>Suporte prioritário 24/7</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                        <i class="fas fa-check" style="color:var(--gold)"></i>
                        <span>Badge Premium no perfil</span>
                    </div>
                </div>
            </div>
        </div>
        
        ${!isPremium ? `
            <button class="btn btn-primary" onclick="app.initStripeCheckout()" style="width:100%;font-size:1.125rem;padding:1.5rem">
                <i class="fas fa-credit-card"></i>
                Assinar Premium - 3,99€/mês
            </button>
            <p style="text-align:center;margin-top:1rem;font-size:0.75rem;color:var(--text-secondary)">
                Cancele quando quiser. Processamento seguro via Stripe.
            </p>
        ` : `
            <button class="btn btn-secondary" onclick="app.manageBilling()" style="width:100%">
                <i class="fas fa-cog"></i>
                Gerir Assinatura
            </button>
        `}
    `);
    
    showModal(modal);
}

async function initStripeCheckout() {
    if (!CONFIG.STRIPE_PUBLISHABLE_KEY) {
        showToast('Erro', 'Stripe não configurado', 'error');
        return;
    }
    
    try {
        // Load Stripe
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = async () => {
            const stripe = window.Stripe(CONFIG.STRIPE_PUBLISHABLE_KEY);
            
            // Create checkout session
            const { data } = await supabase.functions.invoke('create-checkout-session', {
                body: {
                    user_id: currentUser.id,
                    email: currentUser.email
                }
            });
            
            // Redirect to Stripe checkout
            await stripe.redirectToCheckout({
                sessionId: data.session_id
            });
        };
        document.head.appendChild(script);
        
    } catch (error) {
        console.error('Stripe error:', error);
        showToast('Erro', 'Falha ao iniciar pagamento', 'error');
    }
}

// ============================================================================
// GAMIFICATION SYSTEM
// ============================================================================

async function addXP(xp) {
    if (!supabase || !currentUser) return;
    
    try {
        // Get current profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('xp, level')
            .eq('id', currentUser.id)
            .single();
        
        const newXP = profile.xp + xp;
        const newLevel = calculateLevel(newXP);
        const leveledUp = newLevel > profile.level;
        
        // Update profile
        await supabase
            .from('profiles')
            .update({ xp: newXP, level: newLevel })
            .eq('id', currentUser.id);
        
        // Update UI
        document.getElementById('stat-xp').textContent = newXP;
        updateUserLevel(newXP, newLevel);
        
        // Show level up animation
        if (leveledUp) {
            showLevelUpAnimation(newLevel);
            playSound('level-up');
            triggerConfetti();
            
            // Check for new badges
            await checkBadgeUnlocks(newLevel, newXP);
        }
        
        // Add to activity feed
        await supabase.from('activity_feed').insert({
            user_id: currentUser.id,
            description: `Ganhou ${xp} XP`,
            xp: xp
        });
        
    } catch (error) {
        console.error('XP error:', error);
    }
}

function calculateLevel(xp) {
    for (let i = CONFIG.LEVELS.length - 1; i >= 0; i--) {
        if (xp >= CONFIG.LEVELS[i].xp) {
            return CONFIG.LEVELS[i].level;
        }
    }
    return 1;
}

function showLevelUpAnimation(level) {
    const levelConfig = CONFIG.LEVELS.find(l => l.level === level);
    
    showToast(
        '🎉 LEVEL UP!',
        `Nível ${level}: ${levelConfig.title}`,
        'success'
    );
}

async function checkBadgeUnlocks(level, xp) {
    const badges = [];
    
    // Level-based badges
    if (level === 5) badges.push('specialist');
    if (level === 10) badges.push('diamond_agent');
    
    // XP-based badges
    if (xp >= 1000) badges.push('thousand_xp');
    if (xp >= 10000) badges.push('ten_thousand_xp');
    
    for (const badgeId of badges) {
        // Check if already unlocked
        const { data: existing } = await supabase
            .from('user_badges')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('badge_id', badgeId)
            .single();
        
        if (!existing) {
            await supabase.from('user_badges').insert({
                user_id: currentUser.id,
                badge_id: badgeId
            });
            
            showBadgeUnlock(badgeId);
        }
    }
}

function showBadgeUnlock(badgeId) {
    showToast(
        '🏆 Badge Desbloqueado!',
        `Novo badge: ${badgeId}`,
        'success'
    );
    triggerConfetti();
}

// ============================================================================
// CONFETTI ANIMATION
// ============================================================================

function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const colors = ['#D4AF37', '#F4D03F', '#8B5CF6', '#10B981'];
    
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 4,
            vy: Math.random() * 3 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
            
            if (p.y > canvas.height) {
                particles.splice(index, 1);
            }
        });
        
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function createModal(title, content, maxWidth = '900px') {
    return `
        <div class="modal" style="max-width:${maxWidth}">
            <div class="modal-header">
                <div class="modal-title">${title}</div>
                <div class="modal-close" onclick="app.closeModal()">
                    <i class="fas fa-times"></i>
                </div>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
}

function showModal(modalHTML) {
    const overlay = document.getElementById('modal-overlay');
    overlay.innerHTML = modalHTML;
    overlay.classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    setTimeout(() => {
        document.getElementById('modal-overlay').innerHTML = '';
    }, 300);
}

function showToast(title, message, type = 'info') {
    const toast = document.getElementById('toast');
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">
                <i class="fas ${icons[type]}"></i>
            </div>
            <div class="toast-text">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function playSound(type) {
    const sound = document.getElementById(`sound-${type}`);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed:', e));
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copiado!', 'Texto copiado para clipboard', 'success');
    });
}

async function checkPremium() {
    const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', currentUser.id)
        .single();
    
    return profile?.subscription_tier === 'premium';
}

function showPremiumRequired() {
    const modal = createModal('Premium Necessário', `
        <div style="text-align:center;padding:2rem">
            <div class="premium-badge" style="font-size:1.5rem;padding:1.5rem 3rem;margin-bottom:2rem">
                <i class="fas fa-gem"></i>
                PREMIUM
            </div>
            <p style="margin-bottom:2rem;font-size:1.125rem">
                Esta funcionalidade requer assinatura Premium
            </p>
            <button class="btn btn-primary" onclick="app.openModule('subscription')" style="font-size:1.125rem;padding:1.5rem 3rem">
                <i class="fas fa-star"></i>
                Ver Planos Premium
            </button>
        </div>
    `);
    
    showModal(modal);
}

// ============================================================================
// APP INITIALIZATION & GLOBAL OBJECT
// ============================================================================

const app = {
    showDashboard: () => {
        closeModal();
        loadDashboard();
    },
    
    openModule: (module) => {
        const modules = {
            'ai-search': openAISearchModule,
            'casafari': openCasafariModule,
            'coaching': openCoachingModule,
            'legal': openLegalModule,
            'gamification': openGamificationModule,
            'idealista': openIdealistaModule,
            'scanner': openScannerModule,
            'subscription': openSubscriptionModule
        };
        
        if (modules[module]) {
            modules[module]();
        }
    },
    
    closeModal,
    showToast,
    playSound,
    executeAISearch,
    switchCasafariTab,
    scoreLeadsWithAI,
    switchCoachingTab,
    createSMARTGoal,
    saveSMARTGoal,
    completeTask,
    askLegalQuestion,
    switchGamificationTab,
    generateIdealistaAd,
    previewPropertyImages,
    startCameraCapture,
    capturePhoto,
    stopCamera,
    processScannedDocument,
    initStripeCheckout,
    copyToClipboard,
    
    toggleNotifications: () => {
        showToast('Notificações', 'Sem novas notificações', 'info');
    },
    
    toggleSettings: () => {
        showToast('Configurações', 'Em desenvolvimento', 'info');
    },
    
    toggleProfile: () => {
        showToast('Perfil', 'Em desenvolvimento', 'info');
    }
};

// Make app globally available
window.app = app;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    initSupabase();
    initGoogleAuth();
    
    // Setup Google login button
    document.getElementById('google-login-btn').addEventListener('click', signInWithGoogle);
    
    // Setup global search
    document.getElementById('global-search').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = e.target.value;
            if (query) {
                showToast('Pesquisa', `A pesquisar: ${query}`, 'info');
            }
        }
    });
});
