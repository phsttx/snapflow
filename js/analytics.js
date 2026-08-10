/* ==========================================================================
   SnapFlow - Advanced SaaS Analytics & Conversion Tracking Engine
   Integração Google Analytics 4 (GA4) + Eventos Personalizados de Funil
   ========================================================================== */

class SnapFlowAnalytics {
  constructor() {
    // ID Oficial da Métrica do Google Analytics do SnapFlow
    this.measurementId = 'G-6MSY5E45TN'; 
    this.isInitialized = false;

    this.initGA4();
    this.initAutoTracking();
  }

  /* Inicializa o script oficial do Google Analytics 4 (gtag.js) */
  initGA4() {
    if (!this.measurementId || this.measurementId === 'G-XXXXXXXXXX') {
      console.log('[SnapFlow Analytics] Modo Rastreamento Local Ativo. Aguardando ID do GA4.');
      return;
    }

    // Carrega o script gtag.js dinamicamente
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.measurementId, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure'
    });

    this.isInitialized = true;
    console.log(`[SnapFlow Analytics] GA4 Conectado com sucesso: ${this.measurementId}`);
  }

  /* Dispara eventos customizados para o Google Analytics e Console */
  trackEvent(eventName, eventParams = {}) {
    const payload = {
      timestamp: new Date().toISOString(),
      ...eventParams
    };

    console.log(`[Analytics Event] 🎯 ${eventName}:`, payload);

    if (window.gtag) {
      window.gtag('event', eventName, payload);
    }
  }

  /* Rastreamento Automático de Cliques e Funil de Vendas */
  initAutoTracking() {
    // 1. Rastreia Abertura de Ferramentas no Hub
    document.querySelectorAll('.hub-card').forEach(card => {
      card.addEventListener('click', () => {
        const tabId = card.dataset.openTab || 'unknown';
        const title = card.querySelector('.hub-card-title')?.textContent?.trim() || tabId;
        this.trackEvent('tool_opened', {
          tool_id: tabId,
          tool_name: title
        });
      });
    });

    // 2. Rastreia Visualização da Tela de Preços
    const navPricingLink = document.getElementById('navPricingLink');
    if (navPricingLink) {
      navPricingLink.addEventListener('click', () => {
        this.trackEvent('pricing_page_viewed', { source: 'header_nav' });
      });
    }

    // 3. Rastreia Alternância Mensal vs Anual
    const toggleSwitch = document.getElementById('pricingToggleSwitch');
    if (toggleSwitch) {
      toggleSwitch.addEventListener('click', () => {
        const planType = toggleSwitch.classList.contains('annual') ? 'annual' : 'monthly';
        this.trackEvent('pricing_plan_toggled', { billing_cycle: planType });
      });
    }

    // 4. Rastreia Início de Checkout no Stripe
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a');
      if (!target) return;

      const text = target.textContent || '';
      if (
        target.id === 'proSubscribeBtn' ||
        target.id === 'paywallUpgradeBtn' ||
        text.includes('Assinar Plano Pro') ||
        text.includes('Assinar Plano PRO')
      ) {
        this.trackEvent('checkout_initiated', {
          plan: 'SnapFlow PRO',
          price: '29.90',
          currency: 'BRL',
          trigger_element: target.id || 'button_click'
        });
      }
    });
  }

  /* Rastreia quando um usuário Free atinge o limite de 10 operações */
  trackPaywallTriggered(usageCount) {
    this.trackEvent('paywall_limit_reached', {
      operations_count: usageCount,
      limit: 10
    });
  }

  /* Rastreia quando uma ferramenta processa e salva arquivos */
  trackFileProcessed(toolName, fileCount = 1, bytesSaved = 0) {
    this.trackEvent('file_processed', {
      tool_name: toolName,
      file_count: fileCount,
      bytes_saved: bytesSaved
    });
  }

  /* Rastreia Venda Aprovada no Retorno do Stripe */
  trackPurchaseCompleted() {
    this.trackEvent('purchase_success', {
      value: 29.90,
      currency: 'BRL',
      transaction_id: 'stripe_' + Date.now()
    });
  }

  setMeasurementId(id) {
    if (id && id.startsWith('G-')) {
      this.measurementId = id;
      this.initGA4();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.snapFlowAnalytics = new SnapFlowAnalytics();
});
