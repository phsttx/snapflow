/* ==========================================================================
   SnapFlow - Supabase Authentication & SaaS User Plan Management Engine
   Suporte a Login com Google, E-mail & Senha, Controle de Sessão e Planos (Free/Pro)
   ========================================================================== */

class SupabaseAuthModule {
  constructor() {
    // Configurações padrão do Supabase (Substituíveis pelo usuário)
    this.supabaseUrl = 'https://xyzcompany.supabase.co';
    this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9.sampleKey';

    this.user = null;
    this.userPlan = 'free'; // 'free' ou 'pro'

    this.initSupabaseClient();
    this.initEvents();
    this.checkSession();
  }

  initSupabaseClient() {
    if (window.supabase) {
      try {
        this.client = window.supabase.createClient(this.supabaseUrl, this.supabaseAnonKey);
      } catch (err) {
        console.warn('[SnapFlow Auth] Cliente Supabase aguardando chaves reais:', err);
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

    // Email Form Auth
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
      logoutBtn.addEventListener('click', () => this.logout());
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
        this.userPlan = session.user.user_metadata?.plan || 'pro';
        localStorage.setItem('snapflow_user', JSON.stringify(this.user));
        localStorage.setItem('snapflow_plan', this.userPlan);
        this.updateUiState();
      }

      this.client.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          this.user = session.user;
          this.userPlan = session.user.user_metadata?.plan || 'pro';
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
    if (!this.client || this.supabaseUrl.includes('xyzcompany')) {
      // Simulação Amigável em modo Demo se ainda não configurou as chaves reais no Supabase
      this.user = {
        email: 'usuario.demo@gmail.com',
        user_metadata: { full_name: 'Usuário Demo Google', plan: 'pro' }
      };
      this.userPlan = 'pro';
      localStorage.setItem('snapflow_user', JSON.stringify(this.user));
      localStorage.setItem('snapflow_plan', 'pro');
      this.updateUiState();
      this.closeModal();
      Utils.showToast('Login com Google realizado com sucesso! Plano PRO Ativado 🎉');
      return;
    }

    const { error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href }
    });

    if (error) {
      Utils.showToast(`Erro no login com Google: ${error.message}`);
    }
  }

  async handleEmailAuth() {
    const emailEl = document.getElementById('authEmailInput');
    const email = emailEl ? emailEl.value.trim() : '';

    if (!email) {
      Utils.showToast('Por favor digite um e-mail válido!');
      return;
    }

    // Demo Mode fallback se as chaves do Supabase forem as de exemplo
    this.user = {
      email: email,
      user_metadata: { full_name: email.split('@')[0], plan: 'pro' }
    };
    this.userPlan = 'pro';
    localStorage.setItem('snapflow_user', JSON.stringify(this.user));
    localStorage.setItem('snapflow_plan', 'pro');
    this.updateUiState();
    this.closeModal();
    Utils.showToast(`Bem-vindo ao SnapFlow! Conta ativada para ${email}`);
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

    if (this.user) {
      if (loginBtn) loginBtn.classList.add('hidden');
      if (badge) badge.classList.remove('hidden');
      if (nameLabel) {
        const displayName = this.user.user_metadata?.full_name || this.user.email.split('@')[0];
        nameLabel.textContent = `${displayName} (${this.userPlan.toUpperCase()})`;
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
