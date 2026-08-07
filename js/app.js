/* ==========================================================================
   SnapFlow - 4-Screen Router & PWA Service Worker Registration Engine
   ========================================================================== */

class AppController {
  constructor() {
    this.currentStep = 1; // 1: Splash, 2: Hub, 3: Studio, 4: Pricing
    this.currentTab = 'compressor';

    this.initSplashscreen();
    this.initHeaderNavigation();
    this.initHubScreen();
    this.initSearchTypewriter();
    this.initSidebarNavigation();
    this.initThemeToggle();
    this.initPwaSupport();
  }

  /* 1. Splashscreen */
  initSplashscreen() {
    const splash = document.getElementById('splashOverlay');
    const startBtn = document.getElementById('splashStartBtn');

    if (!splash) return;

    const goToHub = () => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
        this.showScreen(2);
      }, 500);
    };

    if (startBtn) {
      startBtn.addEventListener('click', goToHub);
    }

    setTimeout(() => {
      if (this.currentStep === 1) goToHub();
    }, 2200);
  }

  /* 2. Top Header Navigation Router */
  initHeaderNavigation() {
    const navHomeLink = document.getElementById('navHomeLink');
    const navPricingLink = document.getElementById('navPricingLink');
    const showHubBtn = document.getElementById('showHubBtn');
    const brandLogoBtn = document.getElementById('brandLogoBtn');

    if (navHomeLink) navHomeLink.addEventListener('click', () => this.showScreen(2));
    if (navPricingLink) navPricingLink.addEventListener('click', () => this.showScreen(4));
    if (showHubBtn) showHubBtn.addEventListener('click', () => this.showScreen(2));
    if (brandLogoBtn) brandLogoBtn.addEventListener('click', () => this.showScreen(2));
  }

  /* 3. Grid Hub Screen & Real-time Search */
  initHubScreen() {
    const searchInput = document.getElementById('hubSearchInput');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.hub-card').forEach(card => {
          const text = card.textContent.toLowerCase();
          if (text.includes(query)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }

    document.querySelectorAll('.hub-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('disabled-card')) return;
        const tabId = card.dataset.openTab;
        if (tabId) {
          this.openStudioScreen(tabId);
        }
      });
    });

    // Pricing Billing Toggle (Monthly / Annual)
    const toggleSwitch = document.getElementById('pricingToggleSwitch');
    const proPriceVal = document.getElementById('proPriceVal');
    const proPeriodVal = document.getElementById('proPeriodVal');

    if (toggleSwitch) {
      toggleSwitch.addEventListener('click', () => {
        toggleSwitch.classList.toggle('annual');
        if (toggleSwitch.classList.contains('annual')) {
          if (proPriceVal) proPriceVal.textContent = 'R$ 23';
          if (proPeriodVal) proPeriodVal.textContent = '/ mês (anual)';
          Utils.showToast('Desconto de 20% aplicado no plano Anual!');
        } else {
          if (proPriceVal) proPriceVal.textContent = 'R$ 29';
          if (proPeriodVal) proPeriodVal.textContent = '/ mês';
        }
      });
    }
  }

  /* 4. Typewriter Search Placeholder Engine */
  initSearchTypewriter() {
    const searchInput = document.getElementById('hubSearchInput');
    if (!searchInput) return;

    const phrases = [
      'PDF',
      'Cortar',
      'Upscale',
      'Fundo',
      'Mockup',
      'Favicon',
      'QR Code',
      'Waveform',
      'Compressor',
      'Marca d\'água',
      'Vetores SVG',
      'Metadados EXIF'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    let timer = null;

    const type = () => {
      if (isPaused || document.activeElement === searchInput || searchInput.value.length > 0) {
        timer = setTimeout(type, 500);
        return;
      }

      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      const currentText = currentPhrase.substring(0, charIndex);
      searchInput.setAttribute('placeholder', `Buscar ferramenta (ex: ${currentText}|)`);

      let typeSpeed = isDeleting ? 60 : 120;

      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 1800; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; // Pause before next word
      }

      timer = setTimeout(type, typeSpeed);
    };

    searchInput.addEventListener('focus', () => {
      isPaused = true;
      searchInput.setAttribute('placeholder', 'Digite para buscar...');
    });

    searchInput.addEventListener('blur', () => {
      if (searchInput.value.length === 0) {
        isPaused = false;
      }
    });

    type();
  }

  /* 5. PWA Service Worker & Install Prompt Support */
  initPwaSupport() {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => console.log('[SnapFlow PWA] Service Worker registrado!', reg.scope))
          .catch((err) => console.log('[SnapFlow PWA] Registro SW falhou:', err));
      });
    }

    let deferredPrompt = null;
    const installBtn = document.getElementById('pwaInstallBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            Utils.showToast('SnapFlow instalado com sucesso como App!');
          }
          deferredPrompt = null;
        } else if (location.protocol === 'file:') {
          Utils.showToast('📱 PWA pronto! Ao publicar na web (Vercel/Netlify) ou rodar em servidor local, o app instala em 1-clique!');
        } else {
          Utils.showToast('Para instalar, clique no ícone de instalar [⊕] na barra de endereço do seu navegador!');
        }
      });
    }
  }

  openStudioScreen(tabId) {
    this.currentTab = tabId;
    this.showScreen(3);
    this.switchTab(tabId);
  }

  /* Screen Switcher Engine (ClassList Toggle Fix) */
  showScreen(stepNumber) {
    this.currentStep = stepNumber;

    const hubScreen = document.getElementById('hubScreen');
    const workspaceLayout = document.getElementById('workspaceLayout');
    const pricingScreen = document.getElementById('pricingScreen');
    const showHubBtn = document.getElementById('showHubBtn');

    document.querySelectorAll('.header-nav-link').forEach(link => link.classList.remove('active'));

    if (stepNumber === 2) {
      // Step 2: Show Selection Screen ONLY
      if (workspaceLayout) workspaceLayout.classList.add('hidden');
      if (pricingScreen) pricingScreen.classList.add('hidden');
      if (hubScreen) hubScreen.classList.remove('hidden');

      if (showHubBtn) showHubBtn.classList.add('hidden');
      const homeLink = document.getElementById('navHomeLink');
      if (homeLink) homeLink.classList.add('active');
    } else if (stepNumber === 3) {
      // Step 3: Show Studio Workspace ONLY
      if (hubScreen) hubScreen.classList.add('hidden');
      if (pricingScreen) pricingScreen.classList.add('hidden');
      if (workspaceLayout) workspaceLayout.classList.remove('hidden');

      if (showHubBtn) showHubBtn.classList.remove('hidden');
    } else if (stepNumber === 4) {
      // Step 4: Show Pricing Screen ONLY
      if (hubScreen) hubScreen.classList.add('hidden');
      if (workspaceLayout) workspaceLayout.classList.add('hidden');
      if (pricingScreen) pricingScreen.classList.remove('hidden');

      if (showHubBtn) showHubBtn.classList.add('hidden');
      const pricingLink = document.getElementById('navPricingLink');
      if (pricingLink) pricingLink.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* Sidebar Studio Router */
  initSidebarNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (item.classList.contains('disabled-nav-item')) return;
        const tabId = item.dataset.tab;
        this.switchTab(tabId);
      });
    });
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.tab === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
      if (panel.id === `${tabId}Tab`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  }

  /* Theme Toggle */
  initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    const savedTheme = localStorage.getItem('snapflow_theme') || 'dark';
    if (savedTheme === 'light') {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
          body.classList.remove('light-theme');
          body.classList.add('dark-theme');
          localStorage.setItem('snapflow_theme', 'dark');
          if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
        } else {
          body.classList.remove('dark-theme');
          body.classList.add('light-theme');
          localStorage.setItem('snapflow_theme', 'light');
          if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
        }
        if (window.lucide) lucide.createIcons();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
  if (window.lucide) lucide.createIcons();
});
