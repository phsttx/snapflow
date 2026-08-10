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
    // Botão de assinatura na Tela de Preços & Planos (Plano PRO)
    const proSubscribeBtn = document.getElementById('proSubscribeBtn');
    if (proSubscribeBtn) {
      proSubscribeBtn.addEventListener('click', () => this.openCheckout());
    }

    // Botão de Upgrade no Modal de Paywall de Limite Atingido
    const paywallUpgradeBtn = document.getElementById('paywallUpgradeBtn');
    if (paywallUpgradeBtn) {
      paywallUpgradeBtn.addEventListener('click', () => this.openCheckout());
    }
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
      // Ativa o Plano PRO no cliente
      localStorage.setItem('snapflow_plan', 'pro');

      // Se houver usuário logado no Supabase, atualiza o metadata
      if (window.supabaseAuthModule && window.supabaseAuthModule.user) {
        window.supabaseAuthModule.userPlan = 'pro';
        if (window.supabaseAuthModule.client) {
          window.supabaseAuthModule.client.auth.updateUser({
            data: { plan: 'pro' }
          });
        }
      }

      // Atualiza a interface
      if (window.supabaseAuthModule) {
        window.supabaseAuthModule.updateUiState();
      }

      Utils.showToast('🎉 Parabéns! Seu Plano PRO foi ativado com sucesso! Aproveite ferramentas ilimitadas.', 'success');

      // Limpa os parâmetros da URL para ficar limpo
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  setStripeUrl(url) {
    if (url && url.startsWith('http')) {
      this.stripeCheckoutUrl = url;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.pricingCheckout = new PricingCheckoutModule();
});
