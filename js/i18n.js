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

    // Splash Screen
    splash_tagline: "Suíte Criativa de Alta Performance",

    // Rotating Hero Headlines (Frases Alternadas)
    hero_headlines: [
      { prefix: "O que você gostaria de ", gradient: "criar ou transformar?", suffix: "" },
      { prefix: "Edite, converta e otimize mídia com ", gradient: "velocidade máxima", suffix: "" },
      { prefix: "Comprima, converta e crie em ", gradient: "poucos cliques", suffix: "" },
      { prefix: "O fluxo definitivo para ", gradient: "designers e criadores", suffix: "" }
    ],

    // Search Typewriter Placeholders
    search_placeholders: [
      "Buscar ferramenta (ex: Compressor, WebP)...",
      "Experimente: Converter PNG em WebP...",
      "Experimente: Gerador de QR Code com Logo...",
      "Experimente: HD Upscaler Nitidez 4K...",
      "Experimente: Marca d'Água com Presets..."
    ],
    search_focused_placeholder: "Digite para pesquisar...",

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

    // Pricing & SaaS Plans Page
    pricing_title: "Escolha o plano ideal para o seu fluxo de trabalho",
    pricing_subtitle: "Processamento 100% privado no seu dispositivo. Sem limites ocultos.",
    pricing_monthly: "Mensal",
    pricing_annual: "Anual",
    pricing_save_badge: "Economize 20%",

    // Plan 1: Free
    plan_free_name: "Grátis",
    plan_free_period: "/ mês",
    plan_free_desc: "Para uso casual e edições rápidas no dia a dia.",
    plan_free_f1: "10 Processamentos por mês",
    plan_free_f2: "Ferramentas Básicas (Compressor, QR Code)",
    plan_free_f3: "Processamento 100% Local & Privado",
    plan_free_btn: "Plano Atual",

    // Plan 2: PRO
    plan_pro_badge: "Mais Popular",
    plan_pro_name: "Pro",
    plan_pro_period: "/ mês",
    plan_pro_desc: "Para designers, criadores de conteúdo e freelancers.",
    plan_pro_f1: "Processamento & ZIP Ilimitados",
    plan_pro_f2: "Todas as 16 Ferramentas Avançadas",
    plan_pro_f3: "Estúdio de Mockups 3D & Editor SVG",
    plan_pro_f4: "Exportação em Alta Definição 4K",
    plan_pro_f5: "Marcas d'Água & Presets Salvos",
    plan_pro_btn: "Assinar Plano Pro",

    // Plan 3: Agency
    plan_agency_name: "Agências",
    plan_agency_period: "/ mês",
    plan_agency_desc: "Para agências, times e empresas que buscam alta escala.",
    plan_agency_f1: "Tudo do Plano Pro para até 10 pessoas",
    plan_agency_f2: "Suporte Prioritário 24/7",
    plan_agency_f3: "Licença Comercial Ilimitada",
    plan_agency_btn: "Contatar Vendas",

    // Guarantee Card
    guarantee_title: "Garantia Incondicional de 7 Dias",
    guarantee_desc: "Experimente o SnapFlow PRO sem nenhum risco. Se você não amar a produtividade e a velocidade da plataforma nos primeiros 7 dias, devolvemos 100% do seu investimento sem perguntas.",

    // FAQ
    faq_title: "Perguntas Frequentes",
    faq_q1: "Como funciona a privacidade dos meus arquivos?",
    faq_a1: "Todo o processamento de imagens, vídeos e arquivos é feito 100% no seu próprio navegador via HTML5 Canvas. Suas fotos NUNCA são enviadas para nenhum servidor externo.",
    faq_q2: "O SnapFlow precisa de instalação?",
    faq_a2: "Não! O SnapFlow roda diretamente no seu navegador em qualquer computador ou dispositivo sem precisar baixar programas.",
    faq_q3: "Posso cancelar minha assinatura a qualquer momento?",
    faq_a3: "Com certeza. Você pode cancelar sua assinatura com 1 clique a qualquer momento sem taxas ou fidelidade.",
    faq_q4: "As ferramentas funcionam sem internet?",
    faq_a4: "Sim! Após carregar a página inicial, todas as 16 ferramentas funcionam perfeitamente mesmo se a sua conexão com a internet cair.",

    // Auth & Paywall Modals
    auth_title: "Entrar no SnapFlow",
    auth_desc: "Acesse sua conta para desbloquear o Plano Pro e ferramentas ilimitadas.",
    auth_google_btn: "Continuar com o Google",
    auth_or_email: "OU COM E-MAIL",
    auth_email_label: "Endereço de E-mail",
    auth_submit_btn: "Entrar / Registrar",

    paywall_title: "Você Atingiu seu Limite Grátis! 🛑",
    paywall_desc: "Você utilizou suas 10 edições gratuitas este mês. Assine o Plano PRO por apenas R$ 29/mês para continuar criando sem limites!",
    paywall_benefits_title: "Benefícios do Plano PRO:",
    paywall_b1: "Processamento & Lotes ZIP Ilimitados",
    paywall_b2: "Exportação em Qualidade Máxima (4K HD)",
    paywall_b3: "Marca d'Água com Logo & Presets Salvos",
    paywall_btn: "Assinar Plano PRO Agora",

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

    // Splash Screen
    splash_tagline: "High-Performance Creative Suite",

    // Rotating Hero Headlines (Alternating Phrases)
    hero_headlines: [
      { prefix: "What would you like to ", gradient: "create or transform?", suffix: "" },
      { prefix: "Edit, convert and optimize media at ", gradient: "maximum speed", suffix: "" },
      { prefix: "Compress, convert and create in ", gradient: "a few clicks", suffix: "" },
      { prefix: "The definitive workflow for ", gradient: "designers & creators", suffix: "" }
    ],

    // Search Typewriter Placeholders
    search_placeholders: [
      "Search tool (e.g. Compressor, WebP)...",
      "Try: Convert PNG to WebP in batch...",
      "Try: QR Code Generator with Logo...",
      "Try: 4K HD Upscaler & Sharpness...",
      "Try: Watermark with Saved Presets..."
    ],
    search_focused_placeholder: "Type to search tools...",

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

    // Pricing & SaaS Plans Page
    pricing_title: "Choose the perfect plan for your creative workflow",
    pricing_subtitle: "100% private processing on your device. Zero hidden limits.",
    pricing_monthly: "Monthly",
    pricing_annual: "Annual",
    pricing_save_badge: "Save 20%",

    // Plan 1: Free
    plan_free_name: "Free",
    plan_free_period: "/ month",
    plan_free_desc: "For casual use and quick daily edits.",
    plan_free_f1: "10 Free edits per month",
    plan_free_f2: "Basic Tools (Compressor, QR Code)",
    plan_free_f3: "100% Local & Private Processing",
    plan_free_btn: "Current Plan",

    // Plan 2: PRO
    plan_pro_badge: "Most Popular",
    plan_pro_name: "Pro",
    plan_pro_period: "/ month",
    plan_pro_desc: "For designers, content creators, and freelancers.",
    plan_pro_f1: "Unlimited Processing & ZIP Batches",
    plan_pro_f2: "All 16 Advanced Media Tools",
    plan_pro_f3: "3D Mockup Studio & SVG Editor",
    plan_pro_f4: "4K Ultra-HD Resolution Export",
    plan_pro_f5: "Watermarks & Saved Presets",
    plan_pro_btn: "Subscribe to Pro Plan",

    // Plan 3: Agency
    plan_agency_name: "Agencies",
    plan_agency_period: "/ month",
    plan_agency_desc: "For teams, studios, and high-volume businesses.",
    plan_agency_f1: "Everything in Pro for up to 10 members",
    plan_agency_f2: "24/7 Priority Support",
    plan_agency_f3: "Unlimited Commercial License",
    plan_agency_btn: "Contact Sales",

    // Guarantee Card
    guarantee_title: "7-Day 100% Money-Back Guarantee",
    guarantee_desc: "Try SnapFlow PRO risk-free. If you don't love the speed and productivity in your first 7 days, we will refund 100% of your investment with no questions asked.",

    // FAQ
    faq_title: "Frequently Asked Questions",
    faq_q1: "How does the privacy of my files work?",
    faq_a1: "All image, video, and file processing happens 100% inside your own browser via HTML5 Canvas. Your photos are NEVER uploaded to any external server.",
    faq_q2: "Does SnapFlow require any software installation?",
    faq_a2: "No! SnapFlow runs entirely in your web browser across any Mac, Windows, or mobile device without installs.",
    faq_q3: "Can I cancel my subscription at any time?",
    faq_a3: "Absolutely. You can cancel your subscription with 1 click at any time with no penalties or hidden fees.",
    faq_q4: "Do the tools work offline without internet?",
    faq_a4: "Yes! Once the home page is loaded, all 16 client-side tools continue working even if your internet connection drops.",

    // Auth & Paywall Modals
    auth_title: "Sign in to SnapFlow",
    auth_desc: "Access your account to unlock Pro features and unlimited tools.",
    auth_google_btn: "Continue with Google",
    auth_or_email: "OR WITH EMAIL",
    auth_email_label: "Email Address",
    auth_submit_btn: "Sign In / Register",

    paywall_title: "You've Reached Your Free Limit! 🛑",
    paywall_desc: "You used your 10 free edits this month. Upgrade to PRO to keep creating with unlimited power!",
    paywall_benefits_title: "PRO Plan Benefits:",
    paywall_b1: "Unlimited Processing & ZIP Batches",
    paywall_b2: "Maximum 4K Ultra-HD Quality Export",
    paywall_b3: "Custom Logo Watermark & Saved Presets",
    paywall_btn: "Upgrade to PRO Now",

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

    // Splash Screen
    splash_tagline: "Suite Creativa de Alto Rendimiento",

    // Rotating Hero Headlines (Frases Alternadas)
    hero_headlines: [
      { prefix: "¿Qué te gustaría ", gradient: "crear o transformar?", suffix: "" },
      { prefix: "Edita, convierte y optimiza medios a ", gradient: "máxima velocidad", suffix: "" },
      { prefix: "Comprime, convierte y crea en ", gradient: "pocos clics", suffix: "" },
      { prefix: "El fluxo definitivo para ", gradient: "diseñadores y creadores", suffix: "" }
    ],

    // Search Typewriter Placeholders
    search_placeholders: [
      "Buscar herramienta (ej: Compresor, WebP)...",
      "Prueba: Convertir PNG a WebP por lotes...",
      "Prueba: Generador de QR Code con Logo...",
      "Prueba: HD Upscaler y Nitidez 4K...",
      "Prueba: Marca de Agua con Ajustes..."
    ],
    search_focused_placeholder: "Escribe para buscar herramientas...",

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

    // Pricing & SaaS Plans Page
    pricing_title: "Elige el plan ideal para tu flujo de trabajo creativo",
    pricing_subtitle: "Procesamiento 100% privado en tu dispositivo. Sin límites ocultos.",
    pricing_monthly: "Mensual",
    pricing_annual: "Anual",
    pricing_save_badge: "Ahorra 20%",

    // Plan 1: Free
    plan_free_name: "Gratis",
    plan_free_period: "/ mes",
    plan_free_desc: "Para uso casual y ediciones rápidas del día a día.",
    plan_free_f1: "10 Procesamientos por mes",
    plan_free_f2: "Herramientas Básicas (Compresor, QR Code)",
    plan_free_f3: "Procesamiento 100% Local y Privado",
    plan_free_btn: "Plan Actual",

    // Plan 2: PRO
    plan_pro_badge: "Más Popular",
    plan_pro_name: "Pro",
    plan_pro_period: "/ mes",
    plan_pro_desc: "Para diseñadores, creadores de contenido y freelancers.",
    plan_pro_f1: "Procesamiento y Lotes ZIP Ilimitados",
    plan_pro_f2: "Las 16 Herramientas Avanzadas",
    plan_pro_f3: "Estudio de Mockups 3D y Editor SVG",
    plan_pro_f4: "Exportación en Alta Definición 4K",
    plan_pro_f5: "Marcas de Agua y Ajustes Guardados",
    plan_pro_btn: "Suscribirse al Plan Pro",

    // Plan 3: Agency
    plan_agency_name: "Agencias",
    plan_agency_period: "/ mes",
    plan_agency_desc: "Para agencias, equipos y empresas que buscan alta escala.",
    plan_agency_f1: "Todo lo de Pro para hasta 10 miembros",
    plan_agency_f2: "Soporte Prioritario 24/7",
    plan_agency_f3: "Licencia Comercial Ilimitada",
    plan_agency_btn: "Contactar Ventas",

    // Guarantee Card
    guarantee_title: "Garantía Incondicional de 7 Días",
    guarantee_desc: "Prueba SnapFlow PRO sin ningún riesgo. Si no te encanta la velocidad y productividad en los primeros 7 días, te devolvemos el 100% de tu dinero sin preguntas.",

    // FAQ
    faq_title: "Preguntas Frecuentes",
    faq_q1: "¿Cómo funciona la privacidad de mis archivos?",
    faq_a1: "Todo el procesamiento de imágenes, videos y archivos se realiza 100% en tu propio navegador mediante HTML5 Canvas. Tus fotos NUNCA se suben a ningún servidor externo.",
    faq_q2: "¿SnapFlow requiere instalación?",
    faq_a2: "¡No! SnapFlow se ejecuta directamente en tu navegador en cualquier computadora o dispositivo sin descargar programas.",
    faq_q3: "¿Puedo cancelar mi suscripción en cualquier momento?",
    faq_a3: "Por supuesto. Puedes cancelar tu suscripción con 1 clic en cualquier momento sin penalizaciones ni permanencia.",
    faq_q4: "¿Las herramientas funcionan sin internet?",
    faq_a4: "¡Sí! Una vez cargada la página inicial, las 16 herramientas continúan funcionando perfectamente incluso si se corta tu conexión a internet.",

    // Auth & Paywall Modals
    auth_title: "Ingresar a SnapFlow",
    auth_desc: "Accede a tu cuenta para desbloquear el Plan Pro y herramientas ilimitadas.",
    auth_google_btn: "Continuar con Google",
    auth_or_email: "O CON CORREO",
    auth_email_label: "Dirección de Correo",
    auth_submit_btn: "Ingresar / Registrarse",

    paywall_title: "¡Alcanzaste tu Límite Gratis! 🛑",
    paywall_desc: "Has utilizado tus 10 ediciones gratuitas este mes. ¡Suscríbete a PRO para seguir creando sin límites!",
    paywall_benefits_title: "Beneficios del Plan PRO:",
    paywall_b1: "Procesamiento y Lotes ZIP Ilimitados",
    paywall_b2: "Exportación en Calidad Máxima (4K HD)",
    paywall_b3: "Marca de Agua con Logo y Ajustes Guardados",
    paywall_btn: "Suscribirse a PRO Ahora",

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
    this.currentLang = this.getInitialLanguage();
    this.currentHeadlineIndex = 0;
    this.headlineTimer = null;
    this.init();
  }

  getInitialLanguage() {
    const saved = localStorage.getItem('snapflow_lang');
    if (saved && SNAPFLOW_TRANSLATIONS[saved]) return saved;

    const browserLang = (navigator.language || navigator.userLanguage || 'pt').toLowerCase();
    if (browserLang.startsWith('en')) return 'en';
    if (browserLang.startsWith('es')) return 'es';
    return 'pt';
  }

  init() {
    this.applyTranslations(this.currentLang);
    this.initDropdown();
    this.startHeadlineTicker();
  }

  setLanguage(lang) {
    if (!SNAPFLOW_TRANSLATIONS[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('snapflow_lang', lang);

    this.applyTranslations(lang);
    this.updateActiveLanguageUI(lang);
    this.closeDropdown();
    this.renderCurrentHeadline(false);

    // Notify listeners (e.g., search typewriter)
    window.dispatchEvent(new CustomEvent('snapflow:langchange', { detail: { lang } }));

    if (window.Utils && typeof Utils.showToast === 'function') {
      const msg = this.t('toast_lang_changed');
      if (msg) Utils.showToast(msg);
    }
  }

  t(key) {
    const dict = SNAPFLOW_TRANSLATIONS[this.currentLang] || SNAPFLOW_TRANSLATIONS['pt'];
    return dict[key] || '';
  }

  applyTranslations(lang) {
    const dict = SNAPFLOW_TRANSLATIONS[lang] || SNAPFLOW_TRANSLATIONS['pt'];
    if (!dict) return;

    // Apply data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
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
  }

  startHeadlineTicker() {
    this.renderCurrentHeadline(false);
    if (this.headlineTimer) clearInterval(this.headlineTimer);

    // 4.2 seconds interval for comfortable reading
    this.headlineTimer = setInterval(() => {
      const dict = SNAPFLOW_TRANSLATIONS[this.currentLang] || SNAPFLOW_TRANSLATIONS['pt'];
      const headlines = dict.hero_headlines || [];
      if (!headlines.length) return;

      this.currentHeadlineIndex = (this.currentHeadlineIndex + 1) % headlines.length;
      this.renderCurrentHeadline(true);
    }, 4200);
  }

  renderCurrentHeadline(animate = true) {
    const titleEl = document.getElementById('hubDynamicTitle');
    if (!titleEl) return;

    const dict = SNAPFLOW_TRANSLATIONS[this.currentLang] || SNAPFLOW_TRANSLATIONS['pt'];
    const headlines = dict.hero_headlines || [];
    if (!headlines.length) return;

    const currentItem = headlines[this.currentHeadlineIndex] || headlines[0];
    const prefix = currentItem.prefix || '';
    const gradient = currentItem.gradient || '';
    const suffix = currentItem.suffix || '';

    // Enforce explicit space before gradient
    const htmlContent = `${prefix}<span class="gradient-text">${gradient}</span>${suffix ? ' ' + suffix : ''}`;

    if (!animate || !window.gsap) {
      titleEl.innerHTML = htmlContent;
      return;
    }

    // Smooth Vertical GSAP Rolling Animation
    gsap.to(titleEl, {
      y: -18,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        titleEl.innerHTML = htmlContent;
        gsap.fromTo(titleEl, 
          { y: 22, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
        );
      }
    });
  }
}

// Global i18n instance
window.addEventListener('DOMContentLoaded', () => {
  window.i18nEngine = new I18nEngine();
});
