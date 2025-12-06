// Coach Imobiliário MVP - JavaScript Completo

// Mock Data - 20+ Properties
const mockProperties = [
    { id: 1, title: 'Apartamento T3 Luxo', price: '350.000€', location: 'Lisboa, Alvalade', type: 'apartamento', beds: 3, baths: 2, area: 120 },
    { id: 2, title: 'Moradia T4 com Piscina', price: '580.000€', location: 'Cascais, Estoril', type: 'casa', beds: 4, baths: 3, area: 250 },
    { id: 3, title: 'Apartamento T2 Centro', price: '220.000€', location: 'Porto, Boavista', type: 'apartamento', beds: 2, baths: 1, area: 85 },
    { id: 4, title: 'Terreno Urbanízável', price: '150.000€', location: 'Setúbal, Palmela', type: 'terreno', beds: 0, baths: 0, area: 500 },
    { id: 5, title: 'Casa T5 Renovada', price: '450.000€', location: 'Braga, Centro', type: 'casa', beds: 5, baths: 3, area: 280 },
    { id: 6, title: 'Apartamento T1 Moderno', price: '180.000€', location: 'Coimbra, Sé Nova', type: 'apartamento', beds: 1, baths: 1, area: 55 },
    { id: 7, title: 'Moradia Geminada T3', price: '320.000€', location: 'Faro, Quarteira', type: 'casa', beds: 3, baths: 2, area: 150 },
    { id: 8, title: 'Apartamento T4 Vista Mar', price: '520.000€', location: 'Algarve, Albufeira', type: 'apartamento', beds: 4, baths: 3, area: 180 },
    { id: 9, title: 'Quinta com 2 Hectares', price: '890.000€', location: 'Santarem, Tomar', type: 'terreno', beds: 0, baths: 0, area: 20000 },
    { id: 10, title: 'Casa T3 Tradicional', price: '275.000€', location: 'Aveiro, Ílhavo', type: 'casa', beds: 3, baths: 2, area: 140 },
    { id: 11, title: 'Apartamento T2 Novo', price: '240.000€', location: 'Lisboa, Parque das Nações', type: 'apartamento', beds: 2, baths: 2, area: 90 },
    { id: 12, title: 'Moradia T4 Luxo', price: '650.000€', location: 'Sintra, Colares', type: 'casa', beds: 4, baths: 4, area: 300 },
    { id: 13, title: 'Loft T0+1', price: '195.000€', location: 'Porto, Ribeira', type: 'apartamento', beds: 1, baths: 1, area: 60 },
    { id: 14, title: 'Terreno Rústico', price: '85.000€', location: 'Viseu, Vouzela', type: 'terreno', beds: 0, baths: 0, area: 1500 },
    { id: 15, title: 'Apartamento T3 Duplex', price: '380.000€', location: 'Lisboa, Campo de Ourique', type: 'apartamento', beds: 3, baths: 2, area: 135 },
    { id: 16, title: 'Casa T6 Senhorial', price: '780.000€', location: 'Porto, Foz', type: 'casa', beds: 6, baths: 4, area: 400 },
    { id: 17, title: 'Apartamento T2 Renovado', price: '260.000€', location: 'Braga, Maximinos', type: 'apartamento', beds: 2, baths: 2, area: 95 },
    { id: 18, title: 'Moradia T3 com Jardim', price: '295.000€', location: 'Leiria, Marinha Grande', type: 'casa', beds: 3, baths: 2, area: 160 },
    { id: 19, title: 'Apartamento T3 Garagem', price: '310.000€', location: 'Funchal, Madeira', type: 'apartamento', beds: 3, baths: 2, area: 110 },
    { id: 20, title: 'Casa T4 com Quintal', price: '420.000€', location: 'Guimarães, Centro', type: 'casa', beds: 4, baths: 3, area: 220 },
    { id: 21, title: 'Penthouse T4 Premium', price: '890.000€', location: 'Lisboa, Avenidas Novas', type: 'apartamento', beds: 4, baths: 3, area: 200 },
    { id: 22, title: 'Moradia T5 Piscina', price: '750.000€', location: 'Cascais, Parede', type: 'casa', beds: 5, baths: 4, area: 350 }
];

