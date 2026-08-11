/* ==========================================================================
   SnapFlow - Multi-Language Internationalization (i18n) Engine
   Languages: 🇧🇷 Português (PT-BR), 🇺🇸 English (EN-US), 🇪🇸 Español (ES)
   Features: Minimalist SVG Flag Dropdown & Instant Client-Side Translations
   ========================================================================== */

const SVG_FLAGS = {
  pt: `<svg class="svg-flag" viewBox="0 0 640 480"><g fill-rule="evenodd"><path fill="#009c3b" d="M0 0h640v480H0z"/><path fill="#ffdf00" d="M320 40L600 240 320 440 40 240z"/><circle cx="320" cy="240" r="105" fill="#002776"/><path fill="#fff" d="M217 255a105 105 0 0 0 206-30 106 106 0 0 1-206 30z"/></g></svg>`,
  en: `<svg class="svg-flag" viewBox="0 0 640 480"><g fill-rule="evenodd"><path fill="#bd3d44" d="M0 0h640v480H0z"/><path stroke="#fff" stroke-width="37" d="M0 55.5h640M0 129.5h640M0 203.5h640M0 277.5h640M0 351.5h640M0 425.5h640"/><path fill="#192f5d" d="M0 0h260v259H0z"/><circle cx="45" cy="45" r="8" fill="#fff"/><circle cx="95" cy="45" r="8" fill="#fff"/><circle cx="145" cy="45" r="8" fill="#fff"/><circle cx="195" cy="45" r="8" fill="#fff"/><circle cx="70" cy="85" r="8" fill="#fff"/><circle cx="120" cy="85" r="8" fill="#fff"/><circle cx="170" cy="85" r="8" fill="#fff"/><circle cx="45" cy="125" r="8" fill="#fff"/><circle cx="95" cy="125" r="8" fill="#fff"/><circle cx="145" cy="125" r="8" fill="#fff"/><circle cx="195" cy="125" r="8" fill="#fff"/><circle cx="70" cy="165" r="8" fill="#fff"/><circle cx="120" cy="165" r="8" fill="#fff"/><circle cx="170" cy="165" r="8" fill="#fff"/><circle cx="45" cy="205" r="8" fill="#fff"/><circle cx="95" cy="205" r="8" fill="#fff"/><circle cx="145" cy="205" r="8" fill="#fff"/><circle cx="195" cy="205" r="8" fill="#fff"/></g></svg>`,
  es: `<svg class="svg-flag" viewBox="0 0 640 480"><path fill="#aa151b" d="M0 0h640v480H0z"/><path fill="#f1bf00" d="M0 120h640v240H0z"/></svg>`
};

