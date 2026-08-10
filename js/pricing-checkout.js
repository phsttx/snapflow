/* ==========================================================================
   SnapFlow - Stripe Checkout & Payment Link Integration Module
   Conectado Oficialmente ao Stripe Checkout Live do SnapFlow
   ========================================================================== */

class PricingCheckoutModule {
  constructor() {
    // Link Oficial de Pagamento do Stripe do SnapFlow
    this.stripeCheckoutUrl = 'https://buy.stripe.com/00wbJ3fqIfKbcyFdDPdnW00';

    this.initEvents();
    this.checkPaymentSuccessReturn();
  }

  initEvents() {
    // 1. Evento direto por ID
    const proSubscribeBtn = document.getElementById('proSubscribeBtn');
    if (proSubscribeBtn) {
      proSubscribeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCheckout();
      });
    }

    // 2. Botão de Upgrade no Modal de Paywall
    const paywallUpgradeBtn = document.getElementById('paywallUpgradeBtn');
    if (paywallUpgradeBtn) {
      paywallUpgradeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCheckout();
      });
    }

    // 3. Delegação Global Blindada (Captura qualquer clique em botões de Assinar Pro)
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, a');
      if (!target) return;

      const text = target.textContent || '';
      if (
        target.id === 'proSubscribeBtn' ||
        target.id === 'paywallUpgradeBtn' ||
        target.classList.contains('btn-subscribe-pro') ||
        text.includes('Assinar Plano Pro') ||
        text.includes('Assinar Plano PRO')
      ) {
        if (!target.id || target.id === 'proSubscribeBtn' || target.id === 'paywallUpgradeBtn') {
          e.preventDefault();
          this.openCheckout();
        }
      }
    });
  }

  openCheckout() {
    if (!this.stripeCheckoutUrl) {
      Utils.showToast('Configurando gateway de pagamento Stripe... Em breve no ar!');
      return;
    }

    // Abre o checkout seguro do Stripe em uma nova aba
    window.open(this.stripeCheckoutUrl, '_blank');
  }

  /* Verifica se o usuário acabou de pagar e retornou do Stripe */
  checkPaymentSuccessReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    const isPaymentSuccess = urlParams.get('payment') === 'success' || urlParams.get('upgrade') === 'pro' || urlParams.has('session_id');

    if (isPaymentSuccess) {
      // 1. Ativa o Plano PRO no localStorage
      localStorage.setItem('snapflow_plan', 'pro');

      // 2. Atualiza no Supabase caso o usuário esteja autenticado
      if (window.supabaseAuthModule) {
        window.supabaseAuthModule.userPlan = 'pro';
        if (window.supabaseAuthModule.user && window.supabaseAuthModule.client) {
          window.supabaseAuthModule.client.auth.updateUser({
            data: { plan: 'pro' }
          }).catch(err => console.warn(err));
        }
        window.supabaseAuthModule.updateUiState();
      }

      // 3. Atualiza na barra de status da UI
      const planTag = document.getElementById('userPlanTag');
      if (planTag) {
        planTag.textContent = 'PRO 👑';
        planTag.className = 'micro-plan-badge pro-badge';
      }

      Utils.showToast('🎉 Parabéns! Seu Plano PRO foi ativado com sucesso! Aproveite ferramentas ilimitadas.', 'success');

      // 4. Registra evento de Venda no Analytics
      if (window.snapFlowAnalytics) {
        window.snapFlowAnalytics.trackPurchaseCompleted();
      }

      // Limpa os parâmetros da URL sem recarregar a página
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  setStripeUrl(url) {
    if (url && url.startsWith('http')) {
      this.stripeCheckoutUrl = url;
    }
  }
}

// Inicialização imediata e no DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pricingCheckout = new PricingCheckoutModule();
  });
} else {
  window.pricingCheckout = new PricingCheckoutModule();
}