const mockRanking = [
    { name: 'João Silva', points: 2850, position: 1 },
    { name: 'Maria Santos', points: 2640, position: 2 },
    { name: 'Pedro Costa', points: 2420, position: 3 },
    { name: 'Ana Rodrigues', points: 2180, position: 4 },
    { name: 'Carlos Oliveira', points: 1950, position: 5 }
];

const mockTools = [
    { name: 'Calculadora Financiamento', icon: '📊', description: 'Simule financiamentos' },
    { name: 'Gerador Contratos', icon: '📝', description: 'Crie contratos automáticos' },
    { name: 'Análise Mercado', icon: '📈', description: 'Analise tendências' },
    { name: 'CRM Clientes', icon: '👥', description: 'Gerencie seus clientes' },
    { name: 'Agendamento', icon: '📅', description: 'Organize visitas' },
    { name: 'Relatórios', icon: '📊', description: 'Gere relatórios' }
];

const mockPlans = [
    { name: 'Básico', price: '29€', period: '/mês', features: ['5 imóveis ativos', 'Suporte email', 'Ferramentas básicas'] },
    { name: 'Profissional', price: '79€', period: '/mês', features: ['20 imóveis ativos', 'Coach IA ilimitado', 'Todas as ferramentas', 'Suporte prioritário'], featured: true },
    { name: 'Empresa', price: '199€', period: '/mês', features: ['Imóveis ilimitados', 'Múltiplas contas', 'API acesso', 'Gestor dedicado'] }
];

