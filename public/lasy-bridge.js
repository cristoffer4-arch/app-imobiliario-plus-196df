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
        __mvp: true,
        type: 'console-bridge-ready'
      }, TARGET_ORIGIN);
      console.debug('[MVP Bridge] Ready signal sent');
    } catch (error) {
      console.debug('[MVP Bridge] Ready signal failed:', error);
    }
  }

  const publish = (evt) => {
    try {
      evt.id = 'log_' + Date.now() + '_' + (++logCounter);
      evt.timestamp = Date.now();

      // Sanitizar objetos grandes
      if (evt.args) {
        evt.args = evt.args.map(arg => {
          if (typeof arg === 'object' && arg !== null) {
            try {
              const str = JSON.stringify(arg);
              return str.length > 1000 ? str.substring(0, 1000) + '...[truncated]' : arg;
            } catch {
              return '[Object - could not serialize]';
            }
          }
          return arg;
        });
      }

      window.parent?.postMessage({
        __mvp: true,
        type: 'sandbox-log',
        payload: evt
      }, TARGET_ORIGIN);
    } catch (error) {
      console.debug('[MVP Bridge] Error:', error);
    }
  };

  // 1. CAPTURAR ERROS EXISTENTES
  function captureExistingErrors() {
    try {
      // Detectar erro de deploy do Netlify
      if (document.title.includes('Page Not Found') ||
          document.body.innerHTML.includes('Deploy failed')) {
        publish({
          source: 'netlify-deploy',
          level: 'error',
          message: 'Erro no deploy do Netlify',
          args: ['Deploy falhou ou página não encontrada'],
          type: 'netlify-error',
          errorSource: 'netlify'
        });
        return;
      }

      // Detectar erro de conexão Supabase
      if (document.body.innerHTML.includes('Supabase') &&
          (document.body.innerHTML.includes('connection') ||
           document.body.innerHTML.includes('authentication'))) {
        publish({
          source: 'supabase-error',
          level: 'error',
          message: 'Erro de conexão com Supabase',
          args: ['Problema na conexão com banco de dados'],
          type: 'supabase-error',
          errorSource: 'supabase'
        });
      }

      // Detectar erro de BUILD do NextJS
      if (document.body.innerHTML.includes('Application error') ||
          document.body.innerHTML.includes('Unhandled Runtime Error')) {
        publish({
          source: 'nextjs-build-error',
          level: 'error',
          message: 'Erro de BUILD no NextJS',
          args: ['Erro na compilação do projeto'],
          type: 'nextjs-build-error',
          errorSource: 'nextjs'
        });
      }

      // Capturar erro do Next.js
      const nextData = window.__NEXT_DATA__;
      if (nextData?.err) {
        publish({
          source: 'nextjs-existing',
          level: 'error',
          message: nextData.err.message,
          stack: nextData.err.stack,
          args: [nextData.err.message],
          type: 'server-error',
          errorSource: 'server'
        });
      }
    } catch {}
  }

  // 2. Interceptar console
  function setupConsoleInterception() {
    ['log', 'info', 'warn', 'error'].forEach((level) => {
      const existingFunction = console[level];

      console[level] = (...args) => {
        const firstArg = args.length > 0 ? String(args[0]) : '';
        if (firstArg.includes('MVP bridge') ||
            firstArg.includes('[MVP') ||
            firstArg.includes('HMR')) {
          return existingFunction.apply(console, args);
        }

        if (bridgeInitialized) {
          try {
            publish({
              source: 'client-console',
              level: level,
              args: args,
              message: args.map(arg => String(arg)).join(' '),
              type: 'console-call'
            });
          } catch {}
        }

        return existingFunction.apply(console, args);
      };
    });
  }

  // 3. Window error handler
  const existingWindowOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    try {
      publish({
        source: 'global-error',
        level: 'error',
        message: String(message),
        stack: error?.stack,
        url: source,
        line: lineno,
        column: colno,
        args: [String(message)],
        type: 'window-onerror'
      });
    } catch {}

    if (existingWindowOnError) {
      return existingWindowOnError.call(window, message, source, lineno, colno, error);
    }
    return false;
  };

  // 4. Error event listener
  window.addEventListener('error', (e) => {
    try {
      publish({
        source: 'client-error',
        level: 'error',
        message: e.message,
        stack: e.error?.stack,
        url: e.filename,
        line: e.lineno,
        column: e.colno,
        args: [e.message],
        type: 'javascript-error'
      });
    } catch {}
  });

  // 5. Unhandled rejection
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason;
    try {
      publish({
        source: 'client-promise',
        level: 'error',
        message: reason?.message || String(reason),
        stack: reason?.stack,
        args: [reason?.message || String(reason)],
        type: 'promise-rejection'
      });
    } catch {}
  });

  // 6. Interceptar fetch
  const originalFetch = window.fetch;
  window.fetch = async (input, init) => {
    const method = (init?.method || 'GET').toUpperCase();
    const url = typeof input === 'string' ? input : input.url;

    try {
      const response = await originalFetch(input, init);

      if (!response.ok) {
        publish({
          source: 'client-fetch',
          level: 'network',
          status: response.status,
          method: method,
          url: response.url,
          message: `${method} ${response.url} ${response.status}`,
          args: [`Network Error: ${method} ${response.url} - ${response.status}`],
          type: 'fetch-error'
        });
      }

      return response;
    } catch (error) {
      publish({
        source: 'client-fetch',
        level: 'network-error',
        message: error?.message || 'Network request failed',
        stack: error?.stack,
        method: method,
        url: url,
        args: [`Network Failed: ${method} ${url}`],
        type: 'fetch-failure'
      });
      throw error;
    }
  };

  // 7. Element Selector
  let elementSelectorActive = false;
  let selectorStyle = null;

  function generateSelector(element) {
    if (!element) return '';
    if (element.id) return `#${element.id}`;

    if (element.className) {
      const classNameStr = typeof element.className === 'string'
        ? element.className
        : element.className.toString();
      const classes = classNameStr.split(' ').filter(c => c.trim());
      if (classes.length > 0) return `.${classes.join('.')}`;
    }

    const tag = element.tagName.toLowerCase();
    return tag;
  }

  function activateElementSelector() {
    if (elementSelectorActive || !bridgeInitialized) return;

    elementSelectorActive = true;
    selectorStyle = document.createElement('style');
    selectorStyle.textContent = `
      .mvp-highlight {
        outline: 3px solid #10b981 !important;
        outline-offset: 2px !important;
        cursor: pointer !important;
        background-color: rgba(16, 185, 129, 0.1) !important;
      }
    `;
    document.head.appendChild(selectorStyle);

    const mouseHandler = (e) => {
      document.querySelectorAll('.mvp-highlight').forEach(el => el.classList.remove('mvp-highlight'));
      e.target.classList.add('mvp-highlight');
    };

    const clickHandler = (e) => {
      e.preventDefault();
      const selector = generateSelector(e.target);
      window.parent?.postMessage({
        __mvp: true,
        type: 'element-selected',
        payload: { selector }
      }, TARGET_ORIGIN);
      deactivateElementSelector();
    };

    document.addEventListener('mouseover', mouseHandler, true);
    document.addEventListener('click', clickHandler, true);
  }

  function deactivateElementSelector() {
    elementSelectorActive = false;
    document.querySelectorAll('.mvp-highlight').forEach(el => el.classList.remove('mvp-highlight'));
    if (selectorStyle) {
      selectorStyle.remove();
      selectorStyle = null;
    }
  }

  // 8. URL Tracking
  let currentUrl = window.location.href;

  function notifyUrlChange() {
    const newUrl = window.location.href;
    if (newUrl === currentUrl) return;
    currentUrl = newUrl;

    window.parent?.postMessage({
      __mvp: true,
      type: 'url-change',
      payload: {
        fullUrl: newUrl,
        pathname: window.location.pathname
      }
    }, TARGET_ORIGIN);
  }

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

  // 10. Inicialização
  function initializeBridge() {
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(initializeBridge, 250));
  } else {
    setTimeout(initializeBridge, 100);
  }
})();