const SNAPFLOW_TRANSLATIONS = {
  pt: {
    // Header & Nav
    nav_plans: "Planos",
    nav_all_tools: "Ver Ferramentas",
    nav_signin: "Entrar",
    nav_logout: "Sair",
    nav_account: "Conta",

    // Rotating Hero Headlines (3 Frases Alternadas)
    hero_headlines: [
      { prefix: "Edite, converta e otimize mídia com ", gradient: "velocidade máxima", suffix: "" },
      { prefix: "Comprima, converta e crie em ", gradient: "poucos cliques", suffix: "" },
      { prefix: "O fluxo definitivo para ", gradient: "designers e criadores", suffix: "" }
    ],

    hero_search_placeholder: "Buscar ferramenta (ex: Compressor, WebP, QR Code)...",
    hero_privacy_pill: "100% Privado & Local",
    category_essential: "FERRAMENTAS ESSENCIAIS DE MÍDIA & DESIGN",

    // Tool Cards
    card_compressor_title: "Compressor & Lote ZIP",
    card_compressor_desc: "Reduza o tamanho de até 100 fotos preservando a qualidade visual. Baixe tudo em ZIP.",
    card_converter_title: "Conversor em Lote",
    card_converter_desc: "Converta entre PNG, JPG, WebP, AVIF e ICO em lote com download em ZIP.",
    card_cropper_title: "Recorte & Filtros",
    card_cropper_desc: "Recorte imagens em proporções 1:1, 16:9, 4:3, rotacione e aplique filtros visuais.",
    card_upscaler_title: "HD Upscaler & Nitidez",
    card_upscaler_desc: "Amplie a resolução (2x/4x HD) e recupere detalhes com o filtro Unsharp Mask.",
    card_qrcode_title: "Gerador de QR Code",
    card_qrcode_desc: "Crie códigos QR para URL, Texto e Wi-Fi com logo central e cores customizáveis.",
    card_watermark_title: "Marca d'Água",
    card_watermark_desc: "Proteja suas fotos aplicando marca d'água com texto ou logo e salvamento de presets.",
    card_svg_title: "Editor SVG & PNG HD",
    card_svg_desc: "Edite cores de vetores SVG em tempo real e converta para PNG em 2x, 4x e 8x HD.",
    card_favicon_title: "Gerador de Favicon",
    card_favicon_desc: "Gere conjuntos completos de favicons e ícones para iOS, Android e PWA.",
    card_video_title: "Extrator de Vídeo",
    card_video_desc: "Capture momentos de vídeos em fotos HD com precisão milimétrica.",
    card_mockup_title: "Estúdio de Mockups",
    card_mockup_desc: "Enquadre screenshots em molduras 3D fotorrealistas de iPhone, MacBook e Safari.",
    card_open_action: "Abrir Ferramenta",

    // Sidebar & Session
    sidebar_title: "FERRAMENTAS DE MÍDIA",
    session_title: "Sessão Atual",
    session_files: "Arquivos",
    session_saved: "Economizados",

    // Common Buttons & Labels
    btn_upload_photos: "Selecionar Imagens (Lote)",
    btn_test_sample: "Testar com Exemplo",
    btn_download_zip: "Baixar Todas em ZIP",
    btn_download_file: "Baixar Imagem Otimizada",
    btn_clear: "Limpar",
    btn_add_more: "Mais Fotos",

    // Cookie Banner
    cookie_title: "Privacidade & Cookies 🍪",
    cookie_text: "Utilizamos cookies essenciais e métricas para aprimorar sua experiência. Seus arquivos continuam 100% processados localmente e privados no seu dispositivo.",
    cookie_btn: "Entendido",

    // Toasts
    toast_lang_changed: "Idioma alterado para Português!"
  },

  en: {
    // Header & Nav
    nav_plans: "Plans",
    nav_all_tools: "All Tools",
    nav_signin: "Sign In",
    nav_logout: "Sign Out",
    nav_account: "Account",

    // Rotating Hero Headlines (3 Alternating Phrases)
    hero_headlines: [
      { prefix: "Edit, convert and optimize media at ", gradient: "maximum speed", suffix: "" },
      { prefix: "Compress, convert and create in ", gradient: "a few clicks", suffix: "" },
      { prefix: "The definitive workflow for ", gradient: "designers & creators", suffix: "" }
    ],

    hero_search_placeholder: "Search tool (e.g. Compressor, WebP, QR Code)...",
    hero_privacy_pill: "100% Private & Local",
    category_essential: "ESSENTIAL MEDIA & DESIGN TOOLS",

    // Tool Cards
    card_compressor_title: "Compressor & ZIP Batch",
    card_compressor_desc: "Reduce the file size of up to 100 photos preserving quality. Download all in ZIP.",
    card_converter_title: "Batch Converter",
    card_converter_desc: "Convert between PNG, JPG, WebP, AVIF and ICO in batch with one-click ZIP download.",
    card_cropper_title: "Crop & Filters",
    card_cropper_desc: "Crop images in 1:1, 16:9, 4:3 ratios, rotate and apply visual photo filters.",
    card_upscaler_title: "HD Upscaler & Sharpness",
    card_upscaler_desc: "Upscale resolution (2x/4x HD) and restore crisp details with Unsharp Mask.",
    card_qrcode_title: "QR Code Generator",
    card_qrcode_desc: "Create custom QR codes for URL, Text and Wi-Fi with logo and custom colors.",
    card_watermark_title: "Watermark Studio",
    card_watermark_desc: "Protect your photos with text or logo watermarks and custom presets.",
    card_svg_title: "SVG & PNG HD Editor",
    card_svg_desc: "Edit SVG vector colors in real-time and export to crisp 2x, 4x, 8x HD PNG.",
    card_favicon_title: "Favicon Generator",
    card_favicon_desc: "Generate complete favicon packages and app icons for iOS, Android and PWA.",
    card_video_title: "Video Frame Extractor",
    card_video_desc: "Extract high-definition photo snapshots from video with frame-perfect precision.",
    card_mockup_title: "Mockup Studio",
    card_mockup_desc: "Frame screenshots into photorealistic 3D mockups of iPhone, MacBook and Safari.",
    card_open_action: "Open Tool",

    // Sidebar & Session
    sidebar_title: "MEDIA TOOLS",
    session_title: "Current Session",
    session_files: "Files",
    session_saved: "Saved Space",

    // Common Buttons & Labels
    btn_upload_photos: "Select Images (Batch)",
    btn_test_sample: "Try with Sample",
    btn_download_zip: "Download All in ZIP",
    btn_download_file: "Download Optimized Image",
    btn_clear: "Clear",
    btn_add_more: "Add More Photos",

    // Cookie Banner
    cookie_title: "Privacy & Cookies 🍪",
    cookie_text: "We use essential cookies and metrics to enhance your experience. Your files remain 100% processed locally and private on your device.",
    cookie_btn: "Got It",

    // Toasts
    toast_lang_changed: "Language switched to English!"
  },

  es: {
    // Header & Nav
    nav_plans: "Planes",
    nav_all_tools: "Ver Herramientas",
    nav_signin: "Ingresar",
    nav_logout: "Cerrar Sesión",
    nav_account: "Cuenta",

    // Rotating Hero Headlines (3 Frases Alternadas)
    hero_headlines: [
      { prefix: "Edita, convierte y optimiza medios a ", gradient: "máxima velocidad", suffix: "" },
      { prefix: "Comprime, convierte y crea en ", gradient: "pocos clics", suffix: "" },
      { prefix: "El flujo definitivo para ", gradient: "diseñadores y creadores", suffix: "" }
    ],

    hero_search_placeholder: "Buscar herramienta (ej: Compresor, WebP, QR)...",
    hero_privacy_pill: "100% Privado y Local",
    category_essential: "HERRAMIENTAS ESENCIALES DE MEDIOS Y DISEÑO",

    // Tool Cards
    card_compressor_title: "Compresor y Lote ZIP",
    card_compressor_desc: "Reduce el tamaño de hasta 100 fotos manteniendo la calidad. Descarga todo en ZIP.",
    card_converter_title: "Conversor en Lote",
    card_converter_desc: "Convierte entre PNG, JPG, WebP, AVIF e ICO por lotes con descarga directa en ZIP.",
    card_cropper_title: "Recorte y Filtros",
    card_cropper_desc: "Recorta imágenes en proporciones 1:1, 16:9, 4:3, rota y aplica filtros visuales.",
    card_upscaler_title: "HD Upscaler y Nitidez",
    card_upscaler_desc: "Amplía la resolución (2x/4x HD) e recupera detalles con el filtro Unsharp Mask.",
    card_qrcode_title: "Generador de Código QR",
    card_qrcode_desc: "Crea códigos QR para URL, Texto e Wi-Fi con logo central e colores personalizados.",
    card_watermark_title: "Marca de Agua",
    card_watermark_desc: "Protege tus fotos aplicando marca de agua con texto o logo y guardado de ajustes.",
    card_svg_title: "Editor SVG y PNG HD",
    card_svg_desc: "Edita colores de vectores SVG en tiempo real y convierte a PNG en 2x, 4x e 8x HD.",
    card_favicon_title: "Generador de Favicon",
    card_favicon_desc: "Genera paquetes completos de favicons e íconos para iOS, Android e PWA.",
    card_video_title: "Extractor de Video",
    card_video_desc: "Captura momentos de videos en fotos HD con precisión milimétrica.",
    card_mockup_title: "Estudio de Mockups",
    card_mockup_desc: "Enmarca capturas de pantalla en marcos 3D fotorrealistas de iPhone, MacBook e Safari.",
    card_open_action: "Abrir Herramienta",

    // Sidebar & Session
    sidebar_title: "HERRAMIENTAS DE MEDIOS",
    session_title: "Sesión Actual",
    session_files: "Archivos",
    session_saved: "Ahorrados",

    // Common Buttons & Labels
    btn_upload_photos: "Seleccionar Imágenes (Lote)",
    btn_test_sample: "Probar con Ejemplo",
    btn_download_zip: "Descargar Todas en ZIP",
    btn_download_file: "Descargar Imagen Optimizada",
    btn_clear: "Limpiar",
    btn_add_more: "Más Fotos",

    // Cookie Banner
    cookie_title: "Privacidad y Cookies 🍪",
    cookie_text: "Utilizamos cookies esenciales y métricas para mejorar tu experiencia. Tus archivos permanecen 100% procesados localmente y privados en tu dispositivo.",
    cookie_btn: "Entendido",

    // Toasts
    toast_lang_changed: "¡Idioma cambiado a Español!"
  }
};