const app = {
    init() {
        this.setupEventListeners();
        this.renderProperties(mockProperties);
        this.renderRanking();
        this.renderTools();
        this.renderSubscriptionPlans();
    },

    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
                
        // Inicializar sistema de onboarding
        if (window.OnboardingSystem) {
            OnboardingSystem.init();
        }
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchPage(e.target.dataset.page);
            });
        });

        const searchLocation = document.getElementById('searchLocation');
        const filterType = document.getElementById('filterType');
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');

        [searchLocation, filterType, minPrice, maxPrice].forEach(el => {
            if (el) el.addEventListener('input', () => this.filterProperties());
        });

        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
    },

    login() {
        const loginScreen = document.getElementById('loginScreen');
        const appContainer = document.getElementById('appContainer');
        if (loginScreen) loginScreen.style.display = 'none';
        if (appContainer) appContainer.classList.add('active');
    },

    switchPage(pageName) {
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.remove('active');
        });
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const page = document.getElementById(pageName);
        if (page) page.classList.add('active');
        
        const navItem = document.querySelector(`[data-page="${pageName}"]`);
        if (navItem) navItem.classList.add('active');
    },

    renderProperties(properties) {
        const grid = document.getElementById('propertiesGrid');
        if (!grid) return;
        
        grid.innerHTML = properties.map(prop => `
            <div class="property-card">
                <div class="property-image">🏠</div>
                <div class="property-content">
                    <div class="property-title">${prop.title}</div>
                    <div class="property-price">${prop.price}</div>
                    <div class="property-location">📍 ${prop.location}</div>
                    <div class="property-features">
                        ${prop.beds > 0 ? `<span>🛏️ ${prop.beds} quartos</span>` : ''}
                        ${prop.baths > 0 ? `<span>🚿 ${prop.baths} WC</span>` : ''}
                        <span>📏 ${prop.area}m²</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    filterProperties() {
        const searchTerm = document.getElementById('searchLocation')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('filterType')?.value || '';
        const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
        const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;

        const filtered = mockProperties.filter(prop => {
            const price = parseFloat(prop.price.replace(/[^\d]/g, ''));
            const matchesLocation = prop.location.toLowerCase().includes(searchTerm);
            const matchesType = !typeFilter || prop.type === typeFilter;
            const matchesPrice = price >= minPrice && price <= maxPrice;
            return matchesLocation && matchesType && matchesPrice;
        });

        this.renderProperties(filtered);
    },

    renderRanking() {
        const rankingList = document.getElementById('rankingList');
        if (!rankingList) return;
        
        rankingList.innerHTML = mockRanking.map(member => `
            <div class="ranking-item">
                <div class="ranking-position">#${member.position}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${member.name}</div>
                    <div class="ranking-points">${member.points} pontos</div>
                </div>
            </div>
        `).join('');
    },

    renderTools() {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;
        
        toolsGrid.innerHTML = mockTools.map(tool => `
            <div class="tool-card">
                <div class="tool-icon">${tool.icon}</div>
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description}</div>
            </div>
        `).join('');
    },

    renderSubscriptionPlans() {
        const plansContainer = document.getElementById('subscriptionPlans');
        if (!plansContainer) return;
        
        plansContainer.innerHTML = mockPlans.map(plan => `
            <div class="plan-card ${plan.featured ? 'featured' : ''}">
                <div class="plan-name">${plan.name}</div>
                <div class="plan-price">${plan.price}</div>
                <div class="plan-period">${plan.period}</div>
                <div class="plan-features">
                    ${plan.features.map(f => `<div class="plan-feature">✓ ${f}</div>`).join('')}
                </div>
                <button class="btn-plan">Assinar</button>
            </div>
        `).join('');
    }
};

function sendMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!input || !messagesContainer || !input.value.trim()) return;
    
    const userMessage = input.value.trim();
    
    messagesContainer.innerHTML += `
        <div class="message user">${userMessage}</div>
    `;
    
    input.value = '';
    
    setTimeout(() => {
        const responses = [
            'Entendo sua questão. Posso ajudar com análise de mercado.',
            'Excelente pergunta! Recomendo focar em bairros em crescimento.',
            'Baseado nos dados, sugiro propriedades na zona de Lisboa.',
            'Posso gerar um relatório detalhado sobre isso.',
            'Essa é uma ótima estratégia. Vamos explorar mais opções.'
        ];
        const response = responses[Math.floor(Math.random() * responses.length)];
        
        messagesContainer.innerHTML += `
            <div class="message bot">${response}</div>
        `;
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

// ===========================================
// SISTEMA DE ONBOARDING E DISC
// ===========================================

const OnboardingSystem = {
    currentStep: 0,
    discAnswers: {},
    
    questions: [
        {
            category: 'D',
            text: 'Prefiro ser direto e objetivo nas conversas de negócios',
            weight: 1
        },
        {
            category: 'I',
            text: 'Gosto de conhecer novas pessoas e expandir minha rede',
            weight: 1
        },
        {
            category: 'S',
            text: 'Valorizo relacionamentos de longo prazo com meus clientes',
            weight: 1
        },
        {
            category: 'C',
            text: 'Analiso detalhadamente todos os dados antes de tomar decisões',
            weight: 1
        },
        {
            category: 'D',
            text: 'Encaro desafios como oportunidades de crescimento',
            weight: 1
        },
        {
            category: 'I',
            text: 'Sou otimista e entusiasta ao apresentar imóveis',
            weight: 1
        },
        {
            category: 'S',
            text: 'Prefiro trabalhar em equipe do que sozinho',
            weight: 1
        },
        {
            category: 'C',
            text: 'Organizo meticulosamente minha agenda e documentos',
            weight: 1
        },
        {
            category: 'D',
            text: 'Tomo decisões rapidamente mesmo sob pressão',
            weight: 1
        },
        {
            category: 'I',
            text: 'Uso humor e criatividade nas minhas apresentações',
            weight: 1
        },
        {
            category: 'S',
            text: 'Evito conflitos e busco sempre o consenso',
            weight: 1
        },
        {
            category: 'C',
            text: 'Valorizo precisão e qualidade acima da velocidade',
            weight: 1
        }
    ],
    
    init() {
        // Verificar se usuário já completou onboarding
        const onboardingComplete = localStorage.getItem('onboardingComplete');
        
        if (!onboardingComplete && window.supabaseService?.currentUser) {
            this.showSplashScreen();
        }
    },
    
    showSplashScreen() {
        const splash = `
            <div id="onboardingSplash" class="onboarding-overlay">
                <div class="onboarding-content">
                    <div class="splash-logo">
                        <span style="font-size: 64px;">🏠</span>
                        <h1>Coach Imobiliário</h1>
                    </div>
                    <h2>Bem-vindo ao Futuro do Mercado Imobiliário!</h2>
                    <p>Vamos configurar seu perfil de coaching personalizado</p>
                    <button onclick="OnboardingSystem.startDISC()" class="btn-primary btn-large">
                        Começar Avaliação DISC
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', splash);
    },
    
    startDISC() {
        document.getElementById('onboardingSplash').remove();
        this.currentStep = 0;
        this.discAnswers = { D: 0, I: 0, S: 0, C: 0 };
        this.renderDISCQuestion();
    },
    
    renderDISCQuestion() {
        const question = this.questions[this.currentStep];
        const progress = ((this.currentStep + 1) / this.questions.length) * 100;
        
        const questionHTML = `
            <div id="discQuestionnaire" class="onboarding-overlay">
                <div class="onboarding-content">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <p class="question-counter">Questão ${this.currentStep + 1} de ${this.questions.length}</p>
                    <h2 class="disc-question">${question.text}</h2>
                    <div class="disc-scale">
                        <button onclick="OnboardingSystem.answerDISC(1)" class="scale-btn">
                            <span class="scale-emoji">😐</span>
                            <span>Discordo</span>
                        </button>
                        <button onclick="OnboardingSystem.answerDISC(2)" class="scale-btn">
                            <span class="scale-emoji">🤔</span>
                            <span>Neutro</span>
                        </button>
                        <button onclick="OnboardingSystem.answerDISC(3)" class="scale-btn">
                            <span class="scale-emoji">👍</span>
                            <span>Concordo</span>
                        </button>
                        <button onclick="OnboardingSystem.answerDISC(4)" class="scale-btn">
                            <span class="scale-emoji">⭐</span>
                            <span>Muito!</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const existing = document.getElementById('discQuestionnaire');
        if (existing) existing.remove();
        
        document.body.insertAdjacentHTML('beforeend', questionHTML);
    },
    
    answerDISC(score) {
        const question = this.questions[this.currentStep];
        this.discAnswers[question.category] += score;
        
        this.currentStep++;
        
        if (this.currentStep < this.questions.length) {
            this.renderDISCQuestion();
        } else {
            this.completeDISC();
        }
    },
    
    async completeDISC() {
        document.getElementById('discQuestionnaire').remove();
        
        // Calcular perfil dominante
        const profile = Object.entries(this.discAnswers)
            .sort((a, b) => b[1] - a[1])[0][0];
        
        const profiles = {
            D: {
                name: 'Dominante',
                description: 'Você é decisivo, orientado a resultados e focado em conquistas. Seu estilo é direto e eficaz.',
                strengths: ['Liderança natural', 'Tomada de decisões rápida', 'Foco em resultados'],
                tips: ['Pratique escuta ativa', 'Desenvolva paciência', 'Valorize o processo']
            },
            I: {
                name: 'Influente',
                description: 'Você é comunicativo, entusiasta e excelente em criar conexões. Seu carisma é sua maior força.',
                strengths: ['Networking natural', 'Comunicação persuasiva', 'Otimismo contagiante'],
                tips: ['Foque em detalhes', 'Melhore follow-up', 'Organize sua agenda']
            },
            S: {
                name: 'Estável',
                description: 'Você é paciente, leal e excelente em construir relacionamentos duradouros. Sua empatia é notável.',
                strengths: ['Relacionamentos duradouros', 'Trabalho em equipe', 'Empatia natural'],
                tips: ['Seja mais assertivo', 'Aceite mudanças', 'Tome decisões rápidas']
            },
            C: {
                name: 'Consciencioso',
                description: 'Você é analítico, preciso e focado em qualidade. Sua atenção aos detalhes é excepcional.',
                strengths: ['Análise detalhada', 'Precisão técnica', 'Qualidade garantida'],
                tips: ['Acelere decisões', 'Aceite imperfeições', 'Seja mais flexível']
            }
        };
        
        const userProfile = profiles[profile];
        
        // Salvar no Supabase
        try {
            await window.supabaseService.saveUserProfile({
                disc_profile: profile,
                disc_scores: this.discAnswers,
                onboarding_complete: true
            });
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
        }
        
        localStorage.setItem('onboardingComplete', 'true');
        localStorage.setItem('discProfile', profile);
        
        this.showResults(userProfile, profile);
    },
    
    showResults(userProfile, profile) {
        const resultsHTML = `
            <div id="discResults" class="onboarding-overlay">
                <div class="onboarding-content">
                    <div class="result-badge">
                        <span class="profile-icon">${profile}</span>
                        <h1>Perfil ${userProfile.name}</h1>
                    </div>
                    <p class="profile-description">${userProfile.description}</p>
                    
                    <div class="profile-section">
                        <h3>💪 Seus Pontos Fortes:</h3>
                        <ul>
                            ${userProfile.strengths.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="profile-section">
                        <h3>📈 Dicas para Crescimento:</h3>
                        <ul>
                            ${userProfile.tips.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <button onclick="OnboardingSystem.finishOnboarding()" class="btn-primary btn-large">
                        Começar Minha Jornada! 🚀
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', resultsHTML);
    },
    
    finishOnboarding() {
        document.getElementById('discResults').remove();
        
        // Mostrar mensagem de boas-vindas
        const toast = document.createElement('div');
        toast.className = 'toast-success';
        toast.textContent = '✨ Perfil configurado com sucesso! Bem-vindo ao Coach Imobiliário!';
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
        
        // Recarregar app com perfil configurado
        location.reload();
    }
};

// Coach IA - Gemini AI Daily Plan Generation
async function generateDailyPlan() {
    try {
        const discProfile = localStorage.getItem('discProfile');
        const user = await window.supabaseService.getCurrentUser();
        
        if (!discProfile || !user) {
            console.log('Perfil DISC ou usuário não disponível');
            return;
        }

        // Mostrar loading
        const dailyPlanEl = document.getElementById('dailyPlan');
        if (dailyPlanEl) {
            dailyPlanEl.innerHTML = '<div class="loading-spinner">Gerando seu plano diário...</div>';
        }

        // Prompt personalizado baseado no perfil DISC
        const prompt = `Você é um coach imobiliário especializado. Crie um plano de ação diário personalizado para um agente imobiliário com perfil DISC ${discProfile}.

O plano deve incluir:
1. 3-4 ações prioritárias específicas para hoje
2. Dicas de comunicação baseadas no perfil ${discProfile}
3. Uma meta de vendas realista
4. Um lembrete motivacional

Formato: JSON com campos {"actions": ["..."], "communication_tips": ["..."], "goal": "...", "motivation": "..."}`;

        // Chamar Gemini AI
        const response = await window.geminiService.generateContent(prompt);
        const planData = JSON.parse(response);

        // Renderizar plano
        renderDailyPlan(planData);

        // Salvar no Supabase
        await window.supabaseService.saveDailyPlan({
            user_id: user.id,
            plan_data: planData,
            created_at: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erro ao gerar plano diário:', error);
        const dailyPlanEl = document.getElementById('dailyPlan');
        if (dailyPlanEl) {
            dailyPlanEl.innerHTML = '<p class="error">Erro ao gerar plano. Tente novamente.</p>';
        }
    }
}

function renderDailyPlan(planData) {
    const dailyPlanEl = document.getElementById('dailyPlan');
    if (!dailyPlanEl) return;

    let html = '<div class="daily-plan-content">';
    
    // Ações
    html += '<div class="plan-section"><h3>🎯 Ações Prioritárias</h3><ul>';
    planData.actions.forEach(action => {
        html += `<li>${action}</li>`;
    });
    html += '</ul></div>';

    // Dicas de comunicação
    html += '<div class="plan-section"><h3>💬 Dicas de Comunicação</h3><ul>';
    planData.communication_tips.forEach(tip => {
        html += `<li>${tip}</li>`;
    });
    html += '</ul></div>';

    // Meta
    html += `<div class="plan-section"><h3>🏆 Meta do Dia</h3><p>${planData.goal}</p></div>`;

    // Motivação
    html += `<div class="plan-section motivation"><h3>✨ Motivação</h3><p>${planData.motivation}</p></div>`;

    html += '</div>';
    dailyPlanEl.innerHTML = html;
}



if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
