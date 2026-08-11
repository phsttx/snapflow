/* ==========================================================================
   SnapFlow - High-End Awwwards-Tier UI Animation & Router Engine
   Features: GSAP Coreographed Entrances, 3D Tilt Cards, Magnetic Buttons & Ambient Cursor
   ========================================================================== */

class AppController {
  constructor() {
    this.currentStep = 1; // 1: Splash, 2: Hub, 3: Studio, 4: Pricing
    this.currentTab = 'compressor';

    this.initAmbientCursor();
    this.initSplashscreen();
    this.initHeaderNavigation();
    this.initHubScreen();
    this.initCardSpotlightAndTilt();
    this.initMagneticButtons();
    this.initSearchTypewriter();
    this.initSidebarNavigation();
    this.initThemeToggle();
    this.initPwaSupport();
    this.initCookieConsent();
    this.initKeyboardShortcuts();
    this.initScrollReveal();
    this.initSmoothHeaderShrink();
  }

  /* 0. Ambient Magnetic Cursor Follower */
  initAmbientCursor() {
    const glow = document.getElementById('ambientCursorGlow');
    const dot = document.getElementById('ambientCursorDot');
    if (!glow || !dot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetX = mouseX;
    let targetY = mouseY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    const updateCursor = () => {
      mouseX += (targetX - mouseX) * 0.15;
      mouseY += (targetY - mouseY) * 0.15;

      glow.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;

      requestAnimationFrame(updateCursor);
    };
    updateCursor();

    // Hover Scaling for Interactive Elements
    const interactiveSelectors = 'button, a, .hub-card, input, select, .nav-item, .pricing-card';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        dot.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        dot.classList.remove('cursor-hover');
      }
    });
  }

  /* 1. Minimalist Obsidian Splashscreen Controller */
  initSplashscreen() {
    const splash = document.getElementById('splashOverlay');
    if (!splash) return;

    // Session Protection: garante que só roda uma vez por sessão
    if (sessionStorage.getItem('snapflow_splash_played')) {
      splash.style.display = 'none';
      this.showScreen(2);
      return;
    }

    let isDismissed = false;

    const goToHub = () => {
      if (isDismissed) return;
      isDismissed = true;
      sessionStorage.setItem('snapflow_splash_played', 'true');

      if (window.gsap) {
        gsap.to(splash, {
          opacity: 0,
          duration: 0.45,
          ease: 'power2.inOut',
          onComplete: () => {
            splash.style.display = 'none';
            this.showScreen(2);
          }
        });
      } else {
        splash.style.opacity = '0';
        setTimeout(() => {
          splash.style.display = 'none';
          this.showScreen(2);
        }, 350);
      }
    };

    // Smooth transition right when subtle loader finishes
    setTimeout(() => {
      goToHub();
    }, 2100);
  }

  /* 2. Top Header Navigation Router */
  initHeaderNavigation() {
    const navHomeLink = document.getElementById('navHomeLink');
    const navPricingLink = document.getElementById('navPricingLink');
    const showHubBtn = document.getElementById('showHubBtn');
    const brandLogoBtn = document.getElementById('brandLogoBtn');
    const footerPricingLink = document.getElementById('footerPricingLink');

    if (navHomeLink) navHomeLink.addEventListener('click', () => this.showScreen(2));
    if (navPricingLink) navPricingLink.addEventListener('click', () => this.showScreen(4));
    if (showHubBtn) showHubBtn.addEventListener('click', () => this.showScreen(2));
    if (brandLogoBtn) brandLogoBtn.addEventListener('click', () => this.showScreen(2));
    if (footerPricingLink) {
      footerPricingLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.showScreen(4);
      });
    }

    // Footer Tool Links
    document.querySelectorAll('[data-footer-tool]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const toolId = link.dataset.footerTool;
        if (toolId) {
          this.openStudioScreen(toolId);
        }
      });
    });
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

  /* 4. 3D Tilt & Cursor Spotlight Tracking */
  initCardSpotlightAndTilt() {
    const cards = document.querySelectorAll('.hub-card, .glass-card, .pricing-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        if (card.classList.contains('hub-card')) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -7;
          const rotateY = ((x - centerX) / centerX) * 7;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        if (card.classList.contains('hub-card')) {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        }
      });
    });
  }

  /* 5. Magnetic Button Physics */
  initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.brand-logo, .header-nav-link, .hero-badge-pill');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* 6. Multi-Language Search Box Typewriter Effect */
  initSearchTypewriter() {
    const searchInput = document.getElementById('hubSearchInput');
    if (!searchInput) return;

    const getPlaceholders = () => {
      if (window.i18nEngine && typeof window.i18nEngine.t === 'function') {
        const list = window.i18nEngine.t('search_placeholders');
        if (Array.isArray(list) && list.length) return list;
      }
      return [
        'Buscar ferramenta (ex: Compressor, WebP)...',
        'Experimente: Converter PNG em WebP...',
        'Experimente: Gerador de QR Code com Logo...',
        'Experimente: HD Upscaler Nitidez 4K...',
        'Experimente: Marca d\'Água com Presets...'
      ];
    };

    let placeholders = getPlaceholders();
    let phIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isFocused = false;

    // Listen to language change to immediately update placeholders
    window.addEventListener('snapflow:langchange', () => {
      placeholders = getPlaceholders();
      phIndex = 0;
      charIndex = 0;
      isDeleting = false;
    });

    searchInput.addEventListener('focus', () => { 
      isFocused = true; 
      const focusedText = window.i18nEngine ? window.i18nEngine.t('search_focused_placeholder') : 'Digite para pesquisar...';
      searchInput.placeholder = focusedText || 'Digite para pesquisar...'; 
    });
    searchInput.addEventListener('blur', () => { isFocused = false; });

    const typeLoop = () => {
      if (isFocused) {
        setTimeout(typeLoop, 500);
        return;
      }

      placeholders = getPlaceholders();
      const currentText = placeholders[phIndex] || placeholders[0];

      if (isDeleting) {
        searchInput.placeholder = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        searchInput.placeholder = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 25 : 55;

      if (!isDeleting && charIndex === currentText.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phIndex = (phIndex + 1) % placeholders.length;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    };

    setTimeout(typeLoop, 1000);
  }

  /* 7. Keyboard Shortcuts (/ to search) */
  initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('hubSearchInput');
        if (searchInput && this.currentStep === 2) {
          searchInput.focus();
        }
      }
    });
  }

  openStudioScreen(tabId) {
    this.currentTab = tabId;
    this.showScreen(3);
    this.switchTab(tabId);
  }

  /* Screen Switcher Engine with GSAP Choreography (Enhanced) */
  showScreen(stepNumber) {
    this.currentStep = stepNumber;

    const hubScreen = document.getElementById('hubScreen');
    const workspaceLayout = document.getElementById('workspaceLayout');
    const pricingScreen = document.getElementById('pricingScreen');
    const showHubBtn = document.getElementById('showHubBtn');

    document.querySelectorAll('.header-nav-link').forEach(link => link.classList.remove('active'));

    if (stepNumber === 2) {
      if (workspaceLayout) workspaceLayout.classList.add('hidden');
      if (pricingScreen) pricingScreen.classList.add('hidden');
      if (hubScreen) hubScreen.classList.remove('hidden');

      if (showHubBtn) showHubBtn.classList.add('hidden');
      const homeLink = document.getElementById('navHomeLink');
      if (homeLink) homeLink.classList.add('active');

      // Enhanced GSAP Stagger Entrance with spring-like feel
      if (window.gsap) {
        gsap.fromTo('.hub-header > *', 
          { opacity: 0, y: 24, filter: 'blur(6px)' }, 
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, stagger: 0.08, ease: 'power3.out' }
        );
        gsap.fromTo('.hub-card', 
          { opacity: 0, y: 40, scale: 0.94, rotateX: 8 }, 
          { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 0.6, stagger: 0.04, ease: 'back.out(1.4)', delay: 0.12 }
        );
        gsap.fromTo('.hub-category-title',
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out', delay: 0.05 }
        );
      }
    } else if (stepNumber === 3) {
      if (hubScreen) hubScreen.classList.add('hidden');
      if (pricingScreen) pricingScreen.classList.add('hidden');
      if (workspaceLayout) workspaceLayout.classList.remove('hidden');

      if (showHubBtn) showHubBtn.classList.remove('hidden');

      if (window.gsap) {
        gsap.fromTo('.sidebar', 
          { opacity: 0, x: -30, filter: 'blur(4px)' }, 
          { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out' }
        );
        gsap.fromTo('.tab-panel.active', 
          { opacity: 0, y: 20, filter: 'blur(4px)' }, 
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out', delay: 0.1 }
        );
      }
    } else if (stepNumber === 4) {
      if (hubScreen) hubScreen.classList.add('hidden');
      if (workspaceLayout) workspaceLayout.classList.add('hidden');
      if (pricingScreen) pricingScreen.classList.remove('hidden');

      if (showHubBtn) showHubBtn.classList.add('hidden');
      const pricingLink = document.getElementById('navPricingLink');
      if (pricingLink) pricingLink.classList.add('active');

      if (window.gsap) {
        gsap.fromTo('.pricing-header > *', 
          { opacity: 0, y: 24, filter: 'blur(6px)' }, 
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, stagger: 0.08, ease: 'power3.out' }
        );
        gsap.fromTo('.pricing-card', 
          { opacity: 0, y: 35, scale: 0.96 }, 
          { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.2)', delay: 0.15 }
        );
        // Animate guarantee and FAQ sections too
        gsap.fromTo('.pricing-guarantee-card', 
          { opacity: 0, y: 25 }, 
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.5 }
        );
        gsap.fromTo('.faq-card', 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.6 }
        );
      }
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
        if (window.gsap) {
          gsap.fromTo(panel, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
        }
      } else {
        panel.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Theme Switcher */
  initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const body = document.body;

    const renderIcon = (isLight) => {
      if (!themeBtn) return;
      themeBtn.innerHTML = isLight 
        ? '<i data-lucide="sun"></i>' 
        : '<i data-lucide="moon"></i>';
      if (window.lucide) lucide.createIcons();
    };

    const savedTheme = localStorage.getItem('snapflow_theme') || 'dark';
    if (savedTheme === 'light') {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      renderIcon(true);
    } else {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      renderIcon(false);
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const isNowLight = !body.classList.contains('light-theme');
        if (isNowLight) {
          body.classList.remove('dark-theme');
          body.classList.add('light-theme');
          localStorage.setItem('snapflow_theme', 'light');
        } else {
          body.classList.remove('light-theme');
          body.classList.add('dark-theme');
          localStorage.setItem('snapflow_theme', 'dark');
        }
        renderIcon(isNowLight);
      });
    }
  }

  /* PWA Installation Support */
  initPwaSupport() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => console.log('[SnapFlow PWA] Service Worker registrado!', reg.scope))
          .catch((err) => console.log('[SnapFlow PWA] Registro SW falhou:', err));
      });
    }
  }

  /* Cookie Consent Banner (LGPD / GDPR Compliant) */
  initCookieConsent() {
    const banner = document.getElementById('cookieConsentBanner');
    const acceptBtn = document.getElementById('acceptCookieBtn');

    if (!banner || !acceptBtn) return;

    const hasConsent = localStorage.getItem('snapflow_cookie_consent');
    if (!hasConsent) {
      setTimeout(() => {
        banner.classList.remove('hidden');
        if (window.gsap) {
          gsap.fromTo(banner, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
        }
        if (window.lucide) lucide.createIcons();
      }, 1200);
    }

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('snapflow_cookie_consent', 'true');
      if (window.gsap) {
        gsap.to(banner, { opacity: 0, y: 30, duration: 0.4, ease: 'power3.in', onComplete: () => banner.classList.add('hidden') });
      } else {
        banner.classList.add('hidden');
      }
    });
  }

  /* Scroll-Reveal: IntersectionObserver for Cards & Sections */
  initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    // Observe pricing cards, FAQ cards, and guarantee card on scroll
    const revealTargets = document.querySelectorAll('.pricing-card, .faq-card, .pricing-guarantee-card');
    revealTargets.forEach(el => {
      el.classList.add('scroll-reveal');
      revealObserver.observe(el);
    });
  }

  /* Smooth Header Background on Scroll */
  initSmoothHeaderShrink() {
    const header = document.querySelector('.app-header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
          } else {
            header.classList.remove('header-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
  if (window.lucide) lucide.createIcons();
});