class I18nEngine {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.currentHeadlineIndex = 0;
    this.rollerInterval = null;
    this.init();
  }

  detectLanguage() {
    const saved = localStorage.getItem('snapflow_lang');
    if (saved && ['pt', 'en', 'es'].includes(saved)) {
      return saved;
    }

    const browserLang = (navigator.language || navigator.userLanguage || 'pt').toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    if (browserLang.startsWith('es')) return 'es';
    return 'pt';
  }

  init() {
    this.applyTranslations(this.currentLang);
    this.initDropdown();
    this.initHeadlineRoller();
  }

  setLanguage(lang) {
    if (!SNAPFLOW_TRANSLATIONS[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('snapflow_lang', lang);
    this.applyTranslations(lang);
    this.updateActiveLanguageUI(lang);
    this.renderCurrentHeadline(false);
    this.closeDropdown();

    if (window.Utils && window.Utils.showToast) {
      const msg = SNAPFLOW_TRANSLATIONS[lang].toast_lang_changed;
      window.Utils.showToast(msg);
    }
  }

  applyTranslations(lang) {
    const dict = SNAPFLOW_TRANSLATIONS[lang];
    if (!dict) return;

    // Apply data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Apply data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Apply data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) {
        el.setAttribute('title', dict[key]);
      }
    });
  }

  initDropdown() {
    const trigger = document.getElementById('langDropdownTrigger');
    const menu = document.getElementById('langDropdownMenu');
    const wrapper = document.getElementById('langDropdownWrapper');

    if (trigger && menu) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('active');
        if (isOpen) {
          this.closeDropdown();
        } else {
          this.openDropdown();
        }
      });

      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (wrapper && !wrapper.contains(e.target)) {
          this.closeDropdown();
        }
      });
    }

    // Option Buttons Click
    document.querySelectorAll('.lang-option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = btn.dataset.lang;
        if (lang) this.setLanguage(lang);
      });
    });

    this.updateActiveLanguageUI(this.currentLang);
  }

  openDropdown() {
    const menu = document.getElementById('langDropdownMenu');
    const trigger = document.getElementById('langDropdownTrigger');
    if (menu) menu.classList.add('active');
    if (trigger) trigger.classList.add('active');
  }

  closeDropdown() {
    const menu = document.getElementById('langDropdownMenu');
    const trigger = document.getElementById('langDropdownTrigger');
    if (menu) menu.classList.remove('active');
    if (trigger) trigger.classList.remove('active');
  }

  updateActiveLanguageUI(lang) {
    // Update Trigger Active SVG Flag
    const currentFlagDisplay = document.getElementById('currentFlagDisplay');
    if (currentFlagDisplay && SVG_FLAGS[lang]) {
      currentFlagDisplay.innerHTML = SVG_FLAGS[lang];
    }

    // Update Dropdown Options Active State
    document.querySelectorAll('.lang-option-btn').forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (window.lucide) lucide.createIcons();
  }

  /* Vertical Headline Carousel Roller */
  initHeadlineRoller() {
    this.renderCurrentHeadline(false);

    if (this.rollerInterval) clearInterval(this.rollerInterval);

    // 4.2 seconds display time per phrase
    this.rollerInterval = setInterval(() => {
      this.advanceHeadline();
    }, 4200);
  }

  advanceHeadline() {
    const dict = SNAPFLOW_TRANSLATIONS[this.currentLang];
    if (!dict || !dict.hero_headlines) return;

    this.currentHeadlineIndex = (this.currentHeadlineIndex + 1) % dict.hero_headlines.length;
    this.renderCurrentHeadline(true);
  }

  renderCurrentHeadline(animate = true) {
    const el = document.getElementById('hubHeroTitle');
    const dict = SNAPFLOW_TRANSLATIONS[this.currentLang];
    if (!el || !dict || !dict.hero_headlines) return;

    const item = dict.hero_headlines[this.currentHeadlineIndex];
    const prefix = item.prefix ? item.prefix.trim() : '';
    const gradient = item.gradient ? item.gradient.trim() : '';
    const suffix = item.suffix ? item.suffix.trim() : '';

    let newHtml = '';
    if (prefix) newHtml += `${prefix} `;
    newHtml += `<span class="gradient-text">${gradient}</span>`;
    if (suffix) newHtml += ` ${suffix}`;

    if (animate && window.gsap) {
      gsap.to(el, {
        opacity: 0,
        y: -22,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          el.innerHTML = newHtml;
          gsap.fromTo(el, 
            { opacity: 0, y: 22 }, 
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
          );
        }
      });
    } else {
      el.innerHTML = newHtml;
      el.style.opacity = '1';
      el.style.transform = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.i18n = new I18nEngine();
});
