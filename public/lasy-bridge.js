// Console Bridge - Sistema de monitoramento para MVP Imobiliário
// GitHub: cristoffer4-arch/app-imobiliario-plus-196df
// Deploy: Netlify + Supabase
// IA: Google Gemini (sem OpenAI)

(function setupConsoleBridge() {
  // Evitar múltiplas inicializações
  if (window.__consoleBridgeInitialized) return;
  window.__consoleBridgeInitialized = true;

  const TARGET_ORIGIN = '*';
  let logCounter = 0;
  let bridgeInitialized = false;

  // Notificar que bridge está pronto
  function notifyBridgeReady() {
    try {
      window.parent?.postMessage({
        _mvp: true,
        type: 'console-bridge-ready'
      }, TARGET_ORIGIN);
      console.debug('[MVP Bridge] Ready signal sent');
    } catch (error) {
      console.debug('[MVP Bridge] Ready signal failed:', error);
    }
  }

  // 1. Publicar logs
  function publish(data) {
    try {
      if (!data || typeof data !== 'object') return;
      
      window.parent?.postMessage({
        _mvp: true,
        ...data,
        id: ++logCounter,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }, TARGET_ORIGIN);
    } catch (error) {
      console.error('[MVP Bridge] Failed to publish:', error);
    }
  }

  // 2. Capturar erros existentes
  function captureExistingErrors() {
    try {
      const errors = window.__existingErrors || [];
      errors.forEach(error => {
        publish({
          source: 'client-bridge',
          level: 'error',
          message: error.message || 'Unknown error',
          args: [error],
          type: 'error',
          stack: error.stack
        });
      });
    } catch (error) {
      console.error('[MVP Bridge] Failed to capture existing errors:', error);
    }
  }

  // 3. Interceptar console
  function setupConsoleInterception() {
    try {
      const methods = ['log', 'warn', 'error', 'info', 'debug'];
      methods.forEach(method => {
        const original = console[method];
        console[method] = function(...args) {
          original.apply(console, args);
          
          // Filtrar mensagens internas do bridge
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' ');
          
          if (message.includes('[MVP Bridge]')) return;
          
          publish({
            source: 'client-bridge',
            level: method,
            message: message,
            args: args,
            type: 'console'
          });
        };
      });
    } catch (error) {
      console.error('[MVP Bridge] Failed to setup console interception:', error);
    }
  }

  // 4. Capturar erros globais
  window.addEventListener('error', (event) => {
    publish({
      source: 'client-bridge',
      level: 'error',
      message: event.message || 'Uncaught error',
      args: [{
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      }],
      type: 'error',
      stack: event.error?.stack
    });
  });

  // 5. Capturar promessas rejeitadas
  window.addEventListener('unhandledrejection', (event) => {
    publish({
      source: 'client-bridge',
      level: 'error',
      message: event.reason?.message || 'Unhandled promise rejection',
      args: [event.reason],
      type: 'unhandledrejection',
      stack: event.reason?.stack
    });
  });

  // 6. Notificar mudanças de URL
  function notifyUrlChange() {
    try {
      publish({
        source: 'client-bridge',
        level: 'info',
        message: `URL changed to: ${window.location.href}`,
        args: [{
          href: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash
        }],
        type: 'url-change'
      });
    } catch (error) {
      console.error('[MVP Bridge] Failed to notify URL change:', error);
    }
  }

  // 7. Seletor de elementos
  let selectorActive = false;
  let hoverOverlay = null;

  function activateElementSelector() {
    if (selectorActive) return;
    selectorActive = true;

    // Criar overlay de hover
    hoverOverlay = document.createElement('div');
    hoverOverlay.id = 'mvp-hover-overlay';
    hoverOverlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 2147483647;
      border: 2px solid #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      transition: all 0.1s ease;
    `;
    document.body.appendChild(hoverOverlay);

    function handleMouseMove(e) {
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element && element !== hoverOverlay) {
        const rect = element.getBoundingClientRect();
        hoverOverlay.style.top = rect.top + 'px';
        hoverOverlay.style.left = rect.left + 'px';
        hoverOverlay.style.width = rect.width + 'px';
        hoverOverlay.style.height = rect.height + 'px';
      }
    }

    function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element && element !== hoverOverlay) {
        const selector = getElementSelector(element);
        publish({
          source: 'client-bridge',
          level: 'info',
          message: `Element selected: ${selector}`,
          args: [{
            selector: selector,
            tagName: element.tagName,
            id: element.id,
            className: element.className,
            textContent: element.textContent?.substring(0, 100)
          }],
          type: 'element-selected'
        });
      }
      
      deactivateElementSelector();
    }

    window.__mvpMouseMove = handleMouseMove;
    window.__mvpClick = handleClick;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
  }

  function deactivateElementSelector() {
    selectorActive = false;
    
    if (hoverOverlay) {
      hoverOverlay.remove();
      hoverOverlay = null;
    }
    
    if (window.__mvpMouseMove) {
      document.removeEventListener('mousemove', window.__mvpMouseMove);
      delete window.__mvpMouseMove;
    }
    
    if (window.__mvpClick) {
      document.removeEventListener('click', window.__mvpClick, true);
      delete window.__mvpClick;
    }
  }

  function getElementSelector(element) {
    if (element.id) return `#${element.id}`;
    
    let path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.className) {
        selector += '.' + element.className.trim().split(/\s+/).join('.');
      }
      path.unshift(selector);
      element = element.parentNode;
      if (path.length > 3) break;
    }
    
    return path.join(' > ');
  }

  // 8. Interceptar mudanças de URL (SPA)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    setTimeout(notifyUrlChange, 10);
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    setTimeout(notifyUrlChange, 10);
  };

  window.addEventListener('popstate', () => setTimeout(notifyUrlChange, 10));

  // 9. Message listener
  window.addEventListener('message', (event) => {
    if (event.data.type === 'mvp-element-selector') {
      if (event.data.action === 'activate') {
        setTimeout(activateElementSelector, 500);
      } else if (event.data.action === 'deactivate') {
        deactivateElementSelector();
      }
    }
    
    if (event.data.type === 'mvp-bridge-status-request') {
      notifyBridgeReady();
    }
  });

  // 10. Inicialização com tratamento adequado
  function initializeBridge() {
    try {
      captureExistingErrors();
      setupConsoleInterception();
      bridgeInitialized = true;

      publish({
        source: 'client-bridge',
        level: 'info',
        message: 'Console bridge conectado (GitHub + Supabase + Netlify + Gemini)',
        args: ['MVP System Ready'],
        type: 'bridge-initialized'
      });

      notifyBridgeReady();
      setTimeout(notifyBridgeReady, 1000);
      setTimeout(notifyUrlChange, 1000);
    } catch (error) {
      console.error('[MVP Bridge] Initialization failed:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initializeBridge, 250));
  } else {
    setTimeout(initializeBridge, 100);
  }
})();
