/* ==========================================================================
   SnapFlow - Supabase Authentication & SaaS User Plan Management Engine
   Micro-Badge Minimalista (Vercel / Raycast Style) + Controle Estrito Free/PRO
   ========================================================================== */

class SupabaseAuthModule {
  constructor() {
    // Configurações Oficiais do Projeto Supabase
    this.supabaseUrl = 'https://fcynqxsrmdegzrorwsrp.supabase.co';
    this.supabaseAnonKey = 'sb_publishable_rguLiiKHtTpdUnIJhe1NNg_yxDWQpUP';

    this.user = null;
    this.userPlan = 'free'; // Padrão estrito: todo usuário entra como FREE

    this.initSupabaseClient();
    this.initEvents();
    this.checkSession();
  }

  initSupabaseClient() {
    if (window.supabase) {
      try {
        this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
        console.log('[SnapFlow Auth] Conectado ao Supabase!');
      } catch (err) {
        console.warn('[SnapFlow Auth] Erro ao inicializar Supabase:', err);
      }
    }
  }

  initEvents() {
    const loginBtn = document.getElementById('authLoginBtn');
    const modal = document.getElementById('authModal');
    const closeBtn = document.getElementById('closeAuthModalBtn');

    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.openModal());
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }

    // Google Auth Button
    const googleBtn = document.getElementById('googleAuthBtn');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => this.loginWithGoogle());
    }

    // Email Form Auth (Magic Link)
    const authForm = document.getElementById('authEmailForm');
    if (authForm) {
      authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleEmailAuth();
      });
    }

    // Logout Button
    const logoutBtn = document.getElementById('authLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.logout();
      });
    }

    // Clique na badge para ir para planos se for Free
    const userBadge = document.getElementById('userProfileBadge');
    if (userBadge) {
      userBadge.addEventListener('click', () => {
        if (this.userPlan === 'free' && window.appController) {
          window.appController.showScreen(4); // Tela de Preços
        }
      });
    }
  }

  openModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('hidden');
  }

  closeModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.add('hidden');
  }

  async checkSession() {
    const savedUser = localStorage.getItem('snapflow_user');
    const savedPlan = localStorage.getItem('snapflow_plan') || 'free';

    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
        this.userPlan = savedPlan;
        this.updateUiState();
      } catch (e) {
        console.error(e);
      }
    }

    if (this.client) {
      const { data: { session } } = await this.client.auth.getSession();
      if (session && session.user) {
        this.user = session.user;
        // Padrão estrito: lê a flag do Supabase (user_metadata.plan) ou define como 'free'
        this.userPlan = session.user.user_metadata?.plan || 'free';
        localStorage.setItem('snapflow_user', JSON.stringify(this.user));
        localStorage.setItem('snapflow_plan', this.userPlan);
        this.updateUiState();
      }

      this.client.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          this.user = session.user;
          this.userPlan = session.user.user_metadata?.plan || 'free';
          localStorage.setItem('snapflow_user', JSON.stringify(this.user));
          localStorage.setItem('snapflow_plan', this.userPlan);
        } else {
          this.user = null;
          this.userPlan = 'free';
          localStorage.removeItem('snapflow_user');
          localStorage.setItem('snapflow_plan', 'free');
        }
        this.updateUiState();
      });
    }
  }

  async loginWithGoogle() {
    if (!this.client) return;

    const { error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + window.location.pathname
      }
    });

    if (error) {
      Utils.showToast(`Erro Google Auth: ${error.message}`, 'error');
    }
  }

  async handleEmailAuth() {
    const emailEl = document.getElementById('authEmailInput');
    const email = emailEl ? emailEl.value.trim() : '';

    if (!email) {
      Utils.showToast('Por favor digite um e-mail válido!');
      return;
    }

    if (this.client) {
      const { error } = await this.client.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin + window.location.pathname,
        }
      });

      if (error) {
        Utils.showToast(`Erro ao enviar e-mail: ${error.message}`, 'error');
      } else {
        Utils.showToast(`Enviamos um link mágico de acesso para ${email}! Verifique seu e-mail.`);
        this.closeModal();
      }
    }
  }

  logout() {
    if (this.client) {
      this.client.auth.signOut();
    }
    this.user = null;
    this.userPlan = 'free';
    localStorage.removeItem('snapflow_user');
    localStorage.setItem('snapflow_plan', 'free');
    this.updateUiState();
    Utils.showToast('Você saiu da sua conta do SnapFlow.');
  }

  updateUiState() {
    const loginBtn = document.getElementById('authLoginBtn');
    const badge = document.getElementById('userProfileBadge');
    const nameLabel = document.getElementById('userNameLabel');
    const planTag = document.getElementById('userPlanTag');
    const userAvatar = document.getElementById('userAvatarInitial');

    if (this.user) {
      if (loginBtn) loginBtn.classList.add('hidden');
      if (badge) badge.classList.remove('hidden');

      const displayName = this.user.user_metadata?.full_name || this.user.email.split('@')[0];
      const initial = displayName.charAt(0).toUpperCase();

      if (userAvatar) userAvatar.textContent = initial;
      if (nameLabel) nameLabel.textContent = displayName;

      if (planTag) {
        if (this.userPlan === 'pro') {
          planTag.textContent = 'PRO 👑';
          planTag.className = 'micro-plan-badge pro-badge';
        } else {
          const count = window.limitGuard ? window.limitGuard.getUsageCount() : 0;
          planTag.textContent = `FREE (${count}/10)`;
          planTag.className = 'micro-plan-badge free-badge';
        }
      }
    } else {
      if (loginBtn) loginBtn.classList.remove('hidden');
      if (badge) badge.classList.add('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.supabaseAuthModule = new SupabaseAuthModule();
});
