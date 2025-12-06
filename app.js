// Coach Imobiliário MVP - JavaScript
const app = {
    init() {
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.login();
            });
        }
    },
    
    login() {
        const loginScreen = document.getElementById('loginScreen');
        const appContainer = document.getElementById('appContainer');
        
        // Hide login screen
        if (loginScreen) loginScreen.style.display = 'none';
        // Show app
        if (appContainer) appContainer.classList.add('active');
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}
