/* ==========================================================================
   SnapFlow - Stripe Checkout & Payment Link Integration Module
   ========================================================================== */

class PricingCheckoutModule {
  constructor() {
    // Insira aqui o seu link final de pagamento do Stripe (buy.stripe.com)
    this.stripeCheckoutUrl = 'https://buy.stripe.com/SEU_LINK_DO_STRIPE_AQUI';

    this.initEvents();
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
    if (!this.stripeCheckoutUrl || this.stripeCheckoutUrl.includes('SEU_LINK_DO_STRIPE')) {
      Utils.showToast('Configurando gateway de pagamento Stripe... Em breve no ar!');
      // Redireciona para a tela de preços se o link ainda for temporário
      if (window.appController) {
        window.appController.showScreen(4);
      }
      return;
    }

    // Abre o checkout seguro do Stripe em uma nova aba com o plano PRO
    window.open(this.stripeCheckoutUrl, '_blank');
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
