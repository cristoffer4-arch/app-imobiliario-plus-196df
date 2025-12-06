// ═══════════════════════════════════════════════════════════
// MODAL FIX - Sistema Completo de Modal de Detalhes
// ═══════════════════════════════════════════════════════════

class PropertyModal {
  constructor() {
    this.currentProperty = null;
    this.modalElement = null;
    this.initialized = false;
  }

  // ═══════════════════════════════════════════════════════════
  // INICIALIZAÇÃO
  // ═══════════════════════════════════════════════════════════
  init() {
    if (this.initialized) return;

    console.log('[MODAL] 🚀 Inicializando sistema de modal...');

    // Event Delegation no container de imóveis
    this.setupEventDelegation();

    // Listener para ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalElement) {
        this.closeModal();
      }
    });

    this.initialized = true;
    console.log('[MODAL] ✅ Sistema de modal inicializado');
  }

  // ═══════════════════════════════════════════════════════════
  // EVENT DELEGATION
  // ═══════════════════════════════════════════════════════════
  setupEventDelegation() {
    // Delega eventos ao container principal
    const containers = [
      document.querySelector('.properties-grid'),
      document.querySelector('#properties-container'),
      document.querySelector('.properties-list'),
      document.body // Fallback
    ];

    containers.forEach(container => {
      if (container) {
        container.addEventListener('click', (e) => {
          // Encontra o card clicado (ou elemento pai)
          const card = e.target.closest('.property-card, [data-property-id]');
          
          if (card) {
            const propertyId = card.dataset.propertyId || card.getAttribute('data-id');
            
            if (propertyId) {
              console.log('[MODAL] 🖱️ Click detectado no imóvel:', propertyId);
              this.showPropertyModal(propertyId);
            }
          }
        });
      }
    });

    console.log('[MODAL] 📌 Event delegation configurado');
  }

  // ═══════════════════════════════════════════════════════════
  // MOSTRAR MODAL
  // ═══════════════════════════════════════════════════════════
  showPropertyModal(propertyId) {
    console.log('[MODAL] 🏠 Abrindo modal para imóvel:', propertyId);

    // Buscar dados do imóvel
    const property = this.findProperty(propertyId);

    if (!property) {
      console.error('[MODAL] ❌ Imóvel não encontrado:', propertyId);
      return;
    }

    this.currentProperty = property;

    // Criar/atualizar modal
    this.createModal(property);

    // Track atividade
    if (window.kpisTracker) {
      window.kpisTracker.trackPropertyView(propertyId, {
        title: property.title,
        price: property.price,
        location: property.location
      });
    }

    // Adicionar ao DOM
    document.body.appendChild(this.modalElement);
    
    // Trigger animação
    requestAnimationFrame(() => {
      this.modalElement.classList.add('modal-show');
    });

    // Prevenir scroll do body
    document.body.style.overflow = 'hidden';
  }

  // ═══════════════════════════════════════════════════════════
  // BUSCAR IMÓVEL
  // ═══════════════════════════════════════════════════════════
  findProperty(propertyId) {
    // Tenta buscar do array global mockProperties
    if (window.mockProperties && Array.isArray(window.mockProperties)) {
      const property = window.mockProperties.find(p => p.id == propertyId);
      if (property) return property;
    }

    // Tenta buscar dos cards no DOM
    const card = document.querySelector(`[data-property-id="${propertyId}"], [data-id="${propertyId}"]`);
    if (card) {
      return {
        id: propertyId,
        title: card.querySelector('.property-title, h3')?.textContent || 'Imóvel',
        price: card.querySelector('.property-price, .price')?.textContent || 'N/A',
        location: card.querySelector('.property-location, .location')?.textContent || 'Portugal',
        bedrooms: card.querySelector('.bedrooms')?.textContent || '2',
        bathrooms: card.querySelector('.bathrooms')?.textContent || '1',
        area: card.querySelector('.area')?.textContent || '80m²',
        image: card.querySelector('img')?.src || 'https://source.unsplash.com/800x600/?real-estate,portugal',
        description: 'Imóvel com excelente localização e acabamentos de qualidade.'
      };
    }

    return null;
  }

  // ═══════════════════════════════════════════════════════════
  // CRIAR MODAL HTML
  // ═══════════════════════════════════════════════════════════
  createModal(property) {
    // Remove modal anterior se existir
    if (this.modalElement) {
      this.modalElement.remove();
    }

    // Criar novo modal
    const modal = document.createElement('div');
    modal.className = 'property-modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <button class="modal-close" aria-label="Fechar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="modal-body">
          <div class="modal-image">
            <img src="${property.image}" alt="${property.title}" loading="lazy">
          </div>

          <div class="modal-info">
            <h2 class="modal-title">${property.title}</h2>
            <p class="modal-location">📍 ${property.location}</p>
            <p class="modal-price">${property.price}</p>

            <div class="modal-features">
              <div class="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                </svg>
                <span>${property.bedrooms || '2'} Quartos</span>
              </div>
              <div class="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"></path>
                </svg>
                <span>${property.bathrooms || '1'} Banheiros</span>
              </div>
              <div class="feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                </svg>
                <span>${property.area || '80m²'}</span>
              </div>
            </div>

            <div class="modal-description">
              <h3>Descrição</h3>
              <p>${property.description || 'Imóvel com excelente localização, acabamentos de qualidade e proximidade a serviços essenciais. Ideal para quem busca conforto e praticidade.'}</p>
            </div>

            <div class="modal-actions">
              <button class="btn-primary btn-schedule-visit" data-property-id="${property.id}">
                📅 Agendar Visita
              </button>
              <button class="btn-secondary btn-contact">
                💬 Entrar em Contato
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Adicionar estilos inline
    this.injectStyles();

    // Event listeners
    modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal());
    modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    
    modal.querySelector('.btn-schedule-visit').addEventListener('click', (e) => {
      this.scheduleVisit(property.id);
    });

    modal.querySelector('.btn-contact').addEventListener('click', () => {
      this.contactAgent(property);
    });

    this.modalElement = modal;
  }

  // ═══════════════════════════════════════════════════════════
  // FECHAR MODAL
  // ═══════════════════════════════════════════════════════════
  closeModal() {
    if (!this.modalElement) return;

    console.log('[MODAL] ❌ Fechando modal');

    this.modalElement.classList.remove('modal-show');
    
    setTimeout(() => {
      if (this.modalElement && this.modalElement.parentNode) {
        this.modalElement.remove();
      }
      this.modalElement = null;
      document.body.style.overflow = '';
    }, 300);
  }

  // ═══════════════════════════════════════════════════════════
  // AGENDAR VISITA
  // ═══════════════════════════════════════════════════════════
  scheduleVisit(propertyId) {
    console.log('[MODAL] 📅 Agendando visita para:', propertyId);

    // Track atividade
    if (window.kpisTracker) {
      window.kpisTracker.trackVisitSchedule(propertyId, {
        date: new Date().toISOString(),
        propertyTitle: this.currentProperty?.title
      });
    }

    // Mostrar feedback
    alert('✅ Visita agendada! Entraremos em contato em breve.');
    this.closeModal();
  }

  // ═══════════════════════════════════════════════════════════
  // CONTATAR CORRETOR
  // ═══════════════════════════════════════════════════════════
  contactAgent(property) {
    console.log('[MODAL] 💬 Contatando corretor para:', property.id);

    // Track atividade
    if (window.kpisTracker) {
      window.kpisTracker.trackActivity('contact_requested', {
        property_id: property.id,
        property_title: property.title
      });
    }

    // Abrir chat ou formulário de contato
    alert('💬 Abrindo canal de contato...');
  }

  // ═══════════════════════════════════════════════════════════
  // INJETAR ESTILOS CSS
  // ═══════════════════════════════════════════════════════════
  injectStyles() {
    if (document.querySelector('#modal-styles')) return;

    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
      .property-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
      }

      .property-modal.modal-show {
        opacity: 1;
        visibility: visible;
      }

      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
      }

      .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        max-width: 900px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }

      .modal-close {
        position: absolute;
        top: 16px;
        right: 16px;
        background: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.2s;
      }

      .modal-close:hover {
        background: #f0f0f0;
        transform: scale(1.1);
      }

      .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
      }

      .modal-image {
        background: #f5f5f5;
      }

      .modal-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .modal-info {
        padding: 32px;
      }

      .modal-title {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: #1a1a1a;
      }

      .modal-location {
        font-size: 14px;
        color: #666;
        margin: 0 0 16px 0;
      }

      .modal-price {
        font-size: 28px;
        font-weight: 700;
        color: #2563eb;
        margin: 0 0 24px 0;
      }

      .modal-features {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
        padding: 16px;
        background: #f9fafb;
        border-radius: 8px;
      }

      .feature {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #4b5563;
      }

      .feature svg {
        color: #2563eb;
      }

      .modal-description h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 12px 0;
        color: #1a1a1a;
      }

      .modal-description p {
        font-size: 14px;
        line-height: 1.6;
        color: #4b5563;
        margin: 0 0 24px 0;
      }

      .modal-actions {
        display: flex;
        gap: 12px;
      }

      .modal-actions button {
        flex: 1;
        padding: 14px 24px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary {
        background: #2563eb;
        color: white;
      }

      .btn-primary:hover {
        background: #1d4ed8;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      }

      .btn-secondary {
        background: white;
        color: #2563eb;
        border: 2px solid #2563eb;
      }

      .btn-secondary:hover {
        background: #f0f9ff;
      }

      @media (max-width: 768px) {
        .modal-body {
          grid-template-columns: 1fr;
        }

        .modal-image {
          height: 250px;
        }

        .modal-content {
          width: 95%;
          max-height: 95vh;
        }

        .modal-info {
          padding: 24px;
        }

        .modal-actions {
          flex-direction: column;
        }
      }

      .kpi-updated {
        animation: kpi-pulse 0.5s ease;
      }

      @keyframes kpi-pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;

    document.head.appendChild(style);
  }
}

// ═══════════════════════════════════════════════════════════
// INSTÂNCIA GLOBAL E AUTO-INICIALIZAÇÃO
// ═══════════════════════════════════════════════════════════
window.propertyModal = new PropertyModal();

// Auto-inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.propertyModal.init();
  });
} else {
  window.propertyModal.init();
}
