/* ==========================================================================
   SnapFlow - Free Tier Limit Guard & PRO Upgrade Paywall Engine
   Controle de Limite de 10 Edições/Mês para Usuários Grátis + Paywall Modal
   ========================================================================== */

class LimitGuardModule {
  constructor() {
    this.maxFreeLimit = 10;
    this.initEvents();
    this.checkMonthlyReset();
  }

  initEvents() {
    const closeModalBtn = document.getElementById('closePaywallModalBtn');
    const paywallModal = document.getElementById('paywallModal');
    const upgradeBtn = document.getElementById('paywallUpgradeBtn');

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => this.closePaywall());
    }

    if (paywallModal) {
      paywallModal.addEventListener('click', (e) => {
        if (e.target === paywallModal) this.closePaywall();
      });
    }

    if (upgradeBtn) {
      upgradeBtn.addEventListener('click', () => {
        this.closePaywall();
        if (window.appController) {
          window.appController.showScreen(4); // Navega para a tela de Preços & Planos
        }
      });
    }
  }

  getCurrentMonthKey() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}`;
  }

  checkMonthlyReset() {
    const currentMonth = this.getCurrentMonthKey();
    const savedMonth = localStorage.getItem('snapflow_usage_month');

    if (savedMonth !== currentMonth) {
      localStorage.setItem('snapflow_usage_month', currentMonth);
      localStorage.setItem('snapflow_usage_count', '0');
    }
  }

  getUsageCount() {
    this.checkMonthlyReset();
    return parseInt(localStorage.getItem('snapflow_usage_count') || '0', 10);
  }

  incrementUsage() {
    const currentPlan = localStorage.getItem('snapflow_plan') || 'free';
    if (currentPlan === 'pro') return true; // Usuários PRO não possuem limites

    const currentCount = this.getUsageCount();
    const newCount = currentCount + 1;
    localStorage.setItem('snapflow_usage_count', newCount.toString());

    // Atualiza contador na barra de status da sessão
    const statsFilesProcessed = document.getElementById('statsFilesProcessed');
    if (statsFilesProcessed) {
      statsFilesProcessed.textContent = newCount.toString();
    }

    return true;
  }

  canProcess() {
    const currentPlan = localStorage.getItem('snapflow_plan') || 'free';
    if (currentPlan === 'pro') return true;

    const count = this.getUsageCount();
    if (count >= this.maxFreeLimit) {
      this.openPaywall();
      return false;
    }
    return true;
  }

  openPaywall(reason = 'limit') {
    const modal = document.getElementById('paywallModal');
    const title = document.getElementById('paywallModalTitle');
    const desc = document.getElementById('paywallModalDesc');

    if (reason === 'pro_feature') {
      if (title) title.textContent = 'Recurso Exclusivo do Plano PRO 🚀';
      if (desc) desc.textContent = 'Esta ferramenta ou qualidade de exportação (PNG 4K / Upscale 4x) é um benefício exclusivo para assinantes do Plano PRO.';
    } else {
      if (title) title.textContent = 'Você Atingiu seu Limite Grátis! 🛑';
      if (desc) desc.textContent = `Você utilizou suas ${this.maxFreeLimit} edições gratuitas este mês. Assine o Plano PRO por apenas R$ 29/mês para continuar criando sem limites!`;
    }

    if (modal) modal.classList.remove('hidden');
  }

  closePaywall() {
    const modal = document.getElementById('paywallModal');
    if (modal) modal.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.limitGuard = new LimitGuardModule();
});
