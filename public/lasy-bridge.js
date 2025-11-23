/**
 * lasy.bridge.js
 * Versão aprimorada para comunicação, detecção automática e aceleração de sandbox.
 * Sugestões e hotfixes gratuitos incluídos!
 */

(function () {
  if (window.lasyBridgeInitialized) return;
  window.lasyBridgeInitialized = true;

  // Configurações personalizáveis recebidas do parent
  let bridgeConfig = {
    eventWhitelist: ["error", "warn", "build", "network", "route", "fix", "performance"],
    autoFixEnabled: true,
    quickPublish: true,
    suggestAlways: true,
    maskSensitive: true,
    freeCorrection: true,
  };

  // Aguardar comandos do parent para reconfigurar dinâmico
  window.addEventListener("message", function (event) {
    if (event.data.type === "lasy-configure" && typeof event.data.config === "object") {
      Object.assign(bridgeConfig, event.data.config);
      publish({ type: "info", msg: "Bridge reconfigurado dinamicamente", config: bridgeConfig });
    }
    if (event.data.type === "speed-up-process") {
      accelerateProcess();
    }
  });

  // Envio seguro de mensagens ao parent
  const TARGETORIGIN = "*";
  function publish(evt) {
    if (!bridgeConfig.eventWhitelist.includes(evt.type)) return;
    evt.id = "lasy-" + Date.now();
    evt.timestamp = Date.now();
    if (bridgeConfig.maskSensitive && evt.msg) {
      evt.msg = mask(evt.msg);
    }
    if (bridgeConfig.freeCorrection && evt.fix) {
      evt.freeCorrection = true;
    }
    window.parent?.postMessage(evt, TARGETORIGIN);
  }

  function mask(text) {
    // Oculta e-mails, senhas, tokens (algo simples como exemplo)
    return text.replace(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, "***")
      .replace(/(["']?password["']?\s*:\s*["'].*?["'])/gi, '"password":"***"')
      .replace(/(["']?token["']?\s*:\s*["'].*?["'])/gi, '"token":"***"');
  }

  // Correções automáticas grátis
  function tryAutoFix(error) {
    const fixes = {
      "favicon": () => { let link = document.querySelector("link[rel*='icon']"); if (link) link.href = "/favicon.ico"; },
      "Module not found": () => publish({ type: "fix", msg: "Verifique se dependência está instalada", fix: "npm install" }),
      "Sandbox Not Found": () => location.reload(),
      "Network Error": () => publish({ type: "fix", msg: "Reconecte à internet", fix: "Verifique o cabo ou WiFi." }),
    };
    for (let key in fixes) {
      if ((error.msg || "").includes(key)) {
        fixes[key]();
        publish({ type: "fix", msg: `Correção automática aplicada para: ${key}`, fix: key });
      }
    }
  }

  // Interceptação e logs aprimorados
  ["log", "warn", "error", "info"].forEach(function (method) {
    const original = console[method];
    console[method] = function (...args) {
      publish({ type: method, msg: JSON.stringify(args) });
      original.apply(console, args);
    };
  });

  window.onerror = function (msg, src, line, col, err) {
    publish({ type: "error", msg, src, line, col });
    if (bridgeConfig.autoFixEnabled) tryAutoFix({ msg });
  };

  window.addEventListener("error", function (e) {
    publish({ type: "error", msg: e.message, src: e.filename, line: e.lineno, col: e.colno });
    if (bridgeConfig.autoFixEnabled) tryAutoFix({ msg: e.message });
  });

  window.onunhandledrejection = function (e) {
    publish({ type: "warn", msg: "Promise rejeitada", reason: e.reason || "" });
    // Sugestão gratuita auto
    if (bridgeConfig.autoFixEnabled) tryAutoFix({ msg: "Promise rejeitada" });
  };

  // Interceptação de rede
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    return originalFetch(...args).catch(e => {
      publish({ type: "network", msg: "Erro ao fazer fetch", error: e.message });
      if (bridgeConfig.autoFixEnabled) tryAutoFix({ msg: "Network Error" });
      throw e;
    });
  };

  const originalXhr = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    const xhr = new originalXhr();
    xhr.addEventListener("error", function () {
      publish({ type: "network", msg: "Erro XMLHttp" });
      if (bridgeConfig.autoFixEnabled) tryAutoFix({ msg: "Network Error" });
    });
    return xhr;
  };

  // Element selector visual e tracking de rotas
  function activateSelector() {
    document.body.addEventListener("click", function (e) {
      const selector = generateSelector(e.target);
      publish({ type: "route", msg: "Elemento selecionado", selector });
    }, { once: true });
    publish({ type: "info", msg: "Seleção de elemento iniciada" });
  }
  function generateSelector(element) {
    if (!element) return "";
    let path = [];
    while (element.parentElement) {
      let name = element.tagName.toLowerCase();
      if (element.id) name += "#" + element.id;
      else if (element.className) name += "." + element.className.split(" ").join(".");
      path.unshift(name);
      element = element.parentElement;
    }
    return path.join(" > ");
  }

  // Tracking e aceleração de processo de desenvolvimento/publicação
  function accelerateProcess() {
    publish({ type: "info", msg: "Processo acelerado. Build incremental e cache limpo!" });
    // Simulação: limpar cache e forçar build mínimo
    localStorage.clear();
    location.reload();
  }

  // Observador de rotas e links
  function monitorRoutes() {
    let lastUrl = location.href;
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        publish({ type: "route", msg: "Rota alterada", url: lastUrl });
      }
    }, 1000);
    document.body.addEventListener("click", function (e) {
      const link = e.target.closest("a");
      if (link) publish({ type: "route", msg: "Link clicado", href: link.href });
    }, true);
  }

  // Inicialização principal
  function init() {
    publish({ type: "info", msg: "Bridge inicializada e pronta", config: bridgeConfig });
    monitorRoutes();
  }

  // Executa bridge
  init();

})();
