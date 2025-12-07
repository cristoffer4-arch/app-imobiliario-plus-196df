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

// Função para obter localização do usuário
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocalização não suportada'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                console.log('Erro ao obter localização:', error);
                // Retorna localização padrão (Lisboa) em caso de erro
                resolve({
                    latitude: 38.7223,
                    longitude: -9.1393
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
